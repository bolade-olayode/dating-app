// src/services/api/matchingService.ts

import { apiClient } from './realAuthService';
import { devLog, errorLog } from '@config/environment';

// ─── Types ───────────────────────────────────────────────────

export interface MatchingResponse {
  success: boolean;
  message: string;
  data?: any;
}

// ─── Update Location ─────────────────────────────────────────
// POST /api/matching/location

const updateLocation = async (
  lat: number,
  long: number,
  city?: string,
): Promise<MatchingResponse> => {
  try {
    devLog('📍 Matching: Updating location', { lat, long, city });
    const body: Record<string, any> = { lat, long };
    if (city) body.city = city;

    const response = await apiClient.post('/api/matching/location', body);

    return {
      success: true,
      message: response.data?.message || 'Location updated',
      data: response.data,
    };
  } catch (error: any) {
    errorLog('Matching updateLocation error:', error.response?.data || error.message);
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to update location',
    };
  }
};

// ─── Discover Profiles ───────────────────────────────────────
// GET /api/matching/discover

export interface DiscoverFilters {
  ageMin?:      number;
  ageMax?:      number;
  gender?:      string;  // 'male' | 'female' — passed through when backend supports it
  verifiedOnly?: boolean;
}

const discoverProfiles = async (
  maxDistance?: number,
  limit: number = 50,
  filters?: DiscoverFilters,
): Promise<MatchingResponse> => {
  try {
    devLog('🔍 Matching: Fetching discover profiles', { maxDistance, limit, filters });
    const params: Record<string, any> = { limit };
    if (maxDistance !== undefined) params.maxDistance = maxDistance;
    if (filters?.ageMin)          params.ageMin       = filters.ageMin;
    if (filters?.ageMax)          params.ageMax       = filters.ageMax;
    if (filters?.gender)          params.gender       = filters.gender;
    if (filters?.verifiedOnly)    params.verifiedOnly = filters.verifiedOnly;

    const response = await apiClient.get('/api/matching/discover', { params });

    // Response shape: { status, message, data: { users: [...] } }
    const payload = response.data?.data ?? response.data;
    const users   = payload?.users ?? (Array.isArray(payload) ? payload : []);
    return {
      success: true,
      message: 'Profiles fetched successfully',
      data: users,
    };
  } catch (error: any) {
    const status = error.response?.status;
    const msg    = error.response?.data?.message || error.message;

    // 404 = backend found no profiles to show (empty result, not a crash)
    if (status === 404) {
      devLog('🔍 Discovery: No profiles found nearby (404 — empty result from backend)');
      return { success: true, message: 'No profiles found', data: [] };
    }

    devLog('⚠️ Matching discoverProfiles failed:', msg);
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to fetch profiles',
    };
  }
};

// ─── Swipe (Like / Pass) ─────────────────────────────────────
// POST /api/matching/swipe

const swipe = async (
  targetUserId: string,
  action: 'like' | 'pass',
): Promise<MatchingResponse> => {
  try {
    devLog('👆 Matching: Swipe', action, 'on', targetUserId);
    const response = await apiClient.post('/api/matching/swipe', {
      targetUserId,
      action,
    });

    return {
      success: true,
      message: response.data?.message || 'Swipe recorded',
      data: response.data?.data || response.data,
    };
  } catch (error: any) {
    errorLog('Matching swipe error:', error.response?.data || error.message);
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to record swipe',
    };
  }
};

// ─── Get Matches ─────────────────────────────────────────────
// GET /api/matching/matches

const getMatches = async (): Promise<MatchingResponse> => {
  try {
    devLog('💕 Matching: Fetching matches');
    const response = await apiClient.get('/api/matching/matches');

    return {
      success: true,
      message: 'Matches fetched successfully',
      data: response.data?.data || response.data,
    };
  } catch (error: any) {
    errorLog('Matching getMatches error:', error.response?.data || error.message);
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to fetch matches',
    };
  }
};

// ─── Get Likes (who liked you) ───────────────────────────────
// GET /api/matching/likes

const getLikes = async (): Promise<MatchingResponse> => {
  try {
    devLog('❤️ Matching: Fetching likes');
    const response = await apiClient.get('/api/matching/likes');

    return {
      success: true,
      message: 'Likes fetched successfully',
      data: response.data?.data || response.data,
    };
  } catch (error: any) {
    errorLog('Matching getLikes error:', error.response?.data || error.message);
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to fetch likes',
    };
  }
};

// ─── Unmatch ─────────────────────────────────────────────────
// DELETE /api/matching/unmatch/{matchId}

const unmatch = async (matchId: string): Promise<MatchingResponse> => {
  try {
    devLog('💔 Matching: Unmatching', matchId);
    const response = await apiClient.delete(`/api/matching/unmatch/${matchId}`);

    return {
      success: true,
      message: response.data?.message || 'Unmatched successfully',
      data: response.data,
    };
  } catch (error: any) {
    errorLog('Matching unmatch error:', error.response?.data || error.message);
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to unmatch',
    };
  }
};

// ─── Get Stats ───────────────────────────────────────────────
// GET /api/matching/stats

const getStats = async (): Promise<MatchingResponse> => {
  try {
    devLog('📊 Matching: Fetching stats');
    const response = await apiClient.get('/api/matching/stats');

    return {
      success: true,
      message: 'Stats fetched successfully',
      data: response.data?.data || response.data,
    };
  } catch (error: any) {
    errorLog('Matching getStats error:', error.response?.data || error.message);
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to fetch stats',
    };
  }
};

// ─── Export ──────────────────────────────────────────────────

export const matchingService = {
  updateLocation,
  discoverProfiles,
  swipe,
  getMatches,
  getLikes,
  unmatch,
  getStats,
};

export default matchingService;
