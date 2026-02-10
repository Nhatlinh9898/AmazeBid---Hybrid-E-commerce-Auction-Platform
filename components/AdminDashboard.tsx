
import React, { useState, useMemo } from 'react';
import { X, Users, DollarSign, Calendar, Filter, Shield, TrendingUp, Search, ArrowUp, ArrowDown } from 'lucide-react';
import { User, Transaction } from '../types';
import { MOCK_ALL_USERS, MOCK_TRANSACTIONS } from '../data';

interface AdminDashboardProps {
  isOpen: boolean;
  onClose: () => void;
}

type TimeRange = 'DAY' | 'WEEK' | 'MONTH' | 'QUARTER' | 'YEAR';

const AdminDashboard: React.FC<AdminDashboardProps> = ({ isOpen, onClose }) => {
  const [timeRange, setTimeRange] = useState<TimeRange>('MONTH');
  const [searchTerm, setSearchTerm] = useState('');

  // --- Logic Statistics ---
  const stats = useMemo(() => {
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfQuarter = new Date(now.getFullYear(), Math.floor(now.getMonth() / 3) * 3, 1);
    const startOfYear = new Date(now.getFullYear(), 0, 1);

    // 1. Filter Transactions by Time
    const filteredTransactions = MOCK_TRANSACTIONS.filter(t => {
      const tDate = new Date(t.timestamp);
      switch (timeRange) {
        case 'DAY': return tDate >= startOfToday;
        case 'WEEK': return tDate >= startOfWeek;
        case 'MONTH': return tDate >= startOfMonth;
        case 'QUARTER': return tDate >= startOfQuarter;
        case 'YEAR': return tDate >= startOfYear;
        default: return true;
      }
    });

    const totalRevenue = filteredTransactions.reduce((sum, t) => sum + t.amount, 0);

    // 2. Calculate Revenue Per User
    const userStats = MOCK_ALL_USERS.map(user => {
      const userTrans = filteredTransactions.filter(t => t.userId === user.id);
      const revenue = userTrans.reduce((sum, t) => sum + t.amount, 0);
      const orderCount = userTrans.length;
      return {
        ...user,
        revenue,
        orderCount
      };
    });

    // 3. Sort & Filter Users
    const processedUsers = userStats
        .filter(u => 
            u.fullName.toLowerCase().includes(searchTerm.toLowerCase()) || 
            u.email.toLowerCase().includes(searchTerm.toLowerCase())
        )
        .sort((a, b) => b.revenue - a.revenue); // Sort by revenue desc

    return {
      totalUsers: MOCK_ALL_USERS.length,
      activeUsers: MOCK_ALL_USERS.filter(u => new Date(u.joinDate).getFullYear() === 2023).length, // Mock logic
      totalRevenue,
      users: processedUsers
    };

  }, [timeRange, searchTerm]);

  const getTimeLabel = () => {
      switch(timeRange) {
          case 'DAY': return 'Hôm nay';
          case 'WEEK': return 'Tuần này';
          case 'MONTH': return 'Tháng này';
          case 'QUARTER': return 'Quý này';
          case 'YEAR': return 'Năm nay';
      }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-[#0f172a]/90 backdrop-blur-md animate-in fade-in" onClick={onClose} />
      <div className="relative bg-[#f8fafc] w-full max-w-7xl h-[90vh] rounded-3xl shadow-2xl overflow-hidden flex flex-col animate-in slide-in-from-bottom-5 border border-gray-200">
        
        {/* Header */}
        <div className="bg-white border-b border-gray-200 p-6 flex justify-between items-center shrink-0">
          <div className="flex items-center gap-4">
             <div className="bg-[#131921] p-3 rounded-xl text-white shadow-lg">
                <Shield size={28} />
             </div>
             <div>
                <h1 className="text-2xl font-black text-gray-900 tracking-tight">Admin Dashboard</h1>
                <p className="text-sm text-gray-500 font-medium">Trung tâm quản trị dữ liệu & Doanh thu</p>
             </div>
          </div>
          
          <div className="flex items-center gap-4">
              <div className="bg-gray-100 p-1 rounded-lg flex text-sm font-bold border border-gray-200">
                  {(['DAY', 'WEEK', 'MONTH', 'QUARTER', 'YEAR'] as TimeRange[]).map(r => (
                      <button
                        key={r}
                        onClick={() => setTimeRange(r)}
                        className={`px-4 py-2 rounded-md transition-all ${timeRange === r ? 'bg-white text-[#131921] shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
                      >
                          {r === 'DAY' ? 'Ngày' : r === 'WEEK' ? 'Tuần' : r === 'MONTH' ? 'Tháng' : r === 'QUARTER' ? 'Quý' : 'Năm'}
                      </button>
                  ))}
              </div>
              <button onClick={onClose} className="bg-gray-100 hover:bg-gray-200 p-3 rounded-full transition-colors text-gray-600">
                  <X size={24}/>
              </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-8">
            
            {/* Top Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-gradient-to-br from-[#131921] to-gray-800 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden">
                    <div className="absolute right-0 top-0 p-6 opacity-10"><DollarSign size={100} /></div>
                    <p className="text-gray-400 font-medium mb-1">Tổng doanh thu ({getTimeLabel()})</p>
                    <h3 className="text-4xl font-black">${stats.totalRevenue.toLocaleString()}</h3>
                    <div className="mt-4 flex items-center gap-2 text-green-400 text-sm font-bold">
                        <TrendingUp size={16} /> +12.5% so với kỳ trước
                    </div>
                </div>

                <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm relative overflow-hidden">
                    <div className="absolute right-0 top-0 p-6 opacity-5"><Users size={100} /></div>
                    <p className="text-gray-500 font-medium mb-1">Tổng người dùng</p>
                    <h3 className="text-4xl font-black text-gray-900">{stats.totalUsers}</h3>
                    <div className="mt-4 flex items-center gap-2 text-gray-400 text-sm font-bold">
                        <div className="flex -space-x-2">
                            {MOCK_ALL_USERS.slice(0,3).map(u => (
                                <img key={u.id} src={u.avatar} className="w-6 h-6 rounded-full border-2 border-white"/>
                            ))}
                        </div>
                        Tổng số user đã đăng ký
                    </div>
                </div>

                <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm relative overflow-hidden">
                    <div className="absolute right-0 top-0 p-6 opacity-5"><Calendar size={100} /></div>
                    <p className="text-gray-500 font-medium mb-1">User hoạt động mới</p>
                    <h3 className="text-4xl font-black text-blue-600">{stats.activeUsers}</h3>
                    <p className="mt-4 text-xs text-gray-400">Người dùng tham gia trong năm 2023</p>
                </div>
            </div>

            {/* Users Table */}
            <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
                <div className="p-6 border-b border-gray-200 flex justify-between items-center">
                    <h3 className="text-lg font-bold flex items-center gap-2">
                        <Users className="text-[#febd69]"/> Danh sách Người dùng & Doanh thu
                    </h3>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input 
                            placeholder="Tìm kiếm user..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:border-[#febd69] outline-none w-64"
                        />
                    </div>
                </div>
                
                <table className="w-full text-left border-collapse">
                    <thead className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider font-bold">
                        <tr>
                            <th className="p-4 border-b border-gray-100">Người dùng</th>
                            <th className="p-4 border-b border-gray-100">Vai trò</th>
                            <th className="p-4 border-b border-gray-100">Ngày tham gia</th>
                            <th className="p-4 border-b border-gray-100 text-right">Đơn hàng ({getTimeLabel()})</th>
                            <th className="p-4 border-b border-gray-100 text-right cursor-pointer hover:bg-gray-100 transition-colors">
                                Doanh thu ({getTimeLabel()}) <ArrowDown size={12} className="inline ml-1"/>
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50 text-sm text-gray-700">
                        {stats.users.map((user) => (
                            <tr key={user.id} className="hover:bg-blue-50/50 transition-colors group">
                                <td className="p-4">
                                    <div className="flex items-center gap-3">
                                        <img src={user.avatar} className="w-10 h-10 rounded-full bg-gray-200 object-cover border border-gray-200" />
                                        <div>
                                            <p className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors">{user.fullName}</p>
                                            <p className="text-xs text-gray-500">{user.email}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="p-4">
                                    <span className={`px-2 py-1 rounded text-[10px] font-bold ${user.role === 'ADMIN' ? 'bg-[#131921] text-white' : 'bg-gray-100 text-gray-600'}`}>
                                        {user.role || 'USER'}
                                    </span>
                                </td>
                                <td className="p-4 text-gray-500 font-medium">
                                    {new Date(user.joinDate).toLocaleDateString('vi-VN')}
                                </td>
                                <td className="p-4 text-right font-medium">
                                    {user.orderCount > 0 ? (
                                        <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-bold">{user.orderCount} đơn</span>
                                    ) : (
                                        <span className="text-gray-300">-</span>
                                    )}
                                </td>
                                <td className="p-4 text-right">
                                    {user.revenue > 0 ? (
                                        <span className="font-bold text-lg text-[#b12704]">${user.revenue.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                                    ) : (
                                        <span className="text-gray-300">$0.00</span>
                                    )}
                                </td>
                            </tr>
                        ))}
                         {stats.users.length === 0 && (
                             <tr>
                                 <td colSpan={5} className="p-8 text-center text-gray-400 italic">
                                     Không tìm thấy dữ liệu phù hợp.
                                 </td>
                             </tr>
                         )}
                    </tbody>
                </table>
            </div>

        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
