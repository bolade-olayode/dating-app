// src/services/api/mockAuthService.ts

/**
 * MOCK AUTHENTICATION SERVICE
 * 
 * This file simulates backend API calls during development.
 * It allows frontend development to proceed without waiting for the backend.
 * 
 * WHY WE NEED THIS:
 * - Develop and test UI flows without a backend
 * - Simulate network delays and errors realistically
 * - Easy to swap with real API when backend is ready
 * 
 * HOW IT WORKS:
 * - Returns promises like a real API would
 * - Includes artificial delays to simulate network requests
 * - Can simulate both success and error cases
 * 
 * REPLACING WITH REAL API:
 * When backend is ready, just change one line in authService.ts:
 * export const authService = realAuthService; // Instead of mockAuthService
 */

import { ENV, devLog } from '@config/environment';

// Type definitions for API responses
export interface AuthResponse {
  success: boolean;
  message: string;
  token?: string;
  user?: {
    id: string;
    phone?: string;
    email?: string;
  };
}

/**
 * MOCK: Send OTP to phone number or email
 * 
 * In real implementation, this would:
 * - Call SMS provider (Twilio, Termii, etc.)
 * - Generate and store OTP in database
 * - Return success/error status
 */
const sendOTP = async (phoneOrEmail: string): Promise<AuthResponse> => {
  devLog('📱 Mock API: Sending OTP to', phoneOrEmail);
  
  // Simulate network delay (realistic API behavior)
  await new Promise(resolve => setTimeout(resolve, ENV.TIMEOUTS.MOCK_DELAY));
  
  // Simulate successful OTP sending
  // In production, this would actually send an SMS/email
  return {
    success: true,
    message: `OTP sent to ${phoneOrEmail}`,
  };
};

/**
 * MOCK: Verify OTP code
 * 
 * In real implementation, this would:
 * - Check if OTP matches what was sent
 * - Verify it hasn't expired
 * - Return JWT token if valid
 * - Return error if invalid/expired
 */
const verifyOTP = async (code: string): Promise<AuthResponse> => {
  devLog('🔐 Mock API: Verifying OTP:', code);
  
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, ENV.TIMEOUTS.MOCK_DELAY));
  
  // Define valid test OTPs for development
  // In production, this would check against database
  const validTestOTPs = [
    ENV.TEST_OTP,  // '123456' from environment
    '000000',      // Alternative test code
    '111111',      // Alternative test code
  ];
  
  const isValid = validTestOTPs.includes(code);
  
  if (isValid) {
    // Simulate successful verification with mock JWT token
    return {
      success: true,
      message: 'OTP verified successfully',
      token: 'mock_jwt_token_' + Date.now(), // Mock JWT
      user: {
        id: 'mock_user_' + Date.now(),
        phone: ENV.TEST_PHONE,
      },
    };
  } else {
    // Simulate failed verification
    return {
      success: false,
      message: 'Invalid OTP. Please try again.',
    };
  }
};

/**
 * MOCK: Resend OTP
 * 
 * In real implementation, this would:
 * - Generate new OTP
 * - Invalidate old OTP
 * - Send new OTP via SMS/email
 */
const resendOTP = async (phoneOrEmail: string): Promise<AuthResponse> => {
  devLog('🔄 Mock API: Resending OTP to', phoneOrEmail);
  
  await new Promise(resolve => setTimeout(resolve, ENV.TIMEOUTS.MOCK_DELAY));
  
  return {
    success: true,
    message: 'New OTP sent successfully',
  };
};

/**
 * MOCK: Login with email and password
 * 
 * In real implementation, this would:
 * - Verify credentials against database
 * - Return JWT token if valid
 * - Return error if invalid
 */
const login = async (email: string, password: string): Promise<AuthResponse> => {
  devLog('🔑 Mock API: Logging in user:', email);
  
  await new Promise(resolve => setTimeout(resolve, ENV.TIMEOUTS.MOCK_DELAY));
  
  // Accept any credentials in development
  // In production, this would verify against database
  return {
    success: true,
    message: 'Login successful',
    token: 'mock_jwt_token_' + Date.now(),
    user: {
      id: 'mock_user_' + Date.now(),
      email: email,
    },
  };
};

/**
 * MOCK: Logout user
 * 
 * In real implementation, this would:
 * - Invalidate JWT token on server
 * - Clear user session
 */
const logout = async (): Promise<AuthResponse> => {
  devLog('👋 Mock API: Logging out user');
  
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return {
    success: true,
    message: 'Logged out successfully',
  };
};

/**
 * EXPORT: Mock Authentication Service
 * 
 * This object mimics the real API service interface.
 * All functions return promises, just like real API calls.
 */
export const mockAuthService = {
  sendOTP,
  verifyOTP,
  resendOTP,
  login,
  logout,
};

export default mockAuthService;