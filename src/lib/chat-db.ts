import fs from 'fs/promises';
import path from 'path';
import { Chat, Message, ChatSummary } from '@/types/chat';
import { v4 as uuidv4 } from 'uuid';

const CHAT_DB_PATH = path.join(process.cwd(), 'data', 'chats.json');

interface ChatDatabase {
  chats: Chat[];
}

const defaultChatData: ChatDatabase = {
  chats: [],
};

async function readChatDatabase(): Promise<ChatDatabase> {
  try {
    const data = await fs.readFile(CHAT_DB_PATH, 'utf-8');
    return JSON.parse(data);
  } catch {
    return { ...defaultChatData };
  }
}

async function writeChatDatabase(db: ChatDatabase): Promise<void> {
  await fs.mkdir(path.dirname(CHAT_DB_PATH), { recursive: true });
  await fs.writeFile(CHAT_DB_PATH, JSON.stringify(db, null, 2));
}

// Create a new chat
export async function createChat(
  userId: string,
  userName: string,
  userEmail?: string,
  subject?: string,
  orderId?: string
): Promise<Chat> {
  const db = await readChatDatabase();
  
  const newChat: Chat = {
    id: uuidv4(),
    userId,
    userName,
    userEmail,
    subject,
    orderId,
    status: 'waiting',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    unreadCount: 0,
    messages: [],
  };

  db.chats.push(newChat);
  await writeChatDatabase(db);
  return newChat;
}

// Get chat by ID
export async function getChatById(chatId: string): Promise<Chat | null> {
  const db = await readChatDatabase();
  const chat = db.chats.find((c) => c.id === chatId);
  return chat || null;
}

// Get chats by user ID
export async function getChatsByUserId(userId: string): Promise<Chat[]> {
  const db = await readChatDatabase();
  return db.chats
    .filter((c) => c.userId === userId)
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
}

// Get all chats (for admin)
export async function getAllChats(): Promise<ChatSummary[]> {
  const db = await readChatDatabase();
  return db.chats
    .map((chat) => ({
      id: chat.id,
      userName: chat.userName,
      subject: chat.subject,
      status: chat.status,
      lastMessage: chat.lastMessage,
      unreadCount: chat.unreadCount,
      updatedAt: chat.updatedAt,
    }))
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
}

// Add message to chat
export async function addMessage(
  chatId: string,
  senderType: 'user' | 'admin',
  senderId: string,
  senderName: string,
  content: string
): Promise<Message | null> {
  const db = await readChatDatabase();
  const chatIndex = db.chats.findIndex((c) => c.id === chatId);

  if (chatIndex === -1) return null;

  const newMessage: Message = {
    id: uuidv4(),
    chatId,
    senderType,
    senderId,
    senderName,
    content,
    timestamp: new Date().toISOString(),
    read: false,
  };

  db.chats[chatIndex].messages.push(newMessage);
  db.chats[chatIndex].lastMessage = content;
  db.chats[chatIndex].updatedAt = new Date().toISOString();
  
  if (senderType === 'user') {
    db.chats[chatIndex].unreadCount += 1;
  }

  await writeChatDatabase(db);
  return newMessage;
}

// Mark messages as read
export async function markMessagesAsRead(chatId: string, userType: 'user' | 'admin'): Promise<void> {
  const db = await readChatDatabase();
  const chatIndex = db.chats.findIndex((c) => c.id === chatId);

  if (chatIndex === -1) return;

  db.chats[chatIndex].messages.forEach((msg) => {
    if (msg.senderType !== userType) {
      msg.read = true;
    }
  });

  if (userType === 'admin') {
    db.chats[chatIndex].unreadCount = 0;
  }

  await writeChatDatabase(db);
}

// Update chat status
export async function updateChatStatus(
  chatId: string,
  status: 'active' | 'closed' | 'waiting'
): Promise<Chat | null> {
  const db = await readChatDatabase();
  const chatIndex = db.chats.findIndex((c) => c.id === chatId);

  if (chatIndex === -1) return null;

  db.chats[chatIndex].status = status;
  db.chats[chatIndex].updatedAt = new Date().toISOString();

  await writeChatDatabase(db);
  return db.chats[chatIndex];
}

// Delete chat
export async function deleteChat(chatId: string): Promise<boolean> {
  const db = await readChatDatabase();
  const initialLength = db.chats.length;
  db.chats = db.chats.filter((c) => c.id !== chatId);

  if (db.chats.length === initialLength) return false;

  await writeChatDatabase(db);
  return true;
}
