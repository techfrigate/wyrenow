import React from 'react';
import { 
  Crown, 
  Award, 
  Target, 
  TrendingUp, 
  Star,
  Trophy,
  Car,
  Home,
  Coins
} from 'lucide-react';

export default function Ranks() {
  const currentRank = {
    name: 'Promoter',
    requirement: '1,500 PV (both legs)',
    package: 'Expert',
    reward: '₦70,000',
    progress: 65,
    nextRank: 'Associate'
  };

  const upcomingRanks = [
    { name: 'Associate', requirement: '4,000 PV', package: 'Expert', reward: '₦150,000' },
    { name: 'Senior Associate', requirement: '10,000 PV', package: 'Expert', reward: '₦300,000' },
    { name: 'Manager', requirement: '30,000 PV', package: 'Master', reward: '₦1,000,000' },
    { name: 'Senior Manager', requirement: '70,000 PV', package: 'Legend', reward: '₦2,000,000' }
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">Ranks & Awards System</h1>
            <p className="text-purple-100 mb-4">
              Achieve higher ranks, unlock cash rewards, and build leadership recognition
            </p>
            <div className="flex items-center space-x-4">
              <div className="bg-white/20 rounded-lg px-3 py-1">
                <span className="text-sm font-medium">Current: {currentRank.name}</span>
              </div>
              <div className="bg-white/20 rounded-lg px-3 py-1">
                <span className="text-sm font-medium">Progress: {currentRank.progress}%</span>
              </div>
            </div>
          </div>
          <Crown className="w-16 h-16 text-white/80" />
        </div>
      </div>

      {/* Current Rank Progress */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Current Rank Progress</h3>
          <div className="flex items-center space-x-2">
            <Crown className="w-5 h-5 text-purple-600" />
            <span className="text-purple-600 font-medium">{currentRank.name}</span>
          </div>
        </div>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-600 dark:text-gray-400">Progress to {currentRank.nextRank}</span>
              <span className="text-gray-900 dark:text-white font-medium">{currentRank.progress}%</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-purple-600 to-pink-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${currentRank.progress}%` }}
              ></div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <span className="text-gray-600 dark:text-gray-400">Requirement:</span>
              <p className="font-medium text-gray-900 dark:text-white">{currentRank.requirement}</p>
            </div>
            <div>
              <span className="text-gray-600 dark:text-gray-400">Package Required:</span>
              <p className="font-medium text-gray-900 dark:text-white">{currentRank.package}</p>
            </div>
            <div>
              <span className="text-gray-600 dark:text-gray-400">Cash Reward:</span>
              <p className="font-medium text-green-600">{currentRank.reward}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-sm border border-gray-200 dark:border-gray-700 text-center">
        <div className="w-24 h-24 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
          <Crown className="w-12 h-12 text-purple-600 dark:text-purple-400" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Ranks & Awards System Coming Soon!
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-2xl mx-auto">
          Advance through 11 prestigious ranks from Promoter to Global Icon. Earn substantial cash rewards, 
          unlock the 3rd leg, and receive luxury bonuses including cars and houses.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8">
          <div className="p-6 border border-gray-200 dark:border-gray-700 rounded-lg">
            <Trophy className="w-8 h-8 text-purple-600 dark:text-purple-400 mx-auto mb-3" />
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">11 Ranks</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Promoter to Global Icon progression
            </p>
          </div>
          <div className="p-6 border border-gray-200 dark:border-gray-700 rounded-lg">
            <Coins className="w-8 h-8 text-purple-600 dark:text-purple-400 mx-auto mb-3" />
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Cash Rewards</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Up to ₦100M for Global Icon
            </p>
          </div>
          <div className="p-6 border border-gray-200 dark:border-gray-700 rounded-lg">
            <Car className="w-8 h-8 text-purple-600 dark:text-purple-400 mx-auto mb-3" />
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Luxury Car</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              ₦25M car for 1 Star Director
            </p>
          </div>
          <div className="p-6 border border-gray-200 dark:border-gray-700 rounded-lg">
            <Home className="w-8 h-8 text-purple-600 dark:text-purple-400 mx-auto mb-3" />
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Dream House</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              ₦50M house for 2 Star Director
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}