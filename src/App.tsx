import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./contexts/ThemeContext";
import { CartProvider } from "./contexts/CartContext";
import { ShopFilterProvider } from "./contexts/ShopFilterContext";
import Index from "./pages/Index";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import OrderConfirmation from "./pages/OrderConfirmation";
import OrderTracking from "./pages/OrderTracking";
import Profile from "./pages/Profile";
import ShopDirectory from "./pages/ShopDirectory";
import ShopDetail from "./pages/ShopDetail";
import Products from "./pages/Products";
import ProductDetail from "./pages/ProductDetail";
import NotFound from "./pages/NotFound";
import VendorDashboard from "./pages/vendor/Dashboard";
import VendorProducts from "./pages/vendor/Products";
import VendorProductForm from "./pages/vendor/ProductForm";
import VendorOrders from "./pages/vendor/Orders";
import { AdminLayout } from "./components/admin/AdminLayout";
import AdminDashboard from "./pages/admin/Dashboard";
import AdminUsers from "./pages/admin/Users";
import AdminShops from "./pages/admin/Shops";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import ProtectedRoute from "./components/ProtectedRoute";
import ToastFromLocation from "./components/LocationToastHandler";
import VendorProfileForm from "./pages/vendor/ProfileForm";
import VendorProfile from "./pages/vendor/Profile";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <ShopFilterProvider>
        <CartProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <ToastFromLocation />
              <Routes>
                {/* <Route path="/" element={<Index />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/order-confirmation/:orderNumber" element={<OrderConfirmation />} />
                <Route path="/order-tracking/:orderNumber" element={<OrderTracking />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/shops" element={<ShopDirectory />} />
                <Route path="/shop/:id" element={<ShopDetail />} />
                <Route path="/products" element={<Products />} />
                <Route path="/product/:id" element={<ProductDetail />} />
                <Route path="/vendor/dashboard" element={<VendorDashboard />} />
                <Route path="/vendor/products" element={<VendorProducts />} />
                <Route path="/vendor/products/:id" element={<VendorProductForm />} />
                <Route path="/vendor/orders" element={<VendorOrders />} />
                <Route path="/admin" element={<AdminLayout />}>
                  <Route path="dashboard" element={<AdminDashboard />} />
                  <Route path="users" element={<AdminUsers />} />
                  <Route path="shops" element={<AdminShops />} />
                </Route> */}
                <Route path="/auth/login" element={<Login />} />
                <Route path="/auth/register" element={<Register />} />

                <Route element={<ProtectedRoute />}>
                  <Route path="/" element={<ShopDirectory />} />
                  <Route path="/cart" element={<Cart />} />
                  <Route path="/checkout" element={<Checkout />} />
                  <Route path="/order-confirmation/:orderNumber" element={<OrderConfirmation />} />
                  <Route path="/order-tracking/:orderNumber" element={<OrderTracking />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/shops" element={<ShopDirectory />} />
                  <Route path="/shop/:id" element={<ShopDetail />} />
                  <Route path="/products" element={<Products />} />
                  <Route path="/product/:id" element={<ProductDetail />} />
                </Route>

                <Route element={<ProtectedRoute requiredRole="vendor" />}>
                  <Route path="/vendor/dashboard" element={<VendorDashboard />} />
                  <Route path="/vendor/products" element={<VendorProducts />} />
                  <Route path="/vendor/products/:id" element={<VendorProductForm />} />
                  <Route path="/vendor/orders" element={<VendorOrders />} />
                  <Route path="/vendor/shop-profile/edit" element={<VendorProfileForm />} />
                  <Route path="/vendor/shop-profile" element={<VendorProfile />} />
                </Route>

                <Route element={<ProtectedRoute requiredRole="admin" />}>
                  <Route path="/admin" element={<AdminLayout />}>
                    <Route path="dashboard" element={<AdminDashboard />} />
                    <Route path="users" element={<AdminUsers />} />
                    <Route path="shops" element={<AdminShops />} />
                  </Route>
                </Route>
                
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </CartProvider>
      </ShopFilterProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;


