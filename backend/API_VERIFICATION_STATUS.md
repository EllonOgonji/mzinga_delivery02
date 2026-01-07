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

---

## Additional Documentation

### 10. Order Structure Explained

**Conceptual Overview:**

```
Order (belongs to ONE Store)
├── store_id: 5
├── customer_id: 3
├── total_price: 750.00
└── OrderItems (multiple products)
    ├── OrderItem: product_id: 1, quantity: 2, subtotal: 500.00
    └── OrderItem: product_id: 2, quantity: 1, subtotal: 250.00
```

- **Store** is the anchor: Each order belongs to exactly ONE store.
- **Products** become **OrderItems**: Each cart item becomes an order_item with quantity and subtotal.
- **One Store Rule**: Cart enforces that all items must be from the same store.

---

### 11. Cart Management (Complete)

**11.1 Remove Item**
**Endpoint:** `DELETE /api/cart/items/:product_id`

```bash
curl -X DELETE "https://mzinga-delivery02-t6rg.onrender.com/api/cart/items/1" \
  -H "Authorization: Bearer <CUSTOMER_TOKEN>"
```

**Response:**

```json
{ "status": "ok", "message": "Item removed" }
```

**11.2 Clear Cart**
**Endpoint:** `DELETE /api/cart`

```bash
curl -X DELETE "https://mzinga-delivery02-t6rg.onrender.com/api/cart" \
  -H "Authorization: Bearer <CUSTOMER_TOKEN>"
```

**Response:**

```json
{ "status": "ok", "message": "Cart cleared" }
```

---

### 12. Search & Filter (with Pagination)

**12.1 Filter Products**
**Endpoint:** `GET /api/products/filter`
**Query Params:** `search`, `min_price`, `max_price`, `category`, `page`, `limit`

```bash
curl -X GET "https://mzinga-delivery02-t6rg.onrender.com/api/products/filter?search=tusker&min_price=100&max_price=500&page=1&limit=10"
```

**Response:**

```json
{
  "data": [...products...],
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 25
  }
}
```

**12.2 Filter Stores**
**Endpoint:** `GET /api/stores/filter`
**Query Params:** `search`, `min_rating`, `category`, `page`, `limit`

```bash
curl -X GET "https://mzinga-delivery02-t6rg.onrender.com/api/stores/filter?search=liquor&min_rating=4&page=1&limit=10"
```

**12.3 Geospatial Search (Nearby Stores)**
**Endpoint:** `GET /api/stores?lat=<latitude>&lng=<longitude>&radius=<km>`

```bash
curl -X GET "https://mzinga-delivery02-t6rg.onrender.com/api/stores?lat=-1.2921&lng=36.8219&radius=5"
```

**Response:** Stores sorted by distance (nearest first), includes `distance` field in km.

**12.4 Filter Options**
**Endpoint:** `GET /api/products/filter/options`

```bash
curl -X GET "https://mzinga-delivery02-t6rg.onrender.com/api/products/filter/options"
```

**Response:**

```json
{
  "categories": ["Beer", "Wine", "Whiskey"],
  "price_range": { "min": 100, "max": 5000 }
}
```

---

### 13. Order Management (Complete)

**13.1 List Orders (Role-Based)**
**Endpoint:** `GET /api/orders`

- **Customer**: Returns only their orders
- **Vendor**: Returns orders for their stores
- **Admin**: Returns all orders

```bash
curl -X GET "https://mzinga-delivery02-t6rg.onrender.com/api/orders" \
  -H "Authorization: Bearer <TOKEN>"
```

**13.2 Get Single Order**
**Endpoint:** `GET /api/orders/:id`

```bash
curl -X GET "https://mzinga-delivery02-t6rg.onrender.com/api/orders/1" \
  -H "Authorization: Bearer <TOKEN>"
```

**13.3 Reject Order (Vendor)**
**Endpoint:** `PATCH /api/orders/:id/reject`

