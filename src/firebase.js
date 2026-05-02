// Check if Firebase is configured before importing anything
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

// Only import Firebase if configured
if (isFirebaseConfigured()) {
  console.log('🔥 Firebase detected - initializing...');
  
  // Dynamic imports only when Firebase is configured
  import('firebase/app').then(({ initializeApp }) => {
    import('firebase/analytics').then(({ getAnalytics }) => {
      try {
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
        
        console.log('✅ Firebase initialized successfully');
        console.log('📊 Analytics initialized');
      } catch (error) {
        console.warn('⚠️ Firebase initialization failed, continuing without Firebase:', error.message);
        app = null;
        analytics = null;
      }
    }).catch(error => {
      console.warn('⚠️ Firebase Analytics import failed:', error.message);
    });
  }).catch(error => {
    console.warn('⚠️ Firebase App import failed:', error.message);
  });
} else {
  console.log('ℹ️ Firebase not configured - running in local mode');
  console.log('ℹ️ To enable Firebase, run: npm run setup:env');
}

// Mock Firebase functions for local development
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

// Export analytics (use mock if Firebase not configured)
const finalAnalytics = analytics || mockAnalytics;
export { app, finalAnalytics as analytics };
