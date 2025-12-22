import { VendorLayout } from "@/components/vendor/VendorLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DollarSign, ShoppingBag, Eye, Star, TrendingUp, TrendingDown, Package, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { getVendorShops } from "@/data/shopData";

type Shop = {
  id : number;
	vendor_id: number;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  status: string;
  inserted_at: string;
  updated_at: string;
  logo: string;
  banner: string;
  category: string;
  metadata: Record<string, any>;
  is_verified: boolean;
  rejection_reason: string;
  approved_at: string;
  approved_by_id: number;
  rejected_at: string;
  rejected_by_id: number;
}

const Dashboard = () => {
  const [userData, setUserData] = useState(JSON.parse(localStorage.getItem("user")))
  const { data: shopData } = useQuery({
    queryKey: ['store', 'index', userData.id],
    queryFn: () => getVendorShops(userData.id)
  });

  // Mock data
  const stats = [
    {
      title: "Total Sales",
      value: "$1,234.56",
      change: "+12.5%",
      trend: "up",
      icon: DollarSign,
    },
    {
      title: "Total Orders",
      value: "48",
      change: "+8",
      trend: "up",
      icon: ShoppingBag,
      link: "/vendor/orders",
      linkText: "3 pending fulfillment",
    },
    {
      title: "Shop Views",
      value: "1,234",
      change: "+156 views",
      trend: "up",
      icon: Eye,
    },
    {
      title: "Average Rating",
      value: "4.8 ★",
      subtitle: "(245 reviews)",
      icon: Star,
      link: "/vendor/reviews",
      linkText: "View Reviews",
    },
  ];

  // const shopData?: Shop = {
  //   id: 1,
  //   vendor_id: userData.id,
  //   name: "Mama Yao",
  //   address: "Lurambi",
  //   latitude: -1.2921,
  //   longitude: 36.8219,
  //   status: "open",
  //   inserted_at: "2024-01-15T10:00:00Z",
  //   updated_at: "2024-03-10T12:00:00Z",
  //   logo: "https://example.com/logo.png",
  //   banner: "https://example.com/banner.png",
  //   category: "alcogol and beverages",
  //   metadata: {},
  //   is_verified: true,
  //   rejection_reason: "",
  //   approved_at: "2024-01-20T09:00:00Z",
  //   approved_by_id: 2,
  //   rejected_at: "",
  //   rejected_by_id: 0,
  // };

  const recentOrders = [
    {
      id: "#CST123456",
      customer: "John Doe",
      date: "Mar 15, 2024 2:30 PM",
      items: 3,
      total: "$45.50",
      status: "pending",
    },
    {
      id: "#CST123455",
      customer: "Jane Smith",
      date: "Mar 15, 2024 1:15 PM",
      items: 2,
      total: "$28.00",
      status: "preparing",
    },
    {
      id: "#CST123454",
      customer: "Bob Johnson",
      date: "Mar 15, 2024 11:45 AM",
      items: 5,
      total: "$67.80",
      status: "ready",
    },
  ];

  const lowStockProducts = [
    // { id: 1, name: "Fresh Tomatoes", image: "https://images.unsplash.com/photo-1546094096-0df4bcaaa337?w=100", stock: 5 },
    // { id: 2, name: "Bananas", image: "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=100", stock: 3 },
  ];

  const pendingReviews = [
    // { customer: "Sarah Wilson", rating: 5, text: "Great quality products! Fast delivery.", product: "Organic Apples" },
    // { customer: "Mike Brown", rating: 4, text: "Good service, will order again.", product: "Fresh Milk" },
  ];

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
      pending: { label: "Pending", variant: "default" },
      preparing: { label: "Preparing", variant: "secondary" },
      ready: { label: "Ready", variant: "outline" },
    };
    const config = variants[status] || variants.pending;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  return (
    <VendorLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold">Welcome back, {userData?.full_name} !</h1>
            <p className="text-muted-foreground mt-1">{new Date().toLocaleDateString()}</p>
            <div className="mt-2 flex items-center gap-2">
              {shopData?.status == "open" ? 
              (
                <>
                  <Badge className="bg-green-500">Your shop is Open</Badge>
                  <Button variant="outline" size="sm">Close Shop</Button>
                </>
              ) : 
              (<>
                <Badge className="bg-red-500">Your shop is Closed</Badge>
                <Button variant="outline" size="sm">Open Shop</Button>
              </>)}
            </div>
          </div>
          <Select defaultValue="week">
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="lastMonth">Last Month</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* KPI Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, index) => (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <stat.icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                {stat.subtitle && (
                  <p className="text-xs text-muted-foreground">{stat.subtitle}</p>
                )}
                {stat.change && (
                  <div className="flex items-center gap-1 text-xs mt-1">
                    {stat.trend === "up" ? (
                      <TrendingUp className="h-3 w-3 text-green-500" />
                    ) : (
                      <TrendingDown className="h-3 w-3 text-red-500" />
                    )}
                    <span className={stat.trend === "up" ? "text-green-500" : "text-red-500"}>
                      {stat.change}
                    </span>
                    <span className="text-muted-foreground">vs previous period</span>
                  </div>
                )}
                {stat.link && (
                  <Link to={stat.link} className="text-xs text-primary hover:underline mt-1 inline-block">
                    {stat.linkText}
                  </Link>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Sales Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Sales Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center text-muted-foreground">
              Sales chart visualization would go here
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Recent Orders */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Recent Orders</CardTitle>
              <Link to="/vendor/orders">
                <Button variant="link" size="sm">View All Orders</Button>
              </Link>
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
                    <TableRow key={order.id}>
                      <TableCell className="font-medium">
                        <Link to={`/vendor/orders/${order.id}`} className="text-primary hover:underline">
                          {order.id}
                        </Link>
                      </TableCell>
                      <TableCell>{order.customer}</TableCell>
                      <TableCell>{order.total}</TableCell>
                      <TableCell>{getStatusBadge(order.status)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Low Stock Alerts */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-orange-500" />
                Low Stock Products
              </CardTitle>
            </CardHeader>
            <CardContent>
              {lowStockProducts.length > 0 ? (
                <div className="space-y-3">
                  {lowStockProducts.map((product) => (
                    <div key={product.id} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <img src={product.image} alt={product.name} className="h-10 w-10 rounded object-cover" />
                        <div>
                          <p className="font-medium">{product.name}</p>
                          <p className="text-sm text-muted-foreground">Stock: {product.stock}</p>
                        </div>
                      </div>
                      <Button size="sm">Restock</Button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">All products well stocked!</p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Pending Reviews */}
        <Card>
          <CardHeader>
            <CardTitle>Customer Reviews Needing Response</CardTitle>
          </CardHeader>
          <CardContent>
            {pendingReviews.length > 0 ? (
              <div className="space-y-4">
                {pendingReviews.map((review, index) => (
                  <div key={index} className="flex items-start justify-between border-b pb-4 last:border-0">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <p className="font-medium">{review.customer}</p>
                        <div className="flex">
                          {Array.from({ length: review.rating }).map((_, i) => (
                            <Star key={i} className="h-4 w-4 fill-orange-400 text-orange-400" />
                          ))}
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground">{review.text}</p>
                      <p className="text-xs text-muted-foreground">Product: {review.product}</p>
                    </div>
                    <Button size="sm">Respond</Button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">No pending reviews</p>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Link to="/vendor/products/new">
                <Button className="w-full" variant="outline">
                  <Package className="mr-2 h-4 w-4" />
                  Add New Product
                </Button>
              </Link>
              <Link to="/vendor/orders">
                <Button className="w-full" variant="outline">
                  <ShoppingBag className="mr-2 h-4 w-4" />
                  Manage Orders
                </Button>
              </Link>
              <Link to="/vendor/analytics">
                <Button className="w-full" variant="outline">
                  <Eye className="mr-2 h-4 w-4" />
                  View Analytics
                </Button>
              </Link>
              <Link to="/vendor/shop-profile">
                <Button className="w-full" variant="outline">
                  <Star className="mr-2 h-4 w-4" />
                  Update Shop Hours
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </VendorLayout>
  );
};

export default Dashboard;
