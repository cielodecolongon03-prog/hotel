# API Documentation

## Overview

The Hotel Task Management and Employee Rating System exposes a REST API built with Express.js and TypeScript. All API endpoints require authentication except where explicitly noted.

## Base URL

**Development**: `http://localhost:5000/api`  
**Production**: `https://your-backend.onrender.com/api`

## Authentication

### Authentication Flow

1. Client authenticates with Supabase Auth (direct)
2. Supabase returns JWT token
3. Client includes JWT in Authorization header
4. Backend validates JWT and extracts user info
5. Backend checks role-based permissions

### Headers

```http
Authorization: Bearer <supabase-jwt-token>
Content-Type: application/json
```

### Response Format

**Success Response**
```json
{
  "success": true,
  "data": { ... },
  "message": "Operation successful"
}
```

**Error Response**
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error message",
    "details": { ... }
  }
}
```

## API Endpoints

### Authentication Endpoints

#### POST /auth/register
Register a new user account.

**Request Body**
```json
{
  "email": "user@example.com",
  "password": "securePassword123",
  "full_name": "John Doe",
  "role": "front_desk"
}
```

**Response**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "full_name": "John Doe"
    },
    "session": {
      "access_token": "jwt-token",
      "refresh_token": "refresh-token"
    }
  }
}
```

#### POST /auth/login
Authenticate with existing credentials.

**Request Body**
```json
{
  "email": "user@example.com",
  "password": "securePassword123"
}
```

**Response**
```json
{
  "success": true,
  "data": {
    "user": { ... },
    "session": { ... }
  }
}
```

#### POST /auth/logout
End the current session.

**Headers**
```
Authorization: Bearer <token>
```

**Response**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

#### GET /auth/me
Get current user information.

**Headers**
```
Authorization: Bearer <token>
```

**Response**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "email": "user@example.com",
    "full_name": "John Doe",
    "role": "front_desk",
    "employee": {
      "id": "uuid",
      "employee_number": "EMP001",
      "department": "Front Desk"
    }
  }
}
```

### Task Endpoints

#### GET /tasks
Get tasks with filtering and pagination.

**Headers**
```
Authorization: Bearer <token>
```

**Query Parameters**
```
?page=1
&limit=20
&status=pending
&priority=high
&assigned_to=uuid
&category=uuid
&search=keyword
&sort=created_at
&order=desc
```

**Response**
```json
{
  "success": true,
  "data": {
    "tasks": [
      {
        "id": "uuid",
        "title": "Clean Room 201",
        "description": "Complete cleaning of room 201",
        "category": {
          "id": "uuid",
          "name": "Room Cleaning"
        },
        "assigned_to": {
          "id": "uuid",
          "name": "Jane Smith",
          "employee_number": "EMP002"
        },
        "created_by": {
          "id": "uuid",
          "name": "John Doe"
        },
        "priority": "high",
        "status": "pending",
        "deadline": "2024-01-15T14:00:00Z",
        "created_at": "2024-01-14T10:00:00Z",
        "updated_at": "2024-01-14T10:00:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 45,
      "totalPages": 3
    }
  }
}
```

#### GET /tasks/:id
Get a specific task by ID.

**Headers**
```
Authorization: Bearer <token>
```

**Response**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "title": "Clean Room 201",
    "description": "Complete cleaning of room 201",
    "category": { ... },
    "assigned_to": { ... },
    "created_by": { ... },
    "priority": "high",
    "status": "in_progress",
    "deadline": "2024-01-15T14:00:00Z",
    "started_at": "2024-01-14T11:00:00Z",
    "completed_at": null,
    "verified_at": null,
    "completion_notes": null,
    "verification_notes": null,
    "created_at": "2024-01-14T10:00:00Z",
    "updated_at": "2024-01-14T11:00:00Z",
    "history": [
      {
        "status": "pending",
        "changed_by": "John Doe",
        "changed_at": "2024-01-14T10:00:00Z",
        "notes": "Task created"
      },
      {
        "status": "in_progress",
        "changed_by": "Jane Smith",
        "changed_at": "2024-01-14T11:00:00Z",
        "notes": "Started cleaning"
      }
    ]
  }
}
```

#### POST /tasks
Create a new task (Managers only).

**Headers**
```
Authorization: Bearer <token>
```

**Request Body**
```json
{
  "title": "Clean Room 201",
  "description": "Complete cleaning of room 201",
  "category_id": "uuid",
  "assigned_to": "uuid",
  "priority": "high",
  "deadline": "2024-01-15T14:00:00Z"
}
```

**Response**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "title": "Clean Room 201",
    "status": "pending",
    "created_at": "2024-01-14T10:00:00Z"
  }
}
```

#### PUT /tasks/:id
Update a task.

**Headers**
```
Authorization: Bearer <token>
```

**Request Body**
```json
{
  "title": "Clean Room 201 - Priority",
  "description": "Complete cleaning of room 201 with extra attention",
  "priority": "urgent",
  "deadline": "2024-01-15T12:00:00Z"
}
```

**Response**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "title": "Clean Room 201 - Priority",
    "updated_at": "2024-01-14T10:30:00Z"
  }
}
```

