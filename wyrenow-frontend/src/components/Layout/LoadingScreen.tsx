import React, { useState, useEffect } from 'react';
import { Crown, Zap, TrendingUp, Users } from 'lucide-react';

interface LoadingScreenProps {
  variant?: 'default' | 'pulse' | 'orbit' | 'wave' | 'gradient';
  message?: string;
  progress?: number;
  showProgress?: boolean;
  showTips?: boolean;
}

const loadingTips = [
  "Building your MLM empire...",
  "Calculating your binary tree...",
  "Syncing your earnings...",
  "Loading your team data...",
  "Preparing your dashboard...",
  "Optimizing your bonuses...",
  "Connecting to WyreNow network...",
  "Securing your wallet...",
];

export default function LoadingScreen({ 
  variant = 'default', 
  message = 'Loading WyreNow...',
  progress,
  showProgress = false,
  showTips = true
}: LoadingScreenProps) {
  const [currentTip, setCurrentTip] = useState(0);
  const [dots, setDots] = useState('');

  useEffect(() => {
    if (showTips) {
      const tipInterval = setInterval(() => {
        setCurrentTip((prev) => (prev + 1) % loadingTips.length);
      }, 2000);
      return () => clearInterval(tipInterval);
    }
  }, [showTips]);

  useEffect(() => {
    const dotInterval = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? '' : prev + '.'));
    }, 500);
    return () => clearInterval(dotInterval);
  }, []);

  const renderLoader = () => {
    switch (variant) {
      case 'pulse':
        return <PulseLoader />;
      case 'orbit':
        return <OrbitLoader />;
      case 'wave':
        return <WaveLoader />;
      case 'gradient':
        return <GradientLoader />;
      default:
        return <DefaultLoader />;
    }
  };

  return (
    <div className="w-full h-full relative  bg-gradient-to-br from-primary-50 via-white to-secondary-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5 border border-green-500">
        <div className="absolute top-10 left-10 w-20 h-20 bg-primary-500 rounded-full animate-pulse"></div>
        <div className="absolute top-32 right-20 w-16 h-16 bg-secondary-500 rounded-full animate-pulse delay-1000"></div>
        <div className="absolute bottom-20 left-32 w-12 h-12 bg-accent-500 rounded-full animate-pulse delay-2000"></div>
        <div className="absolute bottom-32 right-10 w-24 h-24 bg-gold-500 rounded-full animate-pulse delay-500"></div>
      </div>

      <div className="text-center max-w-md mx-auto px-6">

        {/* Loader Animation */}
        <div className="relative mb-8 flex items-center justify-center">
          {renderLoader()}
        </div>

        {/* Loading Message */}
        <div className="mb-6">
          <p className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">
            {message}{dots}
          </p>
          {showTips && (
            <p className="text-sm text-gray-600 dark:text-gray-400 animate-fade-in">
              {loadingTips[currentTip]}
            </p>
          )}
        </div>

        {/* Progress Bar */}
        {showProgress && progress !== undefined && (
          <div className="mb-6">
            <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
              <span>Loading...</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
              <div 
                className="h-2 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full transition-all duration-300 ease-out"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        )}

        {/* Feature Icons */}
        <div className="flex justify-center space-x-6 opacity-60">
          <div className="flex flex-col items-center">
            <div className="w-8 h-8 bg-primary-100 dark:bg-primary-900/30 rounded-lg flex items-center justify-center mb-1">
              <TrendingUp className="w-4 h-4 text-primary-600 dark:text-primary-400" />
            </div>
            <span className="text-xs text-gray-500 dark:text-gray-400">Earnings</span>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-8 h-8 bg-secondary-100 dark:bg-secondary-900/30 rounded-lg flex items-center justify-center mb-1">
              <Users className="w-4 h-4 text-secondary-600 dark:text-secondary-400" />
            </div>
            <span className="text-xs text-gray-500 dark:text-gray-400">Team</span>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-8 h-8 bg-accent-100 dark:bg-accent-900/30 rounded-lg flex items-center justify-center mb-1">
              <Zap className="w-4 h-4 text-accent-600 dark:text-accent-400" />
            </div>
            <span className="text-xs text-gray-500 dark:text-gray-400">Growth</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// Default Spinner Loader
function DefaultLoader() {
  return (
    <div className="relative">
      <div className="w-16 h-16 border-4 border-gray-200 dark:border-gray-700 border-t-primary-600 rounded-full animate-spin"></div>
      <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-r-secondary-600 rounded-full animate-spin animate-reverse"></div>
    </div>
  );
}

// Pulse Loader
function PulseLoader() {
  return (
    <div className="flex space-x-2">
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className="w-4 h-4 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full animate-pulse"
          style={{ animationDelay: `${i * 0.2}s` }}
        ></div>
      ))}
    </div>
  );
}

// Orbit Loader
function OrbitLoader() {
  return (
    <div className="relative w-16 h-16">
      <div className="absolute inset-0 border-2 border-gray-200 dark:border-gray-700 rounded-full"></div>
      <div className="absolute inset-0 border-2 border-transparent border-t-primary-500 rounded-full animate-spin"></div>
      <div className="absolute inset-2 border-2 border-transparent border-t-secondary-500 rounded-full animate-spin animate-reverse"></div>
      <div className="absolute inset-4 border-2 border-transparent border-t-accent-500 rounded-full animate-spin"></div>
    </div>
  );
}

// Wave Loader
function WaveLoader() {
  return (
    <div className="flex items-end space-x-1">
      {[0, 1, 2, 3, 4].map((i) => (
        <div
          key={i}
          className="w-2 bg-gradient-to-t from-primary-500 to-secondary-500 rounded-full animate-bounce"
          style={{ 
            height: '20px',
            animationDelay: `${i * 0.1}s`,
            animationDuration: '0.6s'
          }}
        ></div>
      ))}
    </div>
  );
}

// Gradient Loader
function GradientLoader() {
  return (
    <div className="relative w-16 h-16">
      <div className="absolute inset-0 bg-gradient-to-r from-primary-500 via-secondary-500 to-accent-500 rounded-full animate-spin opacity-75"></div>
      <div className="absolute inset-1 bg-white dark:bg-gray-800 rounded-full"></div>
      <div className="absolute inset-3 bg-gradient-to-r from-primary-400 to-secondary-400 rounded-full animate-pulse"></div>
    </div>
  );
}