import { PutObjectCommand } from "@aws-sdk/client-s3";
import { v4 as uuidv4 } from 'uuid';
import { r2Client, r2Config, imageConfig } from './r2Config';
import imageCompression from 'browser-image-compression';

/**
 * 驗證圖片文件
 * @param {File} file - 要驗證的圖片文件
 * @throws {Error} 如果文件不符合要求則拋出錯誤
 */
export const validateImage = (file) => {
  // 檢查文件類型
  if (!imageConfig.allowedTypes.includes(file.type)) {
    throw new Error(`不支援的文件類型。支援的類型：${imageConfig.allowedTypes.join(', ')}`);
  }

  // 檢查文件大小
  if (file.size > imageConfig.maxSize) {
    const maxSizeMB = imageConfig.maxSize / (1024 * 1024);
    throw new Error(`文件大小不能超過 ${maxSizeMB}MB`);
  }
};

/**
 * 生成唯一的文件名
 * @param {string} originalName - 原始文件名
 * @param {string} folder - 存儲文件夾
 * @returns {string} 生成的唯一文件名
 */
export const generateUniqueFileName = (originalName, folder = 'temp/') => {
  const fileExtension = originalName.split('.').pop();
  const timestamp = Date.now();
  const uuid = uuidv4();
  return `${folder}${timestamp}_${uuid}.${fileExtension}`;
};

/**
 * 獲取文件的內容類型
 * @param {File} file - 文件對象
 * @returns {string} 內容類型
 */
export const getContentType = (file) => {
  return file.type || 'application/octet-stream';
};

/**
 * 將文件轉換為 ArrayBuffer
 * @param {File} file - 要轉換的文件
 * @returns {Promise<ArrayBuffer>} 轉換後的 ArrayBuffer
 */
export const fileToArrayBuffer = async (file) => {
  return await file.arrayBuffer();
};

/**
 * 上傳圖片到 R2 存儲
 * @param {File} file - 要上傳的圖片文件
 * @param {string} folder - 存儲文件夾路徑
 * @returns {Promise<string>} 上傳成功後的圖片 URL
 */
export const uploadImageToR2 = async (file, folder = 'images/') => {
  try {
    // 驗證圖片
    validateImage(file);

    // 生成唯一文件名
    const fileName = generateUniqueFileName(file.name, folder);

    // 將文件轉換為 ArrayBuffer
    const buffer = await fileToArrayBuffer(file);

    // 創建上傳命令
    const command = new PutObjectCommand({
      Bucket: r2Config.bucket,
      Key: fileName,
      Body: buffer,
      ContentType: getContentType(file),
      CacheControl: 'public, max-age=31536000',
    });

    // 執行上傳
    await r2Client.send(command);

    // 返回圖片 URL
    const imageUrl = `${r2Config.endpoint}/${fileName}`;
    console.log('上傳成功，圖片URL:', imageUrl);
    return imageUrl;

  } catch (error) {
    console.error('上傳圖片失敗:', error);
    throw new Error(error.message || '上傳圖片失敗');
  }
};

/**
 * 批量上傳圖片
 * @param {File[]} files - 要上傳的圖片文件數組
 * @param {string} folder - 存儲文件夾路徑
 * @returns {Promise<string[]>} 上傳成功後的圖片 URL 數組
 */
export const uploadImages = async (files, folder = 'images/') => {
  try {
    const uploadPromises = files.map(file => uploadImageToR2(file, folder));
    return await Promise.all(uploadPromises);
  } catch (error) {
    console.error('批量上傳圖片失敗:', error);
    throw new Error('批量上傳圖片失敗');
  }
};

/**
 * 從 URL 中提取文件名
 * @param {string} url - 圖片 URL
 * @returns {string|null} 文件名或 null
 */
export const extractFileNameFromUrl = (url) => {
  try {
    const urlObj = new URL(url);
    return urlObj.pathname.split('/').pop() || null;
  } catch (error) {
    console.error('解析 URL 失敗:', error);
    return null;
  }
};

/**
 * 檢查圖片 URL 是否有效
 * @param {string} url - 要檢查的圖片 URL
 * @returns {Promise<boolean>} URL 是否有效
 */
export const isImageUrlValid = async (url) => {
  try {
    const response = await fetch(url, { method: 'HEAD' });
    return response.ok;
  } catch (error) {
    console.error('檢查圖片 URL 失敗:', error);
    return false;
  }
};

/**
 * 壓縮圖片
 * @param {File} file - 要壓縮的圖片文件
 * @param {Object} options - 壓縮選項
 * @returns {Promise<File>} 壓縮後的圖片文件
 */
export const compressImage = async (file, customOptions = {}) => {
    try {
      const options = {
        maxSizeMB: 1,              // 最大文件大小
        maxWidthOrHeight: 1920,    // 最大寬度或高度
        useWebWorker: true,        // 使用 Web Worker
        fileType: file.type,       // 保持原始文件類型
        ...customOptions           // 允許自定義選項覆蓋默認值
      };
  
      console.log('開始壓縮圖片:', file.name);
      const compressedFile = await imageCompression(file, options);
      console.log('壓縮完成:', {
        原始大小: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
        壓縮後: `${(compressedFile.size / 1024 / 1024).toFixed(2)} MB`,
      });
  
      return compressedFile;
    } catch (error) {
      console.error('壓縮圖片失敗:', error);
      throw new Error('壓縮圖片失敗');
    }
  };
  
  /**
   * 上傳圖片到 R2 存儲（包含壓縮）
   * @param {File} file - 要上傳的圖片文件
   * @param {string} folder - 存儲文件夾路徑
   * @param {Object} compressionOptions - 壓縮選項
   * @returns {Promise<string>} 上傳成功後的圖片 URL
   */
  export const uploadImageToR2WithCompression = async (file, folder = 'images/', compressionOptions = {}) => {
    try {
      // 驗證圖片
      validateImage(file);
  
      // 壓縮圖片（如果文件大於 1MB）
      let processedFile = file;
      if (file.size > 1024 * 1024) {
        processedFile = await compressImage(file, compressionOptions);
      }
  
      // 生成唯一文件名
      const fileName = generateUniqueFileName(file.name, folder);
  
      // 將文件轉換為 ArrayBuffer
      const buffer = await fileToArrayBuffer(processedFile);
  
      // 創建上傳命令
      const command = new PutObjectCommand({
        Bucket: r2Config.bucket,
        Key: fileName,
        Body: buffer,
        ContentType: getContentType(processedFile),
        CacheControl: 'public, max-age=31536000',
      });
  
      // 執行上傳
      await r2Client.send(command);
  
      // 返回圖片 URL
      const imageUrl = `${r2Config.endpoint}/${fileName}`;
      console.log('上傳成功，圖片URL:', imageUrl);
      return imageUrl;
  
    } catch (error) {
      console.error('上傳圖片失敗:', error);
      throw new Error(error.message || '上傳圖片失敗');
    }
  };

export const cleanupTempFiles = async (folder = 'temp/') => {
  // 實作臨時檔案清理邏輯
  console.log('清理臨時檔案:', folder);
};