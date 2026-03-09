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
  Loader
} from "lucide-react";
import { mockShops, mockProducts } from "@/data/mockData";
import useAuth from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { getOrders, updateOrderStatus } from "@/data/orderData";
import { Pagination, PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious, } from "@/components/ui/pagination";
import { updateUserInfo } from "@/data/userData";
import { UserInfo } from "@/data/userData";

const Profile = () => {
  const {logout} = useAuth();
  const [activeTab, setActiveTab] = useState("orders");
  const { toast } = useToast();
  const { user} = useAuth()
  const [paginationSettings, setPaginationSettings] = useState({
    page: 1,
    limit: 4,
    total: 0,
    totalPages: 0,
  });
  const [loading, setLoading] = useState(false)
  const [userInfo, setUserInfo] = useState<UserInfo>(user ? (user as UserInfo) : {full_name: "", phone_number: "", avatar_url: ""})

  const { data: orders = [] } = useQuery<Array<any>>({
    queryKey: ['client', 'orders', paginationSettings],
    queryFn: async () => {
      const res = await getOrders(paginationSettings);
       setPaginationSettings(prev => ({
        ...prev,
        total: res.data.meta.total,
        totalPages: Math.ceil(res.data.meta.total / prev.limit)
      }))
      return res.data.data;
    }
  });

  const handleUserInfoUpdate = async () => {
    setLoading(true)

    const res = await updateUserInfo(userInfo)

    if (!res.status){
      toast({
        title: "Error",
        description: "User Information update failed. Please try again",
        variant: "destructive",
      });
      setLoading(false)
      return
    }

    const localUserInfo = JSON.parse(localStorage.getItem("user"))
    localUserInfo.full_name = userInfo.full_name
    localUserInfo.phone_number = userInfo.phone_number
    localStorage.setItem('user',JSON.stringify(localUserInfo))

    toast({
      title: "Success!",
      description: `User information updated successfully`,
    });

    setLoading(false)
  }

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
                  <div
                    className="w-24 h-24 rounded-full mb-4 bg-border"
                  />
                  <h3 className="font-semibold text-lg">{userInfo.full_name}</h3>
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                </div>

                <Separator className="my-4" />

                <nav className="space-y-2">
                  {[
                    { id: "orders", icon: Package, label: "My Orders" },
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
                  <Button variant="ghost" className="w-full justify-start text-destructive" onClick={logout}>
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </Button>
                </nav>
              </CardContent>
            </Card>
          </aside>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {activeTab === "orders" && (
              <Card>
                <CardHeader>
                  <CardTitle>My Orders</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                      {orders.map((order) => (
                        <div key={order.id} className="flex items-center justify-between p-4 border-b-2 hover:bg-gray-50 transition-colors">
                          <div className="flex-1">
                            <div className="flex items-center gap-4">
                              {/* Product Image - using first item's image */}
                              <img 
                                src={order.items[0]?.product.image_url || "/placeholder-image.jpg"} 
                                alt={order.items[0]?.product.name || "Product"} 
                                className="w-12 h-12 rounded object-cover"
                              />
                              
                              <div>
                                {/* Order Details */}
                                <div className="flex items-center gap-2">
                                  <p className="font-semibold">#{order.id}</p>
                                  <span className="text-xs px-2 py-1 rounded-full bg-gray-100">
                                    {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                                  </span>
                                </div>
                                
                                {/* Customer Info */}
                                <p className="text-sm font-medium">{order.customer.full_name}</p>
                                
                                {/* Store Name */}
                                <p className="text-xs text-muted-foreground">{order.store.name}</p>
                                
                                {/* Order Date */}
                                <p className="text-xs text-muted-foreground">
                                  {new Date(order.created_at).toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'short',
                                    day: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                  })}
                                </p>
                                
                                {/* First product name (optional) */}
                                <p className="text-xs text-gray-600 mt-1 truncate max-w-[200px]">
                                  {order.items[0]?.product.name}
                                  {order.items.length > 1 && ` +${order.items.length - 1} more`}
                                </p>
                              </div>
                            </div>
                          </div>
                          
                          <div className="text-right">
                            {/* Order Status Badge */}
                            {getStatusBadge(order.order_status)}
                            
                            {/* Payment Status */}
                            <div className="mt-1">
                              <span className={`text-xs px-2 py-1 rounded-full ${
                                order.payment_status === 'paid' 
                                  ? 'bg-green-100 text-green-700' 
                                  : order.payment_status === 'failed'
                                  ? 'bg-red-100 text-red-700'
                                  : 'bg-yellow-100 text-yellow-700'
                              }`}>
                                {order.payment_status}
                              </span>
                            </div>
                            
                            {/* Total Price */}
                            <p className="text-lg font-bold mt-2">
                              KES {parseFloat(order.total_price).toLocaleString()}
                            </p>
                            
                            {/* Last Updated */}
                            <p className="text-xs text-muted-foreground mt-1">
                              Updated: {new Date(order.updated_at).toLocaleTimeString()}
                            </p>
                          </div>
                        </div>
                      ))}

                      <div>
                        {/* Pagination */}
                        {(paginationSettings.total / paginationSettings.limit) > 1 && (
                          <Pagination className="mt-8">
                            <PaginationContent>
                              <PaginationItem>
                                <PaginationPrevious
                                  href="#"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    if (paginationSettings.page > 1) {
                                      setPaginationSettings(prev => ({ ...prev, page: prev.page - 1 }));
                                    }
                                  }}
                                  className={paginationSettings.page === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                                />
                              </PaginationItem>
          
                              {[...Array(paginationSettings.totalPages)].map((_, i) => {
                                const pageNum = i + 1;
                                // Show first, last, current, and adjacent pages
                                if (
                                  pageNum === 1 ||
                                  pageNum === paginationSettings.totalPages ||
                                  (pageNum >= paginationSettings.page - 1 && pageNum <= paginationSettings.page + 1)
                                ) {
                                  return (
                                    <PaginationItem key={pageNum}>
                                      <PaginationLink
                                        href="#"
                                        onClick={(e) => {
                                          e.preventDefault();
                                          setPaginationSettings(prev => ({ ...prev, page: pageNum }));
                                        }}
                                        isActive={paginationSettings.page === pageNum}
                                        className="cursor-pointer"
                                      >
                                        {pageNum}
                                      </PaginationLink>
                                    </PaginationItem>
                                  );
                                } else if (
                                  pageNum === paginationSettings.page - 2 ||
                                  pageNum === paginationSettings.page + 2
                                ) {
                                  return (
                                    <PaginationItem key={pageNum}>
                                      <PaginationEllipsis />
                                    </PaginationItem>
                                  );
                                }
                                return null;
                              })}
          
                              <PaginationItem>
                                <PaginationNext
                                  href="#"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    if (paginationSettings.page < paginationSettings.totalPages) {
                                      setPaginationSettings(prev => ({ ...prev, page: prev.page + 1 }));
                                    }
                                  }}
                                  className={paginationSettings.page === paginationSettings.totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                                />
                              </PaginationItem>
                            </PaginationContent>
                          </Pagination>
                        )}
                      </div>
                    </div>
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
                      <Input defaultValue={userInfo.full_name} onChange={(e) => setUserInfo({...userInfo, full_name: e.target.value})} />
                    </div>
                    <div>
                      <Label>Phone Number</Label>
                      <Input defaultValue={userInfo.phone_number} onChange={(e) => setUserInfo({...userInfo, phone_number: e.target.value})} />
                    </div>
                    <Button className="w-[4em]" onClick={handleUserInfoUpdate}>{loading ? <Loader className="animate-spin h-5 w-5" /> : 'Save'}</Button>
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