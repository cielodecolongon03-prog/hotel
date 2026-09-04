import { supabase } from '../utils/supabase';
import { Task, PaginatedResponse } from '../types';
import { AppError } from '../middleware/error.middleware';

export class TasksService {
  async getTasks(params: any) {
    const { page = 1, limit = 20, status, priority, assigned_to, category_id, search, sort = 'created_at', order = 'desc' } = params;

    let query = supabase
      .from('tasks')
      .select(`
        *,
        task_categories (id, name, description),
        assigned_employee:employees!tasks_assigned_to_fkey (
          id,
          employee_number,
          profile:profiles (full_name)
        ),
        creator:profiles!tasks_created_by_fkey (
          id,
          full_name,
          email
        )
      `, { count: 'exact' });

    // Apply filters
    if (status) {
      query = query.eq('status', status);
    }
    if (priority) {
      query = query.eq('priority', priority);
    }
    if (assigned_to) {
      query = query.eq('assigned_to', assigned_to);
    }
    if (category_id) {
      query = query.eq('category_id', category_id);
    }
    if (search) {
      query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%`);
    }

    // Apply sorting
    query = query.order(sort, { ascending: order === 'asc' });

    // Apply pagination
    const from = (page - 1) * limit;
    const to = from + limit - 1;
    query = query.range(from, to);

    const { data, error, count } = await query;

    if (error) {
      throw new AppError('Failed to fetch tasks', 500);
    }

    const total = count || 0;
    const totalPages = Math.ceil(total / limit);

    return {
      items: data || [],
      pagination: {
        page,
        limit,
        total,
        totalPages,
      },
    };
  }

  async getTaskById(id: string) {
    const { data, error } = await supabase
      .from('tasks')
      .select(`
        *,
        task_categories (*),
        employees!tasks_assigned_to_fkey (
          id,
          employee_number,
          profiles (full_name)
        ),
        profiles!tasks_created_by_fkey (
          id,
          full_name,
          email
        ),
        task_status_history (
          *,
          profiles (full_name)
        ),
        task_verifications (
          *,
          profiles (full_name)
        )
      `)
      .eq('id', id)
      .single();

    if (error) {
      throw new AppError('Task not found', 404);
    }

    return data;
  }

  async createTask(taskData: any, createdBy: string) {
    const { data, error } = await supabase
      .from('tasks')
      .insert({
        ...taskData,
        created_by: createdBy,
      })
      .select()
      .single();

    if (error) {
      throw new AppError('Failed to create task', 500);
    }

    // Create initial status history
    await supabase.from('task_status_history').insert({
      task_id: data.id,
      status: 'pending',
      changed_by: createdBy,
      notes: 'Task created',
    });

    return data;
  }

  async updateTask(id: string, taskData: any) {
    const { data, error } = await supabase
      .from('tasks')
      .update(taskData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new AppError('Failed to update task', 500);
    }

    return data;
  }

  async updateTaskStatus(id: string, status: string, changedBy: string, notes?: string) {
    const { data, error } = await supabase
      .from('tasks')
      .update({ status })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new AppError('Failed to update task status', 500);
    }

    // Log status change
    await supabase.from('task_status_history').insert({
      task_id: id,
      status,
      changed_by: changedBy,
      notes: notes || `Status changed to ${status}`,
    });

    return data;
  }

  async completeTask(id: string, completionNotes: string, completedBy: string) {
    const { data, error } = await supabase
      .from('tasks')
      .update({
        status: 'completed',
        completion_notes: completionNotes,
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new AppError('Failed to complete task', 500);
    }

    // Log status change
    await supabase.from('task_status_history').insert({
      task_id: id,
      status: 'completed',
      changed_by: completedBy,
      notes: completionNotes || 'Task marked as completed',
    });

    return data;
  }

  async verifyTask(id: string, result: string, verificationNotes: string, verifiedBy: string) {
    const { data, error } = await supabase
      .from('tasks')
      .update({
        status: result === 'approved' ? 'verified' : 'in_progress',
        verification_notes: verificationNotes,
        verified_by: verifiedBy,
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new AppError('Failed to verify task', 500);
    }

    // Create verification record
    await supabase.from('task_verifications').insert({
      task_id: id,
      verified_by: verifiedBy,
      notes: verificationNotes,
      result,
    });

    // Log status change
    await supabase.from('task_status_history').insert({
      task_id: id,
      status: result === 'approved' ? 'verified' : 'in_progress',
      changed_by: verifiedBy,
      notes: `Task verification: ${result}`,
    });

    return data;
  }

  async deleteTask(id: string) {
    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', id);

    if (error) {
      throw new AppError('Failed to delete task', 500);
    }

    return { message: 'Task deleted successfully' };
  }
}

export default new TasksService();