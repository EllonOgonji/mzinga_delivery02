import { useState } from "react";
import { Link } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import {
  LayoutDashboard,
  Package,
  Heart,
  MapPin,
  Gift,
  Star,
  Settings,
  LogOut,
  User,
  Copy,
  Trash2,
  Edit,
  Eye,
  X,
  QrCode,
  Share2,
} from "lucide-react";
import { mockShops, mockProducts } from "@/data/mockData";

const Profile = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const { toast } = useToast();

  // Mock user data
  const user = {
    name: "John Doe",
    email: "john@example.com",
    phone: "+254712345678",
    avatar: "/placeholder.svg",
    referralCode: "JOHN123",
    tokens: 450,
    lastLogin: "March 1, 2024",
  };

  // Mock orders
  const orders = [
    {
      id: "CST123456789",
      date: "March 1, 2024",
      status: "delivered",
      shops: [{ id: 1, name: "Fresh Groceries Hub", logo: "/placeholder.svg" }],
      total: 45.99,
      itemCount: 3,
    },
    {
      id: "CST123456788",
      date: "February 28, 2024",
      status: "out_for_delivery",
      shops: [{ id: 2, name: "TechWorld Electronics", logo: "/placeholder.svg" }],
      total: 249.99,
      itemCount: 1,
    },
    {
      id: "CST123456787",
      date: "February 25, 2024",
      status: "confirmed",
      shops: [{ id: 4, name: "Quick Bites", logo: "/placeholder.svg" }],
      total: 27.98,
      itemCount: 2,
    },
  ];

  // Mock wishlist
  const wishlist = mockProducts.slice(0, 4);

  // Mock addresses
  const [addresses, setAddresses] = useState([
    {
      id: 1,
      nickname: "Home",
      name: "John Doe",
      phone: "+254712345678",
      address: "123 Main Street, Kilimani",
      city: "Nairobi",
      isDefault: true,
    },
    {
      id: 2,
      nickname: "Office",
      name: "John Doe",
      phone: "+254712345678",
      address: "456 Business Park, Westlands",
      city: "Nairobi",
      isDefault: false,
    },
  ]);

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { label: string; variant: "default" | "destructive" | "outline" | "secondary" }> = {
      pending: { label: "Pending", variant: "secondary" },
      confirmed: { label: "Confirmed", variant: "default" },
      out_for_delivery: { label: "Out for Delivery", variant: "default" },
      delivered: { label: "Delivered", variant: "default" },
      cancelled: { label: "Cancelled", variant: "destructive" },
    };
    const config = statusConfig[status] || statusConfig.pending;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const copyReferralCode = () => {
    navigator.clipboard.writeText(user.referralCode);
    toast({ description: "Referral code copied!" });
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1 container py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <aside className="lg:col-span-1">
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col items-center text-center mb-6">
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-24 h-24 rounded-full mb-4"
                  />
                  <h3 className="font-semibold text-lg">{user.name}</h3>
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                  <Button variant="link" size="sm" className="mt-2">
                    Edit Profile
                  </Button>
                </div>

                <Separator className="my-4" />

                <nav className="space-y-2">
                  {[
                    { id: "dashboard", icon: LayoutDashboard, label: "Dashboard" },
                    { id: "orders", icon: Package, label: "My Orders" },
                    { id: "wishlist", icon: Heart, label: "Wishlist" },
                    { id: "addresses", icon: MapPin, label: "Addresses" },
                    { id: "rewards", icon: Gift, label: "Rewards & Referrals" },
                    { id: "reviews", icon: Star, label: "Reviews" },
                    { id: "settings", icon: Settings, label: "Settings" },
                  ].map((item) => (
                    <Button
                      key={item.id}
                      variant={activeTab === item.id ? "default" : "ghost"}
                      className="w-full justify-start"
                      onClick={() => setActiveTab(item.id)}
                    >
                      <item.icon className="w-4 h-4 mr-2" />
                      {item.label}
                    </Button>
                  ))}
                  <Separator className="my-4" />
                  <Button variant="ghost" className="w-full justify-start text-destructive">
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </Button>
                </nav>
              </CardContent>
            </Card>
          </aside>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {activeTab === "dashboard" && (
              <div className="space-y-6">
                <div>
                  <h1 className="text-3xl font-bold">Hello, {user.name}!</h1>
                  <p className="text-muted-foreground">Last login: {user.lastLogin}</p>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <Card>
                    <CardContent className="p-6">
                      <Package className="w-8 h-8 text-primary mb-2" />
                      <p className="text-2xl font-bold">24</p>
                      <p className="text-sm text-muted-foreground">Total Orders</p>
                      <p className="text-xs text-primary">+3 this month</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-6">
                      <Gift className="w-8 h-8 text-primary mb-2" />
                      <p className="text-2xl font-bold">{user.tokens}</p>
                      <p className="text-sm text-muted-foreground">Rewards Tokens</p>
                      <p className="text-xs text-primary">${(user.tokens * 0.1).toFixed(2)}</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-6">
                      <Heart className="w-8 h-8 text-primary mb-2" />
                      <p className="text-2xl font-bold">12</p>
                      <p className="text-sm text-muted-foreground">Wishlist Items</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-6">
                      <Star className="w-8 h-8 text-primary mb-2" />
                      <p className="text-2xl font-bold">8</p>
                      <p className="text-sm text-muted-foreground">Favorite Shops</p>
                    </CardContent>
                  </Card>
                </div>

                {/* Recent Orders */}
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Orders</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {orders.slice(0, 3).map((order) => (
                        <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex-1">
                            <div className="flex items-center gap-4">
                              <img src={order.shops[0].logo} alt="" className="w-12 h-12 rounded" />
                              <div>
                                <p className="font-semibold">#{order.id}</p>
                                <p className="text-sm text-muted-foreground">{order.date}</p>
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            {getStatusBadge(order.status)}
                            <p className="text-lg font-bold mt-2">${order.total}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                    <Button variant="outline" className="w-full mt-4">
                      View All Orders
                    </Button>
                  </CardContent>
                </Card>
              </div>
            )}

            {activeTab === "orders" && (
              <Card>
                <CardHeader>
                  <CardTitle>My Orders</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {orders.map((order) => (
                      <div key={order.id} className="p-4 border rounded-lg">
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <p className="font-semibold">Order #{order.id}</p>
                            <p className="text-sm text-muted-foreground">{order.date}</p>
                          </div>
                          {getStatusBadge(order.status)}
                        </div>
                        <div className="flex items-center gap-4 mb-4">
                          {order.shops.map((shop) => (
                            <div key={shop.id} className="flex items-center gap-2">
                              <img src={shop.logo} alt="" className="w-10 h-10 rounded" />
                              <span className="text-sm">{shop.name}</span>
                            </div>
                          ))}
                        </div>
                        <div className="flex items-center justify-between">
                          <p className="text-lg font-bold">${order.total}</p>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm" asChild>
                              <Link to={`/order-tracking/${order.id}`}>Track Order</Link>
                            </Button>
                            <Button size="sm">Reorder</Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {activeTab === "wishlist" && (
              <Card>
                <CardHeader>
                  <CardTitle>My Wishlist ({wishlist.length} items)</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {wishlist.map((product) => (
                      <div key={product.id} className="border rounded-lg p-4">
                        <div className="flex gap-4">
                          <img src={product.images[0]} alt="" className="w-20 h-20 rounded object-cover" />
                          <div className="flex-1">
                            <h4 className="font-semibold">{product.name}</h4>
                            <p className="text-sm text-muted-foreground">{mockShops.find(s => s.id === product.shopId)?.name}</p>
                            <p className="text-lg font-bold text-primary mt-2">${product.price}</p>
                          </div>
                          <Button variant="ghost" size="icon">
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                        <Button className="w-full mt-4">Add to Cart</Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {activeTab === "addresses" && (
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Saved Addresses</CardTitle>
                  <Button>Add New Address</Button>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {addresses.map((address) => (
                      <div key={address.id} className="border rounded-lg p-4">
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="font-semibold">{address.nickname}</h4>
                          {address.isDefault && <Badge>Default</Badge>}
                        </div>
                        <p className="text-sm mb-1">{address.name}</p>
                        <p className="text-sm mb-1">{address.phone}</p>
                        <p className="text-sm text-muted-foreground mb-4">
                          {address.address}, {address.city}
                        </p>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            <Edit className="w-4 h-4 mr-1" />
                            Edit
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Trash2 className="w-4 h-4 mr-1" />
                            Delete
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {activeTab === "rewards" && (
              <div className="space-y-6">
                <Card className="bg-gradient-hero">
                  <CardContent className="p-6 text-center">
                    <Gift className="w-16 h-16 mx-auto mb-4 text-primary" />
                    <p className="text-4xl font-bold mb-2">{user.tokens}</p>
                    <p className="text-xl text-muted-foreground mb-2">
                      Rewards Tokens = ${(user.tokens * 0.1).toFixed(2)}
                    </p>
                    <p className="text-sm text-muted-foreground">1 token = $0.10</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Refer a Friend, Earn Tokens!</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">Your Referral Code</p>
                          <p className="text-2xl font-bold">{user.referralCode}</p>
                        </div>
                        <Button onClick={copyReferralCode}>
                          <Copy className="w-4 h-4 mr-2" />
                          Copy
                        </Button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Card>
                          <CardContent className="p-4 text-center">
                            <p className="text-2xl font-bold">15</p>
                            <p className="text-sm text-muted-foreground">Friends Referred</p>
                          </CardContent>
                        </Card>
                        <Card>
                          <CardContent className="p-4 text-center">
                            <p className="text-2xl font-bold">8</p>
                            <p className="text-sm text-muted-foreground">Successful Purchases</p>
                          </CardContent>
                        </Card>
                        <Card>
                          <CardContent className="p-4 text-center">
                            <p className="text-2xl font-bold">400</p>
                            <p className="text-sm text-muted-foreground">Tokens Earned</p>
                          </CardContent>
                        </Card>
                      </div>

                      <div>
                        <p className="font-semibold mb-2">Share via:</p>
                        <div className="flex gap-2">
                          <Button variant="outline">WhatsApp</Button>
                          <Button variant="outline">Email</Button>
                          <Button variant="outline">Facebook</Button>
                          <Button variant="outline">
                            <Share2 className="w-4 h-4 mr-2" />
                            More
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {activeTab === "reviews" && (
              <Card>
                <CardHeader>
                  <CardTitle>My Reviews</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-center text-muted-foreground py-8">
                    You haven't written any reviews yet. Purchase products to review them!
                  </p>
                </CardContent>
              </Card>
            )}

            {activeTab === "settings" && (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Profile Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label>Full Name</Label>
                      <Input defaultValue={user.name} />
                    </div>
                    <div>
                      <Label>Email</Label>
                      <Input type="email" defaultValue={user.email} />
                    </div>
                    <div>
                      <Label>Phone Number</Label>
                      <Input defaultValue={user.phone} />
                    </div>
                    <Button>Save Changes</Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Notification Settings</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {[
                      { label: "Order Updates", description: "Receive updates about your orders" },
                      { label: "Promotional Offers", description: "Get notified about deals and offers" },
                      { label: "Price Drop Alerts", description: "Know when wishlist items go on sale" },
                    ].map((item) => (
                      <div key={item.label} className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">{item.label}</p>
                          <p className="text-sm text-muted-foreground">{item.description}</p>
                        </div>
                        <Switch defaultChecked />
                      </div>
                    ))}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Privacy & Security</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label>Current Password</Label>
                      <Input type="password" />
                    </div>
                    <div>
                      <Label>New Password</Label>
                      <Input type="password" />
                    </div>
                    <div>
                      <Label>Confirm New Password</Label>
                      <Input type="password" />
                    </div>
                    <Button>Change Password</Button>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Profile;