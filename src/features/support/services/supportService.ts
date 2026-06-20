import api from '@/services/api';
import type { ApiResponse, PaginatedResponse } from '@/types/global.types';
import type {
  ChatConversation,
  ChatMessage,
  ConversationListParams,
  SendMessagePayload,
} from '../types/support.types';

export const supportService = {
  // Conversations
  getConversations: async (
    params?: ConversationListParams
  ): Promise<PaginatedResponse<ChatConversation>> => {
    return api.get('/support/conversations', { params });
  },

  getConversation: async (
    uuid: string
  ): Promise<ApiResponse<ChatConversation>> => {
    return api.get(`/support/conversations/${uuid}`);
  },

  // Messages
  getMessages: async (
    conversationId: string,
    params?: { page?: number; per_page?: number }
  ): Promise<PaginatedResponse<ChatMessage>> => {
    return api.get(`/support/conversations/${conversationId}/messages`, {
      params,
    });
  },

  sendMessage: async (
    payload: SendMessagePayload
  ): Promise<ApiResponse<ChatMessage>> => {
    const formData = new FormData();
    formData.append('conversation_id', payload.conversation_id);
    formData.append('message', payload.message);

    if (payload.attachments?.length) {
      payload.attachments.forEach((file) => {
        formData.append('attachments[]', file);
      });
    }

    return api.post('/support/messages', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  // Conversation management
  createConversation: async (data: {
    tenant_uuid: string;
    subject: string;
    priority?: 'low' | 'medium' | 'high' | 'urgent';
    message: string;
  }): Promise<ApiResponse<ChatConversation>> => {
    return api.post('/support/conversations', data);
  },

  closeConversation: async (
    uuid: string
  ): Promise<ApiResponse<ChatConversation>> => {
    return api.post(`/support/conversations/${uuid}/close`);
  },

  reopenConversation: async (
    uuid: string
  ): Promise<ApiResponse<ChatConversation>> => {
    return api.post(`/support/conversations/${uuid}/reopen`);
  },

  markAsRead: async (conversationId: string): Promise<ApiResponse> => {
    return api.post(`/support/conversations/${conversationId}/read`);
  },
};
