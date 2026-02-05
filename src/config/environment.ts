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
    ? 'http://localhost:5000/api/v1'  // Local development server
    : 'https://api.opueh.com/v1',      // Production API
  
  // Test credentials (ONLY available in development)
  TEST_OTP: '12345',
  TEST_PHONE: '+234 812 345 6789',
  TEST_EMAIL: 'test@opueh.com',
  
  // Feature flags (control what's enabled in different environments)
  FEATURES: {
    USE_MOCK_API: __DEV__,           // Use mock API in development
    ENABLE_DEBUG_LOGS: __DEV__,      // Show console logs in development
    SKIP_ONBOARDING: false,          // Set to true to skip onboarding during dev (testing)
    ENABLE_ERROR_OVERLAY: __DEV__,   // Show error details in development
  },
  
  // Timeouts and delays (milliseconds)
  TIMEOUTS: {
    API_REQUEST: 30000,     // 30 seconds
    OTP_RESEND: 18,         // 18 seconds (as per Figma)
    MOCK_DELAY: 1000,       // Simulate network delay in mock API
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