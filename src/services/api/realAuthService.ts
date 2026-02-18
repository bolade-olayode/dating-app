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

// ─── Wake Up Backend (Render cold-start workaround) ─────────
// Sends a lightweight ping to wake the server before the real request.
// The ping has a long timeout (60s) since cold-starts can take 30-50s.

let isServerAwake = false;

const ensureServerAwake = async (): Promise<void> => {
  if (isServerAwake) return;

  try {
    devLog('🏓 Pinging backend to wake it up...');
    await axios.get(`${ENV.API_BASE_URL}/api/onboarding/interests`, { timeout: 60000 });
    isServerAwake = true;
    devLog('✅ Backend is awake');
  } catch (err: any) {
    // Even a 401/404 means the server is responding — it's awake
    if (err.response?.status) {
      isServerAwake = true;
      devLog('✅ Backend is awake (responded with', err.response.status, ')');
    } else {
      devLog('⚠️ Backend wake-up ping failed, proceeding anyway');
    }
  }
};

// ─── Send OTP ────────────────────────────────────────────────
// mode = 'login'  → POST /api/auth/login/init
// mode = 'signup' → POST /api/onboarding/init (requires both email + phone)

const MAX_RETRIES = 2;
const RETRY_DELAY_MS = 2000;

const sendOTP = async (
  phoneOrEmail: string,
  mode: 'login' | 'signup' = 'login',
  extra?: { email?: string; phone?: string },
): Promise<AuthResponse> => {
  // Wake up the backend first (handles Render cold-start)
  await ensureServerAwake();

  let url: string;
  let body: Record<string, string>;

  if (mode === 'signup') {
    url = '/api/onboarding/init';
    body = {
      email: extra?.email || (phoneOrEmail.includes('@') ? phoneOrEmail : ''),
      phone: extra?.phone || (!phoneOrEmail.includes('@') ? phoneOrEmail : ''),
    };
  } else {
    url = '/api/auth/login/init';
    const isEmail = phoneOrEmail.includes('@');
    body = isEmail ? { email: phoneOrEmail } : { phone: phoneOrEmail };
  }

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      devLog(`📤 sendOTP attempt ${attempt}/${MAX_RETRIES}:`, url);
      const response = await apiClient.post(url, body);

      return {
        success: true,
        message: response.data?.message || 'OTP sent successfully',
        expiresAt: response.data?.expiresAt,
      };
    } catch (error: any) {
      const status = error.response?.status;
      const isNetworkOrTimeout = !status || status >= 500 || error.code === 'ECONNABORTED';

      if (isNetworkOrTimeout && attempt < MAX_RETRIES) {
        devLog(`⏳ sendOTP attempt ${attempt} failed (${error.code || status || 'network'}), retrying in ${RETRY_DELAY_MS}ms...`);
        await new Promise(r => setTimeout(r, RETRY_DELAY_MS));
        continue;
      }

      errorLog(`sendOTP failed after ${attempt} attempt(s):`, error.response?.data?.message || error.message);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to send OTP. Please try again.',
      };
    }
  }

  return { success: false, message: 'Failed to send OTP. Please try again.' };
};

// ─── Verify OTP ──────────────────────────────────────────────
// mode = 'login'  → POST /api/auth/login/verify
// mode = 'signup' → POST /api/onboarding/verify

const verifyOTP = async (
  code: string,
  phoneOrEmail?: string,
  mode: 'login' | 'signup' = 'login',
  extra?: { email?: string; phone?: string },
): Promise<AuthResponse> => {
  try {
    let url: string;
    let body: Record<string, string>;

    const isEmail = phoneOrEmail?.includes('@');

    if (mode === 'signup') {
      url = '/api/onboarding/verify';
      // Swagger spec: { email, phone, code }
      body = {
        code: code,
        email: isEmail ? phoneOrEmail! : (extra?.email || ''),
        phone: !isEmail ? phoneOrEmail! : (extra?.phone || ''),
      };
      // Remove empty strings so we don't send blank fields
      Object.keys(body).forEach(k => { if (!body[k]) delete body[k]; });
    } else {
      url = '/api/auth/login/verify';
      body = {
        code: code,
        ...(isEmail ? { email: phoneOrEmail! } : { phone: phoneOrEmail! }),
      };
    }

    devLog('🔐 Verify OTP request:', url, JSON.stringify(body));
    const response = await apiClient.post(url, body);
    devLog('🔐 Verify OTP response:', JSON.stringify(response.data));

    // Backend wraps response in { status, message, data: { token, user } }
    const payload = response.data?.data || response.data;
    const token = payload?.token || payload?.accessToken;
    const user = payload?.user;

    // Persist token
    if (token) {
      await AsyncStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
      devLog('🔐 Token saved to storage:', token.substring(0, 20) + '...');
    } else {
      devLog('⚠️ No token found in response! Response data:', JSON.stringify(response.data));
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
    errorLog('Verify OTP full error:', JSON.stringify(error.response?.data));
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
    const payload = response.data?.data || response.data;
    const user = payload?.user || payload;

    return {
      success: true,
      message: 'User fetched successfully',
      user: {
        id: user.id || user._id,
        phone: user.phone,
        email: user.email,
      },
      profile: user,
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
    const lPayload = response.data?.data || response.data;
    return {
      success: true,
      message: 'Login successful',
      token: lPayload?.token,
      user: lPayload?.user,
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
    // Call backend to invalidate token
    try {
      await apiClient.post('/api/auth/logout');
    } catch {
      // Continue with local logout even if API call fails
    }
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

// ─── Delete Account ─────────────────────────────────────────

const deleteAccount = async (): Promise<AuthResponse> => {
  try {
    await apiClient.delete('/api/auth/delete-account');
    await AsyncStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
    return {
      success: true,
      message: 'Account deleted successfully',
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to delete account',
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
  deleteAccount,
};

export default realAuthService;
