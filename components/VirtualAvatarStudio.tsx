
import React, { useState, useEffect, useRef } from 'react';
import { X, User, Shirt, Image as ImageIcon, Video, Mic, Music, Sparkles, MessageSquare, Monitor, Zap, Bot, Radio, Sliders, Palette, Languages, Speaker, Scissors } from 'lucide-react';
import { MOCK_AVATARS, MOCK_OUTFITS, MOCK_ENVIRONMENTS } from '../data';
import { GoogleGenAI } from "@google/genai";
import { Product, AvatarCustomization } from '../types';

interface VirtualAvatarStudioProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
}

type AvatarState = 'IDLE' | 'TALKING' | 'SINGING';

const VirtualAvatarStudio: React.FC<VirtualAvatarStudioProps> = ({ isOpen, onClose, products }) => {
  const [activeTab, setActiveTab] = useState<'SETUP' | 'CUSTOMIZE' | 'STUDIO' | 'LIVE'>('SETUP');
  
  // Avatar Configuration State
  const [selectedAvatar, setSelectedAvatar] = useState(MOCK_AVATARS[0]);
  const [selectedOutfit, setSelectedOutfit] = useState(MOCK_OUTFITS[0]);
  const [selectedEnv, setSelectedEnv] = useState(MOCK_ENVIRONMENTS[0]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(products[0] || null);

  // New: Advanced Customization State
  const [customization, setCustomization] = useState<AvatarCustomization>({
      heightScale: 1.0,
      skinToneHash: '#ffffff', // Default neutral
      hairStyle: 'LONG',
      language: 'vi-VN',
      voiceSpeed: 1.1,
      voicePitch: 1.0
  });

  // Live State
  const [isLive, setIsLive] = useState(false);
  const [avatarState, setAvatarState] = useState<AvatarState>('IDLE');
  const [chatHistory, setChatHistory] = useState<{user: string, text: string}[]>([]);
  const [lyrics, setLyrics] = useState<string[]>([]);
  
  // Audio Visualizer Mock
  const [audioLevel, setAudioLevel] = useState<number[]>(new Array(10).fill(10));

  const videoRef = useRef<HTMLVideoElement>(null);

  // Effect to handle video source switching based on state
  useEffect(() => {
      if (videoRef.current) {
          let nextSrc = selectedAvatar.idleVideo;
          if (avatarState === 'TALKING') nextSrc = selectedAvatar.talkingVideo;
          if (avatarState === 'SINGING') nextSrc = selectedAvatar.singingVideo || selectedAvatar.talkingVideo;
          
          // Only change if src is different to avoid flickering loop reset
          if (!videoRef.current.src.includes(nextSrc)) {
              videoRef.current.src = nextSrc;
              videoRef.current.play().catch(e => console.log("Auto-play prevented", e));
          }
      }
  }, [avatarState, selectedAvatar]);

  // Effect for Audio Visualizer
  useEffect(() => {
      if (avatarState !== 'IDLE') {
          const interval = setInterval(() => {
              setAudioLevel(prev => prev.map(() => Math.random() * 100));
          }, 100);
          return () => clearInterval(interval);
      } else {
          setAudioLevel(new Array(10).fill(5));
      }
  }, [avatarState]);

  // Reset customization when changing base avatar
  useEffect(() => {
      setCustomization(prev => ({
          ...prev,
          voicePitch: selectedAvatar.gender === 'FEMALE' ? 1.2 : 0.9
      }));
  }, [selectedAvatar]);

  // Gemini AI for Chat & Lyrics
  const generateResponse = async (userMessage: string) => {
    setAvatarState('TALKING');
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    try {
        const prompt = `Bạn là nhân vật ảo tên là ${selectedAvatar.name}. 
        Phong cách của bạn là: ${selectedAvatar.role}. Giọng điệu: ${selectedAvatar.voiceTone}.
        Ngôn ngữ trả lời: ${customization.language === 'vi-VN' ? 'Tiếng Việt' : customization.language === 'en-US' ? 'English' : 'Japanese'}.
        Bạn đang livestream bán sản phẩm: ${selectedProduct?.title}.
        
        Khách hàng hỏi: "${userMessage}"
        
        Hãy trả lời ngắn gọn, thú vị, đúng phong cách nhân vật. (Tối đa 2 câu).`;

        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: prompt
        });

        const reply = response.text || "Cảm ơn bạn đã quan tâm!";
        setChatHistory(prev => [...prev, { user: selectedAvatar.name, text: reply }]);
        
        // Advanced speech synthesis with customization
        const utterance = new SpeechSynthesisUtterance(reply);
        utterance.lang = customization.language;
        utterance.rate = customization.voiceSpeed;
        utterance.pitch = customization.voicePitch;
        
        window.speechSynthesis.speak(utterance);
        
        utterance.onend = () => {
            setAvatarState('IDLE');
        };

    } catch (e) {
        console.error(e);
        setAvatarState('IDLE');
    }
  };

  const generateSong = async () => {
      setAvatarState('SINGING');
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      try {
          const prompt = `Viết một đoạn lời bài hát ngắn (4 dòng) quảng cáo cho sản phẩm: "${selectedProduct?.title}". 
          Phong cách nhạc: Pop, vui tươi. Ngôn ngữ: ${customization.language}. Chỉ trả về lời bài hát.`;
          
          const response = await ai.models.generateContent({
              model: 'gemini-3-flash-preview',
              contents: prompt
          });
          
          const songText = response.text || "Sản phẩm tuyệt vời, mua ngay đi thôi...";
          setLyrics(songText.split('\n').filter(l => l.trim()));
          
          // Mock singing finish after 8s
          setTimeout(() => {
              setAvatarState('IDLE');
              setLyrics([]);
          }, 8000);
      } catch(e) {
          setAvatarState('IDLE');
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
              if (Math.random() > 0.7 && avatarState === 'IDLE') {
                  generateResponse(m);
              }
          }, 4000);
          return () => clearInterval(interval);
      }
  }, [isLive, selectedProduct, avatarState, customization]); // Added customization dependency

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
                      AmazeAvatar <span className="text-purple-400">Studio Pro</span>
                  </h2>
                  <p className="text-xs text-gray-400">Tạo nhân vật ảo & Livestream tự động</p>
              </div>
          </div>
          
          <div className="flex bg-gray-800 p-1 rounded-lg overflow-x-auto">
              <button onClick={() => setActiveTab('SETUP')} className={`px-4 py-2 rounded-md text-sm font-bold whitespace-nowrap transition-all ${activeTab === 'SETUP' ? 'bg-purple-600 text-white' : 'text-gray-400 hover:text-white'}`}>
                  1. Model Gốc
              </button>
              <button onClick={() => setActiveTab('CUSTOMIZE')} className={`px-4 py-2 rounded-md text-sm font-bold whitespace-nowrap transition-all ${activeTab === 'CUSTOMIZE' ? 'bg-purple-600 text-white' : 'text-gray-400 hover:text-white'}`}>
                  2. Tùy chỉnh (Mới)
              </button>
              <button onClick={() => setActiveTab('STUDIO')} className={`px-4 py-2 rounded-md text-sm font-bold whitespace-nowrap transition-all ${activeTab === 'STUDIO' ? 'bg-purple-600 text-white' : 'text-gray-400 hover:text-white'}`}>
                  3. Trang phục
              </button>
              <button onClick={() => setActiveTab('LIVE')} className={`px-4 py-2 rounded-md text-sm font-bold whitespace-nowrap transition-all ${activeTab === 'LIVE' ? 'bg-red-600 text-white animate-pulse' : 'text-gray-400 hover:text-white'}`}>
                  4. Phát sóng
              </button>
          </div>

          <button onClick={onClose} className="hover:bg-gray-700 p-2 rounded-full transition-colors"><X size={24}/></button>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden flex-col md:flex-row">
          
          {/* LEFT SIDEBAR: Controls */}
          <div className="w-full md:w-96 bg-[#1e293b] border-r border-gray-700 p-4 overflow-y-auto custom-scrollbar shrink-0">
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
                          <label className="block text-xs font-bold text-gray-400 uppercase mb-3">Thông số AI</label>
                          <div className="p-3 bg-gray-800 rounded-lg border border-gray-700 space-y-2">
                              <div className="flex justify-between text-xs">
                                  <span className="text-gray-400">Giọng gốc:</span>
                                  <span className="text-white font-bold">{selectedAvatar.voiceTone}</span>
                              </div>
                              <div className="flex justify-between text-xs">
                                  <span className="text-gray-400">Giới tính:</span>
                                  <span className="text-purple-400 font-bold">{selectedAvatar.gender}</span>
                              </div>
                          </div>
                      </div>
                  </div>
              )}

              {activeTab === 'CUSTOMIZE' && (
                  <div className="space-y-6 animate-in slide-in-from-left">
                      {/* 1. Body & Skin */}
                      <div className="bg-gray-800/50 p-4 rounded-xl border border-gray-700">
                          <h3 className="text-sm font-bold text-purple-400 flex items-center gap-2 mb-4">
                              <Palette size={16}/> Ngoại hình & Vóc dáng
                          </h3>
                          
                          <div className="space-y-4">
                              <div>
                                  <div className="flex justify-between text-xs mb-1">
                                      <span className="text-gray-400">Chiều cao</span>
                                      <span>{Math.round(customization.heightScale * 170)} cm</span>
                                  </div>
                                  <input 
                                      type="range" min="0.9" max="1.1" step="0.01"
                                      value={customization.heightScale}
                                      onChange={(e) => setCustomization({...customization, heightScale: parseFloat(e.target.value)})}
                                      className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer accent-purple-500"
                                  />
                              </div>

                              <div>
                                  <div className="flex justify-between text-xs mb-2">
                                      <span className="text-gray-400">Tông màu da (Overlay)</span>
                                  </div>
                                  <div className="flex gap-2">
                                      {['#ffffff', '#fcece0', '#eac086', '#a16e4b', '#593b2b'].map(color => (
                                          <button 
                                            key={color}
                                            onClick={() => setCustomization({...customization, skinToneHash: color})}
                                            className={`w-8 h-8 rounded-full border-2 transition-all ${customization.skinToneHash === color ? 'border-purple-500 scale-110' : 'border-gray-500'}`}
                                            style={{ backgroundColor: color }}
                                          />
                                      ))}
                                  </div>
                              </div>
                          </div>
                      </div>

                      {/* 2. Hair */}
                      <div className="bg-gray-800/50 p-4 rounded-xl border border-gray-700">
                           <h3 className="text-sm font-bold text-purple-400 flex items-center gap-2 mb-4">
                              <Scissors size={16}/> Kiểu tóc (Mockup)
                          </h3>
                          <div className="grid grid-cols-4 gap-2">
                              {['LONG', 'SHORT', 'BOB', 'PONYTAIL'].map(style => (
                                  <button
                                    key={style}
                                    onClick={() => setCustomization({...customization, hairStyle: style as any})}
                                    className={`p-2 rounded border text-[10px] font-bold transition-all ${customization.hairStyle === style ? 'bg-purple-600 border-purple-400 text-white' : 'bg-gray-700 border-gray-600 text-gray-400'}`}
                                  >
                                      {style}
                                  </button>
                              ))}
                          </div>
                      </div>

                      {/* 3. Voice & Language */}
                      <div className="bg-gray-800/50 p-4 rounded-xl border border-gray-700">
                          <h3 className="text-sm font-bold text-purple-400 flex items-center gap-2 mb-4">
                              <Speaker size={16}/> Giọng nói & Ngôn ngữ
                          </h3>
                          
                          <div className="space-y-4">
                               <div>
                                  <label className="block text-xs text-gray-400 mb-2 flex items-center gap-1"><Languages size={12}/> Ngôn ngữ chính</label>
                                  <select 
                                    value={customization.language}
                                    onChange={(e) => setCustomization({...customization, language: e.target.value as any})}
                                    className="w-full bg-gray-900 border border-gray-600 rounded p-2 text-xs outline-none"
                                  >
                                      <option value="vi-VN">Tiếng Việt</option>
                                      <option value="en-US">English (US)</option>
                                      <option value="ja-JP">Japanese</option>
                                  </select>
                               </div>

                               <div>
                                  <div className="flex justify-between text-xs mb-1">
                                      <span className="text-gray-400">Cao độ (Pitch)</span>
                                      <span>{customization.voicePitch.toFixed(1)}x</span>
                                  </div>
                                  <input 
                                      type="range" min="0.5" max="2.0" step="0.1"
                                      value={customization.voicePitch}
                                      onChange={(e) => setCustomization({...customization, voicePitch: parseFloat(e.target.value)})}
                                      className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer accent-purple-500"
                                  />
                              </div>

                              <div>
                                  <div className="flex justify-between text-xs mb-1">
                                      <span className="text-gray-400">Tốc độ nói</span>
                                      <span>{customization.voiceSpeed.toFixed(1)}x</span>
                                  </div>
                                  <input 
                                      type="range" min="0.5" max="2.0" step="0.1"
                                      value={customization.voiceSpeed}
                                      onChange={(e) => setCustomization({...customization, voiceSpeed: parseFloat(e.target.value)})}
                                      className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer accent-purple-500"
                                  />
                              </div>
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
                      <div className="bg-gray-800 p-3 rounded-xl border border-gray-700">
                          <div className="flex justify-between items-center mb-2">
                              <span className="text-xs font-bold text-gray-400 uppercase">Trạng thái</span>
                              <span className={`text-xs font-bold px-2 py-0.5 rounded ${isLive ? 'bg-red-500 text-white' : 'bg-gray-600 text-gray-300'}`}>
                                  {isLive ? 'ON AIR' : 'OFFLINE'}
                              </span>
                          </div>
                          
                          {/* Audio Visualizer */}
                          <div className="flex items-end gap-1 h-8 justify-center">
                              {audioLevel.map((level, i) => (
                                  <div 
                                    key={i} 
                                    className="w-1.5 bg-purple-500 rounded-t-sm transition-all duration-75"
                                    style={{ height: `${level}%` }}
                                  />
                              ))}
                          </div>
                      </div>

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
                              <div key={idx} className="text-xs animate-in slide-in-from-left-2 fade-in">
                                  <span className={`font-bold ${msg.user === selectedAvatar.name ? 'text-purple-400' : 'text-blue-400'}`}>{msg.user}:</span> <span className="text-gray-300">{msg.text}</span>
                              </div>
                          ))}
                      </div>

                      <div className="space-y-2">
                          <div className="grid grid-cols-2 gap-2">
                              <button 
                                onClick={generateSong}
                                disabled={avatarState !== 'IDLE' || !isLive}
                                className="bg-pink-600 hover:bg-pink-700 text-white text-xs font-bold py-3 rounded-lg flex items-center justify-center gap-2 disabled:opacity-50 transition-all"
                              >
                                  <Music size={14} /> Hát
                              </button>
                              <button 
                                onClick={() => setAvatarState(avatarState === 'IDLE' ? 'TALKING' : 'IDLE')}
                                disabled={!isLive}
                                className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold py-3 rounded-lg flex items-center justify-center gap-2 disabled:opacity-50 transition-all"
                              >
                                  <MessageSquare size={14} /> Nói
                              </button>
                          </div>
                          
                          <button 
                            onClick={() => setIsLive(!isLive)}
                            className={`w-full font-bold py-3 rounded-lg flex items-center justify-center gap-2 transition-all ${isLive ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'}`}
                          >
                              {isLive ? <Radio size={18} /> : <Zap size={18} />}
                              {isLive ? 'Dừng phát sóng' : 'Bắt đầu Livestream'}
                          </button>
                      </div>
                  </div>
              )}
          </div>

          {/* CENTER STAGE: Preview */}
          <div className="flex-1 bg-black relative flex items-center justify-center overflow-hidden">
              
              {/* Background Layer with Lighting Tint */}
              <div 
                className="absolute inset-0 bg-cover bg-center transition-all duration-700"
                style={{ 
                    backgroundImage: `url(${selectedEnv.image})`, 
                    opacity: 0.8 
                }}
              />
              <div 
                className="absolute inset-0 transition-colors duration-700 pointer-events-none mix-blend-overlay"
                style={{ backgroundColor: selectedEnv.lightingColor, opacity: 0.3 }}
              />
              
              {/* Avatar Layer - Using Customization & State */}
              <div 
                className="relative z-10 h-full max-h-[800px] aspect-[9/16] flex items-end justify-center transition-transform duration-300"
                style={{ 
                    // Simulate Height scaling
                    transform: `scale(${customization.heightScale})`,
                    transformOrigin: 'bottom center'
                }}
              >
                  <div className="relative w-full h-full">
                        {/* 
                            Concept: To make it look "real", we treat the video as a "cutout" or apply filters 
                            to blend it with the environment.
                        */}
                        <video 
                            ref={videoRef}
                            src={selectedAvatar.idleVideo} // Default source
                            autoPlay loop muted 
                            className="h-full w-full object-cover transition-opacity duration-300"
                            style={{ 
                                // Simulate Skin Tone adjustment using sepia and hue-rotate filters (visual hack for demo)
                                // In production, this would be a real 3D texture change.
                                filter: customization.skinToneHash !== '#ffffff' 
                                    ? `sepia(0.3) hue-rotate(-10deg) drop-shadow(0 0 10px ${selectedEnv.lightingColor}50)` 
                                    : `drop-shadow(0 0 10px ${selectedEnv.lightingColor}50)`
                            }}
                        />
                        
                        {/* Simulate Skin Tone Overlay (Visual Hack) */}
                        {customization.skinToneHash !== '#ffffff' && (
                             <div className="absolute inset-0 bg-cover mix-blend-color pointer-events-none opacity-20" style={{ backgroundColor: customization.skinToneHash }}></div>
                        )}
                  </div>
                  
                  {/* Overlay Outfit (Mockup visual) */}
                  <div className="absolute top-10 right-4 bg-black/50 backdrop-blur px-3 py-1 rounded-full text-xs font-bold border border-white/20 flex items-center gap-2 animate-in fade-in">
                      <Shirt size={12} className="text-purple-400"/>
                      {selectedOutfit.name}
                  </div>

                  {/* Singing Effect */}
                  {avatarState === 'SINGING' && (
                      <div className="absolute top-1/3 inset-x-0 text-center space-y-2 animate-bounce-slow">
                          <Music size={48} className="text-pink-500 mx-auto animate-pulse" />
                          <div className="bg-black/60 backdrop-blur px-4 py-2 rounded-xl inline-block max-w-xs">
                              {lyrics.map((line, i) => (
                                  <p key={i} className="text-pink-300 font-bold italic text-sm">{line}</p>
                              ))}
                          </div>
                      </div>
                  )}

                  {/* Speaking Effect / Subtitles */}
                  {avatarState === 'TALKING' && chatHistory.length > 0 && chatHistory[chatHistory.length - 1].user === selectedAvatar.name && (
                      <div className="absolute bottom-32 max-w-xs bg-black/70 backdrop-blur border border-purple-500/30 px-4 py-2 rounded-xl text-center animate-in fade-in slide-in-from-bottom-2">
                          <p className="text-white text-sm font-medium">"{chatHistory[chatHistory.length - 1].text}"</p>
                      </div>
                  )}
              </div>

              {/* Product Overlay (if live) */}
              {isLive && selectedProduct && (
                  <div className="absolute top-4 left-4 bg-white text-gray-900 p-3 rounded-xl shadow-lg max-w-[200px] animate-in slide-in-from-top-4 border-2 border-purple-500">
                      <div className="absolute -top-2 -left-2 bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-sm">
                          ĐANG GIỚI THIỆU
                      </div>
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
