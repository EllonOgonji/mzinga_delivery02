import { Heart, ShoppingCart, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Product } from '@/types';
import { mockShops } from '@/data/mockData';
import { useCart } from '@/contexts/CartContext';

interface ProductCardProps {
  product: any;
}

export const ProductCard = ({ product }: ProductCardProps) => {
  const { addToCart } = useCart();
  const discount = product.compareAtPrice
    ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
    : 0;
  
  const handleAddToCart = () => {
    addToCart(product)
  }

  return (
      <div key={product.id} className="overflow-hidden cursor-pointer border border-border">
        <Link to={`/product/${product.id}`} className="group">
          {/* Image */}
          <div className="relative aspect-square overflow-hidden bg-muted">
            <img
              src={product.image_url}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            
            {/* Badges */}
            {discount > 0 && (
              <Badge className="absolute top-2 left-2 bg-destructive">
                {discount}% OFF
              </Badge>
            )}
          </div>

          {/* Content */}
          <div className="p-4 space-y-2">
            {/* Shop Name */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground truncate">
                {product.store?.name}
              </span>
            </div>

            {/* Product Name */}
            <h3 className="uppercase text-md leading-tight truncate">
              {product.name}
            </h3>

            {/* Rating */}
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 fill-warning text-warning" />
              <span className="text-sm font-medium">{product.average_rating}</span>
              <span className="text-xs text-muted-foreground">
                ({product.ratings.length})
              </span>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-2">
              <span className="text-md font-semibold">
                KES {Number(product.price).toFixed(2)}
              </span>
              {product.compareAtPrice && (
                <span className="text-sm text-muted-foreground line-through">
                  KES {Number(product.compareAtPrice).toFixed(2)}
                </span>
              )}
            </div>
          </div>
        </Link> 
        
        <div className="px-4 space-y-2 mb-4">

              {/* Add to Cart Button */}
          <Button
            className="w-full bg-accent hover:bg-accent/90"
            onClick={handleAddToCart}
          >
            <ShoppingCart className="h-4 w-4 mr-2" />
            Add to Cart
          </Button>
        </div>
      </div>
  );
};
