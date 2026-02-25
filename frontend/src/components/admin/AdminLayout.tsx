import { Link, useLocation, Outlet } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  LayoutDashboard,
  Users,
  Store,
  Package,
  ShoppingCart,
  CreditCard,
  Gift,
  BarChart3,
  Settings,
  Bell,
  Search,
  LogOut,
  User,
  Eye,
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/admin/dashboard" },
  // { icon: Users, label: "Users", path: "/admin/users" },
  { icon: Store, label: "Shops", path: "/admin/shops" },
  // { icon: Package, label: "Products", path: "/admin/products" },
  // { icon: ShoppingCart, label: "Orders", path: "/admin/orders" },
  // { icon: CreditCard, label: "Transactions", path: "/admin/transactions" },
  // { icon: Gift, label: "Rewards", path: "/admin/rewards" },
  // { icon: BarChart3, label: "Analytics", path: "/admin/analytics" },
  // { icon: Settings, label: "Settings", path: "/admin/settings" },
];

export function AdminLayout() {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      {/* Top Bar */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex h-16 items-center gap-4 px-4">
          {/* Mobile Menu Toggle */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? <X /> : <Menu />}
          </Button>

          {/* Logo */}
          <Link to="/admin/dashboard" className="flex items-center gap-2">
            <span className="font-bold text-lg hidden sm:inline-block">Mzinga Delivery Admin</span>
          </Link>

          {/* Search Bar */}
          {/* <div className="flex-1 max-w-md mx-4 hidden md:block">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search users, shops, orders..."
                className="pl-9"
              />
            </div>
          </div> */}

          {/* Right Side Actions */}
          <div className="ml-auto flex items-center gap-2">
            {/* Notifications */}
            {/* <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                  <Bell className="h-5 w-5" />
                  <Badge
                    variant="destructive"
                    className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
                  >
                    3
                  </Badge>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80">
                <DropdownMenuLabel>Platform Alerts</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <div className="space-y-2 p-2">
                  <div className="p-2 hover:bg-accent cursor-pointer">
                    <p className="text-sm font-medium">New shop registration</p>
                    <p className="text-xs text-muted-foreground">Fresh Mart needs approval</p>
                  </div>
                  <div className="p-2 hover:bg-accent cursor-pointer">
                    <p className="text-sm font-medium">High value order</p>
                    <p className="text-xs text-muted-foreground">Order #12345 - $850.00</p>
                  </div>
                  <div className="p-2 hover:bg-accent cursor-pointer">
                    <p className="text-sm font-medium">Product flagged</p>
                    <p className="text-xs text-muted-foreground">Product ID #789 reported</p>
                  </div>
                </div>
              </DropdownMenuContent>
            </DropdownMenu> */}

            {/* Admin Profile */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <User className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Admin Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar Navigation */}
        <aside
          className={cn(
            "fixed inset-y-0 left-0 z-40 w-64 border-r bg-background pt-16 transition-transform duration-300 ease-in-out md:translate-x-0",
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          )}
        >
          <nav className="space-y-1 p-4">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </aside>

        {/* Mobile Overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-30 bg-background/80 backdrop-blur-sm md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main Content */}
        <main className="flex-1 md:pl-64 pt-4">
          <div className="container py-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
