import { Request } from 'express';

export interface User {
  id: string;
  email: string;
  full_name?: string;
  role_id?: string;
  role?: string;
  avatar_url?: string;
}

export interface Employee {
  id: string;
  profile_id: string;
  department_id?: string;
  employee_number: string;
  hire_date: Date;
  status: 'active' | 'inactive' | 'on_leave' | 'terminated';
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  category_id?: string;
  assigned_to?: string;
  created_by: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'pending' | 'in_progress' | 'completed' | 'verified' | 'overdue' | 'cancelled';
  deadline?: Date;
  started_at?: Date;
  completed_at?: Date;
  verified_at?: Date;
  verified_by?: string;
  completion_notes?: string;
  verification_notes?: string;
  created_at: Date;
  updated_at: Date;
}

export interface EmployeeRating {
  id: string;
  employee_id: string;
  rated_by: string;
  rating_period: string;
  punctuality?: number;
  task_completion?: number;
  quality_of_work?: number;
  customer_feedback?: number;
  overall_rating?: number;
  notes?: string;
  created_at: Date;
  updated_at: Date;
}

export interface GuestFeedback {
  id: string;
  task_id?: string;
  guest_name: string;
  rating: number;
  feedback?: string;
  category?: 'service' | 'cleanliness' | 'amenities' | 'staff' | 'other';
  submitted_at: Date;
  reviewed: boolean;
  reviewed_by?: string;
  reviewed_at?: Date;
}

export interface ActivityLog {
  id: string;
  user_id?: string;
  action: string;
  entity_type: string;
  entity_id?: string;
  details: Record<string, any>;
  ip_address?: string;
  user_agent?: string;
  created_at: Date;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  sort?: string;
  order?: 'asc' | 'desc';
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
}

export interface PaginatedResponse<T> {
  items: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface AuthRequest extends Request {
  user?: User;
  // Ensure Express Request properties are available
  query: any;
  params: any;
  body: any;
  headers: any;
}