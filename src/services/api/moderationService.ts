// src/services/api/moderationService.ts

import { apiClient } from './realAuthService';
import { devLog, errorLog } from '@config/environment';

// ─── Types ───────────────────────────────────────────────────

// Exact enum values the backend accepts for report reasons
export type ReportReason =
  | 'inappropriate_content'
  | 'harassment'
  | 'fake_profile'
  | 'spam'
  | 'underage'
  | 'hate_speech'
  | 'violence'
  | 'other';

export interface ModerationResponse {
  success: boolean;
  message: string;
  data?: any;
}

// ─── Report User ─────────────────────────────────────────────
// POST /api/moderation/report

const reportUser = async (
  reportedUserId: string,
  reason: ReportReason,
  description?: string,
): Promise<ModerationResponse> => {
  try {
    devLog('🚩 Moderation: Reporting user', reportedUserId, reason);
    const body: Record<string, any> = { reportedUserId, reason };
    if (description) body.description = description;

    const response = await apiClient.post('/api/moderation/report', body);

    return {
      success: true,
      message: response.data?.message || 'Report submitted',
      data: response.data,
    };
  } catch (error: any) {
    errorLog('Moderation reportUser error:', error.response?.data || error.message);
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to submit report',
    };
  }
};

// ─── Get Reports ─────────────────────────────────────────────
// GET /api/moderation/reports

const getReports = async (): Promise<ModerationResponse> => {
  try {
    devLog('📋 Moderation: Fetching reports');
    const response = await apiClient.get('/api/moderation/reports');

    return {
      success: true,
      message: 'Reports fetched',
      data: response.data?.data || response.data,
    };
  } catch (error: any) {
    errorLog('Moderation getReports error:', error.response?.data || error.message);
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to fetch reports',
    };
  }
};

// ─── Block User ──────────────────────────────────────────────
// POST /api/moderation/block

const blockUser = async (
  blockedUserId: string,
): Promise<ModerationResponse> => {
  try {
    devLog('🚫 Moderation: Blocking user', blockedUserId);
    const response = await apiClient.post('/api/moderation/block', { blockedUserId });

    return {
      success: true,
      message: response.data?.message || 'User blocked',
      data: response.data,
    };
  } catch (error: any) {
    errorLog('Moderation blockUser error:', error.response?.data || error.message);
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to block user',
    };
  }
};

// ─── Unblock User ────────────────────────────────────────────
// DELETE /api/moderation/block/{blockedUserId}

const unblockUser = async (
  blockedUserId: string,
): Promise<ModerationResponse> => {
  try {
    devLog('✅ Moderation: Unblocking user', blockedUserId);
    const response = await apiClient.delete(`/api/moderation/block/${blockedUserId}`);

    return {
      success: true,
      message: response.data?.message || 'User unblocked',
      data: response.data,
    };
  } catch (error: any) {
    errorLog('Moderation unblockUser error:', error.response?.data || error.message);
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to unblock user',
    };
  }
};

// ─── Get Blocked Users ───────────────────────────────────────
// GET /api/moderation/blocked

const getBlockedUsers = async (): Promise<ModerationResponse> => {
  try {
    devLog('📋 Moderation: Fetching blocked users');
    const response = await apiClient.get('/api/moderation/blocked');

    // Backend may wrap the list as { blockedUsers: [] }, { data: [] }, or return [] directly
    const raw = response.data?.data ?? response.data;
    const list: any[] = Array.isArray(raw)
      ? raw
      : Array.isArray(raw?.blockedUsers)
        ? raw.blockedUsers
        : Array.isArray(raw?.blocked)
          ? raw.blocked
          : [];

    return {
      success: true,
      message: 'Blocked users fetched',
      data: list,
    };
  } catch (error: any) {
    errorLog('Moderation getBlockedUsers error:', error.response?.data || error.message);
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to fetch blocked users',
    };
  }
};

// ─── Export ──────────────────────────────────────────────────

export const moderationService = {
  reportUser,
  getReports,
  blockUser,
  unblockUser,
  getBlockedUsers,
};

export default moderationService;
