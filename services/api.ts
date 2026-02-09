
// Đây là cầu nối giữa Frontend và Backend
const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

// Hàm helper để gọi API
async function fetchClient<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = localStorage.getItem('auth_token'); // Lấy token đăng nhập nếu có
  
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    ...options.headers,
  };

  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'API Error');
    }

    const result: ApiResponse<T> = await response.json();
    return result.data;
  } catch (error) {
    console.error(`API Call Error [${endpoint}]:`, error);
    throw error;
  }
}

export const api = {
  // Sản phẩm
  products: {
    getAll: () => fetchClient<any[]>('/products'),
    getById: (id: string) => fetchClient<any>(`/products/${id}`),
    create: (data: any) => fetchClient<any>('/products', { method: 'POST', body: JSON.stringify(data) }),
  },
  
  // Xác thực
  auth: {
    login: (email: string, pass: string) => fetchClient<any>('/auth/login', { 
        method: 'POST', body: JSON.stringify({ email, pass }) 
    }),
    register: (data: any) => fetchClient<any>('/auth/register', { 
        method: 'POST', body: JSON.stringify(data) 
    }),
    profile: () => fetchClient<any>('/auth/profile'),
  },

  // Đấu giá (Cần Realtime -> Socket.io, nhưng đây là API cơ bản)
  bidding: {
    placeBid: (productId: string, amount: number) => fetchClient<any>(`/bidding/${productId}`, {
        method: 'POST', body: JSON.stringify({ amount })
    })
  },

  // Đơn hàng
  orders: {
    create: (cartItems: any[]) => fetchClient<any>('/orders', {
        method: 'POST', body: JSON.stringify({ items: cartItems })
    }),
    getMyOrders: () => fetchClient<any[]>('/orders/me'),
  }
};
