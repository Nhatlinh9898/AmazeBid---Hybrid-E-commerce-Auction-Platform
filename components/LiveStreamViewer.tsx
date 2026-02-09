
import React, { useState, useEffect, useRef } from 'react';
import { X, Heart, Send, Gavel, ShoppingCart, User, Share2, Video, Mic, MicOff, Camera, CameraOff, ShoppingBag, CreditCard, CheckCircle2, TrendingUp, Users, VideoOff } from 'lucide-react';
import { LiveStream, Product, ItemType } from '../types';

interface LiveStreamViewerProps {
  stream?: LiveStream; 
  products: Product[];
  onClose: () => void;
  onPlaceBid: (p: Product, amount: number) => void;
  onAddToCart: (p: Product) => void;
  isHost?: boolean; // Explicit flag for host mode
}

const LiveStreamViewer: React.FC<LiveStreamViewerProps> = ({ stream, products, onClose, onPlaceBid, onAddToCart, isHost = false }) => {
  const [messages, setMessages] = useState<{user: string, text: string}[]>([]);
  const [input, setInput] = useState('');
  const [featuredProduct, setFeaturedProduct] = useState<Product | null>(null);
  
  // Host Controls
  const [isStreaming, setIsStreaming] = useState(isHost); 
  const [cameraEnabled, setCameraEnabled] = useState(true);
  const [micEnabled, setMicEnabled] = useState(true);
  const [cameraError, setCameraError] = useState(false); // Track camera permission errors
  
  // Checkout States
  const [checkoutProduct, setCheckoutProduct] = useState<Product | null>(null);
  const [orderSuccess, setOrderSuccess] = useState(false);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const historyRef = useRef<HTMLDivElement>(null);

  // Filter products: If stream exists, use its list. If host mode (creating), filter by currentUser
  const currentProducts = stream && stream.featuredProductIds.length > 0
    ? products.filter(p => stream.featuredProductIds.includes(p.id))
    : products.filter(p => p.sellerId === 'currentUser'); 

  useEffect(() => {
    // If we have products, feature the first one by default
    if (currentProducts.length > 0 && !featuredProduct) {
        setFeaturedProduct(currentProducts[0]);
    }
  }, [currentProducts]);

  // Sync featured product updates (e.g. price change)
  useEffect(() => {
    if (featuredProduct) {
        const updated = products.find(p => p.id === featuredProduct.id);
        if (updated) setFeaturedProduct(updated);
    }
  }, [products]);

  // Scroll bid history
  useEffect(() => {
      if (historyRef.current) historyRef.current.scrollTop = 0; 
  }, [featuredProduct?.bidHistory]);

  // Auto-scroll chat
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // Effect: Handle Stream Simulation (Viewer) OR Camera Access (Host)
  useEffect(() => {
    // 1. Viewer Mode: Simulate incoming events
    if (!isHost && stream) {
      const interval = setInterval(() => {
        const randomUsers = ['TuanAnh99', 'MaiLan', 'HuyHoang', 'SarahJ', 'AuctionHunter'];
        const randomMsgs = ['Sản phẩm đẹp quá!', 'Shop ơi ship HCM không?', 'Chốt đơn!', 'Giá này hời quá', 'Hàng new hay used vậy?'];
        
        const user = randomUsers[Math.floor(Math.random() * randomUsers.length)];
        const text = randomMsgs[Math.floor(Math.random() * randomMsgs.length)];
        
        setMessages(prev => [...prev.slice(-10), { user, text }]);
      }, 2500);
      return () => clearInterval(interval);
    } 
    
    // 2. Host Mode: Handle Camera
    else if (isHost) {
        const startCamera = async () => {
            setCameraError(false);
            try {
                const streamData = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
                if (videoRef.current) {
                    videoRef.current.srcObject = streamData;
                }
            } catch (err) {
                console.error("Camera access denied or error:", err);
                setCameraError(true); // Fallback to avatar UI
            }
        };

        if (isStreaming && cameraEnabled) {
             startCamera();
        } else {
            // Stop tracks if disabled
            if (videoRef.current && videoRef.current.srcObject) {
                const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
                tracks.forEach(track => track.stop());
                videoRef.current.srcObject = null;
            }
        }
        
        return () => {
             if (videoRef.current && videoRef.current.srcObject) {
                const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
                tracks.forEach(track => track.stop());
             }
        }
    }
  }, [stream, isHost, isStreaming, cameraEnabled]);

  const handleSendMessage = () => {
    if (!input.trim()) return;
    setMessages(prev => [...prev, { user: isHost ? 'Bạn (Host)' : 'Bạn', text: input }]);
    setInput('');
  };

  const handleOpenCheckout = (product: Product) => {
      setCheckoutProduct(product);
      setOrderSuccess(false);
  };

  const handleConfirmOrder = () => {
      if (!checkoutProduct) return;
      onAddToCart(checkoutProduct);
      setOrderSuccess(true);
      setTimeout(() => {
          setMessages(prev => [...prev, { user: 'Hệ thống', text: `Chúc mừng bạn đã chốt đơn ${checkoutProduct.title}!` }]);
      }, 500);
      setTimeout(() => {
          setCheckoutProduct(null);
          setOrderSuccess(false);
      }, 2000);
  };

  const handleQuickBid = (increment: number) => {
      if (!featuredProduct) return;
      const currentPrice = featuredProduct.currentBid || featuredProduct.price;
      const nextPrice = currentPrice + increment;
      onPlaceBid(featuredProduct, nextPrice);
  };

  return (
    <div className="fixed inset-0 z-[300] bg-black text-white flex flex-col md:flex-row h-screen w-screen overflow-hidden">
        
      {/* Main Video Area */}
      <div className="relative flex-1 bg-gray-900 flex items-center justify-center overflow-hidden">
        
        {/* Render Video or Fallback */}
        {isHost ? (
            // HOST VIEW
            cameraError ? (
                <div className="flex flex-col items-center justify-center text-gray-400 p-8 text-center animate-in fade-in">
                    <div className="w-32 h-32 bg-gray-800 rounded-full flex items-center justify-center mb-4 border-2 border-red-600/50">
                        <VideoOff size={48} />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">Camera không khả dụng</h3>
                    <p className="max-w-xs">Chúng tôi không thể truy cập camera. Bạn đang phát ở chế độ chỉ có âm thanh (Audio-only) hoặc hiển thị Avatar.</p>
                </div>
            ) : (
                <video 
                    ref={videoRef}
                    autoPlay muted playsInline
                    className={`w-full h-full object-cover mirror-mode ${!cameraEnabled ? 'hidden' : ''}`}
                />
            )
        ) : (
            // VIEWER VIEW
             <>
                <img 
                    src={stream?.thumbnail} 
                    className="absolute inset-0 w-full h-full object-cover opacity-60 blur-sm" 
                />
                <video 
                    src="https://assets.mixkit.co/videos/preview/mixkit-girl-in-neon-sign-1232-large.mp4" 
                    autoPlay muted loop playsInline
                    className="relative w-full h-full object-contain max-w-[600px] md:max-w-full"
                />
             </>
        )}

        {/* Overlay Controls (Close, Viewers) */}
        <div className="absolute top-4 left-4 flex items-center gap-3 z-10">
            <button onClick={onClose} className="bg-black/40 backdrop-blur p-2 rounded-full hover:bg-black/60 transition-colors">
                <X size={24} />
            </button>
            <div className="bg-black/40 backdrop-blur px-3 py-1.5 rounded-full flex items-center gap-2">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                <span className="font-bold text-sm">LIVE</span>
                <span className="text-xs border-l border-gray-500 pl-2 ml-1">
                    {isHost ? 'Đang phát' : `${stream?.viewerCount.toLocaleString()} xem`}
                </span>
            </div>
        </div>

        {/* Host Info (Top Right) */}
        <div className="absolute top-4 right-4 flex items-center gap-2 bg-black/40 backdrop-blur p-1 pr-3 rounded-full z-10">
            <img 
                src={stream?.hostAvatar || "https://ui-avatars.com/api/?name=You&background=random"} 
                className="w-8 h-8 rounded-full border border-white" 
            />
            <span className="font-bold text-sm">{stream?.hostName || "Bạn (Host)"}</span>
            {!isHost && <button className="bg-red-600 text-xs px-2 py-1 rounded font-bold">Follow</button>}
        </div>
      </div>

      {/* Right Sidebar */}
      <div className="w-full md:w-[350px] bg-white text-gray-800 flex flex-col h-[50%] md:h-full shrink-0 border-l border-gray-200 absolute bottom-0 md:relative rounded-t-2xl md:rounded-none shadow-2xl z-20">
        
        {/* Host Controls Toolbar */}
        {isHost && (
            <div className="p-2 bg-gray-100 border-b border-gray-200 flex justify-between items-center shrink-0">
                <div className="flex gap-2">
                    <button onClick={() => setMicEnabled(!micEnabled)} className={`p-2 rounded hover:bg-white ${!micEnabled ? 'text-red-600 bg-red-50' : ''}`} title="Mic">
                        {micEnabled ? <Mic size={18}/> : <MicOff size={18}/>}
                    </button>
                    <button onClick={() => setCameraEnabled(!cameraEnabled)} className={`p-2 rounded hover:bg-white ${!cameraEnabled ? 'text-red-600 bg-red-50' : ''}`} title="Camera">
                        {cameraEnabled ? <Camera size={18}/> : <CameraOff size={18}/>}
                    </button>
                </div>
                <div className="text-xs font-bold text-gray-500 uppercase">
                    Bảng điều khiển Host
                </div>
            </div>
        )}

        {/* Featured Product / Auction Dashboard */}
        {featuredProduct ? (
            <div className="bg-gradient-to-b from-gray-50 to-white border-b border-gray-200 shrink-0">
                 {/* Product Header */}
                <div className="p-3 flex gap-3 items-center relative overflow-hidden">
                    <div className="absolute top-0 right-0 bg-[#febd69] text-black text-[10px] font-bold px-2 py-0.5 rounded-bl">
                        Đang ghim
                    </div>
                    <img src={featuredProduct.image} className="w-16 h-16 rounded bg-white object-cover border border-gray-200" />
                    <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-sm truncate">{featuredProduct.title}</h4>
                        {featuredProduct.type === ItemType.AUCTION ? (
                            <div className="flex items-center gap-2 mt-1">
                                <span className="text-[#b12704] font-black text-lg">${featuredProduct.currentBid?.toLocaleString()}</span>
                                <span className="text-[10px] bg-red-100 text-red-600 px-1 rounded font-bold animate-pulse">LIVE BID</span>
                            </div>
                        ) : (
                            <p className="text-red-600 font-bold mt-1">${featuredProduct.price}</p>
                        )}
                    </div>
                    {/* Action Button: Buy (Viewer) or Unpin (Host - Mock) */}
                    {featuredProduct.type === ItemType.FIXED_PRICE && !isHost && (
                        <button 
                            onClick={() => handleOpenCheckout(featuredProduct)}
                            className="bg-[#ffd814] text-black p-2 rounded-lg hover:bg-[#f7ca00]"
                        >
                            <ShoppingBag size={20} />
                        </button>
                    )}
                </div>

                {/* Auction Control Panel */}
                {featuredProduct.type === ItemType.AUCTION && (
                    <div className="px-3 pb-3">
                        {/* Only viewers can bid */}
                        {!isHost && (
                            <div className="flex gap-2 mb-2">
                                {[10, 20, 50].map(inc => (
                                    <button 
                                        key={inc}
                                        onClick={() => handleQuickBid(inc)}
                                        className="flex-1 bg-white border border-[#febd69] text-black hover:bg-[#febd69] font-bold text-xs py-2 rounded-lg transition-colors shadow-sm flex flex-col items-center"
                                    >
                                        <span>+${inc}</span>
                                    </button>
                                ))}
                            </div>
                        )}
                        
                        {/* Real-time Bid History List */}
                        <div className="bg-gray-100 rounded-lg p-2 h-24 overflow-y-auto no-scrollbar relative" ref={historyRef}>
                            <div className="text-[10px] font-bold text-gray-400 mb-1 sticky top-0 bg-gray-100 flex justify-between">
                                <span>DIỄN BIẾN ({featuredProduct.bidCount || 0})</span>
                                <span><TrendingUp size={10}/></span>
                            </div>
                            <div className="space-y-1">
                                {featuredProduct.bidHistory && [...featuredProduct.bidHistory].reverse().map((bid, i) => (
                                    <div key={bid.id} className={`flex justify-between text-xs ${i === 0 ? 'font-bold text-black animate-in slide-in-from-left' : 'text-gray-500'}`}>
                                        <div className="flex items-center gap-1">
                                            {i === 0 && <div className="w-1.5 h-1.5 bg-green-500 rounded-full" />}
                                            <span>{bid.userName === 'Bạn' ? 'Bạn' : bid.userName}</span>
                                        </div>
                                        <span>${bid.amount.toLocaleString()}</span>
                                    </div>
                                ))}
                                {(!featuredProduct.bidHistory || featuredProduct.bidHistory.length === 0) && (
                                    <p className="text-center text-gray-400 text-[10px] py-2">Chưa có lượt đấu giá nào.</p>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        ) : (
            // Empty State if no product pinned
            <div className="p-4 bg-gray-50 border-b border-gray-200 text-center text-gray-400 shrink-0">
                <ShoppingBag size={24} className="mx-auto mb-1 opacity-50"/>
                <p className="text-xs">Chưa có sản phẩm nào được ghim</p>
            </div>
        )}

        {/* Chat Area */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3 bg-white relative">
             {messages.map((msg, idx) => (
                 <div key={idx} className="text-sm animate-in slide-in-from-bottom-2 fade-in">
                     <span className={`font-bold mr-2 ${msg.user.includes('Host') ? 'text-red-600' : 'text-gray-500'}`}>{msg.user}:</span>
                     <span className="text-gray-800">{msg.text}</span>
                 </div>
             ))}

            {/* Quick Checkout Overlay */}
            {checkoutProduct && (
                <div className="absolute inset-x-0 bottom-0 bg-white border-t border-gray-200 shadow-2xl rounded-t-2xl p-4 animate-in slide-in-from-bottom-full z-30">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="font-bold text-lg flex items-center gap-2">
                            <CreditCard size={20} className="text-[#febd69]" /> Thanh toán nhanh
                        </h3>
                        {!orderSuccess && (
                            <button onClick={() => setCheckoutProduct(null)} className="p-1 hover:bg-gray-100 rounded-full">
                                <X size={20} className="text-gray-500" />
                            </button>
                        )}
                    </div>
                    
                    {orderSuccess ? (
                        <div className="flex flex-col items-center justify-center py-6">
                            <CheckCircle2 size={40} className="text-green-600 mb-2" />
                            <p className="font-bold text-green-700">Thành công!</p>
                        </div>
                    ) : (
                         <button 
                            onClick={handleConfirmOrder}
                            className="w-full bg-[#febd69] hover:bg-[#f3a847] text-black font-bold py-3 rounded-xl shadow-md"
                        >
                            Xác nhận mua - ${checkoutProduct.price}
                        </button>
                    )}
                </div>
            )}
        </div>

        {/* Input Area */}
        <div className="p-3 border-t border-gray-100 flex items-center gap-2 bg-white pb-6 md:pb-3 shrink-0">
            <div className="bg-gray-100 p-2 rounded-full cursor-pointer hover:bg-gray-200">
                <Heart size={20} className="text-red-500" />
            </div>
            <div className="flex-1 bg-gray-100 rounded-full flex items-center px-3">
                <input 
                    className="flex-1 bg-transparent py-2 text-sm outline-none"
                    placeholder="Bình luận..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    disabled={!!checkoutProduct} 
                />
                <button onClick={handleSendMessage} className="text-[#febd69] hover:text-orange-600">
                    <Send size={18} />
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default LiveStreamViewer;
