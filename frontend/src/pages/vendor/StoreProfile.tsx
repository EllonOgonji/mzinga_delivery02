import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { VendorLayout } from "@/components/vendor/VendorLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search, Pencil, Trash2, Copy, Loader } from "lucide-react";
import { Link } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { getVendorShops } from "@/data/shopData";
import { Shop } from "@/types";

const ShopProfile = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProducts, setSelectedProducts] = useState<number[]>([]);
  const [userData, setUserData] = useState<any>(JSON.parse(localStorage.getItem('user') || '{}'));

  const { data: shopData, isLoading: isShopDataLoading } = useQuery({
    queryKey: ['store', 'index', userData.id],
    queryFn: async () => {
      const {data} = await getVendorShops(userData.id)
      return data.data[0]
    }
  });

  const getActiveColour = (isActive: boolean) => {
    if (!isActive) return "text-red-500";
    return "text-green-500";
  };

  return (
    <VendorLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-end gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-xl md:text-3xl font-bold">Shop Profile</h1>
          </div>
          <Link to="/vendor/shop-profile/edit">
            <Button>
              Edit shop
            </Button>
          </Link>
        </div>

        {/* Products Table */}
        {isShopDataLoading ? 
          (   
            <div className="text-center py-16 flex justify-center items-center h-96">
              <Loader className="animate-spin h-5 w-5 mr-3" />
            </div>
          ) : 
          <>
            <div className="border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                <TableRow>
                    <TableCell className="font-medium">
                        {shopData?.name}
                    </TableCell>

                    <TableCell className="font-medium">
                        {shopData?.address}
                    </TableCell>

                    <TableCell>
                        <span className={`font-medium ${getActiveColour(shopData?.is_verified)}`}>
                            {shopData?.is_verified ? "Active" : "Inactive"}
                        </span>
                    </TableCell>

                </TableRow>
                </TableBody>
              </Table>
            </div>
          </>
        }

      </div>
    </VendorLayout>
  );
};

export default ShopProfile;
