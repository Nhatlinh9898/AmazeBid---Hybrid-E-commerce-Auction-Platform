
import React, { useState, useEffect, useRef } from 'react';
import { X, Heart, Send, Gavel, ShoppingCart, User, Share2, Video, Mic, MicOff, Camera, CameraOff, ShoppingBag, CreditCard, CheckCircle2 } from 'lucide-react';
import { LiveStream, Product, ItemType } from '../types';

interface LiveStreamViewerProps {
  stream?: LiveStream; // If undefined, we are in "Create Stream" mode
  products: Product[];
  onClose: () => void;
  onPlaceBid: (p: Product) => void;
  onAddToCart: (p: Product) => void;
}

const LiveStreamViewer: React.FC<LiveStreamViewerProps> = ({ stream, products, onClose, onPlaceBid, onAddToCart }) => {
  const [messages, setMessages] = useState<{user: string, text: string}[]>([]);
  const [input, setInput] = useState('');
  const [featuredProduct, setFeaturedProduct] = useState<Product | null>(null);
  const [isStreaming, setIsStreaming] = useState(false); // For Creator Mode
  const [cameraEnabled, setCameraEnabled] = useState(true);
  const [micEnabled, setMicEnabled] = useState(true);
  
  // Checkout States
  const [checkoutProduct, setCheckoutProduct] = useState<Product | null>(null);
  const [orderSuccess, setOrderSuccess] = useState(false);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Filter products relevant to this stream (Mock logic: if viewing a stream, show its featured items. If creating, show all my items)
  const currentProducts = stream 
    ? products.filter(p => stream.featuredProductIds.includes(p.id))
    : products.filter(p => p.sellerId === 'currentUser' || p.sellerId === 'system_store'); // Hack for demo

  useEffect(() => {
    // Auto-scroll chat
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    // Simulate incoming messages/bids if watching
    if (stream) {
      setFeaturedProduct(currentProducts[0]);
      const interval = setInterval(() => {
        const randomUsers = ['TuanAnh99', 'MaiLan', 'HuyHoang', 'SarahJ', 'AuctionHunter'];
        const randomMsgs = ['Sản phẩm đẹp quá!', 'Shop ơi ship HCM không?', 'Chốt đơn!', 'Giá này hời quá', 'Hàng new hay used vậy?'];
        
        const user = randomUsers[Math.floor(Math.random() * randomUsers.length)];
        const text = randomMsgs[Math.floor(Math.random() * randomMsgs.length)];
        
        setMessages(prev => [...prev.slice(-10), { user, text }]);

        // Simulate random interaction on featured product
        if (Math.random() > 0.7 && currentProducts.length > 0) {
           // Maybe switch featured product occasionally
           setFeaturedProduct(currentProducts[Math.floor(Math.random() * currentProducts.length)]);
        }

      }, 2500);
      return () => clearInterval(interval);
    } else {
        // Creator Mode: Request Camera
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
             // Cleanup tracks
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
      
      // 1. Add to main cart logic
      onAddToCart(checkoutProduct);
      
      // 2. Show success animation
      setOrderSuccess(true);
      
      // 3. Auto-send chat message (Social Proof)
      setTimeout(() => {
          setMessages(prev => [...prev, { user: 'Bạn', text: `Đã chốt đơn ${checkoutProduct.title}!` }]);
      }, 500);

      // 4. Close modal after delay
      setTimeout(() => {
          setCheckoutProduct(null);
          setOrderSuccess(false);
      }, 2000);
  };

  return (
    <div className="fixed inset-0 z-[300] bg-black text-white flex flex-col md:flex-row h-screen w-screen overflow-hidden">
        
      {/* Main Video Area */}
      <div className="relative flex-1 bg-gray-900 flex items-center justify-center">
        {stream ? (
            // Viewer Mode: Mock Video
             <>
                <img 
                    src={stream.thumbnail} 
                    className="absolute inset-0 w-full h-full object-cover opacity-60 blur-sm" 
                />
                <video 
                    // Using a loop video for demo feel
                    src="https://assets.mixkit.co/videos/preview/mixkit-girl-in-neon-sign-1232-large.mp4" 
                    autoPlay muted loop playsInline
                    className="relative w-full h-full object-contain max-w-[600px] md:max-w-full"
                />
             </>
        ) : (
            // Creator Mode: Camera
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

        {/* Overlay Controls (Close, Viewers) */}
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
             {!stream && isStreaming && (
                <div className="bg-red-600 px-3 py-1.5 rounded-full flex items-center gap-2">
                    <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                    <span className="font-bold text-sm">ĐANG PHÁT</span>
                </div>
            )}
        </div>

        {/* Host Info */}
        {stream && (
            <div className="absolute top-4 right-4 flex items-center gap-2 bg-black/40 backdrop-blur p-1 pr-3 rounded-full z-10">
                <img src={stream.hostAvatar} className="w-8 h-8 rounded-full border border-white" />
                <span className="font-bold text-sm">{stream.hostName}</span>
                <button className="bg-red-600 text-xs px-2 py-1 rounded font-bold">Follow</button>
            </div>
        )}
      </div>

      {/* Right Sidebar (Chat & Product) - On Mobile this overlays bottom */}
      <div className="w-full md:w-[350px] bg-white text-gray-800 flex flex-col h-[40%] md:h-full shrink-0 border-l border-gray-200 absolute bottom-0 md:relative rounded-t-2xl md:rounded-none shadow-2xl z-20">
        
        {/* Featured Product Card */}
        {featuredProduct && (
            <div className="p-3 bg-gradient-to-r from-orange-50 to-white border-b border-gray-100 flex gap-3 items-center relative overflow-hidden shrink-0">
                <div className="absolute top-0 right-0 bg-[#febd69] text-black text-[10px] font-bold px-2 py-0.5 rounded-bl">
                    Đang ghim
                </div>
                <img src={featuredProduct.image} className="w-16 h-16 rounded bg-white object-cover border border-gray-200" />
                <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-sm truncate">{featuredProduct.title}</h4>
                    <div className="flex items-center gap-2 mt-1">
                         <span className="text-red-600 font-bold">${featuredProduct.type === ItemType.AUCTION ? featuredProduct.currentBid : featuredProduct.price}</span>
                         {featuredProduct.type === ItemType.AUCTION && (
                             <span className="text-[10px] bg-red-100 text-red-600 px-1 rounded">Đấu giá</span>
                         )}
                    </div>
                </div>
                <div className="flex flex-col gap-1">
                     {featuredProduct.type === ItemType.AUCTION ? (
                        <button 
                            onClick={() => onPlaceBid(featuredProduct)}
                            className="bg-black text-white p-2 rounded-lg hover:bg-gray-800"
                        >
                            <Gavel size={16} />
                        </button>
                     ) : (
                        <button 
                            onClick={() => handleOpenCheckout(featuredProduct)}
                            className="bg-[#ffd814] text-black p-2 rounded-lg hover:bg-[#f7ca00]"
                        >
                            <ShoppingBag size={16} />
                        </button>
                     )}
                </div>
            </div>
        )}

        {/* Creator Tools (Only for Creator) */}
        {!stream && (
            <div className="p-3 grid grid-cols-2 gap-2 border-b border-gray-200 bg-gray-50 shrink-0">
                 <button onClick={() => setFeaturedProduct(currentProducts[Math.floor(Math.random() * currentProducts.length)])} className="text-xs bg-white border p-2 rounded hover:bg-gray-100">
                    Ghim sản phẩm khác
                 </button>
                 <div className="flex gap-2 justify-end">
                    <button onClick={() => setMicEnabled(!micEnabled)} className={`p-2 rounded ${!micEnabled ? 'bg-red-100 text-red-600' : 'bg-white'}`}>
                        {micEnabled ? <Mic size={16}/> : <MicOff size={16}/>}
                    </button>
                     <button onClick={() => setCameraEnabled(!cameraEnabled)} className={`p-2 rounded ${!cameraEnabled ? 'bg-red-100 text-red-600' : 'bg-white'}`}>
                        {cameraEnabled ? <Camera size={16}/> : <CameraOff size={16}/>}
                    </button>
                 </div>
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

            {/* Quick Checkout Modal Overlay */}
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
                        <div className="flex flex-col items-center justify-center py-6 animate-in zoom-in">
                            <div className="bg-green-100 p-3 rounded-full mb-3">
                                <CheckCircle2 size={40} className="text-green-600" />
                            </div>
                            <p className="font-bold text-xl text-green-700">Chốt đơn thành công!</p>
                            <p className="text-sm text-gray-500">Đơn hàng đang được xử lý...</p>
                        </div>
                    ) : (
                        <>
                            <div className="flex gap-3 mb-4">
                                <img src={checkoutProduct.image} className="w-20 h-20 rounded-lg object-cover border border-gray-200" />
                                <div>
                                    <p className="font-bold text-sm line-clamp-2 mb-1">{checkoutProduct.title}</p>
                                    <p className="text-red-600 font-bold text-lg">${checkoutProduct.price}</p>
                                    <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                                        <span className="bg-gray-100 px-2 py-0.5 rounded">Free Ship</span>
                                        <span className="bg-gray-100 px-2 py-0.5 rounded">Bảo hành 12T</span>
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-3">
                                <button 
                                    onClick={handleConfirmOrder}
                                    className="w-full bg-[#febd69] hover:bg-[#f3a847] text-black font-bold py-3 rounded-xl shadow-md transition-all active:scale-[0.98]"
                                >
                                    Xác nhận mua - ${checkoutProduct.price}
                                </button>
                                <p className="text-[10px] text-center text-gray-400">
                                    Bằng việc xác nhận, bạn đồng ý với điều khoản thanh toán AmazeBid SafePay.
                                </p>
                            </div>
                        </>
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
                    disabled={!!checkoutProduct} // Disable input while checking out
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
