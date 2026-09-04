import { supabase } from '../utils/supabase';
import { AppError } from '../middleware/error.middleware';

export class EmployeesService {
  async getEmployees(params: any) {
    const { page = 1, limit = 20, department_id, status, search, sort = 'created_at', order = 'desc' } = params;

    let query = supabase
      .from('employees')
      .select(`
        *,
        profiles (id, email, full_name, avatar_url, roles (name)),
        departments (id, name, description)
      `, { count: 'exact' });

    // Apply filters
    if (department_id) {
      query = query.eq('department_id', department_id);
    }
    if (status) {
      query = query.eq('status', status);
    }
    if (search) {
      query = query.or(`employee_number.ilike.%${search}%,profiles.full_name.ilike.%${search}%,profiles.email.ilike.%${search}%`);
    }

    // Apply sorting
    query = query.order(sort, { ascending: order === 'asc' });

    // Apply pagination
    const from = (page - 1) * limit;
    const to = from + limit - 1;
    query = query.range(from, to);

    const { data, error, count } = await query;

    if (error) {
      throw new AppError('Failed to fetch employees', 500);
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

  async getEmployeeById(id: string) {
    const { data, error } = await supabase
      .from('employees')
      .select(`
        *,
        profiles (id, email, full_name, avatar_url, roles (name)),
        departments (id, name, description)
      `)
      .eq('id', id)
      .single();

    if (error) {
      throw new AppError('Employee not found', 404);
    }

    return data;
  }

  async createEmployee(employeeData: any, createdBy: string) {
    const { email, password, full_name, role, department_id, employee_number, hire_date } = employeeData;

    // Note: In a real implementation, you would use Supabase Auth admin API
    // For now, we'll create the employee record assuming the auth user already exists
    // This is a simplified version for the initial implementation

    // Get role ID
    const { data: roleData, error: roleError } = await supabase
      .from('roles')
      .select('id')
      .eq('name', role)
      .single();

    if (roleError || !roleData) {
      throw new AppError('Invalid role specified', 400);
    }

    // Create employee record (assuming profile_id is provided)
    const { data: newEmployee, error: employeeError } = await supabase
      .from('employees')
      .insert({
        profile_id: employeeData.profile_id, // This should come from the request
        department_id,
        employee_number,
        hire_date,
        status: 'active',
      })
      .select(`
        *,
        profiles (id, email, full_name, avatar_url, roles (name)),
        departments (id, name, description)
      `)
      .single();

    if (employeeError) {
      throw new AppError('Failed to create employee record', 500);
    }

    return newEmployee;
  }

  async updateEmployee(id: string, employeeData: any) {
    const { data, error } = await supabase
      .from('employees')
      .update(employeeData)
      .eq('id', id)
      .select(`
        *,
        profiles (id, email, full_name, avatar_url, roles (name)),
        departments (id, name, description)
      `)
      .single();

    if (error) {
      throw new AppError('Failed to update employee', 500);
    }

    return data;
  }

  async deleteEmployee(id: string) {
    // Get employee profile ID
    const { data: employee } = await supabase
      .from('employees')
      .select('profile_id')
      .eq('id', id)
      .single();

    if (!employee) {
      throw new AppError('Employee not found', 404);
    }

    // Delete employee record
    const { error: employeeError } = await supabase
      .from('employees')
      .delete()
      .eq('id', id);

    if (employeeError) {
      throw new AppError('Failed to delete employee', 500);
    }

    return { message: 'Employee deleted successfully' };
  }
}

export default new EmployeesService();