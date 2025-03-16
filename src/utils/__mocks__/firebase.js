import { jest } from '@jest/globals';

const mockUser = {
  uid: 'test-uid',
  email: 'test@example.com',
  displayName: '測試用戶',
  photoURL: null,
};

const auth = {
  currentUser: null,
  onAuthStateChanged: jest.fn((callback) => {
    callback(null);
    return () => {};
  }),
  signInWithEmailAndPassword: jest.fn(() => Promise.resolve({ user: mockUser })),
  signOut: jest.fn(() => Promise.resolve()),
  createUserWithEmailAndPassword: jest.fn(() => Promise.resolve({ user: mockUser })),
  signInWithPopup: jest.fn(() => Promise.resolve({ user: mockUser })),
  GoogleAuthProvider: jest.fn(() => ({
    addScope: jest.fn(),
  })),
};

const mockCollection = jest.fn(() => ({
  doc: jest.fn(() => ({
    get: jest.fn(() => Promise.resolve({
      exists: true,
      data: () => ({ /* mock data */ }),
    })),
    set: jest.fn(() => Promise.resolve()),
    update: jest.fn(() => Promise.resolve()),
    delete: jest.fn(() => Promise.resolve()),
  })),
  where: jest.fn(() => ({
    get: jest.fn(() => Promise.resolve({
      docs: [],
    })),
  })),
}));

const firestore = {
  collection: mockCollection,
};

export { auth, firestore }; 