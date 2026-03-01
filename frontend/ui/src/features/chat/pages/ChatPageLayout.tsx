'use client';

import React, { useState } from 'react';
import { useAuth } from '../../auth/context/AuthContext';
import { ChatSidebar } from '../components/layout/ChatSidebar';
import { ChatWindow } from '../components/objects/ChatWindow';

const ChatPageLayout = () => {
  const { user, isLoading } = useAuth();
  const [activeRoomId, setActiveRoomId] = useState<string | null>(null);

  // Protect the route: If they somehow get here without logging in, show a loading/unauthorized state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center text-white">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-12 w-12 bg-indigo-500 rounded-full mb-4"></div>
          <p>Loading Chat...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center text-white">
        <p>You must be logged in to view chats.</p>
      </div>
    );
  }

  return (
    // Subtracting the Navbar height (approx 64px or h-16) to prevent page scrolling
    <div className="flex h-[calc(100vh-64px)] bg-[#0a0a0a] overflow-hidden">
      
      {/* Sidebar (Rooms List) */}
      <div className="w-80 bg-slate-900 border-r border-slate-800 flex-shrink-0">
         <ChatSidebar 
            activeRoomId={activeRoomId} 
            onSelectRoom={(roomId) => setActiveRoomId(roomId)} 
         />
      </div>

      {/* Main Chat Window */}
      <div className="flex-1 bg-[#0a0a0a] flex flex-col relative">
        {activeRoomId ? (
          <ChatWindow roomId={activeRoomId} /> // <-- Replace the placeholder!
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-gray-500">
            {/* ... welcome screen ... */}
          </div>
        )}
      </div>

    </div>
  );
};

export default ChatPageLayout;