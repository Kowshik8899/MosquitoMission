import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Play, Sparkles, Flame, Star, ShieldCheck } from 'lucide-react';
import { useGame } from '../context/GameContext';

export const HomePage = () => {
  const { stars, completedGames, t } = useGame();

  const miniGames = [
    {
      id: 'biscuit',
      path: '/game/biscuit',
      titleKey: 'biscuitTitle',
      icon: '🍪☕',
      descKey: 'biscuitDesc',
      tag: 'GAME 1',
      tagBg: 'bg-amber-100 text-amber-900 border-amber-300',
      cardBorder: 'border-amber-200 hover:border-amber-400',
      cardBg: 'hover:bg-amber-50/50',
    },
    {
      id: 'detective',
      path: '/game/detective',
      titleKey: 'detectiveTitle',
      icon: '✋🦟',
      descKey: 'detectiveDesc',
      tag: 'GAME 2',
      tagBg: 'bg-emerald-100 text-emerald-900 border-emerald-300',
      cardBorder: 'border-emerald-200 hover:border-emerald-400',
      cardBg: 'hover:bg-emerald-50/50',
    },
    {
      id: 'breeding',
      path: '/game/breeding',
      titleKey: 'breedingTitle',
      icon: '🪣💧',
      descKey: 'breedingDesc',
      tag: 'GAME 3',
      tagBg: 'bg-cyan-100 text-cyan-900 border-cyan-300',
      cardBorder: 'border-cyan-200 hover:border-cyan-400',
      cardBg: 'hover:bg-cyan-50/50',
    },
    {
      id: 'fan',
      path: '/game/fan',
      titleKey: 'fanTitle',
      icon: '🌀💨',
      descKey: 'fanDesc',
      tag: 'GAME 4',
      tagBg: 'bg-sky-100 text-sky-900 border-sky-300',
      cardBorder: 'border-sky-200 hover:border-sky-400',
      cardBg: 'hover:bg-sky-50/50',
    },
    {
      id: 'net',
      path: '/game/net',
      titleKey: 'netTitle',
      icon: '🛏️🕸️',
      descKey: 'netDesc',
      tag: 'GAME 5',
      tagBg: 'bg-indigo-100 text-indigo-900 border-indigo-300',
      cardBorder: 'border-indigo-200 hover:border-indigo-400',
      cardBg: 'hover:bg-indigo-50/50',
    },
    {
      id: 'myth',
      path: '/game/myth',
      titleKey: 'mythTitle',
      icon: '🚫⚡',
      descKey: 'mythDesc',
      tag: 'GAME 6',
      tagBg: 'bg-orange-100 text-orange-900 border-orange-300',
      cardBorder: 'border-orange-200 hover:border-orange-400',
      cardBg: 'hover:bg-orange-50/50',
    },
    {
      id: 'eco',
      path: '/game/eco',
      titleKey: 'ecoTitle',
      icon: '🌱🌸',
      descKey: 'ecoDesc',
      tag: 'GAME 7',
      tagBg: 'bg-lime-100 text-lime-900 border-lime-300',
      cardBorder: 'border-lime-200 hover:border-lime-400',
      cardBg: 'hover:bg-lime-50/50',
    },
    {
      id: 'escape',
      path: '/game/escape',
      titleKey: 'escapeTitle',
      icon: '🏠🫙',
      descKey: 'escapeDesc',
      tag: 'GAME 8 🌟',
      tagBg: 'bg-emerald-100 text-emerald-900 border-emerald-300',
      cardBorder: 'border-emerald-300 hover:border-emerald-500',
      cardBg: 'hover:bg-emerald-50/50',
    },
    {
      id: 'cleanup',
      path: '/game/cleanup',
      titleKey: 'cleanupTitle',
      icon: '🏡🧹',
      descKey: 'cleanupDesc',
      tag: 'SIMULATION 🌟',
      tagBg: 'bg-purple-100 text-purple-900 border-purple-300 font-extrabold',
      cardBorder: 'border-purple-300 hover:border-purple-500 ring-2 ring-purple-200/60',
      cardBg: 'hover:bg-purple-50/50',
    },
  ];

  const scrollToGames = () => {
    document.getElementById('games-grid')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      
      {/* Hero Banner */}
      <div className="text-center py-6 sm:py-10">
        
        {/* Animated Cute Mosquito Character */}
        <motion.div
          animate={{ y: [-8, 8, -8], rotate: [-4, 4, -4] }}
          transition={{ repeat: Infinity, duration: 2.5, ease: 'easeInOut' }}
          className="text-7xl sm:text-8xl mb-3 select-none inline-block filter drop-shadow-md"
        >
          🦟
        </motion.div>

        <h1 className="text-4xl sm:text-6xl font-black text-slate-900 uppercase tracking-tight font-display mb-2">
          {t('appName')}
        </h1>

        <p className="text-xl sm:text-2xl font-black text-emerald-700 italic mb-6">
          {t('motto')}
        </p>

        {/* Big Bouncy PLAY NOW Button */}
        <motion.button
          onClick={scrollToGames}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="py-4 px-10 rounded-full bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 text-white font-black text-xl shadow-soft-lg hover:shadow-xl inline-flex items-center gap-3 transition-transform cursor-pointer"
        >
          <Play className="w-6 h-6 fill-current" />
          <span>{t('playNow')}</span>
        </motion.button>
      </div>

      {/* Physical Project Connection Card */}
      <div className="my-8 p-6 rounded-3xl bg-white border-2 border-amber-200 shadow-soft-md flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
        <div className="w-16 h-16 rounded-2xl bg-amber-100 border border-amber-300 flex items-center justify-center text-4xl shrink-0">
          🕯️
        </div>
        <div>
          <div className="flex items-center justify-center sm:justify-start gap-2 text-xs font-black uppercase text-amber-800 tracking-wider mb-1">
            <Flame className="w-4 h-4 text-amber-600 fill-current" />
            <span>{t('cspTitle')}</span>
          </div>
          <p className="text-sm text-slate-800 font-bold">
            {t('cspDesc')}
          </p>
          <p className="text-xs text-slate-500 mt-1">
            {t('cspDetail')}
          </p>
        </div>
      </div>

      {/* MINI-GAMES GRID */}
      <div id="games-grid" className="pt-4 mb-12">
        <div className="flex items-center justify-between gap-2 mb-6">
          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 flex items-center gap-2">
              <span>{t('gamesHeader')}</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-600">
              {t('gamesSub')}
            </p>
          </div>

          <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-amber-100 border border-amber-300 text-amber-900 font-black text-xs shrink-0 shadow-sm">
            <Star className="w-4 h-4 fill-current text-amber-500" />
            <span>{stars} {t('stars')}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {miniGames.map((game) => {
            const isCompleted = completedGames.includes(game.id);

            return (
              <Link
                key={game.id}
                to={game.path}
                className={`relative overflow-hidden p-5 rounded-3xl border-2 bg-white ${game.cardBorder} ${game.cardBg} transition-all active:scale-95 group flex items-start justify-between gap-3 shadow-soft-sm hover:shadow-soft-md`}
              >
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full border ${game.tagBg}`}>
                      {game.tag}
                    </span>
                    {isCompleted && (
                      <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                        {t('cleared')}
                      </span>
                    )}
                  </div>

                  <h3 className="text-lg sm:text-xl font-black text-slate-900 group-hover:text-emerald-700 transition-colors">
                    {t(game.titleKey)}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-600 mt-1 line-clamp-2 font-medium">
                    {t(game.descKey)}
                  </p>
                </div>

                <div className="text-5xl group-hover:scale-110 transition-transform shrink-0 pt-2">
                  {game.icon}
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Educational Footer Notice */}
      <div className="p-4 rounded-3xl bg-white border border-slate-200 shadow-soft-sm text-center text-xs text-slate-500 space-y-1">
        <p className="text-slate-700 font-bold flex items-center justify-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>{t('medTitle')}</span>
        </p>
        <p className="text-[11px] text-slate-500 max-w-lg mx-auto">
          {t('medDesc')}
        </p>
      </div>

    </div>
  );
};

