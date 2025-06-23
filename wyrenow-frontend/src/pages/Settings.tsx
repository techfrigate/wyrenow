import React from 'react';
import { 
  Settings as SettingsIcon, 
  Moon, 
  Sun, 
  Globe, 
  Bell,
  Shield,
  Smartphone,
  Mail,
  Database
} from 'lucide-react';

export default function Settings() {
  const settingsStats = [
    {
      title: 'Theme',
      value: 'Dark Mode',
      status: 'Active',
      icon: Moon,
      color: 'bg-gray-600'
    },
    {
      title: 'Language',
      value: 'English',
      status: 'Default',
      icon: Globe,
      color: 'bg-blue-500'
    },
    {
      title: 'Notifications',
      value: 'Enabled',
      status: 'All channels',
      icon: Bell,
      color: 'bg-yellow-500'
    },
    {
      title: 'Security',
      value: '2FA Enabled',
      status: 'Secure',
      icon: Shield,
      color: 'bg-green-500'
    }
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-gradient-to-r from-gray-600 to-slate-600 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">Application Settings</h1>
            <p className="text-gray-100 mb-4">
              Customize your WyreNow experience with personalized settings and preferences
            </p>
            <div className="flex items-center space-x-4">
              <div className="bg-white/20 rounded-lg px-3 py-1">
                <span className="text-sm font-medium">Auto-sync: ON</span>
              </div>
              <div className="bg-white/20 rounded-lg px-3 py-1">
                <span className="text-sm font-medium">Backup: Daily</span>
              </div>
            </div>
          </div>
          <SettingsIcon className="w-16 h-16 text-white/80" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {settingsStats.map((stat, index) => (
          <div
            key={stat.title}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
              <span className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-gray-600 dark:text-gray-400">
                {stat.status}
              </span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
              {stat.value}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">{stat.title}</p>
          </div>
        ))}
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-sm border border-gray-200 dark:border-gray-700 text-center">
        <div className="w-24 h-24 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-6">
          <SettingsIcon className="w-12 h-12 text-gray-600 dark:text-gray-400" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Advanced Settings Coming Soon!
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-2xl mx-auto">
          Comprehensive settings panel with theme customization, notification preferences, 
          security options, language settings, and data management tools.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8">
          <div className="p-6 border border-gray-200 dark:border-gray-700 rounded-lg">
            <Sun className="w-8 h-8 text-gray-600 dark:text-gray-400 mx-auto mb-3" />
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Appearance</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Theme and display customization
            </p>
          </div>
          <div className="p-6 border border-gray-200 dark:border-gray-700 rounded-lg">
            <Smartphone className="w-8 h-8 text-gray-600 dark:text-gray-400 mx-auto mb-3" />
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Mobile Settings</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Mobile app preferences and sync
            </p>
          </div>
          <div className="p-6 border border-gray-200 dark:border-gray-700 rounded-lg">
            <Mail className="w-8 h-8 text-gray-600 dark:text-gray-400 mx-auto mb-3" />
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Communications</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Email and notification settings
            </p>
          </div>
          <div className="p-6 border border-gray-200 dark:border-gray-700 rounded-lg">
            <Database className="w-8 h-8 text-gray-600 dark:text-gray-400 mx-auto mb-3" />
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Data Management</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Backup and export options
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}