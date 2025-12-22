import { Shop, Product, User } from '@/types';

export const mockCategories: string[] = [
  "Electronics",
  "Fashion",
  "Home & Garden",
  "Beauty",
  "Sports & Outdoors",
  "Toys & Hobbies",
  "Automotive",
  "Books & Media",
  "Health & Wellness",
  "Alcohol & Beverages",
  "Groceries"
];

export const mockShops: Shop[] = [
  {
    id: 1,
    name: "Mama Yao Wines and Spirits",
    ownerId: 2,
    category: ["Alcohol & Beverages"],
    logo: "/placeholder.svg",
    banner: "/placeholder.svg",
    longitude: 36.8219,
    latitude: -1.2921,
    status: "open",
    createdAt: "2024-01-10"
  },
  {
    id: 2,
    name: "Clutch Lounge",
    ownerId: 3,
    category: ["Alcohol & Beverages"],
    logo: "/placeholder.svg",
    banner: "/placeholder.svg",    
    latitude: -1.2850,
    longitude: 36.8170,
    status: "open",
    createdAt: "2024-01-05"
  },
  {
    id: 3,
    name: "Club Tingiza",
    ownerId: 4,
    category: ["Alcohol & Beverages"],
    logo: "/placeholder.svg",
    banner: "/placeholder.svg",
    longitude: 36.8148,
    latitude: -1.3061,
    status: "open",
    createdAt: "2024-02-01"
  }
];

export const mockUsers: User[] = [
  {
    id: 1,
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "+254712345678",
    password: "hashed_password",
    dateOfBirth: "1990-05-15",
    role: "customer",
    addresses: [
      {
        id: 1,
        label: "Home",
        street: "123 Main Street",
        city: "Nairobi",
        postalCode: "00100",
        country: "Kenya",
        isDefault: true,
      },
    ],
    wishlist: [1, 3, 5],
    cart: [],
    orders: [1, 2, 3],
    rewardsTokens: 150,
    referralCode: "JOHN2024",
    referredBy: null,
    createdAt: "2024-01-10T10:00:00Z",
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "jane.smith@example.com",
    phone: "+254723456789",
    password: "hashed_password",
    dateOfBirth: "1988-08-22",
    role: "vendor",
    addresses: [
      {
        id: 2,
        label: "Shop Location",
        street: "456 Business Ave",
        city: "Nairobi",
        postalCode: "00200",
        country: "Kenya",
        isDefault: true,
      },
    ],
    wishlist: [],
    cart: [],
    orders: [],
    rewardsTokens: 500,
    referralCode: "JANE2024",
    referredBy: null,
    createdAt: "2024-01-05T09:00:00Z",
  },
  {
    id: 3,
    name: "Alice Johnson",
    email: "alice.johnson@example.com",
    phone: "+254734567890",
    password: "hashed_password",
    dateOfBirth: "1992-03-10",
    role: "customer",
    addresses: [
      {
        id: 3,
        label: "Home",
        street: "789 Oak Lane",
        city: "Mombasa",
        postalCode: "80100",
        country: "Kenya",
        isDefault: true,
      },
      {
        id: 4,
        label: "Office",
        street: "321 Work Plaza",
        city: "Mombasa",
        postalCode: "80200",
        country: "Kenya",
        isDefault: false,
      },
    ],
    wishlist: [2, 4, 6, 8],
    cart: [],
    orders: [4, 5],
    rewardsTokens: 75,
    referralCode: "ALICE2024",
    referredBy: "JOHN2024",
    createdAt: "2024-01-15T11:30:00Z",
  },
  {
    id: 4,
    name: "Bob Wilson",
    email: "bob.wilson@example.com",
    phone: "+254745678901",
    password: "hashed_password",
    dateOfBirth: "1985-11-30",
    role: "customer",
    addresses: [
      {
        id: 5,
        label: "Home",
        street: "555 Pine Street",
        city: "Kisumu",
        postalCode: "40100",
        country: "Kenya",
        isDefault: true,
      },
    ],
    wishlist: [1, 7, 9],
    cart: [],
    orders: [6],
    rewardsTokens: 200,
    referralCode: "BOB2024",
    referredBy: "JANE2024",
    createdAt: "2024-02-01T14:00:00Z",
  },
  {
    id: 5,
    name: "Charlie Brown",
    email: "charlie.brown@example.com",
    phone: "+254756789012",
    password: "hashed_password",
    dateOfBirth: "1995-07-18",
    role: "vendor",
    addresses: [
      {
        id: 6,
        label: "Business",
        street: "888 Commerce Street",
        city: "Nairobi",
        postalCode: "00300",
        country: "Kenya",
        isDefault: true,
      },
    ],
    wishlist: [],
    cart: [],
    orders: [],
    rewardsTokens: 300,
    referralCode: "CHARLIE2024",
    referredBy: null,
    createdAt: "2024-02-10T08:00:00Z",
  },
];

