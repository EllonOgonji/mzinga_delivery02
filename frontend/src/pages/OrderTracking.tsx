import { Link, useParams } from 'react-router-dom';
import { Check, Package, Truck, MapPin, Phone, MessageSquare } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const orderStages = [
  {
    id: 1,
    title: 'Order Placed',
    description: 'Your order has been placed',
    timestamp: 'March 1, 2024 at 10:30 AM',
    completed: true,
  },
  {
    id: 2,
    title: 'Order Confirmed',
    description: 'Shop confirmed your order',
    timestamp: 'March 1, 2024 at 10:35 AM',
    completed: true,
  },
  {
    id: 3,
    title: 'Preparing Order',
    description: 'Your items are being prepared',
    timestamp: 'Estimated ~30 minutes',
    completed: false,
    current: true,
  },
  {
    id: 4,
    title: 'Out for Delivery',
    description: 'Your order is on the way',
    timestamp: 'Expected: 2:00 PM - 4:00 PM',
    completed: false,
  },
  {
    id: 5,
    title: 'Delivered',
    description: 'Order delivered',
    timestamp: 'Expected: March 3, 2024',
    completed: false,
  },
];

export default function OrderTracking() {
  const { orderNumber } = useParams<{ orderNumber: string }>();

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Track Your Order</h1>
            <p className="text-muted-foreground">
              Order #{orderNumber} • Placed on {new Date().toLocaleDateString()}
            </p>
            <Badge className="mt-2 bg-accent">In Progress</Badge>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Current Status */}
              <Card className="p-6">
                <div className="flex items-center gap-4 mb-6">
                  <div className="h-12 w-12 rounded-full bg-accent/10 flex items-center justify-center">
                    <Package className="h-6 w-6 text-accent animate-pulse" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold">Preparing Your Order</h2>
                    <p className="text-sm text-muted-foreground">
                      Estimated completion: ~30 minutes
                    </p>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="relative mb-4">
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-accent rounded-full w-2/5 transition-all duration-500" />
                  </div>
                </div>
              </Card>

              {/* Order Timeline */}
              <Card className="p-6">
                <h2 className="text-xl font-bold mb-6">Order Progress</h2>
                <div className="space-y-6">
                  {orderStages.map((stage, index) => (
                    <div key={stage.id} className="flex gap-4">
                      {/* Icon */}
                      <div className="relative">
                        <div
                          className={`h-10 w-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                            stage.completed
                              ? 'bg-accent text-white'
                              : stage.current
                              ? 'bg-accent text-white animate-pulse'
                              : 'bg-muted text-muted-foreground'
                          }`}
                        >
                          {stage.completed ? (
                            <Check className="h-5 w-5" />
                          ) : (
                            <div className="h-2 w-2 rounded-full bg-current" />
                          )}
                        </div>
                        {index < orderStages.length - 1 && (
                          <div
                            className={`absolute top-10 left-1/2 -translate-x-1/2 w-0.5 h-12 ${
                              stage.completed ? 'bg-accent' : 'bg-muted'
                            }`}
                          />
                        )}
                      </div>

                      {/* Content */}
                      <div className="flex-1 pb-6">
                        <h3 className="font-semibold">{stage.title}</h3>
                        <p className="text-sm text-muted-foreground">{stage.description}</p>
                        <p className="text-xs text-muted-foreground mt-1">{stage.timestamp}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Order Items */}
              <Card className="p-6">
                <h2 className="text-xl font-bold mb-4">Order Items</h2>
                <div className="space-y-3">
                  <div className="flex gap-3 items-center">
                    <div className="h-16 w-16 bg-muted rounded-md flex items-center justify-center">
                      <Package className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">Fresh Organic Apples</p>
                      <p className="text-sm text-muted-foreground">Qty: 2</p>
                    </div>
                    <p className="font-medium">$11.98</p>
                  </div>
                </div>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1 space-y-6">
              {/* Delivery Information */}
              <Card className="p-6">
                <h3 className="font-bold mb-4 flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-accent" />
                  Delivery Information
                </h3>
                <div className="space-y-3 text-sm">
                  <div>
                    <p className="text-muted-foreground">Delivery Method:</p>
                    <p className="font-medium">Standard Delivery</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Estimated Delivery:</p>
                    <p className="font-medium">March 3-4, 2024</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Delivery Address:</p>
                    <p className="font-medium">123 Main St, Nairobi</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Recipient:</p>
                    <p className="font-medium">John Doe</p>
                    <p className="text-muted-foreground">+254 712 345 678</p>
                  </div>
                </div>
              </Card>

              {/* Shop Contact */}
              <Card className="p-6">
                <h3 className="font-bold mb-4">Fresh Groceries Hub</h3>
                <div className="space-y-2">
                  <Button variant="outline" className="w-full justify-start" size="sm">
                    <Phone className="h-4 w-4 mr-2" />
                    Call Shop
                  </Button>
                  <Button variant="outline" className="w-full justify-start" size="sm">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Chat with Shop
                  </Button>
                </div>
              </Card>

              {/* Actions */}
              <Card className="p-6">
                <h3 className="font-bold mb-4">Need Help?</h3>
                <div className="space-y-2">
                  <Button variant="outline" className="w-full" size="sm" asChild>
                    <Link to="/support">Contact Support</Link>
                  </Button>
                  <Button variant="ghost" className="w-full text-destructive" size="sm">
                    Cancel Order
                  </Button>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
