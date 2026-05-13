import { NextRequest, NextResponse } from 'next/server';
import { createChat, getAllChats, getChatsByUserId } from '@/lib/chat-db';
import { verifyAuth } from '@/lib/auth';

// Get all chats (admin) or user chats
export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const userId = url.searchParams.get('userId');

    if (userId) {
      // Get user's chats
      const chats = await getChatsByUserId(userId);
      return NextResponse.json({ chats });
    }

    // Verify admin authentication for all chats
    const authError = await verifyAuth(request);
    if (authError) {
      return authError;
    }

    const chats = await getAllChats();
    return NextResponse.json({ chats });
  } catch (error) {
    console.error('Error fetching chats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch chats' },
      { status: 500 }
    );
  }
}

// Create a new chat
export async function POST(request: NextRequest) {
  try {
    const { userId, userName, userEmail, subject, orderId } = await request.json();

    if (!userId || !userName) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const chat = await createChat(userId, userName, userEmail, subject, orderId);
    return NextResponse.json({ chat }, { status: 201 });
  } catch (error) {
    console.error('Error creating chat:', error);
    return NextResponse.json(
      { error: 'Failed to create chat' },
      { status: 500 }
    );
  }
}

