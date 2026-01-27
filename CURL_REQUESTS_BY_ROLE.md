# EasySchool API - cURL Requests by User Role

Base URL: `http://localhost:3000/api`

> **Note:** Replace `YOUR_ACCESS_TOKEN` with the actual JWT token received from login endpoints.

---

## 🔐 Step 1: Register Users (Different Roles)

### 1. Register Super Admin
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "superadmin@easyschool.com",
    "password": "admin123",
    "firstName": "Super",
    "lastName": "Admin",
    "role": "super_admin"
  }'
```

### 2. Register School Admin
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "schooladmin@easyschool.com",
    "password": "admin123",
    "firstName": "School",
    "lastName": "Admin",
    "role": "school_admin",
    "schoolId": "school-id-here"
  }'
```

### 3. Register Teacher
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "teacher@easyschool.com",
    "password": "teacher123",
    "firstName": "John",
    "lastName": "Teacher",
    "role": "teacher",
    "schoolId": "school-id-here"
  }'
```

### 4. Register Parent
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "parent@easyschool.com",
    "password": "parent123",
    "firstName": "Jane",
    "lastName": "Parent",
    "role": "parent",
    "schoolId": "school-id-here"
  }'
```

### 5. Register Student
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "student@easyschool.com",
    "password": "student123",
    "firstName": "Bob",
    "lastName": "Student",
    "role": "student",
    "schoolId": "school-id-here"
  }'
```

---

## 👤 SUPER ADMIN - Full Access

### Login as Super Admin
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "superadmin@easyschool.com",
    "password": "admin123"
  }'
```

**Save the token from response:**
```bash
TOKEN="your-access-token-here"
```

### 1. Get Profile
```bash
curl -X GET http://localhost:3000/api/auth/profile \
  -H "Authorization: Bearer $TOKEN"
```

### 2. Get All Schools (Super Admin Only)
```bash
curl -X GET "http://localhost:3000/api/schools?page=1&limit=10" \
  -H "Authorization: Bearer $TOKEN"
```

### 3. Create School (Super Admin Only)
```bash
curl -X POST http://localhost:3000/api/schools \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Greenwood High School",
    "email": "info@greenwood.edu",
    "phone": "+1-555-0100",
    "address": "123 Education Street, City, State 12345",
    "domain": "greenwood.easyschool.com"
  }'
```

### 4. Approve School (Super Admin Only)
```bash
curl -X POST http://localhost:3000/api/schools/school-id-here/approve \
  -H "Authorization: Bearer $TOKEN"
```

### 5. Suspend School (Super Admin Only)
```bash
curl -X POST http://localhost:3000/api/schools/school-id-here/suspend \
  -H "Authorization: Bearer $TOKEN"
```

### 6. Get All Students (All Schools)
```bash
curl -X GET "http://localhost:3000/api/students?page=1&limit=10" \
  -H "Authorization: Bearer $TOKEN"
```

### 7. Get Students by School
```bash
curl -X GET "http://localhost:3000/api/students?page=1&limit=10&schoolId=school-id-here" \
  -H "Authorization: Bearer $TOKEN"
```

### 8. Get All Teachers (All Schools)
```bash
curl -X GET "http://localhost:3000/api/teachers?page=1&limit=10" \
  -H "Authorization: Bearer $TOKEN"
```

### 9. Get All Parents (All Schools)
```bash
curl -X GET "http://localhost:3000/api/parents?page=1&limit=10" \
  -H "Authorization: Bearer $TOKEN"
```

---

## 🏫 SCHOOL ADMIN - School-Specific Access

### Login as School Admin
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "schooladmin@easyschool.com",
    "password": "admin123"
  }'
```

**Save the token:**
```bash
SCHOOL_ADMIN_TOKEN="your-school-admin-token-here"
```

### 1. Get Profile
```bash
curl -X GET http://localhost:3000/api/auth/profile \
  -H "Authorization: Bearer $SCHOOL_ADMIN_TOKEN"
