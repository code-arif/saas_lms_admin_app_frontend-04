import {
  useState,
  useRef,
  useEffect,
  useCallback,
  type ComponentType,
} from 'react';
import {
  Search,
  Send,
  Paperclip,
  MoreVertical,
  Phone,
  Video,
  ChevronLeft,
  MessageSquare,
  CheckCheck,
  AlertCircle,
  Smile,
} from 'lucide-react';
import { cn } from '@/utils/cn';
import type { ChatConversation, ChatMessage } from '../types/support.types';

// ─── Mock Data ──────────────────────────────────────────────────────────────

const MOCK_CONVERSATIONS: ChatConversation[] = [
  {
    id: 'conv-1',
    tenant_uuid: 't-1',
    tenant_name: 'Acme Learning Corp',
    subject: 'Billing issue with subscription renewal',
    last_message: 'I\'ve checked your account and processed a refund. You should see it within 3-5 business days.',
    last_message_at: new Date(Date.now() - 2 * 60000).toISOString(),
    unread_count: 2,
    status: 'open',
    priority: 'high',
    created_at: new Date(Date.now() - 86400000 * 3).toISOString(),
    updated_at: new Date(Date.now() - 2 * 60000).toISOString(),
  },
  {
    id: 'conv-2',
    tenant_uuid: 't-2',
    tenant_name: 'Global Tech Institute',
    subject: 'Unable to add new instructors',
    last_message: 'The issue was with the role permission settings. I\'ve updated the instructor role to include the missing permissions.',
    last_message_at: new Date(Date.now() - 3600000 * 5).toISOString(),
    unread_count: 0,
    status: 'open',
    priority: 'medium',
    created_at: new Date(Date.now() - 86400000 * 7).toISOString(),
    updated_at: new Date(Date.now() - 3600000 * 5).toISOString(),
  },
  {
    id: 'conv-3',
    tenant_uuid: 't-3',
    tenant_name: 'Bright Future Academy',
    subject: 'Custom domain setup help',
    last_message: 'Perfect! The SSL certificate is now active. You can access your portal at academy.brightfuture.com',
    last_message_at: new Date(Date.now() - 86400000 * 1).toISOString(),
    unread_count: 0,
    status: 'closed',
    priority: 'low',
    created_at: new Date(Date.now() - 86400000 * 14).toISOString(),
    updated_at: new Date(Date.now() - 86400000 * 1).toISOString(),
  },
  {
    id: 'conv-4',
    tenant_uuid: 't-4',
    tenant_name: 'Quantum Skills Hub',
    subject: 'API integration documentation',
    last_message: 'I\'ve attached the updated API documentation with WebSocket examples. Let me know if you need any clarifications.',
    last_message_at: new Date(Date.now() - 3600000 * 2).toISOString(),
    unread_count: 1,
    status: 'open',
    priority: 'low',
    created_at: new Date(Date.now() - 86400000 * 5).toISOString(),
    updated_at: new Date(Date.now() - 3600000 * 2).toISOString(),
  },
  {
    id: 'conv-5',
    tenant_uuid: 't-5',
    tenant_name: 'Elite Education Group',
    subject: 'Urgent: Platform down after update',
    last_message: 'We\'ve rolled back the update. The platform should be back online. Our engineering team is investigating the root cause.',
    last_message_at: new Date(Date.now() - 600000 * 30).toISOString(),
    unread_count: 3,
    status: 'open',
    priority: 'urgent',
    created_at: new Date(Date.now() - 86400000 * 1).toISOString(),
    updated_at: new Date(Date.now() - 600000 * 30).toISOString(),
  },
];

