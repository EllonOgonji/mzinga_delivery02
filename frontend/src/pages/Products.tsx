import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { ProductCard } from '@/components/product/ProductCard';
import { ShopFilterModal } from '@/components/shop/ShopFilterModal';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { mockProducts, mockShops } from '@/data/mockData';
import { useShopFilter } from '@/contexts/ShopFilterContext';
import { Filter, Grid, List, X, ChevronDown, ChevronUp } from 'lucide-react';
import { Product, ProductFilters } from '@/types';
import { getAllProducts } from '@/data/productData';

const categories = [
  'Alcohol & Beverages',
  'Fast Food',
  'Groceries',
  'Electronics',
  'Fashion',
  'Beauty & Personal Care',
  'Home & Garden',
  'Services',
  'Health & Wellness'
];

export default function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const { selectedShops, isShopSelected } = useShopFilter();
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isShopFilterOpen, setIsShopFilterOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('relevance');

  // Filter states
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState([0, 0]);
  const [minPrice, setMinPrice] = useState('0');
  const [maxPrice, setMaxPrice] = useState('0');
  const [selectedRatings, setSelectedRatings] = useState<number[]>([]);
  const [deliveryOptions, setDeliveryOptions] = useState<string[]>([]);
  const [shopFeatures, setShopFeatures] = useState<string[]>([]);
  const [distance, setDistance] = useState('any');
  const [shopFromAll, setShopFromAll] = useState(selectedShops.length === 0);

  // Expandable sections
  const [expandedSections, setExpandedSections] = useState({
    shops: true,
    categories: true,
    price: true,
    rating: true,
    delivery: false,
    features: false,
    distance: false
  });

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  // Filter and sort products
  // Construct filter object
  const filter = useMemo(() => {
    let f: ProductFilters = {};

    if (!shopFromAll && selectedShops.length > 0) {
      f.shopIdMultiple = selectedShops;
    }

    // Filter by categories
    if (selectedCategories.length > 0) {
      // Use categoryMultiple for multiple categories
      f.categoryMultiple = selectedCategories;
    }

    // Filter by price range
    if (priceRange[0] != 0 || priceRange[1] != 0) {
      f.priceRange = { min: priceRange[0], max: priceRange[1] };
    }

    // Filter by rating
    if (selectedRatings.length > 0) {
      f.rating = Math.min(...selectedRatings);
    }

    // Filter by shop features
    if (shopFeatures.includes('open-now')) {
      f.shopOpen = true;
    }
    if (shopFeatures.includes('top-rated')) {
      f.rating = 4;
    }

    return f;
  }, [selectedShops, shopFromAll, selectedCategories, priceRange, selectedRatings, shopFeatures]);

  const { data: fetchedProducts = [], isLoading } = useQuery({
    queryKey: ['products', filter],
    queryFn: () => getAllProducts(filter)
  });

  // Sort products
  const filteredProducts = useMemo(() => {
    let products = [...fetchedProducts];

    switch (sortBy) {
      case 'price-low':
        products.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        products.sort((a, b) => b.price - a.price)
        break;
      case 'newest':
        products.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        break;
    }

    return products;
  }, [fetchedProducts, sortBy]);

  const uniqueShops = new Set(filteredProducts.map(p => p.shopId)).size;

  const clearAllFilters = () => {
    setSelectedCategories([]);
    setPriceRange([0, 0]);
    setMinPrice('0');
    setMaxPrice('0');
    setSelectedRatings([]);
    setDeliveryOptions([]);
    setShopFeatures([]);
    setDistance('any');
  };

  const activeFilters = [
    ...selectedCategories.map(c => ({ label: c, type: 'category' as const })),
    ...(selectedRatings.length > 0 ? [{ label: `${Math.min(...selectedRatings)}+ stars`, type: 'rating' as const }] : []),
    ...(priceRange[0] > 0 || priceRange[1] < 500 ? [{ label: `$${priceRange[0]}-$${priceRange[1]}`, type: 'price' as const }] : []),
    ...shopFeatures.map(f => ({ label: f.replace('-', ' '), type: 'feature' as const })),
  ];

  const removeFilter = (filter: typeof activeFilters[0]) => {
    if (filter.type === 'category') {
      setSelectedCategories(prev => prev.filter(c => c !== filter.label));
    } else if (filter.type === 'rating') {
      setSelectedRatings([]);
    } else if (filter.type === 'price') {
      setPriceRange([0, 500]);
      setMinPrice('0');
      setMaxPrice('500');
    } else if (filter.type === 'feature') {
      setShopFeatures(prev => prev.filter(f => f.replace('-', ' ') !== filter.label));
    }
  };

  const FilterSidebar = () => (
    <div className="space-y-6">
      {/* Shop Filter Section */}
      {/* <div className="border-b pb-4">
        <button
          onClick={() => toggleSection('shops')}
          className="flex items-center justify-between w-full text-left mb-3"
        >
          <h3 className="font-semibold">Selected Shops</h3>
          {expandedSections.shops ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </button>
        {expandedSections.shops && (
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="shop-from-all"
                checked={shopFromAll}
                onCheckedChange={(checked) => setShopFromAll(checked as boolean)}
              />
              <Label htmlFor="shop-from-all" className="text-sm cursor-pointer">
                Shop from all stores
              </Label>
            </div>
            {!shopFromAll && (
              <>
                <p className="text-sm text-muted-foreground">
                  {selectedShops.length === 0 ? 'No shops selected' : `${selectedShops.length} shops selected`}
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={() => setIsShopFilterOpen(true)}
                >
                  Change Shops
                </Button>
              </>
            )}
          </div>
        )}
      </div> */}

      {/* Category Filter */}
      {/* <div className="border-b pb-4">
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
      </div> */}

      {/* Price Range */}
      <div className="border-b pb-4">
        <button
          onClick={() => toggleSection('price')}
          className="flex items-center justify-between w-full text-left mb-3"
        >
          <h3 className="font-semibold">Price Range</h3>
          {expandedSections.price ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </button>
        {expandedSections.price && (
          <div className="space-y-4">
            {/* <Slider
              value={priceRange}
              onValueChange={(value) => {
                setPriceRange(value);
                setMinPrice(value[0].toString());
                setMaxPrice(value[1].toString());
              }}
              max={500}
              step={5}
              className="w-full"
            /> */}
            <div className="flex items-center gap-2">
              <Input
                type="number"
                placeholder="Min"
                value={minPrice}
                onChange={(e) => {
                  setMinPrice(e.target.value);
                  const val = parseInt(e.target.value) || 0;
                  setPriceRange([val, priceRange[1]]);
                }}
                className="w-full"
              />
              -
              <Input
                type="number"
                placeholder="Max"
                value={maxPrice}
                onChange={(e) => {
                  setMaxPrice(e.target.value);
                  const val = parseInt(e.target.value) || 500;
                  setPriceRange([priceRange[0], val]);
                }}
                className="w-full"
              />
            </div>
            {/* <div className="flex flex-wrap gap-2">
              <Button variant="outline" size="sm" onClick={() => { setPriceRange([0, 10]); setMinPrice('0'); setMaxPrice('10'); }}>
                Under $10
              </Button>
              <Button variant="outline" size="sm" onClick={() => { setPriceRange([10, 50]); setMinPrice('10'); setMaxPrice('50'); }}>
                $10-$50
              </Button>
              <Button variant="outline" size="sm" onClick={() => { setPriceRange([50, 100]); setMinPrice('50'); setMaxPrice('100'); }}>
                $50-$100
              </Button>
              <Button variant="outline" size="sm" onClick={() => { setPriceRange([100, 500]); setMinPrice('100'); setMaxPrice('500'); }}>
                Over $100
              </Button>
            </div> */}
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
      {/* <div className="border-b pb-4">
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
      </div> */}

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
            {[
              { id: 'open-now', label: 'Open now' },
            ].map(feature => (
              <div key={feature.id} className="flex items-center space-x-2">
                <Checkbox
                  id={`feature-${feature.id}`}
                  checked={shopFeatures.includes(feature.id)}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      setShopFeatures(prev => [...prev, feature.id]);
                    } else {
                      setShopFeatures(prev => prev.filter(f => f !== feature.id));
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
            {['within-1km', 'within-5km', 'any'].map(dist => (
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

  const CategoriesSidebar = () => (
    <div className="space-y-6">
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
    </div>
  );

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
              <BreadcrumbPage>Products</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className='lg:flex flex-wrap justify-between mb-6 hidden'>
          {categories.map((category) => (
            <Button variant='outline'>
              {category}
            </Button>
          ))}
        </div>

        <div className="flex gap-6">
          {/* Desktop Sidebar */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="sticky top-20">
              <FilterSidebar />
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex-1">
            {/* Results Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div className="flex items-center gap-4">
                <h1 className="text-xl font-bold">
                  {filteredProducts.length} products from {uniqueShops} {uniqueShops === 1 ? 'shop' : 'shops'}
                </h1>

                {/* Mobile Filter Button */}
                <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
                  <SheetTrigger asChild>
                    <Button variant="outline" size="sm" className="lg:hidden">
                      <Filter className="h-4 w-4" />

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

                {/* Mobile Categories Button */}
                <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
                  <SheetTrigger asChild>
                    <Button variant="outline" size="sm" className="lg:hidden">
                      Categories
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="left" className="w-80 overflow-y-auto">
                    <SheetHeader>
                      <SheetTitle>Categories</SheetTitle>
                    </SheetHeader>
                    <div className="mt-6">
                      <CategoriesSidebar />
                    </div>
                  </SheetContent>
                </Sheet>
              </div>

              <div className="flex items-center gap-4">
                {/* View Toggle */}
                {/* <div className="flex border rounded-lg">
                  <Button
                    variant={viewMode === 'grid' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('grid')}
                  >
                    <Grid className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === 'list' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('list')}
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </div> */}

                {/* Sort Dropdown */}
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-full md:w-48 rounded-none">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="relevance">Relevance</SelectItem>
                    <SelectItem value="price-low">Price: Low to High</SelectItem>
                    <SelectItem value="price-high">Price: High to Low</SelectItem>
                    <SelectItem value="newest">Newest First</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Active Filters */}
            {activeFilters.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {activeFilters.map((filter, index) => (
                  <Badge key={index} variant="secondary" className="gap-1">
                    {filter.label}
                    <button onClick={() => removeFilter(filter)}>
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
                <Button variant="link" size="sm" onClick={clearAllFilters}>
                  Clear all
                </Button>
              </div>
            )}

            {/* Product Grid */}
            {filteredProducts.length === 0 ? (
              <div className="text-center py-16">
                <div className="mb-4 text-6xl">🛍️</div>
                <h2 className="text-2xl font-semibold mb-2">No products found</h2>
                <p className="text-muted-foreground mb-6">Try adjusting your filters or browse all shops</p>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Suggestions:</p>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Clear some filters</li>
                    <li>• Browse all shops</li>
                    <li>• Try different keywords</li>
                  </ul>
                </div>
                <Button onClick={clearAllFilters} className="mt-6">
                  Clear Filters
                </Button>
              </div>
            ) : (
              <div className={viewMode === 'grid'
                ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
                : 'space-y-4'
              }>
                {filteredProducts.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}

            {/* Pagination */}
            {filteredProducts.length > 0 && (
              <div className="mt-8 text-center">
                <Button variant="outline" size="lg">
                  Load More
                </Button>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
      <ShopFilterModal
        open={isShopFilterOpen}
        onOpenChange={setIsShopFilterOpen}
      />
    </div>
  );
}
