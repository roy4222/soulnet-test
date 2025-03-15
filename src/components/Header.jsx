import React, { useState, useMemo } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import defaultAvatar from '../assets/images/images.webp';
import MobileMenu from './MobileMenu';
import logoImage from '../assets/icons/player.jpg';
import SuccessMessage from './UI/SuccessMessage';
import LoadingState from './UI/LoadingState';

const Header = () => {
  // 從 ThemeContext 獲取主題相關狀態和方法
  const { isDarkMode, toggleTheme } = useTheme();

  // 從 AuthContext 獲取使用者相關狀態和方法
  const { 
    currentUser,  // 當前登入的使用者
    logout,      // 登出方法
    isAdmin,     // 是否為管理員
  } = useAuth();

  // 路由相關 hooks
  const navigate = useNavigate();
  const location = useLocation();

  // 本地狀態
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // 下拉選單開關狀態
  const [searchQuery, setSearchQuery] = useState(''); // 搜尋關鍵字
  const [message, setMessage] = useState({ type: '', content: '' }); // 訊息提示狀態
  const [isLoading, setIsLoading] = useState(false); // 載入狀態

  // 處理登出
  const handleSignOut = async () => {
    try {
      // 設定載入狀態
      setIsLoading(true);
      // 關閉下拉選單
      setIsDropdownOpen(false);
      // 顯示登出中訊息
      setMessage({ type: 'info', content: '正在登出...' });
      // 執行登出
      await logout();
      // 顯示成功訊息
      setMessage({ type: 'success', content: '登出成功！期待您的再次造訪' });
      
      // 延遲導向登入頁面
      setTimeout(() => {
        // 清除本地狀態
        setSearchQuery('');
        setMessage({ type: '', content: '' });
        // 導向登入頁
        navigate('/sign');
        // 最後再關閉載入狀態
        setIsLoading(false);
      }, 1500);
    } catch (error) {
      console.error('登出失敗:', error);
      setMessage({ type: 'error', content: '登出失敗，請稍後再試' });
      setIsLoading(false);
    }
  };

  // 處理搜尋
  const handleSearch = async (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setIsLoading(true);
      try {
        // 導向搜尋結果頁面並帶入查詢參數
        await navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
        setSearchQuery(''); // 清空搜尋框
      } finally {
        setIsLoading(false);
      }
    }
  };

  // 如果正在載入中，顯示載入狀態
  if (isLoading) {
    return (
      <LoadingState
        type="pulse"
        size="lg"
        text="正在安全登出您的帳號..."
        fullScreen={true}
      />
    );
  }

  return (
    <>
      <header className="fixed top-0 left-0 right-0 bg-white dark:bg-gray-800 h-16 shadow-md z-50">
        <div className="container mx-auto px-4 h-full">
          <div className="flex justify-between items-center h-full">
            {/* Logo 區域 */}
            <div className="flex items-center space-x-4">
              <Link to="/" className="flex items-center space-x-2">
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  width="32" 
                  height="32" 
                  viewBox="0 0 24 24" 
                  className="text-gray-800 dark:text-white"
                >
                  <path 
                    fill="none" 
                    stroke="currentColor" 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth="1.5" 
                    d="M5.812 7s-.453.628-.996 1.667M18.188 7s.453.628.997 1.667m-14.37 0C4.008 10.214 3 12.674 3 15.333C5.813 15.333 7.5 17 7.5 17s1.125 5 4.5 5s4.5-5 4.5-5s1.688-1.667 4.5-1.667c0-2.659-1.007-5.119-1.815-6.666m-14.37 0s-2.94-2.223 0-6.667c.997.556 3.81 2.778 3.81 2.778S10.313 3.667 12 3.667s3.375 1.11 3.375 1.11S18.188 2.557 19.313 2c2.812 4.445-.128 6.667-.128 6.667M11 18h1m1 0h-1m0 0v1m-3.5-6.5L10 14m5.5-1.5L14 14"
                  />
                </svg>
                <span className="text-xl font-bold text-gray-800 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  SoulNet
                </span>
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
                    className="hidden md:flex p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                <div className="flex items-center space-x-4">
                  {/* 發表文章按鈕 */}
                  <Link 
                    to="/new-post"
                    className="hidden md:flex bg-blue-500 dark:bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-600 dark:hover:bg-blue-700 transition duration-300 shadow-md items-center space-x-2"
                  >
                    {/* 加號圖標 */}
                    <svg 
                      className="w-5 h-5 flex-shrink-0" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth="2" 
                        d="M12 4v16m8-8H4"
                      />
                    </svg>
                    {/* 按鈕文字 */}
                    <span className="whitespace-nowrap">發表文章</span>
                  </Link>

                  


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
                            className="w-10 h-10 rounded-full object-cover border-2 border-white dark:border-gray-800"
                            style={{ aspectRatio: '1/1' }}
                          />
                        ) : (
                          <img
                            src={defaultAvatar}
                            alt="預設頭像"
                            className="w-10 h-10 rounded-full object-cover border-2 border-white dark:border-gray-800"
                            style={{ aspectRatio: '1/1' }}
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

      {/* 主要內容區域 */}
      <div className="mt-16">
        {/* 這裡的內容會由 Outlet 組件渲染 */}
      </div>

      {/* 訊息提示 */}
      {message.content && (
        <SuccessMessage
          message={message.content}
          type={message.type}
          onClose={() => setMessage({ type: '', content: '' })}
          duration={1500}
        />
      )}
    </>
  );
};

export default Header;
