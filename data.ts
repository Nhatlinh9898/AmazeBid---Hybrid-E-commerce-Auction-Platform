
import { Product, ItemType, OrderStatus, LiveStream, User, Transaction, AvatarConfig, AvatarOutfit, AvatarEnvironment } from './types';

// Mock Affiliate Network (Kho hàng chung)
export const AFFILIATE_NETWORK_ITEMS = [
  {
    title: "Kindle Paperwhite (16 GB)",
    description: "Màn hình 6.8 inch, đèn nền ấm có thể điều chỉnh, thời lượng pin lên đến 10 tuần.",
    price: 139.99,
    image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=400",
    category: "Electronics",
    platformName: "Amazon",
    commissionRate: 8,
    affiliateLink: "https://amazon.com/dp/B08KTZ8249"
  },
  {
    title: "Nồi chiên không dầu Philips XXL",
    description: "Công nghệ Rapid Air, giảm 90% lượng dầu mỡ. Dung tích lớn cho cả gia đình.",
    price: 250.00,
    image: "https://images.unsplash.com/photo-1626162976644-b00344d51b8c?auto=format&fit=crop&q=80&w=400",
    category: "Home & Office",
    platformName: "Shopee",
    commissionRate: 5,
    affiliateLink: "https://shopee.vn/philips-xxl"
  },
  {
    title: "Son YSL Rouge Pur Couture",
    description: "Màu đỏ thuần quyến rũ, chất son mịn mượt, lâu trôi.",
    price: 38.00,
    image: "https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&q=80&w=400",
    category: "Beauty",
    platformName: "Lazada",
    commissionRate: 10,
    affiliateLink: "https://lazada.vn/ysl-lipstick"
  }
];

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

// --- MOCK VIRTUAL AVATAR ASSETS ---

export const MOCK_AVATARS: AvatarConfig[] = [
  {
    id: 'av_1',
    name: 'A.I. Mai Linh',
    role: 'FASHION_MODEL',
    gender: 'FEMALE',
    voiceTone: 'Ngọt ngào, Truyền cảm',
    image: 'https://images.unsplash.com/photo-1616766098956-c81f12114571?auto=format&fit=crop&q=80&w=600', // Model pose
    videoLoop: 'https://assets.mixkit.co/videos/preview/mixkit-girl-in-neon-sign-1232-large.mp4'
  },
  {
    id: 'av_2',
    name: 'Virtual Kevin',
    role: 'SALES_EXPERT',
    gender: 'MALE',
    voiceTone: 'Chuyên nghiệp, Tự tin',
    image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=600', // Male model
    videoLoop: 'https://assets.mixkit.co/videos/preview/mixkit-man-working-on-his-laptop-308-large.mp4'
  },
  {
    id: 'av_3',
    name: 'Cyber Idol Ruby',
    role: 'SINGER',
    gender: 'FEMALE',
    voiceTone: 'Năng động, Cao vút',
    image: 'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?auto=format&fit=crop&q=80&w=600', // Singer style
    videoLoop: 'https://assets.mixkit.co/videos/preview/mixkit-woman-dancing-in-the-dark-40995-large.mp4'
  }
];

