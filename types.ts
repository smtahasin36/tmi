
export interface User {
  id: string;
  name: string;
  phone: string;
  email: string;
  // Added password property to fix the missing property error in Login.tsx
  password?: string;
  balance: number;
  totalSpent: number;
  weeklySpent: number;
  role: 'user' | 'admin';
}

export interface Game {
  id: string;
  name: string;
  type: 'uid' | 'voucher';
  description: string;
  image: string;
  isPopular?: boolean;
}

export interface Product {
  id: string;
  gameId: string;
  name: string;
  price: number;
  description?: string;
}

export interface Order {
  id: string;
  userId: string;
  productId: string;
  gameId: string;
  quantity: number;
  totalPrice: number;
  status: 'pending' | 'completed' | 'cancelled';
  paymentMethod: string;
  createdAt: string;
  playerTag?: string;
  voucherCode?: string;
}

export interface SiteSettings {
  siteName: string;
  siteTitle: string;
  siteDescription: string;
  currencySymbol: string;
  fabLink: string;
  youtubeLink: string;
  marqueeStatus: boolean;
  marqueeText: string;
}

export interface Slider {
  id: string;
  image: string;
  link: string;
}

export interface PaymentMethod {
  id: string;
  name: string;
  logo: string;
  qrImage: string;
  number: string;
  description: string;
}

export interface RedeemCode {
  id: string;
  gameId: string;
  productId: string;
  code: string;
  status: 'active' | 'expired';
}
