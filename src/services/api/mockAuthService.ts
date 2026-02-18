/**
 * MOCK AUTHENTICATION SERVICE
 * * This file simulates backend API calls during development.
 * It allows frontend development to proceed without waiting for the backend.
 * * FEATURES:
 * - Simulates network delays (1-2 seconds)
 * - "Magic Codes" (12345) always work for testing
 * - Simulates OTP expiration and storage
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
  profile?: Record<string, any>;
  expiresAt?: number;
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

// MAGIC CODES: These will ALWAYS verify successfully (for testing)
const MAGIC_TEST_CODES = ['123456', '000000', '111111'];

/**
 * MOCK: Send OTP to phone number or email
 */
const sendOTP = async (phoneOrEmail: string): Promise<AuthResponse> => {
  devLog('📱 Mock API: Sending OTP to', phoneOrEmail);

  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, ENV.TIMEOUTS.MOCK_DELAY));

  // Store OTP with expiration time
  const now = Date.now();
  const otpData: OTPData = {
    code: '123456', // Default 6-digit code
    sentAt: now,
    expiresAt: now + OTP_EXPIRY_MS,
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
 * UPDATED: Includes "Magic Code" bypass so testing never gets stuck.
 */
const verifyOTP = async (code: string, phoneOrEmail?: string, _mode?: 'login' | 'signup', _extra?: { email?: string; phone?: string }): Promise<AuthResponse> => {
  devLog('🔐 Mock API: Verifying OTP:', code);

  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, ENV.TIMEOUTS.MOCK_DELAY));

  // 1. Check if it is a "Magic Code" (Always works, bypasses storage)
  const isMagicCode = MAGIC_TEST_CODES.includes(code);

  // 2. Try to verify against "Real" Storage first
  if (phoneOrEmail) {
    const otpData = mockOTPStorage.get(phoneOrEmail);

    if (otpData) {
      // Check expiration
      if (Date.now() > otpData.expiresAt) {
        mockOTPStorage.delete(phoneOrEmail);
        return {
          success: false,
          message: 'OTP has expired. Please request a new one.',
        };
      }

      // Check if code matches storage
      if (code === otpData.code) {
        mockOTPStorage.delete(phoneOrEmail); // Clear used OTP
        return generateSuccessResponse(phoneOrEmail);
      }
    }
  }

  // 3. FALLBACK: If storage check failed (or didn't exist), but it IS a magic code, allow it.
  if (isMagicCode) {
    devLog('✨ Mock API: Magic Code used, bypassing storage check.');
    return generateSuccessResponse(phoneOrEmail || 'test_user');
  }

  // 4. Failure
  return {
    success: false,
    message: 'Invalid OTP. Please try again.',
  };
};

/**
 * Helper to generate consistent success response
 */
const generateSuccessResponse = (identifier: string): AuthResponse => ({
  success: true,
  message: 'OTP verified successfully',
  token: 'mock_jwt_token_' + Date.now(),
  user: {
    id: 'mock_user_' + Date.now(),
    phone: identifier,
  },
});

/**
 * MOCK: Resend OTP
 */
const resendOTP = async (phoneOrEmail: string): Promise<AuthResponse> => {
  devLog('🔄 Mock API: Resending OTP to', phoneOrEmail);

  await new Promise(resolve => setTimeout(resolve, ENV.TIMEOUTS.MOCK_DELAY));

  const now = Date.now();
  const otpData: OTPData = {
    code: '12345',
    sentAt: now,
    expiresAt: now + OTP_EXPIRY_MS,
  };

  mockOTPStorage.set(phoneOrEmail, otpData);
  devLog('🔄 Mock API: New OTP stored', otpData);

  return {
    success: true,
    message: 'New OTP sent successfully',
    expiresAt: otpData.expiresAt,
  };
};

/**
 * MOCK: Login
 */
const login = async (email: string, password: string): Promise<AuthResponse> => {
  devLog('🔑 Mock API: Logging in user:', email);
  
  await new Promise(resolve => setTimeout(resolve, ENV.TIMEOUTS.MOCK_DELAY));
  
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
 * MOCK: Logout
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
 * MOCK: Get current user
 */
const getMe = async (): Promise<AuthResponse> => {
  devLog('👤 Mock API: Getting current user');
  await new Promise(resolve => setTimeout(resolve, 500));
  const mockProfile = {
    id: 'mock_user_123',
    _id: 'mock_user_123',
    name: 'Test User',
    phone: '+2348012345678',
    email: 'test@example.com',
    gender: 'male',
    lookingFor: 'women',
    relationshipGoal: 'Find a relationship',
    interests: ['coffee', 'football', 'concerts', 'galleries', 'swimming'],
    photos: [],
    verified: false,
  };
  return {
    success: true,
    message: 'User fetched successfully',
    user: {
      id: mockProfile.id,
      phone: mockProfile.phone,
      email: mockProfile.email,
    },
    profile: mockProfile,
  };
};

/**
 * MOCK: Delete account
 */
const deleteAccount = async (): Promise<AuthResponse> => {
  devLog('🗑️ Mock API: Deleting account');
  await new Promise(resolve => setTimeout(resolve, 500));
  return {
    success: true,
    message: 'Account deleted successfully',
  };
};

export const mockAuthService = {
  sendOTP,
  verifyOTP,
  resendOTP,
  getMe,
  login,
  logout,
  deleteAccount,
};

export default mockAuthService;