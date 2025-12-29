# 🚀 Mzinga Delivery Deployment Guide

This guide documents the process to deploy the Mzinga Delivery backend to **Fly.io** when you are ready.

## Prerequisites

- [x] **Fly CLI Installed**: You have `flyctl` installed.
- [x] **App Initialized**: `Dockefile` and release scripts are generated.
- [ ] **Valid Payment Method**: You need to add a card to Fly.io to unlock the free tier (they use it for identity verification).

---

## 🛑 Step 1: Login & Add Payment

When your card is ready, run:

```bash
fly auth login
```

This will open your browser. Sign in and ensure your billing information is updated.

---

## 🚀 Step 2: Initialize the App

Run the launch command to set up the app on Fly.io servers:

```bash
fly launch
```

**Recommended Settings when asked:**

- **App Name:** `mzinga-delivery-backend` (or similar)
- **Region:** `jnb` (Johannesburg) is closest to Kenya, or `lhr` (London).
- **Database:** **Yes**, set up a Postgres database (Development / Hobby plan is free).
- **Redis:** No (unless you want it later).
- **Deploy now?** **NO** (We need to set secrets first).

---

## 🔑 Step 3: Set Secrets (Environment Variables)

Copy your M-Pesa keys and other secrets to Fly.io. Run this command (replace values with your real keys):

```bash
fly secrets set \
  SECRET_KEY_BASE=$(mix phx.gen.secret) \
  MPESA_CONSUMER_KEY="your_consumer_key" \
  MPESA_CONSUMER_SECRET="your_consumer_secret" \
  MPESA_PASSKEY="your_passkey" \
  MPESA_INITIATOR_PASSWORD="your_initiator_password" \
  PHX_HOST="your-app-name.fly.dev"
```

> [!IMPORTANT] > **Database Configuration**:
> If you are using Supabase (Transaction Pooler), we have already configured `prepare: :unnamed` in `config/runtime.exs`. This is critical for preventing connection errors.

---

## 📦 Step 4: Deploy

Final step to push your code and start the server:

```bash
fly deploy
```

---

## 🧪 Local Docker Testing (Optional)

If you want to test the production build locally before deploying:

```bash
# Start Database and Backend
docker compose up
```

The app will be available at `http://localhost:4000`.
