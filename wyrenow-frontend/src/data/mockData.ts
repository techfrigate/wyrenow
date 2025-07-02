import { User, Package, Rank, TreeNode, Wallet, Bonus, Transaction, RepurchaseRecord, ServiceCenter, Megastore, LeadershipPool ,Commission, Withdrawal,} from '../types';

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


export const enhancedUsers: User[] = [
  {
    id: '1',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phone: '+1234567890',
    profileImage: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1',
    isActive: true,
    joinDate: '2024-01-15',
    package: { id: '1', name: 'Premium', price: 500 },
    rank: { id: '1', name: 'Bronze', level: 1 }
  },
  {
    id: '2',
    firstName: 'Jane',
    lastName: 'Smith',
    email: 'jane.smith@example.com',
    phone: '+1234567891',
    profileImage: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1',
    isActive: true,
    joinDate: '2024-02-01',
    package: { id: '2', name: 'Premium', price: 500 },
    rank: { id: '2', name: 'Silver', level: 2 }
  },
  {
    id: '3',
    firstName: 'David',
    lastName: 'Brown',
    email: 'david.brown@example.com',
    phone: '+1234567892',
    profileImage: 'https://images.pexels.com/photos/697509/pexels-photo-697509.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1',
    isActive: true,
    joinDate: '2024-02-10',
    package: { id: '1', name: 'Premium', price: 500 },
    rank: { id: '1', name: 'Bronze', level: 1 }
  },
  {
    id: '4',
    firstName: 'Sarah',
    lastName: 'Wilson',
    email: 'sarah.wilson@example.com',
    phone: '+1234567893',
    profileImage: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1',
    isActive: false,
    joinDate: '2024-02-15',
    package: { id: '3', name: 'Basic', price: 200 },
    rank: { id: '1', name: 'Bronze', level: 1 }
  },
  {
    id: '5',
    firstName: 'Michael',
    lastName: 'Johnson',
    email: 'michael.johnson@example.com',
    phone: '+1234567894',
    profileImage: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1',
    isActive: true,
    joinDate: '2024-02-20',
    package: { id: '2', name: 'Premium', price: 500 },
    rank: { id: '1', name: 'Bronze', level: 1 }
  }
];


// Binary Tree Data with BV (Business Volume) included
export const binaryTreeData: TreeNode = {
  user: enhancedUsers[0],
  totalLeftPV: 320,
  totalRightPV: 80,
  totalLeftBV: 1250,
  totalRightBV: 650,
  leftChild: {
    user: enhancedUsers[1],
    totalLeftPV: 150,
    totalRightPV: 40,
    totalLeftBV: 800,
    totalRightBV: 450,
    leftChild: {
      user: enhancedUsers[3],
      totalLeftPV: 0,
      totalRightPV: 0,
      totalLeftBV: 0,
      totalRightBV: 0
    },
    rightChild: {
      user: enhancedUsers[4],
      totalLeftPV: 0,
      totalRightPV: 0,
      totalLeftBV: 0,
      totalRightBV: 0
    }
  },
  rightChild: {
    user: enhancedUsers[2],
    totalLeftPV: 0,
    totalRightPV: 0,
    totalLeftBV: 0,
    totalRightBV: 0
  }
};

// Binary Tree Statistics
export const binaryTreeStats: BinaryTreeStats = {
  leftLegPV: 2450,
  rightLegPV: 1820,
  leftLegMembers: 15,
  rightLegMembers: 12,
  totalPairs: 142,
  monthlyPairs: 28,
  weeklyPairs: 7,
  unusedLeftPV: 630,
  unusedRightPV: 280
};

 
// Notifications
export const notifications: Notification[] = [
  {
    id: '1',
    title: 'New Team Member',
    message: 'Sarah Wilson joined your left leg',
    type: 'success',
    timestamp: '2024-03-15T10:30:00Z',
    read: false
  },
  {
    id: '2',
    title: 'Commission Earned',
    message: 'You earned $50 from binary bonus',
    type: 'success',
    timestamp: '2024-03-15T09:15:00Z',
    read: false
  },
  {
    id: '3',
    title: 'Rank Achievement',
    message: 'Congratulations! You achieved Silver rank',
    type: 'info',
    timestamp: '2024-03-14T14:20:00Z',
    read: true
  }
];


// Commissions
export const commissions: Commission[] = [
  {
    id: '1',
    type: 'Binary Bonus',
    amount: 125.50,
    fromUser: 'System',
    date: '2024-03-15',
    status: 'paid'
  },
  {
    id: '2',
    type: 'Direct Referral',
    amount: 75.00,
    fromUser: 'Jane Smith',
    date: '2024-03-14',
    status: 'paid'
  },
  {
    id: '3',
    type: 'Level Commission',
    amount: 25.00,
    fromUser: 'David Brown',
    date: '2024-03-13',
    status: 'pending'
  }
];

// Withdrawals
export const withdrawals: Withdrawal[] = [
  {
    id: '1',
    amount: 500.00,
    method: 'Bank Transfer',
    accountDetails: '**** **** **** 1234',
    date: '2024-03-10',
    status: 'completed',
    fees: 5.00
  },
  {
    id: '2',
    amount: 250.00,
    method: 'PayPal',
    accountDetails: 'user@example.com',
    date: '2024-03-08',
    status: 'processing',
    fees: 2.50
  }
];


// Packages
export const allPackages: Package[] = [
  {
    id: '1',
    name: 'Basic',
    price: 100,
    pv: 50,
    benefits: [
      'Access to basic products',
      '5% commission rate',
      'Basic support'
    ]
  },
  {
    id: '2',
    name: 'Premium',
    price: 300,
    pv: 200,
    benefits: [
      'Access to all products',
      '10% commission rate',
      'Priority support',
      'Marketing materials'
    ],
    isPopular: true
  },
  {
    id: '3',
    name: 'VIP',
    price: 500,
    pv: 400,
    benefits: [
      'Access to all products',
      '15% commission rate',
      'Premium support',
      'Marketing materials',
      'Personal mentor'
    ]
  }
];


// Ranks
export const allRanks: Rank[] = [
  {
    id: '1',
    name: 'Bronze',
    level: 1,
    requirements: {
      personalSales: 100,
      groupSales: 500,
      directReferrals: 2
    },
    benefits: [
      '5% commission rate',
      'Basic recognition'
    ],
    commissionRate: 0.05
  },
  {
    id: '2',
    name: 'Silver',
    level: 2,
    requirements: {
      personalSales: 300,
      groupSales: 1500,
      directReferrals: 5
    },
    benefits: [
      '8% commission rate',
      'Silver badge',
      'Monthly bonus'
    ],
    commissionRate: 0.08
  },
  {
    id: '3',
    name: 'Gold',
    level: 3,
    requirements: {
      personalSales: 500,
      groupSales: 3000,
      directReferrals: 10
    },
    benefits: [
      '12% commission rate',
      'Gold badge',
      'Quarterly bonus',
      'Leadership training'
    ],
    commissionRate: 0.12
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



 






