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
import { VendorLayout } from "@/components/vendor/VendorLayout";

const VendorSettings = () => {
  const { toast } = useToast();
  const { user} = useAuth()
  const [loading, setLoading] = useState(false)
  const [userInfo, setUserInfo] = useState<UserInfo>(user ? (user as UserInfo) : {full_name: "", phone_number: "", avatar_url: ""})

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

  const copyReferralCode = () => {
    navigator.clipboard.writeText(user.referralCode);
    toast({ description: "Referral code copied!" });
  };

  return (
    <VendorLayout>
        <div className="space-y-6">
            <main className="w-full mx-auto">
                <div className="w-full h-full">
                  {/* Main Content */}
                  <div className="">
                    <div className="md:space-y-6">
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
                  </div>
                </div>
            </main>
        </div>
    </VendorLayout>
  );
};

export default VendorSettings;