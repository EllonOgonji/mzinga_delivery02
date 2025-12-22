import { Link, useParams } from 'react-router-dom';
import { CheckCircle, Package, Truck, MapPin, Phone } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

export default function OrderConfirmation() {
  const { orderNumber } = useParams<{ orderNumber: string }>();

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 py-16">
        <div className="container mx-auto px-4 max-w-3xl">
          {/* Success Message */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center h-20 w-20 rounded-full bg-success/10 mb-4">
              <CheckCircle className="h-12 w-12 text-success" />
            </div>
            <h1 className="text-4xl font-bold mb-2">Order Placed Successfully!</h1>
            <p className="text-xl text-muted-foreground mb-4">
              Thank you for shopping with Cstop Shop
            </p>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-muted rounded-lg">
              <span className="text-sm text-muted-foreground">Order Number:</span>
              <span className="text-lg font-bold">#{orderNumber}</span>
            </div>
            <p className="text-sm text-muted-foreground mt-4">
              We've sent a confirmation to your email and phone
            </p>
          </div>

          {/* What's Next */}
          <Card className="p-6 mb-8">
            <h2 className="text-xl font-bold mb-6">What's Next</h2>
            <div className="space-y-4">
              {[
                {
                  icon: CheckCircle,
                  title: "We've notified the shops",
                  description: 'Your order has been sent to the shops',
                  completed: true,
                },
                {
                  icon: Package,
                  title: 'Your items are being prepared',
                  description: 'The shops are preparing your order',
                  completed: false,
                },
                {
                  icon: Truck,
                  title: 'Track your order status',
                  description: 'You can track your order in real-time',
                  completed: false,
                },
                {
                  icon: MapPin,
                  title: 'Delivery notifications',
                  description: "You'll receive updates at each step",
                  completed: false,
                },
              ].map((step, index) => {
                const Icon = step.icon;
                return (
                  <div key={index} className="flex gap-4">
                    <div
                      className={`h-10 w-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                        step.completed
                          ? 'bg-success text-white'
                          : 'bg-muted text-muted-foreground'
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-semibold">{step.title}</p>
                      <p className="text-sm text-muted-foreground">{step.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>

          {/* Order Summary */}
          <Card className="p-6 mb-8">
            <h2 className="text-xl font-bold mb-4">Order Summary</h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Order Date:</span>
                <span>{new Date().toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Estimated Delivery:</span>
                <span>2-3 business days</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Payment Method:</span>
                <span>M-Pesa</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Delivery Address:</span>
                <span className="text-right">123 Main St, Nairobi</span>
              </div>
              <Separator />
              <div className="flex justify-between text-lg font-bold">
                <span>Order Total:</span>
                <span className="text-accent">$145.97</span>
              </div>
            </div>
          </Card>

          {/* Shop Orders */}
          <Card className="p-6 mb-8">
            <h2 className="text-xl font-bold mb-4">Order Details by Shop</h2>
            <div className="space-y-4">
              <div className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Package className="h-5 w-5" />
                    <span className="font-semibold">Fresh Groceries Hub</span>
                  </div>
                  <Badge className="bg-accent">Order Received</Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-2">
                  3 items • Estimated delivery: March 3-4, 2024
                </p>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" asChild>
                    <Link to={`/order-tracking/${orderNumber}`}>Track Order</Link>
                  </Button>
                  <Button size="sm" variant="ghost">
                    <Phone className="h-4 w-4 mr-2" />
                    Contact Shop
                  </Button>
                </div>
              </div>
            </div>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Button className="flex-1 bg-accent hover:bg-accent/90" asChild>
              <Link to={`/order-tracking/${orderNumber}`}>Track All Orders</Link>
            </Button>
            <Button variant="outline" className="flex-1" asChild>
              <Link to="/">Continue Shopping</Link>
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
