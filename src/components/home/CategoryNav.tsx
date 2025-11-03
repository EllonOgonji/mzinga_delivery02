import { Link } from 'react-router-dom';
import { Beer, Pizza, Smartphone, ShoppingCart, Shirt, Sparkles, Home, Wrench } from 'lucide-react';

const categories = [
  { id: 1, name: 'Alcohol', icon: Beer, color: 'text-amber-500' },
  { id: 2, name: 'Fast Food', icon: Pizza, color: 'text-red-500' },
  { id: 3, name: 'Groceries', icon: ShoppingCart, color: 'text-green-500' },
  { id: 4, name: 'Fashion', icon: Shirt, color: 'text-purple-500' },
  { id: 5, name: 'Electronics', icon: Smartphone, color: 'text-blue-500' },
  { id: 6, name: 'Beauty', icon: Sparkles, color: 'text-pink-500' },
  { id: 7, name: 'Home & Garden', icon: Home, color: 'text-emerald-500' },
  { id: 8, name: 'Services', icon: Wrench, color: 'text-gray-500' },
];

export const CategoryNav = () => {
  return (
    <div className="py-8">
      <h2 className="text-2xl font-bold mb-6">Shop by Category</h2>
      <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
        {categories.map((category) => {
          const Icon = category.icon;
          return (
            <Link
              key={category.id}
              to={`/products?category=${category.name}`}
              className="flex flex-col items-center gap-2 min-w-[100px] p-4 rounded-lg bg-card hover-lift group"
            >
              <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center group-hover:bg-accent/10 transition-colors">
                <Icon className={`h-8 w-8 ${category.color} group-hover:scale-110 transition-transform`} />
              </div>
              <span className="text-sm font-medium text-center">{category.name}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
};
