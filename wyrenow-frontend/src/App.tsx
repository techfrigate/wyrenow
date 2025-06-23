import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Layout from './components/Layout/Layout';
import LoginForm from './components/Auth/LoginForm';
import Dashboard from './pages/Dashboard';
// Update the import paths below to the correct files where these components are defined
import BinaryTree from './pages/BinaryTree';
import Team from './pages/Team';
import Packages from './pages/Packages';
import Earnings from './pages/Earnings';
import Wallet from './pages/Wallet';
import Bonuses from './pages/Bonuses';
import { AppProvider } from './contexts/AppContext';
import Retail from './pages/Retail';
import Repurchase from './pages/Repurchase';
import ServiceCenter from './pages/ServiceCenter';
import Ranks from './pages/Ranks';
import Leadership from './pages/Leadership';
import Pools from './pages/Pools';
import Reports from './pages/Reports';
import Analytics from './pages/Analytics';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import SponsorDashboard from './pages/SponsorDashboard';
import UserRegistration from './pages/UserRegistration';
import WalletManagement from './pages/WalletManagement';
import RepurchaseManagement from './pages/RepurchaseManagement';
import SponsorReports from './pages/SponsorReports';
function ProtectedRoute({ children }: React.PropsWithChildren<{}>) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading WyreNow...</p>
        </div>
      </div>
    );
  }

  return user ? children : <Navigate to="/login" replace />;
}

function AppContent() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading WyreNow...</p>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route
          path="/login"
          element={user ? <Navigate to="/dashboard" replace /> : <LoginForm />}
        />
       
        {/* Root redirect */}
        <Route
          path="/"
          element={<Navigate to={user ? "/dashboard" : "/login"} replace />}
        />

        {/* Protected Routes with Layout */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="binary-tree" element={<BinaryTree />} />
          <Route path="team" element={<Team />} />
          <Route path="packages" element={<Packages />} />
          <Route path="earnings" element={<Earnings />} />
          <Route path="wallet" element={<Wallet />} />
          <Route path="bonuses" element={<Bonuses />} />
            <Route path="sponsor-dashboard" element={<SponsorDashboard />} />
                  <Route path="user-registration" element={<UserRegistration />} />
                  <Route path="wallet-management" element={<WalletManagement />} />
                  <Route path="repurchase-management" element={<RepurchaseManagement />} />
                  <Route path="sponsor-reports" element={<SponsorReports />} />
        
          <Route 
            path="retail" 
            element={
               <Retail/>
            } 
          />
          <Route 
            path="repurchase" 
            element={
               <Repurchase/>
            } 
          />
          <Route 
            path="service-center" 
            element={
              <ServiceCenter/>
            } 
          />
          <Route 
            path="ranks" 
            element={
            <Ranks/>
            } 
          />
          <Route 
            path="leadership" 
            element={
              <Leadership/>
            } 
          />
          <Route 
            path="pools" 
            element={
               <Pools/>
            } 
          />
          <Route 
            path="reports" 
            element={
              <Reports/>
            } 
          />
          <Route 
            path="analytics" 
            element={
              <Analytics/>
            } 
          />
          <Route 
            path="profile" 
            element={
            <Profile/>
            } 
          />
          <Route 
            path="settings" 
            element={
             <Settings/>
            } 
          />
        </Route>

        {/* Catch all route */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Router>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppProvider>
      <AppContent />
      </AppProvider>
    </AuthProvider>
  );
}

export default App;