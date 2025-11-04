import { useState } from "react";
import { Link } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { mockShops } from "@/data/mockData";
import { Grid3x3, List, MapPin, Heart, Star, Clock, Truck } from "lucide-react";

const ShopDirectory = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState("featured");

  const filteredShops = mockShops.filter((shop) =>
    shop.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    shop.category.some(cat => cat.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const getShopStatus = (shop: typeof mockShops[0]) => {
    const now = new Date();
    const day = now.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
    const hours = shop.openingHours[day];
    
    if (!hours) return { isOpen: false, text: "Closed" };
    
    const currentTime = now.getHours() * 60 + now.getMinutes();
    const [openHour, openMin] = hours.open.split(':').map(Number);
    const [closeHour, closeMin] = hours.close.split(':').map(Number);
    const openTime = openHour * 60 + openMin;
    const closeTime = closeHour * 60 + closeMin;
    
    const isOpen = currentTime >= openTime && currentTime <= closeTime;
    return {
      isOpen,
      text: isOpen ? `Open - Closes at ${hours.close}` : `Closed - Opens at ${hours.open}`,
    };
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      {/* Banner */}
      <section className="bg-gradient-hero py-16">
        <div className="container text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Explore All Shops</h1>
          <p className="text-lg text-muted-foreground mb-6">
            Browse through our amazing collection of shops
          </p>
          <Button size="lg" className="bg-primary hover:bg-primary/90">
            Become a Vendor
          </Button>
        </div>
      </section>

      <div className="container py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <aside className="lg:col-span-1">
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-4">Filters</h3>
                
                <div className="space-y-6">
                  {/* Categories */}
                  <div>
                    <h4 className="text-sm font-medium mb-3">Categories</h4>
                    <div className="space-y-2">
                      {["Groceries", "Electronics", "Fashion", "Fast Food", "Beauty", "Home & Garden"].map((cat) => (
                        <div key={cat} className="flex items-center gap-2">
                          <Checkbox id={cat} />
                          <label htmlFor={cat} className="text-sm cursor-pointer">
                            {cat}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Rating */}
                  <div>
                    <h4 className="text-sm font-medium mb-3">Rating</h4>
                    <div className="space-y-2">
                      {[4.5, 4, 3].map((rating) => (
                        <div key={rating} className="flex items-center gap-2">
                          <Checkbox id={`rating-${rating}`} />
                          <label htmlFor={`rating-${rating}`} className="text-sm cursor-pointer flex items-center gap-1">
                            <Star className="w-4 h-4 fill-primary text-primary" />
                            {rating}+ stars
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Status */}
                  <div>
                    <h4 className="text-sm font-medium mb-3">Status</h4>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Checkbox id="open-now" />
                        <label htmlFor="open-now" className="text-sm cursor-pointer">
                          Open Now
                        </label>
                      </div>
                      <div className="flex items-center gap-2">
                        <Checkbox id="featured" />
                        <label htmlFor="featured" className="text-sm cursor-pointer">
                          Featured
                        </label>
                      </div>
                    </div>
                  </div>

                  <Button variant="outline" className="w-full">Clear Filters</Button>
                </div>
              </CardContent>
            </Card>
          </aside>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Search and Controls */}
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="flex-1">
                <Input
                  placeholder="Search shops..."
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
                  <SelectItem value="rating">Top Rated</SelectItem>
                  <SelectItem value="nearest">Nearest</SelectItem>
                  <SelectItem value="name">A-Z</SelectItem>
                </SelectContent>
              </Select>
              <div className="flex gap-2">
                <Button
                  variant={viewMode === "grid" ? "default" : "outline"}
                  size="icon"
                  onClick={() => setViewMode("grid")}
                >
                  <Grid3x3 className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "outline"}
                  size="icon"
                  onClick={() => setViewMode("list")}
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Results Count */}
            <p className="text-sm text-muted-foreground mb-4">
              {filteredShops.length} shops found
            </p>

            {/* Shop Grid/List */}
            <div className={viewMode === "grid" 
              ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6" 
              : "space-y-4"
            }>
              {filteredShops.map((shop) => {
                const status = getShopStatus(shop);
                return (
                  <Card key={shop.id} className="group hover:shadow-lg transition-all duration-300">
                    <CardContent className="p-0">
                      {/* Banner */}
                      <div className="relative h-32 bg-gradient-hero overflow-hidden">
                        <img
                          src={shop.banner}
                          alt=""
                          className="w-full h-full object-cover"
                        />
                        <Button
                          variant="ghost"
                          size="icon"
                          className="absolute top-2 right-2 bg-background/80 hover:bg-background"
                        >
                          <Heart className="w-4 h-4" />
                        </Button>
                        {/* Logo */}
                        <div className="absolute bottom-0 left-4 translate-y-1/2">
                          <img
                            src={shop.logo}
                            alt=""
                            className="w-16 h-16 rounded-full border-4 border-background"
                          />
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-4 pt-10">
                        <div className="mb-3">
                          <h3 className="font-semibold text-lg mb-1">{shop.name}</h3>
                          <div className="flex flex-wrap gap-1 mb-2">
                            {shop.category.slice(0, 2).map((cat) => (
                              <Badge key={cat} variant="secondary" className="text-xs">
                                {cat}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        <div className="space-y-2 text-sm">
                          <div className="flex items-center gap-2">
                            <Star className="w-4 h-4 fill-primary text-primary" />
                            <span className="font-medium">{shop.rating}</span>
                            <span className="text-muted-foreground">({shop.reviewCount} reviews)</span>
                          </div>
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <MapPin className="w-4 h-4" />
                            <span>2.5 km away</span>
                          </div>
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Truck className="w-4 h-4" />
                            <span>From ${shop.deliveryFees["0-2km"]}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4" />
                            <span className={status.isOpen ? "text-success" : "text-destructive"}>
                              {status.text}
                            </span>
                          </div>
                        </div>

                        <Button asChild className="w-full mt-4">
                          <Link to={`/shop/${shop.id}`}>Visit Shop</Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ShopDirectory;