```

### 2. Get Own School (School Admin)
```bash
curl -X GET http://localhost:3000/api/schools/school-id-here \
  -H "Authorization: Bearer $SCHOOL_ADMIN_TOKEN"
```

### 3. Update Own School
```bash
curl -X PUT http://localhost:3000/api/schools/school-id-here \
  -H "Authorization: Bearer $SCHOOL_ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Updated School Name",
    "phone": "+1-555-9999"
  }'
```

### 4. Create Student (School Admin)
```bash
curl -X POST http://localhost:3000/api/students \
  -H "Authorization: Bearer $SCHOOL_ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Alice",
    "lastName": "Johnson",
    "email": "alice.johnson@school.com",
    "dateOfBirth": "2010-05-15",
    "grade": "5",
    "section": "A",
    "parentId": "parent-id-here"
  }'
```

### 5. Update Student
```bash
curl -X PUT http://localhost:3000/api/students/student-id-here \
  -H "Authorization: Bearer $SCHOOL_ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "grade": "6",
    "section": "B"
  }'
```

### 6. Delete Student
```bash
curl -X DELETE http://localhost:3000/api/students/student-id-here \
  -H "Authorization: Bearer $SCHOOL_ADMIN_TOKEN"
```

### 7. Create Teacher
```bash
curl -X POST http://localhost:3000/api/teachers \
  -H "Authorization: Bearer $SCHOOL_ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Dr. Sarah",
    "lastName": "Williams",
    "email": "sarah.williams@school.com",
    "subject": "Mathematics",
    "qualification": "M.Sc. Mathematics"
  }'
```

### 8. Create Parent
```bash
curl -X POST http://localhost:3000/api/parents \
  -H "Authorization: Bearer $SCHOOL_ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Robert",
    "lastName": "Smith",
    "email": "robert.smith@email.com",
    "phone": "+1-555-1234",
    "relationship": "Father"
  }'
```

### 9. Mark Attendance
```bash
curl -X POST http://localhost:3000/api/attendances \
  -H "Authorization: Bearer $SCHOOL_ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "studentId": "student-id-here",
    "date": "2026-01-27",
    "status": "PRESENT",
    "remarks": "On time"
  }'
```

### 10. Create Exam
```bash
curl -X POST http://localhost:3000/api/exams \
  -H "Authorization: Bearer $SCHOOL_ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Mid-Term Mathematics Exam",
    "subject": "Mathematics",
    "date": "2026-02-15",
    "maxMarks": 100,
    "description": "Mid-term examination for Grade 5"
  }'
```

### 11. Create Fee
```bash
curl -X POST http://localhost:3000/api/fees \
  -H "Authorization: Bearer $SCHOOL_ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "studentId": "student-id-here",
    "amount": 500.00,
    "dueDate": "2026-02-01",
    "description": "Monthly tuition fee"
  }'
```

### 12. Record Fee Payment
```bash
curl -X POST http://localhost:3000/api/fees/fee-id-here/payment \
  -H "Authorization: Bearer $SCHOOL_ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 500.00,
    "paymentDate": "2026-01-27",
    "paymentMethod": "CASH"
  }'
```

---

## 👨‍🏫 TEACHER - Limited Access

### Login as Teacher
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "teacher@easyschool.com",
    "password": "teacher123"
  }'
```

**Save the token:**
```bash
TEACHER_TOKEN="your-teacher-token-here"
```

### 1. Get Profile
```bash
curl -X GET http://localhost:3000/api/auth/profile \
  -H "Authorization: Bearer $TEACHER_TOKEN"
```

### 2. Get Students (View Only)
```bash
curl -X GET "http://localhost:3000/api/students?page=1&limit=10" \
  -H "Authorization: Bearer $TEACHER_TOKEN"
```

### 3. Get Student by ID
```bash
curl -X GET http://localhost:3000/api/students/student-id-here \
  -H "Authorization: Bearer $TEACHER_TOKEN"
```

### 4. Mark Attendance
```bash
curl -X POST http://localhost:3000/api/attendances \
  -H "Authorization: Bearer $TEACHER_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "studentId": "student-id-here",
    "date": "2026-01-27",
    "status": "PRESENT",
    "remarks": "Participated actively"
  }'
```

