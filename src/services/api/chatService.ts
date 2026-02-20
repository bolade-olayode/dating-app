// src/services/api/chatService.ts

import { apiClient } from './realAuthService';
import { devLog, errorLog } from '@config/environment';

// ─── Types ───────────────────────────────────────────────────

export interface ChatResponse {
  success: boolean;
  message: string;
  data?: any;
}

// ─── Get Conversations ───────────────────────────────────────
// GET /api/chat/conversations

const getConversations = async (): Promise<ChatResponse> => {
  try {
    devLog('💬 Chat: Fetching conversations');
    const response = await apiClient.get('/api/chat/conversations');

    return {
      success: true,
      message: 'Conversations fetched successfully',
      data: response.data?.data || response.data,
    };
  } catch (error: any) {
    errorLog('Chat getConversations error:', error.response?.data || error.message);
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to fetch conversations',
    };
  }
};

// ─── Get Unread Count ────────────────────────────────────────
// GET /api/chat/unread-count

const getUnreadCount = async (): Promise<ChatResponse> => {
  try {
    devLog('🔔 Chat: Fetching unread count');
    const response = await apiClient.get('/api/chat/unread-count');

    return {
      success: true,
      message: 'Unread count fetched',
      data: response.data?.data || response.data,
    };
  } catch (error: any) {
    errorLog('Chat getUnreadCount error:', error.response?.data || error.message);
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to fetch unread count',
    };
  }
};

// ─── Get Messages ────────────────────────────────────────────
// GET /api/chat/{matchId}/messages

const getMessages = async (
  matchId: string | number,
  limit: number = 50,
  before?: string,
): Promise<ChatResponse> => {
  try {
    devLog('📨 Chat: Fetching messages for', matchId);
    const params: Record<string, any> = { limit };
    if (before) params.before = before;

    const response = await apiClient.get(`/api/chat/${matchId}/messages`, { params });

    return {
      success: true,
      message: 'Messages fetched successfully',
      data: response.data?.data || response.data,
    };
  } catch (error: any) {
    errorLog('Chat getMessages error:', error.response?.data || error.message);
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to fetch messages',
    };
  }
};

// ─── Send Message ────────────────────────────────────────────
// POST /api/chat/{matchId}/messages

const sendMessage = async (
  matchId: string | number,
  content: string,
  type: 'text' | 'image' | 'emoji' = 'text',
): Promise<ChatResponse> => {
  try {
    devLog('📤 Chat: Sending message to', matchId);
    const response = await apiClient.post(`/api/chat/${matchId}/messages`, {
      content,
      type,
    });

    return {
      success: true,
      message: 'Message sent',
      data: response.data?.data || response.data,
    };
  } catch (error: any) {
    errorLog('Chat sendMessage error:', error.response?.data || error.message);
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to send message',
    };
  }
};

// ─── Mark Conversation Read ──────────────────────────────────
// PATCH /api/chat/{matchId}/read

const markConversationRead = async (
  matchId: string | number,
): Promise<ChatResponse> => {
  try {
    devLog('✅ Chat: Marking conversation read', matchId);
    const response = await apiClient.patch(`/api/chat/${matchId}/read`);

    return {
      success: true,
      message: 'Conversation marked as read',
      data: response.data,
    };
  } catch (error: any) {
    errorLog('Chat markConversationRead error:', error.response?.data || error.message);
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to mark as read',
    };
  }
};

// ─── Mark Single Message Read ────────────────────────────────
// PATCH /api/chat/messages/{messageId}/read

const markMessageRead = async (
  messageId: string,
): Promise<ChatResponse> => {
  try {
    const response = await apiClient.patch(`/api/chat/messages/${messageId}/read`);

    return {
      success: true,
      message: 'Message marked as read',
      data: response.data,
    };
  } catch (error: any) {
    errorLog('Chat markMessageRead error:', error.response?.data || error.message);
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to mark message as read',
    };
  }
};

// ─── Delete Message ──────────────────────────────────────────
// DELETE /api/chat/messages/{messageId}

const deleteMessage = async (
  messageId: string,
): Promise<ChatResponse> => {
  try {
    devLog('🗑️ Chat: Deleting message', messageId);
    const response = await apiClient.delete(`/api/chat/messages/${messageId}`);

    return {
      success: true,
      message: 'Message deleted',
      data: response.data,
    };
  } catch (error: any) {
    errorLog('Chat deleteMessage error:', error.response?.data || error.message);
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to delete message',
    };
  }
};

// ─── Export ──────────────────────────────────────────────────

export const chatService = {
  getConversations,
  getUnreadCount,
  getMessages,
  sendMessage,
  markConversationRead,
  markMessageRead,
  deleteMessage,
};

export default chatService;
