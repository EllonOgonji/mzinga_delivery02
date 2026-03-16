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

**1.6 Update Current User**
**Endpoint:** `PUT /api/auth/me`
**Method:** Allows any authenticated user to update their personal details. (Password cannot be updated here).

```bash
curl -X PUT "https://mzinga-delivery02-t6rg.onrender.com/api/auth/me" \
  -H "Authorization: Bearer <TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "user": {
      "full_name": "Updated Name",
      "phone_number": "254700000000",
      "avatar_url": "https://example.com/avatar.jpg"
    }
  }'
```

**Status:** 200 OK (Returns updated User JSON)

---

**1.7 Forgot Password**
**Endpoint:** `POST /api/auth/forgot_password`
**Method:** Triggers an email with a reset link if the account exists. Returns success regardless to prevent user enumeration.

```bash
curl -X POST "https://mzinga-delivery02-t6rg.onrender.com/api/auth/forgot_password" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "venom@example.com"
  }'
```

**Status:** 200 OK

---

**1.8 Reset Password**
**Endpoint:** `POST /api/auth/reset_password`
**Method:** Resets user password using the token sent to their email.

```bash
curl -X POST "https://mzinga-delivery02-t6rg.onrender.com/api/auth/reset_password" \
  -H "Content-Type: application/json" \
  -d '{
    "token": "<RESET_TOKEN>",
    "password": "NewPassword123",
    "password_confirmation": "NewPassword123"
  }'
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

**3.4 Update Store Location**
**Endpoint:** `PATCH /api/admin/stores/:id`

```bash
curl -X PATCH "https://mzinga-delivery02-t6rg.onrender.com/api/admin/stores/5" \
  -H "Authorization: Bearer <ADMIN_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "store": {
      "latitude": -1.2921,
      "longitude": 36.8219
    }
  }'
```

**Status:** 200 OK (Returns updated store data)

**3.5 Filter Admin Stores**
**Endpoint:** `GET /api/admin/stores/filter`
**Method:** Allows admins to filter and search through all stores with pagination. Returns full store details including `address`, `latitude`, and `longitude`.

```bash
curl -X GET "https://mzinga-delivery02-t6rg.onrender.com/api/admin/stores/filter?name=Premium&limit=10" \
  -H "Authorization: Bearer <ADMIN_TOKEN>"
```

**Status:** 200 OK

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

**4.3 Filter Public Stores**
**Endpoint:** `GET /api/stores/filter`
**Method:** Public endpoint to search and filter approved stores. Responses now include `address`, `latitude`, and `longitude`.

```bash
curl -X GET "https://mzinga-delivery02-t6rg.onrender.com/api/stores/filter?category=Liquor%20Store&limit=5"
```

**Status:** 200 OK

---

### 5. Product Management (Verified)

_Note: All public product listings (`GET /api/products` and `GET /api/products/filter`) are strictly filtered to only return products belonging to stores that are both **approved** and **verified**._

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

**5.7 Filter & Paginate Products**
**Endpoint:** `GET /api/products/filter`
**Method:** Allows filtering products by various attributes and supports pagination.

```bash
curl -X GET "https://mzinga-delivery02-t6rg.onrender.com/api/products/filter?category=Beer&min_price=100&max_price=500&page=1&limit=10"
```

**Status:** 200 OK (Returns paginated products and metadata including `total`, `page`, `limit`)

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

### 6.3 Rider Workflow (New Features)

**6.3.1 Find Available Orders**
**Endpoint:** `GET /api/rider/orders/available`
**Method:** Fetches a list of unassigned orders that are marked as ready for pickup.

```bash
curl -X GET "https://mzinga-delivery02-t6rg.onrender.com/api/rider/orders/available" \
  -H "Authorization: Bearer <RIDER_TOKEN>"
```

**Status:** 200 OK (Returns a list of available Order JSONs)

**6.3.2 Pick an Order**
**Endpoint:** `POST /api/rider/orders/:id/pick`
**Method:** Assigns the logged-in rider to the specified order to perform the delivery.

```bash
curl -X POST "https://mzinga-delivery02-t6rg.onrender.com/api/rider/orders/72/pick" \
  -H "Authorization: Bearer <RIDER_TOKEN>" \
  -H "Content-Type: application/json"
```

**Status:** 200 OK (Returns updated Order JSON)

**6.3.3 View Assigned Orders**
**Endpoint:** `GET /api/rider/orders/assigned`
**Method:** Retrieves an array of orders that the logged-in rider has picked but not yet delivered.

```bash
curl -X GET "https://mzinga-delivery02-t6rg.onrender.com/api/rider/orders/assigned" \
  -H "Authorization: Bearer <RIDER_TOKEN>"
