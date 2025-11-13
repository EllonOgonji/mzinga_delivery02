import { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Hero } from '@/components/home/Hero';
import { CategoryNav } from '@/components/home/CategoryNav';
import { ShopSelectionBar } from '@/components/shop/ShopSelectionBar';
import { ShopFilterModal } from '@/components/shop/ShopFilterModal';
import { ProductCard } from '@/components/product/ProductCard';
import { Button } from '@/components/ui/button';
import { mockProducts } from '@/data/mockData';
import { useShopFilter } from '@/contexts/ShopFilterContext';
import { Beer, Pizza, Smartphone, ShoppingCart, Shirt, Sparkles, Home, Wrench, ChevronRight } from 'lucide-react';
import { getAllProducts } from '@/data/productData';

const Index = () => {
  const [shopModalOpen, setShopModalOpen] = useState(false);
  const { selectedShops } = useShopFilter();

  // Filter products based on selected shops
  const filteredProducts = getAllProducts(selectedShops.length > 0 ? { idMultiple: selectedShops } : {});

  const featuredDeals = filteredProducts.filter(p => p.featured).slice(0, 8);
  const trendingProducts = filteredProducts.slice(0, 8);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <ShopSelectionBar onOpenModal={() => setShopModalOpen(true)} />
      
      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">
          {/* Hero Section */}
          <Hero />

          {/* Category Navigation */}
          <CategoryNav />

          {/* Featured Deals */}
          <section className="py-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Today's Hot Deals</h2>
              <Button variant="ghost">View All Deals <ChevronRight/> </Button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 xl:grid-cols-5 gap-6">
              {featuredDeals.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </section>

          {/* Trending Products */}
          <section className="py-12">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold">Trending Products</h2>
                <p className="text-muted-foreground mt-1">
                  {selectedShops.length > 0 
                    ? `From ${selectedShops.length} selected ${selectedShops.length === 1 ? 'shop' : 'shops'}`
                    : 'From all shops'
                  }
                </p>
              </div>
              <Button variant="ghost">See More <ChevronRight/> </Button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 xl:grid-cols-5 gap-6">
              {trendingProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </section>

          {/* How It Works */}
          <section className="py-12 bg-gradient-card rounded-lg p-8">
            <h2 className="text-2xl font-bold text-center mb-12">How Cstop Shop Works</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                {
                  step: '1',
                  title: 'Select Your Favorite Shops',
                  description: 'Choose which shops you want to browse from, or shop from all stores'
                },
                {
                  step: '2',
                  title: 'Browse & Add to Cart',
                  description: 'Explore products from multiple shops and add them to your cart'
                },
                {
                  step: '3',
                  title: 'Checkout & Pay Securely',
                  description: 'Complete your purchase with secure payment options'
                },
                {
                  step: '4',
                  title: 'Track & Enjoy',
                  description: 'Track your orders and enjoy your products from multiple shops'
                }
              ].map((item) => (
                <div key={item.step} className="text-center">
                  <div className="h-16 w-16 rounded-full bg-accent text-white flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                    {item.step}
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>

      <Footer />
      <ShopFilterModal open={shopModalOpen} onOpenChange={setShopModalOpen} />
    </div>
  );
};

export default Index;
