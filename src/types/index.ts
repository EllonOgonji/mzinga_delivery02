export interface ShopFilters {
  idMultiple?: number[];
  id?: number;
  category?: string[];
  rating?: number;
  isOpenNow?: boolean;
  // featured?: boolean;
  searchQuery?: string;
}

export interface ProductFilters {
  idMultiple?: number[];
  id?: number;
  shopId?: number;
  shopIdMultiple?: number[];
  shopOpen?: boolean;
  category?: string;
  categoryMultiple?: string[];
  priceRange?: { min: number; max: number };
  rating?: number;
  inStock?: boolean;
  featured?: boolean;
  searchQuery?: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  password: string;
  dateOfBirth: string;
  role: 'customer' | 'vendor' | 'admin';
  addresses: Address[];
  wishlist: number[];
  cart: CartItem[];
  orders: number[];
  rewardsTokens: number;
  referralCode: string;
  referredBy: string | null;
  createdAt: string;
}

export interface Address {
  id: number;
  label: string;
  street: string;
  city: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
}

export interface Shop {
  id: number;
  name: string;
  ownerId: number;
  category: string[];
  logo: string;
  banner: string;
  latitude: number;
  longitude: number;
  status: 'open' | 'suspended' | 'closed';
  createdAt: string;
  updatedAt?: string;
  // 
  verified?: boolean;
}

export interface Product {
  id: number;
  shopId: number;
  name: string;
  category: string;
  description: string;
  price: number;
  compareAtPrice?: number; 
  images: string[];
  stock: number;
  rating: number[];
  specifications: Record<string, string>;
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt?: string;
}

export interface CartItem {
  productId: number;
  shopId: number;
  quantity: number;
  price: number;
}

export interface Order {
  id: number;
  orderNumber: string;
  userId: number;
  items: CartItem[];
  deliveryAddress: Address;
  // deliveryMethod: string;
  // paymentMethod: string;
  subtotal: number;
  deliveryFee: number;
  discount: number;
  total: number;
  status: 'pending' | 'confirmed' | 'preparing' | 'out_for_delivery' | 'delivered' | 'cancelled';
  createdAt: string;
}

export interface OrderItem {
  id: number;
  productId: number;
  quantity: number;
  unitPrice: number;
  status: 'pending' | 'confirmed' | 'preparing' | 'out_for_delivery' | 'delivered' | 'cancelled';
  
}

export interface Review {
  id: number;
  userId: number;
  productId?: number;
  shopId?: number;
  type: 'product' | 'shop';
  rating: number;
  title: string;
  comment: string;
  images: string[];
  helpful: number;
  response?: string;
  createdAt: string;
}
