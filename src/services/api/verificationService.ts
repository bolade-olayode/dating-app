// src/services/api/verificationService.ts

import { apiClient } from './realAuthService';
import { devLog, errorLog } from '@config/environment';

// ─── Types ───────────────────────────────────────────────────

export type VerificationStatusValue = 'none' | 'pending' | 'verified' | 'failed';

export interface VerificationStatusData {
  status: VerificationStatusValue;
  verifiedAt?: string;
  message?: string;
}

export interface VerificationResponse {
  success: boolean;
  message: string;
  data?: any;
}

// ─── Initiate Verification ───────────────────────────────────
// POST /api/verification/initiate
// Starts a Smile Identity selfie check.
// Response may include a `url` to open in the browser.

const initiate = async (): Promise<VerificationResponse> => {
  try {
    devLog('🔐 Verification: Initiating selfie check');
    const response = await apiClient.post('/api/verification/initiate');
    return {
      success: true,
      message: response.data?.message || 'Verification initiated',
      data: response.data?.data ?? response.data,
    };
  } catch (error: any) {
    errorLog('Verification initiate error:', error.response?.data || error.message);
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to initiate verification',
    };
  }
};

// ─── Get Verification Status ─────────────────────────────────
// GET /api/verification/status
// Returns the current verification status for the authenticated user.

const getStatus = async (): Promise<VerificationResponse> => {
  try {
    devLog('🔐 Verification: Checking status');
    const response = await apiClient.get('/api/verification/status');
    return {
      success: true,
      message: 'Status fetched',
      data: response.data?.data ?? response.data,
    };
  } catch (error: any) {
    errorLog('Verification getStatus error:', error.response?.data || error.message);
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to check verification status',
    };
  }
};

// ─── Export ──────────────────────────────────────────────────

export const verificationService = { initiate, getStatus };
export default verificationService;
