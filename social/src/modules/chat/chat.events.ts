import { Server, Socket } from 'socket.io';
import { Message } from './message.model';
import { prisma } from '../../shared/db/prisma'

export const handleChatEvents = (io: Server, socket: Socket) => {
  const userId = socket.data.userId;

  // 1. User joins a specific chat room
  socket.on('join_room', (roomId: string) => {
    socket.join(roomId);
    console.log(`User ${userId} joined room ${roomId}`);
  });

  // 2. User leaves a room (e.g., clicks away to another page)
  socket.on('leave_room', (roomId: string) => {
    socket.leave(roomId);
    console.log(`User ${userId} left room ${roomId}`);
  });

  // 3. User sends a message
  socket.on('send_message', async (data: { roomId: string; text?: string; imageUrl?: string }) => {
  try {
    const { roomId, text, imageUrl } = data;

    // Ensure the message has at least text or an image
    if (!text && !imageUrl) return;

    // 1. Fetch the sender's username from Postgres (Prisma)
    // Note: If you stored the username in 'socket.data.user' during connection, 
    // you can use that instead of a database query for better performance.
    const sender = await prisma.user.findUnique({
      where: { id: userId },
      select: { username: true }
    });

    const username = sender?.username || "Unknown User";

    // 2. Save the message to MongoDB
    // We add 'username' here so that when we fetch history later, the name is already there.
    const newMessage = await Message.create({
      roomId,
      senderId: userId,
      username: username, 
      text,
      imageUrl,
    });

    // 3. Broadcast the saved message to everyone in the room
    // We spread the newMessage and explicitly ensure username is included
    io.to(roomId).emit('receive_message', {
      ...newMessage.toObject(),
      username: username
    });
    
  } catch (error) {
    console.error('❌ Error saving/sending message:', error);
    socket.emit('error', { message: 'Failed to send message' }); 
  }
});
};