# 專案設置步驟

## 1. 初始化專案

```bash
# 使用 Vite 創建 React 專案
npm create vite@latest my-blog -- --template react

# 進入專案目錄
cd my-blog

# 安裝依賴
npm install
```

## 2. 安裝必要的依賴套件

```bash
# React 相關
npm install react react-dom
npm install react-router-dom

# Firebase 相關
npm install firebase

# 動畫相關
npm install framer-motion

# Tailwind CSS 相關
npm install -D tailwindcss postcss autoprefixer
npm install @headlessui/react @heroicons/react
npm install classnames

# R2 上傳相關
npm install @aws-sdk/client-s3 uuid

# 工具類
npm install date-fns
```

## 3. 建立專案結構

```bash
src/
├── assets/                 # 靜態資源 (圖片、樣式等)
│   ├── images/
│   ├── icons/
│   └── styles/
│
├── components/             # 共用元件 (可重複使用的 UI)
│   ├── common/            # 基礎UI元件 (Button, Input, Modal)
│   ├── layout/            # 版面相關 (Header, Footer, Sidebar)
│   └── form/              # 表單元件 (可選)
│
├── features/              # 功能模組
│   ├── auth/             # 認證相關
│   │   ├── hooks/
│   │   ├── services/
│   │   ├── LoginForm.jsx
│   │   └── RegisterForm.jsx
│   ├── posts/            # 文章相關
│   ├── profile/          # 個人資料相關
│
├── hooks/                # 全局共用 hooks
│
├── services/             # API 服務 (全局)
│   ├── api.js
│   ├── firebase.js
│   ├── authService.js
│   ├── postService.js
│   └── userService.js
│
├── utils/                # 工具函數
│
├── constants/            # 常量定義
│
├── contexts/             # Context API
│
├── store/                # Redux/Zustand 狀態管理 (可選)
│   ├── authSlice.js
│   ├── postSlice.js
│   └── store.js
│
├── pages/                # 頁面組件
│   ├── Home/
│   ├── Profile/
│   ├── Admin/
│
├── layouts/              # 頁面布局
│   ├── MainLayout.jsx
│   ├── AdminLayout.jsx
│   └── AuthLayout.jsx
│
├── App.jsx
└── main.jsx
```

## 4. 設置 Firebase

1. 創建 Firebase 專案並獲取配置信息。

2. 在專案根目錄創建 `.env` 文件，添加 Firebase 配置：

   ```
   VITE_FIREBASE_API_KEY=your_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   ```

3. 創建 Firebase 配置文件：

   ```javascript
   // src/services/firebase.js
   import { initializeApp } from 'firebase/app';
   import { getAuth } from 'firebase/auth';
   import { getFirestore } from 'firebase/firestore';
   import { getStorage } from 'firebase/storage';

   const firebaseConfig = {
     apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
     authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
     projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
     storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
     messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
     appId: import.meta.env.VITE_FIREBASE_APP_ID
   };

   const app = initializeApp(firebaseConfig);

   export const auth = getAuth(app);
   export const db = getFirestore(app);
   export const storage = getStorage(app);
   ```
4. 設置 Cloudflare R2 相關的服務和工具:

R2 是 Cloudflare 的物件存儲服務，需考慮安全性、上傳功能、錯誤處理、緩存策略和環境配置。

首先在專案根目錄創建 `.env` 文件:

```bash
VITE_R2_ACCOUNT_ID=your_account_id
VITE_R2_ACCESS_KEY_ID=your_access_key_id  
VITE_R2_SECRET_ACCESS_KEY=your_secret_access_key
VITE_R2_BUCKET_NAME=your_bucket_name
VITE_R2_PUBLIC_URL=your_public_url
VITE_R2_ENDPOINT=your_endpoint
```

然後創建 R2 服務:

