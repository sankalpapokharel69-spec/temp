export type UserRole = 'customer' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  color?: string;
  displayOrder: number;
}

export interface Template {
  id: string;
  title: string;
  slug: string;
  categoryId: string;
  price: number;
  originalPrice?: number;
  description: string;
  shortDesc: string;
  features: string[];
  pagesCount: number;
  demoUrl?: string;
  thumbnailUrl: string;
  gallery: string[];
  zipUrl?: string;
  isFeatured?: boolean;
  rating: number;
  reviewsCount?: number;
  salesCount: number;
  createdAt: string;
  updatedAt: string;
  techStack?: string[];
  livePreviewHtml?: string;
}

export type OrderStatus = 'Pending' | 'Paid' | 'Rejected' | 'Completed';
export type PaymentMethod = 'esewa' | 'khalti' | 'bank_qr';

export interface OrderItem {
  templateId: string;
  templateTitle: string;
  price: number;
  thumbnailUrl?: string;
  category?: string;
}

export interface Order {
  id: string;
  userId: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  totalAmount: number;
  platformCommission: number; // 10% owner royalty automatically allocated to sankalpapokharel69@gmail.com
  sellerAmount: number; // 90% net template earnings
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  currency?: string;
  convertedAmount?: number;
  conversionRate?: number;
  paymentProofUrl?: string;
  paymentRef?: string;
  notes?: string;
  adminNotes?: string;
  items: OrderItem[];
  createdAt: string;
  updatedAt: string;
}

export interface ContactMessage {
  id: string;
  senderName: string;
  senderEmail: string;
  subject: string;
  message: string;
  isTicket: boolean;
  status: 'unread' | 'read' | 'replied';
  createdAt: string;
}

export interface CartItem {
  template: Template;
  addedAt: number;
}

export interface FilterState {
  category: string;
  search: string;
  minPrice: number;
  maxPrice: number;
  sortBy: 'newest' | 'price_asc' | 'price_desc' | 'popular' | 'rating';
}

export type CurrencyCode = 'USD' | 'NPR' | 'INR' | 'EUR' | 'GBP' | 'AUD' | 'CAD' | 'AED' | 'JPY';

export interface CurrencyRate {
  code: CurrencyCode;
  name: string;
  symbol: string;
  flag: string;
  rate: number; // 1 USD = X in this currency
}

export interface PaymentSettings {
  ownerRoyaltyPercentage: number; // e.g. 10
  ownerEmail: string; // sankalpapokharel69@gmail.com
  exchangeRates: Record<CurrencyCode, number>;
  esewa: {
    id: string;
    accountName: string;
    qrUrl: string;
    instructions: string;
    enabled: boolean;
  };
  khalti: {
    id: string;
    accountName: string;
    qrUrl: string;
    instructions: string;
    enabled: boolean;
  };
  bank: {
    bankName: string;
    accountName: string;
    accountNumber: string;
    branch: string;
    swiftCode: string;
    qrUrl: string;
    instructions: string;
    enabled: boolean;
  };
}