const MOCK_MESSAGES: Record<string, ChatMessage[]> = {
  'conv-1': [
    {
      id: 'msg-1',
      conversation_id: 'conv-1',
      sender_id: 't-1',
      sender_name: 'Sarah Johnson',
      sender_avatar: '',
      sender_type: 'tenant',
      message: 'Hi, I\'m having trouble with my subscription renewal. It was supposed to renew on the 15th but it hasn\'t gone through yet.',
      created_at: new Date(Date.now() - 3600000 * 48).toISOString(),
    },
    {
      id: 'msg-2',
      conversation_id: 'conv-1',
      sender_id: 'admin-1',
      sender_name: 'Admin Support',
      sender_avatar: '',
      sender_type: 'admin',
      message: 'Hello! I\'d be happy to help you with the subscription renewal issue. Let me check your account details.',
      created_at: new Date(Date.now() - 3600000 * 47).toISOString(),
    },
    {
      id: 'msg-3',
      conversation_id: 'conv-1',
      sender_id: 'admin-1',
      sender_name: 'Admin Support',
      sender_avatar: '',
      sender_type: 'admin',
      message: 'I can see that your payment method on file has expired. Could you please update your payment information in the billing settings?',
      created_at: new Date(Date.now() - 3600000 * 47).toISOString(),
    },
    {
      id: 'msg-4',
      conversation_id: 'conv-1',
      sender_id: 't-1',
      sender_name: 'Sarah Johnson',
      sender_avatar: '',
      sender_type: 'tenant',
      message: 'Oh, I see! Let me update it right away.',
      created_at: new Date(Date.now() - 3600000 * 24).toISOString(),
    },
    {
      id: 'msg-5',
      conversation_id: 'conv-1',
      sender_id: 't-1',
      sender_name: 'Sarah Johnson',
      sender_avatar: '',
      sender_type: 'tenant',
      message: 'I\'ve updated my card details. But the renewal still hasn\'t processed. It\'s been a few hours now.',
      created_at: new Date(Date.now() - 3600000 * 6).toISOString(),
    },
    {
      id: 'msg-6',
      conversation_id: 'conv-1',
      sender_id: 'admin-1',
      sender_name: 'Admin Support',
      sender_avatar: '',
      sender_type: 'admin',
      message: 'I\'ve checked your account and processed a refund. You should see it within 3-5 business days.',
      created_at: new Date(Date.now() - 2 * 60000).toISOString(),
    },
  ],
  'conv-2': [
    {
      id: 'msg-7',
      conversation_id: 'conv-2',
      sender_id: 't-2',
      sender_name: 'Michael Chen',
      sender_avatar: '',
      sender_type: 'tenant',
      message: 'Hi support team. We\'re trying to add new instructors to our platform but the "Add Instructor" button is greyed out. Only the admin can see it.',
      created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
    },
    {
      id: 'msg-8',
      conversation_id: 'conv-2',
      sender_id: 'admin-1',
      sender_name: 'Admin Support',
      sender_avatar: '',
      sender_type: 'admin',
      message: 'Let me investigate the permissions setup for your account.',
      created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
    },
    {
      id: 'msg-9',
      conversation_id: 'conv-2',
      sender_id: 'admin-1',
      sender_name: 'Admin Support',
      sender_avatar: '',
      sender_type: 'admin',
      message: 'The issue was with the role permission settings. I\'ve updated the instructor role to include the missing permissions.',
      created_at: new Date(Date.now() - 3600000 * 5).toISOString(),
    },
  ],
  'conv-5': [
    {
      id: 'msg-10',
      conversation_id: 'conv-5',
      sender_id: 't-5',
      sender_name: 'David Williams',
      sender_avatar: '',
      sender_type: 'tenant',
      message: 'URGENT: Our entire platform is down after the latest update! Students can\'t access their courses. Please help!',
      created_at: new Date(Date.now() - 3600000 * 8).toISOString(),
    },
    {
      id: 'msg-11',
      conversation_id: 'conv-5',
      sender_id: 'admin-1',
      sender_name: 'Admin Support',
      sender_avatar: '',
      sender_type: 'admin',
      message: 'We\'ve identified the issue and are working on a fix. We\'ll keep you updated.',
      created_at: new Date(Date.now() - 3600000 * 7).toISOString(),
    },
    {
      id: 'msg-12',
      conversation_id: 'conv-5',
      sender_id: 'admin-1',
      sender_name: 'Admin Support',
      sender_avatar: '',
      sender_type: 'admin',
      message: 'We\'ve rolled back the update. The platform should be back online. Our engineering team is investigating the root cause.',
      created_at: new Date(Date.now() - 600000 * 30).toISOString(),
    },
  ],
};

