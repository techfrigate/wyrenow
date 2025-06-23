import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Wallet, Bonus, Transaction, TreeNode, Package } from '../types';

interface AppContextType {
  wallet: Wallet;
  recentBonuses: Bonus[];
  recentTransactions: Transaction[];
  binaryTree: TreeNode | null;
  packages: Package[];
  currency: 'NGN' | 'GHS';
  setCurrency: (currency: 'NGN' | 'GHS') => void;
  darkMode: boolean;
  toggleDarkMode: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Mock data
const mockWallet: Wallet = {
  awaitingBalance: 125000,
  earningsBalance: 450000,
  totalEarnings: 1250000,
  lastUpdated: new Date().toISOString()
};

const mockBonuses: Bonus[] = [
  {
    id: '1',
    type: 'DSB',
    amount: 15000,
    currency: 'NGN',
    date: '2024-01-15',
    description: 'Direct Sponsor Bonus from Jane Smith upgrade',
    fromUser: 'Jane Smith',
    generation: 1
  },
  {
    id: '2',
    type: 'Business',
    amount: 8500,
    currency: 'NGN',
    date: '2024-01-14',
    description: 'Business Bonus - 17 pairs matched',
  },
  {
    id: '3',
    type: 'ISB',
    amount: 3000,
    currency: 'NGN',
    date: '2024-01-13',
    description: 'Indirect Sponsor Bonus - 3rd Generation',
    generation: 3
  }
];

const mockTransactions: Transaction[] = [
  {
    id: '1',
    type: 'earning',
    amount: 15000,
    currency: 'NGN',
    status: 'completed',
    date: '2024-01-15',
    description: 'DSB Commission'
  },
  {
    id: '2',
    type: 'withdrawal',
    amount: 50000,
    currency: 'NGN',
    status: 'pending',
    date: '2024-01-14',
    description: 'Bank Transfer Withdrawal'
  }
];

const allPackages: Package[] = [
  {
    id: 'beginner',
    name: 'Beginner',
    pv: 20,
    bv: 20,
    bottles: 2,
    costNGN: 10500,
    costGHS: 240,
    benefits: ['2 Bottles', '20 PV/BV', 'Basic Starter Kit']
  },
  {
    id: 'starter',
    name: 'Starter',
    pv: 30,
    bv: 30,
    bottles: 3,
    costNGN: 15750,
    costGHS: 360,
    benefits: ['3 Bottles', '30 PV/BV', 'Enhanced Starter Kit']
  },
  {
    id: 'regular',
    name: 'Regular',
    pv: 40,
    bv: 40,
    bottles: 4,
    costNGN: 21000,
    costGHS: 480,
    benefits: ['4 Bottles', '40 PV/BV', 'Regular Member Benefits']
  },
  {
    id: 'executive',
    name: 'Executive',
    pv: 60,
    bv: 60,
    bottles: 6,
    costNGN: 31500,
    costGHS: 720,
    benefits: ['6 Bottles', '60 PV/BV', 'Executive Status', 'Leadership Bonus']
  },
  {
    id: 'premium',
    name: 'Premium',
    pv: 80,
    bv: 80,
    bottles: 8,
    costNGN: 42000,
    costGHS: 960,
    benefits: ['8 Bottles', '80 PV/BV', 'Premium Benefits', 'Higher Commission Rates']
  },
  {
    id: 'platinum',
    name: 'Platinum',
    pv: 120,
    bv: 120,
    bottles: 12,
    costNGN: 63000,
    costGHS: 1440,
    benefits: ['12 Bottles', '120 PV/BV', 'Platinum Status', 'Advanced Benefits']
  },
  {
    id: 'diamond',
    name: 'Diamond',
    pv: 200,
    bv: 200,
    bottles: 20,
    costNGN: 105000,
    costGHS: 2400,
    benefits: ['20 Bottles', '200 PV/BV', 'Diamond Status', 'Maximum Benefits']
  },
  {
    id: 'legend',
    name: 'Legend',
    pv: 400,
    bv: 400,
    bottles: 40,
    costNGN: 210000,
    costGHS: 4800,
    benefits: ['40 Bottles', '400 PV/BV', 'Legend Status', 'Ultimate Benefits Package']
  }
];

export function AppProvider({ children }: { children: ReactNode }) {
  const [currency, setCurrency] = useState<'NGN' | 'GHS'>('NGN');
  const [darkMode, setDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle('dark');
  };

  return (
    <AppContext.Provider value={{
      wallet: mockWallet,
      recentBonuses: mockBonuses,
      recentTransactions: mockTransactions,
      binaryTree: null,
      packages: allPackages,
      currency,
      setCurrency,
      darkMode,
      toggleDarkMode
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}