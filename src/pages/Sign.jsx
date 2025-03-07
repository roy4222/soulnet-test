/**
 * 登入頁面組件
 * 提供使用者登入功能的介面
 */
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

/**
 * Sign 組件 - 處理使用者登入
 * @returns {JSX.Element} 登入頁面的 JSX 元素
 */
const Sign = () => {
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

  /**
   * 處理表單提交
   * @param {Event} e - 表單提交事件
   */
  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: 處理登入邏輯
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
          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transform transition-all duration-150 hover:scale-[1.02]"
            >
              登入
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