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

const VendorOrders = () => {
  const [searchQuery, setSearchQuery] = useState("");

  // Mock orders data
  const orders = [
    {
      id: "#CST123456",
      customer: "John Doe",
      phone: "+254 712 345 678",
      email: "john@example.com",
      date: "Mar 15, 2024 2:30 PM",
      items: 3,
      total: 45.50,
      delivery: "Standard",
      payment: "M-Pesa",
      paymentStatus: "Paid",
      status: "new",
    },
    {
      id: "#CST123455",
      customer: "Jane Smith",
      phone: "+254 723 456 789",
      email: "jane@example.com",
      date: "Mar 15, 2024 1:15 PM",
      items: 2,
      total: 28.00,
      delivery: "Express",
      payment: "Cash",
      paymentStatus: "Pending",
      status: "preparing",
    },
    {
      id: "#CST123454",
      customer: "Bob Johnson",
      phone: "+254 734 567 890",
      email: "bob@example.com",
      date: "Mar 15, 2024 11:45 AM",
      items: 5,
      total: 67.80,
      delivery: "Pickup",
      payment: "M-Pesa",
      paymentStatus: "Paid",
      status: "ready",
    },
  ];

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { label: string; className: string }> = {
      new: { label: "New", className: "bg-orange-500" },
      preparing: { label: "Preparing", className: "bg-blue-500" },
      ready: { label: "Ready", className: "bg-purple-500" },
      "out-for-delivery": { label: "Out for Delivery", className: "bg-cyan-500" },
      completed: { label: "Completed", className: "bg-green-500" },
      cancelled: { label: "Cancelled", className: "bg-red-500" },
    };
    const config = variants[status] || variants.new;
    return <Badge className={config.className}>{config.label}</Badge>;
  };

  const OrderDetailDialog = ({ order }: { order: typeof orders[0] }) => (
    <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle>Order Details - {order.id}</DialogTitle>
      </DialogHeader>
      <div className="space-y-6">
        {/* Customer Information */}
        <div>
          <h3 className="font-semibold mb-2">Customer Information</h3>
          <div className="space-y-1 text-sm">
            <p><span className="font-medium">Name:</span> {order.customer}</p>
            <p><span className="font-medium">Phone:</span> <a href={`tel:${order.phone}`} className="text-primary hover:underline">{order.phone}</a></p>
            <p><span className="font-medium">Email:</span> <a href={`mailto:${order.email}`} className="text-primary hover:underline">{order.email}</a></p>
          </div>
        </div>

        {/* Delivery Information */}
        <div>
          <h3 className="font-semibold mb-2">Delivery Information</h3>
          <div className="space-y-1 text-sm">
            <p><span className="font-medium">Method:</span> {order.delivery}</p>
            <p><span className="font-medium">Address:</span> 123 Main St, Nairobi</p>
            <p><span className="font-medium">Instructions:</span> Ring doorbell, 2nd floor</p>
          </div>
        </div>

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
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>Fresh Tomatoes</TableCell>
                  <TableCell>2</TableCell>
                  <TableCell>$4.99</TableCell>
                  <TableCell>$9.98</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Organic Bananas</TableCell>
                  <TableCell>1</TableCell>
                  <TableCell>$3.49</TableCell>
                  <TableCell>$3.49</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </div>

        {/* Payment Information */}
        <div>
          <h3 className="font-semibold mb-2">Payment Information</h3>
          <div className="space-y-1 text-sm">
            <p><span className="font-medium">Method:</span> {order.payment}</p>
            <p><span className="font-medium">Status:</span> {order.paymentStatus}</p>
            <div className="mt-2 space-y-1 border-t pt-2">
              <p className="flex justify-between"><span>Items subtotal:</span> <span>${order.total.toFixed(2)}</span></p>
              <p className="flex justify-between"><span>Delivery fee:</span> <span>$3.00</span></p>
              <p className="flex justify-between font-bold text-base"><span>Total:</span> <span>${(order.total + 3).toFixed(2)}</span></p>
            </div>
          </div>
        </div>

        {/* Update Status */}
        <div>
          <h3 className="font-semibold mb-2">Update Order Status</h3>
          <div className="flex gap-2">
            <Select defaultValue={order.status}>
              <SelectTrigger className="flex-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="new">New</SelectItem>
                <SelectItem value="preparing">Preparing</SelectItem>
                <SelectItem value="ready">Ready</SelectItem>
                <SelectItem value="out-for-delivery">Out for Delivery</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
            <Button>Update</Button>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-4 border-t">
          <Button variant="outline" className="flex-1">Print Invoice</Button>
          <Button variant="outline" className="flex-1">Print Packing Slip</Button>
          <Button variant="outline" className="flex-1">Contact Customer</Button>
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
            <TabsTrigger value="new">New (1)</TabsTrigger>
            <TabsTrigger value="preparing">Preparing (1)</TabsTrigger>
            <TabsTrigger value="ready">Ready (1)</TabsTrigger>
            <TabsTrigger value="completed">Completed (0)</TabsTrigger>
            <TabsTrigger value="cancelled">Cancelled (0)</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order #</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Date & Time</TableHead>
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
                      <TableCell className="font-medium">{order.id}</TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{order.customer}</p>
                          <p className="text-sm text-muted-foreground">{order.phone}</p>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm">{order.date}</TableCell>
                      <TableCell>{order.items} items</TableCell>
                      <TableCell className="font-medium">${order.total.toFixed(2)}</TableCell>
                      <TableCell>
                        <div>
                          <p className="text-sm">{order.payment}</p>
                          <Badge variant="outline" className="text-xs">{order.paymentStatus}</Badge>
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(order.status)}</TableCell>
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
