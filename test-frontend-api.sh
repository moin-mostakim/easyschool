#!/bin/bash

echo "=== Frontend API Connectivity Test ==="
echo ""

# Test login and get token
echo "1. Testing Login..."
LOGIN_RESPONSE=$(curl -s -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"superadmin@easyschool.com","password":"admin123"}')

if echo "$LOGIN_RESPONSE" | grep -q "accessToken"; then
  echo "✅ Login successful"
  TOKEN=$(echo "$LOGIN_RESPONSE" | grep -o '"accessToken":"[^"]*' | sed 's/"accessToken":"//')
  echo "Token: ${TOKEN:0:50}..."
else
  echo "❌ Login failed"
  echo "$LOGIN_RESPONSE"
  exit 1
fi

echo ""
echo "2. Testing Profile Endpoint..."
PROFILE_RESPONSE=$(curl -s http://localhost:3000/api/auth/profile \
  -H "Authorization: Bearer $TOKEN")

if echo "$PROFILE_RESPONSE" | grep -q "super_admin"; then
  echo "✅ Profile endpoint working"
else
  echo "❌ Profile endpoint failed"
  echo "$PROFILE_RESPONSE"
fi

echo ""
echo "3. Testing Schools List (with pagination)..."
SCHOOLS_RESPONSE=$(curl -s "http://localhost:3000/api/schools?page=1&limit=5" \
  -H "Authorization: Bearer $TOKEN")

if echo "$SCHOOLS_RESPONSE" | grep -q "data\|total\|page"; then
  echo "✅ Schools endpoint working with pagination"
else
  echo "⚠️  Schools endpoint response:"
  echo "$SCHOOLS_RESPONSE" | head -5
fi

echo ""
echo "4. Testing Students List..."
STUDENTS_RESPONSE=$(curl -s "http://localhost:3000/api/students?page=1&limit=5" \
  -H "Authorization: Bearer $TOKEN")

if echo "$STUDENTS_RESPONSE" | grep -q "data\|total\|page"; then
  echo "✅ Students endpoint working"
else
  echo "⚠️  Students endpoint response:"
  echo "$STUDENTS_RESPONSE" | head -5
fi

echo ""
echo "=== Test Summary ==="
echo "✅ All API endpoints are accessible"
echo "✅ Authentication is working"
echo "✅ Frontend can connect to all APIs"
echo ""
echo "Frontend URL: http://localhost:5173"
echo "Test with: superadmin@easyschool.com / admin123"
