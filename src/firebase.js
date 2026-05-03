import { initializeApp } from 'firebase/app'
import { getAnalytics } from 'firebase/analytics'
import { getFirestore } from 'firebase/firestore'

// Check if Firebase is configured
const isFirebaseConfigured = () => {
  const requiredVars = [
    'VITE_FIREBASE_API_KEY',
    'VITE_FIREBASE_AUTH_DOMAIN',
    'VITE_FIREBASE_PROJECT_ID',
    'VITE_FIREBASE_STORAGE_BUCKET',
    'VITE_FIREBASE_MESSAGING_SENDER_ID',
    'VITE_FIREBASE_APP_ID',
    'VITE_FIREBASE_MEASUREMENT_ID'
  ];
  
  return requiredVars.every(varName => {
    const value = import.meta.env[varName];
    return value && value !== '' && value !== 'your_firebase_api_key_here';
  });
};

let app = null;
let analytics = null;
let db = null;

// Initialize Firebase if configured
if (isFirebaseConfigured()) {
  try {
    console.log('🔥 Firebase detected - initializing...');
    
    const firebaseConfig = {
      apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
      authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
      projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
      storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
      messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
      appId: import.meta.env.VITE_FIREBASE_APP_ID,
      measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
    };
    
    app = initializeApp(firebaseConfig);
    analytics = getAnalytics(app);
    db = getFirestore(app);
    
    console.log('✅ Firebase initialized successfully');
    console.log('📊 Analytics initialized');
    console.log('🗄️ Firestore initialized');
  } catch (error) {
    console.warn('⚠️ Firebase initialization failed, continuing without Firebase:', error.message);
    app = null;
    analytics = null;
    db = null;
  }
} else {
  console.log('ℹ️ Firebase not configured - running in local mode');
  console.log('ℹ️ To enable Firebase, run: npm run setup:env');
}

// Mock Analytics for local development
const mockAnalytics = {
  logEvent: (eventName, params) => {
    console.log(`📊 [Mock Analytics] ${eventName}:`, params);
  },
  setUserId: (userId) => {
    console.log(`👤 [Mock Analytics] User ID set: ${userId}`);
  },
  setUserProperties: (properties) => {
    console.log(`🔧 [Mock Analytics] User properties:`, properties);
  }
};

// Mock Firestore for local development
class MockFirestore {
  collection(path) {
    return {
      add: async (data) => {
        console.log(`🗄️ [Mock Firestore] Adding to ${path}:`, data);
        return { id: 'mock-' + Date.now() };
      },
      get: async () => {
        console.log(`🗄️ [Mock Firestore] Getting collection ${path}`);
        return { docs: [], empty: true };
      }
    };
  }
  
  doc(path, id) {
    return {
      get: async () => {
        console.log(`🗄️ [Mock Firestore] Getting document ${path}/${id}`);
        return { 
          exists: () => false, 
          data: () => null,
          id: id
        };
      },
      set: async (data) => {
        console.log(`🗄️ [Mock Firestore] Setting document ${path}/${id}:`, data);
      }
    };
  }
}

const mockDb = new MockFirestore();

// Export with fallbacks
export { app };
export const finalAnalytics = analytics || mockAnalytics;
export const finalDb = db || mockDb;

// Named exports for convenience
export { finalAnalytics as analytics, finalDb as db };
