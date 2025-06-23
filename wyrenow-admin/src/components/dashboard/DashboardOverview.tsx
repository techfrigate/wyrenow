import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Package, Globe, Users, Activity, Plus, Download, Settings } from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { useAppSelector } from '../../hooks/useAppSelector';
import { fetchDashboardStats } from '../../store/slices/dashboardSlice';
import { formatDistanceToNow } from 'date-fns';

export function DashboardOverview() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { stats, loading } = useAppSelector((state) => state.dashboard);

  useEffect(() => {
    dispatch(fetchDashboardStats());
  }, [dispatch]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white p-6 rounded-lg shadow animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-8 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!stats) return null;

  const statCards = [
    {
      title: 'Total Packages',
      value: stats.totalPackages,
      subtitle: `${stats.activePackages} active`,
      icon: Package,
      color: 'blue',
      onClick: () => navigate('/packages')
    },
    {
      title: 'Countries',
      value: stats.totalCountries,
      subtitle: 'Configured regions',
      icon: Globe,
      color: 'green',
      onClick: () => navigate('/countries')
    },
    {
      title: 'Total Regions',
      value: stats.totalRegions,
      subtitle: 'All states/regions',
      icon: Users,
      color: 'purple',
      onClick: () => navigate('/countries')
    },
    {
      title: 'Recent Activity',
      value: stats.recentActivity.length,
      subtitle: 'Last 24 hours',
      icon: Activity,
      color: 'orange',
      onClick: () => {}
    }
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
          <p className="text-gray-600">Manage your MLM system configuration</p>
        </div>
        <div className="flex space-x-3">
          <Button
            variant="secondary"
            onClick={() => {}}
          >
            <Download className="w-4 h-4 mr-2" />
            Export Data
          </Button>
          <Button onClick={() => navigate('/packages')}>
            <Plus className="w-4 h-4 mr-2" />
            Add Package
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          const colorClasses = {
            blue: 'bg-blue-500 text-blue-100',
            green: 'bg-green-500 text-green-100',
            purple: 'bg-purple-500 text-purple-100',
            orange: 'bg-orange-500 text-orange-100'
          };

          return (
            <div
              key={index}
              className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow cursor-pointer"
              onClick={stat.onClick}
            >
              <div className="flex items-center">
                <div className={`p-3 rounded-lg ${colorClasses[stat.color as keyof typeof colorClasses]}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  <p className="text-xs text-gray-500">{stat.subtitle}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card title="Recent Activity" subtitle="Latest system changes">
          <div className="space-y-4">
            {stats.recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <Activity className="w-4 h-4 text-blue-600" />
                  </div>
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-900">{activity.description}</p>
                  <p className="text-xs text-gray-500">
                    by {activity.adminName} • {formatDistanceToNow(activity.timestamp, { addSuffix: true })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card title="Quick Actions" subtitle="Common administrative tasks">
          <div className="space-y-3">
            <Button
              variant="ghost"
              className="w-full justify-start"
              onClick={() => navigate('/packages')}
            >
              <Package className="w-4 h-4 mr-3" />
              Create New Package
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start"
              onClick={() => navigate('/countries')}
            >
              <Globe className="w-4 h-4 mr-3" />
              Add Country/Region
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start"
              onClick={() => navigate('/settings')}
            >
              <Settings className="w-4 h-4 mr-3" />
              System Settings
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}