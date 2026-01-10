import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { X, Search, Heart, Clock, MapPin, Star, Truck, Sparkles } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { useShopFilter } from '@/contexts/ShopFilterContext';
import { mockShops } from '@/data/mockData';
import { getAllShops } from "@/data/shopData";
import { calculateDeliveryFee, findDistanceBetweenUserAndShop } from '@/lib/utils';

interface ShopFilterModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const quickFilters = [
  { id: 'favorites', label: 'My Favorites', icon: Heart },
  { id: 'open', label: 'Open Now', icon: Clock },
  { id: 'near', label: 'Near Me (< 2km)', icon: MapPin },
  { id: 'rated', label: 'Top Rated', icon: Star },
  { id: 'fast', label: 'Fast Delivery', icon: Truck },
  { id: 'new', label: 'New Shops', icon: Sparkles },
];

export const ShopFilterModal = ({ open, onOpenChange }: ShopFilterModalProps) => {
  const { selectedShops, toggleShop, clearShops } = useShopFilter();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilters, setActiveFilters] = useState<string[]>([]);

  const { data: shops = [] } = useQuery({
    queryKey: ['shops', 'filterModal'],
    queryFn: async () => {
      const res = await getAllShops({limit:10, page:1})
      return res.data
    }
  });

  const toggleFilter = (filterId: string) => {
    setActiveFilters(prev =>
      prev.includes(filterId)
        ? prev.filter(id => id !== filterId)
        : [...prev, filterId]
    );
  };

  const handleApply = () => {
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] p-0">
        <DialogHeader className="p-6 pb-4 border-b">
          <div className="flex flex-col gap-4">
            <DialogTitle>Select Shops to Browse From</DialogTitle>
            <Badge variant="secondary" className='w-max'>
              {selectedShops.length} shops selected
            </Badge>
          </div>
        </DialogHeader>

        <div className="p-6 pt-4 space-y-4 overflow-y-auto">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search shops by name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Quick Filters */}
          <div className="flex flex-wrap gap-2">
            {quickFilters.map(filter => {
              const Icon = filter.icon;
              const isActive = activeFilters.includes(filter.id);
              return (
                <Button
                  key={filter.id}
                  variant={isActive ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => toggleFilter(filter.id)}
                  className={isActive ? 'bg-accent hover:bg-accent/90' : ''}
                >
                  <Icon className="h-3 w-3 mr-2" />
                  {filter.label}
                </Button>
              );
            })}
          </div>

          {/* Shop List */}
          <div className="space-y-2">
            {shops.map((shop) => {
              const deliveryFees = calculateDeliveryFee({ lat: shop.latitude, lon: shop.longitude });
              const distanceToUser = findDistanceBetweenUserAndShop({ lat: shop.latitude, lon: shop.longitude }).toFixed(1);
              return (
                <div
                  key={shop.id}
                  className={`flex items-start gap-4 p-4 border cursor-pointer ${selectedShops.includes(shop.id) ? 'border-accent bg-accent/5' : 'bg-card'
                    }`}
                  onClick={() => toggleShop(shop.id)}
                >
                  <Checkbox
                    checked={selectedShops.includes(shop.id)}
                    onCheckedChange={() => toggleShop(shop.id)}
                    onClick={(e) => e.stopPropagation()}
                  />

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="font-semibold">{shop.name}</h3>
                        <div className="flex gap-2 mt-1">
                          <Badge variant="secondary" className="text-xs">
                            {shop.category}
                          </Badge>
                        </div>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          // TODO: Toggle favorite
                        }}
                        className="text-muted-foreground hover:text-accent transition-colors"
                      >
                        <Heart className="h-4 w-4" />
                      </button>
                    </div>

                    <div className="flex flex-wrap gap-4 mt-2 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {distanceToUser} km away
                      </div>
                      <div className="flex items-center gap-1">
                        <Truck className="h-3 w-3" />
                        KES. {deliveryFees}
                      </div>
                    </div>

                    <div className="mt-2">
                      {shop.status ? (
                        <span className="text-xs text-success font-medium">
                          {shop.status}
                        </span>
                      ) : (
                        <span className="text-xs text-destructive font-medium">
                          {shop.status}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-6 pt-4 border-t flex items-center justify-between">
          <Button variant="ghost" onClick={clearShops}>
            Clear Selection
          </Button>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={handleApply} className="bg-accent hover:bg-accent/90">
              Apply ({selectedShops.length} shops)
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
