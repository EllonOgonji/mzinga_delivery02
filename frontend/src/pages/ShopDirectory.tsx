import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from '@/components/ui/label';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { mockShops, mockCategories } from "@/data/mockData";
import { Grid3x3, MapPin, Heart, Star, Clock, Truck } from "lucide-react";
import { Filter, X, ChevronDown, ChevronUp } from 'lucide-react';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Sheet, SheetHeader, SheetTitle, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Shop } from "@/types";
import { getAllShops } from "@/data/shopData";
import { calculateDeliveryFee, findDistanceBetweenUserAndShop } from "@/lib/utils";

const ShopDirectory = () => {
  type expandableSections = 'categories' | 'rating' | 'delivery' | 'features' | 'distance';

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("featured");
  const categories = mockCategories;
  const [shopFeatures, setShopFeatures] = useState<{ id: string; label: string }[]>([
    { id: 'open-now', label: 'Open now' },
    // { id: 'top-rated', label: 'Top rated (4+ stars)' },
    // { id: 'fast-delivery', label: 'Fast delivery (< 2 hours)' },
    // { id: 'budget-friendly', label: 'Budget-friendly' }
  ]);
  const [selectedShopFeatures, setSelectedShopFeatures] = useState<string[]>([]);

  const { data: shops = [], isLoading } = useQuery({
    queryKey: ['shops', 'directory'],
    queryFn: async () => await getAllShops({})
  });

  // Expandable sections - recal which sections are open and which are not
  const [expandedSections, setExpandedSections] = useState<{
    [key in expandableSections]: boolean;
  }>({
    categories: true,
    rating: true,
    delivery: false,
    features: false,
    distance: false
  });
  const toggleSection = (section: expandableSections) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const FilterSidebar = () => (
    <div className="space-y-6">
      {/* Category Filter */}
      <div className="border-b pb-4">
        <button
          onClick={() => toggleSection('categories')}
          className="flex items-center justify-between w-full text-left mb-3"
        >
          <h3 className="font-semibold">Categories</h3>
          {expandedSections.categories ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </button>
        {expandedSections.categories && (
          <div className="space-y-2">
            {categories.map(category => (
              <div key={category} className="flex items-center space-x-2">
                <Checkbox
                  id={`category-${category}`}
                  checked={selectedCategories.includes(category)}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      setSelectedCategories(prev => [...prev, category]);
                    } else {
                      setSelectedCategories(prev => prev.filter(c => c !== category));
                    }
                  }}
                />
                <Label htmlFor={`category-${category}`} className="text-sm cursor-pointer">
                  {category}
                </Label>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Rating Filter */}
      <div className="border-b pb-4">
        <button
          onClick={() => toggleSection('rating')}
          className="flex items-center justify-between w-full text-left mb-3"
        >
          <h3 className="font-semibold">Rating</h3>
          {expandedSections.rating ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </button>
        {expandedSections.rating && (
          <div className="space-y-2">
            {[5, 4, 3, 2, 1].map(rating => (
              <div key={rating} className="flex items-center space-x-2">
                <Checkbox
                  id={`rating-${rating}`}
                  checked={selectedRatings.includes(rating)}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      setSelectedRatings([rating]);
                    } else {
                      setSelectedRatings([]);
                    }
                  }}
                />
                <Label htmlFor={`rating-${rating}`} className="text-sm cursor-pointer">
                  {rating === 5 ? '5 stars' : `${rating} stars & up`}
                </Label>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Delivery Options */}
      <div className="border-b pb-4">
        <button
          onClick={() => toggleSection('delivery')}
          className="flex items-center justify-between w-full text-left mb-3"
        >
          <h3 className="font-semibold">Delivery Options</h3>
          {expandedSections.delivery ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </button>
        {expandedSections.delivery && (
          <div className="space-y-2">
            {['Pickup available', 'Express delivery', 'Standard delivery', 'Scheduled delivery', 'Free delivery'].map(option => (
              <div key={option} className="flex items-center space-x-2">
                <Checkbox
                  id={`delivery-${option}`}
                  checked={deliveryOptions.includes(option)}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      setDeliveryOptions(prev => [...prev, option]);
                    } else {
                      setDeliveryOptions(prev => prev.filter(o => o !== option));
                    }
                  }}
                />
                <Label htmlFor={`delivery-${option}`} className="text-sm cursor-pointer">
                  {option}
                </Label>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Shop Features */}
      <div className="border-b pb-4">
        <button
          onClick={() => toggleSection('features')}
          className="flex items-center justify-between w-full text-left mb-3"
        >
          <h3 className="font-semibold">Shop Features</h3>
          {expandedSections.features ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </button>
        {expandedSections.features && (
          <div className="space-y-2">
            {shopFeatures.map(feature => (
              <div key={feature.id} className="flex items-center space-x-2">
                <Checkbox
                  id={`feature-${feature.id}`}
                  checked={selectedShopFeatures.includes(feature.id)}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      setSelectedShopFeatures(prev => [...prev, feature.id]);
                    } else {
                      setSelectedShopFeatures(prev => prev.filter(f => f !== feature.id));
                    }
                  }}
                />
                <Label htmlFor={`feature-${feature.id}`} className="text-sm cursor-pointer">
                  {feature.label}
                </Label>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Distance Filter */}
      <div className="pb-4">
        <button
          onClick={() => toggleSection('distance')}
          className="flex items-center justify-between w-full text-left mb-3"
        >
          <h3 className="font-semibold">Distance</h3>
          {expandedSections.distance ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </button>
        {expandedSections.distance && (
          <RadioGroup value={distance} onValueChange={setDistance}>
            {['within-1km', 'within-2km', 'within-5km', 'within-10km', '10km+', 'any'].map(dist => (
              <div key={dist} className="flex items-center space-x-2">
                <RadioGroupItem value={dist} id={`distance-${dist}`} />
                <Label htmlFor={`distance-${dist}`} className="text-sm cursor-pointer">
                  {dist === 'any' ? 'Any distance' : dist.replace('within-', 'Within ').replace('km', ' km')}
                </Label>
              </div>
            ))}
          </RadioGroup>
        )}
      </div>

      {/* Action Buttons */}
      <div className="space-y-2">
        <Button variant="outline" className="w-full" onClick={clearAllFilters}>
          Clear All Filters
        </Button>
      </div>
    </div>
  );

  // Filter states
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedRatings, setSelectedRatings] = useState<number[]>([]);
  const [deliveryOptions, setDeliveryOptions] = useState<string[]>([]);
  const [distance, setDistance] = useState('any');
  // Filter and sort shops
  const filteredShops = useMemo(() => {
    // Filter by search query
    let filtered = shops;

    if (searchQuery.trim() !== "") {
      filtered = filtered.filter((shop) =>
        shop.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        shop.category.some(cat => cat.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // Filter by categories
    if (selectedCategories.length > 0) {
      filtered = filtered.filter(shop =>
        shop.category.some(cat => selectedCategories.includes(cat))
      );
    }

    // Filter by shop features
    if (selectedShopFeatures.includes('open-now')) {
      filtered = filtered.filter(s => s.status === 'open');
    }

    return filtered;
  }, [selectedCategories, selectedRatings, selectedShopFeatures, sortBy, searchQuery, shops]);

  const uniqueShops = new Set(filteredShops.map(p => p.id)).size;

  const clearAllFilters = () => {
    setSelectedCategories([]);
    setSelectedRatings([]);
    setShopFeatures([]);
    setDistance('any');
  };

  const activeFilters = [
    ...selectedCategories.map(c => ({ label: c, type: 'category' as const })),
    ...(selectedRatings.length > 0 ? [{ label: `${Math.min(...selectedRatings)}+ stars`, type: 'rating' as const }] : []),
    ...selectedShopFeatures.map(f => ({ label: f.replace('-', ' '), type: 'feature' as const })),
  ];

  const removeFilter = (filter: typeof activeFilters[0]) => {
    if (filter.type === 'category') {
      setSelectedCategories(prev => prev.filter(c => c !== filter.label));
    } else if (filter.type === 'rating') {
      setSelectedRatings([]);
    } else if (filter.type === 'feature') {
      setSelectedShopFeatures(prev => prev.filter(f => f.replace('-', ' ') !== filter.label));
    }
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
        <div className="flex gap-6">
          {/* Filters Sidebar */}
          {/* <aside className="lg:col-span-1">
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-4">Filters</h3>
                
                <div className="space-y-6">
                  
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
          </aside> */}

          {/* <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="sticky top-20">
              <FilterSidebar />
            </div>
          </aside> */}

          {/* Main Content */}
          <div className="flex-1">
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
                <SelectTrigger className="w-full md:w-48 rounded-none">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="featured">Featured</SelectItem>
                  <SelectItem value="rating">Top Rated</SelectItem>
                  <SelectItem value="nearest">Nearest</SelectItem>
                  <SelectItem value="name">A-Z</SelectItem>
                </SelectContent>
              </Select>

              {/* Mobile Filter Button */}
              <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
                <SheetTrigger asChild>
                  <Button variant="outline" size="sm" className="lg:hidden">
                    <Filter className="h-4 w-4 mr-2" />
                    Filters
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-80 overflow-y-auto">
                  <SheetHeader>
                    <SheetTitle>Filters</SheetTitle>
                  </SheetHeader>
                  <div className="mt-6">
                    <FilterSidebar />
                  </div>
                </SheetContent>
              </Sheet>

              {/* <div className="flex gap-2">
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
              </div> */}
            </div>

            {/* Results Count */}
            <p className="text-sm text-muted-foreground mb-4">
              {filteredShops.length} shops found
            </p>

            {/* Shop Grid/List */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredShops.map((shop) => {
                const deliveryFees = calculateDeliveryFee({ lat: shop.latitude, lon: shop.longitude });
                const distanceToUser = findDistanceBetweenUserAndShop({ lat: shop.latitude, lon: shop.longitude });
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
                            {/* {shop.category.slice(0, 2).map((cat) => (
                              <Badge key={cat} variant="secondary" className="text-xs">
                                {cat}
                              </Badge>
                            ))} */}

                            <Badge variant="secondary" className="text-xs">
                              {shop.category}
                            </Badge>
                          </div>
                        </div>

                        <div className="space-y-2 text-sm">
                          {/* <div className="flex items-center gap-2">
                            <Star className="w-4 h-4 fill-primary text-primary" />
                            <span className="font-medium">{averageRating}</span>
                            <span className="text-muted-foreground">({shop.rating.length} reviews)</span>
                          </div> */}
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <MapPin className="w-4 h-4" />
                            <span>{distanceToUser.toFixed(1)} km away</span>
                          </div>
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Truck className="w-4 h-4" />
                            <span>KES. {deliveryFees}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4" />
                            <span className={shop.status === "approved" ? "text-success" : "text-destructive"}>
                              {shop.status.toUpperCase()}
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