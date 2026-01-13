import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import DashboardLayout from './components/layout/DashboardLayout';
import Login from './pages/auth/Login';
import Loader from './components/ui/Loader';
import AddUser from './pages/admin/AddUser';

import AdminDashboard from './pages/admin/AdminDashboard';
import AdminUsers from './pages/admin/AdminUsers';
import ManagerDashboard from './pages/manager/ManagerDashboard';
import ClientDashboard from './pages/client/ClientDashboard';
import EmployeeDashboard from './pages/employee/EmployeeDashboard';
import ProjectList from './pages/projects/ProjectList';
import ProjectDetails from './pages/projects/ProjectDetails';
import TaskList from './pages/tasks/TaskList';
import Notifications from './pages/shared/Notifications';

const Projects = ProjectList;
const Tasks = TaskList;

const DashboardRedirect = () => {
    const { user, loading } = useAuth();
    if (loading) return <Loader className="h-screen w-screen" />;
    
    if (!user) return <Navigate to="/login" />;

    switch (user.role) {
        case 'admin': return <Navigate to="/admin" />;
        case 'manager': return <Navigate to="/manager" />;
        case 'client': return <Navigate to="/client" />;
        case 'employee': return <Navigate to="/employee" />;
        default: return <Navigate to="/employee" />;
    }
};

const App = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      
      <Route path="/" element={<DashboardLayout />}>
        <Route index element={<DashboardRedirect />} />
        
        {/* Admin Routes */}
        <Route path="admin" element={<AdminDashboard />} />
        <Route path="admin/users" element={<AdminUsers />} />
        <Route path="admin/add-user" element={<AddUser />} />
        
        {/* Manager Routes */}
        <Route path="manager" element={<ManagerDashboard />} />
        
        {/* Client Routes */}
        <Route path="client" element={<ClientDashboard />} />
        
        {/* Employee Routes */}
        <Route path="employee" element={<EmployeeDashboard />} />
        
        {/* Shared Routes */}
        <Route path="projects" element={<Projects />} />
        <Route path="projects/:id" element={<ProjectDetails />} />
        <Route path="tasks" element={<Tasks />} />
        <Route path="notifications" element={<Notifications />} />
        <Route path="reports" element={<div>Reports</div>} />
      </Route>
      
      {/* Catch all */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

export default App;
