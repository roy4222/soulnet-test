import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { NAV_LINKS } from '../config/navLinks';

const Sidebar = () => {
  const { currentUser, isAdmin, isSidebarCollapsed } = useAuth();
  const location = useLocation();

  // 過濾導航連結
  const filteredNavLinks = NAV_LINKS.filter(link => {
    if (link.public) return true;
    if (link.admin) return isAdmin();
    if (link.auth) return !!currentUser;
    return false;
  });

  return (
    <nav className={`fixed hidden md:block left-0 top-16 bottom-0 bg-white dark:bg-gray-800 shadow-lg z-40 transition-all duration-300 ${
      isSidebarCollapsed ? 'w-16' : 'w-64'
    }`}>
      <div className="h-full overflow-y-auto py-4">
        {filteredNavLinks.map((link) => (
          <Link
            key={link.path}
            to={link.path}
            className={`flex items-center px-6 py-3 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
              location.pathname === link.path ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 font-medium' : ''
            }`}
            title={isSidebarCollapsed ? link.label : ''}
          >
            <div className="flex-shrink-0">
              {link.icon}
            </div>
            {!isSidebarCollapsed && (
              <span className="ml-3">{link.label}</span>
            )}
          </Link>
        ))}
      </div>
    </nav>
  );
};

export default Sidebar; 