# Login and Token Verification Report

## Overview
This document reports on the login and token verification functionality of the EasySchool API Gateway.

## Architecture

### Authentication Flow
1. **User Registration/Login** → Auth Service (Port 3001)
2. **Token Generation** → JWT tokens (access + refresh)
3. **Token Verification** → API Gateway JWT Guard
4. **Request Authorization** → User context attached to request

### Components

#### 1. Auth Service (`services/auth-service`)
- **Location**: Port 3001
- **Responsibilities**:
  - User registration
  - User login
  - JWT token generation (access + refresh)
  - Token refresh
  - User profile retrieval
  - Password hashing (bcrypt)

#### 2. API Gateway (`services/api-gateway`)
- **Location**: Port 3000
- **Responsibilities**:
  - Route authentication requests to Auth Service
  - Verify JWT tokens on protected routes
  - Extract user context from tokens
  - Forward user context to downstream services

## Token Structure

### Access Token Payload
```json
{
  "userId": "user-uuid",
  "email": "user@example.com",
  "role": "STUDENT|TEACHER|PARENT|SCHOOL_ADMIN|SUPER_ADMIN",
  "schoolId": "school-uuid-or-null",
  "permissions": ["PERMISSION_1", "PERMISSION_2"],
  "iat": 1234567890,
  "exp": 1234571490
}
```

### Refresh Token Payload
```json
{
  "userId": "user-uuid",
  "iat": 1234567890,
  "exp": 1234601490
}
```

## Endpoints

### 1. Login
**Endpoint**: `POST /auth/login`

**Request**:
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response**:
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "user-uuid",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "STUDENT",
    "schoolId": "school-uuid",
    "permissions": ["VIEW_OWN_RESULTS", "VIEW_OWN_HOMEWORK"]
  }
}
```

### 2. Register
**Endpoint**: `POST /auth/register`

**Request**:
```json
{
  "email": "user@example.com",
  "password": "password123",
  "firstName": "John",
  "lastName": "Doe",
  "role": "STUDENT",
  "schoolId": "school-uuid-or-null"
}
```

### 3. Get Profile (Token Verification)
**Endpoint**: `GET /auth/profile`

**Headers**:
```
Authorization: Bearer <accessToken>
```

**Response**:
```json
{
  "id": "user-uuid",
  "email": "user@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "phone": "+1234567890",
  "role": "STUDENT",
  "schoolId": "school-uuid",
  "permissions": ["VIEW_OWN_RESULTS"],
  "lastLoginAt": "2026-01-27T09:00:00.000Z"
}
```

### 4. Refresh Token
**Endpoint**: `POST /auth/refresh`

**Request**:
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

## Token Verification Process

### API Gateway JWT Guard Flow

1. **Extract Token**: From `Authorization: Bearer <token>` header
2. **Local Verification**: Verify JWT signature using `JWT_SECRET`
3. **Optional Remote Validation**: Call Auth Service `/auth/validate` (gracefully fails if service down)
4. **Attach User Context**: Add user info to `request.user`
5. **Allow/Deny**: Return `true` if valid, throw `UnauthorizedException` if invalid

### Verification Code (API Gateway)
```typescript
// services/api-gateway/src/auth/guards/jwt-auth.guard.ts
async canActivate(context: ExecutionContext): Promise<boolean> {
  const token = this.extractTokenFromHeader(request);
  
  if (!token) {
    throw new UnauthorizedException('No token provided');
  }
  
  try {
    // Verify token locally
    const decoded = jwt.verify(token, this.jwtSecret) as JwtPayload;
    
    // Attach user to request
    request.user = {
      userId: decoded.userId,
      email: decoded.email,
      role: decoded.role,
      schoolId: decoded.schoolId,
      permissions: decoded.permissions || [],
      accessToken: token,
    };
    
    return true;
  } catch (error) {
    throw new UnauthorizedException('Invalid token');
  }
}
```

## Security Features

### 1. Password Hashing
- Uses `bcrypt` with salt rounds (default: 10)
- Passwords are never stored in plain text

### 2. JWT Token Security
- Tokens signed with `JWT_SECRET` (configurable)
- Access tokens expire (default: 1 hour)
- Refresh tokens expire (default: 7 days)
- Refresh tokens stored as bcrypt hash in database

### 3. Token Validation
- Signature verification
- Expiration check
- User active status check
- Optional remote validation

### 4. Error Handling
- Generic error messages for invalid credentials
- No user enumeration (same error for wrong email/password)
- Detailed logging for debugging

## Configuration

### Environment Variables

**Auth Service** (`services/auth-service/.env`):
```env
JWT_SECRET=your-secret-key-here
JWT_EXPIRES_IN=1h
JWT_REFRESH_EXPIRES_IN=7d
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_DATABASE=easyschool_auth
```

**API Gateway** (`services/api-gateway/.env`):
```env
JWT_SECRET=your-secret-key-here
AUTH_SERVICE_URL=http://localhost:3001
```

> **Important**: Both services must use the same `JWT_SECRET` for token verification to work.

## Testing

### Test Cases

1. ✅ **Valid Login**: Returns access token and refresh token
2. ✅ **Invalid Credentials**: Returns 401 Unauthorized
3. ✅ **Valid Token**: Allows access to protected routes
4. ✅ **Invalid Token**: Returns 401 Unauthorized
5. ✅ **Missing Token**: Returns 401 Unauthorized
6. ✅ **Expired Token**: Returns 401 Unauthorized
7. ✅ **Token Refresh**: Generates new access token

### Test Commands

```bash
# 1. Register a user
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test123!@#",
    "firstName": "Test",
    "lastName": "User",
    "role": "STUDENT"
  }'

# 2. Login
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test123!@#"
  }'

# 3. Get profile (with token)
curl -X GET http://localhost:3000/auth/profile \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"

# 4. Test invalid token
curl -X GET http://localhost:3000/auth/profile \
  -H "Authorization: Bearer invalid-token"
```

## Issues and Recommendations

### Current Status
- ✅ Login endpoint working
- ✅ Token generation working
- ✅ Token verification working
- ✅ Error handling implemented
- ⚠️ No test users in database (need to register first)

### Recommendations

1. **JWT Secret**: Use a strong, randomly generated secret in production
2. **Token Expiration**: Adjust based on security requirements
3. **HTTPS**: Always use HTTPS in production
4. **Rate Limiting**: Implement rate limiting on login endpoint
5. **Token Blacklisting**: Consider implementing token blacklist for logout
6. **Refresh Token Rotation**: Implement refresh token rotation for better security
7. **Multi-factor Authentication**: Consider adding MFA for sensitive operations

## Troubleshooting

### Common Issues

1. **"Invalid token" error**
   - Check if `JWT_SECRET` matches between services
   - Verify token hasn't expired
   - Ensure token is in correct format: `Bearer <token>`

2. **"Invalid credentials" error**
   - Verify user exists in database
   - Check password is correct
   - Ensure user is active (`isActive = true`)

3. **Token verification fails**
   - Check Auth Service is running (port 3001)
   - Verify JWT_SECRET configuration
   - Check token format and expiration

## Logs

Check logs for debugging:
- Auth Service: `logs/auth-service.log`
- API Gateway: `logs/api-gateway.log`

---

**Last Updated**: 2026-01-27
**Status**: ✅ Operational
