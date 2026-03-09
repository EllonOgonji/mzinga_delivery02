import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
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
  Search,
} from "lucide-react";
import { getAllShops, getSingleShop } from "@/data/shopData";
import { getAllProducts, getSingleStoreProducts } from "@/data/productData";
import { Shop } from "@/types";
import { useToast } from '@/hooks/use-toast';

const ShopDetail = () => {
  const { id } = useParams();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("featured");
    const [paginationSettings, setPaginationSettings] = useState({
    page: 1,
    limit: 6,
    total: 0,
    totalPages: 0,
    searchQuery: ''
  });

  const shopId = id ? parseInt(id) : undefined;

  const { data: shop = {} as Shop, isLoading: isLoadingShop } = useQuery({
    queryKey: ['shop', shopId],
    queryFn: async () => await getSingleShop(shopId),
    enabled: !!shopId
  });

  const { data: shopProducts = [], isLoading: isLoadingProducts } = useQuery({
    queryKey: ['shopProducts', shopId],
    queryFn: async () => await getSingleStoreProducts(shopId),
    enabled: !!shopId
  });

  if (isLoadingShop || isLoadingProducts) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!shop) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-xl md:text-2xl font-bold mb-2">Shop Not Found</h1>
            <Button asChild>
              <Link to="/shops">Browse All Shops</Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const filteredProducts = shopProducts.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleShopShare = (shopId: number) => {
    navigator.clipboard.writeText(`${import.meta.env.VITE_FRONTEND_URL}/shop/${shopId}`)
    toast({
      title: "Success!",
      description: `Link copied successfully`,
    });
  }

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
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-4 h-full">
                      <div className="h-full flex flex-col justify-between">
                        <h1 className="text-2xl md:text-3xl font-bold mb-2">{shop.name}</h1>
                        <div className="flex flex-wrap gap-2 mb-2">
                          <Badge variant="secondary">
                            {shop.category}
                          </Badge>
                        </div>
                        {/* <div className="flex items-center gap-2">
                          <div className="flex items-center gap-1">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-5 h-5 ${
                                  i < Math.floor(Number(shop.averageRating))
                                    ? "fill-primary text-primary"
                                    : "text-muted"
                                }`}
                              />
                            ))}
                          </div>
                          <span className="font-medium">{shop.averageRating}</span>
                          <span className="text-muted-foreground">
                            ({shop.rating.length} reviews)
                          </span>
                        </div> */}
                      </div>

                      <div className="flex gap-2">
                        <Button variant="outline" size="icon" onClick={() => {handleShopShare(shop.id)}} title="Share shop">
                          <Share2 className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="icon" onClick={() => {handleShopShare(shop.id)}} title="View on map">
                          <MapPin className="w-4 h-4" />
                        </Button>
                      </div>
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
          </TabsList>

          <TabsContent value="products" className="mt-6">
            {/* Products Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            {filteredProducts.length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground text-sm md:text-base">No products found</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="about" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold text-lg mb-4">About {shop.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {shop.name} has been serving customers since {new Date(shop.createdAt).getFullYear()}, 
                    providing quality products and excellent service.
                  </p>
                </CardContent>
              </Card> */}

              {/* <Card>
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
              </Card> */}

              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold text-base md:text-lg mb-4">Location</h3>
                  <div className="space-y-4">
                    {/* <div className="flex items-start gap-2">
                      <MapPin className="w-5 h-5 text-muted-foreground mt-0.5" />
                    </div> */}
                    <div className="h-48 bg-muted flex items-center justify-center">
                      <p className="text-xs md:text-sm text-muted-foreground">Map View</p>
                    </div>
                    {/* <Button variant="outline" className="w-full">
                      Get Directions
                    </Button> */}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <Footer />
    </div>
  );
};

export default ShopDetail;