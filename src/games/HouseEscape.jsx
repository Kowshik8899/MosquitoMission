import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, RotateCcw, Lock, CheckCircle2, ShieldCheck, Sparkles, Fan, Droplet } from 'lucide-react';
import { useGame } from '../context/GameContext';
import { playPopSound, playWinSound } from '../utils/audio';

const HOUSE_PROOF_ITEMS = [
  {
    id: 'win1',
    name: 'Living Room Window',
    x: 18, // % from left
    y: 20, // % from top
    iconOpen: '🪟💨',
    iconSealed: '🪟🔒',
    openLabel: 'Open Window',
    sealedLabel: 'Mesh Screen Installed',
  },
  {
    id: 'door1',
    name: 'Front Entry Door',
    x: 82,
    y: 20,
    iconOpen: '🚪🏃',
    iconSealed: '🚪🔒',
    openLabel: 'Unlatched Door',
    sealedLabel: 'Door Latched & Sealed',
  },
  {
    id: 'vase',
    name: 'Indoor Flower Vase',
    x: 35,
    y: 45,
    iconOpen: '🏺💦',
    iconSealed: '🏺✨',
    openLabel: 'Stagnant Vase Water',
    sealedLabel: 'Fresh Dry Vase',
  },
  {
    id: 'fan',
    name: 'Indoor Air Fan',
    x: 65,
    y: 45,
    iconOpen: '💨❌',
    iconSealed: '🌀💨',
    openLabel: 'Fan Off',
    sealedLabel: 'Air Current Active',
  },
  {
    id: 'win2',
    name: 'Bedroom Window',
    x: 18,
    y: 80,
    iconOpen: '🪟💨',
    iconSealed: '🪟🔒',
    openLabel: 'Open Window',
    sealedLabel: 'Mesh Screen Installed',
  },
  {
    id: 'door2',
    name: 'Back Porch Door',
    x: 82,
    y: 80,
    iconOpen: '🚪🏃',
    iconSealed: '🚪🔒',
    openLabel: 'Open Doorway',
    sealedLabel: 'Back Door Locked',
  },
];

