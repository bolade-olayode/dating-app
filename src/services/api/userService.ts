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
  // Profile detail fields (added to backend schema)
  bio?: string;
  height?: number;   // centimetres e.g. 175
  weight?: number;   // kilograms e.g. 70
  education?: string; // backend enum: high_school, bachelor_degree, etc.
  prompts?: Array<{ question: string; answer: string }>;
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
    const status = error.response?.status;
    const msg = error.response?.data?.message || error.message;
    errorLog('User updateProfile error:', status ? `${status} — ${msg}` : msg);
    return {
      success: false,
      message: msg || 'Failed to update profile',
    };
  }
};

// ─── Export ──────────────────────────────────────────────────

export const userService = {
  updateProfile,
};

export default userService;
