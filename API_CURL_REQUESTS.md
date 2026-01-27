# EasySchool API - cURL Requests

Base URL: `http://localhost:3000`

> **Note:** Replace `YOUR_ACCESS_TOKEN` with the actual JWT token received from login/register endpoints.

---

## 🔐 Authentication Service

### 1. User Login
```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "password123"
  }'
```

### 2. User Registration
```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123",
    "firstName": "John",
    "lastName": "Doe",
    "role": "STUDENT",
    "schoolId": "school-id-here"
  }'
```

### 3. Refresh Token
```bash
curl -X POST http://localhost:3000/auth/refresh \
  -H "Content-Type: application/json" \
  -d '{
    "refreshToken": "your-refresh-token-here"
  }'
```

### 4. Get User Profile
```bash
curl -X GET http://localhost:3000/auth/profile \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

---

## 🏫 School Service

### 1. Get All Schools
```bash
curl -X GET "http://localhost:3000/schools?page=1&limit=10" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### 2. Get School by ID
```bash
curl -X GET http://localhost:3000/schools/school-id-here \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### 3. Create School
```bash
curl -X POST http://localhost:3000/schools \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Example School",
    "address": "123 Main St",
    "phone": "+1234567890",
    "email": "school@example.com"
  }'
```

### 4. Update School
```bash
curl -X PUT http://localhost:3000/schools/school-id-here \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Updated School Name",
    "address": "456 New St"
  }'
```

### 5. Approve School
```bash
curl -X POST http://localhost:3000/schools/school-id-here/approve \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### 6. Suspend School
```bash
curl -X POST http://localhost:3000/schools/school-id-here/suspend \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

---

## 👨‍🎓 Student Service

### 1. Get All Students
```bash
curl -X GET "http://localhost:3000/students?page=1&limit=10&schoolId=school-id" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### 2. Get Student by ID
```bash
curl -X GET http://localhost:3000/students/student-id-here \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### 3. Create Student
```bash
curl -X POST http://localhost:3000/students \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Jane",
    "lastName": "Smith",
    "email": "jane@example.com",
    "dateOfBirth": "2010-01-15",
    "grade": "5",
    "section": "A",
    "parentId": "parent-id-here"
  }'
```

### 4. Update Student
```bash
curl -X PUT http://localhost:3000/students/student-id-here \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "grade": "6",
    "section": "B"
  }'
```

### 5. Delete Student
```bash
curl -X DELETE http://localhost:3000/students/student-id-here \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

---

## 👨‍🏫 Teacher Service

### 1. Get All Teachers
```bash
curl -X GET "http://localhost:3000/teachers?page=1&limit=10&schoolId=school-id" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### 2. Get Teacher by ID
```bash
curl -X GET http://localhost:3000/teachers/teacher-id-here \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### 3. Create Teacher
```bash
curl -X POST http://localhost:3000/teachers \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Dr. Sarah",
    "lastName": "Johnson",
    "email": "sarah@example.com",
    "subject": "Mathematics",
    "qualification": "M.Sc. Mathematics"
  }'
```

### 4. Update Teacher
```bash
curl -X PUT http://localhost:3000/teachers/teacher-id-here \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "subject": "Physics",
    "qualification": "Ph.D. Physics"
  }'
```

---

## 👨‍👩‍👧 Parent Service

### 1. Get All Parents
```bash
curl -X GET "http://localhost:3000/parents?page=1&limit=10&schoolId=school-id" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### 2. Get Parent by ID
```bash
curl -X GET http://localhost:3000/parents/parent-id-here \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### 3. Create Parent
```bash
curl -X POST http://localhost:3000/parents \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Robert",
    "lastName": "Smith",
    "email": "robert@example.com",
    "phone": "+1234567890",
    "relationship": "Father"
  }'
```

### 4. Update Parent
```bash
curl -X PUT http://localhost:3000/parents/parent-id-here \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "phone": "+0987654321",
    "email": "newemail@example.com"
  }'
```

---

## 📅 Attendance Service

### 1. Mark Attendance
```bash
curl -X POST http://localhost:3000/attendance \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "studentId": "student-id-here",
    "date": "2026-01-27",
    "status": "PRESENT",
    "remarks": "On time"
  }'
```

### 2. Get Attendance Records
```bash
curl -X GET "http://localhost:3000/attendance?studentId=student-id&startDate=2026-01-01&endDate=2026-01-31" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### 3. Get Attendance by ID
```bash
curl -X GET http://localhost:3000/attendance/attendance-id-here \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

---

## 📝 Exam Service

### 1. Get All Exams
```bash
curl -X GET "http://localhost:3000/exams?schoolId=school-id&grade=5" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### 2. Create Exam
```bash
curl -X POST http://localhost:3000/exams \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Mid-Term Exam",
    "subject": "Mathematics",
    "grade": "5",
    "date": "2026-02-15",
    "maxMarks": 100
  }'
```

### 3. Enter Exam Marks
```bash
curl -X POST http://localhost:3000/exams/exam-id-here/marks \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "studentId": "student-id-here",
    "marksObtained": 85,
    "remarks": "Excellent performance"
  }'
```

### 4. Get Exam Results
```bash
curl -X GET "http://localhost:3000/exams/exam-id-here/results?studentId=student-id" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

---

## 💰 Fees Service

### 1. Get All Fees
```bash
curl -X GET "http://localhost:3000/fees?studentId=student-id&status=PENDING" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### 2. Create Fee Structure
```bash
curl -X POST http://localhost:3000/fees \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "studentId": "student-id-here",
    "feeType": "TUITION",
    "amount": 5000,
    "dueDate": "2026-02-01",
    "description": "Monthly tuition fee"
  }'
```

### 3. Record Payment
```bash
curl -X POST http://localhost:3000/fees/fee-id-here/payment \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 5000,
    "paymentMethod": "CASH",
    "paymentDate": "2026-01-27",
    "transactionId": "TXN123456"
  }'
```

---

## 💬 Communication Service

### 1. Get Notices
```bash
curl -X GET "http://localhost:3000/communications/notices?schoolId=school-id&type=GENERAL" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### 2. Create Notice
```bash
curl -X POST http://localhost:3000/communications/notices \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Parent-Teacher Meeting",
    "content": "Please attend the PTM on February 1st",
    "type": "GENERAL",
    "targetAudience": "ALL"
  }'
```

### 3. Get Messages
```bash
curl -X GET "http://localhost:3000/communications/messages?recipientId=parent-id&status=UNREAD" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### 4. Send Message
```bash
curl -X POST http://localhost:3000/communications/messages \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "recipientId": "parent-id-here",
    "subject": "Student Progress Update",
    "content": "Your child is performing well in class",
    "priority": "NORMAL"
  }'
```

---

## 🏥 Health Check

### API Gateway Health
```bash
curl -X GET http://localhost:3000/health
```

---

## 📋 Quick Reference

### Common Headers
```bash
# For authenticated requests
-H "Authorization: Bearer YOUR_ACCESS_TOKEN"

# For JSON requests
-H "Content-Type: application/json"
```

### Common Query Parameters
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10)
- `schoolId`: Filter by school ID
- `studentId`: Filter by student ID
- `startDate`: Start date for date ranges
- `endDate`: End date for date ranges

### Response Format
All responses follow this structure:
```json
{
  "status": "success|error",
  "data": {},
  "message": "Optional message"
}
```

---

## 🔑 Getting Your Access Token

1. **Login** to get your access token:
```bash
TOKEN=$(curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"password123"}' \
  | jq -r '.accessToken')

echo "Your token: $TOKEN"
```

2. **Use the token** in subsequent requests:
```bash
curl -X GET http://localhost:3000/auth/profile \
  -H "Authorization: Bearer $TOKEN"
```

---

## ⚠️ Notes

- All endpoints (except `/auth/login`, `/auth/register`, `/health`) require authentication
- Replace `YOUR_ACCESS_TOKEN` with the actual JWT token
- Replace placeholder IDs (`school-id-here`, `student-id-here`, etc.) with actual IDs
- Date formats should be `YYYY-MM-DD`
- All timestamps are in ISO 8601 format
