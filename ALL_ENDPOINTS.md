# All API Endpoints - EasySchool Management System

**Base URL**: `http://localhost:3000/api`  
**Health Check**: `http://localhost:3000/health` (no `/api` prefix)

All endpoints except `/health` and `/auth/login`, `/auth/register`, `/auth/refresh` require JWT authentication via `Authorization: Bearer <token>` header.

---

## 🔐 Authentication Endpoints (`/api/auth`)

### Public Endpoints (No Auth Required)

| Method | Endpoint | Description | Request Body |
|--------|----------|-------------|--------------|
| POST | `/api/auth/login` | User login | `{ email: string, password: string }` |
| POST | `/api/auth/register` | User registration | `{ email, password, firstName, lastName, role, schoolId? }` |
| POST | `/api/auth/refresh` | Refresh access token | `{ refreshToken: string }` |

### Protected Endpoints (Auth Required)

| Method | Endpoint | Description | Required Permissions |
|--------|----------|-------------|---------------------|
| GET | `/api/auth/profile` | Get current user profile | None (any authenticated user) |
| GET | `/api/auth/users/:id` | Get user by ID | None (any authenticated user) |

---

## 🏫 School Endpoints (`/api/schools`)

All endpoints require: `JwtAuthGuard` + `RbacGuard`

| Method | Endpoint | Description | Required Roles | Required Permissions |
|--------|----------|-------------|----------------|---------------------|
| GET | `/api/schools` | Get all schools (paginated) | `super_admin` | `MANAGE_ALL_SCHOOLS` |
| GET | `/api/schools/:id` | Get school by ID | Any authenticated | None |
| POST | `/api/schools` | Create new school | `super_admin` | `APPROVE_SCHOOLS` |
| PUT | `/api/schools/:id` | Update school | `super_admin`, `school_admin` | `MANAGE_SCHOOL_PROFILE` |
| POST | `/api/schools/:id/approve` | Approve school | `super_admin` | `APPROVE_SCHOOLS` |
| POST | `/api/schools/:id/suspend` | Suspend school | `super_admin` | `SUSPEND_SCHOOLS` |

**Query Parameters** (for GET `/api/schools`):
- `page` (number, default: 1)
- `limit` (number, default: 10)

---

## 👨‍🎓 Student Endpoints (`/api/students`)

All endpoints require: `JwtAuthGuard` + `RbacGuard`

| Method | Endpoint | Description | Required Roles | Required Permissions |
|--------|----------|-------------|----------------|---------------------|
| GET | `/api/students` | Get all students (paginated) | Any authenticated | `MANAGE_STUDENTS` OR `VIEW_STUDENT_DATA` |
| GET | `/api/students/:id` | Get student by ID | Any authenticated | `MANAGE_STUDENTS` OR `VIEW_STUDENT_DATA` |
| POST | `/api/students` | Create new student | `super_admin`, `school_admin` | `MANAGE_STUDENTS` |
| PUT | `/api/students/:id` | Update student | `super_admin`, `school_admin` | `MANAGE_STUDENTS` |
| DELETE | `/api/students/:id` | Delete student | `super_admin`, `school_admin` | `MANAGE_STUDENTS` |

**Query Parameters** (for GET `/api/students`):
- `page` (number, default: 1)
- `limit` (number, default: 10)
- `schoolId` (string, optional - for super_admin to filter by school)

**Note**: Student creation automatically creates a user account with role `student`.

---

## 👨‍🏫 Teacher Endpoints (`/api/teachers`)

All endpoints require: `JwtAuthGuard` + `RbacGuard`

| Method | Endpoint | Description | Required Roles | Required Permissions |
|--------|----------|-------------|----------------|---------------------|
| GET | `/api/teachers` | Get all teachers (paginated) | Any authenticated | `MANAGE_TEACHERS` OR `VIEW_ASSIGNED_CLASSES` |
| GET | `/api/teachers/:id` | Get teacher by ID | Any authenticated | `MANAGE_TEACHERS` OR `VIEW_ASSIGNED_CLASSES` |
| POST | `/api/teachers` | Create new teacher | `school_admin` | `MANAGE_TEACHERS` |
| PUT | `/api/teachers/:id` | Update teacher | `school_admin` | `MANAGE_TEACHERS` |
| DELETE | `/api/teachers/:id` | Delete teacher | `school_admin` | `MANAGE_TEACHERS` |

**Query Parameters** (for GET `/api/teachers`):
- `page` (number, default: 1)
- `limit` (number, default: 10)
- `schoolId` (string, optional)

