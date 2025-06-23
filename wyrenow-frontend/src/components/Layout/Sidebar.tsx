import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Home, 
  Package, 
  Users, 
  TrendingUp, 
  Wallet, 
  Award, 
  ShoppingBag, 
  BarChart3,
  Settings,
  User,
  Crown,
  GitBranch,
  Repeat,
  FileText,
  Store,
  Trophy,
  DollarSign,
  UserPlus,
  CreditCard
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const menuItems = [
  { path: '/dashboard', icon: Home, label: 'Dashboard', group: 'main' },
  { path: '/binary-tree', icon: GitBranch, label: 'Binary Tree', group: 'main' },
  { path: '/team', icon: Users, label: 'My Team', group: 'main' },
  
  { path: '/packages', icon: Package, label: 'Packages', group: 'business' },
  { path: '/earnings', icon: TrendingUp, label: 'Earnings', group: 'business' },
  { path: '/wallet', icon: Wallet, label: 'Wallet', group: 'business' },
  { path: '/bonuses', icon: DollarSign, label: 'Bonuses', group: 'business' },
  
  // { path: '/sponsor-dashboard', icon: UserPlus, label: 'Sponsor Dashboard', group: 'sponsor' },
  { path: '/user-registration', icon: Users, label: 'Register User', group: 'sponsor' },
  { path: '/wallet-management', icon: CreditCard, label: 'Wallet Management', group: 'sponsor' },
  { path: '/repurchase-management', icon: Repeat, label: 'Repurchase Management', group: 'sponsor' },
  { path: '/sponsor-reports', icon: BarChart3, label: 'Sponsor Reports', group: 'sponsor' },
  
  { path: '/retail', icon: ShoppingBag, label: 'Retail', group: 'sales' },
  // { path: '/repurchase', icon: Repeat, label: 'Repurchase', group: 'sales' },
  { path: '/service-center', icon: Store, label: 'Service Center', group: 'sales' },
  
  { path: '/ranks', icon: Award, label: 'Ranks & Awards', group: 'achievements' },
  { path: '/leadership', icon: Crown, label: 'Leadership', group: 'achievements' },
  { path: '/pools', icon: Trophy, label: 'Leadership Pools', group: 'achievements' },
  
  // { path: '/reports', icon: BarChart3, label: 'Reports', group: 'analytics' },
  { path: '/analytics', icon: FileText, label: 'Analytics', group: 'analytics' },
  
  { path: '/profile', icon: User, label: 'Profile', group: 'account' },
  { path: '/settings', icon: Settings, label: 'Settings', group: 'account' },
];

const groupLabels = {
  main: 'Main',
  business: 'Business',
  sponsor: 'Sponsor Activities',
  sales: 'Sales',
  achievements: 'Achievements',
  analytics: 'Analytics',
  account: 'Account'
};

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const groupedItems = menuItems.reduce((acc, item) => {
    if (!acc[item.group]) {
      acc[item.group] = [];
    }
    acc[item.group].push(item);
    return acc;
  }, {} as Record<string, typeof menuItems>);

  return (
    <>
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}
      
      <aside className={`
        fixed top-0 left-0 z-50 h-full w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:static lg:z-0
      `}>
        <div className="h-full flex flex-col">
          {/* Logo */}
          <div className="p-6 border-b border-gray-200 dark:border-gray-800">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center">
                <Crown className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">WyreNow</h1>
                <p className="text-xs text-gray-500 dark:text-gray-400">MLM Platform</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto py-4">
            <div className="px-3 space-y-6">
              {Object.entries(groupedItems).map(([group, items]) => (
                <div key={group}>
                  <h3 className="px-3 text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2">
                    {groupLabels[group as keyof typeof groupLabels]}
                  </h3>
                  <div className="space-y-1">
                    {items.map((item) => (
                      <NavLink
                        key={item.path}
                        to={item.path}
                        onClick={onClose}
                        className={({ isActive }) => `
                          flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200
                          ${isActive 
                            ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 border-r-2 border-primary-600 dark:border-primary-400' 
                            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                          }
                        `}
                      >
                        <item.icon className="w-5 h-5 mr-3" />
                        {item.label}
                      </NavLink>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-800">
            <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
              <p>© 2024 WyreNow MLM</p>
              <p>Version 1.0.0</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}