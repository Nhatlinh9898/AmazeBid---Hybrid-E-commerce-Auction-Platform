
import React, { useState } from 'react';
import { X, Mail, Lock, User, ArrowRight, Github } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const { login, register } = useAuth();
  const [isLoginView, setIsLoginView] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
        if (isLoginView) {
            await login(formData.email, formData.password);
        } else {
            await register(formData.name, formData.email, formData.password);
        }
        onClose();
    } catch (error) {
        console.error("Auth error", error);
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in" onClick={onClose} />
      <div className="relative bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95">
        
        {/* Banner */}
        <div className="bg-[#131921] p-6 text-center text-white relative">
            <button onClick={onClose} className="absolute top-4 right-4 hover:bg-white/20 p-1 rounded-full"><X size={20}/></button>
            <h2 className="text-2xl font-bold italic mb-1">Amaze<span className="text-[#febd69]">Bid</span></h2>
            <p className="text-xs text-gray-400">Nền tảng Mua sắm & Đấu giá an toàn</p>
        </div>

        <div className="p-8">
            <h3 className="text-xl font-bold text-gray-900 mb-6 text-center">
                {isLoginView ? 'Đăng nhập tài khoản' : 'Đăng ký thành viên mới'}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
                {!isLoginView && (
                    <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input 
                            type="text" 
                            placeholder="Họ và tên"
                            className="w-full pl-10 p-3 border border-gray-300 rounded-lg focus:border-[#febd69] outline-none"
                            value={formData.name}
                            onChange={e => setFormData({...formData, name: e.target.value})}
                            required
                        />
                    </div>
                )}
                <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input 
                        type="email" 
                        placeholder="Email"
                        className="w-full pl-10 p-3 border border-gray-300 rounded-lg focus:border-[#febd69] outline-none"
                        value={formData.email}
                        onChange={e => setFormData({...formData, email: e.target.value})}
                        required
                    />
                </div>
                <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input 
                        type="password" 
                        placeholder="Mật khẩu"
                        className="w-full pl-10 p-3 border border-gray-300 rounded-lg focus:border-[#febd69] outline-none"
                        value={formData.password}
                        onChange={e => setFormData({...formData, password: e.target.value})}
                        required
                    />
                </div>

                <button 
                    disabled={isLoading}
                    className="w-full bg-[#febd69] hover:bg-[#f3a847] text-black font-bold py-3 rounded-lg shadow-md transition-all flex items-center justify-center gap-2"
                >
                    {isLoading ? 'Đang xử lý...' : (isLoginView ? 'Đăng nhập' : 'Tạo tài khoản')}
                    {!isLoading && <ArrowRight size={18} />}
                </button>
            </form>
            
            <div className="mt-6 text-center">
                <p className="text-sm text-gray-500 mb-4">Hoặc tiếp tục với</p>
                <div className="flex gap-3 justify-center">
                    <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm font-bold">
                        <img src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg" className="w-4 h-4" />
                        Google
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm font-bold">
                        <Github size={16} />
                        GitHub
                    </button>
                </div>
            </div>

            <div className="mt-8 text-center text-sm">
                <span className="text-gray-500">
                    {isLoginView ? 'Chưa có tài khoản? ' : 'Đã có tài khoản? '}
                </span>
                <button 
                    onClick={() => setIsLoginView(!isLoginView)}
                    className="text-blue-600 font-bold hover:underline"
                >
                    {isLoginView ? 'Đăng ký ngay' : 'Đăng nhập'}
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
