import { useState } from "react";
import { VendorLayout } from "@/components/vendor/VendorLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Download, Eye } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getStoreOrders, updateOrderStatus } from "@/data/orderData";
import { useToast } from '@/hooks/use-toast';
import { Loader } from 'lucide-react';

const VendorOrders = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const queryClient = useQueryClient();

  const { data: orders = [] } = useQuery<Array<any>>({
    queryKey: ['store', 'orders', JSON.parse(localStorage.getItem('user') || '{}').id],
    queryFn: async () => {
      const res = await getStoreOrders();
      return res.data.data;
    }
  });

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { label: string; className: string }> = {
      pending: { label: "Pending", className: "bg-blue-500" },
      confirmed: { label: "Confirmed", className: "bg-green-500" },
      preparing: { label: "Preparing", className: "bg-yellow-500" },
      ready: { label: "Ready", className: "bg-purple-500" },
      delivered: { label: "Delivered", className: "bg-green-500" },
      cancelled: { label: "Cancelled", className: "bg-red-500" },
    };
    const config = variants[status] || variants.new;
    return <Badge className={config.className}>{config.label}</Badge>;
  };

  const handleOrderItemStatusUpdate = async (orderId: number, itemId: number, newStatus: string) => {
    setLoading(true);
    const {status, data, error} = await updateOrderStatus(orderId, itemId, newStatus);

    if(!status){
      toast({
        title: 'Error',
        description: error || 'Failed to update order item status. Please try again.',
        variant: 'destructive',
      });
      setLoading(false);
      return;
    }

    await queryClient.invalidateQueries({
      queryKey: ['store', 'orders', JSON.parse(localStorage.getItem('user') || '{}').id]
    });

    toast({
      title: 'Success',
      description: 'Order item status updated successfully.',
    });
    setLoading(false);
  }

  const OrderDetailDialog = ({ order }: { order: typeof orders[0] }) => (
    <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle>Order Details - {order.id}</DialogTitle>
      </DialogHeader>
      <div className="space-y-6">
        {/* Customer Information */}
        {/* <div>
          <h3 className="font-semibold mb-2">Customer Information</h3>
          <div className="space-y-1 text-sm">
            <p><span className="font-medium">Name:</span> {order.customer.full_name}</p>
            <p><span className="font-medium">Phone:</span> <a href={`tel:${order.customer.phone}`} className="text-primary hover:underline">{order.customer.phone}</a></p>
            <p><span className="font-medium">Email:</span> <a href={`mailto:${order.customer.email}`} className="text-primary hover:underline">{order.customer.email}</a></p>
          </div>
        </div> */}

        {/* Delivery Information */}
        {/* <div>
          <h3 className="font-semibold mb-2">Delivery Information</h3>
          <div className="space-y-1 text-sm">
            <p><span className="font-medium">Method:</span> {order.delivery}</p>
            <p><span className="font-medium">Address:</span> 123 Main St, Nairobi</p>
            <p><span className="font-medium">Instructions:</span> Ring doorbell, 2nd floor</p>
          </div>
        </div> */}

        {/* Items Ordered */}
        <div>
          <h3 className="font-semibold mb-2">Items Ordered</h3>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Subtotal</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {order.items.map((item: any) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.product.name}</TableCell>
                    <TableCell>{item.quantity}</TableCell>
                    <TableCell>KES. {Number(item.product.price).toFixed(2)}</TableCell>
                    <TableCell>KES. {Number(item.subtotal).toFixed(2)}</TableCell>
                    <TableCell>
                      {loading ? <Loader className="animate-spin h-5 w-5 mr-3" /> : 
                        <>
                          <Select value={item.status} onValueChange={(newStatus) => handleOrderItemStatusUpdate(order.id, item.id, newStatus)}>
                            <SelectTrigger className="w-24 h-7">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="pending">Pending</SelectItem>
                              <SelectItem value="preparing">Preparing</SelectItem>
                              <SelectItem value="ready">Ready</SelectItem>
                              <SelectItem value="delivered">Delivered</SelectItem>
                            </SelectContent>
                          </Select>
                        </>
                      }
                    </TableCell>
                  </TableRow>
                ))}
               
              </TableBody>
            </Table>
          </div>
        </div>

        {/* Payment Information */}
        {/* <div>
          <h3 className="font-semibold mb-2">Payment Information</h3>
          <div className="space-y-1 text-sm">
            <p><span className="font-medium">Method:</span> Mobile</p>
            <p><span className="font-medium">Status:</span> {order.payment_status}</p>
            <div className="mt-2 space-y-1 border-t pt-2">
              <p className="flex justify-between"><span>Items subtotal:</span> <span>KES. {Number(order.total_price).toFixed(2)}</span></p>
            </div>
          </div>
        </div> */}

        {/* Update Status */}
        {/* <div>
          <h3 className="font-semibold mb-2">Update Order Status</h3>
          <div className="flex gap-2">
            <Select defaultValue={order.order_status}>
              <SelectTrigger className="flex-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="preparing">Preparing</SelectItem>
                <SelectItem value="ready">Ready</SelectItem>
                <SelectItem value="out-for-delivery">Out for Delivery</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
            <Button>Update</Button>
          </div>
        </div> */}

        {/* Actions */}
        <div className="flex gap-2 pt-4 border-t">
          <Button variant="outline" className="flex-1">Print Invoice</Button>
          <Button variant="outline" className="flex-1">Print Packing Slip</Button>
          {/* <Button variant="outline" className="flex-1">Contact Customer</Button> */}
        </div>
      </div>
    </DialogContent>
  );

  return (
    <VendorLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold">Orders</h1>
            <p className="text-muted-foreground mt-1">{orders.length} total orders</p>
          </div>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export Orders
          </Button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by order number, customer name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>

        {/* Tabs */}
        <Tabs defaultValue="all">
          <TabsList>
            <TabsTrigger value="all">All ({orders.length})</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="confirmed">Confirmed</TabsTrigger>
            <TabsTrigger value="preparing">Preparing</TabsTrigger>
            <TabsTrigger value="ready">Ready</TabsTrigger>
            <TabsTrigger value="delivered">Delivered</TabsTrigger>
            <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Items</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Payment</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orders.map((order) => (
                    <TableRow key={order.id}>
                      {/* <TableCell>
                        <div>
                          <p className="font-medium">{order.customer}</p>
                          <p className="text-sm text-muted-foreground">{order.phone}</p>
                        </div>
                      </TableCell> */}
                      <TableCell className="text-sm">{new Date(order.created_at).toLocaleDateString()}</TableCell>
                      <TableCell>{order.items.length} items</TableCell>
                      <TableCell className="font-medium">KES. {Number(order.total_price).toFixed(2)}</TableCell>
                      <TableCell>
                        <div>
                          <Badge variant="outline" className="text-xs">{order.payment_status}</Badge>
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(order.order_status)}</TableCell>
                      <TableCell>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <Eye className="h-4 w-4 mr-1" />
                              View
                            </Button>
                          </DialogTrigger>
                          <OrderDetailDialog order={order} />
                        </Dialog>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </VendorLayout>
  );
};

export default VendorOrders;
