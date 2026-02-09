
import React, { useState } from 'react';
import { User, CreditCard, ShieldCheck, MapPin, Eye, EyeOff, Edit2, Plus, LogOut, Lock, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { PaymentMethod } from '../types';

interface UserProfileProps {
  isOpen: boolean;
  onClose: () => void;
}

const UserProfile: React.FC<UserProfileProps> = ({ isOpen, onClose }) => {
  const { user, logout, updateProfile } = useAuth();
  const [activeTab, setActiveTab] = useState<'INFO' | 'PAYMENT' | 'SECURITY'>('INFO');
  const [showSensitive, setShowSensitive] = useState<Record<string, boolean>>({});

  if (!isOpen || !user) return null;

  const toggleVisibility = (id: string) => {
    setShowSensitive(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const maskedNumber = (num: string) => {
    return `**** **** **** ${num.slice(-4)}`;
  };

  const handleAddPayment = () => {
    // Mock adding a payment method
    const newPayment: PaymentMethod = {
        id: `pm_${Date.now()}`,
        type: 'CARD',
        providerName: 'Visa Debit',
        accountNumber: '4242424242428888',
        holderName: user.fullName.toUpperCase(),
        isDefault: false
    };
    updateProfile({
        paymentMethods: [...user.paymentMethods, newPayment]
    });
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white w-full max-w-4xl h-[80vh] rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row animate-in zoom-in-95">
        
        {/* Sidebar */}
        <div className="w-full md:w-64 bg-gray-50 border-r border-gray-200 p-6 flex flex-col">
            <div className="text-center mb-6">
                <div className="w-20 h-20 mx-auto rounded-full overflow-hidden border-2 border-[#febd69] mb-3">
                    <img src={user.avatar} className="w-full h-full object-cover" />
                </div>
                <h3 className="font-bold text-lg">{user.fullName}</h3>
                <p className="text-xs text-gray-500">{user.email}</p>
                <div className="mt-2 inline-flex items-center gap-1 px-2 py-0.5 bg-green-100 text-green-700 rounded text-[10px] font-bold">
                    <ShieldCheck size={10} /> Verified
                </div>
            </div>

            <nav className="space-y-2 flex-1">
                <button 
                    onClick={() => setActiveTab('INFO')}
                    className={`w-full text-left px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-3 ${activeTab === 'INFO' ? 'bg-[#131921] text-white' : 'hover:bg-gray-200 text-gray-600'}`}
                >
                    <User size={16} /> Thông tin cá nhân
                </button>
                <button 
                    onClick={() => setActiveTab('PAYMENT')}
                    className={`w-full text-left px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-3 ${activeTab === 'PAYMENT' ? 'bg-[#131921] text-white' : 'hover:bg-gray-200 text-gray-600'}`}
                >
                    <CreditCard size={16} /> Tài khoản thanh toán
                </button>
                <button 
                    onClick={() => setActiveTab('SECURITY')}
                    className={`w-full text-left px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-3 ${activeTab === 'SECURITY' ? 'bg-[#131921] text-white' : 'hover:bg-gray-200 text-gray-600'}`}
                >
                    <Lock size={16} /> Bảo mật & Riêng tư
                </button>
            </nav>

            <button 
                onClick={() => { logout(); onClose(); }}
                className="mt-auto flex items-center gap-2 text-red-600 hover:bg-red-50 px-4 py-2 rounded-lg text-sm font-bold transition-colors"
            >
                <LogOut size={16} /> Đăng xuất
            </button>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto p-8 relative">
            <button onClick={onClose} className="absolute top-4 right-4 hover:bg-gray-100 p-2 rounded-full"><X size={20}/></button>

            {activeTab === 'INFO' && (
                <div className="space-y-6 animate-in slide-in-from-right-4">
                    <h2 className="text-2xl font-bold mb-6">Thông tin cá nhân</h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Họ và tên</label>
                            <input 
                                className="w-full p-3 border border-gray-200 rounded-lg bg-gray-50 font-medium"
                                value={user.fullName}
                                readOnly
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Email</label>
                            <input 
                                className="w-full p-3 border border-gray-200 rounded-lg bg-gray-50 font-medium text-gray-500"
                                value={user.email}
                                readOnly
                            />
                        </div>
                        <div className="md:col-span-2">
                             <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Địa chỉ giao hàng</label>
                             <div className="flex gap-2">
                                <input 
                                    className="flex-1 p-3 border border-gray-200 rounded-lg font-medium"
                                    placeholder="Chưa cập nhật địa chỉ"
                                    value={user.address || ''}
                                    onChange={(e) => updateProfile({ address: e.target.value })}
                                />
                                <button className="bg-[#febd69] p-3 rounded-lg hover:bg-[#f3a847] text-black">
                                    <Edit2 size={18} />
                                </button>
                             </div>
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'PAYMENT' && (
                <div className="space-y-6 animate-in slide-in-from-right-4">
                     <h2 className="text-2xl font-bold mb-2">Tài khoản & Thanh toán</h2>
                     <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 flex gap-3 items-start">
                        <ShieldCheck className="text-blue-600 shrink-0 mt-1" />
                        <div className="text-sm text-blue-800">
                            <p className="font-bold">AmazeBid Secure Vault</p>
                            <p>Thông tin tài khoản của bạn được mã hóa đầu cuối (E2EE) và không bao giờ được chia sẻ với người bán. Chúng tôi sử dụng phương thức che giấu dữ liệu để bảo vệ bạn khỏi việc bị nhìn trộm.</p>
                        </div>
                     </div>

                     <div className="space-y-4 mt-6">
                        {user.paymentMethods.length === 0 ? (
                            <p className="text-gray-400 italic">Chưa có phương thức thanh toán nào.</p>
                        ) : (
                            user.paymentMethods.map(pm => (
                                <div key={pm.id} className="border border-gray-200 rounded-xl p-5 hover:shadow-md transition-shadow">
                                    <div className="flex justify-between items-start">
                                        <div className="flex items-center gap-3">
                                            <div className="bg-gray-100 p-2 rounded-lg">
                                                {pm.type === 'BANK' ? <LandmarkIcon /> : <CreditCard />}
                                            </div>
                                            <div>
                                                <p className="font-bold text-gray-900">{pm.providerName}</p>
                                                <p className="text-xs text-gray-500 uppercase font-bold">{pm.type} - {pm.holderName}</p>
                                            </div>
                                        </div>
                                        {pm.isDefault && (
                                            <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-[10px] font-bold">Mặc định</span>
                                        )}
                                    </div>
                                    
                                    <div className="mt-4 flex items-center justify-between bg-gray-50 p-3 rounded-lg border border-gray-100">
                                        <span className="font-mono text-lg tracking-widest text-gray-700">
                                            {showSensitive[pm.id] ? pm.accountNumber : maskedNumber(pm.accountNumber)}
                                        </span>
                                        <button 
                                            onClick={() => toggleVisibility(pm.id)}
                                            className="text-gray-400 hover:text-[#131921] transition-colors"
                                            title={showSensitive[pm.id] ? "Che đi" : "Hiển thị"}
                                        >
                                            {showSensitive[pm.id] ? <EyeOff size={18} /> : <Eye size={18} />}
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}

                        <button 
                            onClick={handleAddPayment}
                            className="w-full py-4 border-2 border-dashed border-gray-300 rounded-xl text-gray-500 font-bold hover:border-[#febd69] hover:text-[#febd69] hover:bg-orange-50 transition-all flex items-center justify-center gap-2"
                        >
                            <Plus size={20} /> Thêm tài khoản ngân hàng / Thẻ mới
                        </button>
                     </div>
                </div>
            )}

            {activeTab === 'SECURITY' && (
                <div className="space-y-6 animate-in slide-in-from-right-4">
                    <h2 className="text-2xl font-bold mb-6">Bảo mật</h2>
                    <div className="space-y-4">
                        <div className="flex justify-between items-center p-4 border rounded-xl">
                            <div>
                                <p className="font-bold">Đổi mật khẩu</p>
                                <p className="text-xs text-gray-500">Lần cuối thay đổi: 3 tháng trước</p>
                            </div>
                            <button className="text-blue-600 font-bold text-sm hover:underline">Cập nhật</button>
                        </div>
                        <div className="flex justify-between items-center p-4 border rounded-xl">
                            <div>
                                <p className="font-bold">Xác thực 2 bước (2FA)</p>
                                <p className="text-xs text-gray-500">Bảo vệ tài khoản bằng mã OTP</p>
                            </div>
                            <div className="relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in">
                                <input type="checkbox" name="toggle" id="toggle" className="toggle-checkbox absolute block w-5 h-5 rounded-full bg-white border-4 appearance-none cursor-pointer border-gray-300"/>
                                <label htmlFor="toggle" className="toggle-label block overflow-hidden h-5 rounded-full bg-gray-300 cursor-pointer"></label>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

const LandmarkIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" x2="21" y1="22" y2="22"/><line x1="6" x2="6" y1="18" y2="11"/><line x1="10" x2="10" y1="18" y2="11"/><line x1="14" x2="14" y1="18" y2="11"/><line x1="18" x2="18" y1="18" y2="11"/><polygon points="12 2 20 7 4 7"/></svg>
)

export default UserProfile;
