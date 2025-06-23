export * from './registration.types';

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  country: 'Nigeria' | 'Ghana';
  sponsorCode?: string;
  package: Package;
  rank: Rank;
  joinDate: string;
  isActive: boolean;
  profileImage?: string;
}

export interface Package {
  id: string;
  name: 'Beginner' | 'Starter' | 'Regular' | 'Executive' | 'Premium' | 'Platinum' | 'Diamond' | 'Legend';
  pv: number;
  bv: number;
  bottles: number;
  costNGN: number;
  costGHS: number;
  benefits: string[];
}

export interface Rank {
  id: string;
  name: string;
  requirements: {
    personalPV: number;
    packageLevel: number;
    teamRequirements?: string;
  };
  rewards: {
    cashBonus: number;
    privileges: string[];
  };
  icon: string;
}

export interface TreeNode {
  user: User;
  leftChild?: TreeNode;
  rightChild?: TreeNode;
  totalLeftPV: number;
  totalRightPV: number;
  totalLeftBV: number;
  totalRightBV: number;
  level: number;
}

export interface Wallet {
  awaitingBalance: number;
  earningsBalance: number;
  totalEarnings: number;
  lastUpdated: string;
}

export interface Bonus {
  id: string;
  type: 'DSB' | 'ISB' | 'Business' | 'Rollup' | 'Unilevel';
  amount: number;
  currency: 'NGN' | 'GHS';
  date: string;
  description: string;
  fromUser?: string;
  generation?: number;
}

export interface Transaction {
  id: string;
  type: 'earning' | 'withdrawal' | 'purchase' | 'upgrade';
  amount: number;
  currency: 'NGN' | 'GHS';
  status: 'pending' | 'completed' | 'failed';
  date: string;
  description: string;
}

export interface RepurchaseRecord {
  id: string;
  date: string;
  amount: number;
  currency: 'NGN' | 'GHS';
  bottles: number;
  discount: number;
  status: 'completed' | 'pending';
}

export interface ServiceCenter {
  id: string;
  userId: string;
  monthlyPV: number;
  requiredPV: 1500;
  commissionRate: 0.06;
  isActive: boolean;
  establishedDate: string;
}

export interface Megastore {
  id: string;
  userId: string;
  monthlyPV: number;
  requiredPV: 6000;
  commissionRate: 0.09;
  leadershipBonus: 0.10;
  serviceCentersUnder: number;
  isActive: boolean;
  establishedDate: string;
}

export interface LeadershipPool {
  id: string;
  type: 'Executive' | 'Champion' | 'Icon';
  totalPool: number;
  sharePercentage: number;
  monthlyDistribution: number;
  eligibleMembers: number;
}

