import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store';
import { LoginPage } from './components/auth/LoginPage';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { Layout } from './components/layout/Layout';
import { DashboardOverview } from './components/dashboard/DashboardOverview';
import { PackageList } from './components/packages/PackageList';
import { CountryList } from './components/countries/CountryList';
import { SystemSettings } from './components/settings/SystemSettings';

function App() {
  return (
    <Provider store={store}>
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route
            path="/*"
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route path="dashboard" element={<DashboardOverview />} />
            <Route path="packages" element={<PackageList />} />
            <Route path="countries" element={<CountryList />} />
            {/* <Route path="settings" element={<SystemSettings />} /> */}
          </Route>
        </Routes>
      </Router>
    </Provider>
  );
}

export default App;