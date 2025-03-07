import React from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';

const Header = () => {
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <header className="bg-white dark:bg-gray-800 shadow">
      <nav className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <Link to="/" className="text-xl font-bold text-gray-800 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
            SoulNet
          </Link>
          <div className="flex items-center space-x-6">
           
            <div className="flex items-center space-x-4">
              <Link to="/sign" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors">
                登入
              </Link>
              <Link to="/register" className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors">
                註冊
              </Link>
            </div>
             {/* 暗黑模式切換按鈕 */}
             <button
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="切換暗黑模式"
            >
              {isDarkMode ? (
                // 太陽圖示
                <svg xmlns="http://www.w3.org/2000/svg" width="128" height="128" viewBox="0 0 24 24" className="w-5 h-5">
                  <g fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="1.5">
                    <path strokeLinejoin="round" d="M8 22h8M5 19h14M2 16h20"/>
                    <path d="M10 6.341a6 6 0 0 1 6.5 9.627h-9A5.98 5.98 0 0 1 6 12c0-.701.12-1.374.341-2M12 2v1m10 9h-1M3 12H2m17.07-7.07l-.392.393M5.322 5.322l-.393-.393"/>
                  </g>
                </svg>
              ) : (
                // 月亮圖示
                <svg xmlns="http://www.w3.org/2000/svg" width="128" height="128" viewBox="0 0 24 24" className="w-5 h-5">
                  <path fill="currentColor" d="M2 12C2 6.477 6.477 2 12 2c.463 0 .54.693.143.933a6.5 6.5 0 1 0 8.924 8.924c.24-.396.933-.32.933.143c0 1.138-.19 2.231-.54 3.25H22a.75.75 0 0 1 0 1.5H2a.75.75 0 0 1 0-1.5h.54A10 10 0 0 1 2 12m3 6.25a.75.75 0 0 0 0 1.5h14a.75.75 0 0 0 0-1.5zm3 3a.75.75 0 0 0 0 1.5h8a.75.75 0 0 0 0-1.5zM19.9 2.307a.483.483 0 0 0-.9 0l-.43 1.095a.48.48 0 0 1-.272.274l-1.091.432a.486.486 0 0 0 0 .903l1.091.432a.48.48 0 0 1 .272.273L19 6.81c.162.41.74.41.9 0l.43-1.095a.48.48 0 0 1 .273-.273l1.091-.432a.486.486 0 0 0 0-.903l-1.091-.432a.48.48 0 0 1-.273-.274z"/>
                  <path fill="currentColor" d="M16.033 8.13a.483.483 0 0 0-.9 0l-.157.399a.48.48 0 0 1-.272.273l-.398.158a.486.486 0 0 0 0 .903l.398.157c.125.05.223.148.272.274l.157.399c.161.41.739.41.9 0l.157-.4a.48.48 0 0 1 .272-.273l.398-.157a.486.486 0 0 0 0-.903l-.398-.158a.48.48 0 0 1-.272-.273z"/>
                </svg>
              )}
            </button>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
