import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';

const MobileMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { currentUser, isAdmin } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();
  const location = useLocation();

  // 在路由變更時關閉選單
  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  // 在選單開啟時禁止背景滾動
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

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
    <div className="md:hidden">
      {/* 漢堡選單按鈕 */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        aria-label="開啟選單"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
          />
        </svg>
      </button>

      {/* 側邊選單 */}
      <div
        className={`fixed inset-0 z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* 背景遮罩 */}
        <div
          className="absolute inset-0 bg-black/50"
          onClick={() => setIsOpen(false)}
        ></div>

        {/* 選單內容 */}
        <div className="absolute top-0 left-0 bottom-0 w-64 bg-white dark:bg-gray-800 shadow-lg overflow-y-auto">
          {/* 選單頂部 */}
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <Link
                to="/"
                className="text-xl font-bold text-gray-800 dark:text-white"
                onClick={() => setIsOpen(false)}
              >
                SoulNet
              </Link>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24">
                  <path fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/>
                </svg>
              </button>
            </div>
          </div>

          {/* 導航連結 */}
          <div className="py-2">
            {navLinks.map((link) =>
              shouldShowLink(link) && (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`flex items-center space-x-3 px-4 py-3 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
                    location.pathname === link.path
                      ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 font-medium"
                      : ""
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  {link.icon}
                  <span>{link.label}</span>
                </Link>
              )
            )}
          </div>

          {/* 底部操作區 */}
          <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
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
              {currentUser ? (
                <Link
                  to="/profile"
                  className="flex items-center space-x-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                  onClick={() => setIsOpen(false)}
                >
                  <span>個人資料</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4s-4 1.79-4 4s1.79 4 4 4m0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4"/>
                  </svg>
                </Link>
              ) : (
                <Link
                  to="/sign"
                  className="flex items-center space-x-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
                  onClick={() => setIsOpen(false)}
                >
                  <span>登入</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M11 7L9.6 8.4l2.6 2.6H2v2h10.2l-2.6 2.6L11 17l5-5zm9 12h-8v2h8c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2h-8v2h8z"/>
                  </svg>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileMenu;
