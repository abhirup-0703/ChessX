import Link from 'next/link';

const ActionButtons = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
    <Link href="/play" className="group block animate-in fade-in slide-in-from-left duration-1000 delay-1200">
      <div className="relative h-20 bg-gradient-to-r from-emerald-500/80 to-teal-500/80 backdrop-blur-md rounded-2xl p-6 shadow-xl border border-white/20 transition-all duration-500 transform group-hover:scale-105 group-hover:shadow-2xl">
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/90 to-teal-400/90 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"></div>
        <div className="relative z-10 h-full flex items-center justify-between">
            <div className="flex items-center">
                <span className="text-2xl mr-4">👥</span>
                <span className="text-xl font-bold text-white">PLAY WITH A FRIEND</span>
            </div>
            <svg className="w-6 h-6 text-white transform group-hover:translate-x-2 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
        </div>
      </div>
    </Link>
    <Link href="/play" className="group block animate-in fade-in slide-in-from-right duration-1000 delay-1200">
      <div className="relative h-20 bg-gradient-to-r from-violet-500/80 to-purple-500/80 backdrop-blur-md rounded-2xl p-6 shadow-xl border border-white/20 transition-all duration-500 transform group-hover:scale-105 group-hover:shadow-2xl">
        <div className="absolute inset-0 bg-gradient-to-r from-violet-400/90 to-purple-400/90 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"></div>
        <div className="relative z-10 h-full flex items-center justify-between">
            <div className="flex items-center">
                <span className="text-2xl mr-4">🤖</span>
                <span className="text-xl font-bold text-white">PLAY WITH THE COMPUTER</span>
            </div>
            <svg className="w-6 h-6 text-white transform group-hover:translate-x-2 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
        </div>
      </div>
    </Link>
  </div>
);

export default ActionButtons;