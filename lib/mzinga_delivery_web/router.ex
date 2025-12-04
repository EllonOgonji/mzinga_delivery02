defmodule MzingaDeliveryWeb.Router do
  use MzingaDeliveryWeb, :router

  pipeline :api do
    plug :accepts, ["json"]
    plug CORSPlug
  end

  pipeline :auth do
    plug MzingaDeliveryWeb.Auth.Pipeline
  end

  # Health Check

  scope "/", MzingaDeliveryWeb do
    pipe_through :api
    get "/", HealthController, :index
  end

  # PUBLIC API ROUTES

  scope "/api", MzingaDeliveryWeb do
    pipe_through :api

    # Product filters
    get "/products/filter", ProductFilterController, :filter
    get "/products/filter/options", ProductFilterController, :filter_options

    # Store filter
    get "/stores/filter", StoreFilterController, :filter

    # Auth public endpoints
    post "/auth/register", AuthController, :register
    post "/auth/login", AuthController, :login

    # M-Pesa callback
    post "/payments/callback", PaymentController, :mpesa_callback

    # PUBLIC endpoint: Verified stores
    get "/stores/verified", StoreController, :verified
  end

  # PROTECTED API ROUTES (AUTH REQUIRED)

  scope "/api", MzingaDeliveryWeb do
    pipe_through [:api, :auth]

    # Auth
    get "/auth/me", AuthController, :me
    post "/auth/logout", AuthController, :logout

    # Store management
    resources "/stores", StoreController, only: [:index, :show, :create, :update, :delete]

    # Store verification (admin-only should be checked inside controller)
    patch "/stores/:id/verify", StoreController, :verify
    patch "/stores/:id/unverify", StoreController, :unverify

    # Store products
    get "/stores/:store_id/products", ProductController, :index

    # Products
    resources "/products", ProductController, only: [:show, :create, :update, :delete]

    # Orders
    resources "/orders", OrderController, only: [:index, :show, :create]
    patch "/orders/:id/accept", OrderController, :accept
    patch "/orders/:id/reject", OrderController, :reject

    # Notifications
    get "/notifications", NotificationController, :index
    get "/notifications/unread", NotificationController, :unread
    patch "/notifications/:id/read", NotificationController, :mark_as_read
    patch "/notifications/read_all", NotificationController, :mark_all_as_read
  end
end
