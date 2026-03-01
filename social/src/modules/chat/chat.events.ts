import { Server, Socket } from 'socket.io';
import { Message } from './message.model';

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

      // A. Save the message to MongoDB
      const newMessage = await Message.create({
        roomId,
        senderId: userId,
        text,
        imageUrl,
      });

      // B. Broadcast the saved message to everyone in the room (including the sender)
      io.to(roomId).emit('receive_message', newMessage);
      
    } catch (error) {
      console.error('Error saving/sending message:', error);
      // Let the sender know their message failed
      socket.emit('error', { message: 'Failed to send message' }); 
    }
  });
};