defmodule MzingaDeliveryWeb.Router do
  use MzingaDeliveryWeb, :router

  pipeline :api do
    plug :accepts, ["json"]
    plug CORSPlug
  end

  pipeline :auth do
    plug MzingaDeliveryWeb.Auth.Pipeline
  end

  # Health check
  scope "/", MzingaDeliveryWeb do
    pipe_through :api
    get "/", HealthController, :index
  end

  # public routes
  scope "/api", MzingaDeliveryWeb do
    pipe_through :api

    # Auth
    post "/auth/register", AuthController, :register
    post "/auth/login", AuthController, :login

    # Public stores (only approved)
    get "/stores", StoreController, :index
    get "/stores/:id", StoreController, :show

    # Products by store
    get "/stores/:store_id/products", ProductController, :index

    # Product filters
    get "/products/filter", ProductFilterController, :filter
    get "/products/filter/options", ProductFilterController, :filter_options

    # Store filters
    get "/stores/filter", StoreFilterController, :filter
    get "/stores/filter/options", StoreFilterController, :filter_options

    # M-Pesa callback
    post "/payments/callback", PaymentController, :mpesa_callback
  end

  # auth routes
  scope "/api", MzingaDeliveryWeb do
    pipe_through [:api, :auth]

    # Auth
    get "/auth/me", AuthController, :me
    post "/auth/logout", AuthController, :logout

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

  # vendor routes
  scope "/api/vendor", MzingaDeliveryWeb.Vendor, as: :vendor do
    pipe_through [:api, :auth]

    # Vendor store management
    resources "/stores", StoreController, only: [:index, :show, :create]
  end

  # admin routes
  scope "/api/admin", MzingaDeliveryWeb.Admin, as: :admin do
    pipe_through [:api, :auth]

    # Store approval management
    get "/stores/pending", StoreController, :pending
    patch "/stores/:id/approve", StoreController, :approve
    patch "/stores/:id/reject", StoreController, :reject

    # All stores management
    resources "/stores", StoreController, only: [:create, :update, :delete]
  end
end
