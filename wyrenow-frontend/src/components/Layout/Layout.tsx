import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { useAppSelector } from "../../hooks/redux";
import LoadingScreen from "./LoadingScreen";

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { loading } = useAppSelector((state) => state.auth);
  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 flex flex-col overflow-hidden lg:ml-0">
        <Header onMenuClick={() => setSidebarOpen(true)} />

        <main className="flex-1  overflow-x-hidden overflow-y-auto p-4">
          <div className="max-w-full  mx-auto">
              <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
