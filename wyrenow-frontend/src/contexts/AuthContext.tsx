import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (userData: Partial<User>, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
  updateUser: (userData: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock user data for demonstration
const mockUser: User = {
  id: '1',
  firstName: 'John',
  lastName: 'Doe',
  email: 'john.doe@example.com',
  phone: '+234 123 456 7890',
  country: 'Nigeria',
  sponsorCode: 'SPONSOR123',
  package: {
    id: 'executive',
    name: 'Executive',
    pv: 60,
    bv: 60,
    bottles: 6,
    costNGN: 31500,
    costGHS: 720,
    benefits: ['6 Bottles', '60 PV/BV', 'Executive Status', 'Leadership Bonus']
  },
  rank: {
    id: 'promoter',
    name: 'Promoter',
    requirements: {
      personalPV: 40,
      packageLevel: 3
    },
    rewards: {
      cashBonus: 50000,
      privileges: ['Team Leadership', 'Monthly Bonus']
    },
    icon: 'crown'
  },
  joinDate: '2024-01-15',
  isActive: true,
  profileImage: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop'
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for stored user data
    const storedUser = localStorage.getItem('wyrenow_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    // Mock login - in real app, this would be an API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (email === 'demo@wyrenow.com' && password === 'password') {
      setUser(mockUser);
      localStorage.setItem('wyrenow_user', JSON.stringify(mockUser));
      setIsLoading(false);
      return true;
    }
    
    setIsLoading(false);
    return false;
  };

  const register = async (userData: Partial<User>, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    // Mock registration
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const newUser: User = {
      ...mockUser,
      ...userData,
      id: Math.random().toString(36).substr(2, 9),
      joinDate: new Date().toISOString().split('T')[0],
    } as User;
    
    setUser(newUser);
    localStorage.setItem('wyrenow_user', JSON.stringify(newUser));
    setIsLoading(false);
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('wyrenow_user');
  };

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
      localStorage.setItem('wyrenow_user', JSON.stringify(updatedUser));
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      login,
      register,
      logout,
      isLoading,
      updateUser
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}