import { Server, Socket } from 'socket.io';
import { Server as HttpServer } from 'http';
import jwt from 'jsonwebtoken';

let io: Server;

export const initSocket = (httpServer: HttpServer) => {
  io = new Server(httpServer, {
    cors: {
      origin: '*', // We will restrict this to your Next.js URL in production
      methods: ['GET', 'POST'],
    },
  });

  // Socket Middleware for JWT Authentication
  io.use((socket: Socket, next) => {
    const token = socket.handshake.auth.token; // The frontend will send the token here
    if (!token) {
      return next(new Error('Authentication error: Token missing'));
    }

    try {
      const secret = process.env.JWT_SECRET!;
      const decoded = jwt.verify(token, secret) as { userId: string };
      
      // Attach the userId to the socket object so we know who is sending messages
      socket.data.userId = decoded.userId;
      next();
    } catch (err) {
      next(new Error('Authentication error: Invalid token'));
    }
  });

  console.log('🔌 Socket.io initialized with JWT authentication');
  return io;
};

export const getIO = () => {
  if (!io) {
    throw new Error('Socket.io not initialized!');
  }
  return io;
};