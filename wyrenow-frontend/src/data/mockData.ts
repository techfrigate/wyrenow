import { User, Package, Rank, TreeNode, Wallet, Bonus, Transaction, RepurchaseRecord, ServiceCenter, Megastore, LeadershipPool } from '../types';

// Enhanced User Interface for complete data
export interface EnhancedUser extends User {
  bankDetails: {
    accountName: string;
    accountNumber: string;
    bankName: string;
    routingNumber?: string;
  };
  kycStatus: 'pending' | 'verified' | 'rejected';
  twoFactorEnabled: boolean;
  lastLogin: string;
  totalDownlines: number;
  directReferrals: number;
  monthlyPV: number;
  monthlyBV: number;
  totalPairsThisMonth: number;
  awaitingWalletReleaseDate?: string;
  notifications: Notification[];
  achievements: Achievement[];
  complianceStatus: 'compliant' | 'warning' | 'suspended';
}

export interface Notification {
  id: string;
  type: 'bonus' | 'rank' | 'team' | 'system' | 'payment';
  title: string;
  message: string;
  date: string;
  read: boolean;
  actionUrl?: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  dateEarned: string;
  reward?: number;
  category: 'rank' | 'sales' | 'team' | 'milestone';
}

export interface RetailProduct {
  id: string;
  name: string;
  description: string;
  pv: number;
  wholesalePrice: number;
  retailPrice: number;
  image: string;
  category: string;
  inStock: number;
}

export interface RetailSale {
  id: string;
  productId: string;
  customerName: string;
  customerPhone: string;
  quantity: number;
  totalAmount: number;
  profit: number;
  date: string;
  status: 'completed' | 'pending' | 'cancelled';
}

export interface TeamMember {
  user: EnhancedUser;
  generation: number;
  position: 'left' | 'right';
  sponsorId: string;
  joinDate: string;
  totalTeamSize: number;
  isActive: boolean;
  lastActivity: string;
}

export interface BinaryTreeStats {
  leftLegPV: number;
  rightLegPV: number;
  leftLegBV: number;
  rightLegBV: number;
  leftLegMembers: number;
  rightLegMembers: number;
  totalPairs: number;
  unusedLeftPV: number;
  unusedRightPV: number;
  weeklyPairs: number;
  monthlyPairs: number;
}

export interface EarningsBreakdown {
  directSponsorBonus: number;
  indirectSponsorBonus: number;
  businessBonus: number;
  rollupBonus: number;
  unilevelBonus: number;
  retailProfit: number;
  serviceCenterCommission: number;
  megastoreCommission: number;
  leadershipPoolShare: number;
  totalEarnings: number;
}

export interface MonthlyReport {
  month: string;
  year: number;
  personalPV: number;
  teamPV: number;
  newRecruits: number;
  totalEarnings: number;
  withdrawals: number;
  repurchases: number;
  rank: string;
  achievements: string[];
}

