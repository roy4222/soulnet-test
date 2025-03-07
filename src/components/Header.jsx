import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import defaultAvatar from '../assets/images/images.webp';
import MobileMenu from './MobileMenu';

const Header = () => {
  const { isDarkMode, toggleTheme } = useTheme();
  const { currentUser, logout, userRole, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // 處理登出
  const handleSignOut = async () => {
    try {
      await logout();
      navigate('/sign');
    } catch (error) {
      console.error('登出失敗:', error);
    }
  };

  // 導航連結配置
  const navLinks = [
    { 
      path: '/', 
      label: '首頁', 
      public: true,
      icon: <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24"><path fill="currentColor" d="M10 20v-6h4v6h5v-8h3L12 3L2 12h3v8z"/></svg>
    },
    { 
      path: '/explore', 
      label: '探索', 
      public: true,
      icon: <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24"><path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10s10-4.48 10-10S17.52 2 12 2m0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8s8 3.59 8 8s-3.59 8-8 8m-5.5-2.5l7.51-3.49L17.5 6.5L9.99 9.99zm5.5-6.6c.61 0 1.1.49 1.1 1.1s-.49 1.1-1.1 1.1s-1.1-.49-1.1-1.1s.49-1.1 1.1-1.1"/></svg>
    },
    { 
      path: '/articles', 
      label: '文章列表', 
      public: true,
      icon: <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24"><path fill="currentColor" d="M19 5v14H5V5zm0-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2m-5 14H7v-2h7zm3-4H7v-2h10zm0-4H7V7h10z"/></svg>
    },
    { 
      path: '/new-post', 
      label: '發表文章', 
      auth: true,
      icon: <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24"><path fill="currentColor" d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6z"/></svg>
    },
    { 
      path: '/messages', 
      label: '訊息中心', 
      auth: true,
      icon: <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24"><path fill="currentColor" d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2m0 14H5.2L4 17.2V4h16z"/></svg>
    },
    { 
      path: '/notifications', 
      label: '通知', 
      auth: true,
      icon: <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24"><path fill="currentColor" d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2m6-6v-5c0-3.07-1.63-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.64 5.36 6 7.92 6 11v5l-2 2v1h16v-1zm-2 1H8v-6c0-2.48 1.51-4.5 4-4.5s4 2.02 4 4.5z"/></svg>
    },
    { 
      path: '/bookmarks', 
      label: '收藏夾', 
      auth: true,
      icon: <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24"><path fill="currentColor" d="M17 3H7c-1.1 0-2 .9-2 2v16l7-3l7 3V5c0-1.1-.9-2-2-2m0 15l-5-2.18L7 18V5h10z"/></svg>
    },
    { 
      path: '/admin', 
      label: '管理後台', 
      admin: true,
      icon: <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24"><path fill="currentColor" d="M19.14 12.94c.04-.3.06-.61.06-.94c0-.32-.02-.64-.07-.94l2.03-1.58a.49.49 0 0 0 .12-.61l-1.92-3.32a.488.488 0 0 0-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54a.484.484 0 0 0-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58a.49.49 0 0 0-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6s3.6 1.62 3.6 3.6s-1.62 3.6-3.6 3.6z"/></svg>
    },
  ];

  // 判斷連結是否應該顯示
  const shouldShowLink = (link) => {
    if (link.public) return true;
    if (link.admin) return isAdmin();
    if (link.auth) return !!currentUser;
    return false;
  };

  return (
    <>
      {/* 頂部導航欄 */}
      <header className="fixed top-0 left-0 right-0 bg-white dark:bg-gray-800 h-16 shadow-md z-50">
        <div className="container mx-auto px-4 h-full">
          <div className="flex justify-between items-center h-full">
            {/* Logo */}
            <div className="flex items-center">
              <Link to="/" className="text-xl font-bold text-gray-800 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                SoulNet
              </Link>
            </div>

            {/* 右側操作區 */}
            <div className="flex items-center space-x-4">
              {/* 暗黑模式切換按鈕 */}
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-label="切換暗黑模式"
              >
                {isDarkMode ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24">
                    <g fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="1.5">
                      <path strokeLinejoin="round" d="M8 22h8M5 19h14M2 16h20"/>
                      <path d="M10 6.341a6 6 0 0 1 6.5 9.627h-9A5.98 5.98 0 0 1 6 12c0-.701.12-1.374.341-2M12 2v1m10 9h-1M3 12H2m17.07-7.07l-.392.393M5.322 5.322l-.393-.393"/>
                    </g>
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9s9-4.03 9-9c0-.46-.04-.92-.1-1.36c-.98 1.37-2.58 2.26-4.4 2.26c-3.03 0-5.5-2.47-5.5-5.5c0-1.82.89-3.42 2.26-4.4c-.44-.06-.9-.1-1.36-.1z"/>
                  </svg>
                )}
              </button>

              {/* 用戶相關操作 */}
              {currentUser ? (
                <div className="relative">
                  <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="flex items-center space-x-3 focus:outline-none"
                  >
                    <div className="relative">
                      {currentUser.photoURL ? (
                        <img
                          src={currentUser.photoURL}
                          alt="用戶頭像"
                          className="w-8 h-8 rounded-full object-cover"
                        />
                      ) : (
                        <img
                          src={defaultAvatar}
                          alt="預設頭像"
                          className="w-8 h-8 rounded-full object-cover"
                        />
                      )}
                      <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white dark:border-gray-800"></div>
                    </div>
                  </button>

                  {isDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-700 rounded-lg shadow-lg py-1 z-50">
                      <div className="px-4 py-2 text-sm text-gray-700 dark:text-gray-200 border-b border-gray-200 dark:border-gray-600">
                        {currentUser.displayName || '使用者'}
                        {isAdmin() && (
                          <span className="ml-2 text-xs px-2 py-0.5 bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-300 rounded-full">
                            管理員
                          </span>
                        )}
                      </div>
                      <Link
                        to="/profile"
                        className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600"
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        個人資料
                      </Link>
                      <Link
                        to="/settings"
                        className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600"
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        設定
                      </Link>
                      <div className="border-t border-gray-200 dark:border-gray-600 my-1"></div>
                      <button
                        onClick={() => {
                          handleSignOut();
                          setIsDropdownOpen(false);
                        }}
                        className="block w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-600"
                      >
                        登出
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="hidden md:flex items-center space-x-4">
                  <Link to="/sign" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors">
                    登入
                  </Link>
                  <Link to="/register" className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors">
                    註冊
                  </Link>
                </div>
              )}

              {/* 手機版選單 */}
              <MobileMenu />
            </div>
          </div>
        </div>
      </header>

      {/* 左側導航欄 - 僅在桌面版顯示 */}
      <nav className="fixed hidden md:block left-0 top-16 bottom-0 w-64 bg-white dark:bg-gray-800 shadow-lg z-40">
        <div className="h-full overflow-y-auto py-4">
          {navLinks.map((link) => 
            shouldShowLink(link) && (
              <Link
                key={link.path}
                to={link.path}
                className={`flex items-center space-x-3 px-6 py-3 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
                  location.pathname === link.path ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 font-medium' : ''
                }`}
              >
                {link.icon}
                <span>{link.label}</span>
              </Link>
            )
          )}
        </div>
      </nav>

      {/* 主要內容區域的間距 */}
      <div className="md:ml-64 mt-16">
        {/* 這裡的內容會由 Outlet 組件渲染 */}
      </div>
    </>
  );
};

export default Header;
