import { Shop, Product } from '@/types';

export const mockShops: Shop[] = [
  {
    id: 1,
    name: "Fresh Groceries Hub",
    ownerId: 2,
    category: ["Groceries", "Fresh Produce"],
    description: "Your neighborhood grocery store with fresh, organic produce",
    logo: "/placeholder.svg",
    banner: "/placeholder.svg",
    rating: 4.5,
    reviewCount: 120,
    location: {
      address: "123 Market Street, Nairobi",
      lat: -1.2921,
      lng: 36.8219
    },
    openingHours: {
      monday: { open: "08:00", close: "22:00" },
      tuesday: { open: "08:00", close: "22:00" },
      wednesday: { open: "08:00", close: "22:00" },
      thursday: { open: "08:00", close: "22:00" },
      friday: { open: "08:00", close: "23:00" },
      saturday: { open: "08:00", close: "23:00" },
      sunday: { open: "09:00", close: "21:00" }
    },
    deliveryFees: {
      "0-2km": 2,
      "2-5km": 3,
      "5-10km": 5,
      "10km+": 8
    },
    status: "active",
    featured: true,
    createdAt: "2024-01-10"
  },
  {
    id: 2,
    name: "TechWorld Electronics",
    ownerId: 3,
    category: ["Electronics", "Gadgets"],
    description: "Latest electronics and gadgets at competitive prices",
    logo: "/placeholder.svg",
    banner: "/placeholder.svg",
    rating: 4.7,
    reviewCount: 350,
    location: {
      address: "456 Tech Avenue, Nairobi",
      lat: -1.2850,
      lng: 36.8170
    },
    openingHours: {
      monday: { open: "09:00", close: "21:00" },
      tuesday: { open: "09:00", close: "21:00" },
      wednesday: { open: "09:00", close: "21:00" },
      thursday: { open: "09:00", close: "21:00" },
      friday: { open: "09:00", close: "22:00" },
      saturday: { open: "09:00", close: "22:00" },
      sunday: { open: "10:00", close: "20:00" }
    },
    deliveryFees: {
      "0-2km": 3,
      "2-5km": 5,
      "5-10km": 7,
      "10km+": 10
    },
    status: "active",
    featured: true,
    createdAt: "2024-01-05"
  },
  {
    id: 3,
    name: "Fashion Forward",
    ownerId: 4,
    category: ["Fashion", "Clothing"],
    description: "Trendy fashion for everyone",
    logo: "/placeholder.svg",
    banner: "/placeholder.svg",
    rating: 4.3,
    reviewCount: 200,
    location: {
      address: "789 Style Street, Nairobi",
      lat: -1.2880,
      lng: 36.8250
    },
    openingHours: {
      monday: { open: "10:00", close: "20:00" },
      tuesday: { open: "10:00", close: "20:00" },
      wednesday: { open: "10:00", close: "20:00" },
      thursday: { open: "10:00", close: "20:00" },
      friday: { open: "10:00", close: "21:00" },
      saturday: { open: "10:00", close: "21:00" },
      sunday: { open: "11:00", close: "19:00" }
    },
    deliveryFees: {
      "0-2km": 2,
      "2-5km": 4,
      "5-10km": 6,
      "10km+": 9
    },
    status: "active",
    featured: false,
    createdAt: "2024-02-01"
  },
  {
    id: 4,
    name: "Quick Bites",
    ownerId: 5,
    category: ["Fast Food", "Restaurant"],
    description: "Delicious fast food delivered hot and fresh",
    logo: "/placeholder.svg",
    banner: "/placeholder.svg",
    rating: 4.6,
    reviewCount: 500,
    location: {
      address: "321 Food Court, Nairobi",
      lat: -1.2900,
      lng: 36.8200
    },
    openingHours: {
      monday: { open: "11:00", close: "23:00" },
      tuesday: { open: "11:00", close: "23:00" },
      wednesday: { open: "11:00", close: "23:00" },
      thursday: { open: "11:00", close: "23:00" },
      friday: { open: "11:00", close: "00:00" },
      saturday: { open: "11:00", close: "00:00" },
      sunday: { open: "11:00", close: "23:00" }
    },
    deliveryFees: {
      "0-2km": 2,
      "2-5km": 3,
      "5-10km": 5,
      "10km+": 7
    },
    status: "active",
    featured: true,
    createdAt: "2024-01-20"
  },
  {
    id: 5,
    name: "Beauty Bliss",
    ownerId: 6,
    category: ["Beauty", "Personal Care"],
    description: "Premium beauty and personal care products",
    logo: "/placeholder.svg",
    banner: "/placeholder.svg",
    rating: 4.8,
    reviewCount: 280,
    location: {
      address: "555 Beauty Lane, Nairobi",
      lat: -1.2860,
      lng: 36.8230
    },
    openingHours: {
      monday: { open: "09:00", close: "20:00" },
      tuesday: { open: "09:00", close: "20:00" },
      wednesday: { open: "09:00", close: "20:00" },
      thursday: { open: "09:00", close: "20:00" },
      friday: { open: "09:00", close: "21:00" },
      saturday: { open: "09:00", close: "21:00" },
      sunday: { open: "10:00", close: "19:00" }
    },
    deliveryFees: {
      "0-2km": 2,
      "2-5km": 3,
      "5-10km": 5,
      "10km+": 8
    },
    status: "active",
    featured: true,
    createdAt: "2024-01-15"
  },
  {
    id: 6,
    name: "Home & Garden Paradise",
    ownerId: 7,
    category: ["Home & Garden", "Furniture"],
    description: "Everything for your home and garden",
    logo: "/placeholder.svg",
    banner: "/placeholder.svg",
    rating: 4.4,
    reviewCount: 150,
    location: {
      address: "888 Home Street, Nairobi",
      lat: -1.2940,
      lng: 36.8180
    },
    openingHours: {
      monday: { open: "08:00", close: "19:00" },
      tuesday: { open: "08:00", close: "19:00" },
      wednesday: { open: "08:00", close: "19:00" },
      thursday: { open: "08:00", close: "19:00" },
      friday: { open: "08:00", close: "20:00" },
      saturday: { open: "08:00", close: "20:00" },
      sunday: { open: "09:00", close: "18:00" }
    },
    deliveryFees: {
      "0-2km": 5,
      "2-5km": 8,
      "5-10km": 12,
      "10km+": 15
    },
    status: "active",
    featured: false,
    createdAt: "2024-02-10"
  }
];

