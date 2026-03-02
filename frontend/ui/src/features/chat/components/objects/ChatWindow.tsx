'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useSocket } from '../../../shared/hooks/useSocket';
import { useAuth } from '../../../auth/context/AuthContext';
import { chatApi, Message } from '../../services/chatApi';
import { Send, Image as ImageIcon, Loader2, Info } from 'lucide-react';
import { ChatSettingsPanel } from './ChatSettingsPanel';

interface ChatWindowProps {
  roomId: string;
}

export const ChatWindow: React.FC<ChatWindowProps> = ({ roomId }) => {
  const { user } = useAuth();
  const { socket, isConnected } = useSocket();
  
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false); // New state for profanity filter check
  const [showSettings, setShowSettings] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (!roomId || !socket) return;

    let isMounted = true;

    const loadRoomData = async () => {
      setIsLoading(true);
      try {
        const history = await chatApi.getMessages(roomId);
        if (isMounted) setMessages(history);
      } catch (error) {
        console.error('Failed to load message history:', error);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    loadRoomData();
    socket.emit('join_room', roomId);

    const handleReceiveMessage = (message: Message) => {
      if (message.roomId === roomId) {
        setMessages((prev) => [...prev, message]);
      }
    };

    socket.on('receive_message', handleReceiveMessage);

    return () => {
      isMounted = false;
      socket.emit('leave_room', roomId);
      socket.off('receive_message', handleReceiveMessage);
    };
  }, [roomId, socket]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    const textToSend = newMessage.trim();
    if (!textToSend || !socket || !user) return;

    setIsAnalyzing(true);
    try {
      // 1. Call the Django Microservice
      const response = await fetch('http://localhost:8000/api/analyze/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: textToSend }),
      });

      if (!response.ok) {
        const errorDetails = await response.text();
        console.error("Django Server Error:", errorDetails);
        throw new Error(`Server returned ${response.status}`);
      }

      const data = await response.json();

      // 2. Check if the message is toxic
      if (data.is_toxic) {
        alert("Your message doesn't clear our profanity standard and cannot be sent.");
        // Note: Not clearing newMessage so the user can edit their message
      } else {
        // 3. If safe, send via socket
        socket.emit('send_message', {
          roomId,
          text: textToSend,
        });
        setNewMessage('');
      }
    } catch (error) {
      console.error('Profanity check error:', error);
      alert('Could not verify message safety. Please check your connection to the filter service.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !socket || !user) return;

    setIsUploading(true);
    try {
      const imageUrl = await chatApi.uploadImage(file);
      
      // Emit the message with the imageUrl returned from Cloudinary
      socket.emit('send_message', {
        roomId,
        imageUrl: imageUrl,
      });
    } catch (error) {
      console.error('Upload error:', error);
      alert('Failed to upload image. Please check your connection.');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = ''; // Reset input
    }
  };

  if (isLoading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-[#0a0a0a] text-purple-400">
        <Loader2 className="animate-spin mb-4" size={32} />
        <p>Loading messages...</p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full bg-[#0a0a0a] relative">
      {/* Header */}
      <div className="h-16 flex items-center justify-between px-6 border-b border-purple-500/20 bg-slate-900/80 backdrop-blur-md sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <div className="h-3 w-3 bg-emerald-500 rounded-full shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div>
          <h3 className="font-semibold text-gray-200">
            Chat Room
            {!isConnected && <span className="ml-2 text-xs text-red-400 font-normal">(Connecting...)</span>}
          </h3>
        </div>

        <button 
          onClick={() => setShowSettings(!showSettings)}
          className={`p-2 rounded-md transition-colors ${showSettings ? 'bg-purple-600/20 text-purple-400' : 'text-gray-400 hover:text-purple-400 hover:bg-white/5'}`}
        >
          <Info size={20} />
        </button>
      </div>

      {showSettings && (
        <ChatSettingsPanel 
          roomId={roomId} 
          onClose={() => setShowSettings(false)} 
          onLeave={() => window.location.reload()}
        />
      )}

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
        {messages.length === 0 ? (
          <div className="h-full flex items-center justify-center text-gray-500 flex-col gap-2">
            <span className="text-4xl">👋</span>
            <p>Be the first to say hello!</p>
          </div>
        ) : (
          messages.map((msg, index) => {
            const isMe = msg.senderId === user?.id;
            const isFirstInGroup = index === 0 || messages[index - 1].senderId !== msg.senderId;

            return (
              <div 
                key={msg._id || index} 
                className={`flex ${isMe ? 'justify-end' : 'justify-start'} ${isFirstInGroup ? 'mt-4' : 'mt-1'}`}
              >
                <div 
                  className={`max-w-[70%] rounded-2xl px-4 py-2 ${
                    isMe 
                      ? 'bg-purple-600 text-white rounded-tr-sm shadow-md shadow-purple-900/20' 
                      : 'bg-slate-800 text-gray-200 rounded-tl-sm border border-purple-500/10'
                  }`}
                >
                  {!isMe && isFirstInGroup && (
                    <p className="text-xs text-purple-300 mb-1 font-bold tracking-wide">
                      {msg.username || `User ${msg.senderId.slice(-4)}`}
                    </p>
                  )}

                  {/* Image Rendering */}
                  {msg.imageUrl && (
                    <div className="mb-2 mt-1">
                      <img 
                        src={msg.imageUrl} 
                        alt="Shared" 
                        className="rounded-lg max-h-72 w-full object-contain bg-black/20 cursor-pointer hover:opacity-90 transition-opacity"
                        onClick={() => window.open(msg.imageUrl, '_blank')}
                      />
                    </div>
                  )}

                  {msg.text && (
                    <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">
                      {msg.text}
                    </p>
                  )}
                  
                  <div className={`text-[10px] mt-1 text-right ${isMe ? 'text-purple-200/70' : 'text-gray-500'}`}>
                    {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-slate-900 border-t border-purple-500/20">
        <form 
          onSubmit={handleSendMessage}
          className="flex items-end gap-2 bg-slate-800 border border-slate-700 rounded-xl p-2 focus-within:border-purple-500/50 transition-colors shadow-inner"
        >
          {/* Hidden File Input */}
          <input 
            type="file" 
            ref={fileInputRef}
            onChange={handleImageUpload}
            accept="image/*"
            className="hidden"
          />

          <button 
            type="button" 
            disabled={isUploading || isAnalyzing}
            onClick={() => fileInputRef.current?.click()}
            className="p-2 text-gray-400 hover:text-purple-400 transition-colors flex-shrink-0 disabled:opacity-50"
            title="Upload Image"
          >
            {isUploading ? <Loader2 size={20} className="animate-spin" /> : <ImageIcon size={20} />}
          </button>
          
          <textarea
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage(e);
              }
            }}
            placeholder={isUploading ? "Uploading image..." : isAnalyzing ? "Analyzing message..." : "Type a message..."}
            disabled={isUploading || isAnalyzing}
            className="flex-1 bg-transparent border-none text-gray-200 text-sm focus:ring-0 resize-none max-h-32 min-h-[40px] py-2 px-1 custom-scrollbar disabled:opacity-50"
            rows={1}
          />
          
          <button 
            type="submit"
            disabled={!newMessage.trim() || !isConnected || isUploading || isAnalyzing}
            className="p-2 mb-0.5 bg-purple-600 hover:bg-purple-500 disabled:bg-slate-700 disabled:text-gray-500 text-white rounded-lg transition-all shadow-md flex-shrink-0"
          >
            {isAnalyzing ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <Send size={18} className={newMessage.trim() && isConnected ? 'translate-x-0.5 -translate-y-0.5' : ''} />
            )}
          </button>
        </form>
      </div>
    </div>
  );
};