**Note**: Teacher creation automatically creates a user account with role `teacher`.

---

## 👨‍👩‍👧 Parent Endpoints (`/api/parents`)

All endpoints require: `JwtAuthGuard` (no RbacGuard - permissions handled in service)

| Method | Endpoint | Description | Required Roles | Required Permissions |
|--------|----------|-------------|----------------|---------------------|
| GET | `/api/parents` | Get all parents (paginated) | Any authenticated | None (handled in service) |
| GET | `/api/parents/:id` | Get parent by ID | Any authenticated | None (handled in service) |
| POST | `/api/parents` | Create new parent | Any authenticated | None (handled in service) |
| PUT | `/api/parents/:id` | Update parent | Any authenticated | None (handled in service) |
| DELETE | `/api/parents/:id` | Delete parent | Any authenticated | None (handled in service) |

**Query Parameters** (for GET `/api/parents`):
- `page` (number, default: 1)
- `limit` (number, default: 10)
- `schoolId` (string, optional)

**Note**: Parent creation automatically creates a user account with role `parent`.

---

## 📅 Attendance Endpoints (`/api/attendances`)

All endpoints require: `JwtAuthGuard` + `RbacGuard`

| Method | Endpoint | Description | Required Roles | Required Permissions |
|--------|----------|-------------|----------------|---------------------|
| GET | `/api/attendances` | Get all attendance records (paginated) | Any authenticated | `VIEW_ATTENDANCE` OR `VIEW_CHILD_ATTENDANCE` |
| GET | `/api/attendances/:id` | Get attendance by ID | Any authenticated | `VIEW_ATTENDANCE` OR `VIEW_CHILD_ATTENDANCE` |
| POST | `/api/attendances` | Mark attendance | Any authenticated | `TAKE_ATTENDANCE` |
| PUT | `/api/attendances/:id` | Update attendance | Any authenticated | `TAKE_ATTENDANCE` |
| DELETE | `/api/attendances/:id` | Delete attendance | Any authenticated | `TAKE_ATTENDANCE` |

**Query Parameters** (for GET `/api/attendances`):
- `page` (number, default: 1)
- `limit` (number, default: 10)
- `schoolId` (string, optional)
- `studentId` (string, optional)
- `date` (string, optional - format: YYYY-MM-DD)

**Request Body** (for POST `/api/attendances`):
```json
{
  "studentId": "string (required)",
  "date": "YYYY-MM-DD (required)",
  "status": "PRESENT | ABSENT | LATE | EXCUSED (default: PRESENT)",
  "remarks": "string (optional)"
}
```

---

## 📝 Exam Endpoints (`/api/exams`)

All endpoints require: `JwtAuthGuard` + `RbacGuard`

| Method | Endpoint | Description | Required Roles | Required Permissions |
|--------|----------|-------------|----------------|---------------------|
| GET | `/api/exams` | Get all exams (paginated) | Any authenticated | `MANAGE_EXAMS` OR `VIEW_EXAM_RESULTS` OR `VIEW_OWN_RESULTS` |
| GET | `/api/exams/:id` | Get exam by ID | Any authenticated | `MANAGE_EXAMS` OR `VIEW_EXAM_RESULTS` OR `VIEW_OWN_RESULTS` |
| POST | `/api/exams` | Create new exam | Any authenticated | `MANAGE_EXAMS` |
| PUT | `/api/exams/:id` | Update exam | Any authenticated | `MANAGE_EXAMS` |
| DELETE | `/api/exams/:id` | Delete exam | Any authenticated | `MANAGE_EXAMS` |
| POST | `/api/exams/:id/marks` | Enter exam marks | Any authenticated | `ENTER_EXAM_MARKS` |
| GET | `/api/exams/:id/results` | Get exam results | Any authenticated | `VIEW_EXAM_RESULTS` OR `VIEW_OWN_RESULTS` OR `VIEW_PERFORMANCE` |

**Query Parameters** (for GET `/api/exams`):
- `page` (number, default: 1)
- `limit` (number, default: 10)
- `schoolId` (string, optional)

**Request Body** (for POST `/api/exams`):
```json
{
  "name": "string (required)",
  "description": "string (optional)",
  "examDate": "YYYY-MM-DD (required)",
  "classId": "string (optional)",
  "subjectId": "string (optional)",
  "totalMarks": "number (default: 100)"
}
```

---

## 💰 Fees Endpoints (`/api/fees`)

