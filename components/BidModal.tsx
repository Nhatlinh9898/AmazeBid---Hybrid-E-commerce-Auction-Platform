
import React, { useState } from 'react';
import { X, Gavel, Clock, History, Trophy, TrendingUp, AlertCircle } from 'lucide-react';
import { Product } from '../types';

interface BidModalProps {
  product: Product;
  onClose: () => void;
  onSubmitBid: (amount: number) => void;
}

const BidModal: React.FC<BidModalProps> = ({ product, onClose, onSubmitBid }) => {
  const currentBid = product.currentBid || product.price;
  const stepPrice = product.stepPrice || 10;
  const minNextBid = currentBid + stepPrice;
  
  const [bidAmount, setBidAmount] = useState<number>(minNextBid);
  const [error, setError] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (bidAmount < minNextBid) {
      setError(`Giá đấu tối thiểu phải là $${minNextBid.toFixed(2)}`);
      return;
    }
    onSubmitBid(bidAmount);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[250] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300" onClick={onClose} />
      <div className="relative bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col">
        
        {/* Header */}
        <div className="bg-[#131921] p-4 text-white flex justify-between items-center shrink-0">
          <div className="flex items-center gap-2">
             <div className="bg-[#febd69] p-1.5 rounded text-black">
                <Gavel size={20} />
             </div>
             <h2 className="font-bold text-lg">Đấu giá sản phẩm</h2>
          </div>
          <button onClick={onClose} className="hover:bg-gray-700 p-2 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
            {/* Product Summary */}
            <div className="flex gap-4 mb-6 pb-6 border-b border-gray-100">
                <img src={product.image} className="w-20 h-20 rounded-lg object-cover bg-gray-100 border border-gray-200" />
                <div>
                    <h3 className="font-bold text-gray-900 line-clamp-2">{product.title}</h3>
                    <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
                        <span className="flex items-center gap-1 bg-red-50 text-red-600 px-2 py-1 rounded font-bold">
                            <Clock size={12} /> Kết thúc: 2h 15m
                        </span>
                        <span>{product.bidCount} lượt trả giá</span>
                    </div>
                </div>
            </div>

            {/* Current Status */}
            <div className="bg-gray-50 rounded-xl p-5 mb-6 flex justify-between items-center border border-gray-200">
                <div>
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Giá hiện tại</p>
                    <p className="text-3xl font-black text-[#b12704]">${currentBid.toLocaleString()}</p>
                </div>
                <div className="text-right">
                     <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Người dẫn đầu</p>
                     <p className="text-sm font-bold flex items-center justify-end gap-1 text-gray-800">
                        <Trophy size={14} className="text-[#febd69]" /> 
                        {product.bidHistory && product.bidHistory.length > 0 
                            ? product.bidHistory[product.bidHistory.length - 1].userName 
                            : 'Chưa có'}
                     </p>
                </div>
            </div>

            {/* Bidding Form */}
            <form onSubmit={handleSubmit} className="mb-8">
                <label className="block text-sm font-bold text-gray-700 mb-2">Đặt giá thầu của bạn</label>
                <div className="relative mb-2">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-gray-400">$</div>
                    <input 
                        type="number" 
                        step={stepPrice}
                        min={minNextBid}
                        className="w-full border-2 border-gray-200 rounded-xl p-4 pl-8 text-xl font-bold focus:border-[#febd69] outline-none transition-all"
                        value={bidAmount}
                        onChange={(e) => {
                            setBidAmount(parseFloat(e.target.value));
                            setError('');
                        }}
                    />
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 flex gap-2">
                         <button 
                            type="button"
                            onClick={() => setBidAmount(currentBid + stepPrice)}
                            className="bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded text-xs font-bold transition-colors"
                         >
                            Min (+${stepPrice})
                         </button>
                         <button 
                            type="button"
                            onClick={() => setBidAmount(currentBid + stepPrice * 5)}
                            className="bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded text-xs font-bold transition-colors"
                         >
                            +${stepPrice * 5}
                         </button>
                    </div>
                </div>
                {error && (
                    <div className="text-red-500 text-xs flex items-center gap-1 mb-2 animate-in slide-in-from-top-1">
                        <AlertCircle size={12} /> {error}
                    </div>
                )}
                <p className="text-xs text-gray-500 mb-4">
                    Bước giá tối thiểu: <strong>${stepPrice}</strong>. Bạn phải đặt ít nhất <strong>${minNextBid.toLocaleString()}</strong>.
                </p>
                <button 
                    type="submit"
                    className="w-full bg-[#febd69] hover:bg-[#f3a847] text-black font-bold py-3 rounded-xl shadow-lg transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                >
                    <Gavel size={18} /> Đặt giá thầu ngay
                </button>
            </form>

            {/* Bid History */}
            <div>
                <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                    <History size={16} /> Lịch sử đấu giá
                </h4>
                <div className="border border-gray-100 rounded-xl overflow-hidden">
                    <table className="w-full text-sm">
                        <thead className="bg-gray-50 text-gray-500 font-bold border-b border-gray-100">
                            <tr>
                                <td className="p-3">Người đấu giá</td>
                                <td className="p-3 text-right">Giá</td>
                                <td className="p-3 text-right">Thời gian</td>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {product.bidHistory && [...product.bidHistory].reverse().map((bid, index) => (
                                <tr key={bid.id} className={index === 0 ? "bg-orange-50/50" : ""}>
                                    <td className="p-3 font-medium flex items-center gap-2">
                                        {index === 0 && <Trophy size={14} className="text-[#febd69]" />}
                                        {bid.userName === 'Bạn' ? <span className="text-blue-600 font-bold">Bạn</span> : bid.userName}
                                    </td>
                                    <td className={`p-3 text-right font-bold ${index === 0 ? "text-[#b12704]" : "text-gray-600"}`}>
                                        ${bid.amount.toLocaleString()}
                                    </td>
                                    <td className="p-3 text-right text-gray-400 text-xs">
                                        {new Date(bid.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                    </td>
                                </tr>
                            ))}
                            {(!product.bidHistory || product.bidHistory.length === 0) && (
                                <tr>
                                    <td colSpan={3} className="p-4 text-center text-gray-400 italic">Chưa có lượt trả giá nào. Hãy là người đầu tiên!</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default BidModal;