```

**Status:** 200 OK (Returns a list of assigned Order JSONs)

**6.3.4 Mark Order as Delivered**
**Endpoint:** `PATCH /api/rider/orders/:id/deliver`
**Method:** The rider marks the order as delivered once it reaches the customer.

```bash
curl -X PATCH "https://mzinga-delivery02-t6rg.onrender.com/api/rider/orders/72/deliver" \
  -H "Authorization: Bearer <RIDER_TOKEN>" \
  -H "Content-Type: application/json"
```

**Status:** 200 OK (Returns updated Order JSON with status 'delivered' and broadcasts `order_delivered` WebSocket event to the customer)

---

## Not Yet Tested / Pending Verification

### Orders (Verified)

**6.3 List My Orders (Customer/Vendor/Admin)**
**Endpoint:** `GET /api/orders`
**Method:** Returns orders based on the authenticated user's role.

- **Customer:** Returns all orders placed by the customer.
- **Vendor:** Returns all orders for all stores owned by the vendor.
- **Admin:** Returns all orders in the system.

```bash
curl -X GET "https://mzinga-delivery02-t6rg.onrender.com/api/orders" \
  -H "Authorization: Bearer <TOKEN>"
```

**Status:** 200 OK

**6.4 Get Single Order Details**
**Endpoint:** `GET /api/orders/:id`
**Method:** Returns details for a specific order. User must be auth'd and own the order (or be vendor of the store, or admin).

```bash
curl -X GET "https://mzinga-delivery02-t6rg.onrender.com/api/orders/72" \
  -H "Authorization: Bearer <TOKEN>"
```

**Status:** 200 OK

**6.5 Create Order**
**Endpoint:** `POST /api/orders`
**Method:** Creates an order and initiates an M-Pesa STK push. (Customer Auth Required)

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

---

## Not Yet Tested / Pending Verification

### Order Vendor Actions (Pending)

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

### 7. Cart Management (Auth Required)

These endpoints manage the user's shopping cart. A user can only add items from **one store** at a time. Trying to add an item from a different store returns a `409 Conflict` error.

**7.1 View Cart**
**Endpoint:** `GET /api/cart`

```bash
curl -X GET "https://mzinga-delivery02-t6rg.onrender.com/api/cart" \
  -H "Authorization: Bearer <TOKEN>"
```

**Status:** 200 OK (Returns the cart, its items, and the subtotal)

**7.2 Add Item to Cart**
**Endpoint:** `POST /api/cart/items`

```bash
curl -X POST "https://mzinga-delivery02-t6rg.onrender.com/api/cart/items" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <TOKEN>" \
  -d '{
    "product_id": 1,
    "quantity": 2
  }'
```

**Status:** 201 Created (Returns updated cart)
_Note:_ Returns `409 Conflict` if the product belongs to a different store than what is already in the cart.

**7.3 Remove Item from Cart**
**Endpoint:** `DELETE /api/cart/items/:product_id`

```bash
curl -X DELETE "https://mzinga-delivery02-t6rg.onrender.com/api/cart/items/1" \
  -H "Authorization: Bearer <TOKEN>"
```

**Status:** 200 OK (Returns updated cart)

**7.4 Clear Entire Cart**
**Endpoint:** `DELETE /api/cart`

```bash
curl -X DELETE "https://mzinga-delivery02-t6rg.onrender.com/api/cart" \
  -H "Authorization: Bearer <TOKEN>"
```

**Status:** 204 No Content

---

### 8. Image Uploads (Direct-to-Supabase)

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
**Endpoint:** `POST /api/vendor/stores` or `PATCH /api/vendor/stores/:id` or `PATCH /api/admin/stores/:id`
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

---

### 9. Payments

**9.1 Retry Failed Payment**
**Endpoint:** `POST /api/payments/retry`
**Method:** Allows customers to re-initiate a failed M-Pesa STK push. Supports both individual `order_id` and `checkout_group_id`.

```bash
curl -X POST "https://mzinga-delivery02-t6rg.onrender.com/api/payments/retry" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <CUSTOMER_TOKEN>" \
  -d '{
    "checkout_group_id": "64b2985f-84cf-40ab-ab69-610dc1ad216a",
    "payment_phone": "254712345678"
  }'
```

**Status:** 200 OK (Initiates STK Push and broadcasts `payment_initiated` via WebSocket)

---

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
