import React from 'react';
import { Link } from 'react-router-dom';
import { Volume2, VolumeX, Star, Home, Globe } from 'lucide-react';
import { useGame } from '../context/GameContext';

export const Navbar = () => {
  const { stars, soundEnabled, toggleSound, language, setLanguage, t } = useGame();

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-4 py-3 shadow-soft-sm">
      <div className="max-w-4xl mx-auto flex items-center justify-between gap-3">
        
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 p-0.5 shadow-sm flex items-center justify-center text-2xl group-hover:scale-105 transition-transform">
            🦟
          </div>
          <div>
            <div className="text-sm sm:text-base font-black tracking-tight text-slate-900 group-hover:text-emerald-700 transition-colors leading-none">
              {t('appName')}
            </div>
            <div className="text-[10px] text-emerald-700 font-extrabold tracking-wider uppercase mt-0.5">
              {t('appSub')}
            </div>
          </div>
        </Link>

        {/* Right side controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* Language Selector Dropdown */}
          <div className="relative flex items-center bg-slate-100 border border-slate-200 rounded-xl px-2 py-1 text-xs font-bold text-slate-700">
            <Globe className="w-3.5 h-3.5 text-emerald-600 mr-1.5 shrink-0" />
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="bg-transparent text-xs font-black text-slate-800 outline-none cursor-pointer pr-1"
            >
              <option value="en">English 🇬🇧</option>
              <option value="hi">हिन्दी 🇮🇳</option>
              <option value="te">తెలుగు 🇮🇳</option>
            </select>
          </div>

          {/* Star Counter */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-100 border border-amber-300 text-amber-900 font-black text-xs shadow-soft-sm">
            <Star className="w-3.5 h-3.5 fill-current text-amber-500 animate-pulse" />
            <span>{stars} {t('stars')}</span>
          </div>

          {/* Sound Toggle */}
          <button
            onClick={toggleSound}
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 transition-colors"
            title={soundEnabled ? 'Mute Sound' : 'Enable Sound'}
          >
            {soundEnabled ? (
              <Volume2 className="w-4 h-4 text-emerald-600" />
            ) : (
              <VolumeX className="w-4 h-4 text-slate-400" />
            )}
          </button>

          {/* Home Button */}
          <Link
            to="/"
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 transition-colors"
            title={t('allGames')}
          >
            <Home className="w-4 h-4 text-slate-700" />
          </Link>
        </div>

      </div>
    </header>
  );
};
