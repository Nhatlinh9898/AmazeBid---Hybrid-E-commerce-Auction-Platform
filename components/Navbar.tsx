
import React from 'react';
import { Search, ShoppingCart, User, MapPin, Gavel, LayoutGrid, PlusCircle, Package } from 'lucide-react';

interface NavbarProps {
  cartCount: number;
  onSearch: (term: string) => void;
  openCart: () => void;
  openSellModal: () => void;
  openOrders: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ cartCount, onSearch, openCart, openSellModal, openOrders }) => {
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
            <p className="font-bold">Việt Nam</p>
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

        {/* Sell Button */}
        <button 
          onClick={openSellModal}
          className="hidden md:flex items-center gap-2 p-2 border-2 border-[#febd69] rounded hover:bg-[#febd69] hover:text-black transition-all group"
        >
          <PlusCircle size={20} className="text-[#febd69] group-hover:text-black" />
          <span className="font-bold text-sm">Đăng bán</span>
        </button>

        {/* Orders & Dashboard */}
        <div 
          onClick={openOrders}
          className="hidden lg:block p-2 cursor-pointer border border-transparent hover:border-white rounded"
        >
          <p className="text-xs">Quản lý</p>
          <p className="text-sm font-bold flex items-center">Đơn hàng & Ví <Package size={14} className="ml-1" /></p>
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
      <div className="bg-[#232f3e] px-4 py-1 flex items-center gap-4 text-sm font-medium">
        <div className="flex items-center gap-1 cursor-pointer hover:border-white border border-transparent p-1 rounded">
          <LayoutGrid size={18} />
          <span>Tất cả</span>
        </div>
        <span className="hover:border-white border border-transparent p-1 rounded cursor-pointer">Siêu Ưu Đãi</span>
        <span className="hover:border-white border border-transparent p-1 rounded cursor-pointer">Dịch vụ khách hàng</span>
        <span className="hover:border-white border border-transparent p-1 rounded cursor-pointer">Bán hàng</span>
        <span className="hover:border-white border border-transparent p-1 rounded cursor-pointer font-bold text-[#febd69]">Live Auctions</span>
      </div>
    </header>
  );
};

export default Navbar;
