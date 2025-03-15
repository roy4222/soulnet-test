// 引入 React 和 Component 類別
import React, { Component } from 'react';

/**
 * ErrorBoundary 元件
 * 用於捕獲子元件中的 JavaScript 錯誤，並顯示備用 UI
 */
class ErrorBoundary extends Component {
  // 建構子初始化狀態
  constructor(props) {
    super(props);
    this.state = {
      hasError: false, // 是否發生錯誤
      error: null,     // 錯誤物件
      errorInfo: null  // 錯誤資訊
    };
  }

  /**
   * 當子元件拋出錯誤時觸發
   * 用於更新 state，使下一次渲染能顯示備用 UI
   */
  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  /**
   * 捕獲並記錄錯誤資訊
   * @param {Error} error - 錯誤物件
   * @param {React.ErrorInfo} errorInfo - React 提供的錯誤資訊
   */
  componentDidCatch(error, errorInfo) {
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
    // 這裡可以加入錯誤記錄服務
    console.error('錯誤邊界捕獲到錯誤：', error, errorInfo);
  }

  /**
   * 渲染元件
   * 如果有錯誤則顯示錯誤 UI，否則渲染子元件
   */
  render() {
    if (this.state.hasError) {
      // 錯誤發生時顯示的備用 UI
      return (
        <div className="error-boundary-container" style={{
          padding: '20px',
          margin: '20px',
          border: '1px solid #ff0000',
          borderRadius: '8px',
          backgroundColor: '#fff5f5'
        }}>
          <h2 style={{ color: '#cc0000' }}>很抱歉，發生了一些問題</h2>
          <p style={{ color: '#666666' }}>請重新整理頁面或聯繫系統管理員</p>
          <button
            onClick={() => window.location.reload()}
            style={{
              padding: '8px 16px',
              backgroundColor: '#cc0000',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            重新整理頁面
          </button>
        </div>
      );
    }

    // 正常情況下渲染子元件
    return this.props.children;
  }
}

// 匯出 ErrorBoundary 元件
export default ErrorBoundary;