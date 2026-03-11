// src/services/api/socialAuthService.ts
// Calls POST /api/auth/social-auth with profile data obtained from Google/Facebook OAuth.

import { apiClient } from './realAuthService';
import { devLog, errorLog } from '@config/environment';

export interface SocialAuthPayload {
  socialId: string;
  provider: 'google' | 'facebook';
  email: string;
  fullname: string;
  profilePic?: string;
}

export interface SocialAuthResult {
  success: boolean;
  token?: string;
  user?: any;
  isNewUser?: boolean;
  message: string;
}

export const socialAuth = async (payload: SocialAuthPayload): Promise<SocialAuthResult> => {
  try {
    devLog('🔐 SocialAuth: calling /api/auth/social-auth', payload.provider, payload.email);
    const response = await apiClient.post('/api/auth/social-auth', payload);
    const data = response.data?.data ?? response.data;
    const token = data?.token || response.data?.token;
    const user  = data?.user  || response.data?.user || data;
    return {
      success: true,
      token,
      user,
      isNewUser: data?.isNewUser ?? false,
      message: response.data?.message || 'Social auth successful',
    };
  } catch (error: any) {
    errorLog('SocialAuth error:', error.response?.data || error.message);
    return {
      success: false,
      message: error.response?.data?.message || 'Social login failed. Please try again.',
    };
  }
};
