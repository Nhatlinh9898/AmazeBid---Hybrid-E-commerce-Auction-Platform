
import React from 'react';
import { Package, Truck, CheckCircle, AlertTriangle, X, RefreshCw, Box, Gavel, ShoppingBag, Trash2 } from 'lucide-react';
import { Product, OrderStatus, ItemType } from '../types';

interface OrderDashboardProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  currentUserId: string; // "currentUser"
  onUpdateStatus: (productId: string, newStatus: OrderStatus) => void;
}

const OrderDashboard: React.FC<OrderDashboardProps> = ({ 
  isOpen, onClose, products, currentUserId, onUpdateStatus 
}) => {
  if (!isOpen) return null;

  // Filter products
  const mySales = products.filter(p => p.sellerId === currentUserId && p.status !== OrderStatus.AVAILABLE);
  const myPurchases = products.filter(p => p.sellerId !== currentUserId && p.status !== OrderStatus.AVAILABLE);
  const myInventory = products.filter(p => p.sellerId === currentUserId && p.status === OrderStatus.AVAILABLE);

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.PENDING_SHIPMENT:
        return <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded font-bold flex items-center gap-1"><AlertTriangle size={12}/> Chờ gửi hàng</span>;
      case OrderStatus.SHIPPED:
        return <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded font-bold flex items-center gap-1"><Truck size={12}/> Đang giao</span>;
      case OrderStatus.DELIVERED:
        return <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded font-bold flex items-center gap-1"><Package size={12}/> Đã nhận</span>;
      case OrderStatus.COMPLETED:
        return <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded font-bold flex items-center gap-1"><CheckCircle size={12}/> Hoàn tất</span>;
      case OrderStatus.RETURNED:
        return <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded font-bold flex items-center gap-1"><RefreshCw size={12}/> Trả hàng</span>;
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white w-full max-w-4xl h-[85vh] rounded-xl shadow-2xl overflow-hidden flex flex-col">
        <div className="bg-[#131921] p-4 text-white flex justify-between items-center shrink-0">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Package className="text-[#febd69]" /> Quản lý Đơn hàng & Kho hàng
          </h2>
          <button onClick={onClose} className="hover:bg-gray-700 p-1 rounded"><X size={24} /></button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 bg-gray-50 custom-scrollbar">
          
          {/* Inventory Section (New) */}
          <div className="mb-8">
             <h3 className="text-lg font-bold mb-4 flex items-center gap-2 border-b pb-2 border-gray-200 text-gray-800">
              <span className="bg-purple-100 text-purple-800 w-6 h-6 rounded-full flex items-center justify-center text-xs border border-purple-200">
                <Box size={14}/>
              </span>
              Kho hàng của tôi ({myInventory.length})
            </h3>
            {myInventory.length === 0 ? (
                 <div className="bg-white p-6 rounded-xl border border-dashed border-gray-300 text-center text-gray-400">
                    <p>Kho hàng trống. Hãy đăng bán sản phẩm để thấy ở đây.</p>
                 </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {myInventory.map(item => (
                        <div key={item.id} className="bg-white p-3 rounded-lg shadow-sm border border-gray-200 flex items-center gap-3">
                            <img src={item.image} className="w-12 h-12 object-cover rounded bg-gray-100" />
                            <div className="flex-1 min-w-0">
                                <h4 className="font-bold text-sm truncate">{item.title}</h4>
                                <div className="flex items-center gap-2 text-xs mt-1">
                                    <span className="font-bold text-[#b12704]">${item.price}</span>
                                    {item.type === ItemType.AUCTION ? (
                                        <span className="text-red-600 bg-red-50 px-1.5 py-0.5 rounded flex items-center gap-0.5"><Gavel size={10}/> Đấu giá</span>
                                    ) : (
                                        <span className="text-green-600 bg-green-50 px-1.5 py-0.5 rounded flex items-center gap-0.5"><ShoppingBag size={10}/> Mua ngay</span>
                                    )}
                                </div>
                            </div>
                            <button className="text-gray-400 hover:text-red-500 p-2" title="Xóa">
                                <Trash2 size={16} />
                            </button>
                        </div>
                    ))}
                </div>
            )}
          </div>

          {/* Sales Section */}
          <div className="mb-8">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2 border-b pb-2 border-gray-200 text-gray-800">
              <span className="bg-[#febd69] text-black w-6 h-6 rounded-full flex items-center justify-center text-xs">S</span>
              Đơn bán hàng (Doanh thu tạm giữ: ${mySales.reduce((sum, p) => p.status !== OrderStatus.COMPLETED ? sum + p.price : sum, 0).toFixed(2)})
            </h3>
            
            {mySales.length === 0 ? (
              <p className="text-gray-400 text-sm italic ml-2">Chưa có đơn hàng nào cần xử lý.</p>
            ) : (
              <div className="space-y-4">
                {mySales.map(item => (
                  <div key={item.id} className="bg-white p-4 rounded-lg shadow border border-gray-200 flex flex-col md:flex-row gap-4 items-center">
                    <img src={item.image} className="w-16 h-16 object-cover rounded bg-gray-100" />
                    <div className="flex-1">
                      <div className="flex justify-between mb-1">
                        <h4 className="font-bold text-sm">{item.title}</h4>
                        <span className="font-bold text-green-600">+${item.price}</span>
                      </div>
                      <div className="text-xs text-gray-500 mb-2">Thanh toán qua: {item.payoutMethod || 'Bank Transfer'}</div>
                      <div className="flex items-center gap-2">
                         {getStatusBadge(item.status)}
                         <span className="text-[10px] text-gray-400">ID: {item.id}</span>
                      </div>
                    </div>
                    
                    {/* Seller Actions */}
                    <div className="flex flex-col gap-2 min-w-[140px]">
                      {item.status === OrderStatus.PENDING_SHIPMENT && (
                        <button 
                          onClick={() => onUpdateStatus(item.id, OrderStatus.SHIPPED)}
                          className="bg-[#131921] text-white text-xs py-2 px-3 rounded font-bold hover:bg-black transition-all"
                        >
                          Xác nhận đã gửi
                        </button>
                      )}
                      {item.status === OrderStatus.SHIPPED && (
                        <span className="text-xs text-center text-gray-500 italic">Đợi người mua nhận...</span>
                      )}
                      {item.status === OrderStatus.COMPLETED && (
                        <span className="text-xs text-center text-green-600 font-bold">Tiền đã về ví</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Purchases Section */}
          <div>
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2 border-b pb-2 border-gray-200 text-gray-800">
              <span className="bg-blue-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs">B</span>
              Đơn mua hàng của tôi
            </h3>
             {myPurchases.length === 0 ? (
              <p className="text-gray-400 text-sm italic ml-2">Bạn chưa mua đơn hàng nào.</p>
            ) : (
              <div className="space-y-4">
                {myPurchases.map(item => (
                   <div key={item.id} className="bg-white p-4 rounded-lg shadow border border-gray-200 flex flex-col md:flex-row gap-4 items-center">
                    <img src={item.image} className="w-16 h-16 object-cover rounded bg-gray-100" />
                    <div className="flex-1">
                      <div className="flex justify-between mb-1">
                        <h4 className="font-bold text-sm">{item.title}</h4>
                        <span className="font-bold text-red-600">-${item.price}</span>
                      </div>
                      <div className="text-xs text-gray-500 mb-2">Hệ thống đang giữ tiền bảo đảm</div>
                      <div className="flex items-center gap-2">
                         {getStatusBadge(item.status)}
                      </div>
                    </div>

                    {/* Buyer Actions */}
                    <div className="flex flex-col gap-2 min-w-[140px]">
                      {item.status === OrderStatus.PENDING_SHIPMENT && (
                        <span className="text-xs text-center text-gray-500 italic">Người bán đang chuẩn bị...</span>
                      )}
                      {item.status === OrderStatus.SHIPPED && (
                        <button 
                          onClick={() => onUpdateStatus(item.id, OrderStatus.COMPLETED)}
                          className="bg-[#febd69] text-black text-xs py-2 px-3 rounded font-bold hover:bg-[#f3a847] transition-all"
                        >
                          Đã nhận & Hài lòng
                        </button>
                      )}
                      {item.status === OrderStatus.SHIPPED && (
                         <button 
                          onClick={() => onUpdateStatus(item.id, OrderStatus.RETURNED)}
                          className="border border-red-200 text-red-600 text-xs py-2 px-3 rounded font-bold hover:bg-red-50 transition-all"
                        >
                          Yêu cầu trả hàng
                        </button>
                      )}
                       {item.status === OrderStatus.COMPLETED && (
                        <span className="text-xs text-center text-green-600 font-bold">Giao dịch thành công</span>
                      )}
                    </div>
                   </div>
                ))}
              </div>
             )}
          </div>

        </div>
        
        <div className="bg-gray-100 p-4 text-xs text-gray-500 text-center border-t border-gray-200">
          AmazeBid SafePay™ đảm bảo an toàn cho giao dịch. Tiền chỉ được chuyển khi người mua xác nhận. <br/>
          Nếu trả hàng, phí vận chuyển sẽ được tính cho người mua theo chính sách.
        </div>
      </div>
    </div>
  );
};

export default OrderDashboard;
