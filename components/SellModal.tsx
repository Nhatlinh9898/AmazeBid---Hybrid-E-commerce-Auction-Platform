
import React, { useState } from 'react';
import { X, Upload, Gavel, DollarSign, Tag, Info, PlusCircle, CreditCard, Landmark, Wallet, CheckCircle2 } from 'lucide-react';
import { Product, ItemType, OrderStatus } from '../types';

interface SellModalProps {
  onClose: () => void;
  onAddProduct: (p: Product) => void;
}

const SellModal: React.FC<SellModalProps> = ({ onClose, onAddProduct }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    category: 'Electronics',
    type: ItemType.FIXED_PRICE,
    image: `https://picsum.photos/seed/${Math.random()}/400/400`,
    payoutMethod: 'BANK_TRANSFER'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.price) return;

    const newProduct: Product = {
      id: Date.now().toString(),
      title: formData.title,
      description: formData.description,
      price: parseFloat(formData.price),
      category: formData.category,
      type: formData.type,
      image: formData.image,
      rating: 5.0,
      reviewCount: 0,
      status: OrderStatus.AVAILABLE,
      sellerId: 'currentUser',
      payoutMethod: formData.payoutMethod,
      ...(formData.type === ItemType.AUCTION ? { 
        currentBid: parseFloat(formData.price), 
        bidCount: 0,
        endTime: new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString() 
      } : {})
    };
    onAddProduct(newProduct);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[250] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-md animate-in fade-in duration-300" onClick={onClose} />
      <div className="relative bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-[#131921] p-5 text-white flex justify-between items-center border-b border-gray-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#febd69] rounded-lg">
              <PlusCircle size={24} className="text-[#131921]" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Đăng bán sản phẩm</h2>
              <div className="flex items-center gap-2 text-[10px] text-gray-400 uppercase tracking-widest font-bold">
                 <span className={step === 1 ? "text-[#febd69]" : ""}>1. Thông tin</span>
                 <span>&gt;</span>
                 <span className={step === 2 ? "text-[#febd69]" : ""}>2. Thanh toán</span>
              </div>
            </div>
          </div>
          <button onClick={onClose} className="hover:bg-gray-800 p-2 rounded-full transition-colors">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto custom-scrollbar p-8">
          {step === 1 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Step 1: Product Info */}
              <div className="space-y-6">
                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase mb-2 tracking-wider">Thông tin cơ bản</label>
                  <input 
                    required
                    autoFocus
                    className="w-full border-2 border-gray-100 p-3 rounded-xl focus:border-[#febd69] focus:ring-0 outline-none transition-all placeholder:text-gray-300 text-sm font-medium"
                    placeholder="Tên sản phẩm của bạn..."
                    value={formData.title}
                    onChange={e => setFormData({...formData, title: e.target.value})}
                  />
                </div>

                <div>
                  <textarea 
                    required
                    rows={4}
                    className="w-full border-2 border-gray-100 p-3 rounded-xl focus:border-[#febd69] focus:ring-0 outline-none transition-all placeholder:text-gray-300 text-sm resize-none"
                    placeholder="Mô tả chi tiết tình trạng, tính năng..."
                    value={formData.description}
                    onChange={e => setFormData({...formData, description: e.target.value})}
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase mb-2 tracking-wider">Danh mục</label>
                  <select 
                    className="w-full border-2 border-gray-100 p-3 rounded-xl focus:border-[#febd69] outline-none transition-all text-sm font-bold bg-white"
                    value={formData.category}
                    onChange={e => setFormData({...formData, category: e.target.value})}
                  >
                    <option value="Electronics">Điện tử</option>
                    <option value="Collectibles">Đồ cổ / Sưu tầm</option>
                    <option value="Home & Office">Nhà cửa & Đời sống</option>
                    <option value="Music">Âm nhạc / Đĩa than</option>
                    <option value="Fashion">Thời trang</option>
                  </select>
                </div>
              </div>

              <div className="space-y-6">
                <div className="bg-gray-50 p-6 rounded-2xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center group hover:border-[#febd69] transition-all cursor-pointer">
                  <div className="p-3 bg-white rounded-full shadow-sm mb-3 text-gray-400 group-hover:text-[#febd69] transition-colors">
                    <Upload size={28} />
                  </div>
                  <p className="text-xs font-bold text-gray-500">Kéo thả hoặc tải ảnh lên</p>
                </div>

                <div className="bg-gray-50 p-4 rounded-xl space-y-4">
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-wider">Hình thức giao dịch</label>
                  <div className="flex p-1 bg-white rounded-lg border border-gray-200">
                    <button 
                      type="button"
                      onClick={() => setFormData({...formData, type: ItemType.FIXED_PRICE})}
                      className={`flex-1 py-2 rounded-md flex items-center justify-center gap-2 text-xs font-bold transition-all ${formData.type === ItemType.FIXED_PRICE ? 'bg-[#131921] text-white shadow-md' : 'text-gray-400 hover:bg-gray-50'}`}
                    >
                      <DollarSign size={14} /> MUA NGAY
                    </button>
                    <button 
                      type="button"
                      onClick={() => setFormData({...formData, type: ItemType.AUCTION})}
                      className={`flex-1 py-2 rounded-md flex items-center justify-center gap-2 text-xs font-bold transition-all ${formData.type === ItemType.AUCTION ? 'bg-[#febd69] text-black shadow-md' : 'text-gray-400 hover:bg-gray-50'}`}
                    >
                      <Gavel size={14} /> ĐẤU GIÁ
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase mb-2 tracking-wider">
                    {formData.type === ItemType.FIXED_PRICE ? 'Giá bán' : 'Giá khởi điểm'}
                  </label>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">$</div>
                    <input 
                      required
                      type="number"
                      className="w-full border-2 border-gray-100 p-3 pl-8 rounded-xl focus:border-[#febd69] outline-none transition-all font-bold text-xl text-[#131921]"
                      placeholder="0.00"
                      value={formData.price}
                      onChange={e => setFormData({...formData, price: e.target.value})}
                    />
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-6 animate-in slide-in-from-right">
              {/* Step 2: Payment & Payout Info */}
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex gap-3">
                <Info className="text-blue-600 shrink-0" size={20} />
                <div className="text-sm text-blue-800">
                  <p className="font-bold mb-1">Cơ chế Bảo vệ AmazeBid SafePay</p>
                  <p>Tiền của người mua sẽ được hệ thống tạm giữ. Bạn sẽ chỉ nhận được tiền sau khi người mua xác nhận đã nhận hàng thành công và không có khiếu nại trả hàng.</p>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase mb-3 tracking-wider">Chọn phương thức nhận tiền (Payout)</label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div 
                    onClick={() => setFormData({...formData, payoutMethod: 'BANK_TRANSFER'})}
                    className={`p-4 border-2 rounded-xl cursor-pointer transition-all ${formData.payoutMethod === 'BANK_TRANSFER' ? 'border-[#febd69] bg-orange-50' : 'border-gray-200 hover:border-gray-300'}`}
                  >
                    <Landmark size={24} className="mb-2 text-gray-700" />
                    <p className="font-bold text-sm">Chuyển khoản NH</p>
                    <p className="text-xs text-gray-500 mt-1">1-3 ngày làm việc</p>
                  </div>
                  <div 
                    onClick={() => setFormData({...formData, payoutMethod: 'WALLET'})}
                    className={`p-4 border-2 rounded-xl cursor-pointer transition-all ${formData.payoutMethod === 'WALLET' ? 'border-[#febd69] bg-orange-50' : 'border-gray-200 hover:border-gray-300'}`}
                  >
                    <Wallet size={24} className="mb-2 text-gray-700" />
                    <p className="font-bold text-sm">Ví điện tử</p>
                    <p className="text-xs text-gray-500 mt-1">Tức thì (Momo/ZaloPay)</p>
                  </div>
                  <div 
                    onClick={() => setFormData({...formData, payoutMethod: 'CRYPTO'})}
                    className={`p-4 border-2 rounded-xl cursor-pointer transition-all ${formData.payoutMethod === 'CRYPTO' ? 'border-[#febd69] bg-orange-50' : 'border-gray-200 hover:border-gray-300'}`}
                  >
                    <CreditCard size={24} className="mb-2 text-gray-700" />
                    <p className="font-bold text-sm">Tiền số (USDT)</p>
                    <p className="text-xs text-gray-500 mt-1">Mạng TRC20/ERC20</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                 <label className="block text-[10px] font-black text-gray-400 uppercase tracking-wider">Thông tin chi tiết</label>
                 <input 
                    className="w-full border border-gray-300 p-3 rounded-lg focus:border-[#febd69] outline-none text-sm"
                    placeholder={formData.payoutMethod === 'BANK_TRANSFER' ? "Số tài khoản - Tên ngân hàng - Chi nhánh" : "Địa chỉ ví / Số điện thoại ví"}
                  />
                  <div className="flex items-start gap-2 text-xs text-gray-500">
                    <CheckCircle2 size={14} className="text-green-600 mt-0.5" />
                    <span>Tôi đồng ý với điều khoản: Nếu có trả hàng, phí vận chuyển sẽ được trừ vào tài khoản của tôi hoặc người mua tùy theo chính sách.</span>
                  </div>
              </div>
            </div>
          )}
        </form>

        <div className="p-5 border-t border-gray-100 flex justify-between items-center bg-gray-50 shrink-0">
            {step === 2 ? (
                <button 
                  type="button"
                  onClick={() => setStep(1)}
                  className="text-gray-500 font-bold text-sm hover:text-black"
                >
                  Quay lại
                </button>
            ) : (
                <div />
            )}
            
            {step === 1 ? (
                <button 
                  type="button"
                  onClick={() => {
                      if (formData.title && formData.price) setStep(2);
                  }}
                  className="bg-[#131921] text-white px-8 py-3 rounded-xl font-bold hover:bg-black transition-all"
                >
                  Tiếp tục: Thanh toán
                </button>
            ) : (
                <button 
                  onClick={handleSubmit}
                  className="bg-[#febd69] text-black px-8 py-3 rounded-xl font-bold hover:bg-[#f3a847] shadow-lg flex items-center gap-2"
                >
                  Hoàn tất đăng bán
                </button>
            )}
        </div>
      </div>
    </div>
  );
};

export default SellModal;
