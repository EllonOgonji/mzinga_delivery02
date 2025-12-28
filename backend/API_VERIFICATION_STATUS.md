# API Verification Status & Examples

**Deployed Base URL:** `https://mzinga-delivery02-t6rg.onrender.com`
**Local Base URL:** `http://localhost:4000`

---

## Verified & Tested APIs

The following endpoints have been verified using the specific test cases below.

### 1. Authentication

**1.1 Register Customer**
**Endpoint:** `POST /api/auth/register`
**Status:** 201 Created

**1.2 Register Vendor**
**Endpoint:** `POST /api/auth/register`
**Status:** 201 Created

**1.3 Register Admin**
**Endpoint:** `POST /api/auth/register`
**Status:** 201 Created

**1.4 Login (Vendor)**
**Endpoint:** `POST /api/auth/login`
**Status:** 200 OK (Returns JSON with `token`)

**1.5 Get Current User**
**Endpoint:** `GET /api/auth/me`
**Status:** 200 OK

---

### 2. Vendor Store Management (Verified)

**2.1 Create Store**
**Endpoint:** `POST /api/vendor/stores`
**Status:** 201 Created (Status: `pending`)

**2.2 View My Stores**
**Endpoint:** `GET /api/vendor/stores`
**Status:** 200 OK

---

### 3. Admin Approval Flow (Verified)

**3.1 View Pending Stores**
**Endpoint:** `GET /api/admin/stores/pending`
**Status:** 200 OK

**3.2 Approve Store**
**Endpoint:** `PATCH /api/admin/stores/:id/approve`
**Status:** 200 OK (Status changes to `approved`)

---

### 4. Public Access (Verified)

**4.1 View Public Stores**
**Endpoint:** `GET /api/stores`
**Status:** 200 OK

**4.2 View Store Details**
**Endpoint:** `GET /api/stores/:id`
**Status:** 200 OK

---

### 5. Product Management (Verified)

**5.1 Create Product**
**Endpoint:** `POST /api/products`
**Status:** 201 Created

**5.2 View Products by Store**
**Endpoint:** `GET /api/stores/:store_id/products`
**Status:** 200 OK

**5.3 View Single Product**
**Endpoint:** `GET /api/products/:id`
**Status:** 200 OK

**5.4 Update Product**
**Endpoint:** `PATCH /api/products/:id`
**Status:** 200 OK

**5.5 Delete Product**
**Endpoint:** `DELETE /api/products/:id`
**Status:** 204 No Content

---

## Pending Verification (Orders)

The following endpoints were tested but failed on the deployed environment (500 Internal Server Error).
A fix has been applied to `MpesaService` to handle environment issues gracefully.

- `GET /api/orders` (List Orders)
- `POST /api/orders` (Create Order) - **FAILED** (500 Error likely due to missing M-Pesa env vars)
- `GET /api/orders/:id` (Order Details)
- `PATCH /api/orders/:id/accept` (Accept Order)
- `PATCH /api/orders/:id/reject` (Reject Order)