```javascript
// src/services/r2Service.js
import { S3Client } from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';

const r2Client = new S3Client({
  region: 'auto',
  endpoint: `https://${import.meta.env.VITE_R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: import.meta.env.VITE_R2_ACCESS_KEY_ID,
    secretAccessKey: import.meta.env.VITE_R2_SECRET_ACCESS_KEY,
  }
});

export const uploadFileToR2 = async (file, path = '') => {
  const key = `${path}${Date.now()}-${file.name}`;
  const upload = new Upload({
    client: r2Client,
    params: {
      Bucket: import.meta.env.VITE_R2_BUCKET_NAME,
      Key: key,
      Body: file,
      ContentType: file.type,
    },
  });
  await upload.done();
  return { url: `${import.meta.env.VITE_R2_PUBLIC_URL}/${key}`, key };
};

export const deleteFileFromR2 = async (key) => {
  await r2Client.deleteObject({
    Bucket: import.meta.env.VITE_R2_BUCKET_NAME,
    Key: key
  });
};

export const getR2FileUrl = (key) => 
  key ? `${import.meta.env.VITE_R2_PUBLIC_URL}/${key}` : null;
```

創建上傳 Hook:

```javascript
// src/hooks/useR2Upload.js
import { useState } from 'react';
import { uploadFileToR2 } from '../services/r2Service';

export const useR2Upload = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState(null);
  const [progress, setProgress] = useState(0);

  const upload = async (file, path = '') => {
    try {
      setIsUploading(true);
      setError(null);
      setProgress(0);
      if (file.size > 5 * 1024 * 1024) throw new Error('File size exceeds 5MB limit');
      if (!['image/jpeg', 'image/png', 'image/gif'].includes(file.type)) 
        throw new Error('Invalid file type');
      const result = await uploadFileToR2(file, path);
      setProgress(100);
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsUploading(false);
    }
  };

  return { upload, isUploading, error, progress };
};
```

使用示例:

```javascript
// src/components/ImageUpload.jsx
import { useR2Upload } from '../hooks/useR2Upload';

export const ImageUpload = () => {
  const { upload, isUploading, error, progress } = useR2Upload();

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    try {
      const { url } = await upload(file, 'images/');
      console.log('Uploaded file URL:', url);
    } catch (err) {
      console.error('Upload failed:', err);
    }
  };

  return (
    <div>
      <input type="file" accept="image/*" onChange={handleFileChange} disabled={isUploading} />
      {isUploading && <progress value={progress} max="100" />}
      {error && <p className="text-red-500">{error}</p>}
    </div>
  );
};
```

工具函數:

```javascript
// src/utils/r2Utils.js
export const getImageUrl = (key) => 
  !key ? null : key.startsWith('http') ? key : `${import.meta.env.VITE_R2_PUBLIC_URL}/${key}`;

export const getFileNameFromUrl = (url) => 
  url ? url.split('/').pop() : '';

export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};
```

這配置提供了安全性、功能完整性、良好用戶體驗、可維護性和擴展性。

### 1. 認證系統

實現認證相關功能：

```javascript
// src/features/auth/services/authService.js
import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut
} from 'firebase/auth';
import { auth, db } from '../../../utils/firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';

export const authService = {
  // 註冊
  async register(email, password, displayName) {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    await setDoc(doc(db, 'users', userCredential.user.uid), {
      displayName,
      email,
      createdAt: new Date(),
      photoURL: null,
      bio: ''
    });
    return userCredential.user;
  },

  // 登入
  async login(email, password) {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  },

  // Google 登入
  async googleLogin() {
    const provider = new GoogleAuthProvider();
    const userCredential = await signInWithPopup(auth, provider);
    const userDoc = await getDoc(doc(db, 'users', userCredential.user.uid));
    if (!userDoc.exists()) {
      await setDoc(doc(db, 'users', userCredential.user.uid), {
        displayName: userCredential.user.displayName,
        email: userCredential.user.email,
        photoURL: userCredential.user.photoURL,
        createdAt: new Date(),
        bio: ''
      });
    }
    return userCredential.user;
  },

  // 登出
  async logout() {
    await signOut(auth);
  }
};
```

### 2. 文章系統

實現文章相關功能：

```javascript
// src/features/posts/services/postService.js
import { 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  where,
  orderBy,
  limit,
  startAfter
} from 'firebase/firestore';
import { db } from '../../../utils/firebase';
import { uploadFileToR2 } from '../../../services/r2Service';

