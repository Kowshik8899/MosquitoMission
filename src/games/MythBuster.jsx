import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, RotateCcw, Flame, Sparkles, Check, X } from 'lucide-react';
import { useGame } from '../context/GameContext';
import { getQuestionsForGame } from '../data/questionBank';
import { playPopSound, playWinSound, playOopsSound } from '../utils/audio';

export const MythBuster = () => {
  const { addStars, markGameCompleted, soundEnabled } = useGame();

  const [questions, setQuestions] = useState(() => getQuestionsForGame('myth', 6));
  const [currentIdx, setCurrentIdx] = useState(0);
  const [streak, setStreak] = useState(0);
  
  // Game Action Animation State: 'idle', 'smashing', 'smashed', 'fact_sealed', 'missed'
  const [actionState, setActionState] = useState('idle');
  const [feedback, setFeedback] = useState('');

  const currentItem = questions[currentIdx];

  const handleChoice = (choseFact) => {
    if (actionState !== 'idle') return;

    const isCorrect = choseFact === currentItem.isFact;

    if (isCorrect) {
      if (currentItem.isFact) {
        // Correctly recognized fact
        setActionState('fact_sealed');
        if (soundEnabled) playWinSound();
        setFeedback(`✨ FACT VERIFIED! ${currentItem.fact}`);
      } else {
        // Correctly smashed myth!
        setActionState('smashing');
        if (soundEnabled) playPopSound();
        setTimeout(() => {
          setActionState('smashed');
          if (soundEnabled) playWinSound();
        }, 350);
        setFeedback(`💥 MYTH SMASHED! ${currentItem.fact}`);
      }
      const newStreak = streak + 1;
      setStreak(newStreak);
      addStars(25);
      markGameCompleted('myth');
    } else {
      // Wrong choice
      setActionState('missed');
      setStreak(0);
      if (soundEnabled) playOopsSound();
      setFeedback(`😂 Not quite! It was actually a ${currentItem.correct}! ${currentItem.fact}`);
    }
  };

  const handleNext = () => {
    setActionState('idle');
    setFeedback('');

    if (currentIdx < questions.length - 1) {
      setCurrentIdx(prev => prev + 1);
    } else {
      // Reload fresh questions from question bank
      setQuestions(getQuestionsForGame('myth', 6));
      setCurrentIdx(0);
    }
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-6">
      
      {/* Top Bar: Back & Streak */}
      <div className="flex items-center justify-between gap-3 mb-4">
        <Link
          to="/"
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white border border-slate-200 text-slate-700 text-xs font-bold shadow-soft-sm hover:bg-slate-50 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 text-orange-600" />
          <span>All Games</span>
        </Link>

        {/* Streak Counter */}
        <div className="flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-orange-50 border border-orange-300 text-orange-900 font-extrabold text-xs shadow-soft-sm">
          <Flame className="w-4 h-4 text-orange-500 fill-current animate-bounce" />
          <span>Smash Streak: {streak}</span>
        </div>
      </div>

      {/* Main Light Card */}
      <div className="bg-white rounded-3xl p-5 sm:p-7 border-2 border-orange-200 shadow-soft-lg text-center relative overflow-hidden">
        
        {/* Progress pill */}
        <div className="inline-block px-3 py-1 rounded-full bg-orange-50 border border-orange-200 text-orange-800 font-extrabold text-xs mb-2">
          Statement {currentIdx + 1} of {questions.length} • Myth Smash
        </div>

        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mb-1">
          Myth Smash! 🔨💥
        </h2>
        <p className="text-xs sm:text-slate-600 font-semibold mb-4">
          Is the mosquito’s claim a fake MYTH or real FACT? Smash the myths!
        </p>

        {/* ======================================================== */}
        {/* PHYSICAL GAME ARENA: MOSQUITO + HAMMER + 3D STONE BLOCK */}
        {/* ======================================================== */}
        <div className="relative w-full h-64 bg-gradient-to-b from-amber-50/70 via-orange-50/40 to-yellow-50/50 rounded-3xl border-2 border-orange-100 mb-5 overflow-hidden flex flex-col justify-between items-center p-4 select-none shadow-inner">
          
          {/* Top Row: Sneaky Cartoon Mosquito */}
          <div className="w-full flex items-center justify-between px-4 z-20">
            <div className="flex items-center gap-2">
              <motion.div
                animate={
                  actionState === 'smashed'
                    ? { rotate: [0, -35, 35, 180], y: [-5, -25, 0], scale: 0.85 }
                    : actionState === 'missed'
                    ? { y: [0, -12, 0, -12, 0], rotate: [-10, 10, -10] }
                    : { y: [-3, 3, -3] }
                }
                transition={{
                  repeat: actionState === 'idle' ? Infinity : 0,
                  duration: actionState === 'missed' ? 0.8 : 1.5,
                }}
                className="text-5xl select-none"
              >
                {actionState === 'smashed' ? '😵🦟' : actionState === 'missed' ? '😂🦟' : '🦟'}
              </motion.div>
              <div className="text-left">
                <span className="text-[10px] font-black uppercase text-amber-800 bg-amber-200/80 px-2 py-0.5 rounded-full">
                  Sneaky Mosquito Claims:
                </span>
              </div>
            </div>

            {/* Streak Stars */}
            <div className="flex gap-1 text-amber-400 text-sm">
              {'⭐'.repeat(Math.min(5, Math.max(1, streak)))}
            </div>
          </div>

          {/* ======================================================== */}
          {/* ANIMATED CARTOON HAMMER (Swings down on Smash!) */}
          {/* ======================================================== */}
          <motion.div
            initial={false}
            animate={
              actionState === 'smashing' || actionState === 'smashed'
                ? {
                    x: 0,
                    y: 45,
                    rotate: 45,
                    scale: 1.3,
                  }
                : actionState === 'missed'
                ? {
                    x: 60,
                    y: 20,
                    rotate: -35,
                    opacity: 0.7,
                  }
                : {
                    x: 40,
                    y: -10,
                    rotate: -20,
                    scale: 1,
                  }
            }
            transition={{ type: 'spring', damping: 10, stiffness: 200 }}
            className="absolute top-8 right-12 z-30 pointer-events-none text-6xl filter drop-shadow-lg"
          >
            🔨
          </motion.div>

          {/* ======================================================== */}
          {/* 3D STONE MYTH / FACT BLOCK */}
          {/* Shatters into pieces if Myth Smashed! */}
          {/* ======================================================== */}
          <div className="relative w-full max-w-md z-10 flex flex-col items-center">
            
            {/* The Physical Stone Block */}
            <motion.div
              animate={
                actionState === 'smashed'
                  ? {
                      scale: [1, 1.08, 0.95],
                      rotate: [-2, 2, -2, 0],
                    }
                  : actionState === 'fact_sealed'
                  ? {
                      scale: [1, 1.05, 1],
                    }
                  : {}
              }
              className={`w-full rounded-2xl p-4 border-4 shadow-md transition-all relative overflow-hidden ${
                actionState === 'smashed'
                  ? 'bg-rose-100 border-dashed border-red-500 text-red-950'
                  : actionState === 'fact_sealed'
                  ? 'bg-emerald-100 border-emerald-400 text-emerald-950 ring-4 ring-emerald-300'
                  : 'bg-amber-100/90 border-amber-300 text-amber-950'
              }`}
            >
              {/* Shatter Crack Overlay on Myth Smashed */}
              {actionState === 'smashed' && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="absolute inset-0 bg-red-500/20 backdrop-blur-xs flex items-center justify-center font-black text-2xl text-red-700 pointer-events-none"
                >
                  <span className="bg-white/90 px-4 py-1.5 rounded-full border-2 border-red-500 shadow-md">
                    💥 SHATTERED!
                  </span>
                </motion.div>
              )}

              {/* Fact Gold Seal Overlay on Verified Fact */}
              {actionState === 'fact_sealed' && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute top-2 right-2 px-3 py-1 rounded-full bg-emerald-500 text-white font-black text-xs shadow-md flex items-center gap-1"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>100% FACT! ✨</span>
                </motion.div>
              )}

              {/* Statement Content */}
              <div className="relative z-10">
                <p className="text-sm sm:text-base font-black leading-snug">
                  {currentItem.q}
                </p>
              </div>
            </motion.div>

            {/* Pedestal / Anvil Base */}
            <div className="w-3/4 h-3 bg-gradient-to-r from-amber-800 via-amber-700 to-amber-800 rounded-b-xl shadow-sm -mt-0.5" />
          </div>

          {/* Floor Shadow */}
          <div className="w-64 h-2 bg-amber-900/10 rounded-full blur-xs" />
        </div>

        {/* Feedback / Educational Explainer Banner */}
        {feedback && (
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className={`p-3.5 rounded-2xl border-2 text-xs sm:text-sm font-bold mb-4 leading-relaxed text-left ${
              actionState === 'smashed' || actionState === 'fact_sealed'
                ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
                : 'bg-red-50 border-red-300 text-red-950'
            }`}
          >
            {feedback}
          </motion.div>
        )}

        {/* ======================================================== */}
        {/* BOTTOM: 2 GIANT BUTTONS: 💥 SMASH MYTH vs ✅ CONFIRM FACT */}
        {/* ======================================================== */}
        {actionState === 'idle' ? (
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => handleChoice(false)}
              className="py-4 px-3 rounded-2xl bg-gradient-to-r from-red-500 via-rose-500 to-red-600 hover:from-red-600 hover:to-rose-700 text-white font-black text-base sm:text-lg shadow-md hover:shadow-lg active:scale-95 transition-all flex flex-col items-center justify-center gap-1 group"
            >
              <div className="flex items-center gap-1.5">
                <span className="text-xl group-hover:rotate-12 transition-transform">🔨</span>
                <span>SMASH MYTH</span>
              </div>
              <span className="text-[10px] font-bold opacity-80 uppercase tracking-wider">
                Fake Claim ❌
              </span>
            </button>

            <button
              onClick={() => handleChoice(true)}
              className="py-4 px-3 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 hover:from-emerald-600 hover:to-teal-700 text-white font-black text-base sm:text-lg shadow-md hover:shadow-lg active:scale-95 transition-all flex flex-col items-center justify-center gap-1 group"
            >
              <div className="flex items-center gap-1.5">
                <span className="text-xl group-hover:scale-110 transition-transform">✨</span>
                <span>CONFIRM FACT</span>
              </div>
              <span className="text-[10px] font-bold opacity-80 uppercase tracking-wider">
                True Science ✅
              </span>
            </button>
          </div>
        ) : (
          <button
            onClick={handleNext}
            className="w-full py-4 px-6 rounded-2xl bg-orange-500 hover:bg-orange-600 text-white font-black text-sm sm:text-base shadow-md active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            <span>Next Statement ➔</span>
          </button>
        )}

      </div>
    </div>
  );
};
