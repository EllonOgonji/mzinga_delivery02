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

export default function Cart() {
  const { cart, updateQuantity, removeFromCart, clearCart, cartTotal, cartCount } = useCart();

  // Group cart items by shop
  const cartByShop = cart.reduce((acc, item) => {
    if (!acc[item.shopId]) {
      acc[item.shopId] = [];
    }
    acc[item.shopId].push(item);
    return acc;
  }, {} as Record<number, typeof cart>);

  const shopIds = Object.keys(cartByShop).map(Number);
  const deliveryFeePerShop = 3; // Simplified
  const totalDeliveryFees = shopIds.length * deliveryFeePerShop;
  const orderTotal = cartTotal + totalDeliveryFees;

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
          <nav className="text-sm text-muted-foreground mb-6">
            <Link to="/" className="hover:text-accent">Home</Link>
            <span className="mx-2">/</span>
            <span>Cart</span>
          </nav>

          {/* Page Header */}
          <h1 className="text-3xl font-bold mb-8">
            Shopping Cart ({cartCount} items from {shopIds.length} {shopIds.length === 1 ? 'shop' : 'shops'})
          </h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content - Cart Items */}
            <div className="lg:col-span-2 space-y-6">
              {shopIds.map(shopId => {
                const shop = mockShops.find(s => s.id === shopId);
                const shopItems = cartByShop[shopId];
                const shopSubtotal = shopItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
                const shopTotal = shopSubtotal + deliveryFeePerShop;

                return (
                  <Card key={shopId} className="p-6">
                    {/* Shop Header */}
                    <div className="flex items-center justify-between mb-4 pb-4 border-b">
                      <div className="flex items-center gap-3">
                        <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center">
                          <Store className="h-6 w-6" />
                        </div>
                        <div>
                          <Link to={`/shop/${shopId}`} className="font-semibold hover:text-accent">
                            {shop?.name}
                          </Link>
                          {shop?.status === 'active' ? (
                            <Badge variant="outline" className="ml-2 text-xs border-success text-success">
                              Open - Closes at 9 PM
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="ml-2 text-xs border-destructive text-destructive">
                              Closed
                            </Badge>
                          )}
                        </div>
                      </div>
                      <Button variant="outline" size="sm" asChild>
                        <Link to={`/shop/${shopId}`}>Visit Shop</Link>
                      </Button>
                    </div>

                    {/* Products */}
                    <div className="space-y-4">
                      {shopItems.map(item => {
                        const product = mockProducts.find(p => p.id === item.productId);
                        if (!product) return null;

                        return (
                          <div key={item.productId} className="flex gap-4">
                            {/* Product Image */}
                            <Link to={`/product/${product.id}`} className="flex-shrink-0">
                              <img
                                src={product.images[0]}
                                alt={product.name}
                                className="h-20 w-20 object-cover rounded-md"
                              />
                            </Link>

                            {/* Product Details */}
                            <div className="flex-1 min-w-0">
                              <Link
                                to={`/product/${product.id}`}
                                className="font-semibold hover:text-accent line-clamp-1"
                              >
                                {product.name}
                              </Link>
                              <p className="text-sm text-muted-foreground">{shop?.name}</p>
                              <p className="text-sm font-medium mt-1">${product.price.toFixed(2)}</p>
                              {product.preparationTime && (
                                <p className="text-xs text-muted-foreground">
                                  Prep: ~{product.preparationTime} mins
                                </p>
                              )}

                              {/* Quantity Selector */}
                              <div className="flex items-center gap-2 mt-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                                >
                                  -
                                </Button>
                                <Input
                                  type="number"
                                  min="1"
                                  value={item.quantity}
                                  onChange={(e) => updateQuantity(item.productId, parseInt(e.target.value) || 1)}
                                  className="w-16 text-center"
                                />
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                                >
                                  +
                                </Button>
                              </div>
                            </div>

                            {/* Subtotal & Actions */}
                            <div className="flex flex-col items-end gap-2">
                              <p className="font-bold text-lg">
                                ${(product.price * item.quantity).toFixed(2)}
                              </p>
                              <div className="flex gap-1">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8"
                                  onClick={() => {
                                    // TODO: Move to wishlist
                                    removeFromCart(item.productId);
                                  }}
                                >
                                  <Heart className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 text-destructive"
                                  onClick={() => removeFromCart(item.productId)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Shop Footer */}
                    <Separator className="my-4" />
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Shop subtotal:</span>
                        <span className="font-medium">${shopSubtotal.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-muted-foreground">
                        <span>Delivery fee (2.5 km away):</span>
                        <span>${deliveryFeePerShop.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between font-bold text-base pt-2">
                        <span>Shop total:</span>
                        <span>${shopTotal.toFixed(2)}</span>
                      </div>
                    </div>
                  </Card>
                );
              })}

              {/* Cart Actions */}
              <div className="flex flex-wrap gap-3">
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
              </div>
            </div>

            {/* Order Summary Sidebar */}
            <div className="lg:col-span-1">
              <Card className="p-6 sticky top-24">
                <h2 className="text-xl font-bold mb-4">Order Summary</h2>

                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span>Items subtotal:</span>
                    <span className="font-medium">${cartTotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>Total Delivery Fees:</span>
                    <span>${totalDeliveryFees.toFixed(2)}</span>
                  </div>
                  
                  <Separator />
                  
                  <div className="flex justify-between text-lg font-bold text-accent">
                    <span>Order Total:</span>
                    <span>${orderTotal.toFixed(2)}</span>
                  </div>
                </div>

                <Button className="w-full mt-6 bg-accent hover:bg-accent/90" size="lg" asChild>
                  <Link to="/checkout">Proceed to Checkout</Link>
                </Button>

                <div className="mt-6 pt-6 border-t space-y-2 text-xs text-muted-foreground">
                  <p className="flex items-center gap-2">
                    ✓ Secure checkout
                  </p>
                  <p className="flex items-center gap-2">
                    ✓ Money-back guarantee
                  </p>
                  <p className="flex items-center gap-2">
                    ✓ Multiple payment methods
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
