import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, RotateCcw, Sparkles, ShieldCheck, Sun } from 'lucide-react';
import { useGame } from '../context/GameContext';
import { playClickSound, playWinSound } from '../utils/audio';

const SCENE_HAZARDS = [
  {
    id: 'gutter',
    name: 'Roof Gutter',
    x: 18,
    y: 18,
    iconDirty: '🍂',
    iconClean: '✨',
    dirtyLabel: 'Clogged Gutter',
    mosquitoes: 3,
  },
  {
    id: 'bucket',
    name: 'Patio Bucket',
    x: 15,
    y: 58,
    iconDirty: '🪣',
    iconClean: '🔒',
    dirtyLabel: 'Open Rain Bucket',
    mosquitoes: 3,
  },
  {
    id: 'puddle',
    name: 'Lawn Puddle',
    x: 42,
    y: 72,
    iconDirty: '🌊',
    iconClean: '🌸',
    dirtyLabel: 'Stagnant Puddle',
    mosquitoes: 4,
  },
  {
    id: 'tire',
    name: 'Fence Tire',
    x: 78,
    y: 65,
    iconDirty: '🛞',
    iconClean: '🌻',
    dirtyLabel: 'Rain-filled Tire',
    mosquitoes: 3,
  },
  {
    id: 'birdbath',
    name: 'Garden Birdbath',
    x: 75,
    y: 28,
    iconDirty: '🦠',
    iconClean: '🌊',
    dirtyLabel: 'Slimy Birdbath',
    mosquitoes: 3,
  },
  {
    id: 'cans',
    name: 'Soda Cans',
    x: 52,
    y: 38,
    iconDirty: '🥤',
    iconClean: '♻️',
    dirtyLabel: 'Open Cans',
    mosquitoes: 2,
  },
];

