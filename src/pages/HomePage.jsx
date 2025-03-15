import React, { useState, useEffect } from 'react';
import LoadingState from '../components/UI/LoadingState';
import SuccessMessage from '../components/UI/SuccessMessage';
import ScrollToTopButton from '../components/ScrollToTopButton';

const HomePage = () => {
  // 定義載入狀態，預設為 true 表示正在載入中
  const [isLoading, setIsLoading] = useState(true);
  // 定義訊息狀態，包含類型和內容，預設為空
  const [message, setMessage] = useState({ type: '', content: '' });
  
  // 當組件掛載時執行初始化
  useEffect(() => {
    // 定義非同步初始化函數
    const initializeHomePage = async () => {
      try {
        // 模擬資料載入，延遲 100 毫秒
        await new Promise(resolve => setTimeout(resolve, 100));
        // 設定成功訊息
        setMessage({ type: 'success'});
      } catch (error) {
        // 如果發生錯誤，記錄錯誤訊息
        console.error('載入失敗:', error);
        // 設定錯誤訊息給使用者
        setMessage({ type: 'error', content: '載入失敗，請重新整理頁面' });
      } finally {
        // 不論成功或失敗，都將載入狀態設為 false
        setIsLoading(false);
      }
    };

    // 執行初始化函數
    initializeHomePage();
  }, []); // 空依賴陣列表示只在組件掛載時執行一次

  if (isLoading) {
    return (
      <LoadingState
        type="spinner"
        size="lg"
        text="載入中..."
        fullScreen={true}
      />
    );
  }

  return (
    <div className="min-h-screen dark:bg-gray-900 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
            歡迎來到 SoulNet
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
            連結靈魂，分享生活
          </p>
          
          
        </div>
      </div>

      

      {message.content && (
        <SuccessMessage
          message={message.content}
          type={message.type}
          onClose={() => setMessage({ type: '', content: '' })}
          duration={1000}
        />
      )}

      <ScrollToTopButton />
    </div>
  );
};

export default HomePage;