// All Packages with detailed information
export const allPackages: Package[] = [
  {
    id: 'beginner',
    name: 'Beginner',
    pv: 20,
    bv: 20,
    bottles: 2,
    costNGN: 10500,
    costGHS: 240,
    benefits: ['2 Bottles Premium Health Supplement', '20 PV/BV Points', 'Basic Starter Kit', 'Digital Training Materials', 'Mobile App Access']
  },
  {
    id: 'starter',
    name: 'Starter',
    pv: 30,
    bv: 30,
    bottles: 3,
    costNGN: 15750,
    costGHS: 360,
    benefits: ['3 Bottles Premium Health Supplement', '30 PV/BV Points', 'Enhanced Starter Kit', 'Welcome Bonus Eligibility', 'Priority Customer Support']
  },
  {
    id: 'regular',
    name: 'Regular',
    pv: 40,
    bv: 40,
    bottles: 4,
    costNGN: 21000,
    costGHS: 480,
    benefits: ['4 Bottles Premium Health Supplement', '40 PV/BV Points', 'Regular Member Benefits', 'Monthly Newsletter', 'Retail Discount 5%']
  },
  {
    id: 'executive',
    name: 'Executive',
    pv: 60,
    bv: 60,
    bottles: 6,
    costNGN: 31500,
    costGHS: 720,
    benefits: ['6 Bottles Premium Health Supplement', '60 PV/BV Points', 'Executive Status Badge', 'Leadership Bonus Eligibility', 'Advanced Training Access', 'Retail Discount 7%']
  },
  {
    id: 'premium',
    name: 'Premium',
    pv: 80,
    bv: 80,
    bottles: 8,
    costNGN: 42000,
    costGHS: 960,
    benefits: ['8 Bottles Premium Health Supplement', '80 PV/BV Points', 'Premium Member Status', 'Higher Commission Rates', 'VIP Support', 'Retail Discount 8%']
  },
  {
    id: 'platinum',
    name: 'Platinum',
    pv: 120,
    bv: 120,
    bottles: 12,
    costNGN: 63000,
    costGHS: 1440,
    benefits: ['12 Bottles Premium Health Supplement', '120 PV/BV Points', 'Platinum Status Recognition', 'Advanced Benefits Package', 'Exclusive Events Access', 'Retail Discount 9%']
  },
  {
    id: 'diamond',
    name: 'Diamond',
    pv: 200,
    bv: 200,
    bottles: 20,
    costNGN: 105000,
    costGHS: 2400,
    benefits: ['20 Bottles Premium Health Supplement', '200 PV/BV Points', 'Diamond Status Recognition', 'Maximum Benefits Package', 'Leadership Pool Access', 'Retail Discount 10%']
  },
  {
    id: 'legend',
    name: 'Legend',
    pv: 400,
    bv: 400,
    bottles: 40,
    costNGN: 210000,
    costGHS: 4800,
    benefits: ['40 Bottles Premium Health Supplement', '400 PV/BV Points', 'Legend Status Recognition', 'Ultimate Benefits Package', 'Global Recognition', 'Maximum Retail Discount 10%', 'Exclusive Legend Events']
  }
];

// All Ranks with detailed progression
export const allRanks: Rank[] = [
  {
    id: 'promoter',
    name: 'Promoter',
    requirements: {
      personalPV: 20,
      packageLevel: 1,
      teamRequirements: 'Join with any package'
    },
    rewards: {
      cashBonus: 0,
      privileges: ['Basic Member Access', 'Sponsor Bonus Eligibility']
    },
    icon: 'user'
  },
  {
    id: 'senior-promoter',
    name: 'Senior Promoter',
    requirements: {
      personalPV: 40,
      packageLevel: 3,
      teamRequirements: '2 direct referrals with Regular package or above'
    },
    rewards: {
      cashBonus: 25000,
      privileges: ['Enhanced Bonus Rates', 'Team Leadership Tools']
    },
    icon: 'star'
  },
  {
    id: 'supervisor',
    name: 'Supervisor',
    requirements: {
      personalPV: 60,
      packageLevel: 4,
      teamRequirements: '5 direct referrals, 20 team members'
    },
    rewards: {
      cashBonus: 50000,
      privileges: ['Supervisor Badge', 'Advanced Training Access', 'Monthly Bonus Pool']
    },
    icon: 'shield'
  },
  {
    id: 'manager',
    name: 'Manager',
    requirements: {
      personalPV: 80,
      packageLevel: 5,
      teamRequirements: '10 direct referrals, 50 team members'
    },
    rewards: {
      cashBonus: 100000,
      privileges: ['Manager Status', 'Leadership Bonus', 'VIP Support']
    },
    icon: 'briefcase'
  },
  {
    id: 'senior-manager',
    name: 'Senior Manager',
    requirements: {
      personalPV: 120,
      packageLevel: 6,
      teamRequirements: '15 direct referrals, 100 team members'
    },
    rewards: {
      cashBonus: 200000,
      privileges: ['Senior Manager Recognition', 'Higher Commission Rates', 'Exclusive Events']
    },
    icon: 'award'
  },
  {
    id: 'director',
    name: 'Director',
    requirements: {
      personalPV: 200,
      packageLevel: 7,
      teamRequirements: '25 direct referrals, 250 team members'
    },
    rewards: {
      cashBonus: 500000,
      privileges: ['Director Status', 'Leadership Pool Access', 'Global Recognition']
    },
    icon: 'crown'
  },
  {
    id: 'executive-director',
    name: 'Executive Director',
    requirements: {
      personalPV: 400,
      packageLevel: 8,
      teamRequirements: '50 direct referrals, 500 team members'
    },
    rewards: {
      cashBonus: 1000000,
      privileges: ['Executive Director Recognition', 'Maximum Benefits', 'Board Consideration']
    },
    icon: 'gem'
  },
  {
    id: 'global-icon',
    name: 'Global Icon',
    requirements: {
      personalPV: 400,
      packageLevel: 8,
      teamRequirements: '100 direct referrals, 1000+ team members, sustained performance'
    },
    rewards: {
      cashBonus: 2000000,
      privileges: ['Global Icon Status', 'Ultimate Recognition', 'Legacy Benefits']
    },
    icon: 'trophy'
  }
];

