export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  shortDesc?: string;
  basePrice: number;
  comparePrice?: number;
  sku: string;
  isActive: boolean;
  isFeatured: boolean;
  tags: string[];
  totalStock: number;
  avgRating: number;
  reviewCount: number;
  images: ProductImage[];
  variants: ProductVariant[];
  categories: ProductCategory[];
  reviews: Review[];
  relatedProducts?: RelatedProduct[];
}

export interface ProductImage {
  id: string;
  url: string;
  altText?: string;
  isPrimary: boolean;
  sortOrder: number;
}

export interface ProductVariant {
  id: string;
  name: string;
  size?: string;
  color?: string;
  colorHex?: string;
  price?: number;
  stock: number;
  isActive: boolean;
}

export interface ProductCategory {
  category: {
    id: string;
    name: string;
    slug: string;
  };
}

export interface RelatedProduct {
  related: Product;
}

export interface Review {
  id: string;
  rating: number;
  title?: string;
  body?: string;
  images: string[];
  createdAt: string;
  user: {
    id: string;
    firstName?: string;
    lastName?: string;
    avatarUrl?: string;
  };
}

export interface CartItem {
  id: string;
  product: Product;
  variant?: ProductVariant;
  quantity: number;
  savedForLater: boolean;
}

export interface Cart {
  id: string;
  items: CartItem[];
}

export interface Address {
  id: string;
  label?: string;
  firstName: string;
  lastName: string;
  phone?: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  isDefault: boolean;
}

export interface Order {
  id: string;
  orderNumber: string;
  status: string;
  paymentStatus: string;
  subtotal: number;
  shippingCost: number;
  taxAmount: number;
  discountAmount: number;
  total: number;
  items: OrderItem[];
  createdAt: string;
  shippingAddress?: Address;
}

export interface OrderItem {
  id: string;
  name: string;
  sku: string;
  price: number;
  quantity: number;
  total: number;
  imageUrl?: string;
  product: Product;
}

export interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  avatarUrl?: string;
  role: string;
  isEmailVerified: boolean;
}
