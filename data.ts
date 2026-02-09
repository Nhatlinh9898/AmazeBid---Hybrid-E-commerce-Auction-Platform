
import { Product, ItemType, OrderStatus, LiveStream } from './types';

// Mock database for "Auto-fill" feature
export const PRODUCT_TEMPLATES = [
  {
    title: "iPhone 15 Pro Max Titanium",
    description: "Màn hình Super Retina XDR 6.7 inch. Thiết kế Titan bền bỉ, nhẹ. Chip A17 Pro mang lại hiệu năng đồ họa đỉnh cao. Hệ thống camera chuyên nghiệp với ống kính tiềm vọng 5x.",
    category: "Electronics",
    price: 1199.00,
    image: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&q=80&w=400"
  },
  {
    title: "Sony PlayStation 5 Slim Console",
    description: "Phiên bản Slim mới, nhỏ gọn hơn. Tốc độ tải game siêu nhanh với SSD tốc độ cao. Hỗ trợ phản hồi xúc giác, cò bấm thích ứng và âm thanh 3D. Bao gồm 1 tay cầm DualSense.",
    category: "Electronics",
    price: 499.00,
    image: "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?auto=format&fit=crop&q=80&w=400"
  },
  {
    title: "Rolex Submariner Date Watch",
    description: "Đồng hồ lặn kinh điển. Vỏ Oystersteel 41mm, mặt số đen, vành bezel Cerachrom chống trầy xước. Bộ máy tự động 3235. Chống nước 300m. Tình trạng: Đã qua sử dụng (99%).",
    category: "Collectibles",
    price: 12500.00,
    image: "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?auto=format&fit=crop&q=80&w=400"
  },
  {
    title: "Nike Air Jordan 1 High Chicago",
    description: "Giày sneaker huyền thoại Jordan 1 phối màu Chicago (Lost & Found). Da cao cấp, thiết kế cổ điển năm 1985. Hộp giày nguyên bản, đầy đủ phụ kiện.",
    category: "Fashion",
    price: 450.00,
    image: "https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&q=80&w=400"
  },
  {
    title: "MacBook Air M2 13-inch",
    description: "Chip M2 cực mạnh mẽ. Thiết kế siêu mỏng nhẹ. Màn hình Liquid Retina rực rỡ. Thời lượng pin lên đến 18 giờ. Màu Midnight.",
    category: "Electronics",
    price: 999.00,
    image: "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?auto=format&fit=crop&q=80&w=400"
  },
  {
    title: "Dyson V15 Detect Vacuum",
    description: "Máy hút bụi không dây thông minh nhất của Dyson. Tia laser phát hiện bụi vô hình. Cảm biến Piezo tự động điều chỉnh lực hút. Màn hình LCD báo cáo lượng bụi.",
    category: "Home & Office",
    price: 749.00,
    image: "https://images.unsplash.com/photo-1558317374-a3594743e9c7?auto=format&fit=crop&q=80&w=400"
  },
  {
    title: "Chanel Classic Flap Bag",
    description: "Túi xách Chanel Classic Flap kích thước Medium. Da Caviar đen, khóa vàng (GHW). Biểu tượng của sự sang trọng vượt thời gian. Full box và bill.",
    category: "Fashion",
    price: 8200.00,
    image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&q=80&w=400"
  }
];

export const MOCK_STREAMS: LiveStream[] = [
  {
    id: 'stream_1',
    title: 'Săn Deal Đồng Hồ Hiệu Giá Sốc! ⌚️',
    viewerCount: 1420,
    hostName: 'WatchMaster',
    hostAvatar: 'https://i.pravatar.cc/150?u=watch',
    thumbnail: 'https://images.unsplash.com/photo-1587925358603-c2eea5305bbc?auto=format&fit=crop&q=80&w=800',
    featuredProductIds: ['2', '6'],
    isLive: true
  },
  {
    id: 'stream_2',
    title: 'Xả kho Đồ Công Nghệ - Giá hủy diệt 💻',
    viewerCount: 856,
    hostName: 'TechReviewerVN',
    hostAvatar: 'https://i.pravatar.cc/150?u=tech',
    thumbnail: 'https://images.unsplash.com/photo-1531297461136-82lw9f5b2413?auto=format&fit=crop&q=80&w=800',
    featuredProductIds: ['1', '3'],
    isLive: true
  },
  {
    id: 'stream_3',
    title: 'Đấu giá Thẻ Pokemon Hiếm 🔥',
    viewerCount: 3200,
    hostName: 'CardCollectorKing',
    hostAvatar: 'https://i.pravatar.cc/150?u=card',
    thumbnail: 'https://images.unsplash.com/photo-1613771404721-c5b27c154375?auto=format&fit=crop&q=80&w=800',
    featuredProductIds: ['4'],
    isLive: true
  }
];

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