// Retail Products
export const retailProducts: RetailProduct[] = [
  {
    id: 'health-boost-original',
    name: 'WyreNow Health Boost Original',
    description: 'Premium health supplement with natural ingredients for daily wellness',
    pv: 20,
    wholesalePrice: 8750,
    retailPrice: 11375,
    image: 'https://images.pexels.com/photos/3683107/pexels-photo-3683107.jpeg?auto=compress&cs=tinysrgb&w=300',
    category: 'Health Supplements',
    inStock: 150
  },
  {
    id: 'health-boost-premium',
    name: 'WyreNow Health Boost Premium',
    description: 'Advanced formula with enhanced nutrients and vitamins',
    pv: 30,
    wholesalePrice: 13125,
    retailPrice: 17063,
    image: 'https://images.pexels.com/photos/3683107/pexels-photo-3683107.jpeg?auto=compress&cs=tinysrgb&w=300',
    category: 'Health Supplements',
    inStock: 120
  },
  {
    id: 'health-boost-platinum',
    name: 'WyreNow Health Boost Platinum',
    description: 'Ultimate health supplement with premium ingredients',
    pv: 40,
    wholesalePrice: 17500,
    retailPrice: 22750,
    image: 'https://images.pexels.com/photos/3683107/pexels-photo-3683107.jpeg?auto=compress&cs=tinysrgb&w=300',
    category: 'Health Supplements',
    inStock: 80
  },
  {
    id: 'wellness-kit',
    name: 'Complete Wellness Kit',
    description: 'Comprehensive health package with multiple supplements',
    pv: 60,
    wholesalePrice: 26250,
    retailPrice: 34125,
    image: 'https://images.pexels.com/photos/3683107/pexels-photo-3683107.jpeg?auto=compress&cs=tinysrgb&w=300',
    category: 'Health Kits',
    inStock: 50
  }
];

