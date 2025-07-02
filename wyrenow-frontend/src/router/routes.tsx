// src/routes/routes.ts
import React from 'react';
import { Navigate } from 'react-router-dom';
import LoginForm from '../components/Auth/LoginForm';
import ProtectedRoute from './ProtectedRoute';
import Layout from '../components/Layout/Layout';
import Dashboard from '../pages/Dashboard';
import BinaryTree from '../pages/BinaryTree';
import Team from '../pages/Team';
import Packages from '../pages/Packages';
import Earnings from '../pages/Earnings';
import Wallet from '../pages/Wallet';
import Bonuses from '../pages/Bonuses';
import Retail from '../pages/Retail';
import Repurchase from '../pages/Repurchase';
import ServiceCenter from '../pages/ServiceCenter';
import Ranks from '../pages/Ranks';
import Leadership from '../pages/Leadership';
import Pools from '../pages/Pools';
import Reports from '../pages/Reports';
import Analytics from '../pages/Analytics';
import Profile from '../pages/Profile';
import Settings from '../pages/Settings';
import SponsorDashboard from '../pages/SponsorDashboard';
import UserRegistration from '../pages/UserRegistration';
import WalletManagement from '../pages/WalletManagement';
import RepurchaseManagement from '../pages/RepurchaseManagement';
import SponsorReports from '../pages/SponsorReports';

const protectedElement = (element: React.ReactNode) => (
  <ProtectedRoute> {element as JSX.Element} </ProtectedRoute>
);

export const routes = [
  {
    path: '/login',
    element: <LoginForm />,
  },
  {
    path: '/',
    element: protectedElement(<Layout />),
    children: [
      { path: 'dashboard', element: <Dashboard /> },
      { path: 'binary-tree', element: <BinaryTree /> },
      { path: 'team', element: <Team /> },
      { path: 'packages', element: <Packages /> },
      { path: 'earnings', element: <Earnings /> },
      { path: 'wallet', element: <Wallet /> },
      { path: 'bonuses', element: <Bonuses /> },
      { path: 'retail', element: <Retail /> },
      { path: 'repurchase', element: <Repurchase /> },
      { path: 'service-center', element: <ServiceCenter /> },
      { path: 'ranks', element: <Ranks /> },
      { path: 'leadership', element: <Leadership /> },
      { path: 'pools', element: <Pools /> },
      { path: 'reports', element: <Reports /> },
      { path: 'analytics', element: <Analytics /> },
      { path: 'profile', element: <Profile /> },
      { path: 'settings', element: <Settings /> },
      { path: 'sponsor-dashboard', element: <SponsorDashboard /> },
      { path: 'user-registration', element: <UserRegistration /> },
      { path: 'wallet-management', element: <WalletManagement /> },
      { path: 'repurchase-management', element: <RepurchaseManagement /> },
      { path: 'sponsor-reports', element: <SponsorReports /> },
    ],
  },
  {
    path: '*',
    element: <Navigate to="/dashboard" replace />,
  },
];