```bash
curl -X PATCH "https://mzinga-delivery02-t6rg.onrender.com/api/orders/1/reject" \
  -H "Authorization: Bearer <VENDOR_TOKEN>"
```

**Status:** 200 OK

---

### 14. Rider Management (Complete)

**14.1 Reject Request**
**Endpoint:** `POST /api/rider/requests/:id/reject`

```bash
curl -X POST "https://mzinga-delivery02-t6rg.onrender.com/api/rider/requests/1/reject" \
  -H "Authorization: Bearer <RIDER_TOKEN>"
```

**Status:** 200 OK (Dispatches to next nearest rider)

**14.2 Update Availability**
**Endpoint:** `PATCH /api/rider/status`

```bash
curl -X PATCH "https://mzinga-delivery02-t6rg.onrender.com/api/rider/status" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <RIDER_TOKEN>" \
  -d '{"is_available": true}'
```

**Status:** 200 OK

---

### 15. Notifications (Complete)

**15.1 Get Unread Count**
**Endpoint:** `GET /api/notifications/unread`

```bash
curl -X GET "https://mzinga-delivery02-t6rg.onrender.com/api/notifications/unread" \
  -H "Authorization: Bearer <TOKEN>"
```

**Response:**

```json
{ "unread_count": 5 }
```

**15.2 Mark All as Read**
**Endpoint:** `PATCH /api/notifications/read_all`

```bash
curl -X PATCH "https://mzinga-delivery02-t6rg.onrender.com/api/notifications/read_all" \
  -H "Authorization: Bearer <TOKEN>"
```

**Status:** 200 OK

---

### 16. Reviews

**16.1 Create Review (After Delivery)**
**Endpoint:** `POST /api/reviews`

```bash
curl -X POST "https://mzinga-delivery02-t6rg.onrender.com/api/reviews" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <CUSTOMER_TOKEN>" \
  -d '{
    "review": {
      "order_id": 1,
      "rating": 5,
      "comment": "Great service!"
    }
  }'
```

**Status:** 201 Created (Only allowed after order is `delivered`)

**16.2 Get Review**
**Endpoint:** `GET /api/reviews/:id`

```bash
curl -X GET "https://mzinga-delivery02-t6rg.onrender.com/api/reviews/1"
```

**Status:** 200 OK

---

### 17. Admin Store Management (Complete)

**17.1 Create Store (Admin)**
**Endpoint:** `POST /api/admin/stores`

```bash
curl -X POST "https://mzinga-delivery02-t6rg.onrender.com/api/admin/stores" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <ADMIN_TOKEN>" \
  -d '{
    "store": {
      "name": "Admin Created Store",
      "address": "Admin Address",
      "latitude": -1.2921,
      "longitude": 36.8219,
      "vendor_id": 5
    }
  }'
```

**Status:** 201 Created

**17.2 Update Store (Admin)**
**Endpoint:** `PATCH /api/admin/stores/:id`

```bash
curl -X PATCH "https://mzinga-delivery02-t6rg.onrender.com/api/admin/stores/1" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <ADMIN_TOKEN>" \
  -d '{"store": {"name": "Updated Name"}}'
```

**Status:** 200 OK

**17.3 Delete Store (Admin)**
**Endpoint:** `DELETE /api/admin/stores/:id`

```bash
curl -X DELETE "https://mzinga-delivery02-t6rg.onrender.com/api/admin/stores/1" \
  -H "Authorization: Bearer <ADMIN_TOKEN>"
```

**Status:** 204 No Content

**17.4 Reject Store (Admin)**
**Endpoint:** `PATCH /api/admin/stores/:id/reject`

```bash
curl -X PATCH "https://mzinga-delivery02-t6rg.onrender.com/api/admin/stores/1/reject" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <ADMIN_TOKEN>" \
  -d '{"reason": "Incomplete documentation"}'
```

**Status:** 200 OK