export const mockProducts: Product[] = [
  {
    id: 1,
    shopId: 1,
    name: "Fresh Organic Apples",
    category: "Fresh Produce",
    description: "Crisp, organic apples from local farms. Perfect for snacking or baking.",
    price: 5.99,
    compareAtPrice: 7.99,
    images: ["/placeholder.svg"],
    stock: 100,
    rating: 4.8,
    reviewCount: 45,
    featured: true,
    specifications: {
      weight: "1 kg",
      origin: "Kenya"
    },
    status: "active",
    createdAt: "2024-02-01"
  },
  {
    id: 2,
    shopId: 1,
    name: "Organic Bananas",
    category: "Fresh Produce",
    description: "Sweet, ripe organic bananas. High in potassium and perfect for smoothies.",
    price: 3.49,
    images: ["/placeholder.svg"],
    stock: 150,
    rating: 4.6,
    reviewCount: 32,
    featured: false,
    specifications: {
      weight: "1 kg",
      origin: "Kenya"
    },
    status: "active",
    createdAt: "2024-02-05"
  },
  {
    id: 3,
    shopId: 2,
    name: "Wireless Bluetooth Headphones",
    category: "Electronics",
    description: "Premium noise-cancelling wireless headphones with 30-hour battery life.",
    price: 129.99,
    compareAtPrice: 179.99,
    images: ["/placeholder.svg"],
    stock: 50,
    rating: 4.7,
    reviewCount: 180,
    featured: true,
    specifications: {
      battery: "30 hours",
      connectivity: "Bluetooth 5.0",
      color: "Black"
    },
    status: "active",
    createdAt: "2024-02-10"
  },
  {
    id: 4,
    shopId: 2,
    name: "Smart Watch Pro",
    category: "Electronics",
    description: "Feature-packed smartwatch with health tracking and notifications.",
    price: 249.99,
    compareAtPrice: 299.99,
    images: ["/placeholder.svg"],
    stock: 30,
    rating: 4.9,
    reviewCount: 250,
    featured: true,
    specifications: {
      display: "1.4 inch AMOLED",
      battery: "7 days",
      waterproof: "Yes"
    },
    status: "active",
    createdAt: "2024-02-12"
  },
  {
    id: 5,
    shopId: 3,
    name: "Premium Cotton T-Shirt",
    category: "Fashion",
    description: "Soft, comfortable cotton t-shirt in multiple colors. Perfect for everyday wear.",
    price: 24.99,
    images: ["/placeholder.svg"],
    stock: 200,
    rating: 4.5,
    reviewCount: 95,
    featured: false,
    specifications: {
      material: "100% Cotton",
      sizes: "S, M, L, XL",
      colors: "5 colors available"
    },
    status: "active",
    createdAt: "2024-02-15"
  },
  {
    id: 6,
    shopId: 3,
    name: "Designer Jeans",
    category: "Fashion",
    description: "Stylish denim jeans with perfect fit and premium quality.",
    price: 79.99,
    compareAtPrice: 99.99,
    images: ["/placeholder.svg"],
    stock: 80,
    rating: 4.7,
    reviewCount: 120,
    featured: true,
    specifications: {
      material: "Denim",
      fit: "Slim fit",
      sizes: "28-38"
    },
    status: "active",
    createdAt: "2024-02-18"
  },
  {
    id: 7,
    shopId: 4,
    name: "Classic Burger Meal",
    category: "Fast Food",
    description: "Juicy beef burger with fries and a drink. A classic favorite!",
    price: 12.99,
    images: ["/placeholder.svg"],
    stock: 999,
    rating: 4.6,
    reviewCount: 340,
    featured: true,
    preparationTime: 15,
    specifications: {
      includes: "Burger, Fries, Drink",
      calories: "850 kcal"
    },
    status: "active",
    createdAt: "2024-02-20"
  },
  {
    id: 8,
    shopId: 4,
    name: "Chicken Wings Combo",
    category: "Fast Food",
    description: "Crispy chicken wings with your choice of sauce. Includes fries and dip.",
    price: 14.99,
    images: ["/placeholder.svg"],
    stock: 999,
    rating: 4.8,
    reviewCount: 280,
    featured: true,
    preparationTime: 20,
    specifications: {
      pieces: "10 wings",
      sauces: "BBQ, Hot, Honey Mustard"
    },
    status: "active",
    createdAt: "2024-02-22"
  },
  {
    id: 9,
    shopId: 5,
    name: "Luxury Face Cream",
    category: "Beauty",
    description: "Anti-aging face cream with natural ingredients. Suitable for all skin types.",
    price: 49.99,
    compareAtPrice: 69.99,
    images: ["/placeholder.svg"],
    stock: 60,
    rating: 4.9,
    reviewCount: 150,
    featured: true,
    specifications: {
      volume: "50ml",
      type: "Anti-aging",
      ingredients: "Natural, Cruelty-free"
    },
    status: "active",
    createdAt: "2024-02-25"
  },
  {
    id: 10,
    shopId: 5,
    name: "Hydrating Hair Mask",
    category: "Beauty",
    description: "Deep conditioning hair mask for dry and damaged hair.",
    price: 29.99,
    images: ["/placeholder.svg"],
    stock: 75,
    rating: 4.7,
    reviewCount: 95,
    featured: false,
    specifications: {
      volume: "200ml",
      hairType: "All types",
      treatment: "Deep conditioning"
    },
    status: "active",
    createdAt: "2024-02-28"
  },
  {
    id: 11,
    shopId: 6,
    name: "Ceramic Plant Pot",
    category: "Home & Garden",
    description: "Elegant ceramic pot perfect for indoor plants. Modern minimalist design.",
    price: 34.99,
    images: ["/placeholder.svg"],
    stock: 45,
    rating: 4.5,
    reviewCount: 60,
    featured: false,
    specifications: {
      material: "Ceramic",
      size: "Medium",
      drainage: "Yes"
    },
    status: "active",
    createdAt: "2024-03-01"
  },
  {
    id: 12,
    shopId: 6,
    name: "Garden Tool Set",
    category: "Home & Garden",
    description: "Complete 5-piece gardening tool set with ergonomic handles.",
    price: 44.99,
    compareAtPrice: 59.99,
    images: ["/placeholder.svg"],
    stock: 35,
    rating: 4.6,
    reviewCount: 78,
    featured: true,
    specifications: {
      pieces: "5 tools",
      material: "Stainless steel",
      handle: "Ergonomic grip"
    },
    status: "active",
    createdAt: "2024-03-05"
  }
];
