import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const registerSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  full_name: z.string().min(1, 'Full name is required').max(100, 'Full name must be less than 100 characters'),
  role: z.enum(['hotel_manager', 'front_desk', 'housekeeping', 'maintenance']),
});

export const createTaskSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title must be less than 200 characters'),
  description: z.string().max(1000, 'Description must be less than 1000 characters').optional(),
  category_id: z.string().uuid('Invalid category ID').optional(),
  assigned_to: z.string().uuid('Invalid employee ID').optional(),
  priority: z.enum(['low', 'medium', 'high', 'urgent']).default('medium'),
  deadline: z.string().optional(),
});

export const updateTaskSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title must be less than 200 characters').optional(),
  description: z.string().max(1000, 'Description must be less than 1000 characters').optional(),
  category_id: z.string().uuid('Invalid category ID').optional(),
  assigned_to: z.string().uuid('Invalid employee ID').optional(),
  priority: z.enum(['low', 'medium', 'high', 'urgent']).optional(),
  deadline: z.string().optional(),
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

export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
export type CreateTaskFormData = z.infer<typeof createTaskSchema>;
export type UpdateTaskFormData = z.infer<typeof updateTaskSchema>;
export type UpdateTaskStatusFormData = z.infer<typeof updateTaskStatusSchema>;
export type CompleteTaskFormData = z.infer<typeof completeTaskSchema>;
export type VerifyTaskFormData = z.infer<typeof verifyTaskSchema>;