export const YardCleanup = () => {
  const { addStars, markGameCompleted, soundEnabled, t } = useGame();
  
  const [clearedIds, setClearedIds] = useState([]);
  const [hoveredId, setHoveredId] = useState(null);
  const [vanishedEffects, setVanishedEffects] = useState([]);
  const [isFinished, setIsFinished] = useState(false);

  const remainingHazards = SCENE_HAZARDS.filter(h => !clearedIds.includes(h.id));

  const handleClean = (hazard) => {
    if (clearedIds.includes(hazard.id)) return;

    if (soundEnabled) playClickSound();

    // Trigger vanish explosion effect for mosquitoes at hazard location
    setVanishedEffects(prev => [...prev, { id: hazard.id + '_' + Date.now(), x: hazard.x, y: hazard.y }]);

    setClearedIds(prev => {
      const next = [...prev, hazard.id];
      if (next.length === SCENE_HAZARDS.length) {
        setIsFinished(true);
        addStars(50);
        markGameCompleted('cleanup');
        if (soundEnabled) playWinSound();
      }
      return next;
    });
  };

  const handleReset = () => {
    setClearedIds([]);
    setHoveredId(null);
    setVanishedEffects([]);
    setIsFinished(false);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      
      {/* Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <Link
          to="/"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-slate-200 text-slate-700 text-xs font-bold shadow-soft-sm hover:bg-slate-50 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 text-emerald-600" />
          <span>{t('allGames')}</span>
        </Link>

        <div className="flex items-center gap-2">
          <span className={`px-3 py-1 rounded-full font-black text-xs border flex items-center gap-1.5 shadow-sm transition-all ${
            isFinished
              ? 'bg-emerald-100 text-emerald-950 border-emerald-300'
              : 'bg-amber-100 text-amber-900 border-amber-300'
          }`}>
            {isFinished ? (
              <>
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>{t('yardSafe')}</span>
              </>
            ) : (
              <>
                <span className="animate-pulse">🦟</span>
                <span>{t('activeHazards')}: {remainingHazards.length}</span>
              </>
            )}
          </span>

          <button
            onClick={handleReset}
            className="p-1.5 rounded-full bg-white border border-slate-200 hover:bg-slate-100 text-slate-600 transition-colors shadow-sm"
            title="Reset Yard"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Visual Arena Card */}
      <div className="bg-white rounded-3xl p-4 sm:p-6 border-2 border-emerald-300 shadow-soft-lg text-center relative overflow-hidden">
        
        <div className="flex items-center justify-between gap-2 mb-3 px-2">
          <div className="text-left">
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2">
              <span>{t('yardTitle')}</span>
            </h2>
            <p className="text-xs text-slate-500 font-semibold">
              {t('yardSub')}
            </p>
          </div>
        </div>

        {/* 2D Backyard Canvas Landscape */}
        <div className="relative w-full aspect-[16/10] sm:aspect-[16/9] rounded-2xl overflow-hidden border-2 border-emerald-400/80 shadow-inner bg-gradient-to-b from-sky-200 via-sky-100 to-emerald-200 select-none">
          
          {/* Sun & Cloud scenery */}
          <div className="absolute top-3 left-4 flex items-center gap-2 text-amber-500 font-black text-xs">
            <Sun className="w-6 h-6 animate-spin-slow text-amber-400 fill-amber-300" />
          </div>

          <motion.div
            animate={{ x: [0, 40, 0] }}
            transition={{ repeat: Infinity, duration: 12, ease: 'easeInOut' }}
            className="absolute top-4 left-1/4 text-white/90 text-2xl"
          >
            ☁️
          </motion.div>

          {/* House Structure */}
          <div className="absolute top-8 left-0 w-1/3 h-48 bg-amber-100/90 border-r-4 border-amber-300 rounded-r-3xl shadow-md">
            <div className="absolute top-0 left-0 right-0 h-6 bg-rose-500 rounded-tr-xl border-b-4 border-rose-700" />
            <div className="absolute top-12 left-8 w-12 h-12 bg-sky-200 border-2 border-amber-700 rounded-lg flex items-center justify-center text-xs">
              🪟
            </div>
          </div>

          {/* Fence */}
          <div className="absolute top-28 left-1/3 right-0 h-16 flex items-end justify-around border-b-2 border-amber-700/30">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="w-4 sm:w-6 h-14 bg-amber-200 border-x border-t border-amber-400 rounded-t-sm shadow-xs" />
            ))}
          </div>

          {/* Garden Tree */}
          <div className="absolute top-16 right-6 flex flex-col items-center">
            <div className="w-20 h-20 bg-emerald-500 rounded-full border-4 border-emerald-600 shadow-md flex items-center justify-center text-3xl">
              🌳
            </div>
            <div className="w-4 h-12 bg-amber-800 rounded-b-md" />
          </div>

          {/* Lawn Terrain */}
          <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-b from-emerald-400 via-emerald-500 to-green-600 border-t-4 border-emerald-300">
            <div className="flex justify-around text-emerald-200 text-xs pt-1 opacity-70">
              <span>🌱</span>
              <span>🌿</span>
              <span>🌱</span>
              <span>🌿</span>
            </div>
          </div>

          {/* Vanish Particle Burst Animation */}
          {vanishedEffects.map(effect => (
            <motion.div
              key={effect.id}
              initial={{ scale: 0.5, opacity: 1 }}
              animate={{ scale: 2.2, opacity: 0 }}
              transition={{ duration: 0.8 }}
              className="absolute z-40 transform -translate-x-1/2 -translate-y-1/2 text-2xl pointer-events-none"
              style={{ left: `${effect.x}%`, top: `${effect.y}%` }}
            >
              💥💨✨
            </motion.div>
          ))}

          {/* Flying Butterflies when 100% clean */}
          {isFinished && (
            <>
              <motion.span
                animate={{ x: [0, 140, 0], y: [0, -40, 0] }}
                transition={{ repeat: Infinity, duration: 6, ease: 'easeInOut' }}
                className="absolute text-3xl top-1/3 left-1/4 z-30"
              >
                🦋
              </motion.span>
              <motion.span
                animate={{ x: [0, -120, 0], y: [0, -30, 0] }}
                transition={{ repeat: Infinity, duration: 7, ease: 'easeInOut' }}
                className="absolute text-3xl top-1/2 right-1/4 z-30"
              >
                🦋
              </motion.span>
            </>
          )}

          {/* 6 Tiny Hazard Targets with Visible Roaming Mosquitoes */}
          {SCENE_HAZARDS.map((hazard) => {
            const isCleared = clearedIds.includes(hazard.id);
            const isHovered = hoveredId === hazard.id;

            return (
              <div
                key={hazard.id}
                className="absolute z-30 transform -translate-x-1/2 -translate-y-1/2"
                style={{
                  left: `${hazard.x}%`,
                  top: `${hazard.y}%`,
                }}
              >
                {/* Visible Roaming Mosquitoes around active hazard */}
                {!isCleared && (
                  <motion.div
                    className="absolute inset-0 pointer-events-none z-20"
                    animate={{
                      scale: isHovered ? 1.4 : 1.0,
                    }}
                    transition={{ type: 'spring', damping: 15 }}
                  >
                    {Array.from({ length: hazard.mosquitoes }).map((_, mIdx) => (
                      <motion.span
                        key={mIdx}
                        animate={{
                          x: [
                            (mIdx === 0 ? -16 : mIdx === 1 ? 16 : 0),
                            (mIdx === 0 ? 18 : mIdx === 1 ? -18 : 12),
                            (mIdx === 0 ? -16 : mIdx === 1 ? 16 : 0),
                          ],
                          y: [
                            (mIdx === 0 ? -14 : mIdx === 1 ? 14 : -20),
                            (mIdx === 0 ? 16 : mIdx === 1 ? -16 : 14),
                            (mIdx === 0 ? -14 : mIdx === 1 ? 14 : -20),
                          ],
                          rotate: [-15, 15, -15],
                        }}
                        transition={{
                          repeat: Infinity,
                          repeatType: 'mirror',
                          duration: 1.2 + mIdx * 0.4,
                          ease: 'easeInOut',
                        }}
                        className={`absolute font-black filter drop-shadow-sm transition-all ${
                          isHovered ? 'text-xl sm:text-2xl scale-125' : 'text-sm sm:text-base'
                        }`}
                        style={{
                          left: `${(mIdx - 1) * 14}px`,
                          top: `${(mIdx % 2 === 0 ? -18 : 12)}px`,
                        }}
                      >
                        🦟
                      </motion.span>
                    ))}
                  </motion.div>
                )}

                {/* Tiny Interactive Target Badge */}
                <motion.div
                  onClick={() => handleClean(hazard)}
                  onMouseEnter={() => setHoveredId(hazard.id)}
                  onMouseLeave={() => setHoveredId(null)}
                  whileHover={{ scale: isCleared ? 1.1 : 1.4 }}
                  whileTap={{ scale: 0.9 }}
                  className={`relative cursor-pointer flex flex-col items-center justify-center transition-all ${
                    isCleared
                      ? 'w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-emerald-100 border-2 border-emerald-400 text-emerald-950 shadow-sm'
                      : isHovered
                      ? 'w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-white border-3 border-amber-500 shadow-xl ring-4 ring-amber-400/60 scale-125'
                      : 'w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white/90 border-2 border-amber-400 shadow-md ring-2 ring-amber-300/40'
                  }`}
                >
                  <span className={`filter drop-shadow-sm transition-all ${
                    isHovered ? 'text-2xl sm:text-3xl' : 'text-lg sm:text-xl'
                  }`}>
                    {isCleared ? hazard.iconClean : hazard.iconDirty}
                  </span>

                  {/* Hover Tooltip Label */}
                  {isHovered && !isCleared && (
                    <motion.div
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="absolute -top-9 bg-slate-900 text-white text-[10px] font-black px-2 py-0.5 rounded-full pointer-events-none shadow-lg whitespace-nowrap flex items-center gap-1 z-40"
                    >
                      <Sparkles className="w-3 h-3 text-amber-400" />
                      <span>CLICK TO CLEAN!</span>
                    </motion.div>
                  )}
                </motion.div>

              </div>
            );
          })}

        </div>

        {/* Victory Celebration Overlay */}
        <AnimatePresence>
          {isFinished && (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="mt-5 p-6 rounded-3xl bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 text-white text-center shadow-xl border-4 border-white"
            >
              <div className="text-5xl mb-2">🎉🌸🦋✨</div>
              <h3 className="text-2xl sm:text-3xl font-black mb-1 uppercase tracking-wide">
                ALL MOSQUITOES VANISHED!
              </h3>
              <p className="text-xs sm:text-sm font-bold text-emerald-100 mb-4 max-w-md mx-auto">
                You hovered over the problem spots and cleaned every stagnant water source. The yard is 100% clean!
              </p>

              <button
                onClick={handleReset}
                className="py-3 px-8 rounded-full bg-white hover:bg-emerald-50 text-emerald-950 font-black text-sm shadow-md active:scale-95 transition-all inline-flex items-center gap-2 cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Play Backyard Patrol Again</span>
              </button>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
};

export default YardCleanup;