### 5. Get Attendance Records
```bash
curl -X GET "http://localhost:3000/api/attendances?page=1&limit=10&studentId=student-id-here" \
  -H "Authorization: Bearer $TEACHER_TOKEN"
```

### 6. Update Attendance
```bash
curl -X PUT http://localhost:3000/api/attendances/attendance-id-here \
  -H "Authorization: Bearer $TEACHER_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "LATE",
    "remarks": "Arrived 10 minutes late"
  }'
```

### 7. Create Exam
```bash
curl -X POST http://localhost:3000/api/exams \
  -H "Authorization: Bearer $TEACHER_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Unit Test - Chapter 5",
    "subject": "Mathematics",
    "date": "2026-02-10",
    "maxMarks": 50,
    "description": "Unit test for Chapter 5"
  }'
```

### 8. Add Exam Marks
```bash
curl -X POST http://localhost:3000/api/exams/exam-id-here/marks \
  -H "Authorization: Bearer $TEACHER_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "studentId": "student-id-here",
    "marksObtained": 45,
    "remarks": "Excellent performance"
  }'
```

### 9. Get Exam Results
```bash
curl -X GET http://localhost:3000/api/exams/exam-id-here/results \
  -H "Authorization: Bearer $TEACHER_TOKEN"
```

### 10. Create Notice
```bash
curl -X POST http://localhost:3000/api/communications/notices \
  -H "Authorization: Bearer $TEACHER_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Parent-Teacher Meeting",
    "content": "Please attend the parent-teacher meeting on February 5th at 3 PM."
  }'
```

---

## 👨‍👩‍👧 PARENT - View Access

### Login as Parent
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "parent@easyschool.com",
    "password": "parent123"
  }'
```

**Save the token:**
```bash
PARENT_TOKEN="your-parent-token-here"
```

### 1. Get Profile
```bash
curl -X GET http://localhost:3000/api/auth/profile \
  -H "Authorization: Bearer $PARENT_TOKEN"
```

### 2. Get Own Children (Students)
```bash
curl -X GET "http://localhost:3000/api/students?page=1&limit=10" \
  -H "Authorization: Bearer $PARENT_TOKEN"
```

### 3. Get Child's Attendance
```bash
curl -X GET "http://localhost:3000/api/attendances?page=1&limit=30&studentId=student-id-here" \
  -H "Authorization: Bearer $PARENT_TOKEN"
```

### 4. Get Child's Exam Results
```bash
curl -X GET "http://localhost:3000/api/exams?page=1&limit=10" \
  -H "Authorization: Bearer $PARENT_TOKEN"
```

### 5. Get Child's Fees
```bash
curl -X GET "http://localhost:3000/api/fees?page=1&limit=10&studentId=student-id-here" \
  -H "Authorization: Bearer $PARENT_TOKEN"
```

### 6. Get Notices
```bash
curl -X GET "http://localhost:3000/api/communications/notices?page=1&limit=10" \
  -H "Authorization: Bearer $PARENT_TOKEN"
```

### 7. Get Messages
```bash
curl -X GET "http://localhost:3000/api/communications/messages?page=1&limit=10" \
  -H "Authorization: Bearer $PARENT_TOKEN"
```

### 8. Send Message
```bash
curl -X POST http://localhost:3000/api/communications/messages \
  -H "Authorization: Bearer $PARENT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Question about homework",
    "content": "Could you please clarify the homework assignment for tomorrow?"
  }'
```

---

## 👨‍🎓 STUDENT - View Access

### Login as Student
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "student@easyschool.com",
    "password": "student123"
  }'
```

**Save the token:**
```bash
STUDENT_TOKEN="your-student-token-here"
```

### 1. Get Profile
```bash
curl -X GET http://localhost:3000/api/auth/profile \
  -H "Authorization: Bearer $STUDENT_TOKEN"
```

### 2. Get Own Attendance
```bash
curl -X GET "http://localhost:3000/api/attendances?page=1&limit=30" \
  -H "Authorization: Bearer $STUDENT_TOKEN"
```