#### PATCH /tasks/:id/status
Update task status.

**Headers**
```
Authorization: Bearer <token>
```

**Request Body**
```json
{
  "status": "in_progress",
  "notes": "Started working on the task"
}
```

**Response**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "status": "in_progress",
    "started_at": "2024-01-14T11:00:00Z"
  }
}
```

#### POST /tasks/:id/complete
Mark task as completed (Assigned employee only).

**Headers**
```
Authorization: Bearer <token>
```

**Request Body**
```json
{
  "completion_notes": "Room cleaned thoroughly, all amenities restocked"
}
```

**Response**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "status": "completed",
    "completed_at": "2024-01-14T15:00:00Z"
  }
}
```

#### POST /tasks/:id/verify
Verify a completed task (Managers only).

**Headers**
```
Authorization: Bearer <token>
```

**Request Body**
```json
{
  "result": "approved",
  "verification_notes": "Excellent work, room is spotless"
}
```

**Response**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "status": "verified",
    "verified_at": "2024-01-14T16:00:00Z",
    "verified_by": { ... }
  }
}
```

#### DELETE /tasks/:id
Delete a task (Managers only).

**Headers**
```
Authorization: Bearer <token>
```

**Response**
```json
{
  "success": true,
  "message": "Task deleted successfully"
}
```

### Employee Endpoints

#### GET /employees
Get employees with filtering.

**Headers**
```
Authorization: Bearer <token>
```

**Query Parameters**
```
?department=uuid
&status=active
&search=keyword
&page=1
&limit=20
```

**Response**
```json
{
  "success": true,
  "data": {
    "employees": [
      {
        "id": "uuid",
        "profile_id": "uuid",
        "employee_number": "EMP001",
        "full_name": "John Doe",
        "email": "john@example.com",
        "department": {
          "id": "uuid",
          "name": "Front Desk"
        },
        "role": "front_desk",
        "status": "active",
        "hire_date": "2023-01-15",
        "task_stats": {
          "total": 25,
          "completed": 20,
          "in_progress": 3,
          "overdue": 2
        },
        "average_rating": 4.5
      }
    ],
    "pagination": { ... }
  }
}
```

#### GET /employees/:id
Get a specific employee.

**Headers**
```
Authorization: Bearer <token>
```

**Response**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "employee_number": "EMP001",
    "full_name": "John Doe",
    "email": "john@example.com",
    "department": { ... },
    "role": "front_desk",
    "status": "active",
    "hire_date": "2023-01-15",
    "avatar_url": "https://...",
    "tasks": [ ... ],
    "ratings": [ ... ],
    "activity_log": [ ... ]
  }
}
```

#### POST /employees
Create a new employee (Managers only).

**Headers**
```
Authorization: Bearer <token>
```

**Request Body**
```json
{
  "email": "new.employee@example.com",
  "password": "securePassword123",
  "full_name": "Jane Smith",
  "role": "housekeeping",
  "department_id": "uuid",
  "employee_number": "EMP005",
  "hire_date": "2024-01-15"
}
```

**Response**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "employee_number": "EMP005",
    "profile": { ... }
  }
}
```

#### PUT /employees/:id
Update employee information (Managers only).

**Headers**
```
Authorization: Bearer <token>
```

**Request Body**
```json
{
  "full_name": "Jane Smith",
  "department_id": "uuid",
  "status": "active"
}
```

**Response**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "updated_at": "2024-01-14T10:00:00Z"
  }
}
```

### Rating Endpoints

#### GET /ratings
Get employee ratings.

**Headers**
```
Authorization: Bearer <token>
```

**Query Parameters**
```
?employee_id=uuid
&period=2024-01
&page=1
&limit=20
```

