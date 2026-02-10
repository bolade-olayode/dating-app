// src/services/api/realAuthService.ts

import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ENV, devLog, errorLog } from '@config/environment';
import { AuthResponse } from './mockAuthService';
import { STORAGE_KEYS } from '@utils/constant';

// ─── Axios Instance ──────────────────────────────────────────

export const apiClient = axios.create({
  baseURL: ENV.API_BASE_URL,
  timeout: ENV.TIMEOUTS.API_REQUEST,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ─── Request Interceptor (attach Bearer token) ──────────────

apiClient.interceptors.request.use(
  async (config) => {
    devLog('🌐 API Request:', config.method?.toUpperCase(), config.url);

    try {
      const token = await AsyncStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (e) {
      // Silently fail — token will be missing, API will return 401
    }

    return config;
  },
  (error) => {
    errorLog('Request Error:', error);
    return Promise.reject(error);
  },
);

// ─── Response Interceptor ────────────────────────────────────

apiClient.interceptors.response.use(
  (response) => {
    devLog('✅ API Response:', response.status, response.config.url);
    return response;
  },
  (error) => {
    const status = error.response?.status;
    const message = error.response?.data?.message || error.message;
    errorLog('❌ API Error:', status, message);
    return Promise.reject(error);
  },
);

// ─── Send OTP ────────────────────────────────────────────────
// mode = 'login'  → POST /api/auth/login/init
// mode = 'signup' → POST /api/onboarding/init (requires both email + phone)

const sendOTP = async (
  phoneOrEmail: string,
  mode: 'login' | 'signup' = 'login',
  extra?: { email?: string; phone?: string },
): Promise<AuthResponse> => {
  try {
    let url: string;
    let body: Record<string, string>;

    if (mode === 'signup') {
      // Signup requires both email and phone
      url = '/api/onboarding/init';
      body = {
        email: extra?.email || (phoneOrEmail.includes('@') ? phoneOrEmail : ''),
        phone: extra?.phone || (!phoneOrEmail.includes('@') ? phoneOrEmail : ''),
      };
    } else {
      // Login uses either phone or email
      url = '/api/auth/login/init';
      const isEmail = phoneOrEmail.includes('@');
      body = isEmail ? { email: phoneOrEmail } : { phone: phoneOrEmail };
    }

    const response = await apiClient.post(url, body);

    return {
      success: true,
      message: response.data?.message || 'OTP sent successfully',
      expiresAt: response.data?.expiresAt,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to send OTP. Please try again.',
    };
  }
};

// ─── Verify OTP ──────────────────────────────────────────────
// mode = 'login'  → POST /api/auth/login/verify
// mode = 'signup' → POST /api/onboarding/verify

const verifyOTP = async (
  code: string,
  phoneOrEmail?: string,
  mode: 'login' | 'signup' = 'login',
): Promise<AuthResponse> => {
  try {
    let url: string;
    let body: Record<string, string>;

    const isEmail = phoneOrEmail?.includes('@');

    if (mode === 'signup') {
      url = '/api/onboarding/verify';
      body = {
        otp: code,
        ...(isEmail ? { email: phoneOrEmail! } : { phone: phoneOrEmail! }),
      };
    } else {
      url = '/api/auth/login/verify';
      body = {
        otp: code,
        ...(isEmail ? { email: phoneOrEmail! } : { phone: phoneOrEmail! }),
      };
    }

    const response = await apiClient.post(url, body);

    const token = response.data?.token || response.data?.accessToken;
    const user = response.data?.user;

    // Persist token
    if (token) {
      await AsyncStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
    }

    return {
      success: true,
      message: 'OTP verified successfully',
      token,
      user: user
        ? { id: user.id || user._id, phone: user.phone, email: user.email }
        : undefined,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.response?.data?.message || 'Invalid OTP. Please try again.',
    };
  }
};

// ─── Resend OTP ──────────────────────────────────────────────
// Re-uses sendOTP under the hood

const resendOTP = async (
  phoneOrEmail: string,
  mode: 'login' | 'signup' = 'login',
  extra?: { email?: string; phone?: string },
): Promise<AuthResponse> => {
  return sendOTP(phoneOrEmail, mode, extra);
};

// ─── Get Current User ────────────────────────────────────────

const getMe = async (): Promise<AuthResponse> => {
  try {
    const response = await apiClient.get('/api/auth/me');
    const user = response.data?.user || response.data;

    return {
      success: true,
      message: 'User fetched successfully',
      user: {
        id: user.id || user._id,
        phone: user.phone,
        email: user.email,
      },
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to fetch user profile',
    };
  }
};

// ─── Login (legacy — not used by OTP flow) ───────────────────

const login = async (email: string, password: string): Promise<AuthResponse> => {
  try {
    const response = await apiClient.post('/api/auth/login', { email, password });
    return {
      success: true,
      message: 'Login successful',
      token: response.data?.token,
      user: response.data?.user,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.response?.data?.message || 'Login failed',
    };
  }
};

// ─── Logout ──────────────────────────────────────────────────

const logout = async (): Promise<AuthResponse> => {
  try {
    await AsyncStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
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

// ─── Export ──────────────────────────────────────────────────

export const realAuthService = {
  sendOTP,
  verifyOTP,
  resendOTP,
  getMe,
  login,
  logout,
};

export default realAuthService;
