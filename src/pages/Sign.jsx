/**
 * 登入頁面組件
 * 提供使用者登入功能的介面
 */
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from '../utils/firebase';

const googleProvider = new GoogleAuthProvider();

/**
 * Sign 組件 - 處理使用者登入
 * @returns {JSX.Element} 登入頁面的 JSX 元素
 */
const Sign = () => {
  // 使用 React Router 的導航鉤子，用於頁面跳轉
  const navigate = useNavigate();
  
  /**
   * 表單資料狀態
   * @type {Object}
   * @property {string} email - 使用者電子郵件
   * @property {string} password - 使用者密碼
   */
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  // 載入狀態，用於控制按鈕禁用和顯示載入指示器
  const [isLoading, setIsLoading] = useState(false);
  // 錯誤訊息狀態，用於顯示登入過程中的錯誤
  const [error, setError] = useState('');
  // 成功訊息狀態，用於顯示登入成功的反饋
  const [success, setSuccess] = useState('');

  /**
   * 處理 Google 登入
   * 使用 Firebase 的 Google 彈出視窗登入方式
   * @async
   * @function
   */
  const handleGoogleSignIn = async () => {
    // 設置載入狀態為真，開始處理登入
    setIsLoading(true);
    // 清空之前的錯誤和成功訊息
    setError('');
    setSuccess('');
    
    try {
      // 嘗試使用 Google 提供者進行彈出視窗登入
      const result = await signInWithPopup(auth, googleProvider);
      // 獲取登入成功的用戶資訊
      const user = result.user;
      console.log('Google 登入成功:', user);
      
      // 設定成功訊息，通知用戶登入成功
      setSuccess('登入成功！正在為您導向...');
      
      // 延遲一下再導向，讓使用者看到成功訊息
      setTimeout(() => {
        // 導向到首頁或儀表板
        navigate('/');
      }, 1500);
      
    } catch (error) {
      // 捕獲並處理登入過程中的錯誤
      console.error('Google 登入失敗:', error);
      
      // 根據不同的錯誤代碼顯示對應的錯誤訊息
      switch (error.code) {
        case 'auth/operation-not-allowed':
          setError('Google 登入尚未啟用，請聯絡管理員');
          break;
        case 'auth/popup-blocked':
          setError('請允許彈出視窗以繼續登入');
          break;
        case 'auth/cancelled-popup-request':
          setError('登入已取消');
          break;
        default:
          setError('登入失敗，請稍後再試');
      }
    } finally {
      // 無論成功或失敗，最終都將載入狀態設為假
      setIsLoading(false);
    }
  };

  /**
   * 處理表單提交
   * @param {Event} e - 表單提交事件
   */
  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: 處理一般登入邏輯
  };

  return (
    // 主容器 - 全屏高度、居中顯示、漸變背景
    <div className="min-h-screen flex items-center justify-center dark:from-gray-900 dark:to-gray-800 py-12 px-4 sm:px-6 lg:px-8">
      {/* 登入卡片 - 有陰影和懸停效果 */}
      <div className="max-w-md w-full space-y-8 bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg transform transition-all hover:scale-[1.01]">
        {/* 標題區域 */}
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
            登入帳號
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
            歡迎回來
          </p>
          {/* 錯誤訊息顯示 */}
          {error && (
            <div className="mt-2 p-2 text-sm text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/30 rounded-lg">
              {error}
            </div>
          )}
          {/* 成功訊息顯示 */}
          {success && (
            <div className="mt-2 p-2 text-sm text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30 rounded-lg">
              {success}
            </div>
          )}
        </div>
        {/* 登入表單 */}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {/* 輸入欄位容器 */}
          <div className="rounded-md shadow-sm space-y-4">
            {/* 電子郵件輸入區域 */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                電子郵件
              </label>
              <input
                type="email"
                id="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                className="appearance-none relative block w-full px-3 py-2 mt-1 border border-gray-300 dark:border-gray-600 placeholder-gray-500 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700"
                placeholder="your@email.com"
              />
            </div>
            {/* 密碼輸入區域 */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                密碼
              </label>
              <input
                type="password"
                id="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
                className="appearance-none relative block w-full px-3 py-2 mt-1 border border-gray-300 dark:border-gray-600 placeholder-gray-500 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700"
                placeholder="••••••••"
              />
            </div>
          </div>

          {/* 記住我和忘記密碼區域 */}
          <div className="flex items-center justify-between">
            {/* 記住我選項 */}
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900 dark:text-gray-300">
                記住我
              </label>
            </div>

            {/* 忘記密碼連結 */}
            <div className="text-sm">
              <Link to="/reset-password" className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300">
                忘記密碼？
              </Link>
            </div>
          </div>

          {/* 登入按鈕 */}
          <div className="space-y-4">
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transform transition-all duration-150 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? '登入中...' : '登入'}
            </button>

            {/* Google 登入按鈕 */}
            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={isLoading}
              className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transform transition-all duration-150 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <img
                className="h-5 w-5 mr-2"
                src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                alt="Google logo"
              />
              {isLoading ? '登入中...' : '使用 Google 帳號登入'}
            </button>
          </div>
        </form>
        
        {/* 註冊連結區域 */}
        <div className="flex items-center justify-center mt-6">
          <div className="text-sm">
            <Link to="/register" className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 flex items-center group">
              還沒有帳號？
              {/* 箭頭圖示 - 有懸停動畫效果 */}
              <svg className="w-4 h-4 ml-2 transform transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sign; 