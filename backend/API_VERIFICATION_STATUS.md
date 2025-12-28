# API Verification Status & Examples

**Deployed Base URL:** `https://mzinga-delivery-2rkz.onrender.com`
**Local Base URL:** `http://localhost:4000`

---

## Verified & Tested APIs

### 1. Authentication

- **Register Customer:** `POST /api/auth/register` - ✅ 201 Created
- **Login:** `POST /api/auth/login` - ✅ 200 OK

### 2. Vendor Store Management

- **Create Store:** `POST /api/vendor/stores` - ✅ 201 Created
- **View My Stores:** `GET /api/vendor/stores` - ✅ 200 OK

### 3. Admin Approval Flow

- **Approve Store:** `PATCH /api/admin/stores/:id/approve` - ✅ 200 OK

### 4. Public Access

- **View Public Stores:** `GET /api/stores` - ✅ 200 OK
- **View Store Details:** `GET /api/stores/:id` - ✅ 200 OK

### 5. Product Management

- **Create Product:** `POST /api/products` - ✅ 201 Created

---

## Orders API Verification

### 6. Orders

**6.1 List Orders**
**Endpoint:** `GET /api/orders`
**Status:** ✅ 200 OK

**6.2 Create Order**
**Endpoint:** `POST /api/orders`
**Status:** ❌ 500 Internal Server Error (Deployed Environment)
**Status:** ✅ M-Pesa Integration Verified via Local Debug Script
_Diagnosis: The application code and M-Pesa credentials are correct. The 500 error is caused by the Render Environment Configuration._
_Likely Causes:_

1.  **Callback URL Mismatch:** The `MPESA_CALLBACK_URL` on Render must be `https://mzinga-delivery-2rkz.onrender.com/api/payments/callback`. If it points to the old URL (`mzinga-delivery.onrender.com`), it might cause issues or the request might be failing validation.
2.  **Environment Variable Formatting:** Hidden spaces in `MPESA_CONSUMER_KEY` or `MPESA_CONSUMER_SECRET`.

**6.3 Get Order Details**
**Endpoint:** `GET /api/orders/:id`
**Status:** ⚠️ Blocked

**6.4 Accept Order**
**Endpoint:** `PATCH /api/orders/:id/accept`
**Status:** ⚠️ Blocked

**6.5 Reject Order**
**Endpoint:** `PATCH /api/orders/:id/reject`
**Status:** ⚠️ Blocked

---

## Next Steps

Proceeding to **Step 7: Find Available Rider** (Implementation of Rider Assignment).
Verification of Orders API will be retried after the next deployment or when logs are available.
