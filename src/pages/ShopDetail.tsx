import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ProductCard } from "@/components/product/ProductCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { mockShops, mockProducts } from "@/data/mockData";
import { 
  Heart, 
  Share2, 
  MapPin, 
  Truck, 
  Clock, 
  Phone, 
  Mail, 
  Star,
  Facebook,
  Instagram,
  Twitter,
} from "lucide-react";

const ShopDetail = () => {
  const { id } = useParams();
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("featured");

  const shop = mockShops.find((s) => s.id === Number(id));
  const shopProducts = mockProducts.filter((p) => p.shopId === Number(id));

  if (!shop) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-2">Shop Not Found</h1>
            <Button asChild>
              <Link to="/shops">Browse All Shops</Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const getShopStatus = () => {
    const now = new Date();
    const day = now.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
    const hours = shop.openingHours[day];
    
    if (!hours) return { isOpen: false, text: "Closed" };
    
    return {
      isOpen: true,
      text: `Open - Closes at ${hours.close}`,
    };
  };

  const status = getShopStatus();

  const filteredProducts = shopProducts.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      {/* Shop Header */}
      <div className="relative">
        {/* Banner */}
        <div className="h-64 bg-gradient-hero overflow-hidden">
          <img
            src={shop.banner}
            alt=""
            className="w-full h-full object-cover"
          />
        </div>

        {/* Shop Info */}
        <div className="container">
          <div className="relative -mt-16">
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row gap-6">
                  {/* Logo */}
                  <img
                    src={shop.logo}
                    alt={shop.name}
                    className="w-32 h-32 rounded-lg border-4 border-background shadow-lg"
                  />

                  {/* Info */}
                  <div className="flex-1">
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-4">
                      <div>
                        <h1 className="text-3xl font-bold mb-2">{shop.name}</h1>
                        <div className="flex flex-wrap gap-2 mb-2">
                          {shop.category.map((cat) => (
                            <Badge key={cat} variant="secondary">
                              {cat}
                            </Badge>
                          ))}
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="flex items-center gap-1">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-5 h-5 ${
                                  i < Math.floor(shop.rating)
                                    ? "fill-primary text-primary"
                                    : "text-muted"
                                }`}
                              />
                            ))}
                          </div>
                          <span className="font-medium">{shop.rating}</span>
                          <span className="text-muted-foreground">
                            ({shop.reviewCount} reviews)
                          </span>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button variant="outline" size="icon">
                          <Heart className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="icon">
                          <Share2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    {/* Quick Info */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="flex items-center gap-2 text-sm">
                        <MapPin className="w-4 h-4 text-muted-foreground" />
                        <span>2.5 km away</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Truck className="w-4 h-4 text-muted-foreground" />
                        <span>From ${shop.deliveryFees["0-2km"]} delivery</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Clock className={`w-4 h-4 ${status.isOpen ? "text-success" : "text-destructive"}`} />
                        <span className={status.isOpen ? "text-success" : "text-destructive"}>
                          {status.text}
                        </span>
                      </div>
                    </div>

                    <div className="flex gap-2 mt-4">
                      <Button>
                        <Phone className="w-4 h-4 mr-2" />
                        Contact Shop
                      </Button>
                      <Button variant="outline">
                        <MapPin className="w-4 h-4 mr-2" />
                        View on Map
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="container py-8">
        <Tabs defaultValue="products" className="w-full">
          <TabsList className="w-full justify-start border-b rounded-none h-auto p-0 bg-transparent">
            <TabsTrigger value="products" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary">
              Products
            </TabsTrigger>
            <TabsTrigger value="about" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary">
              About
            </TabsTrigger>
            <TabsTrigger value="reviews" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary">
              Reviews
            </TabsTrigger>
          </TabsList>

          <TabsContent value="products" className="mt-6">
            {/* Search and Filter */}
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="flex-1">
                <Input
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="featured">Featured</SelectItem>
                  <SelectItem value="price-asc">Price: Low to High</SelectItem>
                  <SelectItem value="price-desc">Price: High to Low</SelectItem>
                  <SelectItem value="rating">Top Rated</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            {filteredProducts.length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No products found</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="about" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold text-lg mb-4">About {shop.name}</h3>
                  <p className="text-muted-foreground mb-4">{shop.description}</p>
                  <p className="text-sm text-muted-foreground">
                    {shop.name} has been serving customers since {new Date(shop.createdAt).getFullYear()}, 
                    providing quality products and excellent service.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold text-lg mb-4">Opening Hours</h3>
                  <div className="space-y-2">
                    {Object.entries(shop.openingHours).map(([day, hours]) => (
                      <div key={day} className="flex justify-between text-sm">
                        <span className="capitalize font-medium">{day}</span>
                        <span className="text-muted-foreground">
                          {hours.open} - {hours.close}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold text-lg mb-4">Location</h3>
                  <div className="space-y-4">
                    <div className="flex items-start gap-2">
                      <MapPin className="w-5 h-5 text-muted-foreground mt-0.5" />
                      <p className="text-sm">{shop.location.address}</p>
                    </div>
                    <div className="h-48 bg-muted rounded-lg flex items-center justify-center">
                      <p className="text-sm text-muted-foreground">Map View</p>
                    </div>
                    <Button variant="outline" className="w-full">
                      Get Directions
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold text-lg mb-4">Contact Information</h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Phone className="w-5 h-5 text-muted-foreground" />
                      <a href="tel:+254712345678" className="text-sm hover:text-primary">
                        +254 712 345 678
                      </a>
                    </div>
                    <div className="flex items-center gap-3">
                      <Mail className="w-5 h-5 text-muted-foreground" />
                      <a href="mailto:info@shop.com" className="text-sm hover:text-primary">
                        info@{shop.name.toLowerCase().replace(/\s+/g, '')}.com
                      </a>
                    </div>
                  </div>

                  <div className="mt-6">
                    <h4 className="font-medium mb-3">Follow Us</h4>
                    <div className="flex gap-2">
                      <Button variant="outline" size="icon">
                        <Facebook className="w-4 h-4" />
                      </Button>
                      <Button variant="outline" size="icon">
                        <Instagram className="w-4 h-4" />
                      </Button>
                      <Button variant="outline" size="icon">
                        <Twitter className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="reviews" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Rating Summary */}
              <Card>
                <CardContent className="p-6">
                  <div className="text-center mb-6">
                    <div className="text-5xl font-bold mb-2">{shop.rating}</div>
                    <div className="flex justify-center mb-2">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-5 h-5 ${
                            i < Math.floor(shop.rating)
                              ? "fill-primary text-primary"
                              : "text-muted"
                          }`}
                        />
                      ))}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Based on {shop.reviewCount} reviews
                    </p>
                  </div>

                  <div className="space-y-2">
                    {[5, 4, 3, 2, 1].map((rating) => (
                      <div key={rating} className="flex items-center gap-2">
                        <span className="text-sm w-3">{rating}</span>
                        <Star className="w-4 h-4 fill-primary text-primary" />
                        <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                          <div
                            className="h-full bg-primary"
                            style={{
                              width: `${rating === 5 ? 80 : rating === 4 ? 15 : 5}%`,
                            }}
                          />
                        </div>
                        <span className="text-sm text-muted-foreground w-10 text-right">
                          {rating === 5 ? 80 : rating === 4 ? 15 : 5}%
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Reviews List */}
              <div className="lg:col-span-2 space-y-4">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <img
                        src="/placeholder.svg"
                        alt=""
                        className="w-12 h-12 rounded-full"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold">John Doe</span>
                          <Badge variant="secondary" className="text-xs">
                            Verified Purchase
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2 mb-2">
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className="w-4 h-4 fill-primary text-primary"
                              />
                            ))}
                          </div>
                          <span className="text-sm text-muted-foreground">
                            2 days ago
                          </span>
                        </div>
                        <p className="text-sm mb-2">
                          Excellent shop with great products and fast delivery!
                          Will definitely order again.
                        </p>
                        <Button variant="ghost" size="sm">
                          Helpful (12)
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <Footer />
    </div>
  );
};

export default ShopDetail;