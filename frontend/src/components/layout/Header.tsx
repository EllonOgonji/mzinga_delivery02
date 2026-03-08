import { ShoppingBag, Heart, User, Sun, Moon, Search, Menu, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTheme } from '@/contexts/ThemeContext';
import { useCart } from '@/contexts/CartContext';
import useAuth from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useState } from 'react';

export const Header = () => {
  const { isDark, toggleTheme } = useTheme();
  const {logout} = useAuth();
  const { cartCount } = useCart();
  const [searchTerm, setSearchTerm] = useState('');

  // return (
  //   <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
  //     <div className="container mx-auto px-4">
  //       <div className="flex h-16 items-center justify-between gap-4">
  //         {/* Logo */}
  //         <Link to="/" className="flex items-center gap-2 font-bold text-xl">
  //           <ShoppingBag className="h-6 w-6 text-accent" />
  //           <span className="hidden sm:inline">Mzinga Delivery</span>
  //         </Link>

  //         {/* Search Bar - Desktop */}
  //         {/* <div className="hidden md:flex flex-1 max-w-xl mx-8">
  //           <div className="relative w-full flex gap-2">
  //             <Input
  //               type="search"
  //               placeholder="Search products"
  //               className="w-full"
  //               value={searchTerm}
  //               onChange={(e) => setSearchTerm(e.target.value)}
  //             />
  //             <Button variant="outline" onClick={() => { window.location.href=`/products?search=${encodeURIComponent(searchTerm)}`; setSearchTerm(''); }}>
  //               <Search/>
  //             </Button>
  //           </div>
  //         </div> */}

  //         {/* Actions */}
  //         <div className="flex items-center gap-1">
  //           {/* Cart */}
  //           <Button variant="ghost" size="default" className="relative" asChild>
  //             <Link to="/cart">
  //               <ShoppingBag className="h-5 w-5" />
  //               {cartCount > 0 && (
  //                 <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs bg-accent">
  //                   {cartCount}
  //                 </Badge>
  //               )}
  //               Shops
  //             </Link>
  //           </Button>

  //           {/* Cart */}
  //           <Button variant="ghost" size="default" className="relative" asChild>
  //             <Link to="/cart">
  //               <ShoppingBag className="h-5 w-5" />
  //               {cartCount > 0 && (
  //                 <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs bg-accent">
  //                   {cartCount}
  //                 </Badge>
  //               )}
  //               Products
  //             </Link>
  //           </Button>

  //           {/* Cart */}
  //           <Button variant="ghost" size="default" className="relative" asChild>
  //             <Link to="/cart">
  //               <ShoppingBag className="h-5 w-5" />
  //               {cartCount > 0 && (
  //                 <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs bg-accent">
  //                   {cartCount}
  //                 </Badge>
  //               )}
  //               Cart
  //             </Link>
  //           </Button>

  //           {/* User Menu */}
  //           <DropdownMenu>
  //             <DropdownMenuTrigger asChild>
  //               <Button variant="ghost" size="default">
  //                 <User className="h-5 w-5" />
  //                 Profile
  //               </Button>
  //             </DropdownMenuTrigger>
  //             <DropdownMenuContent align="end">
  //               <DropdownMenuItem asChild>
  //                 <Link to="/profile">Profile</Link>
  //               </DropdownMenuItem>
  //               <DropdownMenuItem asChild>
  //                 <Link to="/profile">My Orders</Link>
  //               </DropdownMenuItem>
  //               <DropdownMenuSeparator />
  //               <DropdownMenuItem onClick={logout}>Logout</DropdownMenuItem>
  //             </DropdownMenuContent>
  //           </DropdownMenu>

  //           {/* Mobile Menu */}
  //           {/* <Button variant="ghost" size="icon" className="md:hidden">
  //             <Menu className="h-5 w-5" />
  //           </Button> */}

  //           {/* Theme Toggle */}
  //           <Button
  //             variant="ghost"
  //             size="default"
  //             onClick={toggleTheme}
  //             aria-label="Toggle theme"
  //           >
  //             {isDark ? (
  //               <Sun className="h-5 w-5" />
  //             ) : (
  //               <Moon className="h-5 w-5" />
  //             )}
  //           </Button>
  //         </div>
  //       </div>

  //       {/* Search Bar - Mobile */}
  //       <div className="pb-3 md:hidden">
  //         <div className="relative w-full flex gap-2">
  //           <Input
  //             type="search"
  //             placeholder="Search products"
  //             className="w-full"
  //             value={searchTerm}
  //             onChange={(e) => setSearchTerm(e.target.value)}
  //           />
  //           <Button variant="outline" onClick={() => { window.location.href=`/products?search=${encodeURIComponent(searchTerm)}`; setSearchTerm(''); }}>
  //             {/* <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" /> */}
  //             <Search/>
  //           </Button>
  //         </div>
  //       </div>
  //     </div>

  //     {/* Navigation */}
  //     {/* <nav className="border-t">
  //       <div className="container mx-auto px-4">
  //         <ul className="flex items-center gap-6 h-12 text-sm overflow-x-auto uppercase">
  //           <li>
  //             <Link to="/" className="hover:text-accent transition-colors">
  //               Home
  //             </Link>
  //           </li>
  //           <li>
  //             <Link to="/products" className="hover:text-accent transition-colors">
  //               Products
  //             </Link>
  //           </li>
  //           <li>
  //             <Link to="/shops" className="hover:text-accent transition-colors">
  //               Shops
  //             </Link>
  //           </li>
  //           <li>
  //             <Link to="/deals" className="hover:text-accent transition-colors">
  //               Deals
  //             </Link>
  //           </li>
  //           <li>
  //             <Link to="/deals" className="hover:text-accent transition-colors">
  //               Orders
  //             </Link>
  //           </li>
  //         </ul>
  //       </div>
  //     </nav> */}
  //   </header>
  // );

  const navLinks = [
    { label: "Shops", href: "/" },
    { label: "Products", href: "/products" },
  ];

  const [open, setOpen] = useState(false);

  return (
     <nav className="sticky top-0 z-50 bg-background/90 backdrop-blur-sm border-b border-border">
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between h-16">
        <div className="flex gap-3 items-center">
          <Link to="/" className="flex items-center gap-2">
            <ShoppingBag className="h-6 w-6 text-accent" />
            <span className="hidden md:block text-lg md:text-lg font-bold text-foreground uppercase">Mzinga Delivery</span>
          </Link>
        </div>

        <div className="hidden md:flex items-center gap-4">
          {navLinks.map((link) => (
            <Link key={link.label} to={link.href}>                
              <span className="text-xs text-muted-foreground hover:text-foreground transition-all duration-400 uppercase tracking-wider">{link.label}</span>
            </Link>
          ))}

          <button className="relative text-muted-foreground hover:text-foreground transition-all duration-400" aria-label="Toggle theme">
            <Link to="/cart">
              <ShoppingBag className="h-4 w-4" />
              {cartCount > 0 && (
                <Badge className="absolute -top-3 -right-3 h-5 w-5 flex items-center justify-center p-0 text-xs bg-accent">
                  {cartCount}
                </Badge>
              )}
            </Link>
          </button>

          <button onClick={toggleTheme} className="text-muted-foreground hover:text-foreground transition-all duration-400" aria-label="Toggle theme">
            {isDark ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="text-muted-foreground hover:text-foreground transition-all duration-400" aria-label="Profile">
                <User className="h-4 w-4" />
              </button>
              {/* <span className="cursor text-xs text-muted-foreground hover:text-foreground transition-all duration-400 uppercase tracking-wider">Profile</span> */}
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link to="/profile">Profile</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/profile">My Orders</Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={logout}>Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        
        <div className="md:hidden flex items-center gap-4">
          <button onClick={toggleTheme} className="text-muted-foreground hover:text-foreground hover:bg-secondary transition-all duration-400" aria-label="Toggle theme">
            {isDark ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <button onClick={toggleTheme} className="text-muted-foreground hover:text-foreground hover:bg-secondary transition-all duration-400" aria-label="Toggle theme">
            <Link to="/cart">
              <ShoppingBag className="h-5 w-5" />
              {cartCount > 0 && (
                <Badge className="absolute top-3 right-14 h-5 w-5 flex items-center justify-center p-0 text-xs bg-accent">
                  {cartCount}
                </Badge>
              )}
            </Link>
          </button>
          <button className="text-foreground" onClick={() => setOpen(!open)}>
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

        {open && (
          <div
            className="md:hidden bg-background border-b border-border"
          >
            <div className="px-6 py-4 flex flex-col gap-4">
              {navLinks.map((link) => (
                <a key={link.href} href={link.href} onClick={() => setOpen(false)} className="text-sm text-muted-foreground hover:text-foreground transition-all duration-400 uppercase tracking-wider">
                  {link.label}
                </a>
              ))}
              <Button
                  variant="ghost"
                  className="text-destructive w-full mt-3 border border-destructive"
                  onClick={logout}
                >
                  Logout
                </Button>
            </div>
          </div>
        )}
    </nav>
  )
};
