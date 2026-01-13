import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { LogOut, Bell, Search } from 'lucide-react';
import Button from '../ui/Button';

const Header = ({ title }) => {
  const { logout } = useAuth();

  return (
    <header className="h-16 bg-[var(--surface-color)] border-b border-[#333] flex items-center justify-between px-8 sticky top-0 z-10">
      <h2 className="text-xl font-bold text-[var(--text-primary)]">{title}</h2>
      
      <div className="flex items-center gap-4">
        {/* Search Bar - Placeholder */}
        <div className="relative hidden md:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
            <input 
                type="text" 
                placeholder="Search..." 
                className="pl-10 pr-4 py-2 bg-[#121212] rounded-full text-sm border border-[#333] focus:outline-none focus:border-[var(--primary-color)] w-64 transition-all"
            />
        </div>

        <Link to="/notifications" className="p-2 text-[var(--text-secondary)] hover:text-white transition-colors relative">
            <Bell size={20} />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </Link>

        <Button 
            variant="outline" 
            onClick={logout} 
            className="flex items-center gap-2 !px-3 !py-1 text-sm border-red-500/50 text-red-400 hover:bg-red-500/10 hover:text-red-300"
        >
          <LogOut size={16} />
          <span>Logout</span>
        </Button>
      </div>
    </header>
  );
};

export default Header;