**Response**
```json
{
  "success": true,
  "data": {
    "ratings": [
      {
        "id": "uuid",
        "employee": {
          "id": "uuid",
          "name": "John Doe",
          "employee_number": "EMP001"
        },
        "rated_by": {
          "id": "uuid",
          "name": "Manager Jane"
        },
        "rating_period": "2024-01",
        "punctuality": 5,
        "task_completion": 4,
        "quality_of_work": 5,
        "customer_feedback": 4,
        "overall_rating": 4.5,
        "notes": "Excellent performance this month",
        "created_at": "2024-01-31T16:00:00Z"
      }
    ],
    "pagination": { ... }
  }
}
```

#### POST /ratings
Create an employee rating (Managers only).

**Headers**
```
Authorization: Bearer <token>
```

**Request Body**
```json
{
  "employee_id": "uuid",
  "rating_period": "2024-01",
  "punctuality": 5,
  "task_completion": 4,
  "quality_of_work": 5,
  "customer_feedback": 4,
  "notes": "Consistently excellent work"
}
```

**Response**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "overall_rating": 4.5,
    "created_at": "2024-01-31T16:00:00Z"
  }
}
```

#### PUT /ratings/:id
Update a rating (Managers only).

**Headers**
```
Authorization: Bearer <token>
```

**Request Body**
```json
{
  "punctuality": 5,
  "task_completion": 5,
  "quality_of_work": 5,
  "customer_feedback": 5,
  "notes": "Outstanding performance improved"
}
```

**Response**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "overall_rating": 5.0,
    "updated_at": "2024-01-31T17:00:00Z"
  }
}
```

### Feedback Endpoints

#### GET /feedback
Get guest feedback.

**Headers**
```
Authorization: Bearer <token>
```

**Query Parameters**
```
?reviewed=false
&rating=5
&category=service
&page=1
&limit=20
```

**Response**
```json
{
  "success": true,
  "data": {
    "feedback": [
      {
        "id": "uuid",
        "task": {
          "id": "uuid",
          "title": "Room Service"
        },
        "guest_name": "Guest John",
        "rating": 5,
        "feedback": "Excellent service, very prompt",
        "category": "service",
        "submitted_at": "2024-01-14T12:00:00Z",
        "reviewed": false,
        "reviewed_by": null,
        "reviewed_at": null
      }
    ],
    "pagination": { ... }
  }
}
```

#### POST /feedback
Submit guest feedback.

**Request Body**
```json
{
  "task_id": "uuid",
  "guest_name": "Guest John",
  "rating": 5,
  "feedback": "Excellent service, very prompt",
  "category": "service"
}
```

**Response**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "submitted_at": "2024-01-14T12:00:00Z"
  }
}
```

#### PUT /feedback/:id/review
Review feedback (Managers only).

**Headers**
```
Authorization: Bearer <token>
```

**Request Body**
```json
{
  "reviewed": true
}
```

**Response**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "reviewed": true,
    "reviewed_at": "2024-01-14T13:00:00Z"
  }
}
```

### Report Endpoints

#### GET /reports/tasks
Get task reports.

**Headers**
```
Authorization: Bearer <token>
```

**Query Parameters**
```
?start_date=2024-01-01
&end_date=2024-01-31
&department=uuid
&employee_id=uuid
```

**Response**
```json
{
  "success": true,
  "data": {
    "summary": {
      "total_tasks": 150,
      "completed_tasks": 120,
      "pending_tasks": 20,
      "in_progress_tasks": 8,
      "overdue_tasks": 2,
      "completion_rate": 80
    },
    "by_department": [
      {
        "department": "Front Desk",
        "total_tasks": 50,
        "completed_tasks": 45,
        "completion_rate": 90
      }
    ],
    "by_employee": [
      {
        "employee": "John Doe",
        "total_tasks": 25,
        "completed_tasks": 23,
        "completion_rate": 92
      }
    ],
    "trends": {
      "daily": [ ... ],
      "weekly": [ ... ]
    }
  }
}
```

#### GET /reports/employees
Get employee performance reports.

**Headers**
```
Authorization: Bearer <token>
```

**Query Parameters**
```
?start_date=2024-01-01
&end_date=2024-01-31
&department=uuid
```

**Response**
```json
{
  "success": true,
  "data": {
    "top_performers": [
      {
        "employee": "John Doe",
        "completed_tasks": 45,
        "average_rating": 4.8,
        "on_time_rate": 95
      }
    ],
    "department_summary": [
      {
        "department": "Front Desk",
        "average_rating": 4.5,
        "total_tasks": 120,
        "completion_rate": 85
      }
    ],
    "performance_trends": [ ... ]
  }
}
```

