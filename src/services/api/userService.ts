// src/services/api/userService.ts

import { apiClient } from './realAuthService';
import { devLog, errorLog } from '@config/environment';

// ─── Types ───────────────────────────────────────────────────

export interface UserResponse {
  success: boolean;
  message: string;
  data?: any;
}

export interface UpdateProfilePayload {
  username?: string;
  country?: string;
  city?: string;
  dob?: string;
  gender?: string;
  interestedIn?: string;
  goal?: string;
  interests?: string[];
  photos?: string[];
  lat?: number;
  long?: number;
}

// ─── Update Profile ─────────────────────────────────────────
// PATCH /api/user/profile

const updateProfile = async (
  data: UpdateProfilePayload,
): Promise<UserResponse> => {
  try {
    devLog('✏️ User: Updating profile', Object.keys(data));
    const response = await apiClient.patch('/api/user/profile', data);

    return {
      success: true,
      message: response.data?.message || 'Profile updated successfully',
      data: response.data,
    };
  } catch (error: any) {
    errorLog('User updateProfile error:', error.response?.data || error.message);
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to update profile',
    };
  }
};

// ─── Export ──────────────────────────────────────────────────

export const userService = {
  updateProfile,
};

export default userService;
