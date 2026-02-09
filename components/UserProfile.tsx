
import React, { useState, useEffect } from 'react';
import { User, CreditCard, ShieldCheck, MapPin, Eye, EyeOff, Edit2, Plus, LogOut, Lock, X, Share2, Copy, Check, Facebook, Instagram, Chrome, Users, Link, Save, Trash2, AlertTriangle, Phone } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { PaymentMethod, SocialAccount } from '../types';

interface UserProfileProps {
  isOpen: boolean;
  onClose: () => void;
}

const UserProfile: React.FC<UserProfileProps> = ({ isOpen, onClose }) => {
  const { user, logout, updateProfile } = useAuth();
  const [activeTab, setActiveTab] = useState<'INFO' | 'PAYMENT' | 'SECURITY' | 'SOCIAL'>('INFO');
  const [showSensitive, setShowSensitive] = useState<Record<string, boolean>>({});
  const [copied, setCopied] = useState(false);
  const [friendCodeInput, setFriendCodeInput] = useState('');

  // --- CRUD States ---
  // 1. Profile Edit State
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState({ fullName: '', phone: '', address: '' });

  // 2. Payment CRUD State
  const [isAddingCard, setIsAddingCard] = useState(false);
  const [cardForm, setCardForm] = useState({ provider: 'Visa', number: '', holder: '' });

  // Init form data when user loads
  useEffect(() => {
    if (user) {
        setProfileForm({
            fullName: user.fullName || '',
            phone: user.phone || '',
            address: user.address || ''
        });
    }
  }, [user, isOpen]);

  if (!isOpen || !user) return null;

  const toggleVisibility = (id: string) => {
    setShowSensitive(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const maskedNumber = (num: string) => {
    if (!num) return '****';
    return `**** **** **** ${num.slice(-4)}`;
  };

  // --- Profile CRUD Functions ---
  const handleSaveProfile = () => {
      updateProfile({
          fullName: profileForm.fullName,
          phone: profileForm.phone,
          address: profileForm.address
      });
      setIsEditingProfile(false);
  };

  const handleCancelEdit = () => {
      setProfileForm({
          fullName: user.fullName,
          phone: user.phone || '',
          address: user.address || ''
      });
      setIsEditingProfile(false);
  };

  // --- Payment CRUD Functions ---
  const handleSaveNewCard = (e: React.FormEvent) => {
    e.preventDefault();
    if (cardForm.number.length < 4 || !cardForm.holder) return;

    const newPayment: PaymentMethod = {
        id: `pm_${Date.now()}`,
        type: 'CARD',
        providerName: cardForm.provider,
        accountNumber: cardForm.number,
        holderName: cardForm.holder.toUpperCase(),
        isDefault: user.paymentMethods.length === 0
    };
    
    updateProfile({
        paymentMethods: [...user.paymentMethods, newPayment]
    });
    
    // Reset & Close
    setCardForm({ provider: 'Visa', number: '', holder: '' });
    setIsAddingCard(false);
  };

  const handleDeletePayment = (id: string) => {
      if (confirm('Bạn có chắc chắn muốn xóa phương thức thanh toán này?')) {
          const updatedMethods = user.paymentMethods.filter(pm => pm.id !== id);
          updateProfile({ paymentMethods: updatedMethods });
      }
  };

  // --- Social Logic ---
  const toggleSocialConnection = (provider: string) => {
      const currentAccounts = user.socialAccounts || [];
      const exists = currentAccounts.find(a => a.provider === provider);
      
      let newAccounts: SocialAccount[];
      
      if (exists) {
          newAccounts = currentAccounts.map(a => 
              a.provider === provider ? { ...a, connected: !a.connected } : a
          );
      } else {
          newAccounts = [...currentAccounts, { provider: provider as any, connected: true, username: 'user_connected' }];
      }
      
      updateProfile({ socialAccounts: newAccounts });
  };

  const handleCopyCode = () => {
      if (user.referralCode) {
          navigator.clipboard.writeText(user.referralCode);
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
      }
  };

  const handleDeleteAccount = () => {
      const confirmation = prompt('Hành động này không thể hoàn tác. Nhập "DELETE" để xác nhận xóa tài khoản:');
      if (confirmation === 'DELETE') {
          alert('Tài khoản đã được xóa. Tạm biệt!');
          logout();
          onClose();
      }
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white w-full max-w-4xl h-[80vh] rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row animate-in zoom-in-95">
        
        {/* Sidebar */}
        <div className="w-full md:w-64 bg-gray-50 border-r border-gray-200 p-6 flex flex-col">
            <div className="text-center mb-6">
                <div className="w-20 h-20 mx-auto rounded-full overflow-hidden border-2 border-[#febd69] mb-3 group relative">
                    <img src={user.avatar} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 flex items-center justify-center cursor-pointer transition-opacity">
                        <Edit2 className="text-white" size={20}/>
                    </div>
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
                    onClick={() => setActiveTab('SOCIAL')}
                    className={`w-full text-left px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-3 ${activeTab === 'SOCIAL' ? 'bg-[#131921] text-white' : 'hover:bg-gray-200 text-gray-600'}`}
                >
                    <Share2 size={16} /> Mạng xã hội & Bạn bè
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
        <div className="flex-1 overflow-y-auto p-8 relative custom-scrollbar">
            <button onClick={onClose} className="absolute top-4 right-4 hover:bg-gray-100 p-2 rounded-full"><X size={20}/></button>

            {/* TAB: INFO (READ & UPDATE) */}
            {activeTab === 'INFO' && (
                <div className="space-y-6 animate-in slide-in-from-right-4">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold">Thông tin cá nhân</h2>
                        {!isEditingProfile ? (
                             <button 
                                onClick={() => setIsEditingProfile(true)}
                                className="text-sm font-bold text-blue-600 bg-blue-50 px-4 py-2 rounded-lg hover:bg-blue-100 flex items-center gap-2"
                             >
                                <Edit2 size={16} /> Chỉnh sửa
                             </button>
                        ) : (
                            <div className="flex gap-2">
                                <button 
                                    onClick={handleCancelEdit}
                                    className="text-sm font-bold text-gray-600 bg-gray-100 px-4 py-2 rounded-lg hover:bg-gray-200"
                                >
                                    Hủy
                                </button>
                                <button 
                                    onClick={handleSaveProfile}
                                    className="text-sm font-bold text-white bg-green-600 px-4 py-2 rounded-lg hover:bg-green-700 flex items-center gap-2"
                                >
                                    <Save size={16} /> Lưu lại
                                </button>
                            </div>
                        )}
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Họ và tên</label>
                            {isEditingProfile ? (
                                <input 
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:border-[#febd69] outline-none"
                                    value={profileForm.fullName}
                                    onChange={e => setProfileForm({...profileForm, fullName: e.target.value})}
                                />
                            ) : (
                                <div className="p-3 bg-gray-50 rounded-lg font-medium border border-gray-200">{user.fullName}</div>
                            )}
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Email (Không thể thay đổi)</label>
                            <div className="p-3 bg-gray-100 rounded-lg font-medium border border-gray-200 text-gray-500 cursor-not-allowed">
                                {user.email}
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Số điện thoại</label>
                            {isEditingProfile ? (
                                <div className="relative">
                                    <Phone size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"/>
                                    <input 
                                        className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:border-[#febd69] outline-none"
                                        value={profileForm.phone}
                                        placeholder="Thêm số điện thoại"
                                        onChange={e => setProfileForm({...profileForm, phone: e.target.value})}
                                    />
                                </div>
                            ) : (
                                <div className="p-3 bg-gray-50 rounded-lg font-medium border border-gray-200">
                                    {user.phone || <span className="text-gray-400 italic">Chưa cập nhật</span>}
                                </div>
                            )}
                        </div>

                        <div className="md:col-span-2">
                             <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Địa chỉ giao hàng</label>
                             {isEditingProfile ? (
                                 <div className="relative">
                                     <MapPin size={18} className="absolute left-3 top-3 text-gray-400"/>
                                     <textarea 
                                        className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:border-[#febd69] outline-none resize-none"
                                        rows={3}
                                        value={profileForm.address}
                                        placeholder="Nhập địa chỉ đầy đủ..."
                                        onChange={e => setProfileForm({...profileForm, address: e.target.value})}
                                    />
                                 </div>
                             ) : (
                                 <div className="p-3 bg-gray-50 rounded-lg font-medium border border-gray-200 flex items-start gap-2">
                                     <MapPin size={18} className="text-gray-400 mt-0.5 shrink-0"/>
                                     {user.address || <span className="text-gray-400 italic">Chưa cập nhật địa chỉ</span>}
                                 </div>
                             )}
                        </div>
                    </div>
                </div>
            )}

            {/* TAB: PAYMENT (CREATE, READ, DELETE) */}
            {activeTab === 'PAYMENT' && (
                <div className="space-y-6 animate-in slide-in-from-right-4">
                     <h2 className="text-2xl font-bold mb-2">Tài khoản & Thanh toán</h2>
                     <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 flex gap-3 items-start">
                        <ShieldCheck className="text-blue-600 shrink-0 mt-1" />
                        <div className="text-sm text-blue-800">
                            <p className="font-bold">AmazeBid Secure Vault</p>
                            <p>Thông tin được mã hóa E2EE. Quản lý các thẻ thanh toán của bạn tại đây.</p>
                        </div>
                     </div>

                     <div className="space-y-4 mt-6">
                        {/* List Existing Cards */}
                        {user.paymentMethods.length === 0 && !isAddingCard ? (
                            <p className="text-gray-400 italic text-center py-4">Chưa có phương thức thanh toán nào.</p>
                        ) : (
                            user.paymentMethods.map(pm => (
                                <div key={pm.id} className="border border-gray-200 rounded-xl p-5 hover:shadow-md transition-shadow group">
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
                                        <div className="flex items-center gap-2">
                                            {pm.isDefault && (
                                                <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-[10px] font-bold">Mặc định</span>
                                            )}
                                            <button 
                                                onClick={() => handleDeletePayment(pm.id)}
                                                className="p-1.5 text-gray-300 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                                                title="Xóa thẻ"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
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

                        {/* Add New Card Form */}
                        {isAddingCard ? (
                            <form onSubmit={handleSaveNewCard} className="border-2 border-dashed border-[#febd69] bg-orange-50/30 rounded-xl p-6 space-y-4 animate-in fade-in slide-in-from-bottom-2">
                                <h3 className="font-bold text-gray-900">Thêm thẻ mới</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 mb-1">Loại thẻ</label>
                                        <select 
                                            className="w-full p-2 border border-gray-300 rounded bg-white"
                                            value={cardForm.provider}
                                            onChange={e => setCardForm({...cardForm, provider: e.target.value})}
                                        >
                                            <option value="Visa">Visa</option>
                                            <option value="Mastercard">Mastercard</option>
                                            <option value="JCB">JCB</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 mb-1">Tên chủ thẻ</label>
                                        <input 
                                            className="w-full p-2 border border-gray-300 rounded uppercase" 
                                            placeholder="NGUYEN VAN A"
                                            required
                                            value={cardForm.holder}
                                            onChange={e => setCardForm({...cardForm, holder: e.target.value})}
                                        />
                                    </div>
                                    <div className="col-span-2">
                                        <label className="block text-xs font-bold text-gray-500 mb-1">Số thẻ</label>
                                        <input 
                                            className="w-full p-2 border border-gray-300 rounded font-mono" 
                                            placeholder="0000 0000 0000 0000"
                                            required
                                            minLength={12}
                                            maxLength={19}
                                            value={cardForm.number}
                                            onChange={e => setCardForm({...cardForm, number: e.target.value})}
                                        />
                                    </div>
                                </div>
                                <div className="flex justify-end gap-2">
                                    <button 
                                        type="button" 
                                        onClick={() => setIsAddingCard(false)}
                                        className="px-4 py-2 text-sm font-bold text-gray-600 hover:bg-gray-200 rounded"
                                    >
                                        Hủy
                                    </button>
                                    <button 
                                        type="submit"
                                        className="px-6 py-2 text-sm font-bold text-black bg-[#febd69] hover:bg-[#f3a847] rounded shadow-sm"
                                    >
                                        Thêm thẻ
                                    </button>
                                </div>
                            </form>
                        ) : (
                            <button 
                                onClick={() => setIsAddingCard(true)}
                                className="w-full py-4 border-2 border-dashed border-gray-300 rounded-xl text-gray-500 font-bold hover:border-[#febd69] hover:text-[#febd69] hover:bg-orange-50 transition-all flex items-center justify-center gap-2"
                            >
                                <Plus size={20} /> Thêm tài khoản ngân hàng / Thẻ mới
                            </button>
                        )}
                     </div>
                </div>
            )}

            {/* TAB: SOCIAL (UNCHANGED LOGIC) */}
            {activeTab === 'SOCIAL' && (
                <div className="space-y-8 animate-in slide-in-from-right-4">
                    <div>
                        <h2 className="text-2xl font-bold mb-4">Liên kết Mạng xã hội</h2>
                        <p className="text-sm text-gray-500 mb-4">Kết nối tài khoản để đăng nhập nhanh hơn và chia sẻ sản phẩm dễ dàng.</p>
                        
                        <div className="space-y-3">
                            {[
                                { id: 'facebook', name: 'Facebook', icon: Facebook, color: 'text-blue-600' },
                                { id: 'google', name: 'Google', icon: Chrome, color: 'text-red-500' },
                                { id: 'instagram', name: 'Instagram', icon: Instagram, color: 'text-pink-600' }
                            ].map(platform => {
                                const account = user.socialAccounts?.find(a => a.provider === platform.id);
                                const isConnected = account?.connected;

                                return (
                                    <div key={platform.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-xl bg-white hover:bg-gray-50 transition-colors">
                                        <div className="flex items-center gap-3">
                                            <div className={`p-2 rounded-full bg-gray-100 ${platform.color}`}>
                                                <platform.icon size={20} />
                                            </div>
                                            <div>
                                                <p className="font-bold text-gray-900">{platform.name}</p>
                                                <p className="text-xs text-gray-500">
                                                    {isConnected ? (account?.username || 'Đã kết nối') : 'Chưa kết nối'}
                                                </p>
                                            </div>
                                        </div>
                                        <button 
                                            onClick={() => toggleSocialConnection(platform.id)}
                                            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                                                isConnected 
                                                ? 'bg-red-50 text-red-600 hover:bg-red-100' 
                                                : 'bg-blue-50 text-blue-600 hover:bg-blue-100'
                                            }`}
                                        >
                                            {isConnected ? 'Hủy liên kết' : 'Kết nối ngay'}
                                        </button>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    <div className="border-t border-gray-200 pt-6">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-2xl font-bold">Giới thiệu bạn bè</h2>
                            <div className="flex items-center gap-2 px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold">
                                <Users size={14} /> {user.friendCount || 0} Bạn bè
                            </div>
                        </div>
                        
                        <div className="bg-gradient-to-r from-orange-50 to-white p-6 rounded-2xl border border-orange-100 mb-6">
                            <h3 className="font-bold text-gray-900 mb-2">Mã giới thiệu của bạn</h3>
                            <p className="text-sm text-gray-500 mb-4">Chia sẻ mã này để nhận điểm thưởng khi bạn bè đăng ký!</p>
                            
                            <div className="flex gap-2">
                                <div className="flex-1 bg-white border-2 border-dashed border-gray-300 rounded-xl flex items-center justify-center p-3 font-mono font-bold text-lg tracking-widest text-[#131921]">
                                    {user.referralCode || '----'}
                                </div>
                                <button 
                                    onClick={handleCopyCode}
                                    className="bg-[#131921] text-white px-6 rounded-xl font-bold hover:bg-black transition-all flex items-center gap-2 min-w-[120px] justify-center"
                                >
                                    {copied ? <Check size={18} className="text-green-400"/> : <Copy size={18} />}
                                    {copied ? 'Đã chép' : 'Sao chép'}
                                </button>
                            </div>
                        </div>

                        <div>
                            <h3 className="font-bold text-sm text-gray-700 mb-2">Nhập mã giới thiệu từ bạn bè</h3>
                            <div className="flex gap-2">
                                <input 
                                    value={friendCodeInput}
                                    onChange={(e) => setFriendCodeInput(e.target.value.toUpperCase())}
                                    placeholder="Nhập mã (VD: AMAZE-X-999)"
                                    className="flex-1 border border-gray-300 rounded-lg px-4 py-2 text-sm uppercase focus:border-[#febd69] outline-none"
                                />
                                <button className="bg-gray-200 text-gray-700 font-bold px-4 rounded-lg text-sm hover:bg-gray-300 flex items-center gap-1">
                                    <Link size={14} /> Liên kết
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* TAB: SECURITY (DELETE ACCOUNT) */}
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

                    <div className="mt-8 border-t border-red-100 pt-6">
                        <h3 className="text-red-600 font-bold mb-2 flex items-center gap-2">
                            <AlertTriangle size={18}/> Vùng nguy hiểm
                        </h3>
                        <div className="bg-red-50 border border-red-100 rounded-xl p-5">
                            <p className="font-bold text-gray-900 mb-1">Xóa tài khoản</p>
                            <p className="text-sm text-gray-600 mb-4">
                                Một khi bạn xóa tài khoản, tất cả dữ liệu sẽ bị mất vĩnh viễn và không thể khôi phục.
                            </p>
                            <button 
                                onClick={handleDeleteAccount}
                                className="bg-white border border-red-200 text-red-600 font-bold px-4 py-2 rounded-lg hover:bg-red-600 hover:text-white transition-colors text-sm"
                            >
                                Xóa tài khoản này
                            </button>
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
