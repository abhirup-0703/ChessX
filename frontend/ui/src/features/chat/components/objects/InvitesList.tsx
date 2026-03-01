'use client';

import React, { useEffect, useState } from 'react';
import { chatApi, ChatInvite } from '../../services/chatApi';
import { Check, X, Loader2, Mail } from 'lucide-react';
import { useRouter } from 'next/navigation';

export const InvitesList = () => {
  const [invites, setInvites] = useState<ChatInvite[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    loadInvites();
  }, []);

  const loadInvites = async () => {
    try {
      const data = await chatApi.getMyInvites();
      setInvites(data);
    } catch (error) {
      console.error('Failed to load invites:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleResponse = async (inviteId: string, accept: boolean) => {
    try {
      await chatApi.respondToInvite(inviteId, accept);
      // Remove the invite from the local state list immediately
      setInvites(invites.filter((inv) => inv.id !== inviteId));
      
      if (accept) {
        // If they accepted, you might want to redirect them to the chat page
        router.push('/chat');
      }
    } catch (error) {
      console.error('Failed to respond to invite:', error);
      alert('Error responding to invite.');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64 text-purple-400">
        <Loader2 className="animate-spin" size={32} />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-slate-900 border border-purple-500/20 rounded-xl shadow-2xl text-gray-200">
      <div className="flex items-center gap-3 mb-6 border-b border-purple-500/20 pb-4">
        <div className="p-2 bg-purple-600/20 text-purple-400 rounded-lg">
          <Mail size={24} />
        </div>
        <h2 className="text-2xl font-bold text-white">Pending Invites</h2>
      </div>

      {invites.length === 0 ? (
        <div className="text-center py-10 text-gray-500">
          <p>You have no pending invites right now.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {invites.map((invite) => (
            <div key={invite.id} className="flex items-center justify-between p-4 bg-slate-800 rounded-lg border border-slate-700 hover:border-purple-500/30 transition-colors">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 bg-purple-600/20 text-purple-400 rounded-full flex items-center justify-center font-bold border border-purple-500/30">
                  {invite.room.name ? invite.room.name.charAt(0).toUpperCase() : '#'}
                </div>
                <div>
                  <h3 className="font-semibold text-white text-lg">{invite.room.name || 'Private Group'}</h3>
                  <p className="text-sm text-gray-400">
                    Invited by <span className="text-purple-400 font-medium">@{invite.inviter.username}</span>
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleResponse(invite.id, false)}
                  className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-400/10 rounded-full transition-colors"
                  title="Decline"
                >
                  <X size={24} />
                </button>
                <button
                  onClick={() => handleResponse(invite.id, true)}
                  className="p-2 text-emerald-500 hover:text-emerald-400 hover:bg-emerald-500/10 rounded-full transition-colors"
                  title="Accept"
                >
                  <Check size={24} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};