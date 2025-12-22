import { Heart, ShoppingCart, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Product } from '@/types';
import { mockShops } from '@/data/mockData';
import { useCart } from '@/contexts/CartContext';

interface ProductCardProps {
  product: Product;
}

export const ProductCard = ({ product }: ProductCardProps) => {
  const { addToCart } = useCart();
  const shop = mockShops.find(s => s.id === product.shopId);
  const discount = product.compareAtPrice
    ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
    : 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addToCart({
      productId: product.id,
      shopId: product.shopId,
      price: product.price
    });
  };

  return (
    <Link to={`/product/${product.id}`} className="group">
      <div className="overflow-hidden cursor-pointer">
        {/* Image */}
        <div className="relative aspect-square overflow-hidden bg-muted">
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          
          {/* Badges */}
          {discount > 0 && (
            <Badge className="absolute top-2 left-2 bg-destructive">
              {discount}% OFF
            </Badge>
          )}

          {/* {product.featured && (
            <Badge className="absolute top-2 left-2 bg-accent">
              Featured
            </Badge>
          )} */}

          {/* Wishlist */}
          {/* <Button
            variant="ghost"
            size="icon"
            className="absolute top-2 right-2 h-8 w-8"
            onClick={(e) => {
              e.preventDefault();
              // TODO: Add to wishlist
            }}
          >
            <Heart className="h-4 w-4" />
          </Button> */}
        </div>

        {/* Content */}
        <div className="pt-4 space-y-2">
          {/* Shop Name */}
          {/* <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground truncate">
              {shop?.name}
            </span>
            {shop?.status === 'active' ? (
              <Badge variant="outline" className="text-xs border-success text-success">
                Open
              </Badge>
            ) : (
              <Badge variant="outline" className="text-xs border-destructive text-destructive">
                Closed
              </Badge>
            )}
          </div> */}

          {/* Product Name */}
          <h3 className="uppercase text-md leading-tight truncate">
            {product.name}
          </h3>

          {/* Rating */}
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 fill-warning text-warning" />
            <span className="text-sm font-medium">{product.rating}</span>
            <span className="text-xs text-muted-foreground">
              ({product.rating.length})
            </span>
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-2">
            <span className="text-md font-semibold">
              KES {product.price.toFixed(2)}
            </span>
            {product.compareAtPrice && (
              <span className="text-sm text-muted-foreground line-through">
                KES {product.compareAtPrice.toFixed(2)}
              </span>
            )}
          </div>

          {/* Add to Cart Button */}
          {/* <Button
            className="w-full bg-accent hover:bg-accent/90"
            onClick={handleAddToCart}
          >
            <ShoppingCart className="h-4 w-4 mr-2" />
            Add to Cart
          </Button> */}
        </div>
      </div>
    </Link>
  );
};