// Enhanced Users with complete data
export const enhancedUsers: EnhancedUser[] = [
  {
    id: '1',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phone: '+234 123 456 7890',
    country: 'Nigeria',
    sponsorCode: 'SPONSOR123',
    package: allPackages[3], // Executive
    rank: allRanks[2], // Supervisor
    joinDate: '2024-01-15',
    isActive: true,
    profileImage: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    bankDetails: {
      accountName: 'John Doe',
      accountNumber: '1234567890',
      bankName: 'First Bank Nigeria',
      routingNumber: '011'
    },
    kycStatus: 'verified',
    twoFactorEnabled: true,
    lastLogin: '2024-01-20T10:30:00Z',
    totalDownlines: 156,
    directReferrals: 22,
    monthlyPV: 180,
    monthlyBV: 180,
    totalPairsThisMonth: 45,
    awaitingWalletReleaseDate: '2024-02-15',
    complianceStatus: 'compliant',
    notifications: [
      {
        id: 'n1',
        type: 'bonus',
        title: 'New Bonus Earned',
        message: 'You earned ₦15,000 Direct Sponsor Bonus from Jane Smith upgrade',
        date: '2024-01-20T08:00:00Z',
        read: false,
        actionUrl: '/bonuses'
      },
      {
        id: 'n2',
        type: 'team',
        title: 'New Team Member',
        message: 'Michael Johnson joined your team under left leg',
        date: '2024-01-19T14:30:00Z',
        read: false,
        actionUrl: '/binary-tree'
      },
      {
        id: 'n3',
        type: 'rank',
        title: 'Rank Progress Update',
        message: 'You are 80% towards Manager rank. Keep going!',
        date: '2024-01-18T12:00:00Z',
        read: true,
        actionUrl: '/ranks'
      }
    ],
    achievements: [
      {
        id: 'a1',
        title: 'First Recruit',
        description: 'Successfully recruited your first team member',
        icon: 'users',
        dateEarned: '2024-01-16',
        reward: 5000,
        category: 'team'
      },
      {
        id: 'a2',
        title: 'Supervisor Rank',
        description: 'Achieved Supervisor rank with outstanding performance',
        icon: 'shield',
        dateEarned: '2024-01-18',
        reward: 50000,
        category: 'rank'
      }
    ]
  },
  {
    id: '2',
    firstName: 'Jane',
    lastName: 'Smith',
    email: 'jane.smith@example.com',
    phone: '+234 987 654 3210',
    country: 'Nigeria',
    sponsorCode: 'JANE2024',
    package: allPackages[4], // Premium
    rank: allRanks[3], // Manager
    joinDate: '2023-12-01',
    isActive: true,
    profileImage: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    bankDetails: {
      accountName: 'Jane Smith',
      accountNumber: '0987654321',
      bankName: 'GTBank Nigeria',
      routingNumber: '058'
    },
    kycStatus: 'verified',
    twoFactorEnabled: true,
    lastLogin: '2024-01-20T09:15:00Z',
    totalDownlines: 89,
    directReferrals: 15,
    monthlyPV: 240,
    monthlyBV: 240,
    totalPairsThisMonth: 32,
    complianceStatus: 'compliant',
    notifications: [],
    achievements: [
      {
        id: 'a3',
        title: 'Manager Achievement',
        description: 'Reached Manager rank with exceptional leadership',
        icon: 'briefcase',
        dateEarned: '2024-01-10',
        reward: 100000,
        category: 'rank'
      }
    ]
  },
  {
    id: '3',
    firstName: 'Michael',
    lastName: 'Johnson',
    email: 'michael.johnson@example.com',
    phone: '+233 123 456 789',
    country: 'Ghana',
    sponsorCode: 'MIKE2024',
    package: allPackages[2], // Regular
    rank: allRanks[1], // Senior Promoter
    joinDate: '2024-01-19',
    isActive: true,
    profileImage: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    bankDetails: {
      accountName: 'Michael Johnson',
      accountNumber: '1122334455',
      bankName: 'GCB Bank Ghana',
      routingNumber: 'GCB'
    },
    kycStatus: 'pending',
    twoFactorEnabled: false,
    lastLogin: '2024-01-20T07:45:00Z',
    totalDownlines: 5,
    directReferrals: 3,
    monthlyPV: 40,
    monthlyBV: 40,
    totalPairsThisMonth: 2,
    complianceStatus: 'compliant',
    notifications: [],
    achievements: []
  }
];

// Binary Tree Structure
export const binaryTreeData: TreeNode = {
  user: enhancedUsers[0],
  leftChild: {
    user: enhancedUsers[1],
    leftChild: {
      user: enhancedUsers[2],
      totalLeftPV: 0,
      totalRightPV: 0,
      totalLeftBV: 0,
      totalRightBV: 0,
      level: 3
    },
    rightChild: {
      user: {
        ...enhancedUsers[2],
        id: '4',
        firstName: 'Sarah',
        lastName: 'Wilson',
        email: 'sarah.wilson@example.com'
      },
      totalLeftPV: 0,
      totalRightPV: 0,
      totalLeftBV: 0,
      totalRightBV: 0,
      level: 3
    },
    totalLeftPV: 40,
    totalRightPV: 40,
    totalLeftBV: 40,
    totalRightBV: 40,
    level: 2
  },
  rightChild: {
    user: {
      ...enhancedUsers[1],
      id: '5',
      firstName: 'David',
      lastName: 'Brown',
      email: 'david.brown@example.com'
    },
    totalLeftPV: 0,
    totalRightPV: 0,
    totalLeftBV: 0,
    totalRightBV: 0,
    level: 2
  },
  totalLeftPV: 320,
  totalRightPV: 80,
  totalLeftBV: 320,
  totalRightBV: 80,
  level: 1
};

