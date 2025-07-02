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

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  profileImage?: string;
  isActive: boolean;
  joinDate: string;
  package: {
    id: string;
    name: string;
    price: number;
  };
  rank: {
    id: string;
    name: string;
    level: number;
  };
}

export interface TreeNode {
  user: User;
  totalLeftPV: number;
  totalRightPV: number;
  totalLeftBV: number;
  totalRightBV: number;
  leftChild?: TreeNode;
  rightChild?: TreeNode;
}

export interface BinaryTreeStats {
  leftLegPV: number;
  rightLegPV: number;
  leftLegMembers: number;
  rightLegMembers: number;
  totalPairs: number;
  monthlyPairs: number;
  weeklyPairs: number;
  unusedLeftPV: number;
  unusedRightPV: number;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  timestamp: string;
  read: boolean;
}

export interface Commission {
  id: string;
  type: string;
  amount: number;
  fromUser: string;
  date: string;
  status: 'pending' | 'paid' | 'cancelled';
}

export interface Withdrawal {
  id: string;
  amount: number;
  method: string;
  accountDetails: string;
  date: string;
  status: 'pending' | 'processing' | 'completed' | 'rejected';
  fees: number;
}

export interface Package {
  id: string;
  name: string;
  price: number;
  pv: number;
  benefits: string[];
  isPopular?: boolean;
}

export interface Rank {
  id: string;
  name: string;
  level: number;
  requirements: {
    personalSales: number;
    groupSales: number;
    directReferrals: number;
  };
  benefits: string[];
  commissionRate: number;
}


// types/binaryTree.ts
export interface BackendUser {
  id: number;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  level: number;
}

export interface BackendPVData {
  leftPV: number;
  rightPV: number;
  totalPV: number;
}

export interface BackendBVData {
  leftBV: number;
  rightBV: number;
  totalBV: number;
}

export interface BackendTreeNode {
  id: number;
  username: string;
  firstName: string;
  lastName: string;
  sponsorUsername?: string;
  email: string;
  phone: string;
  level: number;
  pvData: BackendPVData;
  bvData: BackendBVData;
  children: {
    left: BackendTreeNode | null;
    right: BackendTreeNode | null;
  };
}

export interface BackendStats {
  leftLeg: {
    pv: number;
    bv: number;
  };
  rightLeg: {
    pv: number;
    bv: number;
  };
  totalPairs: {
    count: number;
    thisWeek: number;
  };
  teamMembers: {
    count: number;
    thisWeek: number;
  };
}

export interface BinaryTreeApiResponse {
  success: boolean;
  data: BackendTreeNode;
  stats: BackendStats;
}

export interface BinaryTreeState {
  treeData: TreeNode | null;
  stats: BinaryTreeStats | null;
  loading: boolean;
  error: string | null;
  currentUserId: number | null;
}

export interface BinaryTreeStats {
  leftLegPV: number;
  rightLegPV: number;
  leftLegBV: number;
  rightLegBV: number;
  leftLegMembers: number;
  rightLegMembers: number;
  totalPairs: number;
  weeklyPairs: number;
  monthlyPairs: number;
  unusedLeftPV: number;
  unusedRightPV: number;
  teamMembersThisWeek: number;
}