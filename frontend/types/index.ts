export interface User {
  id: string;
  email: string;
  full_name?: string;
  role?: string;
  avatar_url?: string;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  category_id?: string;
  task_categories?: {
    id: string;
    name: string;
    description?: string;
  };
  assigned_to?: string;
  assigned_employee?: {
    id: string;
    employee_number: string;
    profile: {
      full_name: string;
    };
  };
  created_by: string;
  creator?: {
    id: string;
    full_name: string;
    email: string;
  };
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'pending' | 'in_progress' | 'completed' | 'verified' | 'overdue' | 'cancelled';
  deadline?: string;
  started_at?: string;
  completed_at?: string;
  verified_at?: string;
  verified_by?: string;
  completion_notes?: string;
  verification_notes?: string;
  created_at: string;
  updated_at: string;
}

export interface Employee {
  id: string;
  profile_id: string;
  department_id?: string;
  employee_number: string;
  hire_date: string;
  status: 'active' | 'inactive' | 'on_leave' | 'terminated';
  profiles?: {
    id: string;
    email: string;
    full_name: string;
    avatar_url?: string;
    roles?: {
      name: string;
    };
  };
  departments?: {
    id: string;
    name: string;
    description?: string;
  };
}

export interface Department {
  id: string;
  name: string;
  description?: string;
}

export interface TaskCategory {
  id: string;
  name: string;
  description?: string;
  department_id?: string;
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
  created_at: string;
  updated_at: string;
}

export interface GuestFeedback {
  id: string;
  task_id?: string;
  guest_name: string;
  rating: number;
  feedback?: string;
  category?: 'service' | 'cleanliness' | 'amenities' | 'staff' | 'other';
  submitted_at: string;
  reviewed: boolean;
  reviewed_by?: string;
  reviewed_at?: string;
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
  created_at: string;
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