
export enum ItemType {
  FIXED_PRICE = 'FIXED_PRICE',
  AUCTION = 'AUCTION'
}

export enum OrderStatus {
  AVAILABLE = 'AVAILABLE',
  PENDING_SHIPMENT = 'PENDING_SHIPMENT',
  SHIPPED = 'SHIPPED',
  DELIVERED = 'DELIVERED',
  COMPLETED = 'COMPLETED',
  RETURNED = 'RETURNED'
}

export interface Bid {
  id: string;
  userId: string;
  userName: string;
  amount: number;
  timestamp: string;
}

export interface PaymentMethod {
  id: string;
  type: 'BANK' | 'CARD' | 'WALLET';
  providerName: string; // Vietcombank, Visa, Momo
  accountNumber: string; // Will be masked in UI
  holderName: string;
  isDefault: boolean;
}

export interface SocialAccount {
  provider: 'facebook' | 'google' | 'instagram' | 'twitter';
  connected: boolean;
  username?: string;
}

export interface User {
  id: string;
  fullName: string;
  email: string;
  phone?: string;
  avatar: string;
  address?: string;
  joinDate: string;
  balance: number; // For wallet
  paymentMethods: PaymentMethod[];
  // Social & Referral
  socialAccounts?: SocialAccount[];
  referralCode?: string;
  referredBy?: string;
  friendCount?: number;
  role?: 'USER' | 'ADMIN'; // Added Role
}

// New Interface for Admin Reporting
export interface Transaction {
  id: string;
  userId: string;
  productId: string;
  amount: number;
  type: 'PURCHASE' | 'FEE' | 'DEPOSIT';
  timestamp: string;
  status: 'COMPLETED' | 'PENDING' | 'FAILED';
}

// --- Virtual Avatar Types ---
export interface AvatarConfig {
  id: string;
  name: string;
  role: 'FASHION_MODEL' | 'SALES_EXPERT' | 'SINGER' | 'FRIENDLY_HOST';
  gender: 'FEMALE' | 'MALE';
  voiceTone: string;
  image: string; // Base visualization
  videoLoop?: string; // Idle video loop
}

export interface AvatarOutfit {
  id: string;
  name: string;
  image: string; // Overlay image or texture
  style: 'CASUAL' | 'EVENING' | 'STREETWEAR' | 'SPORT';
}

export interface AvatarEnvironment {
  id: string;
  name: string;
  image: string;
  type: 'STUDIO' | 'STAGE' | 'OUTDOOR' | 'SHOP';
}
// ----------------------------

export interface Product {
  id: string;
  title: string;
  description: string;
  price: number; // For Auction: Starting Price
  originalPrice?: number; // New: Original Price for discounts
  currentBid?: number;
  bidCount?: number;
  bidHistory?: Bid[]; // New: List of bids
  stepPrice?: number; // New: Minimum increment
  image: string;
  category: string;
  type: ItemType;
  endTime?: string; 
  rating: number;
  reviewCount: number;
  status: OrderStatus;
  sellerId: string;
  payoutMethod?: string;
  // Affiliate Fields
  isAffiliate?: boolean;
  affiliateLink?: string;
  platformName?: string; // e.g. "Amazon", "Shopee"
  commissionRate?: number; // e.g. 5%
}

export interface LiveStream {
  id: string;
  title: string;
  viewerCount: number;
  hostName: string;
  hostAvatar: string;
  thumbnail: string;
  featuredProductIds: string[];
  isLive: boolean;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface Message {
  role: 'user' | 'model';
  text: string;
}

export interface ContentPost {
  id: string;
  title: string;
  content: string; // Markdown or HTML
  keywords: string[];
  generatedImages: string[];
  generatedVideo?: string;
  status: 'DRAFT' | 'PUBLISHED';
  platform: 'BLOG' | 'FACEBOOK' | 'INSTAGRAM' | 'TIKTOK';
  createdAt: string;
}