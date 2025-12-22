# CORS & API Registration Guide

## CORS Status: Working

Your API now properly returns CORS headers for allowed origins:
- `http://localhost:8080` (development local frontend)
- `https://mzinga-delivery.vercel.app` (production Vercel frontend)

### CORS Environment Configuration (Render Dashboard)

**Key**: `CORS_ALLOWED_ORIGINS`  
**Value**: `http://localhost:8080,https://mzinga-delivery.vercel.app`  
**Location**: Render Service → Environment Variables

> If Vercel frontend still cannot access the API, verify this environment variable exists and is set correctly in the Render dashboard. Changes require a redeploy.

---

## API Registration Endpoint

**URL**: `POST https://mzinga-delivery02-t6rg.onrender.com/api/auth/register`  
**Status Code on Success**: `201 Created`  
**Content-Type**: `application/json`

### Required Fields

| Field | Type | Example | Notes |
|-------|------|---------|-------|
| `email` | string | `user@example.com` | Must be unique; alphanumeric + symbols |
| `password` | string | `SecurePass123!` | Min 6 chars; case-sensitive |
| `password_confirmation` | string | `SecurePass123!` | Must match `password` |
| `full_name` | string | `John Doe` | Required; any name format |
| `role` | string | `customer` or `store_owner` | Lowercase; one of these values |
| `phone_number` | string | `254712345678` | Kenyan format: `254...` (no + or spaces) |

### Success Response (201)

```json
{
  "data": {
    "user": {
      "id": 25,
      "email": "user@example.com",
      "full_name": "John Doe",
      "role": "customer",
      "phone_number": "254712345678"
    },
    "token": "eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### Error Response (422 Unprocessable Entity)

Returned when validation fails:

```json
{
  "errors": {
    "email": ["has already been taken"],
    "phone_number": ["must be valid Kenyan number (254...)"],
    "role": ["can't be blank"]
  }
}
```

---

## How to Register: Working Examples

### Option 1: With "user" Wrapper (Flexible)

Both the wrapped and unwrapped formats are now accepted.

**cURL:**
```bash
curl -i -X POST \
  -H "Origin: http://localhost:8080" \
  -H "Content-Type: application/json" \
  https://mzinga-delivery02-t6rg.onrender.com/api/auth/register \
  -d '{
    "user": {
      "email": "testuser@example.com",
      "password": "SecurePass123!",
      "password_confirmation": "SecurePass123!",
      "full_name": "Test User",
      "role": "customer",
      "phone_number": "254712345678"
    }
  }'
```

**JavaScript (Fetch):**
```javascript
fetch("https://mzinga-delivery02-t6rg.onrender.com/api/auth/register", {
  method: "POST",
  headers: {
    "Content-Type": "application/json"
  },
  credentials: "include", // Only if using cookies; remove if not needed
  body: JSON.stringify({
    user: {
      email: "testuser@example.com",
      password: "SecurePass123!",
      password_confirmation: "SecurePass123!",
      full_name: "Test User",
      role: "customer",
      phone_number: "254712345678"
    }
  })
})
.then(res => res.json())
.then(data => {
  if (data.data) {
    console.log("Registration successful!");
    console.log("User ID:", data.data.user.id);
    console.log("Token:", data.data.token); // Store this for authenticated requests
  } else if (data.errors) {
    console.log("Validation errors:", data.errors);
  }
})
.catch(err => console.error("Network error:", err));
```

**Axios:**
```javascript
import axios from "axios";

axios.post("https://mzinga-delivery02-t6rg.onrender.com/api/auth/register", {
  user: {
    email: "testuser@example.com",
    password: "SecurePass123!",
    password_confirmation: "SecurePass123!",
    full_name: "Test User",
    role: "customer",
    phone_number: "254712345678"
  }
}, {
  withCredentials: true // Only if using cookies; remove if not needed
})
.then(res => {
  console.log("Registration successful!");
  console.log("Token:", res.data.data.token);
})
.catch(err => {
  if (err.response?.data?.errors) {
    console.log("Validation errors:", err.response.data.errors);
  } else {
    console.error("Error:", err.message);
  }
});
```

### Option 2: Without "user" Wrapper (Direct)

**cURL:**
```bash
curl -i -X POST \
  -H "Origin: http://localhost:8080" \
  -H "Content-Type: application/json" \
  https://mzinga-delivery02-t6rg.onrender.com/api/auth/register \
  -d '{
    "email": "testuser@example.com",
    "password": "SecurePass123!",
    "password_confirmation": "SecurePass123!",
    "full_name": "Test User",
    "role": "customer",
    "phone_number": "254712345678"
  }'