export const HouseEscape = () => {
  const { addStars, markGameCompleted, soundEnabled } = useGame();

  const [sealedIds, setSealedIds] = useState([]);
  const [mosquitoAction, setMosquitoAction] = useState('center'); // 'center', 'bonk', 'trapped'
  const [lastBonkId, setLastBonkId] = useState(null);
  const [isFinished, setIsFinished] = useState(false);

  const remainingCount = HOUSE_PROOF_ITEMS.length - sealedIds.length;

  const handleSeal = (item) => {
    if (sealedIds.includes(item.id)) return;

    if (soundEnabled) playPopSound();

    setLastBonkId(item.id);
    setMosquitoAction('bonk');

    setSealedIds(prev => {
      const next = [...prev, item.id];
      
      if (next.length === HOUSE_PROOF_ITEMS.length) {
        setTimeout(() => {
          setMosquitoAction('trapped');
          setIsFinished(true);
          addStars(45);
          markGameCompleted('escape');
          if (soundEnabled) playWinSound();
        }, 800);
      } else {
        setTimeout(() => {
          setMosquitoAction('center');
        }, 1000);
      }
      return next;
    });
  };

  const handleReset = () => {
    setSealedIds([]);
    setMosquitoAction('center');
    setLastBonkId(null);
    setIsFinished(false);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      
      {/* Top Header Navigation */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <Link
          to="/"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-slate-200 text-slate-700 text-xs font-bold shadow-soft-sm hover:bg-slate-50 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 text-emerald-600" />
          <span>All Games</span>
        </Link>

        {/* Real-time Proofing Status */}
        <div className="flex items-center gap-2">
          <span className={`px-3 py-1 rounded-full font-black text-xs border flex items-center gap-1.5 shadow-sm transition-all ${
            isFinished
              ? 'bg-emerald-100 text-emerald-950 border-emerald-300'
              : 'bg-indigo-100 text-indigo-950 border-indigo-300'
          }`}>
            {isFinished ? (
              <>
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>HOUSE 100% CONTAINED & PROOFED! 🌟</span>
              </>
            ) : (
              <>
                <Lock className="w-4 h-4 text-indigo-600" />
                <span>Proofing Barriers: {remainingCount} Unsealed</span>
              </>
            )}
          </span>

          <button
            onClick={handleReset}
            className="p-1.5 rounded-full bg-white border border-slate-200 hover:bg-slate-100 text-slate-600 transition-colors shadow-sm"
            title="Reset Simulation"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Interactive Visual House Floorplan Card */}
      <div className="bg-white rounded-3xl p-4 sm:p-6 border-2 border-indigo-200 shadow-soft-lg text-center relative overflow-hidden">
        
        <div className="flex items-center justify-between gap-2 mb-3 px-2">
          <div className="text-left">
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2">
              <span>🏠 Interactive House Proofing Simulation</span>
            </h2>
            <p className="text-xs text-slate-500 font-semibold">
              Click directly on windows, doors, vases & fans to seal escape routes and trap the mosquito!
            </p>
          </div>

          <div className="hidden sm:flex items-center gap-1 text-xs font-bold text-indigo-700 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-200 shrink-0">
            <span>✨ Direct Cursor Reactivity</span>
          </div>
        </div>

        {/* 2D House Floorplan Arena */}
        <div className="relative w-full aspect-[16/10] sm:aspect-[16/9] rounded-2xl overflow-hidden border-4 border-amber-300 shadow-inner bg-gradient-to-b from-amber-50 via-orange-50/40 to-amber-100/60 p-4 select-none">
          
          {/* Room Dividers & Wall Grid */}
          <div className="absolute inset-4 border-2 border-dashed border-amber-400/60 rounded-xl grid grid-cols-2 grid-rows-2 gap-2 p-2 bg-white/40">
            
            {/* Living Room (Top-Left) */}
            <div className="border border-amber-200/80 rounded-lg p-2 flex flex-col justify-between text-left">
              <span className="text-[10px] font-black text-amber-900/60 uppercase">🛋️ Living Room</span>
              <span className="text-2xl opacity-40">🛋️</span>
            </div>

            {/* Entryway & Dining (Top-Right) */}
            <div className="border border-amber-200/80 rounded-lg p-2 flex flex-col justify-between text-right">
              <span className="text-[10px] font-black text-amber-900/60 uppercase">🚪 Entry Foyer</span>
              <span className="text-2xl opacity-40">🪴</span>
            </div>

            {/* Bedroom (Bottom-Left) */}
            <div className="border border-amber-200/80 rounded-lg p-2 flex flex-col justify-between text-left">
              <span className="text-[10px] font-black text-amber-900/60 uppercase">🛏️ Bedroom</span>
              <span className="text-2xl opacity-40">🛏️</span>
            </div>

            {/* Back Porch (Bottom-Right) */}
            <div className="border border-amber-200/80 rounded-lg p-2 flex flex-col justify-between text-right">
              <span className="text-[10px] font-black text-amber-900/60 uppercase">🌿 Back Porch</span>
              <span className="text-2xl opacity-40">🪑</span>
            </div>

          </div>

          {/* Animated Mosquito flying or getting trapped in center */}
          <div className="absolute inset-0 pointer-events-none z-20 flex items-center justify-center">
            {mosquitoAction === 'trapped' ? (
              <motion.div
                initial={{ scale: 2 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', damping: 10 }}
                className="flex flex-col items-center justify-center"
              >
                <div className="relative">
                  <span className="text-6xl filter drop-shadow-md">🪤</span>
                  <span className="absolute top-1 left-4 text-3xl">🦟</span>
                </div>
                <span className="text-xs font-black bg-emerald-200 text-emerald-950 px-3 py-1 rounded-full mt-1 border border-emerald-400">
                  TRAPPED & CONTAINED!
                </span>
              </motion.div>
            ) : (
              <motion.div
                className="text-4xl filter drop-shadow-md relative"
                animate={
                  mosquitoAction === 'bonk'
                    ? {
                        x: [-20, 30, -10, 0],
                        y: [-15, 20, -5, 0],
                        rotate: [0, 45, -45, 0],
                      }
                    : {
                        x: [-25, 25, -25],
                        y: [-15, 15, -15],
                        rotate: [-12, 12, -12],
                      }
                }
                transition={{
                  repeat: mosquitoAction === 'center' ? Infinity : 0,
                  duration: mosquitoAction === 'bonk' ? 0.7 : 2,
                  ease: 'easeInOut',
                }}
              >
                🦟
                {mosquitoAction === 'bonk' && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1.5, opacity: 0 }}
                    transition={{ duration: 0.5 }}
                    className="absolute -top-3 -right-3 text-2xl"
                  >
                    💥🔒
                  </motion.span>
                )}
              </motion.div>
            )}
          </div>

          {/* 6 Direct Interactive Clickable House Proofing Elements */}
          {HOUSE_PROOF_ITEMS.map((item) => {
            const isSealed = sealedIds.includes(item.id);

            return (
              <motion.div
                key={item.id}
                onClick={() => handleSeal(item)}
                whileHover={{ scale: isSealed ? 1.05 : 1.25 }}
                whileTap={{ scale: 0.9 }}
                className={`absolute z-30 transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group flex flex-col items-center justify-center p-2 rounded-2xl transition-shadow ${
                  isSealed
                    ? 'bg-emerald-100/90 border-2 border-emerald-400 text-emerald-950 shadow-sm'
                    : 'bg-white/95 border-2 border-indigo-400 shadow-lg ring-4 ring-indigo-300/40 hover:ring-indigo-400/80'
                }`}
                style={{
                  left: `${item.x}%`,
                  top: `${item.y}%`,
                }}
              >
                {/* Visual Icon */}
                <span className="text-3xl sm:text-4xl filter drop-shadow-md group-hover:rotate-6 transition-transform">
                  {isSealed ? item.iconSealed : item.iconOpen}
                </span>

                {/* Status Label */}
                <span className={`text-[10px] sm:text-xs font-black px-2 py-0.5 rounded-full mt-1 border whitespace-nowrap shadow-xs ${
                  isSealed
                    ? 'bg-emerald-200 text-emerald-950 border-emerald-300'
                    : 'bg-indigo-100 text-indigo-950 border-indigo-300 group-hover:bg-indigo-400 group-hover:text-white'
                }`}>
                  {isSealed ? 'SEALED ✓' : item.openLabel}
                </span>

                {/* Cursor Hover Action Tooltip */}
                {!isSealed && (
                  <div className="absolute -top-7 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 text-white text-[10px] font-black px-2.5 py-1 rounded-full pointer-events-none shadow-md whitespace-nowrap flex items-center gap-1 z-40">
                    <Sparkles className="w-3 h-3 text-amber-400" />
                    <span>CLICK TO SEAL!</span>
                  </div>
                )}
              </motion.div>
            );
          })}

        </div>

        {/* Completion Card when house is 100% proofed */}
        <AnimatePresence>
          {isFinished && (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="mt-6 p-6 rounded-3xl bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 text-white text-center shadow-xl border-4 border-white"
            >
              <div className="text-5xl mb-2">🎉🏠🪤✨</div>
              <h3 className="text-2xl sm:text-3xl font-black mb-1 uppercase tracking-wide">
                HOUSE 100% CONTAINED & PROOFED!
              </h3>
              <p className="text-xs sm:text-sm font-bold text-emerald-100 mb-4 max-w-md mx-auto">
                You directly clicked and sealed all windows, doors, indoor water vases, and air fans! The mosquito is safely contained without any bites or sprays.
              </p>

              <button
                onClick={handleReset}
                className="py-3 px-8 rounded-full bg-white hover:bg-emerald-50 text-emerald-950 font-black text-sm shadow-md active:scale-95 transition-all inline-flex items-center gap-2 cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Re-run House Proofing Simulation</span>
              </button>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
};

export default HouseEscape;
