'use client';

import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';

const API_URL = process.env.NEXT_PUBLIC_SOCIAL_API_URL || 'http://localhost:4000/api';
const SOCKET_URL = API_URL.replace('/api', '');

export const useSocket = () => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // Prevent execution on the server during SSR
    if (typeof window === 'undefined') return;

    const token = localStorage.getItem('token');
    
    // Don't attempt a connection if the user isn't logged in
    if (!token) return; 

    // Initialize the socket connection, passing the JWT to the Express middleware
    const socketInstance = io(SOCKET_URL, {
      auth: { token },
      // transports: ['websocket'], // Force websockets for maximum performance
    });

    socketInstance.on('connect', () => {
      console.log('🟢 Socket connected:', socketInstance.id);
      setIsConnected(true);
    });

    socketInstance.on('disconnect', () => {
      console.log('🔴 Socket disconnected');
      setIsConnected(false);
    });

    socketInstance.on('connect_error', (err) => {
      console.error('❌ Socket Connection Error:', err.message);
    });

    setSocket(socketInstance);

    // Cleanup function: disconnect when the component unmounts or user logs out
    return () => {
      socketInstance.disconnect();
    };
  }, []);

  return { socket, isConnected };
};