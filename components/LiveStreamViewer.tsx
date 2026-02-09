
import React, { useState, useEffect, useRef } from 'react';
import { X, Heart, Send, Gavel, ShoppingCart, User, Share2, Video, Mic, MicOff, Camera, CameraOff, ShoppingBag, CreditCard, CheckCircle2, TrendingUp, Users } from 'lucide-react';
import { LiveStream, Product, ItemType } from '../types';

interface LiveStreamViewerProps {
  stream?: LiveStream; 
  products: Product[];
  onClose: () => void;
  onPlaceBid: (p: Product, amount: number) => void;
  onAddToCart: (p: Product) => void;
}

const LiveStreamViewer: React.FC<LiveStreamViewerProps> = ({ stream, products, onClose, onPlaceBid, onAddToCart }) => {
  const [messages, setMessages] = useState<{user: string, text: string}[]>([]);
  const [input, setInput] = useState('');
  const [featuredProduct, setFeaturedProduct] = useState<Product | null>(null);
  const [isStreaming, setIsStreaming] = useState(false); 
  const [cameraEnabled, setCameraEnabled] = useState(true);
  const [micEnabled, setMicEnabled] = useState(true);
  
  // Checkout States
  const [checkoutProduct, setCheckoutProduct] = useState<Product | null>(null);
  const [orderSuccess, setOrderSuccess] = useState(false);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const historyRef = useRef<HTMLDivElement>(null);

  // Filter products
  const currentProducts = stream 
    ? products.filter(p => stream.featuredProductIds.includes(p.id))
    : products.filter(p => p.sellerId === 'currentUser' || p.sellerId === 'system_store'); 

  // Force update when products change (to reflect new bids)
  useEffect(() => {
    if (featuredProduct) {
        const updated = products.find(p => p.id === featuredProduct.id);
        if (updated) setFeaturedProduct(updated);
    }
  }, [products]);

  // Scroll bid history
  useEffect(() => {
      if (historyRef.current) historyRef.current.scrollTop = 0; // Scroll to top to see newest
  }, [featuredProduct?.bidHistory]);

  useEffect(() => {
    // Auto-scroll chat
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    if (stream) {
      setFeaturedProduct(currentProducts[0]);
      const interval = setInterval(() => {
        const randomUsers = ['TuanAnh99', 'MaiLan', 'HuyHoang', 'SarahJ', 'AuctionHunter'];
        const randomMsgs = ['Sản phẩm đẹp quá!', 'Shop ơi ship HCM không?', 'Chốt đơn!', 'Giá này hời quá', 'Hàng new hay used vậy?'];
        
        const user = randomUsers[Math.floor(Math.random() * randomUsers.length)];
        const text = randomMsgs[Math.floor(Math.random() * randomMsgs.length)];
        
        setMessages(prev => [...prev.slice(-10), { user, text }]);

        // Simulate random interaction/bids if needed
      }, 2500);
      return () => clearInterval(interval);
    } else {
        const startCamera = async () => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                }
            } catch (err) {
                console.error("Camera access denied", err);
            }
        };
        if(isStreaming) startCamera();
        
        return () => {
             if (videoRef.current && videoRef.current.srcObject) {
                const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
                tracks.forEach(track => track.stop());
             }
        }
    }
  }, [stream, isStreaming]);

  const handleSendMessage = () => {
    if (!input.trim()) return;
    setMessages(prev => [...prev, { user: 'Bạn', text: input }]);
    setInput('');
  };

  const handleStartStream = () => {
      setIsStreaming(true);
      setMessages([{ user: 'Hệ thống', text: 'Luồng trực tiếp đã bắt đầu! Chúc bạn buôn may bán đắt.' }]);
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
          setMessages(prev => [...prev, { user: 'Bạn', text: `Đã chốt đơn ${checkoutProduct.title}!` }]);
      }, 500);
      setTimeout(() => {
          setCheckoutProduct(null);
          setOrderSuccess(false);
      }, 2000);
  };

  // Auction Logic
  const handleQuickBid = (increment: number) => {
      if (!featuredProduct) return;
      const currentPrice = featuredProduct.currentBid || featuredProduct.price;
      const nextPrice = currentPrice + increment;
      onPlaceBid(featuredProduct, nextPrice);
  };

  return (
    <div className="fixed inset-0 z-[300] bg-black text-white flex flex-col md:flex-row h-screen w-screen overflow-hidden">
        
      {/* Main Video Area */}
      <div className="relative flex-1 bg-gray-900 flex items-center justify-center">
        {stream ? (
             <>
                <img 
                    src={stream.thumbnail} 
                    className="absolute inset-0 w-full h-full object-cover opacity-60 blur-sm" 
                />
                <video 
                    src="https://assets.mixkit.co/videos/preview/mixkit-girl-in-neon-sign-1232-large.mp4" 
                    autoPlay muted loop playsInline
                    className="relative w-full h-full object-contain max-w-[600px] md:max-w-full"
                />
             </>
        ) : (
            isStreaming ? (
                 <video 
                    ref={videoRef}
                    autoPlay muted playsInline
                    className="w-full h-full object-cover mirror-mode"
                />
            ) : (
                <div className="text-center p-8">
                    <div className="w-24 h-24 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                        <Video size={40} />
                    </div>
                    <h2 className="text-2xl font-bold mb-2">Sẵn sàng lên sóng?</h2>
                    <p className="text-gray-400 mb-6">Kiểm tra ánh sáng và âm thanh trước khi bắt đầu.</p>
                    <button 
                        onClick={handleStartStream}
                        className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-full font-bold text-lg shadow-xl hover:scale-105 transition-all"
                    >
                        Bắt đầu Live
                    </button>
                </div>
            )
        )}

        <div className="absolute top-4 left-4 flex items-center gap-3 z-10">
            <button onClick={onClose} className="bg-black/40 backdrop-blur p-2 rounded-full hover:bg-black/60">
                <X size={24} />
            </button>
            {stream && (
                <div className="bg-black/40 backdrop-blur px-3 py-1.5 rounded-full flex items-center gap-2">
                    <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                    <span className="font-bold text-sm">LIVE</span>
                    <span className="text-xs border-l border-gray-500 pl-2 ml-1">{stream.viewerCount.toLocaleString()} xem</span>
                </div>
            )}
        </div>
      </div>

      {/* Right Sidebar */}
      <div className="w-full md:w-[350px] bg-white text-gray-800 flex flex-col h-[50%] md:h-full shrink-0 border-l border-gray-200 absolute bottom-0 md:relative rounded-t-2xl md:rounded-none shadow-2xl z-20">
        
        {/* Featured Product / Auction Dashboard */}
        {featuredProduct && (
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
                    {featuredProduct.type === ItemType.FIXED_PRICE && (
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
                        
                        {/* Real-time Bid History List */}
                        <div className="bg-gray-100 rounded-lg p-2 h-24 overflow-y-auto no-scrollbar relative" ref={historyRef}>
                            <div className="text-[10px] font-bold text-gray-400 mb-1 sticky top-0 bg-gray-100 flex justify-between">
                                <span>DIỄN BIẾN ({featuredProduct.bidCount})</span>
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
                            </div>
                        </div>
                    </div>
                )}
            </div>
        )}

        {/* Chat Area */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3 bg-white relative">
             {messages.map((msg, idx) => (
                 <div key={idx} className="text-sm animate-in slide-in-from-bottom-2 fade-in">
                     <span className="font-bold text-gray-500 mr-2">{msg.user}:</span>
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
                    {/* ... (Existing checkout logic) ... */}
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
            <div className="bg-gray-100 p-2 rounded-full cursor-pointer hover:bg-gray-200">
                <Share2 size={20} className="text-gray-600" />
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
