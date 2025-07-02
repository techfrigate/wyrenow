import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useRoutes
} from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import Layout from "./components/Layout/Layout";
import LoginForm from "./components/Auth/LoginForm";
import { AppProvider } from "./contexts/AppContext";
import { Toaster } from "react-hot-toast";
import { routes } from "./router/routes";
 



function AppContent() {
  const routing = useRoutes(routes);

  return (
    <>
      <Toaster position="top-right" />
      {routing}
    </>
  );
}


function App() {
  return (
     <Router> 
    <AuthProvider>
      <AppProvider>
        <AppContent />
      </AppProvider>
    </AuthProvider>
    </Router>
  );
}

export default App;