export const postService = {
  // 創建文章
  async createPost({ title, content, images, category, authorId }) {
    const imageUrls = await Promise.all(
      images.map(image => uploadFileToR2(image, 'posts/'))
    );
    const post = await addDoc(collection(db, 'posts'), {
      title,
      content,
      imageUrls: imageUrls.map(img => img.url),
      category,
      authorId,
      createdAt: new Date(),
      likes: [],
      comments: []
    });
    return post;
  },

  // 獲取文章列表
  async getPosts({ category = 'all', page = 1, limit: pageLimit = 10 }) {
    const postsRef = collection(db, 'posts');
    let postsQuery = query(
      postsRef,
      orderBy('createdAt', 'desc'),
      limit(pageLimit)
    );
    if (category !== 'all') {
      postsQuery = query(
        postsQuery,
        where('category', '==', category)
      );
    }
    const snapshot = await getDocs(postsQuery);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  }
};
```

### 3. 用戶系統

實現用戶相關功能：

```javascript
// src/features/profile/services/userService.js
import { doc, updateDoc, getDoc } from 'firebase/firestore';
import { db } from '../../../utils/firebase';
import { uploadFileToR2 } from '../../../services/r2Service';

export const userService = {
  // 更新個人資料
  async updateProfile(userId, data) {
    const userRef = doc(db, 'users', userId);
    if (data.avatar) {
      const { url } = await uploadFileToR2(data.avatar, 'avatars/');
      data.photoURL = url;
      delete data.avatar;
    }
    await updateDoc(userRef, data);
  },

  // 獲取用戶資料
  async getUserProfile(userId) {
    const userDoc = await getDoc(doc(db, 'users', userId));
    if (!userDoc.exists()) {
      throw new Error('User not found');
    }
    return {
      id: userDoc.id,
      ...userDoc.data()
    };
  }
};
```

### 4. UI/UX 設計

建立基本的 UI 組件：

```javascript
// src/components/common/Button/Button.jsx
import { forwardRef } from 'react';
import classNames from 'classnames';

export const Button = forwardRef(({
  children,
  variant = 'primary',
  size = 'md',
  disabled,
  loading,
  className,
  ...props
}, ref) => {
  const baseStyles = 'inline-flex items-center justify-center rounded-md font-medium';
  const variants = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700',
    secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300',
    outline: 'border border-gray-300 text-gray-700 hover:bg-gray-50'
  };
  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg'
  };

  return (
    <button
      ref={ref}
      className={classNames(
        baseStyles,
        variants[variant],
        sizes[size],
        disabled && 'opacity-50 cursor-not-allowed',
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <span className="mr-2">
          <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
            {/* Loading spinner SVG */}
          </svg>
        </span>
      )}
      {children}
    </button>
  );
});
```

### 5. 部署配置

建立部署配置文件：

```javascript
// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          firebase: ['firebase/app', 'firebase/auth', 'firebase/firestore']
        }
      }
    }
  },
  server: {
    port: 3000
  }
});
```

### 6. 下一步建議

1. 實現頁面路由
   - 設置受保護的路由
   - 實現路由守衛

2. 加入狀態管理
   - 考慮使用 Redux 或 Zustand
   - 實現數據持久化

3. 優化用戶體驗
   - 加入載入狀態
   - 實現錯誤處理
   - 添加動畫效果

4. 實現社交功能
   - 關注系統
   - 評論系統
   - 通知系統

5. 性能優化
   - 實現懶加載
   - 優化圖片加載
   - 實現無限滾動

6. 測試
   - 單元測試
   - 集成測試
   - E2E 測試
