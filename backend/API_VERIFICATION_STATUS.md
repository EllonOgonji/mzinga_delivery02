# API Verification Status & Examples

**Deployed Base URL:** `https://mzinga-delivery02-t6rg.onrender.com`
**Local Base URL:** `http://localhost:4000`

---

## Verified & Tested APIs

The following endpoints have been verified using the specific test cases below.

### 1. Authentication

**1.1 Register Customer**
**Endpoint:** `POST /api/auth/register`

```bash
curl -X POST "https://mzinga-delivery02-t6rg.onrender.com/api/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "user": {
      "full_name": "Machapo",
      "email": "chapo@example.com",
      "phone": "254716555678",
      "role": "customer",
      "password": "password123",
      "password_confirmation": "password123"
    }
  }'
```

**Status:** 201 Created

**1.2 Register Vendor**
**Endpoint:** `POST /api/auth/register`

```bash
curl -X POST "https://mzinga-delivery02-t6rg.onrender.com/api/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "user": {
      "full_name": "Venom",
      "email": "venom@example.com",
      "phone": "254723456789",
      "role": "vendor",
      "password": "password123",
      "password_confirmation": "password123"
    }
  }'
```

**Status:** 201 Created

**1.3 Register Admin**
**Endpoint:** `POST /api/auth/register`

```bash
curl -X POST "https://mzinga-delivery02-t6rg.onrender.com/api/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "user": {
      "full_name": "Admin User",
      "email": "admin@example.com",
      "phone": "254734567890",
      "role": "admin",
      "password": "password123",
      "password_confirmation": "password123"
    }
  }'
```

**Status:** 201 Created

**1.4 Login (Vendor)**
**Endpoint:** `POST /api/auth/login`

```bash
curl -X POST "https://mzinga-delivery02-t6rg.onrender.com/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "venom@example.com",
    "password": "password123"
  }'
```

**Status:** 200 OK (Returns JSON with `token`)

**1.5 Get Current User**
**Endpoint:** `GET /api/auth/me`

```bash
curl -X GET "https://mzinga-delivery02-t6rg.onrender.com/api/auth/me" \
  -H "Authorization: Bearer <TOKEN>"
```

**Status:** 200 OK

---

### 2. Vendor Store Management (Verified)

**2.1 Create Store**
**Endpoint:** `POST /api/vendor/stores`

```bash
curl -X POST "https://mzinga-delivery02-t6rg.onrender.com/api/vendor/stores" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <VENDOR_TOKEN>" \
  -d '{
    "store": {
      "name": "Premium Liquor Store",
      "address": "123 Main St, Nairobi",
      "latitude": -1.286389,
      "longitude": 36.817223,
      "logo": "https://example.com/logo.png",
      "banner": "https://example.com/banner.jpg"
    }
  }'
```

**Status:** 201 Created (Status: `pending`)

**2.2 View My Stores**
**Endpoint:** `GET /api/vendor/stores`

```bash
curl -X GET "https://mzinga-delivery02-t6rg.onrender.com/api/vendor/stores" \
  -H "Authorization: Bearer <VENDOR_TOKEN>"
```

**Status:** 200 OK

---

### 3. Admin Approval Flow (Verified)

**3.1 View Pending Stores**
**Endpoint:** `GET /api/admin/stores/pending`

```bash
curl -X GET "https://mzinga-delivery02-t6rg.onrender.com/api/admin/stores/pending" \
  -H "Authorization: Bearer <ADMIN_TOKEN>"
```

**Status:** 200 OK

**3.2 Approve Store**
**Endpoint:** `PATCH /api/admin/stores/:id/approve`

```bash
curl -X PATCH "https://mzinga-delivery02-t6rg.onrender.com/api/admin/stores/5/approve" \
  -H "Authorization: Bearer <ADMIN_TOKEN>"
```

**Status:** 200 OK (Status changes to `approved`)

---

### 4. Public Access (Verified)

**4.1 View Public Stores**
**Endpoint:** `GET /api/stores`

```bash
curl -X GET "https://mzinga-delivery02-t6rg.onrender.com/api/stores"
```

**Status:** 200 OK

**4.2 View Store Details**
**Endpoint:** `GET /api/stores/:id`

```bash
curl -X GET "https://mzinga-delivery02-t6rg.onrender.com/api/stores/5"
```

**Status:** 200 OK

---

### 5. Product Management (Verified)

**5.1 Create Product**
**Endpoint:** `POST /api/products`

```bash
curl -X POST "https://mzinga-delivery02-t6rg.onrender.com/api/products" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <VENDOR_TOKEN>" \
  -d '{
    "product": {
      "store_id": 5,
      "name": "Tusker Lager",
      "description": "500ml bottle of premium lager",
      "price": 250.00,
      "compare_at_price": 300.00,
      "stock": 100,
      "image_url": "https://example.com/tusker.jpg",
      "category": "Beer",
      "status": "active",
      "ratings": [4.5, 5.0, 4.8],
      "specifications": {
        "volume": "500ml",
        "alcohol_content": "4.2%",
        "type": "Lager"
      }
    }
  }'
```

**Status:** 201 Created

**5.2 View Products by Store**
**Endpoint:** `GET /api/stores/:store_id/products`

