import { Link } from 'react-router-dom';
import { Trash2, Heart, ShoppingCart, Store } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useCart } from '@/contexts/CartContext';
import { mockShops, mockProducts } from '@/data/mockData';
import { getAllShops } from '@/data/shopData';
import { useQuery } from "@tanstack/react-query";
import { calculateDeliveryFee, findDistanceBetweenUserAndShop } from '@/lib/utils';
import { useMemo } from 'react';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';

export default function Cart() {
  const { cart, updateQuantity, removeFromCart, clearCart, cartTotal, cartCount } = useCart();
  
  const cartByShop = cart.reduce((acc, item) => {
    if (!acc[item.store_id]) {
      acc[item.store_id] = [];
    }
    acc[item.store_id].push(item);
    return acc;
  }, {} as Record<number, typeof cart>);

  const shopIds = Object.keys(cartByShop).map(Number);

  console.log(cartByShop)

  const { data: allShops = [], isLoading: isLoadingShops } = useQuery({
    queryKey: ['shops', 'cart', shopIds],
    queryFn: async () => {
      const res = await getAllShops({ limit:0, page:0, idMultiple: shopIds })
      return res.data;
    },
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
        total: shopTotal
      };
    });
  }, [allShops, cartByShop, shopIds]);

  const orderTotal = cartTotal

  // List of shop ids in the cart
  // for each id: fetch the shop details, calculate delivery fee, calculate the cumulative totals

  if (cartCount === 0) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center py-16">
          <div className="text-center space-y-6 max-w-md">
            <div className="mx-auto h-32 w-32 rounded-full bg-muted flex items-center justify-center">
              <ShoppingCart className="h-16 w-16 text-muted-foreground" />
            </div>
            <h1 className="text-3xl font-bold">Your cart is empty</h1>
            <p className="text-muted-foreground">
              Start adding products to see them here
            </p>
            <Button asChild className="bg-accent hover:bg-accent/90">
              <Link to="/">Start Shopping</Link>
            </Button>
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
        <div className="container mx-auto px-4">
          {/* Breadcrumb */}
          <Breadcrumb className="mb-6">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link to="/">Home</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Cart</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          {/* Page Header */}
          <h1 className="text-2xl md:text-3xl font-bold mb-8">
            {cartCount} items from {shopIds.length} {shopIds.length === 1 ? 'shop' : 'shops'}
          </h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content - Cart Items */}
            <div className="lg:col-span-2 space-y-6">
              {shopsData.map(({ shopId, shop, items, subtotal, total }) => {
                if (!shop) return null;

                const shopItems = items;
                const shopSubtotal = subtotal;
                const shopTotal = total;
                return (
                  <Card key={shopId} className="p-6">
                    
                    <div className="flex items-center justify-between mb-4 pb-4 border-b">
                      <div className="flex items-center gap-3">
                        <div className="hidden h-12 w-12 rounded-full bg-muted md:flex items-center justify-center">
                          <Store className="h-6 w-6" />
                        </div>
                        <div className='flex flex-col'>
                          <Link to={`/shop/${shopId}`} className="font-semibold hover:text-accent">
                            {shop?.name}
                          </Link>
                          {shop?.status === 'approved' ? (
                            <Badge variant="outline" className="w-max ml-0 mt-2 md:mt-0 md:ml-2 text-xs border-success text-success">
                              {shop.status}
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="ml-0 md:ml-2 text-xs border-destructive text-destructive">
                              Closed
                            </Badge>
                          )}
                        </div>
                      </div>
                      <Button variant="outline" size="sm" asChild>
                        <Link to={`/shop/${shopId}`}>Visit Shop</Link>
                      </Button>
                    </div>

                    
                    <div className="space-y-4">
                      {shopItems.map(item => {
                        const product = item
                        if (!product) return null;

                        return (
                          <div key={item.id} className="flex gap-4">
                            
                            <Link to={`/product/${product.id}`} className="flex-shrink-0">
                              <img
                                src={product.image_url}
                                alt={product.name}
                                className="h-20 w-20 object-cover rounded-md"
                              />
                            </Link>

                            
                            <div className="flex-1 min-w-0">
                              <Link
                                to={`/product/${product.id}`}
                                className="font-semibold hover:text-accent line-clamp-1"
                              >
                                {product.name}
                              </Link>
                              <p className="text-sm text-muted-foreground">KES. {Number(product.price).toFixed(2)}</p>
                              
                              <div className="flex items-center gap-2 mt-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="text-destructive"
                                  onClick={() => removeFromCart(item.id)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>

                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                >
                                  -
                                </Button>

                                <Input
                                  type="number"
                                  min="1"
                                  value={item.quantity}
                                  onChange={(e) => updateQuantity(item.id, parseInt(e.target.value) || 1)}
                                  className="w-16 text-center"
                                />

                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => {updateQuantity(item.id, item.quantity + 1);}}
                                >
                                  +
                                </Button>
                              </div>
                            </div>

                            
                            <div className="h-max flex flex-col items-end gap-2">
                              <p className="font-bold text-lg">
                                KES. {(product.price * item.quantity).toFixed(2)}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Shop specific order summary */}
                    {/* <Separator className="my-4" />
                    <div className="space-y-<Separator className="my-4" />
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Shop subtotal:</span>
                        <span className="font-medium">KES. {shopSubtotal.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-muted-foreground">
                        <span>Delivery fee ({distance.toFixed(1)} km away):</span>
                        <span>KES. {deliveryFeePerShop.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between font-bold text-base pt-2">
                        <span>Shop total:</span>
                        <span>KES. {shopTotal.toFixed(2)}</span>
                      </div>
                    </div>2 text-sm">
                      <div className="flex justify-between">
                        <span>Shop subtotal:</span>
                        <span className="font-medium">KES. {shopSubtotal.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-muted-foreground">
                        <span>Delivery fee ({distance.toFixed(1)} km away):</span>
                        <span>KES. {deliveryFeePerShop.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between font-bold text-base pt-2">
                        <span>Shop total:</span>
                        <span>KES. {shopTotal.toFixed(2)}</span>
                      </div>
                    </div> */}
                  </Card>
                );
              })}

              {/* Cart Actions */}
              {/* <div className="flex flex-wrap gap-3">
                <Button variant="outline" asChild>
                  <Link to="/">Continue Shopping</Link>
                </Button>
                <Button
                  variant="ghost"
                  className="text-destructive"
                  onClick={clearCart}
                >
                  Clear Cart
                </Button>
              </div> */}
            </div>

            {/* Order Summary Sidebar */}
            <div className="lg:col-span-1">
              <Card className="p-6 sticky top-24">
                <h2 className="text-xl font-bold mb-4">Order Summary</h2>

                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span>Items subtotal:</span>
                    <span className="font-medium">KES. {cartTotal.toFixed(2)}</span>
                  </div>
                  {/* <div className="flex justify-between text-muted-foreground">
                    <span>Total Delivery Fees:</span>
                    <span>KES. {totalDeliveryFees.toFixed(2)}</span>
                  </div> */}
                  
                  <Separator />
                  
                  <div className="flex justify-between text-lg font-bold text-accent">
                    <span>Order Total:</span>
                    <span>KES. {orderTotal.toFixed(2)}</span>
                  </div>
                </div>

                <Button className="w-full mt-6 bg-accent hover:bg-accent/90" size="lg" asChild>
                  <Link to="/checkout">Proceed to Checkout</Link>
                </Button>
                <Button variant="outline" asChild className='w-full mt-3'>
                  <Link to="/">Continue Shopping</Link>
                </Button>
                <Button
                  variant="ghost"
                  className="text-destructive w-full mt-3"
                  onClick={clearCart}
                >
                  Clear Cart
                </Button>

                <div className="mt-6 pt-6 border-t space-y-2 text-xs text-muted-foreground">
                  <p className="flex items-center gap-2">
                    ✓ Secure checkout
                  </p>
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
