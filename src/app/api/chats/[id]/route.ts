import { NextRequest, NextResponse } from 'next/server';
import { getChatById, addMessage, updateChatStatus, deleteChat, markMessagesAsRead } from '@/lib/chat-db';
import { verifyAuth } from '@/lib/auth';

// Get chat by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const chat = await getChatById(id);

    if (!chat) {
      return NextResponse.json(
        { error: 'Chat not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ chat });
  } catch (error) {
    console.error('Error fetching chat:', error);
    return NextResponse.json(
      { error: 'Failed to fetch chat' },
      { status: 500 }
    );
  }
}

// Add message to chat or update status
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    // Add message
    if (body.content) {
      const { senderType, senderId, senderName, content } = body;

      if (!senderType || !senderId || !senderName || !content) {
        return NextResponse.json(
          { error: 'Missing required fields' },
          { status: 400 }
        );
      }

      const message = await addMessage(id, senderType, senderId, senderName, content);

      if (!message) {
        return NextResponse.json(
          { error: 'Chat not found' },
          { status: 404 }
        );
      }

      // Update chat status to active when admin replies
      if (senderType === 'admin') {
        await updateChatStatus(id, 'active');
      }

      return NextResponse.json({ message }, { status: 201 });
    }

    // Mark messages as read
    if (body.action === 'mark-read') {
      const { userType } = body;
      await markMessagesAsRead(id, userType);
      return NextResponse.json({ success: true });
    }

    return NextResponse.json(
      { error: 'Invalid action' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Error in chat action:', error);
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    );
  }
}

// Update chat status
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authError = await verifyAuth(request);
    if (authError) {
      return authError;
    }

    const { id } = await params;
    const { status } = await request.json();

    if (!status || !['active', 'closed', 'waiting'].includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status' },
        { status: 400 }
      );
    }

    const chat = await updateChatStatus(id, status);

    if (!chat) {
      return NextResponse.json(
        { error: 'Chat not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ chat });
  } catch (error) {
    console.error('Error updating chat:', error);
    return NextResponse.json(
      { error: 'Failed to update chat' },
      { status: 500 }
    );
  }
}

// Delete chat
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authError = await verifyAuth(request);
    if (authError) {
      return authError;
    }

    const { id } = await params;
    const success = await deleteChat(id);

    if (!success) {
      return NextResponse.json(
        { error: 'Chat not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting chat:', error);
    return NextResponse.json(
      { error: 'Failed to delete chat' },
      { status: 500 }
    );
  }
}
