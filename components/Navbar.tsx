
import React, { useState } from 'react';
import { Search, ShoppingCart, User as UserIcon, MapPin, Gavel, LayoutGrid, PlusCircle, Package, Video, LogIn, ChevronDown, Sparkles, Zap, BarChart3, Shield } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface NavbarProps {
  cartCount: number;
  onSearch: (term: string) => void;
  openCart: () => void;
  openSellModal: () => void;
  openOrders: () => void;
  onOpenLiveStudio: () => void;
  onViewLiveStreams: () => void;
  onOpenAuth: () => void;
  onOpenProfile: () => void;
  onOpenCustomerService: () => void;
  onOpenContentStudio: () => void;
  onOpenSuperDeals: () => void;
  onOpenSellerDashboard: () => void;
  onOpenAdminDashboard: () => void; // New Prop
}

const Navbar: React.FC<NavbarProps> = ({ 
  cartCount, onSearch, openCart, openSellModal, openOrders, 
  onOpenLiveStudio, onViewLiveStreams, onOpenAuth, onOpenProfile, onOpenCustomerService, onOpenContentStudio, onOpenSuperDeals, onOpenSellerDashboard, onOpenAdminDashboard
}) => {
  const { user } = useAuth();
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  return (
    <header className="bg-[#131921] text-white sticky top-0 z-50">
      {/* Top Bar */}
      <div className="max-w-[1500px] mx-auto flex items-center p-2 gap-4">
        {/* Logo */}
        <div className="flex items-center cursor-pointer p-2 border border-transparent hover:border-white rounded" onClick={() => window.location.reload()}>
          <span className="text-2xl font-bold italic flex items-center gap-1">
            <Gavel className="text-[#febd69]" /> Amaze<span className="text-[#febd69]">Bid</span>
          </span>
        </div>

        {/* Deliver to */}
        <div className="hidden md:flex items-center gap-1 p-2 cursor-pointer border border-transparent hover:border-white rounded">
          <MapPin size={18} />
          <div className="text-xs">
            <p className="text-gray-400">Giao đến</p>
            <p className="font-bold">{user?.address ? 'Nhà riêng' : 'Việt Nam'}</p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="flex-1 flex h-10 items-stretch">
          <select className="bg-gray-100 text-black text-sm px-3 rounded-l border-r border-gray-300 outline-none focus:ring-2 focus:ring-[#febd69]">
            <option>Tất cả</option>
            <option>Đấu giá</option>
            <option>Mua ngay</option>
            <option>Điện tử</option>
          </select>
          <input 
            type="text" 
            placeholder="Tìm kiếm sản phẩm hoặc phiên đấu giá..."
            className="flex-1 px-4 text-black outline-none"
            onChange={(e) => onSearch(e.target.value)}
          />
          <button className="bg-[#febd69] hover:bg-[#f3a847] px-5 rounded-r text-black">
            <Search size={20} />
          </button>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
            {/* Go Live Button */}
            <button 
            onClick={onOpenLiveStudio}
            className="hidden md:flex items-center gap-2 p-2 border border-gray-600 rounded hover:border-[#febd69] hover:text-[#febd69] transition-all"
            title="AmazeLive Studio"
            >
            <Video size={20} />
            <span className="font-bold text-sm">Live Studio</span>
            </button>

            {/* Sell Button */}
            <button 
            onClick={user ? openSellModal : onOpenAuth}
            className="hidden md:flex items-center gap-2 p-2 border-2 border-[#febd69] rounded hover:bg-[#febd69] hover:text-black transition-all group"
            >
            <PlusCircle size={20} className="text-[#febd69] group-hover:text-black" />
            <span className="font-bold text-sm">Đăng bán</span>
            </button>
        </div>

        {/* User Account / Login */}
        <div 
            onClick={user ? onOpenProfile : onOpenAuth}
            className="hidden lg:flex items-center gap-2 p-2 cursor-pointer border border-transparent hover:border-white rounded"
        >
            {user ? (
                <>
                    <img src={user.avatar} className="w-8 h-8 rounded-full border border-gray-500" />
                    <div className="text-xs">
                        <p className="text-gray-400">Xin chào,</p>
                        <p className="font-bold truncate max-w-[80px]">{user.fullName.split(' ').pop()}</p>
                    </div>
                </>
            ) : (
                <>
                    <UserIcon size={24} />
                    <div className="text-xs">
                        <p className="text-gray-400">Xin chào, khách</p>
                        <p className="font-bold">Đăng nhập</p>
                    </div>
                </>
            )}
        </div>

        {/* Orders & Dashboard (Restored for all users) */}
        <div 
            onClick={user ? openOrders : onOpenAuth}
            className="hidden lg:block p-2 cursor-pointer border border-transparent hover:border-white rounded"
        >
            <p className="text-xs">Trả hàng &</p>
            <p className="text-sm font-bold flex items-center">Đơn hàng <Package size={14} className="ml-1" /></p>
        </div>

        {/* Cart */}
        <div 
          onClick={openCart}
          className="flex items-end gap-1 p-2 cursor-pointer border border-transparent hover:border-white rounded relative"
        >
          <div className="relative">
            <span className="absolute -top-2 left-3 bg-[#febd69] text-black text-xs font-bold px-1.5 rounded-full">
              {cartCount}
            </span>
            <ShoppingCart size={28} />
          </div>
          <span className="font-bold hidden sm:inline">Giỏ hàng</span>
        </div>
      </div>

      {/* Sub-Nav */}
      <div className="bg-[#232f3e] px-4 py-1 flex items-center gap-4 text-sm font-medium overflow-x-auto no-scrollbar">
        <div className="flex items-center gap-1 cursor-pointer hover:border-white border border-transparent p-1 rounded">
          <LayoutGrid size={18} />
          <span>Tất cả</span>
        </div>
        
        {/* Admin Dashboard - Demo Access */}
        <span 
            onClick={onOpenAdminDashboard}
            className="hover:border-white border border-transparent p-1 rounded cursor-pointer font-bold text-red-400 flex items-center gap-1"
            title="Dành cho Quản trị viên"
        >
            <Shield size={14} /> Admin
        </span>

        {/* Seller Channel Button */}
        <span 
            onClick={user ? onOpenSellerDashboard : onOpenAuth}
            className="hover:border-white border border-transparent p-1 rounded cursor-pointer font-bold text-white flex items-center gap-1"
        >
            <BarChart3 size={14} className="text-[#febd69]" /> Kênh Người Bán
        </span>

        <span 
            onClick={onViewLiveStreams}
            className="hover:border-white border border-transparent p-1 rounded cursor-pointer font-bold text-[#febd69] flex items-center gap-1"
        >
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
            Live Auctions
        </span>
        <span 
            onClick={user ? onOpenContentStudio : onOpenAuth}
            className="hover:border-white border border-transparent p-1 rounded cursor-pointer flex items-center gap-1 text-blue-300 font-bold"
        >
            <Sparkles size={14} /> Studio Sáng tạo (AI)
        </span>
        <span 
            onClick={onOpenSuperDeals}
            className="hover:border-white border border-transparent p-1 rounded cursor-pointer text-red-400 font-bold flex items-center gap-1"
        >
            <Zap size={14} className="animate-pulse" /> Siêu Ưu Đãi
        </span>
        <span 
            onClick={onOpenCustomerService}
            className="hover:border-white border border-transparent p-1 rounded cursor-pointer"
        >
            Dịch vụ khách hàng
        </span>
      </div>
    </header>
  );
};

export default Navbar;