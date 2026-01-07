import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Check, ChevronRight, MapPin, Phone, Smartphone } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Checkbox } from '@/components/ui/checkbox';
import { useCart } from '@/contexts/CartContext';
import { mockShops, mockProducts } from '@/data/mockData';
import { toast } from 'sonner';
import { useMemo } from 'react';
import { useQuery } from "@tanstack/react-query";
import { getAllShops } from '@/data/shopData';
import { calculateDeliveryFee, findDistanceBetweenUserAndShop } from '@/lib/utils';
import { createOrder } from '@/data/orderData';

const steps = [
  { id: 1, name: 'Delivery', completed: false, active: true },
  { id: 2, name: 'Payment', completed: false, active: false },
  { id: 3, name: 'Review', completed: false, active: false },
];

export default function Checkout() {
  const navigate = useNavigate();
  const { cart, cartTotal, cartCount, clearCart } = useCart();
  const [currentStep, setCurrentStep] = useState(1);
  const [deliveryAddress, setDeliveryAddress] = useState('Lurambi');
  const [phone, setPhone] = useState('254712345678');
  const [paymentMethod, setPaymentMethod] = useState('mpesa');
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  if (cartCount === 0) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center py-16">
          <div className="text-center space-y-6">
            <h1 className="text-3xl font-bold">Your cart is empty</h1>
            <Button asChild className="bg-accent hover:bg-accent/90">
              <Link to="/">Start Shopping</Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const cartByShop = cart.reduce((acc, item) => {
    if (!acc[item.store_id]) {
      acc[item.store_id] = [];
    }
    acc[item.store_id].push(item);
    return acc;
  }, {} as Record<number, typeof cart>);

  const shopIds = Object.keys(cartByShop).map(Number);

  const { data: allShops = [], isLoading: isLoadingShops } = useQuery({
    queryKey: ['shops', 'cart', shopIds],
    queryFn: async () => await getAllShops({ idMultiple: shopIds }),
    enabled: shopIds.length > 0
  });

  const shopsData = useMemo(() => {
    return shopIds.map(shopId => {
      const shop = allShops.find(s => s.id === shopId);
      const shopItems = cartByShop[shopId];
      const shopSubtotal = shopItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
      
      const deliveryFee = shop 
        ? calculateDeliveryFee({ lat: shop.latitude, lon: shop.longitude })
        : 0;
      
      const distance = shop
        ? findDistanceBetweenUserAndShop({ lat: shop.latitude, lon: shop.longitude })
        : 0;
      
      const shopTotal = shopSubtotal + deliveryFee;

      return {
        shopId,
        shop,
        items: shopItems,
        subtotal: shopSubtotal,
        deliveryFee,
        distance,
        total: shopTotal
      };
    });
  }, [allShops, cartByShop, shopIds]);

  const totalDeliveryFees = shopsData.reduce((sum, shopData) => sum + shopData.deliveryFee, 0);
  const orderTotal = cartTotal + totalDeliveryFees;

  const handlePlaceOrder = () => {
    if (!agreedToTerms) {
      toast.error('Please agree to the Terms of Service');
      return;
    }

    console.log(cartByShop)
    console.log('Shops Data:', shopsData);

    shopsData.forEach(async (shopData) => {
      const orderPayload = {
        "order": {
          store_id: shopData.shopId,
          items: shopData.items.map(item => ({
            product_id: item.shopId,
            quantity: item.quantity,
            subtotal: item.quantity * Number(item.price)
          })),
        }
      };
      console.log('Order Payload for Shop', shopData.shopId, orderPayload);
      const res = await createOrder(orderPayload);
      console.log('Create Order Response for Shop', shopData.shopId, res);
    })
    // const orderNumber = 'CST' + Date.now();

    // console.log('Order placed:', { orderNumber, paymentMethod, total: orderTotal });
    
    // toast.success('Order placed successfully!');
    // clearCart();
    // navigate(`/order-confirmation/${orderNumber}`);

  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 py-8">
        <div className="container mx-auto px-4 max-w-5xl">
          {/* Progress Indicator */}
          <div className="mb-8">
            <div className="flex items-center justify-between relative">
              {steps.map((step, index) => (
                <div key={step.id} className="flex-1 relative">
                  <div className="flex items-center">
                    <div
                      className={`h-10 w-10 rounded-full flex items-center justify-center font-bold z-10 ${
                        step.id < currentStep
                          ? 'bg-accent text-white'
                          : step.id === currentStep
                          ? 'bg-accent text-white'
                          : 'bg-muted text-muted-foreground'
                      }`}
                    >
                      {step.id < currentStep ? <Check className="h-5 w-5" /> : step.id}
                    </div>
                    {index < steps.length - 1 && (
                      <div
                        className={`flex-1 h-1 mx-2 ${
                          step.id < currentStep ? 'bg-accent' : 'bg-muted'
                        }`}
                      />
                    )}
                  </div>
                  <p className="text-sm mt-2 font-medium">{step.name}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Step 1: Delivery */}
              {currentStep === 1 && (
                <Card className="p-6">
                  <h2 className="text-2xl font-bold mb-6">Delivery Information</h2>

                  <div className="space-y-6">
                    <div>
                      <Label htmlFor="address">Delivery Address</Label>
                      <div className="flex gap-2 mt-2">
                        <Input
                          id="address"
                          value={deliveryAddress}
                          onChange={(e) => setDeliveryAddress(e.target.value)}
                          placeholder="Enter delivery address"
                        />
                        <Button variant="outline" size="icon">
                          <MapPin className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+254712345678"
                        className="mt-2"
                      />
                    </div>

                    <div>
                      <Label>Delivery Method</Label>
                      <RadioGroup defaultValue="standard" className="mt-2 space-y-3">
                        <div className="flex items-center space-x-2 border rounded-lg p-4">
                          <RadioGroupItem value="standard" id="standard" />
                          <Label htmlFor="standard" className="flex-1 cursor-pointer">
                            <p className="font-medium">Standard Delivery</p>
                            <p className="text-sm text-muted-foreground">
                              KES. {totalDeliveryFees}  ~1.5 hrs
                            </p>
                          </Label>
                        </div>
                      </RadioGroup>
                    </div>

                    <div>
                      <Label htmlFor="instructions">Special Instructions (Optional)</Label>
                      <Textarea
                        id="instructions"
                        placeholder="e.g., Ring bell, 2nd floor"
                        className="mt-2"
                        rows={3}
                      />
                    </div>
                  </div>

                  <Button
                    className="w-full mt-6 bg-accent hover:bg-accent/90"
                    onClick={() => setCurrentStep(2)}
                  >
                    Continue to Payment
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </Card>
              )}

              {/* Step 2: Payment */}
              {currentStep === 2 && (
                <Card className="p-6">
                  <h2 className="text-2xl font-bold mb-6">Payment Method</h2>

                  <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="space-y-4">
                    <div className="border rounded-lg p-4">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="mpesa" id="mpesa" />
                        <Label htmlFor="mpesa" className="flex-1 cursor-pointer">
                          <div className="flex items-center gap-3">
                            <Smartphone className="h-5 w-5 text-accent" />
                            <div>
                              <p className="font-semibold">M-Pesa</p>
                              <p className="text-sm text-muted-foreground">
                                Pay with M-Pesa STK Push
                              </p>
                            </div>
                          </div>
                        </Label>
                      </div>
                      {paymentMethod === 'mpesa' && (
                        <div className="mt-4 pl-6">
                          <Label htmlFor="mpesa-phone">M-Pesa Phone Number</Label>
                          <Input
                            id="mpesa-phone"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            placeholder="254712345678"
                            className="mt-2"
                          />
                          <p className="text-xs text-muted-foreground mt-2">
                            You'll receive a payment prompt on your phone
                          </p>
                        </div>
                      )}
                    </div>

                    {/* <div className="border rounded-lg p-4">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="cod" id="cod" />
                        <Label htmlFor="cod" className="flex-1 cursor-pointer">
                          <div className="flex items-center gap-3">
                            <Phone className="h-5 w-5 text-accent" />
                            <div>
                              <p className="font-semibold">Cash on Delivery</p>
                              <p className="text-sm text-muted-foreground">
                                Pay when you receive your order (+KES 1 fee)
                              </p>
                            </div>
                          </div>
                        </Label>
                      </div>
                    </div> */}
                  </RadioGroup>

                  <div className="flex gap-3 mt-6">
                    <Button variant="outline" onClick={() => setCurrentStep(1)} className="flex-1">
                      Back to Delivery
                    </Button>
                    <Button
                      className="flex-1 bg-accent hover:bg-accent/90"
                      onClick={() => setCurrentStep(3)}
                    >
                      Review Order
                      <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </Card>
              )}

              {/* Step 3: Review */}
              {currentStep === 3 && (
                <div className="space-y-6">
                  <Card className="p-6">
                    <h2 className="text-2xl font-bold mb-6">Review Order</h2>

                    {/* Delivery Info */}
                    <div className="mb-6">
                      <h3 className="font-semibold mb-2">Deliver to:</h3>
                      <p className="text-sm">{deliveryAddress}</p>
                      <p className="text-sm text-muted-foreground">{phone}</p>
                    </div>

                    <Separator className="my-4" />

                    {/* Payment Method */}
                    <div className="mb-6">
                      <h3 className="font-semibold mb-2">Payment Method:</h3>
                      <p className="text-sm">
                        {paymentMethod === 'mpesa' ? 'M-Pesa' : 'Cash on Delivery'}
                      </p>
                      {paymentMethod === 'mpesa' && (
                        <p className="text-sm text-muted-foreground">{phone}</p>
                      )}
                    </div>

                    <Separator className="my-4" />

                    {/* Order Items */}
                    <div className="space-y-3">
                      {cart.map(item => {
                        const product = mockProducts.find(p => p.id === item.id);
                        if (!product) return null;

                        return (
                          <div key={item.id} className="flex gap-3 text-sm">
                            <img
                              src={product.images[0]}
                              alt={product.name}
                              className="h-16 w-16 object-cover rounded"
                            />
                            <div className="flex-1">
                              <p className="font-medium">{product.name}</p>
                              <p className="text-muted-foreground">Qty: {item.quantity}</p>
                            </div>
                            <p className="font-medium">
                              KES. {(product.price * item.quantity).toFixed(2)}
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  </Card>

                  {/* Terms */}
                  <div className="flex items-start space-x-2">
                    <Checkbox
                      id="terms"
                      checked={agreedToTerms}
                      onCheckedChange={(checked) => setAgreedToTerms(checked as boolean)}
                    />
                    <Label htmlFor="terms" className="text-sm cursor-pointer">
                      I agree to the{' '}
                      <Link to="/terms" className="text-accent hover:underline">
                        Terms of Service
                      </Link>{' '}
                      and{' '}
                      <Link to="/privacy" className="text-accent hover:underline">
                        Privacy Policy
                      </Link>
                    </Label>
                  </div>

                  <div className="flex gap-3">
                    <Button variant="outline" onClick={() => setCurrentStep(2)} className="flex-1">
                      Back to Payment
                    </Button>
                    <Button
                      className="flex-1 bg-accent hover:bg-accent/90"
                      onClick={handlePlaceOrder}
                      disabled={!agreedToTerms}
                    >
                      Place Order - KES. {orderTotal.toFixed(2)}
                    </Button>
                  </div>
                </div>
              )}
            </div>

            {/* Order Summary Sidebar */}
            <div className="lg:col-span-1">
              <Card className="p-6 sticky top-24">
                <h3 className="font-bold mb-4">Order Summary</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span>Items ({cartCount}):</span>
                    <span>KES. {cartTotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>Delivery Fees:</span>
                    <span>KES. {totalDeliveryFees.toFixed(2)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between text-lg font-bold text-accent">
                    <span>Total:</span>
                    <span>KES. {orderTotal.toFixed(2)}</span>
                  </div>
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
