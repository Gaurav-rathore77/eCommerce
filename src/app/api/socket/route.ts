// Simple health check endpoint - Socket.IO requires custom server setup
// For App Router, we'll use polling-based approach in the client instead

export const dynamic = 'force-dynamic';

export async function GET() {
  return Response.json({ 
    success: true, 
    message: 'Chat API is running. Using polling mode for real-time updates.' 
  });
}
