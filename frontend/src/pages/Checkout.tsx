import { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Check, ChevronRight, MapPin, Phone, Smartphone, Loader } from 'lucide-react';
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
import { toast } from 'sonner';
import { useMemo } from 'react';
import { useQuery } from "@tanstack/react-query";
import { getAllShops } from '@/data/shopData';
// import { calculateDeliveryFee, findDistanceBetweenUserAndShop } from '@/lib/utils';
import { checkout, addItemToCart } from '@/data/orderData';
import {useShopDeliveryData} from '@/hooks/useCalculateDelivery'
import useAuth from "@/hooks/useAuth";

const steps = [
  { id: 1, name: 'Delivery', completed: false, active: true },
  { id: 2, name: 'Payment', completed: false, active: false },
  { id: 3, name: 'Review', completed: false, active: false },
];

export default function Checkout() {
  const {user} = useAuth()
  const navigate = useNavigate();
  const { cart, cartTotal, cartCount, clearCart, isCartLoading } = useCart();
  const [currentStep, setCurrentStep] = useState(1);
  const [deliveryAddress, setDeliveryAddress] = useState('Lurambi');
  const [phone, setPhone] = useState(user.phone_number);
  const [paymentPhone, setPaymentPhone] = useState(phone)
  const [paymentMethod, setPaymentMethod] = useState('mpesa');
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [loading, setLoading] = useState(false)

  const cartByShop = useMemo(() => {
    return cart.reduce((acc, item) => {
      if (!acc[item.product.store_id]) {
        acc[item.product.store_id] = [];
      }
      acc[item.product.store_id].push(item);
      return acc;
    }, {} as Record<number, typeof cart>);
  }, [cart]);

  const shopIds = useMemo(() => {
    return Object.keys(cartByShop).map(Number);
  }, [cartByShop]);

  const { data: allShops = [], isLoading: isLoadingShops } = useQuery({
    queryKey: ['shops', 'cart', shopIds],
    queryFn: async () => {
      const res = await getAllShops({ limit:0, page:0, idMultiple: shopIds })
      return res.data;
    },
    enabled: shopIds.length > 0
  });

  const isMounted = useRef(true);

  const { shopsData, isLoading: isLoadingDelivery } = useShopDeliveryData(shopIds, allShops, cartByShop);
  const totalDeliveryFees = shopsData.reduce((sum, shopData) => sum + shopData.deliveryFee, 0);
  const orderTotal = cartTotal + totalDeliveryFees;

  const handlePlaceOrder = async () => {
    setLoading(true)

    if (!agreedToTerms) {
      toast.error('Please agree to the Terms of Service');
      setLoading(false)
      return;
    }

    if (loading) return;

    const res = await checkout(String(paymentPhone));

    if (res.status == false){
      toast.error('An issue occurred while creating your order')
      setLoading(false)
      return
    }

    toast.success('Order placed successfully!');

    const clearCartaRes = await clearCart();

    if(!clearCartaRes.status){
      const {status} = await clearCart()

      if (!status){
        toast.error('Failed to clear cart. Please try again')
      }
    }

    setLoading(false)
    navigate(`/`);
  };

  if (cartCount === 0) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center py-16">
          <div className="text-center space-y-6">
             {isLoadingDelivery || isLoadingShops || isCartLoading ? 
                (   
                  <div className="text-center py-16 flex justify-center items-center h-96">
                    <Loader className="animate-spin h-5 w-5" />
                  </div>
                ) : 
                <>
                  <h1 className="text-3xl font-bold">Your cart is empty</h1>
                  <Button asChild className="bg-accent hover:bg-accent/90">
                    <Link to="/">Start Shopping</Link>
                  </Button>
                </>
              }
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 py-8">
        <div className="container mx-auto px-4 max-w-5xl">
          {/* Progress Indicator */}
          <div className="mb-8">
            <div className="flex items-center justify-between relative px-4">
              {steps.map((step, index) => (
                <div key={step.id} className={`${index+1 == steps.length ? '' : 'flex-1'} relative`}>
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
                  <h2 className="text-xl md:text-2xl font-bold mb-6">Delivery Information</h2>

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
                        placeholder={user.phone_number}
                        className="mt-2"
                      />
                    </div>

                    <div>
                      <Label>Delivery Method</Label>
                      <RadioGroup defaultValue="standard" className="mt-2 space-y-3">
                        <div className="flex items-center space-x-2 border p-4">
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
                            value={paymentPhone}
                            onChange={(e) => setPaymentPhone(e.target.value)}
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
                      Back
                    </Button>
                    <Button
                      className="flex-1 bg-accent hover:bg-accent/90"
                      onClick={() => setCurrentStep(3)}
                    >
                      Next
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
                        <p className="text-sm text-muted-foreground">{paymentPhone}</p>
                      )}
                    </div>

                    <Separator className="my-4" />

                    {/* Order Items */}
                    <div className="space-y-3">
                      {cart.map(item => {
                        return (
                          <div key={item.id} className="flex gap-3 text-sm">
                            <img
                              src={item.product.image_url}
                              alt={item.product.name}
                              className="h-16 w-16 object-cover rounded"
                            />
                            <div className="flex-1">
                              <p className="font-medium">{item.product.name}</p>
                              <p className="text-muted-foreground">Qty: {Number(item.quantity)}</p>
                            </div>
                            <p className="font-medium">
                              KES. {(Number(item.unit_price) * Number(item.quantity)).toFixed(2)}
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  </Card>

                  <div className="flex gap-3">
                    <Button variant="outline" onClick={() => setCurrentStep(2)} className="flex-1">
                      Back
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
                    <span>Items :</span>
                    <span>KES. {cartTotal}</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>Delivery Fees:</span>
                    <span>KES. {totalDeliveryFees}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between text-lg font-bold text-accent">
                    <span>Total:</span>
                    <span>KES. {cartTotal + totalDeliveryFees}</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <Checkbox
                      id="terms"
                      checked={agreedToTerms}
                      onCheckedChange={(checked) => setAgreedToTerms(checked as boolean)}
                    />
                    <Label htmlFor="terms" className="text-xs md:text-sm cursor-pointer">
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
                  <Button
                    className="w-full bg-accent hover:bg-accent/90"
                    onClick={handlePlaceOrder}
                    disabled={!agreedToTerms}
                  >
                    {loading ? <Loader className="animate-spin h-5 w-5 mr-3" /> : 'Place Order'}
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
