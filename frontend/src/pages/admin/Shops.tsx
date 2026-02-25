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
import { adminGetAllShops, approveShop, rejectShop } from "@/data/shopData";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useQueryClient} from "@tanstack/react-query";
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Cancel } from "@radix-ui/react-alert-dialog";

export default function AdminShops() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [deleteDialog, setDeleteDialog] = useState(false)
  const [paginationSettings, setPaginationSettings] = useState({
    page: 1,
    limit: 6,
    total: 0,
    totalPages: 0,
    searchQuery: '',
    status: ''
  });
  const [openRejectFormFor, setOpenRejectFormFor] = useState<number | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");

  const { data: shops = [], isLoading } = useQuery({
    queryKey: ['shops', 'admin', paginationSettings.page, paginationSettings.limit, paginationSettings.searchQuery, paginationSettings.status],
    queryFn: async () => {
      const res = await adminGetAllShops({limit: paginationSettings.limit, page: paginationSettings.page, searchQuery: paginationSettings.searchQuery, status: paginationSettings.status});
      setPaginationSettings(prev => ({
        ...prev,
        total: res.meta.total,
        totalPages: Math.ceil(res.meta.total / prev.limit)
      }))
      return res.data;
    }
  });

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      approved: "bg-green-500/10 text-green-500",
      rejected: "bg-red-500/10 text-red-500",
      pending: "bg-orange-500/10 text-orange-500",
      suspended: "bg-orange-500/10 text-red-700",
    };
    return colors[status] || "";
  };

  const handleShopStatusChange = async (shopId: number, action: "approve" | "reject", rejectionReason?: string) => {
    if(action == "approve"){
      const {status, error} = await approveShop(shopId);
      if(status){
        toast({
          title: "Success",
          description: "Shop approved successfully",
        });
        queryClient.invalidateQueries({queryKey: ['shops', 'admin', paginationSettings.page, paginationSettings.limit, paginationSettings.searchQuery, paginationSettings.status]});
      } else {
        toast({
          title: "Error",
          description: error || "Failed to approve shop",
          variant: "destructive"
        });
      }
    }else if(action == "reject"){
      const {status, error} = await rejectShop(shopId, rejectionReason);
      if(status){
        setOpenRejectFormFor(null)
        toast({
          title: "Success",
          description: "Shop unapproved successfully",
        });
        queryClient.invalidateQueries({queryKey: ['shops', 'admin', paginationSettings.page, paginationSettings.limit, paginationSettings.searchQuery, paginationSettings.status]});
      } else {
        toast({
          title: "Error",
          description: error || "Failed to unapprove shop",
          variant: "destructive"
        });
      }
    }
  }

  const ShopsTable = () => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Shop ID</TableHead>
          <TableHead>Shop Name</TableHead>
          <TableHead>Category</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-center">Change store status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {shops.map((shop) => {
          return (
            <TableRow key={shop.id}>
              <TableCell className="font-mono text-sm">#{shop.id}</TableCell>
              <TableCell className="font-medium">{shop.name}</TableCell>
              <TableCell>
                <Badge variant="outline">{shop.category}</Badge>
              </TableCell>
              <TableCell>
                <Badge className={getStatusColor(shop.status)}>
                  {shop.status}
                </Badge>
              </TableCell>
              <TableCell >
                <div className="flex gap-2">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    title={shop.is_verified == true ? "Reject Shop" : "Approve Shop"} 
                    className="w-full" onClick={() => {
                      if(shop.is_verified == true){
                        setOpenRejectFormFor(shop.id);
                      } else {
                        handleShopStatusChange(shop.id, "approve")
                      }
                    }}
                  >
                    {shop.is_verified == true ? <XCircle className="h-4 w-4" /> : <CheckCircle className="h-4 w-4" />}
                  </Button>
                  {/* <Button variant="ghost" size="icon">
                    <Trash2 className="h-4 w-4" />
                  </Button> */}
                </div>
                {openRejectFormFor == shop.id && <form onSubmit={(e) => {
                  const formData = new FormData(e.currentTarget);
                  const reason = formData.get('reason');
                  
                  e.preventDefault(); 
                  handleShopStatusChange(shop.id, "reject", String(reason));
                }}>
                  <Input key={`reject-input-${shop.id}`} name="reason" placeholder="Reason for rejection" className="mt-4" ></Input>
                </form>}
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Verified Shops</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">TBD</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Unverified Shops</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-500">
              TBD
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
                placeholder="Search shops by name"
                className="pl-9"
                value={paginationSettings.searchQuery}
                onChange={(e) => setPaginationSettings({...paginationSettings, searchQuery: e.target.value})}
              />
            </div>
            <Select value={String(paginationSettings.status)} onValueChange={(value) => setPaginationSettings({...paginationSettings, status: value == "null" ? "" : value})}>
              <SelectTrigger className="w-full md:w-[200px]">
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="null">All</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
                <SelectItem value="suspended">Suspended</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <ShopsTable/>

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

      {/* Shops Tabs */}
      {/* <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="unverified">Unverified</TabsTrigger>
          <TabsTrigger value="verified">Verified</TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <Card>
            <CardContent className="pt-6">
              <ShopTable shops={filteredShops} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="unverified">
          <Card>
            <CardContent className="pt-6">
              <ShopTable shops={pendingShops} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="verified">
          <Card>
            <CardContent className="pt-6">
              <ShopTable shops={activeShops} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs> */}
    </div>
  );
}

