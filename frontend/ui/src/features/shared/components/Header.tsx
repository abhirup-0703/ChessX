// src/features/shared/components/Header.tsx
'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { User, LogOut } from 'lucide-react';
import { useAuth } from '@/features/auth/context/AuthContext';
import { SettingsDropdown } from './SettingsDropdown';

// Data for navigation items
const navItems = [
  {
    name: 'Play',
    href: '/play',
    dropdown: [
      { name: 'Create lobby game', href: '/lobby', icon: '🧑‍🤝‍🧑' },
      { name: 'Arena tournaments', href: '/arena', icon: '🏆' },
      { name: 'Swiss tournaments', href: '/swiss', icon: '🇨🇭' },
      { name: 'Simultaneous exhibitions', href: '/simul', icon: '👨‍🏫' },
      { name: 'vs. Computer', href: '/computer', icon: '💻' },
    ],
  },
  {
    name: 'Puzzles',
    href: '/puzzles',
    dropdown: [
      { name: 'Rated Puzzles', href: '/puzzles', icon: '🧩' },
      { name: 'Puzzle Rush', href: '/rush', icon: '🌪️' },
      { name: 'Daily Puzzle', href: '/daily-puzzle', icon: '📅' },
    ],
  },
  {
    name: 'Learn',
    href: '/learn',
    dropdown: [
      { name: 'Lessons', href: '/lessons', icon: '📚' },
      { name: 'Analysis', href: '/analysis', icon: '🔍' },
      { name: 'Opening Explorer', href: '/explorer', icon: '🗺️' },
    ],
  },
  {
    name: 'Community',
    href: '/community',
    dropdown: [
      { name: 'Leaderboard', href: '/leaderboard', icon: '📊' },
      { name: 'Forums', href: '/forums', icon: '🗣️' },
      { name: 'Teams', href: '/teams', icon: '🛡️' }, 
      { name: 'Chat', href: '/chat', icon: '💬' },
      { name: 'Invites', href: '/invite', icon: '✉️' },
    ],
  },
];

