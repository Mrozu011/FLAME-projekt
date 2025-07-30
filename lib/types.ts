export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  images?: string[];
  category: string;
  subcategory?: string;
  isNew?: boolean;
  isOnSale?: boolean;
  discount?: number;
  rating?: number;
  reviewCount?: number;
  colors?: string[];
  sizes?: string[];
  stockStatus?: 'in-stock' | 'low-stock' | 'out-of-stock';
  description?: string;
  material?: string;
  tags?: string[];
  has3DModel?: boolean;
  popularity?: number;
  sku?: string;
  size?: string;
  color?: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'user' | 'admin' | 'moderator';
  preferences?: UserPreferences;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserPreferences {
  language: string;
  currency: string;
  theme: 'light' | 'dark';
  notifications: NotificationSettings;
}

export interface NotificationSettings {
  email: boolean;
  push: boolean;
  sms: boolean;
  marketing: boolean;
}

export interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  status: OrderStatus;
  total: number;
  subtotal: number;
  tax: number;
  shipping: number;
  discount: number;
  createdAt: Date;
  updatedAt: Date;
  shippingAddress: ShippingAddress;
  billingAddress: BillingAddress;
  paymentMethod: PaymentMethod;
}

export interface OrderItem {
  productId: string;
  quantity: number;
  price: number;
  variant?: {
    size?: string;
    color?: string;
  };
}

export type OrderStatus = 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded';

export interface ShippingAddress {
  name: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  phone?: string;
}

export interface BillingAddress {
  name: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface PaymentMethod {
  type: 'card' | 'paypal' | 'bank_transfer';
  details: any;
}

export interface InvoiceData {
  id: string;
  orderId: string;
  userId: string;
  items: OrderItem[];
  summary: {
    subtotal: number;
    tax: number;
    taxRate: number;
    shipping: number;
    discount: number;
    total: number;
  };
  billingAddress: BillingAddress;
  shippingAddress: ShippingAddress;
  createdAt: Date;
  dueDate: Date;
  status: 'pending' | 'paid' | 'overdue' | 'cancelled';
}

export interface ShippingPackage {
  weight: number;
  dimensions: {
    length: number;
    width: number;
    height: number;
  };
  value: number;
}

export interface ShippingRate {
  carrier: string;
  service: string;
  price: number;
  deliveryTime: string;
  trackingUrl?: string;
}

export interface EcommerceEvent {
  event_name: string;
  event_category: string;
  event_label?: string;
  value?: number;
  currency?: string;
  items?: any[];
  [key: string]: any;
}

export interface CategoryData {
  name: string;
  subcategories: Record<string, string>;
  description?: string;
  image?: string;
}

export interface EmailOptions {
  to: string | string[];
  from: { email: string; name: string };
  subject: string;
  html?: string;
  text?: string;
  cc?: string | string[];
  bcc?: string | string[];
  attachments?: Array<{
    filename: string;
    content: string;
    type: string;
  }>;
}

export interface PayPalConfig {
  clientId: string;
  clientSecret: string;
  environment: 'sandbox' | 'live';
}

export interface PaymentConfig {
  paypal: PayPalConfig;
  stripe?: {
    publishableKey: string;
    secretKey: string;
  };
}

export interface PerformanceMetrics {
  fcp: number;
  lcp: number;
  fid: number;
  cls: number;
  tti: number;
  tbt: number;
}

export interface PerformanceEntry {
  name: string;
  entryType: string;
  startTime: number;
  duration: number;
  hadRecentInput?: boolean;
  value?: number;
  processingStart?: number;
}

export interface PerformanceNavigationTiming extends PerformanceEntry {
  navigationStart: number;
  domContentLoadedEventEnd: number;
}

export interface SEOData {
  title: string;
  description: string;
  keywords: string[];
  canonical?: string;
  ogImage?: string;
  ogTitle?: string;
  ogDescription?: string;
}

export interface StructuredData {
  '@context': string;
  '@type': string;
  name: string;
  description?: string;
  image: string[];
  brand: {
    '@type': string;
    name: string;
  };
  category: string;
  sku: string;
  offers: {
    '@type': string;
    url: string;
    priceCurrency: string;
    price: string;
    availability: string;
    seller: {
      '@type': string;
      name: string;
    };
    priceValidUntil?: string;
  };
  aggregateRating?: {
    '@type': string;
    ratingValue: number;
    reviewCount: number;
  };
  material?: string;
  color?: string[];
  size?: string[];
  additionalProperty?: Array<{
    '@type': string;
    name: string;
    value: string;
  }>;
}

// Global type declarations
declare global {
  interface Window {
    gtag: (...args: any[]) => void;
    gc?: () => void;
  }
}

export {}; 