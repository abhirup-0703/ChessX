// src/features/shared/components/SettingsDropdown.tsx
'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Settings, Check, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/features/auth/context/AuthContext';
import { 
  getIncomingChallenges, 
  acceptChallenge, 
  declineChallenge, 
  GameChallenge 
} from '@/features/play/services/matchmakingApi';

export const SettingsDropdown = ({ iconSize = 20 }: { iconSize?: number }) => {
  const { user } = useAuth();
  const router = useRouter();
  
  const [isOpen, setIsOpen] = useState(false);
  const [challenges, setChallenges] = useState<GameChallenge[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fetch challenges asynchronously
  useEffect(() => {
    let isMounted = true;

    if (isOpen && user) {
      getIncomingChallenges()
        .then((data) => {
          if (isMounted) setChallenges(data);
        })
        .catch(console.error)
        .finally(() => {
          // Asynchronous state updates in effects are perfectly fine
          if (isMounted) setIsLoading(false);
        });
    }

    return () => {
      isMounted = false; // Cleanup if component unmounts
    };
  }, [isOpen, user]);

  // Safely trigger the loading state in the event handler instead of the effect
  const handleToggle = () => {
    if (!isOpen && user) {
      setIsLoading(true);
    }
    setIsOpen(!isOpen);
  };

  const handleAccept = async (id: string) => {
    try {
      const { matchId } = await acceptChallenge(id);
      setIsOpen(false);
      router.push(`/gameWindow?matchId=${matchId}`);
    } catch (err) {
      console.error("Failed to accept challenge", err);
    }
  };

  const handleDecline = async (id: string) => {
    try {
      await declineChallenge(id);
      setChallenges((prev) => prev.filter((c) => c.id !== id));
    } catch (err) {
      console.error("Failed to decline challenge", err);
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={handleToggle}
        className={`relative p-2 rounded-full transition-colors flex items-center justify-center
          ${isOpen ? 'bg-white/10 text-white' : 'text-gray-400 hover:text-white hover:bg-white/10'}`}
        aria-label="Settings and Notifications"
      >
        <Settings size={iconSize} />
        {challenges.length > 0 && !isOpen && (
          <span className="absolute top-1 right-1 block h-2.5 w-2.5 rounded-full bg-red-500 ring-2 ring-slate-900"></span>
        )}
      </button>

      {/* The Dropdown Menu */}
      <div
        className={`absolute right-0 mt-2 w-80 bg-slate-800 rounded-lg shadow-2xl border border-purple-500/20 overflow-hidden transition-all duration-200 ease-out origin-top-right z-50
          ${isOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}`}
      >
        <div className="bg-slate-900/50 px-4 py-3 border-b border-purple-500/20 font-semibold text-gray-200">
          Pending Challenges
        </div>
        
        <div className="max-h-80 overflow-y-auto">
          {isLoading ? (
            <div className="p-4 text-center text-gray-400 text-sm animate-pulse">Loading...</div>
          ) : challenges.length === 0 ? (
            <div className="p-6 text-center text-gray-400 text-sm">
              <p>No pending challenges.</p>
            </div>
          ) : (
            challenges.map((challenge) => (
              <div 
                key={challenge.id} 
                className="p-4 border-b border-purple-500/10 hover:bg-slate-700/50 transition-colors last:border-0"
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <span className="font-bold text-purple-400 block">{challenge.sender.username}</span>
                    <span className="text-xs text-gray-400 block mt-0.5">
                      {challenge.timeControl} • {challenge.rated ? 'Rated' : 'Casual'} • {challenge.colorPreference}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => handleAccept(challenge.id)} 
                    className="flex-1 flex items-center justify-center gap-1 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 text-white text-xs font-semibold py-2 rounded-md transition-all shadow-md"
                  >
                    <Check size={14} /> Accept
                  </button>
                  <button 
                    onClick={() => handleDecline(challenge.id)} 
                    className="flex-1 flex items-center justify-center gap-1 bg-slate-700 hover:bg-red-600/80 text-white text-xs font-semibold py-2 rounded-md transition-all"
                  >
                    <X size={14} /> Decline
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
        
        <div className="bg-slate-900/50 px-4 py-3 border-t border-purple-500/20">
          <button onClick={() => router.push('/settings')} className="w-full text-left text-sm text-gray-300 hover:text-purple-300 transition-colors">
            Account Settings...
          </button>
        </div>
      </div>
    </div>
  );
};