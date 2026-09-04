import { z } from 'zod';

export const createTaskSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title must be less than 200 characters'),
  description: z.string().max(1000, 'Description must be less than 1000 characters').optional(),
  category_id: z.string().uuid('Invalid category ID').optional(),
  assigned_to: z.string().uuid('Invalid employee ID').optional(),
  priority: z.enum(['low', 'medium', 'high', 'urgent']).default('medium'),
  deadline: z.coerce.date().optional(),
});

export const updateTaskSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title must be less than 200 characters').optional(),
  description: z.string().max(1000, 'Description must be less than 1000 characters').optional(),
  category_id: z.string().uuid('Invalid category ID').optional(),
  assigned_to: z.string().uuid('Invalid employee ID').optional(),
  priority: z.enum(['low', 'medium', 'high', 'urgent']).optional(),
  deadline: z.coerce.date().optional(),
});

export const updateTaskStatusSchema = z.object({
  status: z.enum(['pending', 'in_progress', 'completed', 'cancelled']),
  notes: z.string().max(500, 'Notes must be less than 500 characters').optional(),
});

export const completeTaskSchema = z.object({
  completion_notes: z.string().max(1000, 'Completion notes must be less than 1000 characters'),
});

export const verifyTaskSchema = z.object({
  result: z.enum(['approved', 'rejected', 'needs_revision']),
  verification_notes: z.string().max(1000, 'Verification notes must be less than 1000 characters'),
});

export const taskQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
  status: z.enum(['pending', 'in_progress', 'completed', 'verified', 'overdue', 'cancelled']).optional(),
  priority: z.enum(['low', 'medium', 'high', 'urgent']).optional(),
  assigned_to: z.string().uuid().optional(),
  category_id: z.string().uuid().optional(),
  search: z.string().max(100).optional(),
  sort: z.string().default('created_at'),
  order: z.enum(['asc', 'desc']).default('desc'),
});