'use client';
import React from 'react';
import Link from 'next/link';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-t from-slate-900 via-slate-800 to-slate-900 border-t border-purple-500/20 relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="col-span-1">
            <div className="text-2xl font-bold text-white mb-4">♛ Liply</div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Master the game of kings with our comprehensive chess platform. Play, learn, and improve your skills.
            </p>
          </div>

          {/* Quick Links */}
          <div className="col-span-1">
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-3">
              <li><Link href="/play" className="text-gray-400 hover:text-purple-400 transition-colors duration-300 transform hover:translate-x-1 block">Play Chess</Link></li>
              <li><Link href="/puzzles" className="text-gray-400 hover:text-purple-400 transition-colors duration-300 transform hover:translate-x-1 block">Puzzles</Link></li>
              <li><Link href="/analysis" className="text-gray-400 hover:text-purple-400 transition-colors duration-300 transform hover:translate-x-1 block">Analysis</Link></li>
              <li><Link href="/learn" className="text-gray-400 hover:text-purple-400 transition-colors duration-300 transform hover:translate-x-1 block">Learn</Link></li>
            </ul>
          </div>

          {/* Support & Legal (Combined for brevity) */}
          <div className="col-span-1">
            <h3 className="text-white font-semibold mb-4">Support</h3>
            <ul className="space-y-3">
              <li><Link href="/help" className="text-gray-400 hover:text-purple-400 transition-colors duration-300 transform hover:translate-x-1 block">Help Center</Link></li>
              <li><Link href="/contact" className="text-gray-400 hover:text-purple-400 transition-colors duration-300 transform hover:translate-x-1 block">Contact Us</Link></li>
            </ul>
          </div>
          <div className="col-span-1">
            <h3 className="text-white font-semibold mb-4">Legal</h3>
            <ul className="space-y-3">
              <li><Link href="/terms" className="text-gray-400 hover:text-purple-400 transition-colors duration-300 transform hover:translate-x-1 block">Terms of Service</Link></li>
              <li><Link href="/privacy" className="text-gray-400 hover:text-purple-400 transition-colors duration-300 transform hover:translate-x-1 block">Privacy Policy</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-gray-700 text-center text-gray-400 text-sm">
          © {new Date().getFullYear()} Liply. All rights reserved. Made with ♥ for chess enthusiasts.
        </div>
      </div>
    </footer>
  );
};

export default Footer;