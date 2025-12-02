# Mzinga Delivery API

## Overview

Mzinga Delivery is a backend service built with Elixir/Phoenix providing
APIs for an e-commerce and delivery platform. It supports store
management, product management, filtering, orders, notifications, and
payment callbacks.

## Base URLs

**Production REST API:**\
https://mzinga-delivery02-t6rg.onrender.com/api

**Development REST API:**\
http://localhost:4000/api

**Production WebSocket:**\
wss://mzinga-delivery02-t6rg.onrender.com/socket/websocket

**Development WebSocket:**\
ws://localhost:4000/socket/websocket

------------------------------------------------------------------------

## API Endpoints

### Authentication

-   `POST /api/auth/register` --- Register user\
-   `POST /api/auth/login` --- Login\
-   `GET /api/auth/me` --- Get user details\
-   `POST /api/auth/logout` --- Logout

### Stores

-   `GET /api/stores` --- List stores\
-   `GET /api/stores/:id` --- View a store\
-   `POST /api/stores` --- Create store\
-   `PATCH /api/stores/:id` --- Update store\
-   `PUT /api/stores/:id` --- Update store\
-   `DELETE /api/stores/:id` --- Delete store

### Products

-   `GET /api/stores/:store_id/products` --- List products under a
    store\
-   `GET /api/products/:id` --- Get product details\
-   `POST /api/products` --- Create product\
-   `PATCH /api/products/:id` --- Update product\
-   `PUT /api/products/:id` --- Update product\
-   `DELETE /api/products/:id` --- Delete product

### Product Filters

-   `GET /api/products/filter` --- Filter products\
-   `GET /api/products/filter/options` --- Filter options

### Stores Filters

-   `GET /api/stores/filter` --- Filter stores

### Orders

-   `GET /api/orders` --- List orders\
-   `GET /api/orders/:id` --- Show order\
-   `POST /api/orders` --- Create order\
-   `PATCH /api/orders/:id/accept` --- Accept order\
-   `PATCH /api/orders/:id/reject` --- Reject order

### Notifications

-   `GET /api/notifications` --- List notifications\
-   `GET /api/notifications/unread` --- List unread notifications\
-   `PATCH /api/notifications/:id/read` --- Mark notification as read\
-   `PATCH /api/notifications/read_all` --- Mark all as read

### Payments (M-Pesa)

-   `POST /api/payments/callback` --- M-Pesa STK callback endpoint

------------------------------------------------------------------------

## Health Check

-   `GET /` --- Returns API health status

------------------------------------------------------------------------

## WebSockets

Phoenix WebSockets allow real‑time notifications and updates for
clients.

-   WebSocket Path: `/socket/websocket`\
-   Used for: Order updates, notifications, store updates

------------------------------------------------------------------------

## Setup Instructions

### Install Dependencies

    mix deps.get

### Create & Migrate Database

    mix ecto.create
    mix ecto.migrate

### Run Server

    iex -S mix phx.server

------------------------------------------------------------------------

## Environment Variables

Example `.env` file:

    MPESA_API_URL="https://api.safaricom.co.ke"
    MPESA_SHORTCODE="600XXX"
    MPESA_PASSKEY="your_prod_passkey"
    MPESA_CONSUMER_KEY="your_prod_consumer_key"
    MPESA_CONSUMER_SECRET="your_prod_consumer_secret"
    MPESA_CALLBACK_URL="https://your-domain.com/api/payments/callback"

------------------------------------------------------------------------

## License

This project belongs to the developer and is only for authorized usage.
