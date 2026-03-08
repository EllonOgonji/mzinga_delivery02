import { useState, useMemo, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link, useSearchParams } from 'react-router-dom';
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
import { useShopFilter } from '@/contexts/ShopFilterContext';
import { Filter, Grid, List, X, ChevronDown, ChevronUp, Search } from 'lucide-react';
import { Product, ProductFilters } from '@/types';
import { getAllProducts } from '@/data/productData';
import { Pagination, PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious, } from "@/components/ui/pagination";

const categories = [
  'Alcohol',
  'Beverage',
  'Fast Food',
];

export default function Products() {
  const [searchParams] = useSearchParams();
  const search = searchParams.get('search');

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isShopFilterOpen, setIsShopFilterOpen] = useState(false);
  const [sortBy, setSortBy] = useState('price-low');

  // Filter states
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [priceRange, setPriceRange] = useState([0, 0]);
  const [minPrice, setMinPrice] = useState('0');
  const [maxPrice, setMaxPrice] = useState('0');
  const [selectedRating, setSelectedRating] = useState<number>(0);
  const [shopFeatures, setShopFeatures] = useState<string[]>([]);
  const searchTermRef = useRef(null)
  const [paginationSettings, setPaginationSettings] = useState({
    page: 1,
    limit: 8,
    total: 0,
    totalPages: 0,
    searchQuery: search || '',
    category: '',
    priceRange: {
      min: null,
      max: null
    }
  });

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

  const { data: products = [], isLoading } = useQuery({
    queryKey: ['products', paginationSettings],
    queryFn: async () => {
      const res = await getAllProducts(paginationSettings)
      setPaginationSettings(prev => ({
        ...prev,
        total: res.meta.total,
        totalPages: Math.ceil(res.meta.total / prev.limit)
      }))
      return res.data
    },
  });

  const clearAllFilters = () => {
   setPaginationSettings({
    page: 1,
    limit: 8,
    total: 0,
    totalPages: 0,
    searchQuery: '',
    category: '',
    priceRange: {
      min: 0,
      max: 0
    }
   })
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
                  checked={selectedCategory == category}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      setPaginationSettings({...paginationSettings, category: category})
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
          </div>
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

  const MobileSidebar = () => (
    <div className='grid grid-cols-1 md:grid-cols-9 gap-4'>
      <div className="md:col-span-6 md:mt-7">
        <div className="relative w-full flex gap-2">
          <form className='flex items-center gap-2 w-full' onSubmit={(e) => {e.preventDefault(); setPaginationSettings({...paginationSettings, searchQuery: searchTermRef.current.value})}}>
            <Input
              ref={searchTermRef}
              name='searchTerm'
              type="search"
              placeholder="Search products"
              className="w-full"
            />
            <Button type='submit' variant="outline">
              <Search/>
            </Button>
          </form>
        </div>
      </div>

      <div className="md:col-span-1">
        <div className="flex flex-col items-start justify-center gap-2">
          <Label className='text-sm text-muted-foreground font-light'>Category</Label>
          <Select value={paginationSettings.category} onValueChange={(value) => setPaginationSettings({...paginationSettings, category: value})}>
            <SelectTrigger className="w-full rounded-none">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map(category => (
                <SelectItem key={category} value={category}>{category}</SelectItem>
              ))}
            </SelectContent>
          </Select>
      </div>
        </div>
        {/* Sort Dropdown */}

      <div className="flex items-center gap-2 md:col-span-2">
        <div className='flex flex-col'>
          <Label className='mb-2 text-sm text-muted-foreground font-light'>Min price</Label>
          <Input
            type="number"
            placeholder="Min price"
            value={minPrice}
            onChange={(e) => {
              setPaginationSettings({...paginationSettings, priceRange: {...paginationSettings.priceRange, min: Number(e.target.value)}})
            }}
            className="w-full"
          />
        </div>
        <div className='flex flex-col'>
          <Label className='mb-2 text-sm text-muted-foreground font-light'>Max price</Label>
            <Input
            type="number"
            placeholder="Max price"
            value={maxPrice}
            onChange={(e) => {
            setPaginationSettings({...paginationSettings, priceRange: {...paginationSettings.priceRange, max: Number(e.target.value)}})
            }}
            className="w-full"
          />
        </div>
      </div>

    </div>
  );

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1 container mx-auto px-4 py-6">
        <div className="flex gap-6">
          {/* Desktop Sidebar */}
          {/* <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="sticky top-20">
              <FilterSidebar />
            </div>
          </aside> */}

          {/* Main Content */}
          <div className="flex-1">
            {/* Results Header */}
            <div className="flex md:flex-col items-end md:items-start justify-between gap-4 mb-6">
              <div className="flex items-center justify-between gap-4">

                {/* Mobile Filter Button */}
                {/* <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
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
                </Sheet> */}

                {/* Mobile Categories Button */}
                <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
                  <SheetTrigger asChild>
                    <Button variant="outline" size="icon" className="lg:hidden">
                      <Filter className="h-2 w-2" />
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="left" className="w-80 overflow-y-auto">
                    <SheetHeader>
                      <SheetTitle>Filters</SheetTitle>
                    </SheetHeader>
                    <div className="mt-6">
                      <MobileSidebar />
                    </div>
                  </SheetContent>
                </Sheet>
              </div>
              
              <div className='hidden md:block'>
                <MobileSidebar />
              </div>
              
              <h1 className="text-sm uppercase text-accent-foreground">
                {paginationSettings.total} products found
              </h1>
            </div>

            {/* Product Grid */}
            {products.length === 0 ? (
              <div className="text-center py-16">
                <div className="mb-4 text-6xl">🛍️</div>
                <h2 className="text-2xl font-semibold mb-2">No products found</h2>
                <p className="text-muted-foreground mb-6">Try adjusting your filters or browse all shops</p>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Suggestions:</p>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>
                      <Button onClick={clearAllFilters} className="mt-6">
                        Clear Filters
                      </Button>
                    </li>
                    <li>
                      <Link to={"/"}>
                        <Button onClick={clearAllFilters} className="mt-6">
                          View all shops
                        </Button>
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
            ) : (
              <div className={'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6'}>
                {products.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}

            <div>
              {/* Pagination */}
              {(paginationSettings.total / paginationSettings.limit) > 1 && (
                <Pagination className="mt-8">
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          if (paginationSettings.page > 1) {
                            setPaginationSettings(prev => ({ ...prev, page: prev.page - 1 }));
                          }
                        }}
                        className={paginationSettings.page === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                      />
                    </PaginationItem>

                    {[...Array(paginationSettings.totalPages)].map((_, i) => {
                      const pageNum = i + 1;
                      // Show first, last, current, and adjacent pages
                      if (
                        pageNum === 1 ||
                        pageNum === paginationSettings.totalPages ||
                        (pageNum >= paginationSettings.page - 1 && pageNum <= paginationSettings.page + 1)
                      ) {
                        return (
                          <PaginationItem key={pageNum}>
                            <PaginationLink
                              href="#"
                              onClick={(e) => {
                                e.preventDefault();
                                setPaginationSettings(prev => ({ ...prev, page: pageNum }));
                              }}
                              isActive={paginationSettings.page === pageNum}
                              className="cursor-pointer"
                            >
                              {pageNum}
                            </PaginationLink>
                          </PaginationItem>
                        );
                      } else if (
                        pageNum === paginationSettings.page - 2 ||
                        pageNum === paginationSettings.page + 2
                      ) {
                        return (
                          <PaginationItem key={pageNum}>
                            <PaginationEllipsis />
                          </PaginationItem>
                        );
                      }
                      return null;
                    })}

                    <PaginationItem>
                      <PaginationNext
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          if (paginationSettings.page < paginationSettings.totalPages) {
                            setPaginationSettings(prev => ({ ...prev, page: prev.page + 1 }));
                          }
                        }}
                        className={paginationSettings.page === paginationSettings.totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />

      {/* <ShopFilterModal
        open={isShopFilterOpen}
        onOpenChange={setIsShopFilterOpen}
      /> */}
    </div>
  );
}
