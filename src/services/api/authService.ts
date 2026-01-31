// src/services/api/authService.ts

/**
 * AUTHENTICATION SERVICE
 * 
 * This is the MAIN authentication service used throughout the app.
 * It automatically switches between mock and real API based on environment.
 * 
 * HOW IT WORKS:
 * - In DEVELOPMENT: Uses mockAuthService (fake data, no backend needed)
 * - In PRODUCTION: Uses realAuthService (actual API calls)
 * 
 * USAGE IN COMPONENTS:
 * import { authService } from '@services/api/authService';
 * 
 * const result = await authService.verifyOTP(code);
 * if (result.success) {
 *   // OTP is valid
 * }
 * 
 * SWITCHING TO PRODUCTION:
 * When backend is ready, just change the export line below:
 * export const authService = realAuthService; // Change this line
 * 
 * That's it! The entire app automatically uses real API.
 */

import { ENV, devLog } from '@config/environment';
import { mockAuthService } from './mockAuthService';
import { realAuthService } from './realAuthService';

/**
 * AUTO-SWITCH LOGIC
 * 
 * If ENV.FEATURES.USE_MOCK_API is true (development mode):
 *   → Use mockAuthService
 * Otherwise (production mode):
 *   → Use realAuthService
 * 
 * The app automatically detects the environment and uses the right service.
 */
export const authService = ENV.FEATURES.USE_MOCK_API 
  ? mockAuthService   // DEVELOPMENT: Mock API (no backend needed)
  : realAuthService;  // PRODUCTION: Real API (requires backend)

// Log which service is being used (development only)
if (ENV.isDevelopment) {
  devLog(
    '🔧 Auth Service Mode:', 
    ENV.FEATURES.USE_MOCK_API ? 'MOCK (Development)' : 'REAL (Production)'
  );
}

/**
 * ALTERNATIVE: Manual Override
 * 
 * If you want to test with real API in development, or use mock in production
 * (for testing), you can manually override like this:
 * 
 * export const authService = realAuthService;  // Force real API
 * export const authService = mockAuthService;  // Force mock API
 */

export default authService;