defmodule MzingaDeliveryWeb.Router do
  use MzingaDeliveryWeb, :router

  pipeline :api do
    plug(:accepts, ["json"])
  end

  pipeline :auth do
    plug(MzingaDeliveryWeb.Auth.Pipeline)
  end

  # Health check
  scope "/", MzingaDeliveryWeb do
    pipe_through(:api)
    get("/", HealthController, :index)
  end

  # public routes
  scope "/api", MzingaDeliveryWeb do
    pipe_through(:api)

    # Auth
    post("/auth/register", AuthController, :register)
    post("/auth/login", AuthController, :login)
    post("/auth/forgot_password", AuthController, :forgot_password)
    post("/auth/reset_password", AuthController, :reset_password)

    # Public stores (only approved)
    get("/stores", StoreController, :index)

    # Store filters
    get("/stores/filter", StoreFilterController, :filter)
    get("/stores/filter/options", StoreFilterController, :filter_options)
    get("/stores/:id", StoreController, :show)
    get("/products", ProductController, :index_all)

    # Products by store
    get("/stores/:store_id/products", ProductController, :index)

    # Product filters
    get("/products/filter", ProductFilterController, :filter)
    get("/products/filter/options", ProductFilterController, :filter_options)

    # Public Product Show
    get("/products/:id", ProductController, :show)

    # M-Pesa callback
    post("/payments/callback", PaymentController, :mpesa_callback)
  end

  # auth routes
  scope "/api", MzingaDeliveryWeb do
    pipe_through([:api, :auth])

    # Auth
    get("/auth/me", AuthController, :me)
    put("/auth/me", AuthController, :update_profile)
    post("/auth/logout", AuthController, :logout)

    # Delivery Calculation
    post("/delivery/calculate", DeliveryController, :calculate_fee)

    # Orders
    get("/orders/filter", OrderFilterController, :filter)
    resources("/orders", OrderController, only: [:index, :show, :create])
    patch("/orders/:id/accept", OrderController, :accept)
    patch("/orders/:id/reject", OrderController, :reject)
    patch("/orders/:id/items/:item_id", OrderController, :update_item)
    post("/checkout", CheckoutController, :create)

    # Cart
    get("/cart", CartController, :show)
    post("/cart/items", CartController, :add_item)
    delete("/cart/items/:product_id", CartController, :remove_item)
    delete("/cart", CartController, :delete)

    # Notifications
    get("/notifications", NotificationController, :index)
    get("/notifications/unread", NotificationController, :unread)
    patch("/notifications/:id/read", NotificationController, :mark_as_read)
    patch("/notifications/read_all", NotificationController, :mark_all_as_read)

    # Products
    resources("/products", ProductController, only: [:create, :update, :delete])
    post("/products/:id/rate", ProductController, :rate)
  end

  # vendor routes
  scope "/api/vendor", MzingaDeliveryWeb.Vendor, as: :vendor do
    pipe_through([:api, :auth])

    # Vendor store management
    resources("/stores", StoreController, only: [:index, :show, :create, :update])
  end

  # rider routes
  scope "/api/rider", MzingaDeliveryWeb.Rider, as: :rider do
    pipe_through([:api, :auth])

    get("/orders/available", OrderController, :available_for_pickup)
    get("/orders/assigned", OrderController, :assigned_to_rider)
    post("/orders/:id/pick", OrderController, :pick_order)
    patch("/orders/:id/deliver", OrderController, :deliver)
  end

  # admin routes
  scope "/api/admin", MzingaDeliveryWeb.Admin, as: :admin do
    pipe_through([:api, :auth])

    # Dashboard
    get("/dashboard/stats", DashboardController, :stats)

    # Store Filters
    get("/stores/filter", StoreController, :filter)

    # Store approval management
    get("/stores/pending", StoreController, :pending)
    patch("/stores/:id/approve", StoreController, :approve)
    patch("/stores/:id/reject", StoreController, :reject)

    # All stores management
    resources("/stores", StoreController, only: [:create, :update, :delete])
  end
end