export const mockProducts: Product[] = [
  {
    id: 1,
    shopId: 1,
    name: "Kenyan Cane Original",
    category: "Alcohol & Beverages",
    description: "A smooth, locally distilled spirit with a warm caramel finish. Perfect neat or in classic cocktails.",
    price: 24.99,
    compareAtPrice: 29.99,
    images: ["/placeholder.svg"],
    stock: 120,
    rating: [4.4],
    specifications: {
      volume: "750ml",
      abv: "40%",
      origin: "Kenya"
    },
    status: "active",
    createdAt: "2024-01-10"
  },
  {
    id: 2,
    shopId: 1,
    name: "Kenyan Cane Pineapple",
    category: "Alcohol & Beverages",
    description: "Tropical pineapple-infused variant of Kenyan Cane — fruity and aromatic, great for mixed drinks and summer sips.",
    price: 26.5,
    images: ["/placeholder.svg"],
    stock: 80,
    rating: [4.4],
    specifications: {
      volume: "750ml",
      abv: "35%",
      flavor: "Pineapple"
    },
    status: "active",
    createdAt: "2024-01-12"
  },
  {
    id: 3,
    shopId: 2,
    name: "Tusker Lager (6-pack)",
    category: "Alcohol & Beverages",
    description: "Classic crisp lager with a balanced malt profile. Ready-to-drink 6-pack for gatherings.",
    price: 9.99,
    images: ["/placeholder.svg"],
    stock: 300,
    rating: [4.2],
    specifications: {
      pack: "6 x 330ml",
      abv: "4.2%",
      type: "Lager"
    },
    status: "active",
    createdAt: "2024-01-05"
  },
  {
    id: 4,
    shopId: 2,
    name: "Tusker Cider",
    category: "Alcohol & Beverages",
    description: "Refreshing apple cider with a light, fruity finish. Low on bitterness and highly drinkable.",
    price: 11.49,
    images: ["/placeholder.svg"],
    stock: 200,
    rating: [4.3],
    specifications: {
      volume: "500ml",
      abv: "4.5%",
      flavor: "Apple"
    },
    status: "active",
    createdAt: "2024-02-10"
  },
  {
    id: 5,
    shopId: 3,
    name: "Johnnie Walker Red Label (Vial)",
    category: "Alcohol & Beverages",
    description: "Blended Scotch whisky known for its bold, vibrant character. A convenient small-format vial for sampling.",
    price: 7.99,
    images: ["/placeholder.svg"],
    stock: 150,
    rating: [4.1],
    specifications: {
      volume: "50ml",
      abv: "40%",
      brand: "Red Label"
    },
    status: "active",
    createdAt: "2024-02-15"
  },
  {
    id: 6,
    shopId: 3,
    name: "Johnnie Walker Black Label (750ml)",
    category: "Alcohol & Beverages",
    description: "Aged blended Scotch whisky with depth and character — smoky, fruity, and rich.",
    price: 49.99,
    compareAtPrice: 59.99,
    images: ["/placeholder.svg"],
    stock: 60,
    rating: [4.7],
    specifications: {
      volume: "750ml",
      abv: "40%",
      brand: "Black Label"
    },
    status: "active",
    createdAt: "2024-02-18"
  },
  {
    id: 7,
    shopId: 4,
    name: "Viceroy Whiskey",
    category: "Alcohol & Beverages",
    description: "Smooth blended whiskey with honeyed notes — great on the rocks or in classic cocktails.",
    price: 21.99,
    images: ["/placeholder.svg"],
    stock: 90,
    rating: [4.0],
    specifications: {
      volume: "750ml",
      abv: "37%",
      origin: "Imported"
    },
    status: "active",
    createdAt: "2024-02-20"
  },
  {
    id: 8,
    shopId: 4,
    name: "Kingfisher Premium Lager (4-pack)",
    category: "Alcohol & Beverages",
    description: "Light, crisp lager with a subtle hop aroma. Popular choice for everyday drinking.",
    price: 7.49,
    images: ["/placeholder.svg"],
    stock: 220,
    rating: [4.2],
    specifications: {
      pack: "4 x 330ml",
      abv: "4.8%",
      type: "Lager"
    },
    status: "active",
    createdAt: "2024-02-22"
  },
  {
    id: 9,
    shopId: 5,
    name: "Jaghemister Herbal Liqueur",
    category: "Alcohol & Beverages",
    description: "Herbal digestif with complex botanicals and a warming finish. Best served chilled or as a shot.",
    price: 34.99,
    images: ["/placeholder.svg"],
    stock: 40,
    rating: [4.5],
    specifications: {
      volume: "700ml",
      abv: "35%",
      type: "Herbal Liqueur"
    },
    status: "active",
    createdAt: "2024-02-25"
  }
];
