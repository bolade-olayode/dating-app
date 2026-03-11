// src/config/environment.ts

/**
 * ENVIRONMENT CONFIGURATION
 * 
 * This file controls app behavior based on the current environment (development vs production).
 * __DEV__ is a React Native global variable that's automatically true in development mode.
 * 
 * USAGE:
 * - Import ENV anywhere you need environment-specific behavior
 * - The app automatically uses mock services in development
 * - Production builds automatically use real APIs
 * 
 * EXAMPLE:
 * import { ENV } from '@config/environment';
 * const apiUrl = ENV.API_BASE_URL; // Auto-selects correct URL
 */

export const ENV = {
  // Automatically detect if we're in development mode
  isDevelopment: __DEV__,
  
  // API Base URLs (switches automatically based on environment)
  API_BASE_URL: __DEV__
    ? 'https://meetpie-backend.onrender.com'  // Development (Render)
    : 'https://meetpie-backend.onrender.com',  // Production API
  
  // Test credentials (ONLY available in development)
  TEST_OTP: '12345',
  TEST_PHONE: '+234 812 345 6789',
  TEST_EMAIL: 'test@opueh.com',
  
  // Feature flags (control what's enabled in different environments)
  FEATURES: {
    USE_MOCK_API: false,              // Set to true to use mock API (no backend needed)
    ENABLE_DEBUG_LOGS: __DEV__,      // Show console logs in development
    SKIP_ONBOARDING: false,          // Set to true to skip onboarding during dev (testing)
    ENABLE_ERROR_OVERLAY: __DEV__,   // Show error details in development
    DEV_CLEAR_STORAGE: false,         // ⚠️ DEV ONLY: wipe all storage on next launch (set false after reset)
  },
  
  // Social Auth — OAuth credentials
  // Google: https://console.cloud.google.com → APIs & Services → Credentials
  // Facebook: https://developers.facebook.com → Your App → Settings → Basic
  SOCIAL_AUTH: {
    GOOGLE_WEB_CLIENT_ID:     'YOUR_GOOGLE_WEB_CLIENT_ID',      // Web client ID (used in Expo Go)
    GOOGLE_IOS_CLIENT_ID:     'YOUR_GOOGLE_IOS_CLIENT_ID',      // iOS OAuth client ID
    GOOGLE_ANDROID_CLIENT_ID: 'YOUR_GOOGLE_ANDROID_CLIENT_ID',  // Android OAuth client ID
    FACEBOOK_APP_ID:          'YOUR_FACEBOOK_APP_ID',           // Facebook App ID
  },

  // Cloudinary (unsigned upload — swap keys for production)
  CLOUDINARY: {
    CLOUD_NAME: 'djfq0kez7',
    UPLOAD_PRESET: 'meetpie',
  },

  // Timeouts and delays (milliseconds)
  TIMEOUTS: {
    API_REQUEST: 30000,   
    OTP_RESEND: 18,         
    MOCK_DELAY: 1000,       
  },
};

/**
 * HELPER FUNCTION: Log only in development
 * Use this instead of console.log to avoid logs in production
 * 
 * USAGE:
 * devLog('User logged in:', userData);
 */
export const devLog = (...args: any[]) => {
  if (ENV.FEATURES.ENABLE_DEBUG_LOGS) {
    console.log('🔍 [DEV]', ...args);
  }
};

/**
 * HELPER FUNCTION: Log errors (works in all environments)
 * Always use this for error logging
 * 
 * USAGE:
 * errorLog('API Error:', error);
 */
export const errorLog = (...args: any[]) => {
  console.error('❌ [ERROR]', ...args);
};

export default ENV;