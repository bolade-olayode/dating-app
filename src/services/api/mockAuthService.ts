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
  expiresAt?: number; // Timestamp when OTP expires
}

// OTP Storage with expiration tracking
interface OTPData {
  code: string;
  sentAt: number;
  expiresAt: number;
}

// In-memory storage for OTPs (simulates database)
const mockOTPStorage = new Map<string, OTPData>();

// OTP expiration time: 10 minutes
const OTP_EXPIRY_MS = 10 * 60 * 1000;

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

  // Store OTP with expiration time
  const now = Date.now();
  const otpData: OTPData = {
    code: ENV.TEST_OTP, // '123456'
    sentAt: now,
    expiresAt: now + OTP_EXPIRY_MS, // 10 minutes from now
  };

  mockOTPStorage.set(phoneOrEmail, otpData);
  devLog('📱 Mock API: OTP stored, expires at', new Date(otpData.expiresAt).toLocaleTimeString());

  return {
    success: true,
    message: `OTP sent to ${phoneOrEmail}`,
    expiresAt: otpData.expiresAt,
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
const verifyOTP = async (code: string, phoneOrEmail?: string): Promise<AuthResponse> => {
  devLog('🔐 Mock API: Verifying OTP:', code);

  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, ENV.TIMEOUTS.MOCK_DELAY));

  // If phoneOrEmail provided, check against stored OTP with expiration
  if (phoneOrEmail) {
    const otpData = mockOTPStorage.get(phoneOrEmail);

    if (!otpData) {
      return {
        success: false,
        message: 'No OTP found. Please request a new one.',
      };
    }

    // Check expiration
    if (Date.now() > otpData.expiresAt) {
      devLog('🔐 Mock API: OTP expired!');
      mockOTPStorage.delete(phoneOrEmail); // Clear expired OTP
      return {
        success: false,
        message: 'OTP has expired. Please request a new one.',
      };
    }

    // Verify code matches
    if (code === otpData.code) {
      mockOTPStorage.delete(phoneOrEmail); // Clear used OTP
      return {
        success: true,
        message: 'OTP verified successfully',
        token: 'mock_jwt_token_' + Date.now(),
        user: {
          id: 'mock_user_' + Date.now(),
          phone: phoneOrEmail,
        },
      };
    } else {
      return {
        success: false,
        message: 'Invalid OTP. Please try again.',
      };
    }
  }

  // Fallback: Accept test OTPs without expiration check (for backwards compatibility)
  const validTestOTPs = [
    ENV.TEST_OTP, // '123456' from environment
    '000000', // Alternative test code
    '111111', // Alternative test code
  ];

  const isValid = validTestOTPs.includes(code);

  if (isValid) {
    return {
      success: true,
      message: 'OTP verified successfully',
      token: 'mock_jwt_token_' + Date.now(),
      user: {
        id: 'mock_user_' + Date.now(),
        phone: ENV.TEST_PHONE,
      },
    };
  } else {
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

  // Store new OTP with fresh expiration
  const now = Date.now();
  const otpData: OTPData = {
    code: ENV.TEST_OTP,
    sentAt: now,
    expiresAt: now + OTP_EXPIRY_MS,
  };

  mockOTPStorage.set(phoneOrEmail, otpData);
  devLog('🔄 Mock API: New OTP stored, expires at', new Date(otpData.expiresAt).toLocaleTimeString());

  return {
    success: true,
    message: 'New OTP sent successfully',
    expiresAt: otpData.expiresAt,
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