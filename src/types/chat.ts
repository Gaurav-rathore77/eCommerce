export interface Message {
  id: string;
  chatId: string;
  senderType: 'user' | 'admin';
  senderId: string;
  senderName: string;
  content: string;
  timestamp: string;
  read: boolean;
}

export interface Chat {
  id: string;
  userId: string;
  userName: string;
  userEmail?: string;
  orderId?: string;
  subject?: string;
  status: 'active' | 'closed' | 'waiting';
  createdAt: string;
  updatedAt: string;
  lastMessage?: string;
  unreadCount: number;
  messages: Message[];
}

export interface ChatSummary {
  id: string;
  userName: string;
  subject?: string;
  status: 'active' | 'closed' | 'waiting';
  lastMessage?: string;
  unreadCount: number;
  updatedAt: string;
}