// Comprehensive Bonuses
export const allBonuses: Bonus[] = [
  {
    id: 'b1',
    type: 'DSB',
    amount: 15000,
    currency: 'NGN',
    date: '2024-01-20',
    description: 'Direct Sponsor Bonus from Jane Smith Executive package upgrade',
    fromUser: 'Jane Smith',
    generation: 1
  },
  {
    id: 'b2',
    type: 'Business',
    amount: 8500,
    currency: 'NGN',
    date: '2024-01-19',
    description: 'Business Bonus - 17 pairs matched (Left: 340 BV, Right: 340 BV)'
  },
  {
    id: 'b3',
    type: 'ISB',
    amount: 3000,
    currency: 'NGN',
    date: '2024-01-18',
    description: 'Indirect Sponsor Bonus from Michael Johnson (3rd Generation)',
    fromUser: 'Michael Johnson',
    generation: 3
  },
  {
    id: 'b4',
    type: 'Rollup',
    amount: 12000,
    currency: 'NGN',
    date: '2024-01-17',
    description: 'Roll-up Bonus from Sarah Wilson Premium package upgrade',
    fromUser: 'Sarah Wilson',
    generation: 2
  },
  {
    id: 'b5',
    type: 'Unilevel',
    amount: 4500,
    currency: 'NGN',
    date: '2024-01-16',
    description: 'Unilevel Bonus from team repurchases (5 members, 180 PV total)'
  },
  {
    id: 'b6',
    type: 'DSB',
    amount: 9500,
    currency: 'NGN',
    date: '2024-01-15',
    description: 'Direct Sponsor Bonus from David Brown Regular package upgrade',
    fromUser: 'David Brown',
    generation: 1
  }
];

// Comprehensive Transactions
export const allTransactions: Transaction[] = [
  {
    id: 't1',
    type: 'earning',
    amount: 15000,
    currency: 'NGN',
    status: 'completed',
    date: '2024-01-20',
    description: 'DSB Commission from Jane Smith upgrade'
  },
  {
    id: 't2',
    type: 'withdrawal',
    amount: 50000,
    currency: 'NGN',
    status: 'pending',
    date: '2024-01-19',
    description: 'Bank Transfer Withdrawal to First Bank (****7890)'
  },
  {
    id: 't3',
    type: 'earning',
    amount: 8500,
    currency: 'NGN',
    status: 'completed',
    date: '2024-01-19',
    description: 'Business Bonus - 17 pairs matched'
  },
  {
    id: 't4',
    type: 'purchase',
    amount: 31500,
    currency: 'NGN',
    status: 'completed',
    date: '2024-01-15',
    description: 'Executive Package Purchase'
  },
  {
    id: 't5',
    type: 'earning',
    amount: 3000,
    currency: 'NGN',
    status: 'completed',
    date: '2024-01-18',
    description: 'ISB Commission - 3rd Generation'
  },
  {
    id: 't6',
    type: 'withdrawal',
    amount: 25000,
    currency: 'NGN',
    status: 'completed',
    date: '2024-01-10',
    description: 'Bank Transfer Withdrawal - Processed'
  }
];

// Repurchase Records
export const repurchaseRecords: RepurchaseRecord[] = [
  {
    id: 'r1',
    date: '2024-01-15',
    amount: 28350,
    currency: 'NGN',
    bottles: 6,
    discount: 3150,
    status: 'completed'
  },
  {
    id: 'r2',
    date: '2023-12-15',
    amount: 26775,
    currency: 'NGN',
    bottles: 6,
    discount: 4725,
    status: 'completed'
  },
  {
    id: 'r3',
    date: '2023-11-15',
    amount: 29925,
    currency: 'NGN',
    bottles: 6,
    discount: 1575,
    status: 'completed'
  }
];

