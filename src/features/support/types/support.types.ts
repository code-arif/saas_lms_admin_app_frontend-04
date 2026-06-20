export interface ChatConversation {
  id: string;
  tenant_uuid: string;
  tenant_name: string;
  tenant_logo?: string;
  subject: string;
  last_message?: string;
  last_message_at?: string;
  unread_count: number;
  status: 'open' | 'closed' | 'pending';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  created_at: string;
  updated_at: string;
}

export interface ChatMessage {
  id: string;
  conversation_id: string;
  sender_id: string;
  sender_name: string;
  sender_avatar?: string;
  sender_type: 'admin' | 'tenant' | 'system';
  message: string;
  attachments?: ChatAttachment[];
  created_at: string;
}

export interface ChatAttachment {
  id: string;
  name: string;
  size: number;
  type: string;
  url: string;
}

export interface SendMessagePayload {
  conversation_id: string;
  message: string;
  attachments?: File[];
}

export interface ConversationListParams {
  page?: number;
  per_page?: number;
  search?: string;
  status?: string;
  priority?: string;
  sort?: string;
  direction?: 'asc' | 'desc';
}
