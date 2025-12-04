import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/context/AuthContext';
import { Search, Bell, Menu, Sun, Moon, ChevronRight, User, LogOut, Settings, ImagePlus } from 'lucide-react';

interface HeaderProps {
  toggleSidebar: () => void;
  isDarkMode: boolean;
  toggleTheme: () => void;
  breadcrumbs: string[];
  onOpenMedia?: () => void;
}

const Header: React.FC<HeaderProps> = ({ toggleSidebar, isDarkMode, toggleTheme, breadcrumbs, onOpenMedia }) => {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { user, logout, loading } = useAuth();

  const initials = useMemo(() => {
    if (user?.name) {
      const parts = user.name.trim().split(/\s+/);
      return parts.length === 1
        ? parts[0].slice(0, 2).toUpperCase()
        : (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    if (user?.email) {
      return user.email.slice(0, 2).toUpperCase();
    }
    return '--';
  }, [user]);

  const handleLogout = async () => {
    try {
      setShowProfileMenu(false);
      await logout();
      router.push('/login');
    } catch (error) {
      console.error('Logout failed', error);
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setShowProfileMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <header className="h-16 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-6 sticky top-0 z-20">
      
      <div className="flex items-center gap-4">
        {/* Mobile Menu */}
        <button onClick={toggleSidebar} className="md:hidden p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md">
          <Menu size={20} />
        </button>

        {/* Breadcrumbs */}
        <nav className="hidden md:flex items-center text-sm text-slate-500 dark:text-slate-400">
          <span className="hover:text-slate-900 dark:hover:text-slate-200 cursor-pointer">ZenUI</span>
          {breadcrumbs.map((crumb, index) => (
            <React.Fragment key={index}>
              <ChevronRight size={14} className="mx-2 text-slate-400" />
              <span className={`font-medium ${index === breadcrumbs.length - 1 ? 'text-slate-900 dark:text-slate-200' : 'hover:text-slate-900 dark:hover:text-slate-200 cursor-pointer'}`}>
                {crumb}
              </span>
            </React.Fragment>
          ))}
        </nav>
      </div>

      <div className="flex items-center gap-2 md:gap-4">
        {/* Global Search */}
        <div className="relative hidden md:block">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Tìm kiếm (Ctrl+K)..."
            className="h-9 w-64 lg:w-80 rounded-full border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 pl-9 pr-4 text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 dark:text-slate-200 transition-all placeholder:text-slate-400"
          />
        </div>

        {/* Media quick access */}
        {onOpenMedia && (
          <button
            onClick={onOpenMedia}
            className="inline-flex items-center gap-2 px-3 py-2 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100 hover:bg-indigo-100 dark:bg-indigo-900/30 dark:text-indigo-200 dark:border-indigo-800 text-sm font-semibold"
          >
            <ImagePlus size={18} />
            <span className="hidden sm:inline">Media</span>
          </button>
        )}

        {/* Theme Toggle */}
        <button 
          onClick={toggleTheme}
          className="p-2 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
        >
          {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button>

        {/* Notifications */}
        <button className="relative p-2 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
          <Bell size={20} />
          <span className="absolute top-2 right-2 h-2 w-2 bg-red-500 rounded-full border-2 border-white dark:border-slate-900"></span>
        </button>

        {/* User Profile Dropdown */}
        <div className="relative" ref={profileRef}>
          <button 
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="h-8 w-8 rounded-full bg-indigo-100 dark:bg-indigo-900/50 overflow-hidden border border-slate-200 dark:border-slate-700 cursor-pointer flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
             {loading ? (
               <span className="h-3 w-6 rounded-full bg-indigo-200 dark:bg-indigo-800 animate-pulse"></span>
             ) : (
               <span className="font-bold text-xs text-indigo-700 dark:text-indigo-300">{initials}</span>
             )}
          </button>

          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-800 rounded-lg shadow-xl py-1 border border-slate-200 dark:border-slate-700 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
               <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-700">
                  {loading ? (
                    <div className="space-y-2">
                      <div className="h-3 w-28 bg-slate-200 dark:bg-slate-700 rounded animate-pulse"></div>
                      <div className="h-3 w-36 bg-slate-100 dark:bg-slate-800 rounded animate-pulse"></div>
                    </div>
                  ) : (
                    <>
                      <p className="text-sm font-semibold text-slate-900 dark:text-white">
                        {user?.name || 'Nguoi dung'}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                        {user?.email || '---'}
                      </p>
                    </>
                  )}
               </div>
               
               <div className="py-1">
                 <button className="w-full text-left px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center gap-2">
                    <User size={16} /> 
                    <span>Thông tin tài khoản</span>
                 </button>
                 <button className="w-full text-left px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center gap-2">
                    <Settings size={16} /> 
                    <span>Cài đặt</span>
                 </button>
               </div>
               
               <div className="border-t border-slate-100 dark:border-slate-700 py-1">
                 <button
                   onClick={handleLogout}
                   className="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-2"
                 >
                    <LogOut size={16} /> 
                    <span>Đăng xuất</span>
                 </button>
               </div>
            </div>
          )}
        </div>

      </div>
    </header>
  );
};

export default Header;
