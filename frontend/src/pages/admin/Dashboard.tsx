import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DollarSign,
  Users,
  Store,
  ShoppingCart,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Eye,
  Package,
  AlertCircle,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useQuery, useQueryClient} from "@tanstack/react-query";
import { getDashboardStats } from "@/data/adminData";

export default function AdminDashboard() {

  const { data: stats } = useQuery({
    queryKey: ['admin', 'dashboard'],
    queryFn: async () => {
      return await getDashboardStats();
    }
  });

  console.log("Dashboard stats:", stats);

  const kpiData = [
    {
      title: "Total Verified Shops",
      value: stats?.verified_shops,
      change: "",
      trend: "up",
      icon: Store,
      description: "",
      link: "/admin/shops",
    },
    {
      title: "Shops Pending Approval",
      value: stats?.unverified_shops,
      change: "",
      trend: "up",
      icon: Store,
      description: "",
      link: "/admin/shops",
    },
    {
      title: "Total Orders",
      value: stats?.total_order_value,
      change: "",
      trend: "up",
      icon: ShoppingCart,
      description: "vs last month",
    },
    {
      title: "Revenue",
      value: 0.1*stats?.total_order_value,
      change: "",
      trend: "up",
      icon: DollarSign,
      description: "vs last month",
    }
  ];

  const recentActivity = [
    {
      type: "shop",
      title: "New shop registration",
      description: "Fresh Mart - needs approval",
      time: "5 mins ago",
      action: "/admin/shops",
      badge: "pending",
    },
    {
      type: "user",
      title: "New user sign-up",
      description: "John Doe registered",
      time: "12 mins ago",
      action: "/admin/users",
    },
    {
      type: "order",
      title: "High-value order",
      description: "Order #12345 - $850.00",
      time: "23 mins ago",
      action: "/admin/orders",
      badge: "high-value",
    },
    {
      type: "product",
      title: "Product flagged",
      description: "Product ID #789 reported by user",
      time: "1 hour ago",
      action: "/admin/products",
      badge: "flagged",
    },
    {
      type: "shop",
      title: "Shop suspended",
      description: "Quick Eats - policy violation",
      time: "2 hours ago",
      action: "/admin/shops",
      badge: "alert",
    },
  ];

  const recentOrders = [
    {
      orderNumber: "#ORD-12345",
      customer: "John Doe",
      date: "2024-01-15 14:30",
      items: 3,
      total: "$125.50",
      status: "completed",
    },
    {
      orderNumber: "#ORD-12344",
      customer: "Jane Smith",
      date: "2024-01-15 13:45",
      items: 5,
      total: "$89.00",
      status: "preparing",
    },
    {
      orderNumber: "#ORD-12343",
      customer: "Bob Johnson",
      date: "2024-01-15 12:20",
      items: 2,
      total: "$45.00",
      status: "pending",
    },
    {
      orderNumber: "#ORD-12342",
      customer: "Alice Brown",
      date: "2024-01-15 11:10",
      items: 4,
      total: "$210.00",
      status: "delivered",
    },
    {
      orderNumber: "#ORD-12341",
      customer: "Charlie Wilson",
      date: "2024-01-15 10:05",
      items: 1,
      total: "$35.00",
      status: "cancelled",
    },
  ];

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      completed: "bg-green-500/10 text-green-500",
      preparing: "bg-blue-500/10 text-blue-500",
      pending: "bg-orange-500/10 text-orange-500",
      delivered: "bg-green-500/10 text-green-500",
      cancelled: "bg-red-500/10 text-red-500",
    };
    return colors[status] || "";
  };

  const getBadgeVariant = (badge: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      pending: "secondary",
      "high-value": "default",
      flagged: "destructive",
      alert: "destructive",
    };
    return variants[badge] || "outline";
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          {/* <h1 className="text-3xl font-bold tracking-tight">Welcome back, Admin!</h1> */}
          <p className="text-muted-foreground mt-1">
            {new Date().toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>
        <Select defaultValue="month">
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select period" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All time</SelectItem>
            <SelectItem value="week">Last Week</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
        {kpiData.map((kpi) => (
          <Card key={kpi.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{kpi.title}</CardTitle>
              <kpi.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{kpi.value}</div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                <span
                  className={`flex items-center ${
                    kpi.trend === "up" ? "text-green-500" : "text-red-500"
                  }`}
                >
                  {kpi.trend === "up" ? (
                    <ArrowUpRight className="h-3 w-3 mr-1" />
                  ) : (
                    <ArrowDownRight className="h-3 w-3 mr-1" />
                  )}
                  {kpi.change}
                </span>
                <span>{kpi.description}</span>
                {kpi.link && (
                  <Link to={kpi.link} className="ml-auto text-primary hover:underline">
                    View
                  </Link>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {/* Recent Orders */}
        {/* <Card className="md:col-span-1">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Recent Orders</CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link to="/admin/orders">View All</Link>
            </Button>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order #</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentOrders.map((order) => (
                  <TableRow key={order.orderNumber}>
                    <TableCell className="font-medium">
                      <Link
                        to={`/admin/orders`}
                        className="text-primary hover:underline"
                      >
                        {order.orderNumber}
                      </Link>
                    </TableCell>
                    <TableCell>{order.customer}</TableCell>
                    <TableCell>{order.total}</TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(order.status)}>
                        {order.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card> */}

        {/* Recent Activity Feed */}
        {/* <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
                    {activity.type === "shop" && <Store className="h-4 w-4" />}
                    {activity.type === "user" && <Users className="h-4 w-4" />}
                    {activity.type === "order" && <ShoppingCart className="h-4 w-4" />}
                    {activity.type === "product" && <Package className="h-4 w-4" />}
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium">{activity.title}</p>
                      {activity.badge && (
                        <Badge variant={getBadgeVariant(activity.badge)} className="text-xs">
                          {activity.badge}
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {activity.description}
                    </p>
                    <p className="text-xs text-muted-foreground">{activity.time}</p>
                  </div>
                  <Button variant="ghost" size="sm" asChild>
                    <Link to={activity.action}>
                      <Eye className="h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card> */}
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <Button variant="outline" className="h-20" asChild>
              <Link to="/admin/shops">
                <div className="flex flex-col items-center gap-2">
                  <Store className="h-6 w-6" />
                  <span>Approve Shops</span>
                </div>
              </Link>
            </Button>
            <Button variant="outline" className="h-20" asChild>
              <Link to="/admin/products">
                <div className="flex flex-col items-center gap-2">
                  <Package className="h-6 w-6" />
                  <span>Review Products</span>
                </div>
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