### 3. Get Own Exam Results
```bash
curl -X GET "http://localhost:3000/api/exams?page=1&limit=10" \
  -H "Authorization: Bearer $STUDENT_TOKEN"
```

### 4. Get Own Fees
```bash
curl -X GET "http://localhost:3000/api/fees?page=1&limit=10" \
  -H "Authorization: Bearer $STUDENT_TOKEN"
```

### 5. Get Notices
```bash
curl -X GET "http://localhost:3000/api/communications/notices?page=1&limit=10" \
  -H "Authorization: Bearer $STUDENT_TOKEN"
```

### 6. Get Messages
```bash
curl -X GET "http://localhost:3000/api/communications/messages?page=1&limit=10" \
  -H "Authorization: Bearer $STUDENT_TOKEN"
```

---

## 🔄 Token Refresh

### Refresh Access Token
```bash
curl -X POST http://localhost:3000/api/auth/refresh \
  -H "Content-Type: application/json" \
  -d '{
    "refreshToken": "your-refresh-token-here"
  }'
```

---

## 📊 Example: Complete Workflow for School Admin

```bash
# 1. Login
LOGIN_RESPONSE=$(curl -s -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"schooladmin@easyschool.com","password":"admin123"}')

# 2. Extract token
TOKEN=$(echo $LOGIN_RESPONSE | grep -o '"accessToken":"[^"]*' | sed 's/"accessToken":"//')

# 3. Get profile
curl -X GET http://localhost:3000/api/auth/profile \
  -H "Authorization: Bearer $TOKEN"

# 4. Create a student
curl -X POST http://localhost:3000/api/students \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Alice",
    "lastName": "Johnson",
    "email": "alice@school.com",
    "dateOfBirth": "2010-05-15",
    "grade": "5",
    "section": "A"
  }'

# 5. Mark attendance for the student
curl -X POST http://localhost:3000/api/attendances \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "studentId": "student-id-from-previous-response",
    "date": "2026-01-27",
    "status": "PRESENT",
    "remarks": "On time"
  }'
```

---

## 🎯 Quick Reference: Role Permissions

| Operation | Super Admin | School Admin | Teacher | Parent | Student |
|-----------|-------------|--------------|---------|--------|---------|
| View All Schools | ✅ | ❌ | ❌ | ❌ | ❌ |
| Create School | ✅ | ❌ | ❌ | ❌ | ❌ |
| Approve/Suspend School | ✅ | ❌ | ❌ | ❌ | ❌ |
| Manage Students | ✅ | ✅ | 👁️ | 👁️ | 👁️ |
| Create Student | ✅ | ✅ | ❌ | ❌ | ❌ |
| Manage Teachers | ✅ | ✅ | ❌ | ❌ | ❌ |
| Mark Attendance | ✅ | ✅ | ✅ | ❌ | ❌ |
| Create Exams | ✅ | ✅ | ✅ | ❌ | ❌ |
| View Exam Results | ✅ | ✅ | ✅ | ✅ | ✅ |
| Manage Fees | ✅ | ✅ | ❌ | 👁️ | 👁️ |
| Record Payment | ✅ | ✅ | ❌ | ❌ | ❌ |
| Create Notices | ✅ | ✅ | ✅ | ❌ | ❌ |
| Send Messages | ✅ | ✅ | ✅ | ✅ | ✅ |

**Legend:**
- ✅ = Full Access (Create/Read/Update/Delete)
- 👁️ = View Only
- ❌ = No Access

---

## 📝 Notes

1. **Token Expiration**: Access tokens expire after 1 hour. Use refresh token to get a new access token.
2. **School ID**: School Admin, Teacher, Parent, and Student users need a valid `schoolId` when registering.
3. **Pagination**: All list endpoints support `page` and `limit` query parameters.
4. **Filtering**: Many endpoints support filtering by `schoolId`, `studentId`, `date`, etc.
5. **Error Handling**: All endpoints return appropriate HTTP status codes and error messages.