// Service Centers
export const serviceCenters: ServiceCenter[] = [
  {
    id: 'sc1',
    userId: '1',
    monthlyPV: 1850,
    requiredPV: 1500,
    commissionRate: 0.06,
    isActive: true,
    establishedDate: '2024-01-01'
  },
  {
    id: 'sc2',
    userId: '2',
    monthlyPV: 2100,
    requiredPV: 1500,
    commissionRate: 0.06,
    isActive: true,
    establishedDate: '2023-12-01'
  }
];

// Megastores
export const megastores: Megastore[] = [
  {
    id: 'ms1',
    userId: '1',
    monthlyPV: 6500,
    requiredPV: 6000,
    commissionRate: 0.09,
    leadershipBonus: 0.10,
    serviceCentersUnder: 3,
    isActive: true,
    establishedDate: '2024-01-01'
  }
];

// Leadership Pools
export const leadershipPools: LeadershipPool[] = [
  {
    id: 'lp1',
    type: 'Executive',
    totalPool: 5000000,
    sharePercentage: 5,
    monthlyDistribution: 250000,
    eligibleMembers: 12
  },
  {
    id: 'lp2',
    type: 'Champion',
    totalPool: 3000000,
    sharePercentage: 3,
    monthlyDistribution: 150000,
    eligibleMembers: 8
  },
  {
    id: 'lp3',
    type: 'Icon',
    totalPool: 2000000,
    sharePercentage: 2,
    monthlyDistribution: 100000,
    eligibleMembers: 4
  }
];

// Retail Sales
export const retailSales: RetailSale[] = [
  {
    id: 'rs1',
    productId: 'health-boost-original',
    customerName: 'Alice Johnson',
    customerPhone: '+234 111 222 333',
    quantity: 2,
    totalAmount: 22750,
    profit: 5250,
    date: '2024-01-20',
    status: 'completed'
  },
  {
    id: 'rs2',
    productId: 'health-boost-premium',
    customerName: 'Bob Williams',
    customerPhone: '+234 444 555 666',
    quantity: 1,
    totalAmount: 17063,
    profit: 3938,
    date: '2024-01-19',
    status: 'completed'
  },
  {
    id: 'rs3',
    productId: 'wellness-kit',
    customerName: 'Carol Davis',
    customerPhone: '+234 777 888 999',
    quantity: 1,
    totalAmount: 34125,
    profit: 7875,
    date: '2024-01-18',
    status: 'pending'
  }
];

// Team Members with complete hierarchy
export const teamMembers: TeamMember[] = [
  {
    user: enhancedUsers[1],
    generation: 1,
    position: 'left',
    sponsorId: '1',
    joinDate: '2023-12-01',
    totalTeamSize: 89,
    isActive: true,
    lastActivity: '2024-01-20T09:15:00Z'
  },
  {
    user: enhancedUsers[2],
    generation: 2,
    position: 'left',
    sponsorId: '2',
    joinDate: '2024-01-19',
    totalTeamSize: 5,
    isActive: true,
    lastActivity: '2024-01-20T07:45:00Z'
  },
  {
    user: {
      ...enhancedUsers[2],
      id: '4',
      firstName: 'Sarah',
      lastName: 'Wilson',
      email: 'sarah.wilson@example.com',
      phone: '+234 555 666 777',
      package: allPackages[4], // Premium
      rank: allRanks[2] // Supervisor
    },
    generation: 2,
    position: 'right',
    sponsorId: '2',
    joinDate: '2024-01-10',
    totalTeamSize: 25,
    isActive: true,
    lastActivity: '2024-01-19T16:30:00Z'
  }
];

// Binary Tree Statistics
export const binaryTreeStats: BinaryTreeStats = {
  leftLegPV: 1240,
  rightLegPV: 680,
  leftLegBV: 1240,
  rightLegBV: 680,
  leftLegMembers: 89,
  rightLegMembers: 67,
  totalPairs: 34,
  unusedLeftPV: 560,
  unusedRightPV: 0,
  weeklyPairs: 8,
  monthlyPairs: 34
};

