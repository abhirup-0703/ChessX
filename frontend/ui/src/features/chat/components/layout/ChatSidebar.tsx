'use client';

import React, { useEffect, useState } from 'react';
import { chatApi, ChatRoom } from '../../services/chatApi';
import { Plus, Hash, Users } from 'lucide-react';

interface ChatSidebarProps {
  activeRoomId: string | null;
  onSelectRoom: (roomId: string) => void;
}

export const ChatSidebar: React.FC<ChatSidebarProps> = ({ activeRoomId, onSelectRoom }) => {
  const [rooms, setRooms] = useState<ChatRoom[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [newRoomName, setNewRoomName] = useState('');

  useEffect(() => {
    loadRooms();
  }, []);

  const loadRooms = async () => {
    try {
      const data = await chatApi.getRooms();
      setRooms(data);
    } catch (error) {
      console.error('Failed to load rooms', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRoomName.trim()) return;
    
    try {
      const newRoom = await chatApi.createRoom(newRoomName, true);
      setRooms([...rooms, newRoom]);
      setNewRoomName('');
      setIsCreating(false);
      onSelectRoom(newRoom.id); // Auto-select the newly created room
    } catch (error) {
      console.error('Failed to create room', error);
    }
  };

  return (
    <div className="h-full flex flex-col bg-slate-900 border-r border-purple-500/20 text-gray-200">
      {/* Header & Create Button */}
      <div className="p-4 border-b border-purple-500/20 flex justify-between items-center bg-slate-900/50">
        <h2 className="font-semibold text-lg tracking-wide text-white">Your Chats</h2>
        <button 
          onClick={() => setIsCreating(!isCreating)}
          className="p-1.5 bg-purple-600/20 text-purple-400 hover:bg-purple-600 hover:text-white rounded-md transition-colors"
        >
          <Plus size={18} />
        </button>
      </div>

      {/* Inline Create Room Form */}
      {isCreating && (
        <form onSubmit={handleCreateRoom} className="p-3 bg-slate-800/50 border-b border-purple-500/10">
          <input
            type="text"
            value={newRoomName}
            onChange={(e) => setNewRoomName(e.target.value)}
            placeholder="Room name..."
            className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-1.5 text-sm text-white focus:outline-none focus:border-purple-500 transition-colors"
            autoFocus
          />
          <div className="flex gap-2 mt-2">
            <button type="submit" className="text-xs bg-purple-600 hover:bg-purple-500 text-white px-3 py-1 rounded transition-colors">Create</button>
            <button type="button" onClick={() => setIsCreating(false)} className="text-xs text-gray-400 hover:text-white px-2">Cancel</button>
          </div>
        </form>
      )}

      {/* Room List */}
      <div className="flex-1 overflow-y-auto p-2 space-y-1 custom-scrollbar">
        {loading ? (
          <div className="flex justify-center p-4">
            <div className="h-6 w-6 border-2 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : rooms.length === 0 ? (
          <div className="text-center p-4 text-sm text-gray-500">
            No active chats. Create one to get started!
          </div>
        ) : (
          rooms.map((room) => (
            <button
              key={room.id}
              onClick={() => onSelectRoom(room.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 ${
                activeRoomId === room.id 
                  ? 'bg-purple-600/20 text-white border border-purple-500/30' 
                  : 'text-gray-400 hover:bg-slate-800 hover:text-gray-200 border border-transparent'
              }`}
            >
              <div className={`h-10 w-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                 activeRoomId === room.id ? 'bg-purple-600 text-white' : 'bg-slate-700 text-gray-300'
              }`}>
                {room.isGroup ? <Hash size={18} /> : <Users size={18} />}
              </div>
              <div className="flex-1 text-left overflow-hidden">
                <p className="text-sm font-medium truncate">
                  {room.name || 'Private Chat'}
                </p>
                <p className="text-xs opacity-60 truncate">
                  {room.members.length} members
                </p>
              </div>
            </button>
          ))
        )}
      </div>
    </div>
  );
};