# API Verification Status & Examples

**Deployed Base URL:** `https://mzinga-delivery-2rkz.onrender.com`
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

### 6. Orders (Production Report)

**6.1 Create Order (Customer)**
**Endpoint:** `POST /api/orders`
**Status:** ❌ Failed (Environment Transaction Logic)
_Diagnosis: The database now has the correct schema (via diagnostics), but the code hits a `in_failed_sql_transaction` error during execution. This indicates a deeper issue with transaction handling in the production environment that cannot be resolved without server access/logs._

**6.2 List Orders (Customer)**
**Endpoint:** `GET /api/orders`
**Status:** ⚠️ Untested (Blocked by Order Creation failure)

---

### 7. Rider Assignment (Production Verified)

**7.0 Register Rider**
**Endpoint:** `POST /api/auth/register`
**Status:** ✅ 200 OK (Verified on Production)

**7.1 Update Availability**
**Endpoint:** `PATCH /api/rider/status`
**Status:** ✅ 200 OK (Verified on Production)

```bash
curl -X PATCH "https://mzinga-delivery-2rkz.onrender.com/api/rider/status" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <RIDER_TOKEN>" \
  -d '{
    "is_available": true,
    "last_lat": -1.2921,
    "last_lng": 36.8219
  }'
```

**Response (Actual Production):**

```json
{
  "data": {
    "id": 65,
    "role": "rider",
    "email": "rider_live_v2@test.com",
    "full_name": "Rider Live",
    "is_available": true,
    "last_lat": -1.2921,
    "last_lng": 36.8219,
    "phone_number": "254700000002"
  }
}
```

**7.2 List Deliveries**
**Endpoint:** `GET /api/rider/deliveries`
**Status:** ⏳ Pending

**7.3 Update Delivery Status**
**Endpoint:** `PATCH /api/rider/deliveries/:id/status`
**Status:** ⏳ Pending

**7.4 Automatic Rider Assignment (Verified Locally)**
**Trigger:** `POST /api/orders/:id/accept` (Vendor)
**Status:** ✅ Verified (via `AutoAssignmentVerifier`)

- **Result:** System correctly finds closest/available rider and assigns `rider_id` to order.
- **Side Effect:** Rider `is_available` becomes `false`.

---

### 8. Real-Time Notifications (Verified Locally)

**8.1 Rider New Delivery Notification**
**Channel:** `rider:{rider_id}`
**Event:** `new_delivery`
**Status:** ✅ Verified

- **Payload:** `{ order_id: 26, pickup_location: "...", ... }`
- **Trigger:** Successful automatic assignment.

---

### 9. Fixes Pending Deployment

---

### 10. Real-Time Tracking (Verified Locally)

**10.1 Tracking Channel**
**Channel:** `tracking:{order_id}`
**Status:** ✅ Verified (Geospatial)

- **Logic:**
  - Rejects if no riders available.
  - **Old:** Picked first available.
  - **New:** Picks **NEAREST** available rider to the Store.
- **Notification:** Sends WebSocket event `new_delivery` to specific rider channel.` (Broadcast).

* **Persistence:** Updates Rider's `last_lat/lng` in DB.

---

### 14. Geospatial Search (Verified Locally)

**14.1 Search Stores by Location**
**Endpoint:** `GET /api/stores?lat=-1.29&lng=36.82&radius=5`
**Status:** ✅ Verified (Geospatial)

- **Behavior:** Returns stores within `radius` km, sorted by distance.
- **Result:** Verified that stores > radius are excluded.

---

### 15. Rating System (Verified Locally)

**15.1 Create Review**
**Endpoint:** `POST /api/reviews`
**Status:** ✅ Verified

- **Validation:** Can only rate if `delivery_status` is `delivered`.
- **Integrity:** One review per order (Unique Constraint).
- **Linkage:** Automagically links Customer -> Order -> Rider.
