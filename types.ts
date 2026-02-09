
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

export interface Product {
  id: string;
  title: string;
  description: string;
  price: number; // For Auction: Starting Price
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
