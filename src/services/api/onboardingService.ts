// src/services/api/onboardingService.ts

import { apiClient } from './realAuthService';
import { devLog, errorLog } from '@config/environment';

// ─── Types ───────────────────────────────────────────────────

export interface OnboardingDetailsPayload {
  name?: string;
  dateOfBirth?: string; // ISO string e.g. "1998-05-15"
  gender?: string;
  lookingFor?: string;
  relationshipGoal?: string;
  location?: string;
}

export interface InterestCategory {
  _id: string;
  title: string;
  items: {
    _id: string;
    id: string;
    label: string;
    emoji: string;
  }[];
}

export interface OnboardingResponse {
  success: boolean;
  message: string;
  data?: any;
}

// ─── Update Profile Details ──────────────────────────────────
// PATCH /api/onboarding/details

const updateDetails = async (
  details: OnboardingDetailsPayload,
): Promise<OnboardingResponse> => {
  try {
    devLog('📝 Onboarding: Updating details', details);
    const response = await apiClient.patch('/api/onboarding/details', details);

    return {
      success: true,
      message: response.data?.message || 'Details updated successfully',
      data: response.data,
    };
  } catch (error: any) {
    errorLog('Onboarding updateDetails error:', error.response?.data || error.message);
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to update details',
    };
  }
};

// ─── Get Interests ───────────────────────────────────────────
// GET /api/onboarding/interests

const getInterests = async (): Promise<OnboardingResponse> => {
  try {
    devLog('🎯 Onboarding: Fetching interests');
    const response = await apiClient.get('/api/onboarding/interests');

    return {
      success: true,
      message: 'Interests fetched successfully',
      data: response.data?.categories || response.data,
    };
  } catch (error: any) {
    errorLog('Onboarding getInterests error:', error.response?.data || error.message);
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to fetch interests',
    };
  }
};

// ─── Save Selected Interests ─────────────────────────────────
// PATCH /api/onboarding/interests

const saveInterests = async (
  interestIds: string[],
): Promise<OnboardingResponse> => {
  try {
    devLog('💾 Onboarding: Saving interests', interestIds);
    const response = await apiClient.patch('/api/onboarding/interests', {
      interests: interestIds,
    });

    return {
      success: true,
      message: response.data?.message || 'Interests saved successfully',
      data: response.data,
    };
  } catch (error: any) {
    errorLog('Onboarding saveInterests error:', error.response?.data || error.message);
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to save interests',
    };
  }
};

// ─── Upload Photos (finalizes onboarding) ────────────────────
// PATCH /api/onboarding/photos

const uploadPhotos = async (
  photoUrls: string[],
): Promise<OnboardingResponse> => {
  try {
    devLog('📸 Onboarding: Uploading photos', photoUrls.length, 'photos');
    const response = await apiClient.patch('/api/onboarding/photos', {
      photos: photoUrls,
    });

    return {
      success: true,
      message: response.data?.message || 'Photos uploaded successfully',
      data: response.data,
    };
  } catch (error: any) {
    errorLog('Onboarding uploadPhotos error:', error.response?.data || error.message);
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to upload photos',
    };
  }
};

// ─── Export ──────────────────────────────────────────────────

export const onboardingService = {
  updateDetails,
  getInterests,
  saveInterests,
  uploadPhotos,
};

export default onboardingService;
