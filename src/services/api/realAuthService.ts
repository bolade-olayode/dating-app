// src/services/api/realAuthService.ts

/**
 * REAL AUTHENTICATION SERVICE
 * 
 * This file will contain actual API calls to the backend.
 * Currently a placeholder - implement when backend is ready.
 * 
 * IMPLEMENTATION CHECKLIST (When Backend is Ready):
 * [ ] Install axios: npm install axios
 * [ ] Get API base URL from backend team
 * [ ] Get API endpoints documentation
 * [ ] Get authentication header format (Bearer token, etc.)
 * [ ] Implement error handling for each endpoint
 * [ ] Test with real backend in staging environment
 * [ ] Update ENV.API_BASE_URL in environment.ts
 * [ ] Switch to realAuthService in authService.ts
 */

import axios from 'axios';
import { ENV, devLog, errorLog } from '@config/environment';
import { AuthResponse } from './mockAuthService';

/**
 * CREATE AXIOS INSTANCE
 * 
 * This configures axios with default settings for all API calls.
 * Includes base URL, timeout, and default headers.
 */
const apiClient = axios.create({
  baseURL: ENV.API_BASE_URL,
  timeout: ENV.TIMEOUTS.API_REQUEST,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * REQUEST INTERCEPTOR
 * 
 * Runs before every API request.
 * Add authentication tokens, log requests in dev mode, etc.
 */
apiClient.interceptors.request.use(
  (config) => {
    devLog('🌐 API Request:', config.method?.toUpperCase(), config.url);
    
    // TODO: Add authentication token to headers
    // const token = await AsyncStorage.getItem('auth_token');
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
    
    return config;
  },
  (error) => {
    errorLog('Request Error:', error);
    return Promise.reject(error);
  }
);

/**
 * RESPONSE INTERCEPTOR
 * 
 * Runs after every API response.
 * Handle errors, refresh tokens, log responses, etc.
 */
apiClient.interceptors.response.use(
  (response) => {
    devLog('✅ API Response:', response.status, response.config.url);
    return response;
  },
  (error) => {
    errorLog('❌ API Error:', error.response?.status, error.message);
    
    // TODO: Handle specific error codes
    // if (error.response?.status === 401) {
    //   // Unauthorized - redirect to login
    // }
    // if (error.response?.status === 500) {
    //   // Server error - show user-friendly message
    // }
    
    return Promise.reject(error);
  }
);

/**
 * REAL: Send OTP
 * 
 * TODO: Implement when backend endpoint is ready
 * Expected endpoint: POST /auth/send-otp
 * Expected body: { phoneOrEmail: string }
 */
const sendOTP = async (phoneOrEmail: string): Promise<AuthResponse> => {
  try {
    const response = await apiClient.post('/auth/send-otp', {
      phoneOrEmail,
    });

    return {
      success: true,
      message: response.data.message || 'OTP sent successfully',
      expiresAt: response.data.expiresAt,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to send OTP',
    };
  }
};

/**
 * REAL: Verify OTP
 *
 * TODO: Implement when backend endpoint is ready
 * Expected endpoint: POST /auth/verify-otp
 * Expected body: { phoneOrEmail: string, code: string }
 */
const verifyOTP = async (code: string, phoneOrEmail?: string): Promise<AuthResponse> => {
  try {
    const response = await apiClient.post('/auth/verify-otp', {
      code,
      phoneOrEmail,
    });

    return {
      success: true,
      message: 'OTP verified successfully',
      token: response.data.token,
      user: response.data.user,
      expiresAt: response.data.expiresAt,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.response?.data?.message || 'Invalid OTP',
    };
  }
};

/**
 * REAL: Resend OTP
 * 
 * TODO: Implement when backend endpoint is ready
 */
const resendOTP = async (phoneOrEmail: string): Promise<AuthResponse> => {
  try {
    const response = await apiClient.post('/auth/resend-otp', {
      phoneOrEmail,
    });

    return {
      success: true,
      message: response.data.message || 'OTP resent successfully',
      expiresAt: response.data.expiresAt,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to resend OTP',
    };
  }
};

/**
 * REAL: Login
 * 
 * TODO: Implement when backend endpoint is ready
 */
const login = async (email: string, password: string): Promise<AuthResponse> => {
  try {
    const response = await apiClient.post('/auth/login', {
      email,
      password,
    });
    
    return {
      success: true,
      message: 'Login successful',
      token: response.data.token,
      user: response.data.user,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.response?.data?.message || 'Login failed',
    };
  }
};

/**
 * REAL: Logout
 * 
 * TODO: Implement when backend endpoint is ready
 */
const logout = async (): Promise<AuthResponse> => {
  try {
    await apiClient.post('/auth/logout');
    
    return {
      success: true,
      message: 'Logged out successfully',
    };
  } catch (error: any) {
    return {
      success: false,
      message: 'Logout failed',
    };
  }
};

/**
 * EXPORT: Real Authentication Service
 * 
 * Currently contains placeholder implementations.
 * Replace function bodies when backend endpoints are ready.
 */
export const realAuthService = {
  sendOTP,
  verifyOTP,
  resendOTP,
  login,
  logout,
};

export default realAuthService;