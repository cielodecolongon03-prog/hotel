import { z } from 'zod';

export const createEmployeeSchema = z.object({
  profile_id: z.string().uuid('Invalid profile ID'),
  department_id: z.string().uuid('Invalid department ID').optional(),
  employee_number: z.string().min(1, 'Employee number is required').max(20, 'Employee number must be less than 20 characters'),
  hire_date: z.coerce.date('Invalid hire date'),
});

export const updateEmployeeSchema = z.object({
  department_id: z.string().uuid('Invalid department ID').optional(),
  status: z.enum(['active', 'inactive', 'on_leave', 'terminated']).optional(),
});

export const employeeQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
  department_id: z.string().uuid().optional(),
  status: z.enum(['active', 'inactive', 'on_leave', 'terminated']).optional(),
  search: z.string().max(100).optional(),
  sort: z.string().default('created_at'),
  order: z.enum(['asc', 'desc']).default('desc'),
});