```bash
curl -X GET "https://mzinga-delivery02-t6rg.onrender.com/api/stores/5/products"
```

**Status:** 200 OK

**5.3 View Single Product**
**Endpoint:** `GET /api/products/:id`

```bash
curl -X GET "https://mzinga-delivery02-t6rg.onrender.com/api/products/1"
```

**Status:** 200 OK

**5.4 Update Product**
**Endpoint:** `PATCH /api/products/:id`

```bash
curl -X PATCH "https://mzinga-delivery02-t6rg.onrender.com/api/products/1" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <VENDOR_TOKEN>" \
  -d '{
    "product": {
      "price": 230.00,
      "stock": 120,
      "status": "active"
    }
  }'
```

**Status:** 200 OK

**5.5 Delete Product**
**Endpoint:** `DELETE /api/products/:id`

```bash
curl -X DELETE "https://mzinga-delivery02-t6rg.onrender.com/api/products/1" \
  -H "Authorization: Bearer <VENDOR_TOKEN>"
```

**Status:** 204 No Content

---

### 6. Order Lifecycle (Verified)

**6.1 Create Order (Customer)**
**Endpoint:** `POST /api/orders`

```bash
curl -X POST "https://mzinga-delivery02-t6rg.onrender.com/api/orders" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <CUSTOMER_TOKEN>" \
  -d '{
    "order": {
      "store_id": 5,
      "items": [
        {"product_id": 1, "quantity": 2, "subtotal": 500.00}
      ]
    }
  }'
```

**Status:** 201 Created

**6.2 Accept Order (Vendor)**
**Endpoint:** `PATCH /api/orders/:id/accept`

```bash
curl -X PATCH "https://mzinga-delivery02-t6rg.onrender.com/api/orders/1/accept" \
  -H "Authorization: Bearer <VENDOR_TOKEN>"
```

**Status:** 200 OK

**6.3 Mark Ready (Vendor)**
**Endpoint:** `PATCH /api/orders/:id/ready`

```bash
curl -X PATCH "https://mzinga-delivery02-t6rg.onrender.com/api/orders/1/ready" \
  -H "Authorization: Bearer <VENDOR_TOKEN>"
```

**Status:** 200 OK (Status -> `ready_for_pickup`)

**6.4 Handover (Vendor)**
**Endpoint:** `PATCH /api/orders/:id/handover`

```bash
curl -X PATCH "https://mzinga-delivery02-t6rg.onrender.com/api/orders/1/handover" \
  -H "Authorization: Bearer <VENDOR_TOKEN>"
```

**Status:** 200 OK (Status -> `picked_up`)

**6.5 Confirm Delivery (Customer)**
**Endpoint:** `POST /api/orders/:id/confirm`

```bash
curl -X POST "https://mzinga-delivery02-t6rg.onrender.com/api/orders/1/confirm" \
  -H "Authorization: Bearer <CUSTOMER_TOKEN>"
```

**Status:** 200 OK

---

### 7. Rider Management (Verified)

**7.1 List Deliveries**
**Endpoint:** `GET /api/rider/deliveries`

```bash
curl -X GET "https://mzinga-delivery02-t6rg.onrender.com/api/rider/deliveries" \
  -H "Authorization: Bearer <RIDER_TOKEN>"
```

**Status:** 200 OK

**7.2 Accept Request**
**Endpoint:** `POST /api/rider/requests/:id/accept`

```bash
curl -X POST "https://mzinga-delivery02-t6rg.onrender.com/api/rider/requests/1/accept" \
  -H "Authorization: Bearer <RIDER_TOKEN>"
```

**Status:** 200 OK

**7.3 Mark Delivered**
**Endpoint:** `PATCH /api/rider/deliveries/:id/status`

```bash
curl -X PATCH "https://mzinga-delivery02-t6rg.onrender.com/api/rider/deliveries/1/status" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <RIDER_TOKEN>" \
  -d '{"status": "delivered"}'
```

**Status:** 200 OK

---

### 8. Cart Management (Verified)

**8.1 Get Cart**
**Endpoint:** `GET /api/cart`

```bash
curl -X GET "https://mzinga-delivery02-t6rg.onrender.com/api/cart" \
  -H "Authorization: Bearer <CUSTOMER_TOKEN>"
```

**Status:** 200 OK

**8.2 Add Item**
**Endpoint:** `POST /api/cart/items`

```bash
curl -X POST "https://mzinga-delivery02-t6rg.onrender.com/api/cart/items" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <CUSTOMER_TOKEN>" \
  -d '{"product_id": 1, "quantity": 1}'
```

**Status:** 200 OK

---

### 9. Notifications (Verified)

**9.1 List Notifications**
**Endpoint:** `GET /api/notifications`

```bash
curl -X GET "https://mzinga-delivery02-t6rg.onrender.com/api/notifications" \
  -H "Authorization: Bearer <TOKEN>"
```

**Status:** 200 OK

**9.2 Mark as Read**
**Endpoint:** `PATCH /api/notifications/:id/read`

```bash
curl -X PATCH "https://mzinga-delivery02-t6rg.onrender.com/api/notifications/1/read" \
  -H "Authorization: Bearer <TOKEN>"
```

**Status:** 200 OK
