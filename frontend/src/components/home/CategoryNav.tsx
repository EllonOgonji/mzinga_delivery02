import { Link } from 'react-router-dom';
import { Beer, Pizza, Smartphone, ShoppingCart, Shirt, Sparkles, Home, Wrench, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/contexts/ThemeContext';

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
  const { isDark } = useTheme();
  const variant = isDark ? 'secondary' : 'outline';
  return (
    <div className="pt-12">
      {/* <h2 className="text-2xl font-bold mb-6">Shop by Category</h2> */}
      <div className="flex justify-center gap-4 overflow-x-auto pb-4 scrollbar-hide no-scrollbar">
        {categories.map((category) => {
          const Icon = category.icon;
          return (
            <Button
              key={category.id}
              variant={variant}
              className="flex items-center gap-2"
            >
              <Icon className={`h-8 w-8 ${category.color} group-hover:scale-110 transition-transform`} />
              {category.name}
            </Button>

            // <div className="relative overflow-hidden px-4 min-w-[100px] w-[320px] h-[200px] flex-shrink-0">
            //   <div
            //     className="absolute inset-0 z-0 bg-cover bg-center"
            //     style={{
            //       backgroundImage:
            //         "url('https://images.unsplash.com/photo-1487958449943-2429e8be8625?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1470')",
            //     }}
            //     aria-hidden="true"
            //   />

            //   <div className="absolute inset-0 z-0 bg-black/70" aria-hidden="true" />

            //   <main className="relative h-full w-full z-10 mx-auto pt-8 text-center text-white flex flex-col items-center gap-4">
            //       <h1 className='text-3xl'>{category.name}</h1>
            //       {/* <p className='text-sm'>Buy new tech</p> */}
            //       <Button variant="secondary">Shop category</Button>
            //       {/* <Link
            //         key={category.id}
            //         to={`/products?category=${category.name}`}
            //         className="flex flex-col items-center gap-2 min-w-[100px] p-4 rounded-lg bg-card hover-lift group"
            //       >
            //         <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center group-hover:bg-accent/10 transition-colors">
            //           <Icon className={`h-8 w-8 ${category.color} group-hover:scale-110 transition-transform`} />
            //         </div>
            //         <span className="text-sm font-medium text-center">{category.name}</span>
            //       </Link> */}
            //   </main>
            // </div>

            // <Link
            //   key={category.id}
            //   to={`/products?category=${category.name}`}
            //   className="flex flex-col items-center gap-2 min-w-[100px] p-4 rounded-lg bg-card hover-lift group"
            // >
            //   <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center group-hover:bg-accent/10 transition-colors">
            //     <Icon className={`h-8 w-8 ${category.color} group-hover:scale-110 transition-transform`} />
            //   </div>
            //   <span className="text-sm font-medium text-center">{category.name}</span>
            // </Link>
          );
        })}
      </div>
    </div>
  );
};
