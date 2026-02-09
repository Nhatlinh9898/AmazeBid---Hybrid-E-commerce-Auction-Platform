
import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Sparkles, User, Bot } from 'lucide-react';
import { Message, Product } from '../types';
import { getShoppingAdvice } from '../services/geminiService';

interface GeminiAssistantProps {
  products: Product[];
}

const GeminiAssistant: React.FC<GeminiAssistantProps> = ({ products }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', text: 'Chào mừng bạn đến với AmazeBid! Tôi là Gemini Assistant. Bạn cần tìm sản phẩm mua ngay hay muốn tham gia đấu giá?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsLoading(true);

    const response = await getShoppingAdvice(userMsg, products);
    
    setMessages(prev => [...prev, { role: 'model', text: response }]);
    setIsLoading(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-[100]">
      {!isOpen ? (
        <button 
          onClick={() => setIsOpen(true)}
          className="bg-[#131921] text-white p-4 rounded-full shadow-2xl hover:scale-110 transition-transform flex items-center gap-2"
        >
          <Sparkles className="text-[#febd69]" />
          <span className="hidden md:inline font-bold">Hỏi Gemini</span>
        </button>
      ) : (
        <div className="bg-white w-[350px] sm:w-[400px] h-[500px] rounded-2xl shadow-2xl flex flex-col border border-gray-200 overflow-hidden animate-in slide-in-from-bottom-5">
          {/* Header */}
          <div className="bg-[#131921] p-4 text-white flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-[#febd69] rounded-lg">
                <Bot size={20} className="text-[#131921]" />
              </div>
              <div>
                <h3 className="font-bold text-sm">Trợ lý Mua sắm AI</h3>
                <p className="text-[10px] text-green-400">Đang trực tuyến (Gemini 3 Flash)</p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="hover:bg-gray-700 p-1 rounded">
              <X size={20} />
            </button>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] rounded-2xl p-3 text-sm shadow-sm ${
                  msg.role === 'user' 
                  ? 'bg-[#131921] text-white rounded-tr-none' 
                  : 'bg-white text-gray-800 border border-gray-200 rounded-tl-none'
                }`}>
                  <p className="whitespace-pre-wrap">{msg.text}</p>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white border border-gray-200 rounded-2xl p-3 shadow-sm rounded-tl-none flex gap-1">
                  <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <div className="p-4 border-t border-gray-100 flex gap-2 items-center">
            <input 
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Hỏi về sản phẩm..."
              className="flex-1 bg-gray-100 rounded-full px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-[#febd69]"
            />
            <button 
              onClick={handleSend}
              disabled={isLoading}
              className="bg-[#febd69] p-2 rounded-full hover:bg-orange-500 transition-colors"
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default GeminiAssistant;
