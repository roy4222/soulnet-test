import React from 'react';
import { Link } from 'react-router-dom';

const Register = () => {
  return (
    <div className="max-w-md mx-auto">
      <h2 className="text-2xl font-bold text-center mb-4">註冊新帳號</h2>
      <form className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            電子郵件
          </label>
          <input
            type="email"
            id="email"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            密碼
          </label>
          <input
            type="password"
            id="password"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            確認密碼
          </label>
          <input
            type="password"
            id="confirmPassword"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
        >
          註冊
        </button>
      </form>
      <p className="mt-4 text-center">
        已經有帳號？{' '}
        <Link to="/sign" className="text-blue-600 hover:text-blue-800">
          登入
        </Link>
      </p>
    </div>
  );
};

export default Register; 