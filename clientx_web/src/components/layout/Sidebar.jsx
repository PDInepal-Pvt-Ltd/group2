import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  Briefcase, 
  CheckSquare, 
  Settings,
  Bell 
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Sidebar = () => {
  const { user } = useAuth();
  const role = user?.role || 'employee';

  const menuItems = {
    admin: [
      { path: '/admin', label: 'Dashboard', icon: LayoutDashboard },
      { path: '/admin/users', label: 'Users', icon: Users },
      { path: '/projects', label: 'Projects', icon: Briefcase },
      { path: '/tasks', label: 'Tasks', icon: CheckSquare },
      { path: '/notifications', label: 'Notifications', icon: Bell },
      { path: '/reports', label: 'Reports', icon: Bell }, // Placeholder
    ],
    manager: [
      { path: '/manager', label: 'Dashboard', icon: LayoutDashboard },
      { path: '/projects', label: 'Projects', icon: Briefcase },
      { path: '/tasks', label: 'Tasks', icon: CheckSquare },
      { path: '/notifications', label: 'Notifications', icon: Bell },
    ],
    client: [
      { path: '/client', label: 'Dashboard', icon: LayoutDashboard },
      { path: '/projects', label: 'My Projects', icon: Briefcase },
      { path: '/tasks', label: 'My Tasks', icon: CheckSquare },
      { path: '/notifications', label: 'Notifications', icon: Bell },
    ],
    employee: [
      { path: '/employee', label: 'Dashboard', icon: LayoutDashboard },
      { path: '/tasks', label: 'My Tasks', icon: CheckSquare },
      { path: '/notifications', label: 'Notifications', icon: Bell },
    ]
  };

  const navItems = menuItems[role] || menuItems.employee;

  return (
    <div className="w-64 bg-[var(--surface-color)] h-screen fixed left-0 top-0 border-r border-[#333] flex flex-col">
      <div className="p-6">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-[var(--primary-color)] to-[var(--secondary-color)] bg-clip-text text-transparent">
          ClientX
        </h1>
      </div>
      
      <nav className="flex-1 px-4 py-4 space-y-2">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => `
              flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200
              ${isActive 
                ? 'bg-[var(--primary-color)] text-white shadow-lg shadow-purple-900/40' 
                : 'text-[var(--text-secondary)] hover:bg-[#333] hover:text-white'
              }
            `}
          >
            <item.icon size={20} />
            <span className="font-medium">{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-[#333]">
        <div className="flex items-center gap-3 px-4 py-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[var(--primary-color)] to-[var(--secondary-color)] flex items-center justify-center text-sm font-bold">
                {user?.username?.[0]?.toUpperCase() || 'U'}
            </div>
            <div className="flex-1">
                <p className="text-sm font-medium text-white truncate">{user?.username}</p>
                <p className="text-xs text-[var(--text-secondary)] capitalize">{role}</p>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
