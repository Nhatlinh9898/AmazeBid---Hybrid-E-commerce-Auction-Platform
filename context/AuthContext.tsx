
import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  login: (email: string, pass: string) => Promise<boolean>;
  register: (name: string, email: string, pass: string) => Promise<boolean>;
  loginWithPhone: (phone: string, otp: string) => Promise<boolean>;
  loginWithSocial: (provider: 'google' | 'facebook' | 'github') => Promise<boolean>;
  logout: () => void;
  updateProfile: (updatedData: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  // Load user from local storage on mount (Simulation)
  useEffect(() => {
    const savedUser = localStorage.getItem('amaze_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const login = async (email: string, pass: string): Promise<boolean> => {
    // Simulate API Call
    return new Promise((resolve) => {
      setTimeout(() => {
        // Mock Login Success
        const mockUser: User = {
          id: 'user_email_123',
          fullName: 'Nguyễn Văn A',
          email: email,
          avatar: `https://ui-avatars.com/api/?name=Nguyen+Van+A&background=random`,
          joinDate: new Date().toISOString(),
          balance: 0,
          paymentMethods: [
            { id: 'pm_1', type: 'BANK', providerName: 'Vietcombank', accountNumber: '9988776655', holderName: 'NGUYEN VAN A', isDefault: true }
          ],
          socialAccounts: [
            { provider: 'google', connected: true, username: 'nguyenvana@gmail.com' },
            { provider: 'facebook', connected: false }
          ],
          referralCode: 'AMAZE-A-123',
          friendCount: 12
        };
        setUser(mockUser);
        localStorage.setItem('amaze_user', JSON.stringify(mockUser));
        resolve(true);
      }, 800);
    });
  };

  const loginWithPhone = async (phone: string, otp: string): Promise<boolean> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            const mockUser: User = {
                id: `user_phone_${phone}`,
                fullName: `Người dùng ${phone.slice(-4)}`,
                email: `${phone}@phone.user`,
                phone: phone,
                avatar: `https://ui-avatars.com/api/?name=${phone.slice(-3)}&background=random`,
                joinDate: new Date().toISOString(),
                balance: 0,
                paymentMethods: [],
                socialAccounts: [],
                referralCode: `AMAZE-P-${Math.floor(Math.random() * 1000)}`,
                friendCount: 0
            };
            setUser(mockUser);
            localStorage.setItem('amaze_user', JSON.stringify(mockUser));
            resolve(true);
        }, 1000);
    });
  };

  const loginWithSocial = async (provider: 'google' | 'facebook' | 'github'): Promise<boolean> => {
      return new Promise((resolve) => {
          setTimeout(() => {
              let name = 'Social User';
              if (provider === 'google') name = 'Google User';
              if (provider === 'facebook') name = 'Facebook User';
              if (provider === 'github') name = 'Dev GitHub';

              const mockUser: User = {
                  id: `user_${provider}_${Date.now()}`,
                  fullName: name,
                  email: `${provider}_user@example.com`,
                  avatar: `https://ui-avatars.com/api/?name=${name}&background=random`,
                  joinDate: new Date().toISOString(),
                  balance: 50, // Bonus balance for social login
                  paymentMethods: [],
                  socialAccounts: [
                      { provider: provider as any, connected: true, username: `${name.toLowerCase().replace(' ', '')}` }
                  ],
                  referralCode: `AMAZE-S-${Math.floor(Math.random() * 1000)}`,
                  friendCount: 5
              };
              setUser(mockUser);
              localStorage.setItem('amaze_user', JSON.stringify(mockUser));
              resolve(true);
          }, 1200);
      });
  };

  const register = async (name: string, email: string, pass: string): Promise<boolean> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newUser: User = {
          id: `user_${Date.now()}`,
          fullName: name,
          email: email,
          avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`,
          joinDate: new Date().toISOString(),
          balance: 0,
          paymentMethods: [],
          socialAccounts: [
             { provider: 'google', connected: false },
             { provider: 'facebook', connected: false }
          ],
          referralCode: `AMAZE-${Math.floor(Math.random() * 10000)}`,
          friendCount: 0
        };
        setUser(newUser);
        localStorage.setItem('amaze_user', JSON.stringify(newUser));
        resolve(true);
      }, 800);
    });
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('amaze_user');
  };

  const updateProfile = (updatedData: Partial<User>) => {
    if (user) {
        const newUser = { ...user, ...updatedData };
        setUser(newUser);
        localStorage.setItem('amaze_user', JSON.stringify(newUser));
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, register, loginWithPhone, loginWithSocial, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
