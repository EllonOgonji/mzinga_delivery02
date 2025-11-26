defmodule MzingaDeliveryWeb.Router do
  use MzingaDeliveryWeb, :router

  pipeline :api do
    plug :accepts, ["json"]
    plug CORSPlug
  end

  pipeline :auth do
    plug MzingaDeliveryWeb.Auth.Pipeline
  end

  # health check route
  scope "/", MzingaDeliveryWeb do
    pipe_through :api
    get "/", HealthController, :index
  end

  # PUBLIC API ROUTES
  scope "/api", MzingaDeliveryWeb do
    pipe_through :api

    # product filters
    get "/products/filter", ProductFilterController, :filter
    get "/products/filter/options", ProductFilterController, :filter_options

    # stores filter
    get "/stores/filter", StoreFilterController, :filter

    # Auth public endpoints
    post "/auth/register", AuthController, :register
    post "/auth/login", AuthController, :login

    # M-Pesa callback
    post "/payments/callback", PaymentController, :mpesa_callback
  end

  # PROTECTED API ROUTES
  scope "/api", MzingaDeliveryWeb do
    pipe_through [:api, :auth]

    # Auth
    get "/auth/me", AuthController, :me
    post "/auth/logout", AuthController, :logout

    # Stores
    resources "/stores", StoreController, only: [:index, :show, :create, :update, :delete]
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
