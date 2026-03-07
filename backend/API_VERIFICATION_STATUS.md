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

**3.3 Reject Store**
**Endpoint:** `PATCH /api/admin/stores/:id/reject`

```bash
curl -X PATCH "https://mzinga-delivery02-t6rg.onrender.com/api/admin/stores/5/reject" \
  -H "Authorization: Bearer <ADMIN_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "reason": "Store does not meet requirements"
  }'
```

**Status:** 200 OK (Status changes to `rejected`)

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

**5.6 Rate Product**
**Endpoint:** `POST /api/products/:id/rate`
**Method:** Pass the `rating` for the product in the request body. (Currently does not require Auth Token).

```bash
curl -X POST "https://mzinga-delivery02-t6rg.onrender.com/api/products/1/rate" \
  -H "Content-Type: application/json" \
  -d '{
    "rating": 4.5
  }'
```

**Status:** 200 OK (Returns updated Product JSON)

---

### 6. Order Workflow (New Features)

**6.1 Update Order Item Status (Vendor)**
**Endpoint:** `PATCH /api/orders/:id/items/:item_id`

```bash
curl -X PATCH "https://mzinga-delivery02-t6rg.onrender.com/api/orders/72/items/50" \
  -H "Authorization: Bearer <VENDOR_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{"status": "ready"}'
```

**Status:** 200 OK (Returns updated Order JSON)

**6.2 Pick Order (Rider)**
**Endpoint:** `POST /api/orders/:id/pick`

```bash
curl -X POST "https://mzinga-delivery02-t6rg.onrender.com/api/orders/72/pick" \
  -H "Authorization: Bearer <RIDER_TOKEN>" \
  -H "Content-Type: application/json"
```

**Status:** 200 OK (Returns updated Order JSON with rider assigned)

---

## Not Yet Tested / Pending Verification

### Orders (Auth Required)

- `GET /api/orders` (List Orders)
- `POST /api/orders` (Create Order)
- `GET /api/orders/:id` (Order Details)
- `PATCH /api/orders/:id/accept` (Accept Order)
- `PATCH /api/orders/:id/reject` (Reject Order)

### Notifications (Auth Required)

- `GET /api/notifications` (List Notifications)
- `GET /api/notifications/unread` (Unread Count)
- `PATCH /api/notifications/:id/read` (Mark Read)
- `PATCH /api/notifications/read_all` (Mark All Read)

### Payments

- `POST /api/payments/callback` (M-Pesa Callback)

### Real-time

- `WS /live/websocket` (LiveView)
- `WS /socket/websocket` (User Socket)

---

### 7. Image Uploads (Direct-to-Supabase)

There are no dedicated Elixir API endpoints for uploading image files directly. Instead, the frontend uploads images directly to the Supabase Storage bucket (`store-images`) and passes the resulting public URL strings to the existing backend endpoints.

**7.1 Update User Avatar**
**Endpoint:** `PUT /api/users/:id` (or your user update route)
**Method:** Pass the `avatar_url` string in the standard JSON payload.

```json
{
  "user": {
    "avatar_url": "https://[PROJECT_ID].supabase.co/storage/v1/object/public/store-images/avatar.jpg"
  }
}
```

**7.2 Store Logos & Banners**
**Endpoint:** `POST /api/vendor/stores` or `PUT /api/vendor/stores/:id`
**Method:** Pass the `logo` and `banner` string URLs.

```json
{
  "store": {
    "name": "My Premium Store",
    "logo": "https://[PROJECT_ID].supabase.co/storage/v1/object/public/store-images/logo.png",
    "banner": "https://[PROJECT_ID].supabase.co/storage/v1/object/public/store-images/banner.jpg"
  }
}
```

**7.3 Product Images**
**Endpoint:** `POST /api/products` or `PUT /api/products/:id`
**Method:** Pass the `image_url` string.

```json
{
  "product": {
    "name": "Premium Lager",
    "price": 250.0,
    "image_url": "https://[PROJECT_ID].supabase.co/storage/v1/object/public/store-images/beer.jpg"
  }
}
```

---

### 8. Delivery & Logistics

**8.1 Calculate Delivery Fee (Customer)**
**Endpoint:** `POST /api/delivery/calculate`
**Method:** Pass the `store_id` and the customer's delivery destination coordinates (`delivery_lat`, `delivery_lng`).

```bash
curl -X POST "https://mzinga-delivery02-t6rg.onrender.com/api/delivery/calculate" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <CUSTOMER_TOKEN>" \
  -d '{
    "store_id": 5,
    "delivery_lat": "-1.2921",
    "delivery_lng": "36.8219"
  }'
```

**Status:** 200 OK (Returns distance and cost information)

```json
{
  "data": {
    "distance_km": 1.5,
    "delivery_fee": 150.0,
    "duration_text": "12 mins",
    "distance_text": "1.5 km"
  }
}
```
