import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Search, Eye, Edit, Ban, Trash2, CheckCircle, XCircle, Star } from "lucide-react";
import { mockShops, mockProducts } from "@/data/mockData";
import { useToast } from "@/hooks/use-toast";

export default function AdminShops() {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [selectedShop, setSelectedShop] = useState<typeof mockShops[0] | null>(null);
  const [approvalDialog, setApprovalDialog] = useState<{
    shop: typeof mockShops[0];
    action: "approve" | "reject";
  } | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const { toast } = useToast();

  const filteredShops = mockShops.filter((shop) => {
    const matchesSearch =
      shop.name.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesCategory =
      categoryFilter === "all" || shop.category.includes(categoryFilter);

    return matchesSearch && matchesCategory;
  });

  const pendingShops = filteredShops.filter((shop) => shop.status === "closed");
  const activeShops = filteredShops.filter((shop) => shop.status === "open");
  const suspendedShops = filteredShops.filter((shop) => shop.status === "suspended");

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      active: "bg-green-500/10 text-green-500",
      closed: "bg-orange-500/10 text-orange-500",
      suspended: "bg-red-500/10 text-red-500",
    };
    return colors[status] || "";
  };

  const handleApproveShop = () => {
    if (!approvalDialog) return;
    
    toast({
      title: "Shop Approved",
      description: `${approvalDialog.shop.name} has been approved and is now active.`,
    });
    setApprovalDialog(null);
  };

  const handleRejectShop = () => {
    if (!approvalDialog || !rejectionReason.trim()) {
      toast({
        title: "Rejection Reason Required",
        description: "Please provide a reason for rejecting this shop application.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Shop Rejected",
      description: `${approvalDialog.shop.name} application has been rejected.`,
    });
    setApprovalDialog(null);
    setRejectionReason("");
  };

  const ShopTable = ({ shops }: { shops: typeof mockShops }) => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Shop ID</TableHead>
          <TableHead>Shop Name</TableHead>
          <TableHead>Category</TableHead>
          <TableHead>Location</TableHead>
          <TableHead>Products</TableHead>
          <TableHead>Rating</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {shops.map((shop) => {
          const shopProducts = mockProducts.filter((p) => p.shopId === shop.id);
          return (
            <TableRow key={shop.id}>
              <TableCell className="font-mono text-sm">#{shop.id}</TableCell>
              <TableCell className="font-medium">{shop.name}</TableCell>
              <TableCell>
                <Badge variant="outline">{shop.category[0]}</Badge>
              </TableCell>
              {/* <TableCell className="max-w-[200px] truncate">
                {shop.location.address}
              </TableCell> */}
              <TableCell>{shopProducts.length}</TableCell>
              <TableCell>
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                  {/* <span className="font-medium">{shop.rating}</span> */}
                  {/* <span className="text-muted-foreground">
                    ({shop.reviewCount})
                  </span> */}
                </div>
              </TableCell>
              <TableCell>
                <Badge className={getStatusColor(shop.status)}>
                  {shop.status}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setSelectedShop(shop)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  {shop.status === "closed" && (
                    <>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() =>
                          setApprovalDialog({ shop, action: "approve" })
                        }
                      >
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() =>
                          setApprovalDialog({ shop, action: "reject" })
                        }
                      >
                        <XCircle className="h-4 w-4 text-red-500" />
                      </Button>
                    </>
                  )}
                  <Button variant="ghost" size="icon">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <Ban className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Shops</h1>
        <p className="text-muted-foreground">Manage platform shops and applications</p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Shops</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockShops.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Pending Approval</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-500">
              {pendingShops.length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Active Shops</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">
              {activeShops.length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Suspended</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-500">
              {suspendedShops.length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search shops by name or location..."
                className="pl-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full md:w-[200px]">
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="Food & Beverages">Food & Beverages</SelectItem>
                <SelectItem value="Alcohol">Alcohol</SelectItem>
                <SelectItem value="Groceries">Groceries</SelectItem>
                <SelectItem value="Electronics">Electronics</SelectItem>
                <SelectItem value="Fashion">Fashion</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Shops Tabs */}
      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">All Shops ({filteredShops.length})</TabsTrigger>
          <TabsTrigger value="pending">
            Pending ({pendingShops.length})
          </TabsTrigger>
          <TabsTrigger value="active">Active ({activeShops.length})</TabsTrigger>
          <TabsTrigger value="suspended">
            Suspended ({suspendedShops.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <Card>
            <CardContent className="pt-6">
              <ShopTable shops={filteredShops} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pending">
          <Card>
            <CardContent className="pt-6">
              <ShopTable shops={pendingShops} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="active">
          <Card>
            <CardContent className="pt-6">
              <ShopTable shops={activeShops} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="suspended">
          <Card>
            <CardContent className="pt-6">
              <ShopTable shops={suspendedShops} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Shop Detail Modal */}
      <Dialog open={!!selectedShop} onOpenChange={() => setSelectedShop(null)}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Shop Details</DialogTitle>
            <DialogDescription>{selectedShop?.name}</DialogDescription>
          </DialogHeader>
          {selectedShop && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Shop ID</p>
                  <p className="text-sm font-mono">#{selectedShop.id}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Status</p>
                  <Badge className={getStatusColor(selectedShop.status)}>
                    {selectedShop.status}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Categories
                  </p>
                  <div className="flex gap-1 flex-wrap mt-1">
                    {selectedShop.category.map((cat) => (
                      <Badge key={cat} variant="outline">
                        {cat}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Rating</p>
                  {/* <div className="flex items-center gap-1 mt-1">
                    <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                    <span className="font-medium">{selectedShop.rating}</span>
                    <span className="text-muted-foreground">
                      ({selectedShop.reviewCount} reviews)
                    </span>
                  </div> */}
                </div>
              </div>

              {/* <div>
                <p className="text-sm font-medium text-muted-foreground mb-2">
                  Description
                </p>
                <p className="text-sm">{selectedShop.description}</p>
              </div> */}

              <div>
                <p className="text-sm font-medium text-muted-foreground mb-2">
                  Location
                </p>
                <p className="text-sm">{selectedShop.longitude}</p>
                <p className="text-sm">{selectedShop.latitude}</p>
              </div>

              <div className="flex gap-2">
                <Button variant="outline" className="flex-1">
                  Edit Shop
                </Button>
                <Button variant="outline" className="flex-1">
                  Contact Owner
                </Button>
                <Button variant="outline" className="flex-1">
                  View as Customer
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Approval/Rejection Dialog */}
      <Dialog
        open={!!approvalDialog}
        onOpenChange={() => setApprovalDialog(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {approvalDialog?.action === "approve"
                ? "Approve Shop"
                : "Reject Shop Application"}
            </DialogTitle>
            <DialogDescription>
              {approvalDialog?.action === "approve"
                ? `Are you sure you want to approve ${approvalDialog.shop.name}?`
                : `Please provide a reason for rejecting ${approvalDialog?.shop.name}'s application.`}
            </DialogDescription>
          </DialogHeader>
          {approvalDialog?.action === "reject" && (
            <Textarea
              placeholder="Enter rejection reason..."
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              className="min-h-[100px]"
            />
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setApprovalDialog(null)}>
              Cancel
            </Button>
            {approvalDialog?.action === "approve" ? (
              <Button onClick={handleApproveShop}>Approve Shop</Button>
            ) : (
              <Button variant="destructive" onClick={handleRejectShop}>
                Reject Application
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

