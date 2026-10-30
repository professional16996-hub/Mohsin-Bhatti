export interface ProductColor {
  name: string;
  hex: string;
}

export type ProductCategory = 
  | "Men's Shalwar Kameez"
  | "Women's Shalwar Kameez"
  | "Men's Waistcoats"
  | "Women's Unstitched Suits"
  | "New Arrivals"
  | "Best Sellers";

export interface Product {
  id: string;
  name: string;
  category: ProductCategory | string;
  price: number;
  originalPrice?: number;
  image: string;
  gallery?: string[];
  description: string;
  fabric: string;
  sizes: string[];
  colors: ProductColor[];
  isNewArrival?: boolean;
  isBestSeller?: boolean;
  inStock: boolean;
  stockQuantity: number;
  rating?: number;
  reviewsCount?: number;
}

export interface CartItem {
  id: string; // unique item id: productId-size-color
  product: Product;
  selectedSize: string;
  selectedColor: ProductColor;
  quantity: number;
}

export type OrderStatus = 'Pending' | 'Confirmed' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';

export interface OrderItem {
  productId: string;
  productName: string;
  price: number;
  size: string;
  color: string;
  quantity: number;
  image: string;
}

export interface Order {
  id: string;
  customerName: string;
  phone: string;
  email?: string;
  address: string;
  city: string;
  notes?: string;
  items: OrderItem[];
  subtotal: number;
  shippingFee: number;
  total: number;
  paymentMethod: 'Cash on Delivery' | 'Bank Transfer' | 'WhatsApp Checkout';
  status: OrderStatus;
  createdAt: string;
}

export interface Inquiry {
  id: string;
  name: string;
  email: string;
  phone: string;
  subject?: string;
  message: string;
  createdAt: string;
  status: 'New' | 'Replied';
}

export interface SiteContent {
  brandName: string;
  tagline: string;
  heroHeadline: string;
  heroSubheadline: string;
  whatsappNumber: string;
  whatsappFormatted: string;
  address: string;
  googleMapsUrl: string;
  storeHours: string;
  aboutText: string;
  shippingPolicy: string;
}

export interface AdminUser {
  id: string;
  username: string;
  email: string;
  role: 'superadmin' | 'admin';
}
