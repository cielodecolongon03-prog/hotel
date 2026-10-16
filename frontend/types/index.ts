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

export type RateType = 'daily' | 'hourly';

export interface RoomClassification {
  id: string;
  name: string;
  code: string;
  tagline: string;
  description: string;
  dailyRate: number; // in USD
  hourlyRate: number; // in USD
  minHours: number;
  capacity: number;
  bedType: string;
  sizeSqM: number;
  floorLevel: string;
  amenities: string[];
  imageUrl: string;
  galleryUrls?: string[];
  badge?: string;
  totalRooms: number;
}

export type RoomStatus = 'vacant' | 'occupied' | 'cleaning' | 'maintenance' | 'reserved';

export interface Room {
  id: string;
  roomNumber: string;
  classificationId: string;
  classificationName: string;
  floor: number;
  status: RoomStatus;
  currentGuest?: {
    name: string;
    bookingId: string;
    rateType: RateType;
    checkIn: string;
    expectedCheckOut: string;
    phone?: string;
    assignedStaff?: AssignedStaff;
  };
  cleaningStatus?: 'clean' | 'needs_cleaning' | 'in_progress';
  maintenanceNotes?: string;
}

export interface AssignedStaff {
  id: string;
  name: string;
  role: string;
  phone?: string;
  badgeNumber?: string;
  avatar?: string;
  contact?: string;
  department?: string;
}

export interface LateArrivalInfo {
  originalCheckInTime: string; // e.g. "13:00" (1:00 PM)
  actualArrivalTime?: string; // e.g. "19:00" (7:00 PM)
  isLateArrival: boolean;
  gracePeriodHours?: number; // e.g. 6
  status: 'guaranteed' | 'reallocated' | 'standard';
  reallocatedFromRoom?: string; // e.g. "101"
  reallocationReason?: string;
  evidenceHash?: string;
}

export interface RoomRecommendation {
  room: Room;
  classification: RoomClassification;
  matchScore: number;
  isUpgrade: boolean;
  reason: string;
}

export type BookingStatus = 'confirmed' | 'checked_in' | 'checked_out' | 'cancelled';
export type PaymentStatus = 'paid' | 'pending' | 'partially_paid' | 'refunded';
export type PaymentMethod =
  | 'gcash'
  | 'maya'
  | 'grabpay'
  | 'bdo'
  | 'bpi'
  | 'unionbank'
  | 'credit_card'
  | 'debit_card'
  | 'paypal'
  | 'cash'
  | 'apple_pay'
  | 'google_pay';

export interface ConciergeAddOn {
  id: string;
  name: string;
  category: 'transfer' | 'dining' | 'wellness' | 'convenience';
  pricePHP: number;
  description: string;
  iconName: string;
}

export interface Booking {
  id: string;
  referenceCode: string;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  roomNumber: string;
  classificationId: string;
  classificationName: string;
  rateType: RateType;
  duration: number; // days or hours
  checkInDate: string; // YYYY-MM-DD
  checkInTime: string; // HH:mm
  checkOutDate: string;
  checkOutTime: string;
  numberOfGuests: number;
  baseAmount: number;
  taxAmount: number; // 12% VAT
  serviceCharge: number; // 10% Luxury Service Charge
  addOnsAmount?: number;
  addOns?: { id: string; name: string; price: number }[];
  totalAmount: number;
  specialRequests?: string;
  status: BookingStatus;
  paymentStatus: PaymentStatus;
  paymentId?: string;
  paymentMethod?: PaymentMethod;
  cardLast4?: string;
  assignedStaff?: AssignedStaff;
  lateArrivalInfo?: LateArrivalInfo;
  qrVerificationCode?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PaymentTransaction {
  id: string;
  receiptNumber: string;
  bookingId: string;
  bookingRef: string;
  guestName: string;
  guestEmail: string;
  amount: number;
  currency: 'USD' | 'PHP';
  paymentMethod: PaymentMethod;
  cardBrand?: string;
  cardLast4?: string;
  status: 'completed' | 'pending' | 'failed';
  authCode: string;
  transactionDate: string;
  breakdown: {
    roomSubtotal: number;
    taxes: number;
    serviceFee: number;
    securityDeposit?: number;
    total: number;
  };
}