const Header = () => {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  
  // REAL AUTH STATE
  const { user, isLoading, handleLogout } = useAuth();

  const lastScrollY = useRef(0);

  // Effect to handle scroll detection
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (lastScrollY.current < currentScrollY && currentScrollY > 100) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
      lastScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on larger screens
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMobileMenuOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <header
      className={`bg-slate-900/80 backdrop-blur-lg shadow-2xl border-b border-purple-500/20 sticky top-0 z-50 transition-transform duration-300 ease-in-out 
        ${isVisible ? 'translate-y-0' : '-translate-y-full'}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* --- Left section (Logo + Nav) --- */}
          <div className="flex items-center gap-8">
            <Link
              href="/"
              className="text-2xl font-bold text-white hover:text-purple-300 transition-colors duration-300"
            >
              ♛ liply
            </Link>

            <nav className="hidden md:flex items-center space-x-2">
              {navItems.map((item) => (
                <div
                  key={item.name}
                  className="relative"
                  onMouseEnter={() => setActiveDropdown(item.name)}
                  onMouseLeave={() => setActiveDropdown(null)}
                >
                  <Link
                    href={item.href}
                    className={`flex items-center px-4 py-2 rounded-lg transition-colors duration-300
                      ${
                        activeDropdown === item.name
                          ? 'bg-white/10 text-white'
                          : 'text-gray-200 hover:text-white hover:bg-white/10'
                      }`}
                  >
                    {item.name}
                  </Link>
                  <div
                    className={`absolute top-full left-0 w-64 origin-top-left transition-all duration-200 ease-out
                      ${
                        activeDropdown === item.name
                          ? 'opacity-100 scale-100'
                          : 'opacity-0 scale-95 pointer-events-none'
                      }`}
                  >
                    <div className="bg-slate-800 rounded-md shadow-lg p-1 mt-1 border border-purple-500/10">
                      {item.dropdown.map((dropdownItem) => (
                        <Link
                          key={dropdownItem.name}
                          href={dropdownItem.href}
                          className="flex items-center gap-3 px-3 py-1.5 text-gray-300 hover:text-white hover:bg-purple-600/30 rounded-sm transition-all duration-200"
                        >
                          <span className="text-lg w-5 text-center">
                            {dropdownItem.icon}
                          </span>
                          <span>{dropdownItem.name}</span>
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </nav>
          </div>

          {/* --- Right section (User Actions) --- */}
          <div className="hidden md:flex items-center space-x-4">
            {isLoading ? (
              // Loading Skeleton
              <div className="h-9 w-9 animate-pulse bg-slate-700 rounded-full"></div>
            ) : !user ? (
              // Logged Out State
              <>
                <Link 
                  href="/login"
                  className="px-4 py-2 text-gray-200 hover:text-white transition-all duration-300 hover:bg-white/10 rounded-lg font-medium"
                >
                  Sign In
                </Link>
                <Link 
                  href="/login"
                  className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-green-600 text-white font-semibold rounded-lg hover:from-emerald-500 hover:to-green-500 transition-all duration-300 transform hover:scale-105 shadow-lg shadow-emerald-900/20"
                >
                  Sign Up
                </Link>
              </>
            ) : (
              // Logged In State
              <div className="flex items-center gap-4">
                
                {/* 1. New Settings / Notifications Dropdown */}
                <SettingsDropdown iconSize={20} />
                
                {/* User Avatar / Dropdown Trigger */}
                <div className="relative group cursor-pointer">
                    {user.avatarUrl ? (
                      <img 
                        src={user.avatarUrl} 
                        alt={user.username} 
                        className="h-9 w-9 rounded-full object-cover border-2 border-purple-400/30"
                      />
                    ) : (
                      <div className="h-9 w-9 rounded-full bg-purple-600 flex items-center justify-center text-white font-bold border-2 border-purple-400/30">
                        {user.username ? user.username.charAt(0).toUpperCase() : 'U'}
                      </div>
                    )}

                    {/* Logout Dropdown (Fixed Hover Bridge & Delay) */}
                    <div className="absolute right-0 top-full pt-2 w-32 opacity-0 group-hover:opacity-100 transition-all duration-300 invisible group-hover:visible z-50">
                        <div className="bg-slate-800 rounded-md shadow-xl py-1 border border-purple-500/10">
                            <button 
                                onClick={handleLogout}
                                className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:text-red-400 hover:bg-white/5 flex items-center gap-2 transition-colors"
                            >
                                <LogOut size={14} />
                                Sign Out
                            </button>
                        </div>
                    </div>
                </div>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-gray-200 hover:text-white p-2 focus:outline-none"
              aria-label="Toggle menu"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d={
                    isMobileMenuOpen
                      ? 'M6 18L18 6M6 6l12 12'
                      : 'M4 6h16M4 12h16M4 18h16'
                  }
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden absolute top-16 left-0 right-0 bg-slate-900/95 backdrop-blur-xl border-b border-purple-500/20 shadow-xl transition-transform duration-300 ease-in-out
          ${
            isMobileMenuOpen
              ? 'transform translate-y-0'
              : 'transform -translate-y-[120%]'
          }`}
      >
        <div className="px-4 pt-4 pb-8">
          <nav className="flex flex-col space-y-2">
            {navItems.map((item) => (
              <div key={item.name}>
                <h3 className="px-4 py-2 text-purple-300 font-semibold">
                  {item.name}
                </h3>
                {item.dropdown.map((dItem) => (
                  <Link
                    key={dItem.name}
                    href={dItem.href}
                    className="flex items-center gap-4 pl-8 pr-4 py-2 text-gray-200 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <span className="text-lg">{dItem.icon}</span>
                    <span>{dItem.name}</span>
                  </Link>
                ))}
              </div>
            ))}
          </nav>
          
          <div className="mt-6 pt-4 border-t border-purple-500/20 flex flex-col space-y-3">
            {isLoading ? (
               <div className="h-10 w-full animate-pulse bg-slate-700 rounded-lg"></div>
            ) : !user ? (
              <>
                <Link 
                  href="/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-full text-center px-4 py-2 text-gray-200 hover:text-white transition-all duration-300 bg-white/5 hover:bg-white/10 rounded-lg"
                >
                  Sign In
                </Link>
                <Link 
                  href="/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-full text-center px-4 py-2 bg-gradient-to-r from-emerald-600 to-green-600 text-white font-semibold rounded-lg hover:from-emerald-500 hover:to-green-500 transition-all duration-300"
                >
                  Sign Up
                </Link>
              </>
            ) : (
              <div className="flex justify-center items-center gap-5">
                
                {/* 2. New Settings / Notifications Dropdown (Mobile) */}
                <SettingsDropdown iconSize={22} />
                
                {user.avatarUrl ? (
                  <img 
                    src={user.avatarUrl} 
                    alt={user.username} 
                    className="h-9 w-9 rounded-full object-cover border-2 border-purple-400/30"
                  />
                ) : (
                  <div className="h-9 w-9 rounded-full bg-purple-600 flex items-center justify-center text-white font-bold border-2 border-purple-400/30">
                    {user.username ? user.username.charAt(0).toUpperCase() : 'U'}
                  </div>
                )}

                <button 
                  onClick={() => {
                    handleLogout();
                    setIsMobileMenuOpen(false);
                  }} 
                  className="text-gray-400 hover:text-red-400 p-2"
                >
                    <LogOut size={22} />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;