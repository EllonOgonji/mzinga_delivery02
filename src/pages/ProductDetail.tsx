import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { ProductCard } from '@/components/product/ProductCard';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { mockProducts, mockShops } from '@/data/mockData';
import { useCart } from '@/contexts/CartContext';
import { Heart, Share2, ShoppingCart, Star, MapPin, Clock, Truck, Package, Shield, CheckCircle, Phone, Mail } from 'lucide-react';
import { toast } from 'sonner';

export default function ProductDetail() {
  const { id } = useParams();
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [mainImage, setMainImage] = useState(0);
  const [isWishlisted, setIsWishlisted] = useState(false);

  const product = mockProducts.find(p => p.id === parseInt(id || '0'));
  const shop = product ? mockShops.find(s => s.id === product.shopId) : null;
  const relatedProducts = mockProducts.filter(p => 
    p.id !== product?.id && (p.category === product?.category || p.shopId === product?.shopId)
  ).slice(0, 8);

  if (!product || !shop) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-2">Product not found</h1>
            <Link to="/products">
              <Button>Browse Products</Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const discount = product.compareAtPrice
    ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
    : 0;

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart({
        productId: product.id,
        shopId: product.shopId,
        price: product.price
      });
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: product.description,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard!');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-6">
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
              <BreadcrumbLink asChild>
                <Link to="/products">{product.category}</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link to={`/shop/${shop.id}`}>{shop.name}</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{product.name}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* Product Layout */}
        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          {/* Left: Image Gallery */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="relative aspect-square bg-muted rounded-lg overflow-hidden group">
              <img
                src={product.images[mainImage]}
                alt={product.name}
                className="w-full h-full object-cover cursor-zoom-in hover:scale-110 transition-transform duration-500"
              />
              {discount > 0 && (
                <Badge className="absolute top-4 left-4 bg-destructive text-lg">
                  Save {discount}%
                </Badge>
              )}
              <div className="absolute top-4 right-4 flex gap-2">
                <Button
                  variant="secondary"
                  size="icon"
                  onClick={handleShare}
                >
                  <Share2 className="h-5 w-5" />
                </Button>
              </div>
            </div>

            {/* Thumbnail Gallery */}
            <div className="flex gap-2 overflow-x-auto">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setMainImage(index)}
                  className={`flex-shrink-0 w-20 h-20 rounded-md overflow-hidden border-2 transition-colors ${
                    mainImage === index ? 'border-primary' : 'border-transparent'
                  }`}
                >
                  <img src={image} alt={`${product.name} ${index + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Right: Product Information */}
          <div className="space-y-6">
            {/* Product Header */}
            <div>
              <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
              
              {/* Shop Info */}
              <Link to={`/shop/${shop.id}`} className="flex items-center gap-2 mb-3 hover:text-accent">
                <img src={shop.logo} alt={shop.name} className="w-8 h-8 rounded-full" />
                <span className="font-medium">{shop.name}</span>
                {shop.status === 'active' && (
                  <Badge variant="outline" className="text-xs border-success text-success">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Verified
                  </Badge>
                )}
              </Link>

              {/* Rating */}
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  <Star className="h-5 w-5 fill-warning text-warning" />
                  <span className="text-lg font-semibold">{product.rating}</span>
                </div>
                <button className="text-sm text-muted-foreground hover:text-foreground">
                  ({product.reviewCount} reviews)
                </button>
              </div>
            </div>

            <Separator />

            {/* Pricing */}
            <div>
              <div className="flex items-baseline gap-3 mb-2">
                <span className="text-4xl font-bold text-accent">
                  ${product.price.toFixed(2)}
                </span>
                {product.compareAtPrice && (
                  <>
                    <span className="text-2xl text-muted-foreground line-through">
                      ${product.compareAtPrice.toFixed(2)}
                    </span>
                    <Badge variant="destructive" className="text-sm">
                      Save ${(product.compareAtPrice - product.price).toFixed(2)}
                    </Badge>
                  </>
                )}
              </div>

              {/* Stock Status */}
              {product.stock > 0 ? (
                <div className="flex items-center gap-2 text-success">
                  <CheckCircle className="h-5 w-5" />
                  <span className="font-medium">
                    {product.stock > 10 ? 'In Stock' : `Only ${product.stock} left`}
                  </span>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-destructive">
                  <span className="font-medium">Out of Stock</span>
                </div>
              )}

              {/* Fast Food Prep Time */}
              {product.preparationTime && (
                <div className="flex items-center gap-2 text-muted-foreground mt-2">
                  <Clock className="h-4 w-4" />
                  <span className="text-sm">Preparation time: ~{product.preparationTime} mins</span>
                </div>
              )}
            </div>

            <Separator />

            {/* Product Description */}
            <div>
              <h3 className="font-semibold mb-2">Description</h3>
              <p className="text-muted-foreground leading-relaxed">{product.description}</p>
            </div>

            <Separator />

            {/* Add to Cart Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="flex items-center border rounded-lg">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                  >
                    -
                  </Button>
                  <span className="px-6 py-2 font-semibold">{quantity}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    disabled={quantity >= product.stock}
                  >
                    +
                  </Button>
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  size="lg"
                  className="flex-1"
                  onClick={handleAddToCart}
                  disabled={product.stock === 0}
                >
                  <ShoppingCart className="mr-2 h-5 w-5" />
                  Add to Cart
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => {
                    setIsWishlisted(!isWishlisted);
                    toast.success(isWishlisted ? 'Removed from wishlist' : 'Added to wishlist');
                  }}
                >
                  <Heart className={`h-5 w-5 ${isWishlisted ? 'fill-current' : ''}`} />
                </Button>
              </div>

              <Button size="lg" variant="secondary" className="w-full" onClick={handleAddToCart}>
                Buy Now
              </Button>
            </div>

            <Separator />

            {/* Delivery Information */}
            <Card>
              <CardContent className="p-4 space-y-3">
                <h3 className="font-semibold flex items-center gap-2">
                  <Truck className="h-5 w-5" />
                  Delivery Information
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-start gap-2">
                    <MapPin className="h-4 w-4 mt-0.5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Delivery fee: From ${shop.deliveryFees['0-2km']}</p>
                      <p className="text-muted-foreground text-xs">Depends on your location</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <Clock className="h-4 w-4 mt-0.5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Standard: 2-3 business days</p>
                      <p className="text-muted-foreground text-xs">Express: Same day (if ordered before 2 PM)</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <Package className="h-4 w-4 mt-0.5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Free pickup at shop location</p>
                      <p className="text-muted-foreground text-xs">{shop.location.address}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Shop Information */}
            <Card>
              <CardContent className="p-4 space-y-3">
                <div className="flex items-center gap-3 mb-3">
                  <img src={shop.logo} alt={shop.name} className="w-12 h-12 rounded-full" />
                  <div className="flex-1">
                    <h3 className="font-semibold">{shop.name}</h3>
                    <div className="flex items-center gap-1 text-sm">
                      <Star className="h-4 w-4 fill-warning text-warning" />
                      <span>{shop.rating}</span>
                      <span className="text-muted-foreground">({shop.reviewCount} reviews)</span>
                    </div>
                  </div>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className={shop.status === 'active' ? 'text-success' : 'text-destructive'}>
                      {shop.status === 'active' ? 'Open - Closes at 10 PM' : 'Closed - Opens at 8 AM'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span>2.5 km away</span>
                  </div>
                  <p className="text-muted-foreground">200+ products from this shop</p>
                </div>
                <div className="flex gap-2 pt-2">
                  <Button variant="outline" size="sm" asChild className="flex-1">
                    <Link to={`/shop/${shop.id}`}>Visit Shop</Link>
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    <Phone className="h-4 w-4 mr-2" />
                    Contact
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Tabs Section */}
        <Tabs defaultValue="specifications" className="mb-12">
          <TabsList className="w-full justify-start">
            <TabsTrigger value="specifications">Specifications</TabsTrigger>
            <TabsTrigger value="reviews">Reviews ({product.reviewCount})</TabsTrigger>
            <TabsTrigger value="related">Related Products</TabsTrigger>
          </TabsList>

          <TabsContent value="specifications" className="mt-6">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-4">Product Specifications</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  {Object.entries(product.specifications).map(([key, value]) => (
                    <div key={key} className="flex border-b pb-2">
                      <span className="font-medium w-40 capitalize">{key}:</span>
                      <span className="text-muted-foreground">{value}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reviews" className="mt-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-start gap-8 mb-8">
                  <div className="text-center">
                    <div className="text-5xl font-bold mb-2">{product.rating}</div>
                    <div className="flex items-center justify-center gap-1 mb-2">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`h-5 w-5 ${i < Math.floor(product.rating) ? 'fill-warning text-warning' : 'text-muted'}`} />
                      ))}
                    </div>
                    <p className="text-sm text-muted-foreground">{product.reviewCount} reviews</p>
                  </div>

                  <div className="flex-1 space-y-2">
                    {[5, 4, 3, 2, 1].map(rating => (
                      <div key={rating} className="flex items-center gap-3">
                        <span className="text-sm w-8">{rating} ★</span>
                        <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-warning" 
                            style={{ width: `${rating === 5 ? 80 : rating === 4 ? 15 : 5}%` }}
                          />
                        </div>
                        <span className="text-sm text-muted-foreground w-12 text-right">
                          {rating === 5 ? '80%' : rating === 4 ? '15%' : '5%'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <Separator className="my-6" />

                <div className="space-y-6">
                  <h4 className="font-semibold">Customer Reviews</h4>
                  <div className="text-center py-8 text-muted-foreground">
                    <p>No reviews yet. Be the first to review this product!</p>
                    <Button className="mt-4">Write a Review</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="related" className="mt-6">
            <h3 className="text-xl font-semibold mb-6">Related Products</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map(relatedProduct => (
                <ProductCard key={relatedProduct.id} product={relatedProduct} />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </main>

      <Footer />

      {/* Sticky Buy Bar (Mobile) */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-background border-t p-4 flex items-center gap-3 z-50">
        <div className="flex-1">
          <div className="text-2xl font-bold text-accent">${product.price.toFixed(2)}</div>
        </div>
        <Button size="lg" onClick={handleAddToCart} disabled={product.stock === 0}>
          <ShoppingCart className="mr-2 h-5 w-5" />
          Add to Cart
        </Button>
        <Button size="lg" variant="outline" onClick={() => setIsWishlisted(!isWishlisted)}>
          <Heart className={`h-5 w-5 ${isWishlisted ? 'fill-current' : ''}`} />
        </Button>
      </div>
    </div>
  );
}