```

**JavaScript (Fetch):**
```javascript
fetch("https://mzinga-delivery02-t6rg.onrender.com/api/auth/register", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    email: "testuser@example.com",
    password: "SecurePass123!",
    password_confirmation: "SecurePass123!",
    full_name": "Test User",
    role: "customer",
    phone_number: "254712345678"
  })
})
.then(res => res.json())
.then(data => console.log(data))
.catch(err => console.error(err));
```

---

## Debugging CORS Issues

If your frontend still sees a CORS error, follow these steps:

### Step 1: Check Browser Console

1. Open DevTools (`F12` or `Right-click → Inspect`)
2. Go to **Console** tab
3. Look for errors like:
   ```
   Access to XMLHttpRequest at 'https://...' from origin 'http://localhost:8080' has been blocked by CORS policy
   ```

### Step 2: Check Network Request

1. In DevTools, go to **Network** tab
2. Retry the registration request
3. Click the request and check:
   - **Request Headers**: Look for `Origin` header (browser sends this automatically)
   - **Response Headers**: Look for:
     - `access-control-allow-origin` (should match your origin)
     - `access-control-allow-credentials` (should be `true` if using cookies)
   - **Response Status**: Should be `201` (success) or `422` (validation error), NOT `400` or `404`

### Step 3: Verify Render Environment Variable

1. Log into Render dashboard
2. Navigate to your `mzinga_delivery` service
3. Go to **Environment** tab
4. Confirm `CORS_ALLOWED_ORIGINS` is set to:
   ```
   http://localhost:8080,https://mzinga-delivery.vercel.app
   ```
5. If not present or incorrect, add/update it
6. Click **Save** and **Redeploy** the service

### Step 4: Test with cURL

Replace `{ORIGIN}` with your frontend origin:

```bash
# For localhost frontend
curl -i -X OPTIONS \
  -H "Origin: http://localhost:8080" \
  -H "Access-Control-Request-Method: POST" \
  https://mzinga-delivery02-t6rg.onrender.com/api/auth/register

# For Vercel frontend
curl -i -X OPTIONS \
  -H "Origin: https://mzinga-delivery.vercel.app" \
  -H "Access-Control-Request-Method: POST" \
  https://mzinga-delivery02-t6rg.onrender.com/api/auth/register
```

Expected response headers:
```
HTTP/2 204
access-control-allow-origin: {your-origin}
access-control-allow-methods: GET,POST,PUT,PATCH,DELETE,OPTIONS
access-control-allow-headers: authorization,content-type,accept
access-control-allow-credentials: true
```

If these headers are missing, the environment variable is not set correctly.

---

## Common Issues & Solutions

### Issue: "Bad Request" (400)

**Cause**: Invalid JSON or missing required fields  
**Solution**: 
- Validate JSON syntax (use [jsonlint.com](https://www.jsonlint.com))
- Ensure all required fields are present and valid
- Check field formats (especially `phone_number`: must be `254...`)

### Issue: "Has Already Been Taken" (422)

**Cause**: Email already registered  
**Solution**: Use a unique email address

### Issue: "Must be valid Kenyan number" (422)

**Cause**: `phone_number` not in format `254...`  
**Solution**: 
- Remove `+` prefix or spaces
- Start with country code `254` (Kenya)
- Example valid formats: `254712345678`, `254700123456`

### Issue: "Can't be blank" (422)

**Cause**: Missing required field  
**Solution**: Ensure these are always provided:
- `email`
- `password`
- `password_confirmation`
- `full_name`
- `role`
- `phone_number`

### Issue: CORS Error in Browser but cURL Works

**Cause**: Browser environment different from cURL  
**Solutions**:
1. Clear browser cache and cookies
2. Restart dev server
3. Check for service worker (DevTools → Application → Service Workers)
4. Ensure frontend is at exact origin: `http://localhost:8080` or `https://mzinga-delivery.vercel.app`
5. Verify `credentials: 'include'` is set in fetch if using cookies

---

## Quick Reference

**API Endpoint**: `https://mzinga-delivery02-t6rg.onrender.com/api/auth/register`  
**Method**: POST  
**Content-Type**: `application/json`  
**Success Status**: 201  
**Allowed Origins**: `http://localhost:8080`, `https://mzinga-delivery.vercel.app`  
**Required Fields**: `email`, `password`, `password_confirmation`, `full_name`, `role`, `phone_number`

---

## Support

If issues persist:
1. Share browser DevTools Network tab screenshot (request + response headers)
2. Share Render `x-request-id` header from the failed request
3. Confirm `CORS_ALLOWED_ORIGINS` value in Render dashboard
4. Verify frontend is running on the exact allowed origin

