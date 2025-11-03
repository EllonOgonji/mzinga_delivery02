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
  description: string;
  logo: string;
  banner: string;
  rating: number;
  reviewCount: number;
  location: {
    address: string;
    lat: number;
    lng: number;
  };
  openingHours: {
    [key: string]: { open: string; close: string };
  };
  deliveryFees: {
    [key: string]: number;
  };
  status: 'active' | 'closed' | 'suspended';
  featured: boolean;
  createdAt: string;
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
  rating: number;
  reviewCount: number;
  featured: boolean;
  preparationTime?: number;
  specifications: Record<string, string>;
  status: 'active' | 'inactive';
  createdAt: string;
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
  deliveryMethod: string;
  paymentMethod: string;
  subtotal: number;
  deliveryFee: number;
  discount: number;
  total: number;
  status: 'pending' | 'confirmed' | 'preparing' | 'out_for_delivery' | 'delivered' | 'cancelled';
  createdAt: string;
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
