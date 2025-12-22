import { Store, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useShopFilter } from '@/contexts/ShopFilterContext';
import { mockShops } from '@/data/mockData';

interface ShopSelectionBarProps {
  onOpenModal: () => void;
}

export const ShopSelectionBar = ({ onOpenModal }: ShopSelectionBarProps) => {
  const { selectedShops, toggleShop } = useShopFilter();

  const getShopName = (shopId: number) => {
    const shop = mockShops.find(s => s.id === shopId);
    return shop?.name || 'Unknown Shop';
  };

  return (
    <div className="bg-card border-y py-4 sticky top-[113px] z-40 backdrop-blur-sm bg-background/95">
      <div className="container mx-auto px-4">
        <div className="flex items-center gap-4 flex-wrap">
          <Button
            onClick={onOpenModal}
            className="bg-accent hover:bg-accent/90 gap-2"
          >
            <Store className="h-4 w-4" />
            Select Shops
          </Button>

          {/* {selectedShops.length > 0 ? (
            <>
              <span className="text-sm text-muted-foreground">
                Shopping from {selectedShops.length} {selectedShops.length === 1 ? 'shop' : 'shops'}:
              </span>
              <div className="flex gap-2 flex-wrap">
                {selectedShops.map(shopId => (
                  <Badge
                    key={shopId}
                    variant="secondary"
                    className="gap-2 pr-1"
                  >
                    {getShopName(shopId)}
                    <button
                      onClick={() => toggleShop(shopId)}
                      className="hover:bg-destructive/20 rounded-full p-0.5 transition-colors"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </>
          ) : (
            <span className="text-sm text-muted-foreground">
              Shopping from all shops
            </span>
          )} */}

          {selectedShops.length > 0 && (
            <>
              <div className="flex gap-2 flex-wrap">
                {selectedShops.map(shopId => (
                  <Badge
                    key={shopId}
                    variant="secondary"
                    className="gap-2 pr-1"
                  >
                    {getShopName(shopId)}
                    <button
                      onClick={() => toggleShop(shopId)}
                      className="hover:bg-destructive/20 rounded-full p-0.5 transition-colors"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
