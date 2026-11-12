import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, RotateCcw, Heart, Award, Sparkles } from 'lucide-react';
import { useGame } from '../context/GameContext';
import { playWinSound, playPopSound, playClickSound } from '../utils/audio';

const ZONES = [
  {
    id: 'school',
    name: 'Primary School',
    emoji: '🏫',
    fixedEmoji: '🏫✨',
    threat: 'Mosquitoes biting kids during morning recess',
    action: 'Covered water tanks & cleaned playground gutters!',
  },
  {
    id: 'drain',
    name: 'Blocked Canal',
    emoji: '🚰',
    fixedEmoji: '🌊🫧',
    threat: 'Plastic cups and bottles blocking water flow',
    action: 'Volunteers cleared trash! Water now flows swiftly!',
  },
  {
    id: 'homes',
    name: 'Homes & Backyards',
    emoji: '🏠',
    fixedEmoji: '🏡🕯️',
    fixedLabel: 'Light Against Bite',
    threat: 'Open flower saucers and open doorways',
    action: 'Drained all saucers & lit Light Against Bite candles!',
  },
  {
    id: 'park',
    name: 'Community Park',
    emoji: '🌳',
    fixedEmoji: '🌳🌸',
    threat: 'Dozens of discarded soda cans on the lawn',
    action: 'Installed covered recycling bins & planted flowers!',
  }
];

export const NeighborhoodGame = () => {
  const { addStars, markGameCompleted, soundEnabled } = useGame();

  const [fixedZones, setFixedZones] = useState([]);
  const [activeSpeech, setActiveSpeech] = useState('');
  const [isWon, setIsWon] = useState(false);

  const handleFixZone = (zone) => {
    if (fixedZones.includes(zone.id) || isWon) return;

    if (soundEnabled) playPopSound();
    setActiveSpeech(`SAVED! 🎉 ${zone.action}`);

    setFixedZones(prev => {
      const next = [...prev, zone.id];
      if (next.length === ZONES.length) {
        setIsWon(true);
        addStars(50);
        markGameCompleted('neighborhood');
        if (soundEnabled) playWinSound();
      }
      return next;
    });
  };

  const handleRestart = () => {
    setFixedZones([]);
    setActiveSpeech('');
    setIsWon(false);
  };

  const happyPercent = Math.round((fixedZones.length / ZONES.length) * 100);

  return (
    <div className="max-w-xl mx-auto px-4 py-6">
      
      {/* Top Header */}
      <div className="flex items-center justify-between gap-3 mb-6">
        <Link
          to="/"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-800 text-slate-200 text-xs font-bold hover:bg-slate-700 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>All Games</span>
        </Link>

        <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 font-extrabold text-xs">
          Game 8 • Save the Town 👨‍👩‍👧
        </span>
      </div>

      {/* Main Game Stage */}
      <div className="bg-gradient-to-b from-[#112d26] to-[#071612] rounded-3xl p-6 border-2 border-emerald-500/40 shadow-2xl text-center relative overflow-hidden">
        
        <h2 className="text-2xl font-black text-white mb-1">
          Save the Neighborhood! 🏡
        </h2>
        <p className="text-xs text-emerald-300 font-medium mb-6">
          Tap each danger spot to unite the community and kick mosquitoes out!
        </p>

        {/* Live Town Health Meter */}
        <div className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800 mb-6 flex items-center justify-between text-xs">
          <span className="font-bold text-slate-300">
            Town Safety: <strong className="text-emerald-400 font-mono text-sm">{happyPercent}%</strong>
          </span>
          <span className="text-amber-300 font-bold flex items-center gap-1">
            <span>{isWon ? '😊 ALL HAPPY!' : '⚠️ Action Needed'}</span>
          </span>
        </div>

        {/* Dynamic Speech Message */}
        {activeSpeech && (
          <div className="p-3 rounded-xl bg-slate-900/90 border border-emerald-500/40 text-xs text-slate-200 mb-6 font-medium leading-relaxed">
            {activeSpeech}
          </div>
        )}

        {/* Neighborhood Cartoon Zones Grid */}
        <div className="grid grid-cols-2 gap-3.5 mb-6">
          {ZONES.map((zone) => {
            const isFixed = fixedZones.includes(zone.id);

            return (
              <motion.button
                key={zone.id}
                onClick={() => handleFixZone(zone)}
                whileTap={{ scale: 0.95 }}
                className={`p-4 rounded-2xl border-2 text-left transition-all flex flex-col justify-between ${
                  isFixed
                    ? 'bg-emerald-950/70 border-emerald-400 shadow-md shadow-emerald-500/15'
                    : 'bg-slate-900/80 border-slate-700 hover:border-emerald-400'
                }`}
              >
                <div>
                  <div className="text-4xl mb-2">
                    {isFixed ? zone.fixedEmoji : zone.emoji}
                  </div>
                  <h4 className="text-sm font-black text-white">{zone.name}</h4>
                  <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">
                    {isFixed ? zone.action : zone.threat}
                  </p>
                </div>

                <div className="mt-3 pt-2 border-t border-slate-800 text-[10px] font-black uppercase">
                  {isFixed ? (
                    <span className="text-emerald-400">SAFE & CLEAN! ✅</span>
                  ) : (
                    <span className="text-amber-400">TAP TO CLEAN! ➔</span>
                  )}
                </div>
              </motion.button>
            );
          })}
        </div>

        {/* Victory Celebration Card */}
        {isWon && (
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="p-6 rounded-2xl bg-emerald-950/80 border-2 border-emerald-400 text-emerald-200 text-center"
          >
            <div className="text-5xl mb-2">🏆🎉</div>
            <h3 className="text-2xl font-black text-white mb-2">
              YOU SAVED THE NEIGHBORHOOD!
            </h3>
            <div className="grid grid-cols-2 gap-2 max-w-xs mx-auto text-xs font-bold mb-4">
              <span className="p-2 rounded-xl bg-slate-900/60">🌳 Clean Water</span>
              <span className="p-2 rounded-xl bg-slate-900/60">🏠 Safe Homes</span>
              <span className="p-2 rounded-xl bg-slate-900/60">😊 People Happy</span>
              <span className="p-2 rounded-xl bg-slate-900/60">🦟 ZERO BITES!</span>
            </div>

            <p className="text-xs text-slate-200 mb-6">
              When neighbors work together to empty water and spread awareness, everyone stays safe and healthy!
            </p>

            <button
              onClick={handleRestart}
              className="w-full py-3 px-6 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-black text-xs shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Clean Town Again!</span>
            </button>
          </motion.div>
        )}

      </div>
    </div>
  );
};
