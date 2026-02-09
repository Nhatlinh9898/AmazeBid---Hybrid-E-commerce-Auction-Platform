
export enum ItemType {
  FIXED_PRICE = 'FIXED_PRICE',
  AUCTION = 'AUCTION'
}

export enum OrderStatus {
  AVAILABLE = 'AVAILABLE',
  PENDING_SHIPMENT = 'PENDING_SHIPMENT', // Buyer paid, money held by system
  SHIPPED = 'SHIPPED',                   // Seller sent item
  DELIVERED = 'DELIVERED',               // Buyer received, pending confirmation
  COMPLETED = 'COMPLETED',               // Funds released to seller
  RETURNED = 'RETURNED'                  // Buyer returned, buyer pays shipping
}

export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  currentBid?: number;
  bidCount?: number;
  image: string;
  category: string;
  type: ItemType;
  endTime?: string; 
  rating: number;
  reviewCount: number;
  status: OrderStatus;
  sellerId: string;
  payoutMethod?: string; // e.g., "Bank **** 1234"
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
