
import React, { useMemo } from 'react';
import { X, TrendingUp, DollarSign, Package, Users, BarChart3, PieChart, ArrowUpRight, Link2, ExternalLink } from 'lucide-react';
import { Product, OrderStatus } from '../types';

interface SellerDashboardProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  currentUserId: string;
}

const SellerDashboard: React.FC<SellerDashboardProps> = ({ isOpen, onClose, products, currentUserId }) => {
  // Logic tính toán thống kê
  const stats = useMemo(() => {
    // 1. Lọc sản phẩm của người bán hiện tại
    const myProducts = products.filter(p => p.sellerId === currentUserId);
    
    // 2. Phân loại theo trạng thái
    const activeListings = myProducts.filter(p => p.status === OrderStatus.AVAILABLE);
    const soldOrders = myProducts.filter(p => p.status !== OrderStatus.AVAILABLE);
    
    // 3. Tính tổng doanh thu (Gross Revenue) & Affiliate Commission
    let totalRevenue = 0;
    let affiliateRevenue = 0;
    let physicalRevenue = 0;

    soldOrders.forEach(order => {
        if (order.isAffiliate) {
            // Giả lập: Nếu là đơn Affiliate, tính hoa hồng (VD: Giá * %Hoa hồng / 100)
            const commission = (order.price * (order.commissionRate || 0)) / 100;
            affiliateRevenue += commission;
        } else {
            physicalRevenue += order.price;
        }
    });
    totalRevenue = physicalRevenue + affiliateRevenue;

    // 4. Thống kê theo danh mục (Category Breakdown)
    const categoryStats: Record<string, { count: number; revenue: number }> = {};
    
    soldOrders.forEach(order => {
        if (!categoryStats[order.category]) {
            categoryStats[order.category] = { count: 0, revenue: 0 };
        }
        categoryStats[order.category].count += 1;
        categoryStats[order.category].revenue += order.isAffiliate 
            ? (order.price * (order.commissionRate || 0)) / 100 
            : order.price;
    });

    // Chuyển object thành array để render
    const categoryList = Object.keys(categoryStats).map(cat => ({
        name: cat,
        count: categoryStats[cat].count,
        revenue: categoryStats[cat].revenue,
        percentage: (categoryStats[cat].revenue / (totalRevenue || 1)) * 100
    })).sort((a, b) => b.revenue - a.revenue);

    return {
        totalProducts: myProducts.length,
        activeCount: activeListings.length,
        soldCount: soldOrders.length,
        totalRevenue,
        affiliateRevenue,
        physicalRevenue,
        categoryList,
        recentOrders: soldOrders.slice(0, 5) // Lấy 5 đơn gần nhất
    };
  }, [products, currentUserId]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[250] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm animate-in fade-in" onClick={onClose} />
      <div className="relative bg-[#f3f4f6] w-full max-w-6xl h-[90vh] rounded-2xl shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95">
        
        {/* Header */}
        <div className="bg-[#131921] p-5 text-white flex justify-between items-center shrink-0">
          <div className="flex items-center gap-3">
            <div className="bg-[#febd69] p-2 rounded-lg text-black">
                <BarChart3 size={24} />
            </div>
            <div>
                <h2 className="text-xl font-bold">Kênh Người Bán & Thống Kê</h2>
                <p className="text-xs text-gray-400">Tổng quan hiệu suất kinh doanh của bạn</p>
            </div>
          </div>
          <button onClick={onClose} className="hover:bg-gray-700 p-2 rounded-full transition-colors"><X size={24}/></button>
        </div>

        {/* Main Scrollable Content */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-6">
            
            {/* 1. Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Total Income */}
                <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex flex-col justify-between">
                    <div className="flex justify-between items-start mb-2">
                        <div className="bg-green-100 p-2 rounded-lg text-green-700">
                            <DollarSign size={20} />
                        </div>
                        <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-full">+12.5%</span>
                    </div>
                    <div>
                        <p className="text-sm text-gray-500 font-medium">Tổng thu nhập</p>
                        <h3 className="text-2xl font-black text-gray-900">${stats.totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h3>
                    </div>
                </div>

                {/* Sales Count */}
                <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex flex-col justify-between">
                    <div className="flex justify-between items-start mb-2">
                        <div className="bg-blue-100 p-2 rounded-lg text-blue-700">
                            <Package size={20} />
                        </div>
                    </div>
                    <div>
                        <p className="text-sm text-gray-500 font-medium">Đơn hàng đã bán</p>
                        <h3 className="text-2xl font-black text-gray-900">{stats.soldCount} <span className="text-sm text-gray-400 font-normal">đơn</span></h3>
                    </div>
                </div>

                {/* Affiliate Income */}
                <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex flex-col justify-between relative overflow-hidden">
                    <div className="absolute right-0 top-0 w-16 h-16 bg-gradient-to-bl from-purple-100 to-transparent rounded-bl-full -mr-2 -mt-2"></div>
                    <div className="flex justify-between items-start mb-2 relative z-10">
                        <div className="bg-purple-100 p-2 rounded-lg text-purple-700">
                            <Link2 size={20} />
                        </div>
                        <span className="text-[10px] font-bold text-purple-600 border border-purple-200 px-2 py-1 rounded-full">Affiliate</span>
                    </div>
                    <div className="relative z-10">
                        <p className="text-sm text-gray-500 font-medium">Hoa hồng tiếp thị</p>
                        <h3 className="text-2xl font-black text-purple-700">${stats.affiliateRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h3>
                    </div>
                </div>

                {/* Active Listings */}
                <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex flex-col justify-between">
                    <div className="flex justify-between items-start mb-2">
                        <div className="bg-orange-100 p-2 rounded-lg text-orange-700">
                            <TrendingUp size={20} />
                        </div>
                    </div>
                    <div>
                        <p className="text-sm text-gray-500 font-medium">Đang niêm yết</p>
                        <h3 className="text-2xl font-black text-gray-900">{stats.activeCount} <span className="text-sm text-gray-400 font-normal">sản phẩm</span></h3>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* 2. Sales by Category (Bar Chart Visualization) */}
                <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="font-bold text-gray-900 flex items-center gap-2">
                            <PieChart size={18} className="text-[#febd69]"/> Doanh thu theo danh mục
                        </h3>
                    </div>

                    {stats.categoryList.length === 0 ? (
                        <div className="h-64 flex flex-col items-center justify-center text-gray-400 bg-gray-50 rounded-lg">
                            <BarChart3 size={48} className="mb-2 opacity-20"/>
                            <p>Chưa có dữ liệu bán hàng.</p>
                        </div>
                    ) : (
                        <div className="space-y-5">
                            {stats.categoryList.map((cat, idx) => (
                                <div key={idx}>
                                    <div className="flex justify-between text-sm mb-1">
                                        <span className="font-bold text-gray-700">{cat.name}</span>
                                        <span className="font-bold text-gray-900">${cat.revenue.toFixed(2)} ({cat.percentage.toFixed(1)}%)</span>
                                    </div>
                                    <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
                                        <div 
                                            className="bg-[#febd69] h-2.5 rounded-full transition-all duration-1000" 
                                            style={{ width: `${cat.percentage}%` }}
                                        ></div>
                                    </div>
                                    <p className="text-xs text-gray-400 mt-1">{cat.count} đơn hàng</p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* 3. Recent Transactions / Affiliate Highlight */}
                <div className="space-y-6">
                    {/* Affiliate Quick Stats */}
                    <div className="bg-gradient-to-br from-[#131921] to-black text-white p-6 rounded-xl shadow-lg relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-10">
                            <Link2 size={100} />
                        </div>
                        <h3 className="font-bold text-lg mb-1 relative z-10">Hiệu suất Affiliate</h3>
                        <p className="text-gray-400 text-sm mb-4 relative z-10">Thu nhập thụ động từ chia sẻ liên kết</p>
                        
                        <div className="space-y-3 relative z-10">
                            <div className="flex justify-between items-center border-b border-gray-700 pb-2">
                                <span className="text-sm text-gray-300">Tổng doanh số tạo ra</span>
                                {/* Giả định hoa hồng trung bình 5% để tính ngược doanh số */}
                                <span className="font-bold text-[#febd69]">${(stats.affiliateRevenue * 20).toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between items-center border-b border-gray-700 pb-2">
                                <span className="text-sm text-gray-300">Đơn hàng liên kết</span>
                                <span className="font-bold text-white">{stats.soldCount}</span>
                            </div>
                            <button className="w-full mt-2 bg-white/10 hover:bg-white/20 text-white text-xs font-bold py-2 rounded-lg transition-colors flex items-center justify-center gap-2">
                                <ExternalLink size={12}/> Xem báo cáo chi tiết mạng lưới
                            </button>
                        </div>
                    </div>

                    {/* Recent Orders List */}
                    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex-1">
                        <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <ArrowUpRight size={18} className="text-green-600"/> Đơn hàng gần đây
                        </h3>
                        {stats.recentOrders.length === 0 ? (
                            <p className="text-sm text-gray-400 italic">Chưa có đơn hàng nào.</p>
                        ) : (
                            <div className="space-y-3">
                                {stats.recentOrders.map(order => (
                                    <div key={order.id} className="flex items-center gap-3 border-b border-gray-50 pb-3 last:border-0 last:pb-0">
                                        <div className="w-10 h-10 rounded bg-gray-100 flex items-center justify-center text-gray-500 font-bold text-xs shrink-0">
                                            {order.isAffiliate ? 'AFF' : 'SALE'}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-bold text-sm truncate">{order.title}</p>
                                            <p className="text-xs text-gray-500">{new Date().toLocaleDateString()}</p>
                                        </div>
                                        <span className={`text-sm font-bold ${order.isAffiliate ? 'text-purple-600' : 'text-green-600'}`}>
                                            +${order.isAffiliate ? ((order.price * (order.commissionRate || 0)) / 100).toFixed(2) : order.price}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default SellerDashboard;