// Earnings Breakdown
export const earningsBreakdown: EarningsBreakdown = {
  directSponsorBonus: 125000,
  indirectSponsorBonus: 45000,
  businessBonus: 85000,
  rollupBonus: 35000,
  unilevelBonus: 25000,
  retailProfit: 18000,
  serviceCenterCommission: 65000,
  megastoreCommission: 45000,
  leadershipPoolShare: 20000,
  totalEarnings: 463000
};

// Monthly Reports
export const monthlyReports: MonthlyReport[] = [
  {
    month: 'January',
    year: 2024,
    personalPV: 180,
    teamPV: 1920,
    newRecruits: 8,
    totalEarnings: 125000,
    withdrawals: 75000,
    repurchases: 28350,
    rank: 'Supervisor',
    achievements: ['First 100 Team Members', 'Monthly Sales Target']
  },
  {
    month: 'December',
    year: 2023,
    personalPV: 160,
    teamPV: 1650,
    newRecruits: 12,
    totalEarnings: 98000,
    withdrawals: 50000,
    repurchases: 26775,
    rank: 'Senior Promoter',
    achievements: ['Supervisor Rank Achievement']
  },
  {
    month: 'November',
    year: 2023,
    personalPV: 120,
    teamPV: 1200,
    newRecruits: 15,
    totalEarnings: 75000,
    withdrawals: 40000,
    repurchases: 29925,
    rank: 'Senior Promoter',
    achievements: ['50 Team Members Milestone']
  }
];

// Chart Data for Analytics
export const earningsChartData = [
  { month: 'Jul', earnings: 35000, bonuses: 8000, retail: 3000 },
  { month: 'Aug', earnings: 42000, bonuses: 12000, retail: 4500 },
  { month: 'Sep', earnings: 38000, bonuses: 10000, retail: 3800 },
  { month: 'Oct', earnings: 55000, bonuses: 18000, retail: 6200 },
  { month: 'Nov', earnings: 75000, bonuses: 25000, retail: 8500 },
  { month: 'Dec', earnings: 98000, bonuses: 35000, retail: 12000 },
  { month: 'Jan', earnings: 125000, bonuses: 45000, retail: 18000 }
];

export const teamGrowthChartData = [
  { month: 'Jul', direct: 3, indirect: 8, total: 11 },
  { month: 'Aug', direct: 5, indirect: 15, total: 20 },
  { month: 'Sep', direct: 8, indirect: 24, total: 32 },
  { month: 'Oct', direct: 12, indirect: 36, total: 48 },
  { month: 'Nov', direct: 15, indirect: 45, total: 60 },
  { month: 'Dec', direct: 18, indirect: 54, total: 72 },
  { month: 'Jan', direct: 22, indirect: 66, total: 88 }
];

export const bonusBreakdownData = [
  { name: 'Direct Sponsor', value: 35, amount: 125000, color: '#3b82f6' },
  { name: 'Business Bonus', value: 25, amount: 85000, color: '#14b8a6' },
  { name: 'Service Center', value: 18, amount: 65000, color: '#f97316' },
  { name: 'Megastore', value: 12, amount: 45000, color: '#eab308' },
  { name: 'Indirect Sponsor', value: 10, amount: 45000, color: '#8b5cf6' }
];

export const rankProgressData = [
  { rank: 'Promoter', achieved: true, date: '2024-01-15', reward: 0 },
  { rank: 'Senior Promoter', achieved: true, date: '2024-01-16', reward: 25000 },
  { rank: 'Supervisor', achieved: true, date: '2024-01-18', reward: 50000 },
  { rank: 'Manager', achieved: false, progress: 80, requirement: '10 direct referrals, 50 team members' },
  { rank: 'Senior Manager', achieved: false, progress: 45, requirement: '15 direct referrals, 100 team members' },
  { rank: 'Director', achieved: false, progress: 20, requirement: '25 direct referrals, 250 team members' }
];

// Wallet Data
export const walletData: Wallet = {
  awaitingBalance: 125000,
  earningsBalance: 450000,
  totalEarnings: 1250000,
  lastUpdated: new Date().toISOString()
};

