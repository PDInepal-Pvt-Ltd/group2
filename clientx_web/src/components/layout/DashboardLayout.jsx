import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import { useAuth } from '../../context/AuthContext';
import Loader from '../ui/Loader';

const DashboardLayout = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="h-screen w-screen flex items-center justify-center bg-[var(--background-color)]"><Loader size={48} /></div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="flex h-screen bg-[var(--background-color)] overflow-hidden">
        <Sidebar />
        <div className="flex-1 flex flex-col ml-64 h-full relative">
            <Header title="Dashboard" /> {/* Dynamic title? */}
            <main className="flex-1 overflow-y-auto p-8">
                <Outlet />
            </main>
        </div>
    </div>
  );
};

export default DashboardLayout;