#### GET /reports/feedback
Get guest feedback reports.

**Headers**
```
Authorization: Bearer <token>
```

**Query Parameters**
```
?start_date=2024-01-01
&end_date=2024-01-31
&category=service
```

**Response**
```json
{
  "success": true,
  "data": {
    "summary": {
      "total_feedback": 200,
      "average_rating": 4.5,
      "positive_feedback": 180,
      "negative_feedback": 20
    },
    "by_category": [
      {
        "category": "service",
        "count": 80,
        "average_rating": 4.7
      }
    ],
    "trends": {
      "daily": [ ... ],
      "weekly": [ ... ]
    }
  }
}
```

### Activity Log Endpoints

#### GET /activity-logs
Get activity logs.

**Headers**
```
Authorization: Bearer <token>
```

**Query Parameters**
```
?user_id=uuid
?action=task_created
&entity_type=task
&start_date=2024-01-01
&end_date=2024-01-31
&page=1
&limit=50
```

**Response**
```json
{
  "success": true,
  "data": {
    "logs": [
      {
        "id": "uuid",
        "user": {
          "id": "uuid",
          "name": "John Doe"
        },
        "action": "task_created",
        "entity_type": "task",
        "entity_id": "uuid",
        "details": {
          "task_title": "Clean Room 201",
          "assigned_to": "Jane Smith"
        },
        "ip_address": "192.168.1.1",
        "user_agent": "Mozilla/5.0...",
        "created_at": "2024-01-14T10:00:00Z"
      }
    ],
    "pagination": { ... }
  }
}
```

### Department Endpoints

#### GET /departments
Get all departments.

**Headers**
```
Authorization: Bearer <token>
```

**Response**
```json
{
  "success": true,
  "data": {
    "departments": [
      {
        "id": "uuid",
        "name": "Front Desk",
        "description": "Guest check-in, check-out, and concierge services",
        "manager": {
          "id": "uuid",
          "name": "John Doe"
        },
        "employee_count": 8
      }
    ]
  }
}
```

### Category Endpoints

#### GET /categories
Get all task categories.

**Headers**
```
Authorization: Bearer <token>
```

**Query Parameters**
```
?department=uuid
```

**Response**
```json
{
  "success": true,
  "data": {
    "categories": [
      {
        "id": "uuid",
        "name": "Room Cleaning",
        "description": "Guest room cleaning and preparation",
        "department": {
          "id": "uuid",
          "name": "Housekeeping"
        }
      }
    ]
  }
}
```

## Error Codes

| Code | Description | HTTP Status |
|------|-------------|-------------|
| AUTH_REQUIRED | Authentication required | 401 |
| INVALID_TOKEN | Invalid or expired token | 401 |
| INSUFFICIENT_PERMISSIONS | User lacks required permissions | 403 |
| RESOURCE_NOT_FOUND | Requested resource not found | 404 |
| VALIDATION_ERROR | Request validation failed | 400 |
| DUPLICATE_RESOURCE | Resource already exists | 409 |
| INTERNAL_ERROR | Internal server error | 500 |
| SERVICE_UNAVAILABLE | Service temporarily unavailable | 503 |

## Rate Limiting

- **Default**: 100 requests per minute per user
- **Burst**: 200 requests per minute per user
- **Headers**: Rate limit info returned in response headers

```http
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1642234567
```

## Pagination

All list endpoints support pagination.

**Query Parameters**
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 20, max: 100)

**Response Format**
```json
{
  "data": [ ... ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 45,
    "totalPages": 3
  }
}
```

## Filtering and Sorting

### Filtering
Most list endpoints support filtering via query parameters:
- `status`: Filter by status
- `priority`: Filter by priority
- `department_id`: Filter by department
- `assigned_to`: Filter by assigned employee
- `search`: Full-text search

### Sorting
Use `sort` and `order` parameters:
- `sort`: Field to sort by
- `order`: `asc` or `desc` (default: `desc`)

## Webhooks

The system supports webhooks for real-time notifications.

### Supported Events
- `task.created`
- `task.updated`
- `task.completed`
- `task.verified`
- `employee.created`
- `rating.created`
- `feedback.submitted`

### Webhook Configuration

Contact the development team to configure webhook endpoints.

## Versioning

The API is versioned using the URL path:
- Current version: `/api/v1`
- Future versions: `/api/v2`

## SDKs

Official SDKs are available for:
- JavaScript/TypeScript
- (Future) Python
- (Future) Mobile SDKs

## Support

For API support or questions, contact the development team or refer to the main documentation.
