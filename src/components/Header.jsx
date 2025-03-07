import React, { useState, useMemo } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import defaultAvatar from '../assets/images/images.webp';
import MobileMenu from './MobileMenu';

// 導航連結配置
export const NAV_LINKS = [
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

const Header = () => {
  const { isDarkMode, toggleTheme } = useTheme();
  const { 
    currentUser, 
    logout, 
    isAdmin, 
    isSidebarCollapsed, 
    toggleSidebar 
  } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // 處理登出
  const handleSignOut = async () => {
    try {
      await logout();
      navigate('/sign');
    } catch (error) {
      console.error('登出失敗:', error);
    }
  };

  // 處理搜尋
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  // 使用 useMemo 優化導航連結過濾
  const filteredNavLinks = useMemo(() => {
    return NAV_LINKS.filter(link => {
      if (link.public) return true;
      if (link.admin) return isAdmin();
      if (link.auth) return !!currentUser;
      return false;
    });
  }, [currentUser, isAdmin]);

  return (
    <>
      {/* 頂部導航欄 */}
      <header className="fixed top-0 left-0 right-0 bg-white dark:bg-gray-800 h-16 shadow-md z-50">
        <div className="container mx-auto px-4 h-full">
          <div className="flex justify-between items-center h-full">
            {/* Logo 區域 */}
            <div className="flex items-center space-x-4">
              {/* 側邊欄切換按鈕 */}
              <button
                onClick={toggleSidebar}
                className="hidden md:flex p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-label={isSidebarCollapsed ? "展開側邊欄" : "收合側邊欄"}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  {isSidebarCollapsed ? (
                    <path d="M4 6h16M4 12h16M4 18h16"/>
                  ) : (
                    <path d="M3 12h18M3 6h18M3 18h18"/>
                  )}
                </svg>
              </button>
              <Link to="/" className="text-xl font-bold text-gray-800 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                SoulNet
              </Link>
            </div>

            {/* 搜尋欄 */}
            <div className="hidden md:flex flex-1 max-w-2xl mx-8">
              <form onSubmit={handleSearch} className="w-full">
                <div className="relative">
                  <input
                    type="search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="搜尋文章、用戶或標籤..."
                    className="w-full px-4 py-2 pl-10 pr-4 text-gray-700 bg-gray-100 dark:bg-gray-700 dark:text-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                  />
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500 dark:text-gray-400" viewBox="0 0 24 24">
                      <path fill="currentColor" d="M15.5 14h-.79l-.28-.27a6.5 6.5 0 0 0 1.48-5.34c-.47-2.78-2.79-5-5.59-5.34a6.505 6.505 0 0 0-7.27 7.27c.34 2.8 2.56 5.12 5.34 5.59a6.5 6.5 0 0 0 5.34-1.48l.27.28v.79l4.25 4.25c.41.41 1.08.41 1.49 0c.41-.41.41-1.08 0-1.49L15.5 14zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5S14 7.01 14 9.5S11.99 14 9.5 14z"/>
                    </svg>
                  </div>
                </div>
              </form>
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
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 36 36">
                    <path fill="#FFAC33" d="M16 2s0-2 2-2s2 2 2 2v2s0 2-2 2s-2-2-2-2zm18 14s2 0 2 2s-2 2-2 2h-2s-2 0-2-2s2-2 2-2zM4 16s2 0 2 2s-2 2-2 2H2s-2 0-2-2s2-2 2-2zm5.121-8.707s1.414 1.414 0 2.828s-2.828 0-2.828 0L4.878 8.708s-1.414-1.414 0-2.829c1.415-1.414 2.829 0 2.829 0zm21 21s1.414 1.414 0 2.828s-2.828 0-2.828 0l-1.414-1.414s-1.414-1.414 0-2.828s2.828 0 2.828 0zm-.413-18.172s-1.414 1.414-2.828 0s0-2.828 0-2.828l1.414-1.414s1.414-1.414 2.828 0s0 2.828 0 2.828zm-21 21s-1.414 1.414-2.828 0s0-2.828 0-2.828l1.414-1.414s1.414-1.414 2.828 0s0 2.828 0 2.828zM16 32s0-2 2-2s2 2 2 2v2s0 2-2 2s-2-2-2-2z"/>
                    <circle cx="18" cy="18" r="10" fill="#FFAC33"/>
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
                      <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-600">
                        <div className="text-sm font-medium text-gray-700 dark:text-gray-200">
                          {currentUser.displayName || '使用者'}
                          {isAdmin() && (
                            <span className="ml-2 text-xs px-2 py-0.5 bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-300 rounded-full">
                              管理員
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 mt-1 truncate">
                          {currentUser.email}
                        </div>
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

      {/* 主要內容區域的間距 */}
      <div className={`transition-all duration-300 mt-16 ${
        isSidebarCollapsed ? 'md:ml-16' : 'md:ml-64'
      }`}>
        {/* 這裡的內容會由 Outlet 組件渲染 */}
      </div>
    </>
  );
};

export default Header;
