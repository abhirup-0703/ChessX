'use client';
import React, { useState, useEffect, ReactNode } from 'react';

interface PageWrapperProps {
  children: ReactNode;
}

const PageWrapper = ({ children }: PageWrapperProps) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-emerald-900 to-slate-950 text-white overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-emerald-400 rounded-full mix-blend-multiply filter blur-2xl opacity-10 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-teal-400 rounded-full mix-blend-multiply filter blur-2xl opacity-10 animate-pulse"></div>
        <div
          className="absolute w-96 h-96 bg-gradient-to-r from-emerald-400/10 to-teal-400/10 rounded-full filter blur-3xl pointer-events-none transition-transform duration-500 ease-out"
          style={{ transform: `translate(${mousePosition.x - 192}px, ${mousePosition.y - 192}px)` }}
        ></div>
      </div>
      <main className="relative z-10">
        {children}
      </main>
    </div>
  );
};

export default PageWrapper;

