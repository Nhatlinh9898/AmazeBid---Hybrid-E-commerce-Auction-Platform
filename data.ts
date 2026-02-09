
import { Product, ItemType, OrderStatus } from './types';

export const MOCK_PRODUCTS: Product[] = [
  {
    id: '1',
    title: 'Sony WH-1000XM5 Noise Canceling Headphones',
    description: 'Industry leading noise cancellation with two processors and 8 microphones.',
    price: 349.99,
    image: 'https://picsum.photos/seed/sony/400/400',
    category: 'Electronics',
    type: ItemType.FIXED_PRICE,
    rating: 4.8,
    reviewCount: 1250,
    status: OrderStatus.AVAILABLE,
    sellerId: 'system_store'
  },
  {
    id: '2',
    title: 'Vintage 1970s Leica M3 Camera',
    description: 'Extremely rare collectible camera in pristine condition. A true masterpiece for collectors.',
    price: 1500,
    currentBid: 1850.00,
    bidCount: 24,
    image: 'https://picsum.photos/seed/leica/400/400',
    category: 'Collectibles',
    type: ItemType.AUCTION,
    endTime: new Date(Date.now() + 1000 * 60 * 60 * 5).toISOString(),
    rating: 5.0,
    reviewCount: 3,
    status: OrderStatus.AVAILABLE,
    sellerId: 'user_collector_99'
  },
  {
    id: '3',
    title: 'MacBook Pro 14-inch (M3 Max)',
    description: 'The most advanced chips ever built for a personal computer.',
    price: 2499.00,
    image: 'https://picsum.photos/seed/macbook/400/400',
    category: 'Electronics',
    type: ItemType.FIXED_PRICE,
    rating: 4.9,
    reviewCount: 840,
    status: OrderStatus.AVAILABLE,
    sellerId: 'apple_reseller'
  },
  {
    id: '4',
    title: 'Limited Edition Charizard Card (Holographic)',
    description: 'Shadowless 1st Edition PSA 10. The holy grail of Pokémon cards.',
    price: 5000,
    currentBid: 12400.00,
    bidCount: 86,
    image: 'https://picsum.photos/seed/pokemon/400/400',
    category: 'Collectibles',
    type: ItemType.AUCTION,
    endTime: new Date(Date.now() + 1000 * 60 * 30).toISOString(),
    rating: 5.0,
    reviewCount: 12,
    status: OrderStatus.AVAILABLE,
    sellerId: 'card_king'
  },
  {
    id: '5',
    title: 'Ergonomic Mesh Office Chair',
    description: 'High back adjustable task chair with lumber support.',
    price: 189.99,
    image: 'https://picsum.photos/seed/chair/400/400',
    category: 'Home & Office',
    type: ItemType.FIXED_PRICE,
    rating: 4.3,
    reviewCount: 3200,
    status: OrderStatus.AVAILABLE,
    sellerId: 'furniture_outlet'
  },
  {
    id: '6',
    title: 'Rare Vinyl: The Beatles - Abbey Road',
    description: 'Original 1969 UK Pressing. Sleeve in Excellent condition.',
    price: 200,
    currentBid: 455.00,
    bidCount: 12,
    image: 'https://picsum.photos/seed/beatles/400/400',
    category: 'Music',
    type: ItemType.AUCTION,
    endTime: new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString(),
    rating: 4.7,
    reviewCount: 45,
    status: OrderStatus.AVAILABLE,
    sellerId: 'music_lover'
  }
];
