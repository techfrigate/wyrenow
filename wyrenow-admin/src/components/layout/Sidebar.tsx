import React from 'react';
import { NavLink } from 'react-router-dom';
import { BarChart3, Globe, Package, Settings, Home } from 'lucide-react';

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: Home, path: '/dashboard' },
  { id: 'packages', label: 'Package Management', icon: Package, path: '/packages' },
  { id: 'countries', label: 'Country Management', icon: Globe, path: '/countries' },
  // { id: 'settings', label: 'Settings', icon: Settings, path: '/settings' }
];

export function Sidebar() {
  return (
    <div className="bg-gray-900 text-white w-64 min-h-screen">
      <div className="p-6">
        <div className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            
            return (
              <NavLink
                key={item.id}
                to={item.path}
                className={({ isActive }) =>
                  `w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                    isActive 
                      ? 'bg-blue-600 text-white' 
                      : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                  }`
                }
              >
                <Icon className="mr-3 h-5 w-5" />
                {item.label}
              </NavLink>
            );
          })}
        </div>
      </div>
    </div>
  );
}