
import React, { useState, useEffect, useRef } from 'react';
import { X, User, Shirt, Image as ImageIcon, Video, Mic, Music, Sparkles, MessageSquare, Monitor, Zap, Bot } from 'lucide-react';
import { MOCK_AVATARS, MOCK_OUTFITS, MOCK_ENVIRONMENTS } from '../data';
import { GoogleGenAI } from "@google/genai";
import { Product } from '../types';

interface VirtualAvatarStudioProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
}

const VirtualAvatarStudio: React.FC<VirtualAvatarStudioProps> = ({ isOpen, onClose, products }) => {
  const [activeTab, setActiveTab] = useState<'SETUP' | 'STUDIO' | 'LIVE'>('SETUP');
  
  // Avatar Configuration State
  const [selectedAvatar, setSelectedAvatar] = useState(MOCK_AVATARS[0]);
  const [selectedOutfit, setSelectedOutfit] = useState(MOCK_OUTFITS[0]);
  const [selectedEnv, setSelectedEnv] = useState(MOCK_ENVIRONMENTS[0]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(products[0] || null);

  // Live State
  const [isLive, setIsLive] = useState(false);
  const [chatHistory, setChatHistory] = useState<{user: string, text: string}[]>([]);
  const [isTalking, setIsTalking] = useState(false);
  const [isSinging, setIsSinging] = useState(false);
  const [lyrics, setLyrics] = useState<string[]>([]);
  
  // Gemini AI for Chat & Lyrics
  const generateResponse = async (userMessage: string) => {
    setIsTalking(true);
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    try {
        const prompt = `Bạn là nhân vật ảo tên là ${selectedAvatar.name}. 
        Phong cách của bạn là: ${selectedAvatar.role}. Giọng điệu: ${selectedAvatar.voiceTone}.
        Bạn đang livestream bán sản phẩm: ${selectedProduct?.title}.
        
        Khách hàng hỏi: "${userMessage}"
        
        Hãy trả lời ngắn gọn, thú vị, đúng phong cách nhân vật. (Tối đa 2 câu).`;

        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: prompt
        });

        const reply = response.text || "Cảm ơn bạn đã quan tâm!";
        setChatHistory(prev => [...prev, { user: selectedAvatar.name, text: reply }]);
        
        // Simple speech synthesis for demo
        const utterance = new SpeechSynthesisUtterance(reply);
        utterance.lang = 'vi-VN';
        window.speechSynthesis.speak(utterance);
        utterance.onend = () => setIsTalking(false);

    } catch (e) {
        console.error(e);
        setIsTalking(false);
    }
  };

  const generateSong = async () => {
      setIsSinging(true);
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      try {
          const prompt = `Viết một đoạn lời bài hát ngắn (4 dòng) quảng cáo cho sản phẩm: "${selectedProduct?.title}". 
          Phong cách nhạc: Pop, vui tươi. Chỉ trả về lời bài hát.`;
          
          const response = await ai.models.generateContent({
              model: 'gemini-3-flash-preview',
              contents: prompt
          });
          
          const songText = response.text || "Sản phẩm tuyệt vời, mua ngay đi thôi...";
          setLyrics(songText.split('\n').filter(l => l.trim()));
          
          // Mock singing finish after 5s
          setTimeout(() => {
              setIsSinging(false);
              setLyrics([]);
          }, 8000);
      } catch(e) {
          setIsSinging(false);
      }
  };

  // Mock incoming chat
  useEffect(() => {
      if (isLive) {
          const interval = setInterval(() => {
              const users = ['KhachHang1', 'FanCung20', 'NamNguyen', 'ThaoLe'];
              const msgs = ['Sản phẩm đẹp quá!', 'Review chi tiết đi ạ', 'Có size M không?', 'Hát bài gì đi idol ơi'];
              const u = users[Math.floor(Math.random() * users.length)];
              const m = msgs[Math.floor(Math.random() * msgs.length)];
              
              setChatHistory(prev => [...prev.slice(-5), { user: u, text: m }]);
              
              // 30% chance AI auto-replies to specific keywords
              if (Math.random() > 0.7) {
                  generateResponse(m);
              }
          }, 4000);
          return () => clearInterval(interval);
      }
  }, [isLive, selectedProduct]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[250] bg-[#0f172a] text-white flex flex-col h-screen w-screen overflow-hidden animate-in zoom-in-95">
      
      {/* Header */}
      <div className="bg-[#1e293b] p-4 flex justify-between items-center border-b border-gray-700 shrink-0">
          <div className="flex items-center gap-3">
              <div className="bg-purple-600 p-2 rounded-lg">
                  <Bot size={24} />
              </div>
              <div>
                  <h2 className="text-xl font-bold flex items-center gap-2">
                      AmazeAvatar <span className="text-purple-400">Studio</span>
                  </h2>
                  <p className="text-xs text-gray-400">Tạo nhân vật ảo & Livestream tự động</p>
              </div>
          </div>
          
          <div className="flex bg-gray-800 p-1 rounded-lg">
              <button onClick={() => setActiveTab('SETUP')} className={`px-4 py-2 rounded-md text-sm font-bold transition-all ${activeTab === 'SETUP' ? 'bg-purple-600 text-white' : 'text-gray-400 hover:text-white'}`}>
                  1. Thiết lập
              </button>
              <button onClick={() => setActiveTab('STUDIO')} className={`px-4 py-2 rounded-md text-sm font-bold transition-all ${activeTab === 'STUDIO' ? 'bg-purple-600 text-white' : 'text-gray-400 hover:text-white'}`}>
                  2. Phòng thu
              </button>
              <button onClick={() => setActiveTab('LIVE')} className={`px-4 py-2 rounded-md text-sm font-bold transition-all ${activeTab === 'LIVE' ? 'bg-red-600 text-white animate-pulse' : 'text-gray-400 hover:text-white'}`}>
                  3. Phát sóng
              </button>
          </div>

          <button onClick={onClose} className="hover:bg-gray-700 p-2 rounded-full transition-colors"><X size={24}/></button>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
          
          {/* LEFT SIDEBAR: Controls */}
          <div className="w-80 bg-[#1e293b] border-r border-gray-700 p-4 overflow-y-auto custom-scrollbar">
              {activeTab === 'SETUP' && (
                  <div className="space-y-6 animate-in slide-in-from-left">
                      <div>
                          <label className="block text-xs font-bold text-gray-400 uppercase mb-3">Chọn Nhân vật gốc</label>
                          <div className="grid grid-cols-2 gap-3">
                              {MOCK_AVATARS.map(av => (
                                  <div 
                                    key={av.id} 
                                    onClick={() => setSelectedAvatar(av)}
                                    className={`relative cursor-pointer rounded-xl overflow-hidden border-2 transition-all group ${selectedAvatar.id === av.id ? 'border-purple-500 ring-2 ring-purple-500/50' : 'border-gray-600 hover:border-gray-400'}`}
                                  >
                                      <img src={av.image} className="w-full h-32 object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                                      <div className="absolute bottom-0 inset-x-0 bg-black/60 p-2">
                                          <p className="text-xs font-bold truncate">{av.name}</p>
                                          <p className="text-[10px] text-gray-300">{av.role}</p>
                                      </div>
                                  </div>
                              ))}
                          </div>
                      </div>
                      <div>
                          <label className="block text-xs font-bold text-gray-400 uppercase mb-3">Giọng nói AI</label>
                          <div className="p-3 bg-gray-800 rounded-lg border border-gray-700">
                              <p className="text-sm font-bold text-purple-300 mb-1">{selectedAvatar.voiceTone}</p>
                              <p className="text-xs text-gray-500">Được tối ưu hóa cho livestream bán hàng.</p>
                          </div>
                      </div>
                  </div>
              )}

              {activeTab === 'STUDIO' && (
                  <div className="space-y-6 animate-in slide-in-from-left">
                      <div>
                          <label className="block text-xs font-bold text-gray-400 uppercase mb-3 flex items-center gap-2">
                              <Shirt size={14}/> Trang phục (Outfit)
                          </label>
                          <div className="grid grid-cols-2 gap-3">
                              {MOCK_OUTFITS.map(fit => (
                                  <div 
                                    key={fit.id} 
                                    onClick={() => setSelectedOutfit(fit)}
                                    className={`relative cursor-pointer rounded-xl overflow-hidden border-2 transition-all ${selectedOutfit.id === fit.id ? 'border-purple-500' : 'border-gray-600'}`}
                                  >
                                      <img src={fit.image} className="w-full h-24 object-cover" />
                                      <div className="absolute bottom-0 inset-x-0 bg-black/60 p-1 text-center">
                                          <p className="text-[10px] font-bold">{fit.name}</p>
                                      </div>
                                  </div>
                              ))}
                          </div>
                      </div>

                      <div>
                          <label className="block text-xs font-bold text-gray-400 uppercase mb-3 flex items-center gap-2">
                              <ImageIcon size={14}/> Bối cảnh (Background)
                          </label>
                          <div className="space-y-3">
                              {MOCK_ENVIRONMENTS.map(env => (
                                  <div 
                                    key={env.id} 
                                    onClick={() => setSelectedEnv(env)}
                                    className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer border transition-all ${selectedEnv.id === env.id ? 'bg-purple-900/30 border-purple-500' : 'bg-gray-800 border-transparent hover:bg-gray-700'}`}
                                  >
                                      <img src={env.image} className="w-16 h-10 object-cover rounded" />
                                      <div>
                                          <p className="text-xs font-bold">{env.name}</p>
                                          <p className="text-[10px] text-gray-400">{env.type}</p>
                                      </div>
                                  </div>
                              ))}
                          </div>
                      </div>
                  </div>
              )}

              {activeTab === 'LIVE' && (
                  <div className="space-y-6 animate-in slide-in-from-left h-full flex flex-col">
                      <div>
                          <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Sản phẩm đang bán</label>
                          <select 
                            className="w-full bg-gray-800 border border-gray-700 rounded-lg p-2 text-sm outline-none focus:border-purple-500"
                            onChange={(e) => {
                                const prod = products.find(p => p.id === e.target.value);
                                if(prod) setSelectedProduct(prod);
                            }}
                          >
                              {products.map(p => (
                                  <option key={p.id} value={p.id}>{p.title}</option>
                              ))}
                          </select>
                      </div>

                      <div className="flex-1 bg-black/30 rounded-xl border border-gray-700 p-3 overflow-y-auto space-y-2">
                          {chatHistory.map((msg, idx) => (
                              <div key={idx} className="text-xs">
                                  <span className={`font-bold ${msg.user === selectedAvatar.name ? 'text-purple-400' : 'text-blue-400'}`}>{msg.user}:</span> <span className="text-gray-300">{msg.text}</span>
                              </div>
                          ))}
                      </div>

                      <div className="space-y-2">
                          <button 
                            onClick={generateSong}
                            disabled={isSinging || !isLive}
                            className="w-full bg-pink-600 hover:bg-pink-700 text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2 disabled:opacity-50 transition-all"
                          >
                              <Music size={18} /> {isSinging ? 'Đang biểu diễn...' : 'Biểu diễn bài hát'}
                          </button>
                          
                          <button 
                            onClick={() => setIsLive(!isLive)}
                            className={`w-full font-bold py-3 rounded-lg flex items-center justify-center gap-2 transition-all ${isLive ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'}`}
                          >
                              {isLive ? <Video size={18} /> : <Zap size={18} />}
                              {isLive ? 'Kết thúc Live' : 'Bắt đầu Livestream'}
                          </button>
                      </div>
                  </div>
              )}
          </div>

          {/* CENTER STAGE: Preview */}
          <div className="flex-1 bg-black relative flex items-center justify-center overflow-hidden">
              
              {/* Background Layer */}
              <div 
                className="absolute inset-0 bg-cover bg-center transition-all duration-700"
                style={{ backgroundImage: `url(${selectedEnv.image})`, opacity: 0.6 }}
              />
              
              {/* Avatar Layer */}
              <div className="relative z-10 h-full max-h-[800px] aspect-[9/16] flex items-end justify-center">
                  <video 
                    src={selectedAvatar.videoLoop} 
                    autoPlay loop muted 
                    className="h-full w-full object-cover mask-image-gradient"
                    // In a real app, this would be a WebGL canvas or transparent video
                  />
                  
                  {/* Overlay Outfit (Mockup visual) */}
                  <div className="absolute top-10 right-4 bg-black/50 backdrop-blur px-3 py-1 rounded-full text-xs font-bold border border-white/20 flex items-center gap-2">
                      <Shirt size={12} className="text-purple-400"/>
                      {selectedOutfit.name}
                  </div>

                  {/* Singing Effect */}
                  {isSinging && (
                      <div className="absolute top-1/3 inset-x-0 text-center space-y-2 animate-bounce-slow">
                          <Music size={48} className="text-pink-500 mx-auto animate-pulse" />
                          <div className="bg-black/60 backdrop-blur px-4 py-2 rounded-xl inline-block max-w-xs">
                              {lyrics.map((line, i) => (
                                  <p key={i} className="text-pink-300 font-bold italic text-sm">{line}</p>
                              ))}
                          </div>
                      </div>
                  )}

                  {/* Speaking Effect */}
                  {isTalking && (
                      <div className="absolute bottom-32 bg-white/10 backdrop-blur border border-white/20 px-6 py-3 rounded-full flex gap-1 items-center animate-in fade-in slide-in-from-bottom-4">
                          <div className="w-1 h-3 bg-purple-400 rounded-full animate-wave"></div>
                          <div className="w-1 h-5 bg-purple-400 rounded-full animate-wave delay-75"></div>
                          <div className="w-1 h-4 bg-purple-400 rounded-full animate-wave delay-150"></div>
                          <span className="ml-2 text-sm font-bold text-white">Đang nói...</span>
                      </div>
                  )}
              </div>

              {/* Product Overlay (if live) */}
              {isLive && selectedProduct && (
                  <div className="absolute top-4 left-4 bg-white text-gray-900 p-3 rounded-xl shadow-lg max-w-[200px] animate-in slide-in-from-top-4">
                      <img src={selectedProduct.image} className="w-full h-24 object-cover rounded-lg mb-2" />
                      <p className="font-bold text-xs line-clamp-1">{selectedProduct.title}</p>
                      <p className="text-red-600 font-black">${selectedProduct.price}</p>
                  </div>
              )}

              {/* Status Overlay */}
              <div className="absolute top-4 right-4 flex gap-2">
                  <div className="bg-black/50 backdrop-blur px-3 py-1 rounded-full text-xs font-bold border border-white/10 flex items-center gap-2">
                      {isLive ? <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"/> : <div className="w-2 h-2 bg-gray-500 rounded-full"/>}
                      {isLive ? 'ON AIR' : 'OFFLINE'}
                  </div>
              </div>
          </div>
      </div>
    </div>
  );
};

export default VirtualAvatarStudio;
