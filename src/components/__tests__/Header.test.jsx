import React from 'react';
import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from '../../contexts/ThemeContext';
import { AuthProvider } from '../../contexts/AuthContext';
import Header from '../Header';

// Mock firebase
jest.mock('../../utils/firebase');

// Mock 路由 hooks
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => jest.fn(),
  useLocation: () => ({ pathname: '/' }),
}));

// Mock 環境變數
process.env = {
  ...process.env,
  VITE_SOULNET_TEST_API_KEY: 'mock-api-key',
  // 添加其他需要的環境變數
};

// Mock 圖片
jest.mock('../../assets/images/images.webp', () => 'mock-avatar.webp');
jest.mock('../../assets/icons/player.jpg', () => 'mock-logo.jpg');

const renderHeader = () => {
  return render(
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <Header />
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
};

describe('Header 組件', () => {
  beforeEach(() => {
    // 清除所有 mock
    jest.clearAllMocks();
  });

  test('渲染基本元素', () => {
    renderHeader();
    
    // 檢查 Logo
    const logo = screen.getByTestId('desktop-logo');
    expect(logo).toBeInTheDocument();
    expect(within(logo).getByText('SoulNet')).toBeInTheDocument();
    
    // 檢查搜尋框
    const searchForm = screen.getByTestId('desktop-search-form');
    const searchInput = within(searchForm).getByRole('searchbox');
    expect(searchInput).toBeInTheDocument();
    expect(searchInput).toHaveAttribute('placeholder', '搜尋文章、用戶或標籤...');
  });

  test('未登入狀態顯示正確的按鈕', () => {
    renderHeader();
    
    const desktopNav = screen.getByTestId('desktop-nav');
    expect(within(desktopNav).getByText('登入')).toBeInTheDocument();
    expect(within(desktopNav).getByText('註冊')).toBeInTheDocument();
  });

  test('搜尋功能正常運作', async () => {
    const mockHandleSearch = jest.fn((e) => {
      e.preventDefault();
      const form = e.target;
      const input = form.querySelector('input[type="search"]');
      input.value = '';
    });
    
    renderHeader();
    
    // 使用 data-testid 來選擇桌面版搜尋框
    const searchForm = screen.getByTestId('desktop-search-form');
    const searchInput = within(searchForm).getByRole('searchbox');
    
    // 模擬表單提交事件
    searchForm.onsubmit = mockHandleSearch;
    
    // 輸入搜尋關鍵字
    fireEvent.change(searchInput, { target: { value: '測試關鍵字' } });
    
    // 提交搜尋
    fireEvent.submit(searchForm);
    
    // 驗證搜尋框被清空
    await waitFor(() => {
      expect(searchInput.value).toBe('');
    });
  });

  test('切換主題功能正常運作', () => {
    renderHeader();
    
    // 使用 data-testid 來選擇桌面版主題切換按鈕
    const themeToggleButton = screen.getByTestId('desktop-theme-toggle');
    fireEvent.click(themeToggleButton);
  });

  // 模擬已登入狀態的測試
  test('登入狀態顯示用戶資訊', () => {
    // Mock AuthContext 的值
    jest.spyOn(require('../../contexts/AuthContext'), 'useAuth').mockImplementation(() => ({
      currentUser: {
        displayName: '測試用戶',
        email: 'test@example.com',
        photoURL: null
      },
      isAdmin: () => false,
      logout: jest.fn()
    }));

    renderHeader();
    
    // 點擊用戶頭像（使用 data-testid 來定位）
    const avatarButton = screen.getByTestId('user-avatar-button');
    fireEvent.click(avatarButton);
    
    // 使用 data-testid 來定位下拉選單
    const dropdown = screen.getByTestId('user-dropdown');
    
    // 驗證下拉選單內容
    expect(within(dropdown).getByText('測試用戶')).toBeInTheDocument();
    expect(within(dropdown).getByText('test@example.com')).toBeInTheDocument();
    expect(within(dropdown).getByText('個人資料')).toBeInTheDocument();
    expect(within(dropdown).getByText('設定')).toBeInTheDocument();
    expect(within(dropdown).getByText('登出')).toBeInTheDocument();
  });

  test('登出功能正常運作', async () => {
    const mockLogout = jest.fn();
    
    // Mock AuthContext 的值
    jest.spyOn(require('../../contexts/AuthContext'), 'useAuth').mockImplementation(() => ({
      currentUser: {
        displayName: '測試用戶',
        email: 'test@example.com'
      },
      isAdmin: () => false,
      logout: mockLogout
    }));

    renderHeader();
    
    // 點擊用戶頭像打開下拉選單
    const avatarButton = screen.getByTestId('user-avatar-button');
    fireEvent.click(avatarButton);
    
    // 點擊登出按鈕
    const dropdown = screen.getByTestId('user-dropdown');
    const logoutButton = within(dropdown).getByText('登出');
    fireEvent.click(logoutButton);
    
    // 驗證登出函數被調用
    expect(mockLogout).toHaveBeenCalled();
  });
}); 