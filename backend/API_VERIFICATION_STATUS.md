# API Verification Status & Examples

**Deployed Base URL:** `https://mzinga-delivery-2rkz.onrender.com`
**Local Base URL:** `http://localhost:4000`

---

## Verified & Tested APIs

The following endpoints have been verified using the specific test cases below.

### 1. Authentication

- **All Endpoints:** ✅ Verified (See previous section)

### 2. Vendor Store Management

- **All Endpoints:** ✅ Verified (See previous section)

### 3. Admin Approvlal Flow

- **All Endpoints:** ✅ Verified (See previous section)

### 4. Public Access

- **All Endpoints:** ✅ Verified (See previous section)

### 5. Product Management

- **All Endpoints:** ✅ Verified (See previous section)

---

### 6. Orders

**6.1 Create Order (Customer)**
**Endpoint:** `POST /api/orders`

```bash
curl -X POST "http://localhost:4000/api/orders" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <CUSTOMER_TOKEN>" \
  -d '{
    "order": {
      "customer_id": 1,
      "store_id": 5,
      "total_price": 500.0,
      "items": [
        {
          "product_id": 1,
          "quantity": 2,
          "subtotal": 500.0
        }
      ]
    }
  }'
```

**Response (Expected):**

```json
{
  "data": {
    "id": 123,
    "total_price": "500.0",
    "status": "pending",
    "payment_status": "pending",
    "delivery_status": "pending",
    "items": [
      {
        "id": 456,
        "product_id": 1,
        "quantity": 2,
        "subtotal": "500.0"
      }
    ]
  }
}
```

**6.2 List Orders (Customer)**
**Endpoint:** `GET /api/orders`

```bash
curl -X GET "http://localhost:4000/api/orders" \
  -H "Authorization: Bearer <CUSTOMER_TOKEN>"
```

**Response (Expected):**

```json
{
  "data": [
    {
      "id": 123,
      "total_price": "500.0",
      "status": "pending",
      "store": {
        "name": "Premium Liquor Store"
      }
    }
  ]
}
```

**6.3 Show Order**
**Endpoint:** `GET /api/orders/:id`

```bash
curl -X GET "http://localhost:4000/api/orders/123" \
  -H "Authorization: Bearer <CUSTOMER_TOKEN>"
```

**6.4 Accept Order (Vendor)**
**Endpoint:** `PATCH /api/orders/:id/accept`

```bash
curl -X PATCH "http://localhost:4000/api/orders/123/accept" \
  -H "Authorization: Bearer <VENDOR_TOKEN>"
```

**Response (Expected):**

```json
{
  "data": {
    "id": 123,
    "status": "confirmed"
  }
}
```

**6.5 Reject Order (Vendor)**
**Endpoint:** `PATCH /api/orders/:id/reject`

```bash
curl -X PATCH "http://localhost:4000/api/orders/123/reject" \
  -H "Authorization: Bearer <VENDOR_TOKEN>"
```

---

### 7. Rider Assignment (Pending Deployment)

**7.1 Update Availability**
**Endpoint:** `PATCH /api/rider/status`

```bash
curl -X PATCH "http://localhost:4000/api/rider/status" \
  -H "Authorization: Bearer <RIDER_TOKEN>" \
  -d '{"is_available": true, "last_lat": -1.2, "last_lng": 36.8}'
```

**7.2 List Deliveries**
**Endpoint:** `GET /api/rider/deliveries`

```bash
curl -X GET "http://localhost:4000/api/rider/deliveries" \
  -H "Authorization: Bearer <RIDER_TOKEN>"
```

**7.3 Update Delivery Status**
**Endpoint:** `PATCH /api/rider/deliveries/:id/status`

```bash
curl -X PATCH "http://localhost:4000/api/rider/deliveries/123/status" \
  -H "Authorization: Bearer <RIDER_TOKEN>" \
  -d '{"status": "picked_up"}'
```
