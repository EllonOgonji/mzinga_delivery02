import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, Loader } from 'lucide-react';
import { getAllShops } from "@/data/shopData";
import { Pagination, PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious, } from "@/components/ui/pagination";

const ShopDirectory = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [paginationSettings, setPaginationSettings] = useState({
    page: 1,
    limit: 6,
    total: 0,
    totalPages: 0,
    searchQuery: ''
  });

  const { data: shops = [], isLoading } = useQuery({
    queryKey: ['shops', 'directory', paginationSettings.page, paginationSettings.limit, paginationSettings.searchQuery],
    queryFn: async () => {
      const res = await getAllShops({limit: paginationSettings.limit, page: paginationSettings.page, searchQuery: paginationSettings.searchQuery});
      setPaginationSettings(prev => ({
        ...prev,
        total: res.meta.total,
        totalPages: Math.ceil(res.meta.total / prev.limit)
      }))
      return res.data;
    }
  });

  const clearAllFilters = () => {
   setPaginationSettings({...paginationSettings, searchQuery: ''})
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <div className="container py-8">
        <div className="flex gap-6">
          {/* Main Content */}
          <div className="flex-1">

            {/* Search and Controls */}
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="flex flex-1 gap-2">
                <Input
                  placeholder="Search shops..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  
                />
                <Button
                  variant="outline"
                  onClick={() => {setPaginationSettings(prev => ({ ...prev, page: 1, searchQuery: searchQuery }));}}>
                  <Search className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Results Count */}
            <p className="text-sm text-muted-foreground mb-4">
              {paginationSettings.total} shops found
            </p>

            {shops.length === 0 ? (
              <>
                {isLoading ? (  
                  <div className="text-center py-16 flex justify-center items-center h-96">
                    <Loader className="animate-spin h-5 w-5 mr-3" />
                  </div>) : 
                  <div className="text-center py-16">
                    <div className="mb-4 text-6xl">🛍️</div>
                    <h2 className="text-2xl font-semibold mb-2">No shops found</h2>
                    <p className="text-muted-foreground mb-6">Try refreshing the page</p>
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">Suggestions:</p>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li>
                          <Link to={"/"}>
                            <Button onClick={clearAllFilters} className="mt-6">
                              Refresh page
                            </Button>
                          </Link>
                        </li>
                      </ul>
                    </div>
                  </div>
                  }
              </>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {shops.map((shop) => {
                return (
                  <Card key={shop.id} className="group hover:shadow-lg transition-all duration-300">
                    <CardContent className="p-0">
                      <Link to={`/shop/${shop.id}`}>
                        {/* Banner */}
                        <div className="relative h-32 bg-gradient-hero overflow-hidden">
                          <img
                            src={shop.banner}
                            alt=""
                            className="w-full h-full object-cover"
                          />
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

                              <Badge variant="shopCard" className="text-xs mt-4">
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
                          </div>
                          
                        </div>
                      </Link>
                      
                    </CardContent>
                  </Card>
                );
              })}
              </div>
            )}

            {/* Shop Grid/List */}

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
      </div>

      <Footer />
    </div>
  );
};

export default ShopDirectory;