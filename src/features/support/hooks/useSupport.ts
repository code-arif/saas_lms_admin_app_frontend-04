import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { supportService } from '../services/supportService';
import type {
  ConversationListParams,
  SendMessagePayload,
} from '../types/support.types';

export const useConversations = (params?: ConversationListParams) => {
  return useQuery({
    queryKey: ['support-conversations', params],
    queryFn: () => supportService.getConversations(params),
  });
};

export const useConversation = (uuid: string) => {
  return useQuery({
    queryKey: ['support-conversation', uuid],
    queryFn: () => supportService.getConversation(uuid),
    enabled: !!uuid,
  });
};

export const useMessages = (
  conversationId: string,
  params?: { page?: number; per_page?: number }
) => {
  return useQuery({
    queryKey: ['support-messages', conversationId, params],
    queryFn: () => supportService.getMessages(conversationId, params),
    enabled: !!conversationId,
  });
};

export const useSendMessage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: SendMessagePayload) =>
      supportService.sendMessage(payload),
    onSuccess: (response, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['support-messages', variables.conversation_id],
      });
      queryClient.invalidateQueries({ queryKey: ['support-conversations'] });
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || 'Failed to send message'
      );
    },
  });
};

export const useCreateConversation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: {
      tenant_uuid: string;
      subject: string;
      priority?: 'low' | 'medium' | 'high' | 'urgent';
      message: string;
    }) => supportService.createConversation(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['support-conversations'] });
      toast.success('Conversation created');
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || 'Failed to create conversation'
      );
    },
  });
};

export const useCloseConversation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (uuid: string) => supportService.closeConversation(uuid),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['support-conversations'] });
      queryClient.invalidateQueries({ queryKey: ['support-conversation'] });
      toast.success('Conversation closed');
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || 'Failed to close conversation'
      );
    },
  });
};

export const useReopenConversation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (uuid: string) => supportService.reopenConversation(uuid),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['support-conversations'] });
      queryClient.invalidateQueries({ queryKey: ['support-conversation'] });
      toast.success('Conversation reopened');
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || 'Failed to reopen conversation'
      );
    },
  });
};

export const useMarkAsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (conversationId: string) =>
      supportService.markAsRead(conversationId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['support-conversations'] });
    },
  });
};
