'use client';

import React, { useEffect, useState } from 'react';
import { chatApi, ChatMember } from '../../services/chatApi';
import { useAuth } from '../../../auth/context/AuthContext';
import { X, UserPlus, Shield, UserMinus, LogOut, Loader2 } from 'lucide-react';

interface ChatSettingsPanelProps {
  roomId: string;
  onClose: () => void;
  onLeave: () => void; // Callback to tell the parent window to close the room
}

export const ChatSettingsPanel: React.FC<ChatSettingsPanelProps> = ({ roomId, onClose, onLeave }) => {
  const { user } = useAuth();
  const [members, setMembers] = useState<ChatMember[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Invite State
  const [inviteUsername, setInviteUsername] = useState('');
  const [isInviting, setIsInviting] = useState(false);
  const [inviteMessage, setInviteMessage] = useState({ text: '', type: '' });

  useEffect(() => {
    loadMembers();
  }, [roomId]);

  const loadMembers = async () => {
    try {
      const data = await chatApi.getRoomMembers(roomId);
      setMembers(data);
    } catch (error) {
      console.error('Failed to load members', error);
    } finally {
      setLoading(false);
    }
  };

  // Find the current user's role to determine if they see Admin controls
  const currentUserRole = members.find(m => m.userId === user?.id)?.role;
  const isAdmin = currentUserRole === 'ADMIN';

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteUsername.trim()) return;

    setIsInviting(true);
    setInviteMessage({ text: '', type: '' });

    try {
      await chatApi.sendInvite(roomId, inviteUsername.trim());
      setInviteMessage({ text: 'Invite sent successfully!', type: 'success' });
      setInviteUsername('');
    } catch (error: any) {
      setInviteMessage({ 
        text: error.response?.data?.error || 'Failed to send invite.', 
        type: 'error' 
      });
    } finally {
      setIsInviting(false);
      // Clear message after 3 seconds
      setTimeout(() => setInviteMessage({ text: '', type: '' }), 3000);
    }
  };

  const handleKick = async (userId: string) => {
    if (!window.confirm('Are you sure you want to remove this user from the group?')) return;
    try {
      await chatApi.kickMember(roomId, userId);
      loadMembers(); // Refresh list
    } catch (error) {
      alert('Failed to kick user.');
    }
  };

  const handlePromote = async (userId: string) => {
    if (!window.confirm('Make this user an Admin? They will be able to invite and kick others.')) return;
    try {
      await chatApi.promoteMember(roomId, userId);
      loadMembers(); // Refresh list
    } catch (error) {
      alert('Failed to promote user.');
    }
  };

  const handleLeaveGroup = async () => {
    if (!window.confirm('Are you sure you want to leave this chat?')) return;
    try {
      await chatApi.leaveRoom(roomId);
      onLeave(); // Tell the parent to clear the active room
    } catch (error) {
      alert('Failed to leave the room.');
    }
  };

  return (
    <div className="w-80 h-full bg-slate-900 border-l border-purple-500/20 flex flex-col shadow-[-10px_0_30px_rgba(0,0,0,0.5)] z-20 absolute right-0 top-0">
      
      {/* Header */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-purple-500/20 bg-slate-900/95">
        <h3 className="font-semibold text-white">Group Info</h3>
        <button onClick={onClose} className="p-2 text-gray-400 hover:text-white transition-colors rounded-full hover:bg-white/5">
          <X size={20} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {/* Invite Section (Admins Only) */}
        {isAdmin && (
          <div className="p-4 border-b border-slate-800">
            <h4 className="text-xs font-semibold text-purple-400 uppercase tracking-wider mb-3">Add Member</h4>
            <form onSubmit={handleInvite} className="space-y-2">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={inviteUsername}
                  onChange={(e) => setInviteUsername(e.target.value)}
                  placeholder="Username..."
                  className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-purple-500 transition-colors"
                />
                <button 
                  type="submit" 
                  disabled={isInviting || !inviteUsername.trim()}
                  className="bg-purple-600 hover:bg-purple-500 disabled:bg-slate-700 text-white p-2 rounded-lg transition-colors flex items-center justify-center min-w-[40px]"
                >
                  {isInviting ? <Loader2 size={18} className="animate-spin" /> : <UserPlus size={18} />}
                </button>
              </div>
              {inviteMessage.text && (
                <p className={`text-xs mt-1 ${inviteMessage.type === 'success' ? 'text-emerald-400' : 'text-red-400'}`}>
                  {inviteMessage.text}
                </p>
              )}
            </form>
          </div>
        )}

        {/* Members List */}
        <div className="p-4">
          <h4 className="text-xs font-semibold text-purple-400 uppercase tracking-wider mb-4">
            Members — {members.length}
          </h4>
          
          {loading ? (
            <div className="flex justify-center p-4 text-purple-400"><Loader2 className="animate-spin" /></div>
          ) : (
            <div className="space-y-3">
              {members.map((member) => {
                const isMe = member.userId === user?.id;
                
                return (
                  <div key={member.userId} className="flex items-center justify-between group">
                    <div className="flex items-center gap-3 overflow-hidden">
                      <div className="h-8 w-8 rounded-full bg-slate-700 text-gray-300 flex items-center justify-center text-sm font-bold flex-shrink-0 border border-slate-600">
                        {member.user.avatarUrl ? (
                          <img src={member.user.avatarUrl} alt="avatar" className="h-full w-full rounded-full object-cover" />
                        ) : (
                          member.user.username.charAt(0).toUpperCase()
                        )}
                      </div>
                      <div className="truncate">
                        <p className="text-sm font-medium text-gray-200 truncate">
                          {member.user.username} {isMe && <span className="text-xs text-gray-500">(You)</span>}
                        </p>
                        <p className="text-xs text-purple-400">{member.role}</p>
                      </div>
                    </div>

                    {/* Admin Controls (Only show if I am an Admin, and this user is NOT me) */}
                    {isAdmin && !isMe && (
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        {member.role !== 'ADMIN' && (
                          <button onClick={() => handlePromote(member.userId)} title="Make Admin" className="p-1.5 text-gray-400 hover:text-emerald-400 hover:bg-emerald-400/10 rounded">
                            <Shield size={14} />
                          </button>
                        )}
                        <button onClick={() => handleKick(member.userId)} title="Kick User" className="p-1.5 text-gray-400 hover:text-red-400 hover:bg-red-400/10 rounded">
                          <UserMinus size={14} />
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Leave Button */}
      <div className="p-4 border-t border-slate-800 bg-slate-900/50">
        <button 
          onClick={handleLeaveGroup}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-500/10 text-red-400 hover:bg-red-500/20 hover:text-red-300 rounded-lg transition-colors font-medium text-sm border border-red-500/20"
        >
          <LogOut size={16} />
          Leave Group
        </button>
      </div>

    </div>
  );
};