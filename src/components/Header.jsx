import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header className="bg-white dark:bg-gray-800 shadow">
      <nav className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <Link to="/" className="text-xl font-bold text-gray-800 dark:text-white">
            SoulNet
          </Link>
          <div className="space-x-4">
            <Link to="/sign" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
              登入
            </Link>
            <Link to="/register" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
              註冊
            </Link>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
