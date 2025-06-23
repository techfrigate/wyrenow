import React from 'react';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Camera,
  Edit3,
  Shield,
  Bell,
  Key,
  Calendar
} from 'lucide-react';

export default function Profile() {
  const profileStats = [
    {
      title: 'Account Status',
      value: 'Verified',
      status: 'Active',
      icon: Shield,
      color: 'bg-green-500'
    },
    {
      title: 'Member Since',
      value: 'Jan 2024',
      status: '6 months',
      icon: Calendar,
      color: 'bg-blue-500'
    },
    {
      title: 'Profile Completion',
      value: '85%',
      status: 'Almost done',
      icon: User,
      color: 'bg-orange-500'
    },
    {
      title: 'Security Level',
      value: 'High',
      status: '2FA Enabled',
      icon: Key,
      color: 'bg-purple-500'
    }
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">Profile Management</h1>
            <p className="text-blue-100 mb-4">
              Manage your personal information, security settings, and account preferences
            </p>
            <div className="flex items-center space-x-4">
              <div className="bg-white/20 rounded-lg px-3 py-1">
                <span className="text-sm font-medium">Profile: 85% Complete</span>
              </div>
              <div className="bg-white/20 rounded-lg px-3 py-1">
                <span className="text-sm font-medium">Status: Verified</span>
              </div>
            </div>
          </div>
          <User className="w-16 h-16 text-white/80" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {profileStats.map((stat, index) => (
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
        <div className="w-24 h-24 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
          <User className="w-12 h-12 text-blue-600 dark:text-blue-400" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Profile Management Coming Soon!
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-2xl mx-auto">
          Complete profile management system with personal information editing, profile photo upload, 
          security settings, and account preferences customization.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8">
          <div className="p-6 border border-gray-200 dark:border-gray-700 rounded-lg">
            <Edit3 className="w-8 h-8 text-blue-600 dark:text-blue-400 mx-auto mb-3" />
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Personal Info</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Edit contact and personal details
            </p>
          </div>
          <div className="p-6 border border-gray-200 dark:border-gray-700 rounded-lg">
            <Camera className="w-8 h-8 text-blue-600 dark:text-blue-400 mx-auto mb-3" />
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Profile Photo</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Upload and manage profile image
            </p>
          </div>
          <div className="p-6 border border-gray-200 dark:border-gray-700 rounded-lg">
            <Shield className="w-8 h-8 text-blue-600 dark:text-blue-400 mx-auto mb-3" />
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Security</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Password and 2FA management
            </p>
          </div>
          <div className="p-6 border border-gray-200 dark:border-gray-700 rounded-lg">
            <Bell className="w-8 h-8 text-blue-600 dark:text-blue-400 mx-auto mb-3" />
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Notifications</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Customize notification preferences
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}