All endpoints require: `JwtAuthGuard` + `RbacGuard`

| Method | Endpoint | Description | Required Roles | Required Permissions |
|--------|----------|-------------|----------------|---------------------|
| GET | `/api/fees` | Get all fees (paginated) | Any authenticated | `MANAGE_FEES` OR `VIEW_FEES` |
| GET | `/api/fees/:id` | Get fee by ID | Any authenticated | `MANAGE_FEES` OR `VIEW_FEES` |
| POST | `/api/fees` | Create fee structure | Any authenticated | `MANAGE_FEES` |
| PUT | `/api/fees/:id` | Update fee | Any authenticated | `MANAGE_FEES` |
| DELETE | `/api/fees/:id` | Delete fee | Any authenticated | `MANAGE_FEES` |
| POST | `/api/fees/:id/payment` | Record payment | Any authenticated | `MANAGE_FEES` |

**Query Parameters** (for GET `/api/fees`):
- `page` (number, default: 1)
- `limit` (number, default: 10)
- `schoolId` (string, optional)
- `studentId` (string, optional)

**Request Body** (for POST `/api/fees`):
```json
{
  "studentId": "string (required)",
  "name": "string (required)",
  "amount": "number (required)",
  "dueDate": "YYYY-MM-DD (required)",
  "isPaid": "boolean (default: false)"
}
```

---

## 💬 Communication Endpoints (`/api/communications`)

All endpoints require: `JwtAuthGuard` + `RbacGuard`

### Notices

| Method | Endpoint | Description | Required Permissions |
|--------|----------|-------------|---------------------|
| GET | `/api/communications/notices` | Get all notices (paginated) | `VIEW_NOTICES` OR `VIEW_OWN_NOTICES` OR `SEND_NOTICES` |
| POST | `/api/communications/notices` | Create notice | `SEND_NOTICES` OR `SEND_CLASS_NOTICES` |

### Messages

| Method | Endpoint | Description | Required Permissions |
|--------|----------|-------------|---------------------|
| GET | `/api/communications/messages` | Get all messages (paginated) | `COMMUNICATE_PARENTS` OR `COMMUNICATE_TEACHERS` |
| POST | `/api/communications/messages` | Send message | `COMMUNICATE_PARENTS` OR `COMMUNICATE_TEACHERS` |

**Query Parameters** (for GET endpoints):
- `page` (number, default: 1)
- `limit` (number, default: 10)
- `schoolId` (string, optional)

---

## 🏥 Health Check

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/health` | Health check endpoint | No |

**Note**: Health endpoint is NOT prefixed with `/api`.

---

## 📋 Response Format

### Success Response
```json
{
  "data": [...],
  "total": 100,
  "page": 1,
  "limit": 10,
  "totalPages": 10
}
```

### Error Response
```json
{
  "statusCode": 400,
  "message": "Error message",
  "error": "Bad Request"
}
```

---

## 🔑 Authentication

### Login Response
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "user-uuid",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "school_admin",
    "schoolId": "school-uuid",
    "permissions": ["MANAGE_STUDENTS", "MANAGE_TEACHERS", ...]
  }
}
```

### Using the Token
Include the access token in the Authorization header:
```
Authorization: Bearer <accessToken>
```

---

## 🎯 Role-Based Access Summary

### Super Admin
- Full access to all endpoints
- Can manage all schools
- Bypasses all permission checks

### School Admin
- Can manage students, teachers, parents
- Can manage exams, fees, attendance
- Can send notices and messages
- Limited to their own school (unless super_admin)

### Teacher
- Can take attendance
- Can enter exam marks
- Can send class notices
- Can communicate with parents
- Can view assigned classes and student data

### Parent
- Can view child attendance
- Can view exam results
- Can view fees
- Can communicate with teachers
- Can view notices

### Student
- Can view own homework
- Can view own results
- Can view class routine
- Can view own notices

---

## 📝 Notes

1. **Pagination**: Most GET endpoints support pagination via `page` and `limit` query parameters
2. **School Filtering**: Non-super_admin users are automatically filtered by their `schoolId`
3. **User Creation**: Creating students, teachers, or parents automatically creates user accounts
4. **Date Format**: All dates should be in `YYYY-MM-DD` format
5. **UUIDs**: All IDs are UUIDs (string format)
6. **Global Prefix**: All endpoints (except `/health`) are prefixed with `/api`

---

**Last Updated**: 2026-01-29  
**API Gateway Version**: 1.0.0
