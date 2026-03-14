// src/services/api/notificationService.ts

import { apiClient } from './realAuthService';
import { devLog, errorLog } from '@config/environment';

// ─── Types ───────────────────────────────────────────────────

export interface NotificationResponse {
  success: boolean;
  message: string;
  data?: any;
}

// ─── Get Notifications ──────────────────────────────────────
// GET /api/notifications

const getNotifications = async (
  limit: number = 20,
  offset: number = 0,
): Promise<NotificationResponse> => {
  try {
    devLog('🔔 Notifications: Fetching', { limit, offset });
    const response = await apiClient.get('/api/notifications', {
      params: { limit, offset },
    });

    return {
      success: true,
      message: 'Notifications fetched successfully',
      data: response.data?.data || response.data,
    };
  } catch (error: any) {
    errorLog('Notifications getNotifications error:', error.response?.data || error.message);
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to fetch notifications',
    };
  }
};

// ─── Get Unread Count ───────────────────────────────────────
// GET /api/notifications/unread-count

const getUnreadCount = async (): Promise<NotificationResponse> => {
  try {
    devLog('🔢 Notifications: Fetching unread count');
    const response = await apiClient.get('/api/notifications/unread-count');

    return {
      success: true,
      message: 'Unread count fetched',
      data: response.data?.data || response.data,
    };
  } catch (error: any) {
    errorLog('Notifications getUnreadCount error:', error.response?.data || error.message);
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to fetch unread count',
    };
  }
};

// ─── Mark All Read ──────────────────────────────────────────
// PATCH /api/notifications/read-all

const markAllRead = async (): Promise<NotificationResponse> => {
  try {
    devLog('✅ Notifications: Marking all as read');
    const response = await apiClient.patch('/api/notifications/read-all');

    return {
      success: true,
      message: response.data?.message || 'All notifications marked as read',
      data: response.data,
    };
  } catch (error: any) {
    errorLog('Notifications markAllRead error:', error.response?.data || error.message);
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to mark all as read',
    };
  }
};

// ─── Mark Single Notification Read ──────────────────────────
// PATCH /api/notifications/{notificationId}/read

const markRead = async (
  notificationId: string,
): Promise<NotificationResponse> => {
  try {
    const response = await apiClient.patch(`/api/notifications/${notificationId}/read`);

    return {
      success: true,
      message: 'Notification marked as read',
      data: response.data,
    };
  } catch (error: any) {
    errorLog('Notifications markRead error:', error.response?.data || error.message);
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to mark as read',
    };
  }
};

// ─── Delete Notification ────────────────────────────────────
// DELETE /api/notifications/{notificationId}

const deleteNotification = async (
  notificationId: string,
): Promise<NotificationResponse> => {
  try {
    devLog('🗑️ Notifications: Deleting', notificationId);
    const response = await apiClient.delete(`/api/notifications/${notificationId}`);

    return {
      success: true,
      message: 'Notification deleted',
      data: response.data,
    };
  } catch (error: any) {
    errorLog('Notifications deleteNotification error:', error.response?.data || error.message);
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to delete notification',
    };
  }
};

// ─── Register Push Token ─────────────────────────────────────
// POST /api/notifications/push-token

const registerPushToken = async (token: string, platform: 'ios' | 'android'): Promise<NotificationResponse> => {
  try {
    devLog('📲 Notifications: Registering push token', platform);
    const response = await apiClient.post('/api/notifications/device-token', { token, platform });
    return {
      success: true,
      message: 'Push token registered',
      data: response.data,
    };
  } catch (error: any) {
    errorLog('Notifications registerPushToken error:', error.response?.data || error.message);
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to register push token',
    };
  }
};

// ─── Export ──────────────────────────────────────────────────

export const notificationService = {
  getNotifications,
  getUnreadCount,
  markAllRead,
  markRead,
  deleteNotification,
  registerPushToken,
};

export default notificationService;
