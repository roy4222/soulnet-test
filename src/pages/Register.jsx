/**
 * 註冊頁面組件
 * 提供使用者建立新帳號的介面
 */
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth } from '../utils/firebase';

/**
 * Register 組件 - 處理使用者註冊
 * @returns {JSX.Element} 註冊頁面的 JSX 元素
 */
const Register = () => {
  const navigate = useNavigate();
  
  /**
   * 表單資料狀態
   * @type {Object}
   * @property {string} username - 使用者名稱
   * @property {string} email - 使用者電子郵件
   * @property {string} password - 使用者密碼
   * @property {string} confirmPassword - 確認密碼
   */
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  /**
   * 處理表單提交
   * @param {Event} e - 表單提交事件
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    // 驗證密碼
    if (formData.password !== formData.confirmPassword) {
      setError('兩次輸入的密碼不相符');
      setIsLoading(false);
      return;
    }

    // 驗證密碼長度
    if (formData.password.length < 6) {
      setError('密碼長度至少需要 6 個字元');
      setIsLoading(false);
      return;
    }

    try {
      // 建立帳號
      const result = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );

      // 更新使用者資料
      await updateProfile(result.user, {
        displayName: formData.username
      });

      console.log('註冊成功:', result.user);
      setSuccess('註冊成功！正在為您導向...');

      // 延遲導向到登入頁面
      setTimeout(() => {
        navigate('/sign');
      }, 1500);
    } catch (error) {
      console.error('註冊失敗:', error);
      switch (error.code) {
        case 'auth/email-already-in-use':
          setError('此電子郵件已被使用');
          break;
        case 'auth/invalid-email':
          setError('無效的電子郵件格式');
          break;
        case 'auth/operation-not-allowed':
          setError('註冊功能尚未啟用，請聯絡管理員');
          break;
        case 'auth/weak-password':
          setError('密碼強度不足');
          break;
        default:
          setError('註冊失敗，請稍後再試');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    // 主容器 - 全屏高度、居中顯示、漸變背景
    <div className="min-h-screen flex items-center justify-center dark:from-gray-900 dark:to-gray-800 py-12 px-4 sm:px-6 lg:px-8">
      {/* 註冊卡片 - 有陰影和懸停效果 */}
      <div className="max-w-md w-full space-y-8 bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg transform transition-all hover:scale-[1.01]">
        {/* 標題區域 */}
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
            建立新帳號
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
            開始您的旅程
          </p>
          {error && (
            <div className="mt-2 p-2 text-sm text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/30 rounded-lg">
              {error}
            </div>
          )}
          {success && (
            <div className="mt-2 p-2 text-sm text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30 rounded-lg">
              {success}
            </div>
          )}
        </div>
        {/* 註冊表單 */}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {/* 輸入欄位容器 */}
          <div className="rounded-md shadow-sm space-y-4">
            {/* 使用者名稱輸入區域 */}
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                使用者名稱
              </label>
              <input
                type="text"
                id="username"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                required
                className="appearance-none relative block w-full px-3 py-2 mt-1 border border-gray-300 dark:border-gray-600 placeholder-gray-500 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700"
                placeholder="使用者名稱"
              />
            </div>
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
                placeholder="****@email.com"
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
            {/* 確認密碼輸入區域 */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                確認密碼
              </label>
              <input
                type="password"
                id="confirmPassword"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                required
                className="appearance-none relative block w-full px-3 py-2 mt-1 border border-gray-300 dark:border-gray-600 placeholder-gray-500 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700"
                placeholder="••••••••"
              />
            </div>
          </div>

          {/* 註冊按鈕 */}
          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transform transition-all duration-150 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? '註冊中...' : '立即註冊'}
            </button>
          </div>
        </form>
        
        {/* 返回登入連結區域 */}
        <div className="flex items-center justify-center mt-6">
          <div className="text-sm">
            <Link to="/sign" className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 flex items-center group">
              {/* 返回箭頭圖示 - 有懸停動畫效果 */}
              <svg className="w-4 h-4 mr-2 transform transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
              </svg>
              返回登入
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register; 