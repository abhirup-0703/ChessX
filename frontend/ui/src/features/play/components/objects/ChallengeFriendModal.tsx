// src/features/play/components/objects/ChallengeFriendModal.tsx
'use client';

import React, { useState } from 'react';
import { X, User, Clock, ShieldCheck, Trophy } from 'lucide-react';
import { createChallenge } from '../../services/matchmakingApi';

interface ChallengeFriendModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ChallengeFriendModal = ({ isOpen, onClose }: ChallengeFriendModalProps) => {
  const [username, setUsername] = useState('');
  const [timeControl, setTimeControl] = useState('10+0');
  const [colorPref, setColorPref] = useState<'WHITE' | 'BLACK' | 'RANDOM'>('RANDOM');
  const [isRated, setIsRated] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      await createChallenge({
        receiverUsername: username,
        timeControl,
        colorPreference: colorPref,
        isRated
      });
      onClose();
      // Optional: Add a toast notification here for "Challenge Sent!"
    } catch (err: any) {
      setError(err.message || "Failed to send challenge");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-slate-900 border border-purple-500/30 w-full max-w-md rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-purple-500/10">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            🧑‍🤝‍🧑 Play with a friend
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          {/* Username Input */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
              <User size={16} className="text-purple-400" /> Opponent&apos;s Username
            </label>
            <input
              autoFocus
              required
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter username..."
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-purple-500 transition-colors"
            />
          </div>

          {/* Time Control Selection */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
              <Clock size={16} className="text-purple-400" /> Time Control
            </label>
            <select
              value={timeControl}
              onChange={(e) => setTimeControl(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-purple-500 appearance-none"
            >
              <option value="1+0">Bullet • 1+0</option>
              <option value="2+1">Bullet • 2+1</option>
              <option value="3+0">Blitz • 3+0</option>
              <option value="3+2">Blitz • 3+2</option>
              <option value="5+0">Blitz • 5+0</option>
              <option value="5+3">Blitz • 5+3</option>
              <option value="10+0">Rapid • 10+0</option>
              <option value="10+5">Rapid • 10+5</option>
              <option value="15+10">Rapid • 15+10</option>
              <option value="30+0">Classical • 30+0</option>
            </select>
          </div>

          {/* Color Preference */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">Choose your side</label>
            <div className="grid grid-cols-3 gap-3">
              {(['WHITE', 'RANDOM', 'BLACK'] as const).map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setColorPref(color)}
                  className={`py-3 rounded-lg border transition-all flex items-center justify-center text-2xl
                    ${colorPref === color 
                      ? 'border-purple-500 bg-purple-500/10 shadow-lg shadow-purple-500/5' 
                      : 'border-slate-700 bg-slate-800 hover:border-slate-600'}`}
                >
                  {color === 'WHITE' && '⚪'}
                  {color === 'BLACK' && '⚫'}
                  {color === 'RANDOM' && '☯️'}
                </button>
              ))}
            </div>
          </div>

          {/* Rated / Casual Toggle */}
          <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg border border-slate-700">
            <div className="flex items-center gap-3">
              <Trophy size={18} className={isRated ? 'text-amber-400' : 'text-gray-500'} />
              <div>
                <p className="text-sm font-medium text-white">{isRated ? 'Rated' : 'Casual'}</p>
                <p className="text-xs text-gray-400">Affects your ranking</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsRated(!isRated)}
              className={`w-12 h-6 rounded-full p-1 transition-colors duration-200 ease-in-out
                ${isRated ? 'bg-purple-600' : 'bg-slate-600'}`}
            >
              <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-200
                ${isRated ? 'translate-x-6' : 'translate-x-0'}`} />
            </button>
          </div>

          {/* Submit Button */}
          <button
            disabled={isSubmitting || !username}
            className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold py-3 rounded-lg shadow-xl shadow-purple-900/20 transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:scale-100 mt-4"
          >
            {isSubmitting ? 'Sending...' : 'Challenge to a Game'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChallengeFriendModal;