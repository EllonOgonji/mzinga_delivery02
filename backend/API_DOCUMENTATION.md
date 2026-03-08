# Mzinga Delivery API Documentation

**Base URL**: `https://mzinga-delivery02-t6rg.onrender.com`  
**Content-Type**: `application/json`  
**Authentication**: JWT Token in `Authorization` header (format: `Bearer {token}`)

---

## Table of Contents

1. [Authentication](#authentication)
2. [Stores](#stores)
3. [Products](#products)
4. [Orders](#orders)
5. [Notifications](#notifications)
6. [Filters & Search](#filters--search)
7. [Error Responses](#error-responses)

---

## Authentication

### Register User

**Endpoint**: `POST /api/auth/register`  
**Authentication**: None (Public)  
**Status Code**: `201 Created`

**Request Body**:

```json
{
  "user": {
    "email": "user@example.com",
    "password": "SecurePass123!",
    "password_confirmation": "SecurePass123!",
    "full_name": "John Doe",
    "role": "customer",
    "phone_number": "254712345678"
  }
}
```

**Request Fields**:
| Field | Type | Required | Format | Notes |
|-------|------|----------|--------|-------|
| `email` | string | Yes | email | Must be unique |
| `password` | string | Yes | string | Min 6 chars |
| `password_confirmation` | string | Yes | string | Must match password |
| `full_name` | string | Yes | string | Any format |
| `role` | string | Yes | enum | `customer` or `vendor` |
| `phone_number` | string | Yes | string | Kenyan format: 254... |

**Success Response (201)**:

```json
{
  "data": {
    "user": {
      "id": 1,
      "email": "user@example.com",
      "full_name": "John Doe",
      "role": "customer",
      "phone_number": "254712345678"
    },
    "token": "eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Error Response (422)**:

```json
{
  "errors": {
    "email": ["has already been taken"],
    "phone_number": ["must be valid Kenyan number (254...)"]
  }
}
```

**cURL**:

```bash
curl -X POST https://mzinga-delivery02-t6rg.onrender.com/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "user": {
      "email": "john@example.com",
      "password": "SecurePass123!",
      "password_confirmation": "SecurePass123!",
      "full_name": "John Doe",
      "role": "customer",
      "phone_number": "254712345678"
    }
  }'
```

---

### Login User

**Endpoint**: `POST /api/auth/login`  
**Authentication**: None (Public)  
**Status Code**: `200 OK`

**Request Body**:

```json
{
  "email": "user@example.com",
  "password": "SecurePass123!"
}
```

**Success Response (200)**:

```json
{
  "data": {
    "user": {
      "id": 1,
      "email": "user@example.com",
      "full_name": "John Doe",
      "role": "customer",
      "phone_number": "254712345678"
    },
    "token": "eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Error Response (401)**:

```json
{
  "errors": {
    "detail": "Invalid email or password"
  }
}
```

**cURL**:

```bash
curl -X POST https://mzinga-delivery02-t6rg.onrender.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "SecurePass123!"
  }'
```

---

### Forgot Password

**Endpoint**: `POST /api/auth/forgot_password`  
**Authentication**: None (Public)  
**Status Code**: `200 OK`

**Request Body**:

```json
{
  "email": "user@example.com"
}
```

**Success Response (200)**:

```json
{
  "message": "If your email is in our system, you will receive reset instructions shortly."
}
```

**cURL**:

```bash
curl -X POST https://mzinga-delivery02-t6rg.onrender.com/api/auth/forgot_password \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com"
  }'
```

---

### Reset Password

**Endpoint**: `POST /api/auth/reset_password`  
**Authentication**: None (Public)  
**Status Code**: `200 OK`

**Request Body**:

```json
{
  "token": "YOUR_RESET_TOKEN",
  "password": "NewSecurePassword123!",
  "password_confirmation": "NewSecurePassword123!"
}
```

**Success Response (200)**:

```json
{
  "message": "Password reset successfully"
}
```

**Error Response (422)**:

```json
{
  "errors": {
    "detail": "Invalid or expired reset token"
  }
}
```

**cURL**:

```bash
curl -X POST https://mzinga-delivery02-t6rg.onrender.com/api/auth/reset_password \
  -H "Content-Type: application/json" \
  -d '{
    "token": "YOUR_RESET_TOKEN",
    "password": "NewSecurePassword123!",
    "password_confirmation": "NewSecurePassword123!"
  }'
```

---

### Get Current User

**Endpoint**: `GET /api/auth/me`  
**Authentication**: Required  
**Status Code**: `200 OK`

**Success Response (200)**:

```json
{
  "data": {
    "id": 1,
    "email": "user@example.com",
    "full_name": "John Doe",
    "role": "customer",
    "phone_number": "254712345678"
  }
}
```

**cURL**:

```bash
curl -X GET https://mzinga-delivery02-t6rg.onrender.com/api/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

### Logout

**Endpoint**: `POST /api/auth/logout`  
**Authentication**: Required  
**Status Code**: `200 OK`

**Success Response (200)**:

```json
{
  "message": "Logged out successfully"
}
```

**cURL**:

```bash
curl -X POST https://mzinga-delivery02-t6rg.onrender.com/api/auth/logout \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

## Stores

### List All Stores (Public)

**Endpoint**: `GET /api/stores`  
**Authentication**: None  
**Status Code**: `200 OK`

**Success Response (200)**:

```json
{
  "data": [
    {
      "id": 1,
      "name": "Fresh Mart",
      "description": "Quality groceries",
      "location": "Nairobi",
      "rating": 4.5,
      "vendor_id": 5,
      "is_active": true
    }
  ]
}
```

**cURL**:

```bash
curl -X GET https://mzinga-delivery02-t6rg.onrender.com/api/stores
```

---

### Get Store Details (Public)

**Endpoint**: `GET /api/stores/:id`  
**Authentication**: None  
**Status Code**: `200 OK`

**Success Response (200)**:

```json
{
  "data": {
    "id": 1,
    "name": "Fresh Mart",
    "description": "Quality groceries",
    "location": "Nairobi",
    "rating": 4.5,
    "vendor_id": 5,
    "is_active": true
  }
}
```

**cURL**:

```bash
curl -X GET https://mzinga-delivery02-t6rg.onrender.com/api/stores/1
```

---

### Create Store (Vendor/Admin)

**Endpoint**: `POST /api/stores`  
**Authentication**: Required  
**Status Code**: `201 Created`

**Request Body**:

```json
{
  "store": {
    "name": "Fresh Mart",
    "description": "Quality groceries and fresh produce",
    "location": "Nairobi",
    "vendor_id": 5
  }
}
```

**Success Response (201)**:

```json
{
  "data": {
    "id": 5,
    "name": "Fresh Mart",
    "description": "Quality groceries and fresh produce",
    "location": "Nairobi",
    "rating": 0,
    "vendor_id": 5,
    "is_active": true
  }
}
```

**cURL**:

```bash
curl -X POST https://mzinga-delivery02-t6rg.onrender.com/api/stores \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "store": {
      "name": "Fresh Mart",
      "description": "Quality groceries",
      "location": "Nairobi",
      "vendor_id": 5
    }
  }'
```

---

### Update Store (Vendor/Admin)

**Endpoint**: `PATCH /api/stores/:id`  
**Authentication**: Required  
**Status Code**: `200 OK`

**Request Body**:

```json
{
  "store": {
    "name": "Fresh Mart Updated",
    "location": "Nairobi CBD",
    "is_active": true
  }
}
```

**Success Response (200)**:

```json
{
  "data": {
    "id": 5,
    "name": "Fresh Mart Updated",
    "location": "Nairobi CBD",
    "description": "Quality groceries and fresh produce",
    "rating": 4.5,
    "vendor_id": 5,
    "is_active": true
  }
}
```

**cURL**:

```bash
curl -X PATCH https://mzinga-delivery02-t6rg.onrender.com/api/stores/5 \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "store": {
      "name": "Fresh Mart Updated",
      "location": "Nairobi CBD"
    }
  }'
```

---

### Delete Store (Admin Only)

**Endpoint**: `DELETE /api/stores/:id`  
**Authentication**: Required  
**Status Code**: `204 No Content`

**Success Response (204)**: Empty body

**cURL**:

```bash
curl -X DELETE https://mzinga-delivery02-t6rg.onrender.com/api/stores/5 \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

## Products

### List Products by Store (Public)

**Endpoint**: `GET /api/stores/:store_id/products`  
**Authentication**: None  
**Status Code**: `200 OK`

**Success Response (200)**:

```json
{
  "data": [
    {
      "id": 1,
      "name": "Fresh Tomatoes",
      "description": "Ripe tomatoes from farm",
      "price": 150.0,
      "quantity_available": 50,
      "store_id": 5,
      "image_url": "https://..."
    }
  ]
}
```

**cURL**:

```bash
curl -X GET https://mzinga-delivery02-t6rg.onrender.com/api/stores/5/products
```

---

### Get Product Details (Public)

**Endpoint**: `GET /api/products/:id`  
**Authentication**: None  
**Status Code**: `200 OK`

**Success Response (200)**:

```json
{
  "data": {
    "id": 1,
    "name": "Fresh Tomatoes",
    "description": "Ripe tomatoes from farm",
    "price": 150.0,
    "quantity_available": 50,
    "store_id": 5,
    "image_url": "https://..."
  }
}
```

**cURL**:

```bash
curl -X GET https://mzinga-delivery02-t6rg.onrender.com/api/products/1
```

---

### Create Product (Vendor)

**Endpoint**: `POST /api/products`  
**Authentication**: Required  
**Status Code**: `201 Created`

**Request Body**:

```json
{
  "product": {
    "name": "Fresh Tomatoes",
    "description": "Ripe tomatoes from farm",
    "price": 150.0,
    "quantity_available": 50,
    "store_id": 5,
    "image_url": "https://example.com/tomatoes.jpg"
  }
}
```

**Success Response (201)**:

```json
{
  "data": {
    "id": 10,
    "name": "Fresh Tomatoes",
    "description": "Ripe tomatoes from farm",
    "price": 150.0,
    "quantity_available": 50,
    "store_id": 5,
    "image_url": "https://example.com/tomatoes.jpg"
  }
}
```

**cURL**:

```bash
curl -X POST https://mzinga-delivery02-t6rg.onrender.com/api/products \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "product": {
      "name": "Fresh Tomatoes",
      "description": "Ripe tomatoes from farm",
      "price": 150.00,
      "quantity_available": 50,
      "store_id": 5
    }
  }'
```

---

### Update Product (Vendor)

**Endpoint**: `PATCH /api/products/:id`  
**Authentication**: Required  
**Status Code**: `200 OK`

**Request Body**:

```json
{
  "product": {
    "price": 200.0,
    "quantity_available": 75,
    "description": "Premium ripe tomatoes"
  }
}
```

**Success Response (200)**:

```json
{
  "data": {
    "id": 10,
    "name": "Fresh Tomatoes",
    "description": "Premium ripe tomatoes",
    "price": 200.0,
    "quantity_available": 75,
    "store_id": 5
  }
}
```

**cURL**:

```bash
curl -X PATCH https://mzinga-delivery02-t6rg.onrender.com/api/products/10 \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "product": {
      "price": 200.00,
      "quantity_available": 75
    }
  }'
```

---

### Delete Product (Vendor)

**Endpoint**: `DELETE /api/products/:id`  
**Authentication**: Required  
**Status Code**: `204 No Content`

**cURL**:

```bash
curl -X DELETE https://mzinga-delivery02-t6rg.onrender.com/api/products/10 \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

## Orders

### List Orders (Role-Based)

**Endpoint**: `GET /api/orders`  
**Authentication**: Required  
**Status Code**: `200 OK`

**Success Response (200)**:

```json
{
  "data": [
    {
      "id": 1,
      "customer_id": 3,
      "store_id": 5,
      "status": "pending",
      "total_price": 1500.0,
      "items": [
        {
          "product_id": 1,
          "quantity": 2,
          "subtotal": 500.0
        }
      ]
    }
  ]
}
```

**cURL**:

```bash
curl -X GET https://mzinga-delivery02-t6rg.onrender.com/api/orders \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

### Get Order Details

**Endpoint**: `GET /api/orders/:id`  
**Authentication**: Required  
**Status Code**: `200 OK`

**Success Response (200)**:

```json
{
  "data": {
    "id": 1,
    "customer_id": 3,
    "store_id": 5,
    "status": "pending",
    "total_price": 1500.0,
    "items": [
      {
        "product_id": 1,
        "product_name": "Fresh Tomatoes",
        "quantity": 2,
        "price": 150.0,
        "subtotal": 300.0
      }
    ]
  }
}
```

**cURL**:

```bash
curl -X GET https://mzinga-delivery02-t6rg.onrender.com/api/orders/1 \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

### Create Order

**Endpoint**: `POST /api/orders`  
**Authentication**: Required  
**Status Code**: `201 Created`

**Request Body**:

```json
{
  "order": {
    "store_id": 5,
    "items": [
      {
        "product_id": 1,
        "quantity": 2,
        "subtotal": 300.0
      },
      {
        "product_id": 2,
        "quantity": 1,
        "subtotal": 200.0
      }
    ]
  }
}
```

**Success Response (201)**:

```json
{
  "data": {
    "id": 10,
    "customer_id": 3,
    "store_id": 5,
    "status": "pending_payment",
    "total_price": 500.0,
    "items": [
      {
        "product_id": 1,
        "quantity": 2,
        "subtotal": 300.0
      },
      {
        "product_id": 2,
        "quantity": 1,
        "subtotal": 200.0
      }
    ]
  }
}
```

**cURL**:

```bash
curl -X POST https://mzinga-delivery02-t6rg.onrender.com/api/orders \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "order": {
      "store_id": 5,
      "items": [
        {
          "product_id": 1,
          "quantity": 2,
          "subtotal": 300.00
        },
        {
          "product_id": 2,
          "quantity": 1,
          "subtotal": 200.00
        }
      ]
    }
  }'
```

---

### Accept Order (Vendor Only)

**Endpoint**: `PATCH /api/orders/:id/accept`  
**Authentication**: Required  
**Status Code**: `200 OK`

**Success Response (200)**:

```json
{
  "data": {
    "id": 10,
    "status": "accepted",
    "message": "Order accepted"
  }
}
```

**cURL**:

```bash
curl -X PATCH https://mzinga-delivery02-t6rg.onrender.com/api/orders/10/accept \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

### Reject Order (Vendor Only)

**Endpoint**: `PATCH /api/orders/:id/reject`  
**Authentication**: Required  
**Status Code**: `200 OK`

**Success Response (200)**:

```json
{
  "data": {
    "id": 10,
    "status": "rejected",
    "message": "Order rejected"
  }
}
```

**cURL**:

```bash
curl -X PATCH https://mzinga-delivery02-t6rg.onrender.com/api/orders/10/reject \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

## Notifications

### List Notifications

**Endpoint**: `GET /api/notifications`  
**Authentication**: Required  
**Status Code**: `200 OK`

**Success Response (200)**:

```json
{
  "data": [
    {
      "id": 1,
      "type": "order_created",
      "title": "New Order",
      "message": "You have a new order",
      "read": false
    }
  ]
}
```

**cURL**:

```bash
curl -X GET https://mzinga-delivery02-t6rg.onrender.com/api/notifications \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

### Get Unread Count

**Endpoint**: `GET /api/notifications/unread`  
**Authentication**: Required  
**Status Code**: `200 OK`

**Success Response (200)**:

```json
{
  "data": {
    "unread_count": 3
  }
}
```

---

### Mark as Read

**Endpoint**: `PATCH /api/notifications/:id/read`  
**Authentication**: Required  
**Status Code**: `200 OK`

**cURL**:

```bash
curl -X PATCH https://mzinga-delivery02-t6rg.onrender.com/api/notifications/1/read \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

### Mark All as Read

**Endpoint**: `PATCH /api/notifications/read_all`  
**Authentication**: Required  
**Status Code**: `200 OK`

---

## Filters & Search

### Filter Products

**Endpoint**: `GET /api/products/filter`  
**Authentication**: None  
**Query Parameters**: `search`, `min_price`, `max_price`, `page`, `limit`

**cURL**:

```bash
curl -X GET "https://mzinga-delivery02-t6rg.onrender.com/api/products/filter?search=tomatoes&min_price=100&max_price=200"
```

---

### Filter Stores

**Endpoint**: `GET /api/stores/filter`  
**Authentication**: None  
**Query Parameters**: `search`, `min_rating`, `location`, `page`, `limit`

**cURL**:

```bash
curl -X GET "https://mzinga-delivery02-t6rg.onrender.com/api/stores/filter?search=mart&min_rating=4"
```

---

### Filter Options

**Endpoint**: `GET /api/products/filter/options`  
**Authentication**: None

**cURL**:

```bash
curl -X GET https://mzinga-delivery02-t6rg.onrender.com/api/products/filter/options
```

---

## Error Responses

### 400 Bad Request

```json
{
  "errors": {
    "detail": "Bad Request"
  }
}
```

### 401 Unauthorized

```json
{
  "errors": {
    "detail": "Unauthorized"
  }
}
```

### 403 Forbidden

```json
{
  "error": "Admin access required"
}
```

### 404 Not Found

```json
{
  "error": "Resource not found"
}
```

### 422 Unprocessable Entity

```json
{
  "errors": {
    "field_name": ["validation error message"]
  }
}
```

### 500 Internal Server Error

```json
{
  "errors": {
    "detail": "Internal server error"
  }
}
```

---

## Important Notes

**Request Body Format**: All POST/PATCH requests require wrapped payload format:

- `{"user": {...}}` for auth
- `{"store": {...}}` for stores
- `{"product": {...}}` for products
- `{"order": {...}}` for orders

**Authentication**: All protected endpoints require `Authorization: Bearer {token}` header

**CORS**: Allowed origins:

- `http://localhost:8080` (development)
- `https://mzinga-delivery.vercel.app` (production)

  **Roles**:

- `customer`: Can register, place orders, view stores/products
- `vendor`: Can manage stores and products
- `admin`: Full access to all endpoints

---

## Quick Test Commands

**Register**:

```bash
curl -X POST https://mzinga-delivery02-t6rg.onrender.com/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"user":{"email":"test'$(date +%s)'@example.com","password":"Pass123!","password_confirmation":"Pass123!","full_name":"Test","role":"customer","phone_number":"254712345678"}}'
```

**Login**:

```bash
curl -X POST https://mzinga-delivery02-t6rg.onrender.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Pass123!"}'
```

**List Stores**:

```bash
curl -X GET https://mzinga-delivery02-t6rg.onrender.com/api/stores
```