export const MOCK_OUTFITS: AvatarOutfit[] = [
  { id: 'out_1', name: 'Váy Dạ Hội Đỏ', style: 'EVENING', image: 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&q=80&w=200' },
  { id: 'out_2', name: 'Streetwear Cool', style: 'STREETWEAR', image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=200' },
  { id: 'out_3', name: 'Công sở Thanh lịch', style: 'CASUAL', image: 'https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?auto=format&fit=crop&q=80&w=200' },
  { id: 'out_4', name: 'Thể thao Năng động', style: 'SPORT', image: 'https://images.unsplash.com/photo-1483721310020-03333e577078?auto=format&fit=crop&q=80&w=200' },
];

export const MOCK_ENVIRONMENTS: AvatarEnvironment[] = [
  { id: 'env_1', name: 'Sân khấu Ánh sáng', type: 'STAGE', image: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&q=80&w=800' },
  { id: 'env_2', name: 'Studio Thời trang', type: 'STUDIO', image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&q=80&w=800' },
  { id: 'env_3', name: 'Phòng khách Sang trọng', type: 'SHOP', image: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&q=80&w=800' },
];

// --- END MOCK ---

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
    id: '0',
    title: 'My Custom Keyboard Kit (Full Aluminum)',
    description: 'Bàn phím cơ Custom nhôm nguyên khối, mạch xuôi, 3 modes kết nối. Hàng sưu tầm của tôi.',
    price: 120.00,
    originalPrice: 180.00,
    image: 'https://images.unsplash.com/photo-1595225476474-87563907a212?auto=format&fit=crop&q=80&w=400',
    category: 'Electronics',
    type: ItemType.FIXED_PRICE,
    rating: 5.0,
    reviewCount: 0,
    status: OrderStatus.AVAILABLE,
    sellerId: 'currentUser'
  },
  {
    id: 'aff_1',
    title: 'Sách E-Reader Kindle Paperwhite',
    description: 'Phiên bản mới nhất từ Amazon. Hàng chính hãng.',
    price: 139.99,
    originalPrice: 159.99,
    image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=400",
    category: "Electronics",
    type: ItemType.FIXED_PRICE,
    rating: 4.8,
    reviewCount: 200,
    status: OrderStatus.AVAILABLE,
    sellerId: 'currentUser',
    isAffiliate: true,
    platformName: "Amazon",
    commissionRate: 8,
    affiliateLink: "https://amazon.com"
  },
  {
    id: '1',
    title: 'Sony WH-1000XM5 Noise Canceling Headphones',
    description: 'Industry leading noise cancellation with two processors and 8 microphones.',
    price: 349.99,
    originalPrice: 420.00,
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
    bidCount: 4,
    stepPrice: 50,
    bidHistory: [
      { id: 'b1', userId: 'u1', userName: 'CameraLover', amount: 1600, timestamp: '2023-10-25T10:00:00Z' },
      { id: 'b2', userId: 'u2', userName: 'LeicaFan', amount: 1650, timestamp: '2023-10-25T10:30:00Z' },
      { id: 'b3', userId: 'u1', userName: 'CameraLover', amount: 1750, timestamp: '2023-10-25T11:15:00Z' },
      { id: 'b4', userId: 'u3', userName: 'RichCollector', amount: 1850, timestamp: '2023-10-25T12:00:00Z' },
    ],
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
    originalPrice: 2799.00,
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
    bidCount: 12,
    stepPrice: 100,
    bidHistory: [
        { id: 'b1', userId: 'poke1', userName: 'AshKetchum', amount: 6000, timestamp: '2023-10-24T09:00:00Z' },
        { id: 'b2', userId: 'poke2', userName: 'TeamRocket', amount: 12400, timestamp: '2023-10-25T12:00:00Z' }
    ],
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
    originalPrice: 250.00,
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
    bidCount: 5,
    stepPrice: 10,
    bidHistory: [
        { id: 'b1', userId: 'beatle1', userName: 'JohnFan', amount: 300, timestamp: '2023-10-24T10:00:00Z' },
        { id: 'b2', userId: 'beatle2', userName: 'PaulFan', amount: 455, timestamp: '2023-10-25T08:00:00Z' }
    ],
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

// --- MOCK DATA FOR ADMIN DASHBOARD ---

export const MOCK_ALL_USERS: User[] = [
  {
    id: 'u1',
    fullName: 'Nguyễn Văn A',
    email: 'vana@example.com',
    avatar: 'https://ui-avatars.com/api/?name=Van+A&background=random',
    joinDate: '2023-01-15T10:00:00Z',
    balance: 150.00,
    paymentMethods: [],
    role: 'USER'
  },
  {
    id: 'u2',
    fullName: 'Trần Thị B',
    email: 'thib@example.com',
    avatar: 'https://ui-avatars.com/api/?name=Thi+B&background=random',
    joinDate: '2023-03-20T09:30:00Z',
    balance: 50.00,
    paymentMethods: [],
    role: 'USER'
  },
  {
    id: 'u3',
    fullName: 'Lê Hoàng C',
    email: 'hoangc@example.com',
    avatar: 'https://ui-avatars.com/api/?name=Hoang+C&background=random',
    joinDate: '2023-06-10T14:00:00Z',
    balance: 1200.00,
    paymentMethods: [],
    role: 'USER'
  },
  {
    id: 'u4',
    fullName: 'Phạm Minh D',
    email: 'minhd@example.com',
    avatar: 'https://ui-avatars.com/api/?name=Minh+D&background=random',
    joinDate: '2023-11-05T08:15:00Z',
    balance: 0.00,
    paymentMethods: [],
    role: 'USER'
  },
  {
    id: 'admin_1',
    fullName: 'Administrator',
    email: 'admin@amazebid.com',
    avatar: 'https://ui-avatars.com/api/?name=Admin&background=000&color=fff',
    joinDate: '2022-12-01T00:00:00Z',
    balance: 99999.00,
    paymentMethods: [],
    role: 'ADMIN'
  }
];

// Helper to create dates relative to now
const daysAgo = (days: number) => {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d.toISOString();
};

export const MOCK_TRANSACTIONS: Transaction[] = [
  { id: 't1', userId: 'u1', productId: '1', amount: 349.99, type: 'PURCHASE', timestamp: daysAgo(0), status: 'COMPLETED' }, // Today
  { id: 't2', userId: 'u2', productId: '5', amount: 189.99, type: 'PURCHASE', timestamp: daysAgo(1), status: 'COMPLETED' }, // Yesterday
  { id: 't3', userId: 'u1', productId: '0', amount: 120.00, type: 'PURCHASE', timestamp: daysAgo(4), status: 'COMPLETED' }, // This Week
  { id: 't4', userId: 'u3', productId: '3', amount: 2499.00, type: 'PURCHASE', timestamp: daysAgo(15), status: 'COMPLETED' }, // This Month
  { id: 't5', userId: 'u3', productId: '4', amount: 5000.00, type: 'PURCHASE', timestamp: daysAgo(45), status: 'COMPLETED' }, // This Quarter
  { id: 't6', userId: 'u2', productId: '6', amount: 455.00, type: 'PURCHASE', timestamp: daysAgo(100), status: 'COMPLETED' }, // This Year
  { id: 't7', userId: 'u4', productId: '5', amount: 189.99, type: 'PURCHASE', timestamp: daysAgo(200), status: 'COMPLETED' }, // This Year
  { id: 't8', userId: 'u1', productId: '2', amount: 1500.00, type: 'PURCHASE', timestamp: daysAgo(400), status: 'COMPLETED' }, // Last Year
];