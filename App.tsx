
import React, { useState, useMemo } from 'react';
import Navbar from './components/Navbar';
import ProductCard from './components/ProductCard';
import GeminiAssistant from './components/GeminiAssistant';
import SellModal from './components/SellModal';
import OrderDashboard from './components/OrderDashboard';
import LiveStreamViewer from './components/LiveStreamViewer';
import CreateStreamModal from './components/CreateStreamModal'; // New Import
import BidModal from './components/BidModal';
import { MOCK_PRODUCTS, MOCK_STREAMS } from './data';
import { Product, CartItem, ItemType, OrderStatus, LiveStream, Bid } from './types';
import { ShoppingBag, ChevronRight, X, Minus, Plus, Trash2, Sparkles, Filter, PackageSearch, ShieldCheck, PlayCircle, User } from 'lucide-react';

const App: React.FC = () => {
  const [products, setProducts] = useState<Product[]>(MOCK_PRODUCTS);
  const [streams, setStreams] = useState<LiveStream[]>(MOCK_STREAMS);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Tất cả');
  const [filterType, setFilterType] = useState<'ALL' | ItemType>('ALL');
  const [cart, setCart] = useState<CartItem[]>([]);
  
  // Modals State
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSellModalOpen, setIsSellModalOpen] = useState(false);
  const [isOrderDashboardOpen, setIsOrderDashboardOpen] = useState(false);
  const [bidModalProduct, setBidModalProduct] = useState<Product | null>(null);
  const [isCreateStreamModalOpen, setIsCreateStreamModalOpen] = useState(false); // New state for setup modal

  // Live Stream States
  const [activeStream, setActiveStream] = useState<LiveStream | null>(null);
  const [isHostMode, setIsHostMode] = useState(false); // Track if user is hosting
  const [showLiveList, setShowLiveList] = useState(false);

  const [notification, setNotification] = useState<string | null>(null);

  const categories = ['Tất cả', 'Điện tử', 'Thời trang', 'Đồ cổ', 'Máy tính', 'Nhà cửa', 'Làm đẹp', 'Music'];

  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      if (p.status !== OrderStatus.AVAILABLE) return false;
      const matchesSearch = p.title.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'Tất cả' || p.category === selectedCategory || (selectedCategory === 'Điện tử' && p.category === 'Electronics');
      const matchesType = filterType === 'ALL' || p.type === filterType;
      return matchesSearch && matchesCategory && matchesType;
    });
  }, [searchTerm, products, selectedCategory, filterType]);

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  const handleAddToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    showNotification(`Đã thêm ${product.title} vào giỏ hàng`);
  };

  const handleOpenBidModal = (product: Product) => {
    setBidModalProduct(product);
  };

  const handleSubmitBid = (product: Product, amount: number) => {
    setProducts(prev => prev.map(p => {
        if (p.id === product.id) {
            const newBid: Bid = {
                id: `bid_${Date.now()}`,
                userId: 'currentUser',
                userName: 'Bạn',
                amount: amount,
                timestamp: new Date().toISOString()
            };
            return {
                ...p,
                currentBid: amount,
                bidCount: (p.bidCount || 0) + 1,
                bidHistory: p.bidHistory ? [...p.bidHistory, newBid] : [newBid]
            };
        }
        return p;
    }));
    
    // Simulate Counter Bid
    if (Math.random() > 0.5) {
        setTimeout(() => {
             setProducts(prev => prev.map(p => {
                if (p.id === product.id) {
                    const botAmount = amount + (p.stepPrice || 10);
                    const botBid: Bid = {
                        id: `bid_bot_${Date.now()}`,
                        userId: 'bot_sniper',
                        userName: 'SniperPro99',
                        amount: botAmount,
                        timestamp: new Date().toISOString()
                    };
                    return {
                        ...p,
                        currentBid: botAmount,
                        bidCount: (p.bidCount || 0) + 1,
                        bidHistory: p.bidHistory ? [...p.bidHistory, botBid] : [botBid]
                    };
                }
                return p;
            }));
            if (!activeStream && !isHostMode) showNotification(`Bạn đã bị SniperPro99 vượt giá sản phẩm ${product.title}!`);
        }, 3000);
    }
    showNotification(`Đã đặt giá thầu $${amount} thành công!`);
  };

  const handleAddProduct = (newProduct: Product) => {
    setProducts(prev => [newProduct, ...prev]);
    showNotification(`Niêm yết "${newProduct.title}" thành công!`);
  };

  const handleCreateStream = (streamData: Partial<LiveStream>) => {
    const newStream = streamData as LiveStream;
    setStreams(prev => [newStream, ...prev]);
    setIsCreateStreamModalOpen(false);
    
    // Enter Host Mode
    setActiveStream(newStream);
    setIsHostMode(true);
    showNotification("Đang bắt đầu phiên Live...");
  };

  const handleCheckout = () => {
    const boughtIds = cart.map(c => c.id);
    setProducts(prev => prev.map(p => {
      if (boughtIds.includes(p.id)) return { ...p, status: OrderStatus.PENDING_SHIPMENT };
      return p;
    }));
    setCart([]);
    setIsCartOpen(false);
    showNotification("Thanh toán thành công! Tiền đang được hệ thống tạm giữ.");
    setTimeout(() => setIsOrderDashboardOpen(true), 1500); 
  };

  const handleOrderStatusUpdate = (productId: string, newStatus: OrderStatus) => {
    setProducts(prev => prev.map(p => {
        if (p.id === productId) return { ...p, status: newStatus };
        return p;
    }));
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const totalAmount = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <div className="min-h-screen bg-[#f3f4f6] pb-20">
      <Navbar 
        cartCount={cart.reduce((s, i) => s + i.quantity, 0)} 
        onSearch={setSearchTerm}
        openCart={() => setIsCartOpen(true)}
        openSellModal={() => setIsSellModalOpen(true)}
        openOrders={() => setIsOrderDashboardOpen(true)}
        onOpenLiveStudio={() => setIsCreateStreamModalOpen(true)}
        onViewLiveStreams={() => {
            setShowLiveList(!showLiveList);
            if (!showLiveList) window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      <main className="max-w-[1500px] mx-auto px-4 py-6">
        
        {/* Live Stream List Section */}
        {showLiveList && (
            <div className="mb-10 animate-in slide-in-from-top-4 fade-in">
                <div className="flex items-center gap-2 mb-4">
                    <div className="w-3 h-3 bg-red-600 rounded-full animate-pulse"/>
                    <h2 className="text-xl font-bold uppercase tracking-wider">Đang phát trực tiếp</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {streams.map(stream => (
                        <div 
                            key={stream.id}
                            onClick={() => {
                                setActiveStream(stream);
                                setIsHostMode(false);
                            }}
                            className="relative aspect-video rounded-xl overflow-hidden cursor-pointer group shadow-lg hover:shadow-2xl transition-all"
                        >
                            <img src={stream.thumbnail} className="w-full h-full object-cover transition-transform group-hover:scale-105" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-4 text-white">
                                <div className="absolute top-3 left-3 bg-red-600 px-2 py-0.5 rounded text-[10px] font-bold uppercase">Live</div>
                                <div className="absolute top-3 right-3 bg-black/50 px-2 py-0.5 rounded text-[10px] font-bold flex items-center gap-1">
                                    <User size={10} /> {stream.viewerCount}
                                </div>
                                <h3 className="font-bold text-lg leading-tight mb-1">{stream.title}</h3>
                                <div className="flex items-center gap-2">
                                    <img src={stream.hostAvatar} className="w-6 h-6 rounded-full border border-white" />
                                    <span className="text-xs font-medium text-gray-300">{stream.hostName}</span>
                                </div>
                                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20 backdrop-blur-[1px]">
                                    <PlayCircle size={48} className="text-white drop-shadow-lg" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        )}

        {/* Banner Section */}
        {!showLiveList && (
            <div className="relative h-[250px] md:h-[350px] mb-8 overflow-hidden rounded-xl shadow-lg group">
            <img 
                src="https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&q=80&w=1500" 
                alt="Promotion Banner"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent flex flex-col justify-center p-8 md:p-12 text-white">
                <span className="bg-[#febd69] text-black text-xs font-bold px-2 py-1 rounded w-fit mb-4">SỰ KIỆN GIỚI HẠN</span>
                <h1 className="text-3xl md:text-5xl font-bold mb-4 leading-tight">MUA SẮM THÔNG MINH<br/>ĐẤU GIÁ ĐỈNH CAO</h1>
                <p className="text-sm md:text-lg text-gray-200 font-medium max-w-lg mb-6">Bảo vệ người mua và người bán với hệ thống thanh toán tạm giữ (Escrow) an toàn tuyệt đối.</p>
                <div className="flex gap-4">
                <button 
                    onClick={() => setIsSellModalOpen(true)}
                    className="bg-[#febd69] text-black font-bold px-6 py-3 rounded-lg hover:bg-[#f3a847] transition-all transform hover:-translate-y-1 shadow-lg"
                >
                    Đăng bán ngay
                </button>
                </div>
            </div>
            </div>
        )}

        {/* Categories Tab Bar */}
        <div className="bg-white p-2 rounded-xl shadow-sm mb-8 flex items-center overflow-x-auto no-scrollbar gap-2 sticky top-[108px] z-40 border border-gray-100">
          <div className="flex items-center gap-2 px-4 border-r border-gray-200 mr-2 shrink-0">
            <Filter size={18} className="text-gray-400" />
            <span className="text-xs font-bold text-gray-500 uppercase">Danh mục</span>
          </div>
          {categories.map(cat => (
            <button 
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all shrink-0 ${
                selectedCategory === cat 
                ? 'bg-[#131921] text-white shadow-md' 
                : 'hover:bg-gray-100 text-gray-600'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Filter Controls */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <div className="flex items-center gap-4 bg-white p-1 rounded-lg shadow-sm border border-gray-100">
            <button 
              onClick={() => setFilterType('ALL')}
              className={`px-4 py-1.5 rounded-md text-xs font-bold transition-all ${filterType === 'ALL' ? 'bg-gray-100 text-[#131921]' : 'text-gray-400'}`}
            >
              TẤT CẢ
            </button>
            <button 
              onClick={() => setFilterType(ItemType.FIXED_PRICE)}
              className={`px-4 py-1.5 rounded-md text-xs font-bold transition-all ${filterType === ItemType.FIXED_PRICE ? 'bg-orange-100 text-orange-600' : 'text-gray-400'}`}
            >
              MUA NGAY
            </button>
            <button 
              onClick={() => setFilterType(ItemType.AUCTION)}
              className={`px-4 py-1.5 rounded-md text-xs font-bold transition-all ${filterType === ItemType.AUCTION ? 'bg-red-100 text-red-600' : 'text-gray-400'}`}
            >
              ĐẤU GIÁ
            </button>
          </div>
          <p className="text-sm text-gray-500 font-medium">
            Hiển thị <span className="text-[#131921] font-bold">{filteredProducts.length}</span> kết quả cho "{searchTerm || selectedCategory}"
          </p>
        </div>

        {/* Product Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {filteredProducts.map(product => (
              <ProductCard 
                key={product.id} 
                product={product} 
                onAddToCart={handleAddToCart}
                onPlaceBid={handleOpenBidModal} 
              />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl p-20 text-center shadow-sm border border-gray-100 animate-in fade-in zoom-in-95">
            <div className="bg-gray-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
              <PackageSearch size={40} className="text-gray-300" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Không tìm thấy sản phẩm</h3>
            <p className="text-gray-500 mb-8 max-w-sm mx-auto">Chúng tôi không tìm thấy kết quả phù hợp với lựa chọn của bạn. Hãy thử thay đổi bộ lọc hoặc từ khóa tìm kiếm.</p>
            <button 
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('Tất cả');
                setFilterType('ALL');
              }}
              className="text-blue-600 font-bold hover:underline"
            >
              Xóa tất cả bộ lọc
            </button>
          </div>
        )}
      </main>

      {/* Cart Drawer */}
      {isCartOpen && (
        <div className="fixed inset-0 z-[200] overflow-hidden">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" onClick={() => setIsCartOpen(false)} />
          <div className="absolute right-0 top-0 bottom-0 w-full max-w-md bg-white shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
            <div className="p-5 bg-[#232f3e] text-white flex justify-between items-center shadow-lg">
              <div className="flex items-center gap-3">
                <ShoppingBag size={24} className="text-[#febd69]" />
                <h2 className="text-lg font-bold">Giỏ hàng ({cart.reduce((s, i) => s + i.quantity, 0)})</h2>
              </div>
              <button onClick={() => setIsCartOpen(false)} className="hover:bg-gray-700 p-2 rounded-full transition-colors">
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-5 space-y-6">
              {cart.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
                  <div className="bg-gray-100 p-6 rounded-full">
                    <ShoppingBag size={48} className="text-gray-300" />
                  </div>
                  <div>
                    <p className="text-gray-800 font-bold text-lg">Giỏ hàng của bạn đang trống</p>
                    <p className="text-gray-500 text-sm mt-1">Hãy tiếp tục khám phá và thêm sản phẩm!</p>
                  </div>
                  <button 
                    onClick={() => setIsCartOpen(false)} 
                    className="bg-[#febd69] px-8 py-3 rounded-full font-bold shadow-md hover:bg-[#f3a847] transition-all"
                  >
                    Bắt đầu mua sắm
                  </button>
                </div>
              ) : (
                cart.map(item => (
                  <div key={item.id} className="flex gap-4 p-3 rounded-xl hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100 group">
                    <div className="w-24 h-24 shrink-0 rounded-lg overflow-hidden bg-gray-100 border border-gray-200">
                      <img src={item.image} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <h4 className="text-sm font-bold text-gray-900 line-clamp-2 leading-tight">{item.title}</h4>
                        <p className="text-xs text-green-600 mt-1">Còn hàng</p>
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <p className="text-lg font-bold text-[#b12704]">${(item.price * item.quantity).toFixed(2)}</p>
                        <div className="flex items-center gap-3 bg-white border border-gray-300 rounded-lg p-1 shadow-sm">
                          <button onClick={() => updateQuantity(item.id, -1)} className="p-1 hover:bg-gray-100 rounded text-gray-500"><Minus size={14}/></button>
                          <span className="text-sm font-bold w-4 text-center">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.id, 1)} className="p-1 hover:bg-gray-100 rounded text-gray-500"><Plus size={14}/></button>
                        </div>
                      </div>
                      <button 
                        onClick={() => removeFromCart(item.id)} 
                        className="text-[10px] font-bold text-blue-600 hover:text-red-600 uppercase mt-2 w-fit flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Trash2 size={12}/> Xóa
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {cart.length > 0 && (
              <div className="p-6 border-t border-gray-100 bg-gray-50 space-y-4">
                <div className="bg-blue-50 p-3 rounded-lg flex gap-2 items-start border border-blue-100">
                    <ShieldCheck className="text-blue-600 shrink-0 mt-0.5" size={16} />
                    <p className="text-[10px] text-blue-800">
                      <strong>Thanh toán an toàn:</strong> Tiền sẽ được AmazeBid giữ lại cho đến khi bạn nhận được hàng và xác nhận hài lòng.
                    </p>
                </div>
                <div className="flex justify-between items-end">
                  <span className="text-gray-500 font-medium">Tổng cộng tạm tính:</span>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-[#b12704]">${totalAmount.toFixed(2)}</p>
                    <p className="text-[10px] text-gray-400 uppercase tracking-widest">Đã bao gồm thuế</p>
                  </div>
                </div>
                <button 
                  onClick={handleCheckout}
                  className="w-full bg-[#ffd814] hover:bg-[#f7ca00] text-black font-bold py-4 rounded-xl shadow-lg transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                >
                  Thanh toán ngay ({cart.length} món)
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Sell Modal */}
      {isSellModalOpen && (
        <SellModal 
          onClose={() => setIsSellModalOpen(false)} 
          onAddProduct={handleAddProduct}
        />
      )}

      {/* Create Stream Modal (New) */}
      {isCreateStreamModalOpen && (
        <CreateStreamModal 
          onClose={() => setIsCreateStreamModalOpen(false)}
          onStartStream={handleCreateStream}
          myProducts={products.filter(p => p.sellerId === 'currentUser')}
          onOpenSellModal={() => setIsSellModalOpen(true)}
        />
      )}

      {/* Standard Bid Modal */}
      {bidModalProduct && (
        <BidModal 
          product={bidModalProduct}
          onClose={() => setBidModalProduct(null)}
          onSubmitBid={(amount) => handleSubmitBid(bidModalProduct, amount)}
        />
      )}

      {/* Order Dashboard */}
      <OrderDashboard 
        isOpen={isOrderDashboardOpen}
        onClose={() => setIsOrderDashboardOpen(false)}
        products={products}
        currentUserId="currentUser"
        onUpdateStatus={handleOrderStatusUpdate}
      />

      {/* Live Stream Viewer */}
      {activeStream && (
          <LiveStreamViewer 
            stream={activeStream} 
            products={products}
            isHost={isHostMode}
            onClose={() => {
                setActiveStream(null);
                setIsHostMode(false);
            }}
            onPlaceBid={handleSubmitBid}
            onAddToCart={handleAddToCart}
          />
      )}

      {/* Notification Toast */}
      {notification && (
        <div className="fixed top-28 left-1/2 -translate-x-1/2 z-[300] bg-[#131921] text-white px-8 py-3 rounded-2xl shadow-2xl animate-in fade-in slide-in-from-top-4 border-2 border-[#febd69] flex items-center gap-3">
          <div className="bg-[#febd69] p-1 rounded-full">
            <Sparkles className="text-black" size={16} />
          </div>
          <span className="text-sm font-bold tracking-tight">{notification}</span>
        </div>
      )}

      <GeminiAssistant products={products} />
    </div>
  );
};

export default App;