// System Announcements
export const systemAnnouncements = [
  {
    id: 'ann1',
    title: 'New Leadership Pool Distribution',
    message: 'Executive Pool distribution for January 2024 is now available. Check your earnings!',
    date: '2024-01-20',
    type: 'earnings',
    priority: 'high'
  },
  {
    id: 'ann2',
    title: 'Monthly Repurchase Reminder',
    message: 'Don\'t forget to complete your monthly repurchase by January 31st to maintain active status.',
    date: '2024-01-18',
    type: 'reminder',
    priority: 'medium'
  },
  {
    id: 'ann3',
    title: 'New Training Materials Available',
    message: 'Advanced leadership training modules are now available in your member portal.',
    date: '2024-01-15',
    type: 'training',
    priority: 'low'
  }
];

// Company Events
export const companyEvents = [
  {
    id: 'event1',
    title: 'WyreNow Annual Convention 2024',
    description: 'Join us for the biggest MLM event of the year with top leaders and exclusive training sessions.',
    date: '2024-03-15',
    location: 'Lagos, Nigeria',
    type: 'convention',
    registrationRequired: true
  },
  {
    id: 'event2',
    title: 'Leadership Webinar Series',
    description: 'Monthly webinar series focusing on advanced leadership skills and team building.',
    date: '2024-02-10',
    location: 'Online',
    type: 'webinar',
    registrationRequired: true
  },
  {
    id: 'event3',
    title: 'Regional Training Workshop',
    description: 'Hands-on training workshop for new and existing members in the West Africa region.',
    date: '2024-02-25',
    location: 'Accra, Ghana',
    type: 'workshop',
    registrationRequired: true
  }
];

// Training Materials
export const trainingMaterials = [
  {
    id: 'training1',
    title: 'MLM Fundamentals',
    description: 'Complete guide to understanding multi-level marketing principles and strategies.',
    type: 'pdf',
    category: 'basics',
    duration: '45 minutes',
    completed: true
  },
  {
    id: 'training2',
    title: 'Advanced Team Building',
    description: 'Learn advanced techniques for building and managing large teams effectively.',
    type: 'video',
    category: 'leadership',
    duration: '2 hours',
    completed: false
  },
  {
    id: 'training3',
    title: 'Binary Tree Optimization',
    description: 'Strategies for optimizing your binary tree structure for maximum earnings.',
    type: 'interactive',
    category: 'strategy',
    duration: '1.5 hours',
    completed: false
  }
];

// Compliance Tracking
export const complianceData = {
  monthlyRepurchaseStatus: 'completed',
  lastRepurchaseDate: '2024-01-15',
  nextRepurchaseDue: '2024-02-15',
  awaitingWalletCompliance: 'compliant',
  kycStatus: 'verified',
  documentExpiryDates: {
    idCard: '2026-05-15',
    bankStatement: '2024-04-15',
    addressProof: '2024-06-20'
  },
  complianceScore: 95,
  warnings: [],
  requiredActions: []
};

// Goal Tracking
export const goalData = [
  {
    id: 'goal1',
    title: 'Reach Manager Rank',
    description: 'Achieve Manager rank by recruiting 10 direct referrals and building a team of 50 members',
    targetDate: '2024-03-31',
    progress: 80,
    category: 'rank',
    milestones: [
      { title: '10 Direct Referrals', completed: false, current: 8 },
      { title: '50 Team Members', completed: false, current: 42 }
    ]
  },
  {
    id: 'goal2',
    title: 'Monthly Earnings Target',
    description: 'Earn ₦200,000 in total monthly bonuses',
    targetDate: '2024-01-31',
    progress: 62,
    category: 'earnings',
    milestones: [
      { title: '₦200,000 Monthly Earnings', completed: false, current: 125000 }
    ]
  }
];

export default {
  enhancedUsers,
  allPackages,
  allRanks,
  retailProducts,
  binaryTreeData,
  allBonuses,
  allTransactions,
  repurchaseRecords,
  serviceCenters,
  megastores,
  leadershipPools,
  retailSales,
  teamMembers,
  binaryTreeStats,
  earningsBreakdown,
  monthlyReports,
  earningsChartData,
  teamGrowthChartData,
  bonusBreakdownData,
  rankProgressData,
  walletData,
  systemAnnouncements,
  companyEvents,
  trainingMaterials,
  complianceData,
  goalData
};