// ─── Helpers ────────────────────────────────────────────────────────────────

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case 'urgent':
      return 'text-red-500 bg-red-500/10';
    case 'high':
      return 'text-orange-500 bg-orange-500/10';
    case 'medium':
      return 'text-yellow-500 bg-yellow-500/10';
    case 'low':
      return 'text-green-500 bg-green-500/10';
    default:
      return 'text-muted-foreground bg-muted';
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'open':
      return 'bg-emerald-500';
    case 'pending':
      return 'bg-yellow-500';
    case 'closed':
      return 'bg-gray-400';
    default:
      return 'bg-gray-400';
  }
};

const formatMessageTime = (dateStr: string) => {
  const date = new Date(dateStr);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const days = Math.floor(diff / 86400000);

  if (days === 0) {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }
  if (days === 1) return 'Yesterday';
  if (days < 7) return date.toLocaleDateString([], { weekday: 'short' });
  return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
};

const formatConversationTime = (dateStr: string) => {
  const date = new Date(dateStr);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return 'Now';
  if (minutes < 60) return `${minutes}m`;
  if (hours < 24) return `${hours}h`;
  if (days < 7) return `${days}d`;
  return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
};

const generateAvatarColor = (name: string) => {
  const colors = [
    'bg-blue-500',
    'bg-purple-500',
    'bg-emerald-500',
    'bg-rose-500',
    'bg-amber-500',
    'bg-cyan-500',
    'bg-pink-500',
    'bg-indigo-500',
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
};

const getInitials = (name: string) => {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

// ─── Sub-Components ─────────────────────────────────────────────────────────

interface AvatarProps {
  name: string;
  avatar?: string;
  size?: 'sm' | 'md' | 'lg';
  online?: boolean;
  className?: string;
}

const Avatar = ({ name, avatar, size = 'md', online, className }: AvatarProps) => {
  const sizeClasses = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base',
  };
  const dotSizes = { sm: 'w-2.5 h-2.5', md: 'w-3 h-3', lg: 'w-3.5 h-3.5' };

  return (
    <div className={cn('relative shrink-0', className)}>
      {avatar ? (
        <img
          src={avatar}
          alt={name}
          className={cn('rounded-full object-cover', sizeClasses[size])}
        />
      ) : (
        <div
          className={cn(
            'rounded-full flex items-center justify-center font-semibold text-white',
            sizeClasses[size],
            generateAvatarColor(name)
          )}
        >
          {getInitials(name)}
        </div>
      )}
      {online !== undefined && (
        <span
          className={cn(
            'absolute -bottom-0.5 -right-0.5 rounded-full border-2 border-card',
            dotSizes[size],
            online ? 'bg-emerald-500' : 'bg-gray-400'
          )}
        />
      )}
    </div>
  );
};

// ─── Message Bubble ─────────────────────────────────────────────────────────

interface MessageBubbleProps {
  message: ChatMessage;
  isAdmin: boolean;
  showSender: boolean;
}

const MessageBubble = ({ message, isAdmin, showSender }: MessageBubbleProps) => {
  const isSystem = message.sender_type === 'system';
  const time = new Date(message.created_at).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });

  if (isSystem) {
    return (
      <div className="flex justify-center my-3">
        <div className="px-4 py-1.5 rounded-full bg-muted text-xs text-muted-foreground">
          {message.message}
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        'flex gap-2 max-w-[85%] animate-in fade-in slide-in-from-bottom-1 duration-200',
        isAdmin ? 'ml-auto flex-row-reverse' : 'mr-auto'
      )}
    >
      {showSender && !isAdmin && (
        <Avatar name={message.sender_name} size="sm" className="mt-1" />
      )}
      {showSender && isAdmin && (
        <div className="w-8 shrink-0" />
      )}
      <div className={cn('flex flex-col', isAdmin ? 'items-end' : 'items-start')}>
        {showSender && (
          <span className="text-[11px] text-muted-foreground mb-0.5 px-1">
            {message.sender_name}
          </span>
        )}
        <div
          className={cn(
            'px-3.5 py-2 rounded-2xl text-sm leading-relaxed break-words',
            isAdmin
              ? 'bg-primary text-primary-foreground rounded-tr-md'
              : 'bg-muted text-foreground rounded-tl-md'
          )}
        >
          {message.message}
          <div
            className={cn(
              'flex items-center gap-1 mt-1 -mb-1',
              isAdmin ? 'justify-end' : 'justify-start'
            )}
          >
            <span
              className={cn(
                'text-[10px] leading-none',
                isAdmin ? 'text-primary-foreground/70' : 'text-muted-foreground'
              )}
            >
              {time}
            </span>
            {isAdmin && (
              <CheckCheck size={12} className="text-primary-foreground/70" />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── Main Component ─────────────────────────────────────────────────────────

const SupportChat = () => {
  const [conversations] = useState<ChatConversation[]>(MOCK_CONVERSATIONS);
  const [activeConvId, setActiveConvId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showMobileList, setShowMobileList] = useState(true);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  const activeConversation = conversations.find(
    (c) => c.id === activeConvId
  );

  const filteredConversations = conversations.filter((conv) => {
    const query = searchQuery.toLowerCase();
    return (
      conv.tenant_name.toLowerCase().includes(query) ||
      conv.subject.toLowerCase().includes(query)
    );
  });

  // Load messages when a conversation is selected
  useEffect(() => {
    if (activeConvId) {
      setMessages(MOCK_MESSAGES[activeConvId] || []);
      setShowMobileList(false);
    }
  }, [activeConvId]);

  // Scroll to bottom on new messages
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  // Simulate typing indicator
  useEffect(() => {
    if (activeConvId && !isTyping) {
      const timer = setTimeout(() => {
        setIsTyping(true);
        setTimeout(() => setIsTyping(false), 2000);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [activeConvId, messages, isTyping]);

  // Auto-resize textarea
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.height = 'auto';
      inputRef.current.style.height =
        Math.min(inputRef.current.scrollHeight, 120) + 'px';
    }
  }, [inputValue]);

  const handleSend = () => {
    if (!inputValue.trim() || !activeConvId) return;

    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      conversation_id: activeConvId,
      sender_id: 'admin-1',
      sender_name: 'Admin Support',
      sender_avatar: '',
      sender_type: 'admin',
      message: inputValue.trim(),
      created_at: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, newMsg]);
    setInputValue('');

    // Simulate tenant reply after a delay
    const tenantMsg: ChatMessage = {
      id: `msg-${Date.now() + 1}`,
      conversation_id: activeConvId,
      sender_id: activeConvId,
      sender_name: activeConversation?.tenant_name || 'Tenant',
      sender_avatar: '',
      sender_type: 'tenant',
      message: getAutoReply(activeConversation?.tenant_name || ''),
      created_at: new Date(Date.now() + 3000).toISOString(),
    };

    setTimeout(() => {
      setMessages((prev) => [...prev, tenantMsg]);
    }, 3000);

    if (inputRef.current) {
      inputRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const unreadTotal = conversations.reduce(
    (sum, c) => sum + c.unread_count,
    0
  );



  return (
    <div className="h-[calc(100vh-8rem)] flex rounded-xl overflow-hidden border bg-card shadow-sm">
      {/* ─── Conversation List ─── */}
      <div
        className={cn(
          'w-full md:w-80 lg:w-96 border-r bg-card flex flex-col shrink-0',
          showMobileList ? 'flex' : 'hidden md:flex'
        )}
      >
        {/* Header */}
        <div className="p-4 border-b shrink-0">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h2 className="text-lg font-semibold">Support</h2>
              <p className="text-xs text-muted-foreground">
                {conversations.length} conversations
                {unreadTotal > 0 && ` · ${unreadTotal} unread`}
              </p>
            </div>
            <div className="flex items-center gap-1">
              <button className="p-2 rounded-lg hover:bg-muted transition-colors">
                <MoreVertical size={18} className="text-muted-foreground" />
              </button>
            </div>
          </div>
          {/* Search */}
          <div className="relative">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            />
            <input
              type="text"
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-lg bg-muted text-sm placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
            />
          </div>
        </div>

        {/* Conversation items */}
        <div className="flex-1 overflow-y-auto">
          {filteredConversations.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center p-6">
              <MessageSquare
                size={40}
                className="text-muted-foreground/30 mb-3"
              />
              <p className="text-sm text-muted-foreground">
                No conversations found
              </p>
            </div>
          ) : (
            filteredConversations.map((conv) => (
              <button
                key={conv.id}
                onClick={() => setActiveConvId(conv.id)}
                className={cn(
                  'w-full text-left p-3.5 border-b border-border/50 transition-colors hover:bg-muted/50',
                  activeConvId === conv.id && 'bg-muted'
                )}
              >
                <div className="flex items-start gap-3">
                  <Avatar
                    name={conv.tenant_name}
                    online={conv.status === 'open'}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-medium text-sm truncate">
                        {conv.tenant_name}
                      </span>
                      <span className="text-[11px] text-muted-foreground shrink-0">
                        {formatConversationTime(conv.last_message_at || conv.updated_at)}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span
                        className={cn(
                          'inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium uppercase',
                          getPriorityColor(conv.priority)
                        )}
                      >
                        {conv.priority}
                      </span>
                      <span
                        className={cn(
                          'inline-block w-1.5 h-1.5 rounded-full',
                          getStatusColor(conv.status)
                        )}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground truncate mt-1">
                      {conv.last_message || conv.subject}
                    </p>
                    {conv.unread_count > 0 && (
                      <div className="flex items-center gap-1.5 mt-1.5">
                        <span className="inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full bg-primary text-[10px] font-semibold text-primary-foreground">
                          {conv.unread_count}
                        </span>
                        <CheckCheck
                          size={12}
                          className="text-primary"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </button>
            ))
          )}
        </div>
      </div>

      {/* ─── Chat Area ─── */}
      <div
        className={cn(
          'flex-1 flex flex-col bg-background',
          !showMobileList ? 'flex' : 'hidden md:flex'
        )}
      >
        {activeConversation ? (
          <>
            {/* Chat Header */}
            <div className="px-4 py-3 border-b bg-card shrink-0 flex items-center justify-between">
              <div className="flex items-center gap-3 min-w-0">
                <button
                  onClick={() => {
                    setShowMobileList(true);
                    setActiveConvId(null);
                  }}
                  className="md:hidden p-1 -ml-1 rounded-lg hover:bg-muted transition-colors"
                >
                  <ChevronLeft size={20} />
                </button>
                <Avatar
                  name={activeConversation.tenant_name}
                  online={activeConversation.status === 'open'}
                  size="md"
                />
                <div className="min-w-0">
                  <h3 className="font-medium text-sm truncate">
                    {activeConversation.tenant_name}
                  </h3>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">
                      {activeConversation.status === 'open'
                        ? 'Online'
                        : 'Offline'}
                    </span>
                    <span
                      className={cn(
                        'inline-block w-1.5 h-1.5 rounded-full',
                        activeConversation.status === 'open'
                          ? 'bg-emerald-500'
                          : 'bg-gray-400'
                      )}
                    />
                    <span className="text-xs text-muted-foreground">
                      {activeConversation.subject}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button className="p-2 rounded-lg hover:bg-muted transition-colors hidden sm:block">
                  <Phone size={18} className="text-muted-foreground" />
                </button>
                <button className="p-2 rounded-lg hover:bg-muted transition-colors hidden sm:block">
                  <Video size={18} className="text-muted-foreground" />
                </button>
                <button className="p-2 rounded-lg hover:bg-muted transition-colors">
                  <MoreVertical size={18} className="text-muted-foreground" />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div
              ref={messagesContainerRef}
              className="flex-1 overflow-y-auto p-4 space-y-2 scroll-smooth"
            >
              {/* Date separator */}
              {messages.length > 0 && (
                <div className="flex justify-center mb-3">
                  <div className="px-3 py-1 rounded-full bg-muted text-[11px] text-muted-foreground">
                    {new Date(messages[0].created_at).toLocaleDateString([], {
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </div>
                </div>
              )}

              {messages.map((msg, idx) => {
                const prevMsg = idx > 0 ? messages[idx - 1] : null;
                const showSender =
                  !prevMsg ||
                  prevMsg.sender_id !== msg.sender_id ||
                  prevMsg.sender_type !== msg.sender_type;

                return (
                  <MessageBubble
                    key={msg.id}
                    message={msg}
                    isAdmin={msg.sender_type === 'admin'}
                    showSender={showSender}
                  />
                );
              })}

              {/* Typing indicator */}
              {isTyping && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground animate-in fade-in">
                  <div className="flex items-center gap-1 px-3 py-2 rounded-2xl rounded-tl-md bg-muted">
                    <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/40 animate-bounce [animation-delay:0ms]" />
                    <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/40 animate-bounce [animation-delay:150ms]" />
                    <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/40 animate-bounce [animation-delay:300ms]" />
                  </div>
                  <span className="text-xs">typing...</span>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input area */}
            <div className="border-t bg-card shrink-0">
              <div className="px-4 py-3">
                <div className="flex items-end gap-2">
                  <button className="p-2 rounded-lg hover:bg-muted transition-colors shrink-0">
                    <Paperclip
                      size={20}
                      className="text-muted-foreground"
                    />
                  </button>
                  <button className="p-2 rounded-lg hover:bg-muted transition-colors shrink-0 hidden sm:block">
                    <Smile
                      size={20}
                      className="text-muted-foreground"
                    />
                  </button>
                  <div className="flex-1 relative">
                    <textarea
                      ref={inputRef}
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder="Write a message..."
                      rows={1}
                      className="w-full px-4 py-2.5 rounded-xl bg-muted text-sm placeholder:text-muted-foreground/60 resize-none focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all max-h-[120px]"
                    />
                  </div>
                  <button
                    onClick={handleSend}
                    disabled={!inputValue.trim()}
                    className={cn(
                      'p-2.5 rounded-xl transition-all shrink-0',
                      inputValue.trim()
                        ? 'bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm'
                        : 'bg-muted text-muted-foreground/50'
                    )}
                  >
                    <Send size={20} />
                  </button>
                </div>
                <p className="text-[10px] text-muted-foreground/60 mt-1.5 text-center">
                  Press Enter to send · Shift + Enter for new line
                </p>
              </div>
            </div>
          </>
        ) : (
          /* Empty State */
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center max-w-sm">
              <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <MessageSquare
                  size={36}
                  className="text-primary"
                />
              </div>
              <h3 className="text-lg font-semibold mb-1">
                Tenant Support
              </h3>
              <p className="text-sm text-muted-foreground mb-6">
                Select a conversation from the left to start chatting with tenants.
                Monitor and manage all support requests in one place.
              </p>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs text-muted-foreground justify-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  <span>
                    <strong className="text-foreground">
                      {conversations.filter((c) => c.status === 'open').length}
                    </strong>{' '}
                    active conversations
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground justify-center">
                  <AlertCircle size={12} />
                  <span>
                    <strong className="text-foreground">
                      {conversations.filter((c) => c.priority === 'urgent').length}
                    </strong>{' '}
                    urgent requests
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// ─── Auto-reply helper ──────────────────────────────────────────────────────

const AUTO_REPLIES = [
  'Thank you for the quick response! I\'ll check on our end and get back to you.',
  'That makes sense. Let me coordinate with my team and implement the changes.',
  'Perfect! That\'s exactly what we needed. Appreciate your help on this.',
  'Noted. Could you also look into the user permission issue we discussed last week?',
  'Great, I\'ll wait for the update. Thanks for keeping us informed!',
  'I appreciate the detailed explanation. We\'ll proceed with the recommended steps.',
  'That resolved the issue! The platform is working smoothly now.',
  'Could you share the documentation for this? It would help my team understand better.',
];

const getAutoReply = (name: string) => {
  return AUTO_REPLIES[Math.floor(Math.random() * AUTO_REPLIES.length)];
};

export default SupportChat;
