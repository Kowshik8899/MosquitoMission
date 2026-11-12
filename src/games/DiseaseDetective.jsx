import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, RotateCcw, Sparkles } from 'lucide-react';
import { useGame } from '../context/GameContext';
import { getQuestionsForGame } from '../data/questionBank';
import { playPopSound, playOopsSound, playWinSound } from '../utils/audio';

export const DiseaseDetective = () => {
  const { addStars, markGameCompleted, soundEnabled } = useGame();

  const [questions, setQuestions] = useState(() => getQuestionsForGame('detective', 5));
  const [questionIdx, setQuestionIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);

  // Hand + Trap position in percentage [0..100] within the game area
  const [handPos, setHandPos] = useState({ x: 50, y: 80 });
  const [isCatching, setIsCatching] = useState(false);
  const [catchResult, setCatchResult] = useState(null); // 'caught', 'missed'
  const [feedbackText, setFeedbackText] = useState('');

  const gameAreaRef = useRef(null);
  const currentQ = questions[questionIdx];

  // 3 Mosquitoes in the game arena
  // Target mosquito is at index 0 (center-top), decoys at 1 and 2
  const mosquitoes = [
    { id: 'target', label: 'Target Mosquito', x: 50, y: 35, emoji: '🦟' },
    { id: 'decoy1', label: 'Common Gnat', x: 22, y: 45, emoji: '🪰' },
    { id: 'decoy2', label: 'Night Fly', x: 78, y: 40, emoji: '🦟' },
  ];

  // Update hand position via touch or mouse move
  const handlePointerMove = (e) => {
    if (!gameAreaRef.current || isCatching || catchResult) return;
    const rect = gameAreaRef.current.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;

    const x = Math.max(15, Math.min(85, ((clientX - rect.left) / rect.width) * 100));
    const y = Math.max(25, Math.min(85, ((clientY - rect.top) / rect.height) * 100));

    setHandPos({ x, y });
  };

  const handleSelectOption = (opt) => {
    if (selectedOption || isCatching || catchResult) return;
    setSelectedOption(opt);
    // Guide player to move hand and trap!
  };

  const handleAttemptTrap = () => {
    if (!selectedOption || isCatching || catchResult) return;
    setIsCatching(true);

    const isCorrectChoice = selectedOption === currentQ.correct;
    // Check if hand/trap is near the target mosquito (x ~ 50, y ~ 35, forgiving range!)
    const isNearTarget = Math.abs(handPos.x - 50) < 28 && Math.abs(handPos.y - 35) < 28;

    setTimeout(() => {
      setIsCatching(false);
      if (isCorrectChoice && isNearTarget) {
        setCatchResult('caught');
        if (soundEnabled) playPopSound();
        addStars(25);
        markGameCompleted('detective');
        setFeedbackText(`CAUGHT! 🎉 ${currentQ.fact}`);
      } else {
        setCatchResult('missed');
        if (soundEnabled) playOopsSound();
        if (!isCorrectChoice) {
          setFeedbackText(`MISS! 🦟💨 Wrong clue match! The mosquito escaped into the trees.`);
        } else {
          setFeedbackText(`MISS! 🦟💨 You had the right clue, but the trap wasn't over the mosquito!`);
        }
      }
    }, 600);
  };

  const handleNext = () => {
    setSelectedOption(null);
    setCatchResult(null);
    setIsCatching(false);
    setHandPos({ x: 50, y: 75 });
    setFeedbackText('');

    if (questionIdx < questions.length - 1) {
      setQuestionIdx(prev => prev + 1);
    } else {
      setQuestions(getQuestionsForGame('detective', 5));
      setQuestionIdx(0);
    }
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-4 min-h-[92vh] flex flex-col justify-between">
      
      {/* TOP: Back Button & Score */}
      <div className="flex items-center justify-between gap-3 mb-3">
        <Link
          to="/"
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white border border-slate-200 text-slate-700 text-xs font-bold shadow-soft-sm hover:bg-slate-50 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 text-emerald-600" />
          <span>All Games</span>
        </Link>

        <span className="px-3.5 py-1 rounded-full bg-emerald-100 border border-emerald-300 text-emerald-900 font-extrabold text-xs">
          Game 2 • Disease Detective
        </span>
      </div>

      {/* MIDDLE: THE ACTUAL GAME ARENA (BIGGEST PART OF SCREEN) */}
      <div
        ref={gameAreaRef}
        onMouseMove={handlePointerMove}
        onTouchMove={handlePointerMove}
        className="relative flex-1 w-full min-h-[300px] sm:min-h-[340px] bg-gradient-to-b from-emerald-50/90 to-teal-50/60 rounded-3xl border-2 border-emerald-200 shadow-soft-lg overflow-hidden flex flex-col items-center justify-between p-4 select-none touch-none"
      >
        {/* Sky / Garden Header note */}
        <div className="text-center z-10">
          <span className="text-xs font-bold text-emerald-800 bg-white/80 px-3 py-1 rounded-full border border-emerald-200 shadow-xs">
            {selectedOption
              ? '👉 Move the trap over the mosquito and tap "SNAP TRAP!"'
              : '👇 Step 1: Tap an answer below, then catch the mosquito!'}
          </span>
        </div>

        {/* Flying Mosquitoes in the Air */}
        <div className="absolute inset-0 pointer-events-none">
          {mosquitoes.map((m) => {
            const isTarget = m.id === 'target';
            return (
              <motion.div
                key={m.id}
                style={{ left: `${m.x}%`, top: `${m.y}%` }}
                animate={
                  catchResult === 'caught' && isTarget
                    ? { scale: [1, 0.7], opacity: [1, 0.8] }
                    : catchResult === 'missed' && isTarget
                    ? { x: [0, 80, 180], y: [0, -60, -120], opacity: 0 }
                    : {
                        x: [0, -12, 12, -8, 0],
                        y: [0, 10, -10, 8, 0],
                        rotate: [0, -6, 6, -4, 0],
                      }
                }
                transition={{
                  repeat: catchResult ? 0 : Infinity,
                  duration: isTarget ? 2.5 : 3.5,
                }}
                className={`absolute -translate-x-1/2 -translate-y-1/2 text-5xl select-none ${
                  isTarget ? 'filter drop-shadow-md' : 'opacity-60 text-4xl'
                }`}
              >
                {m.emoji}
                {isTarget && (
                  <span className="block text-[9px] font-black uppercase text-emerald-700 bg-white/90 px-1.5 py-0.5 rounded-full border border-emerald-200 text-center shadow-xs mt-1">
                    TARGET
                  </span>
                )}
              </motion.div>
            );
          })}
        </div>

        {/* VISIBLE HAND + TRANSPARENT TRAP FOLLOWING TOUCH/MOUSE */}
        <motion.div
          style={{
            left: `${handPos.x}%`,
            top: `${handPos.y}%`,
          }}
          animate={
            isCatching
              ? { scale: [1, 0.9, 1], y: [0, -15, 0] }
              : catchResult === 'caught'
              ? { scale: 1.05 }
              : {}
          }
          className="absolute -translate-x-1/2 -translate-y-1/2 z-20 flex flex-col items-center pointer-events-none"
        >
          {/* Transparent Trap Box: subtle, clear, glass/net feel */}
          <div
            className={`w-28 h-24 rounded-2xl border-2 transition-all flex items-center justify-center relative ${
              catchResult === 'caught'
                ? 'bg-emerald-300/30 border-emerald-500 shadow-lg'
                : catchResult === 'missed'
                ? 'bg-red-200/20 border-red-400'
                : isCatching
                ? 'bg-cyan-300/40 border-cyan-500 shadow-md'
                : 'bg-white/30 border-dashed border-emerald-400/80 shadow-soft-sm backdrop-blur-[2px]'
            }`}
          >
            {/* Visual Mesh / Glass Reflection */}
            <div className="absolute top-1 left-2 right-2 h-1 bg-white/60 rounded-full" />
            
            {catchResult === 'caught' && (
              <span className="text-3xl animate-bounce">🫙</span>
            )}
            
            <span className="text-[10px] font-black uppercase text-emerald-800 bg-white/80 px-2 py-0.5 rounded-md shadow-xs mt-12">
              TRAP
            </span>
          </div>

          {/* Hand Holding the Trap */}
          <div className="text-5xl -mt-2 filter drop-shadow-md select-none">
            ✋
          </div>
        </motion.div>

        {/* Quick Trap Action Trigger Button if option chosen */}
        {selectedOption && !catchResult && (
          <button
            onClick={handleAttemptTrap}
            disabled={isCatching}
            className="z-30 py-2.5 px-6 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white font-black text-sm shadow-md active:scale-95 transition-all flex items-center gap-1.5"
          >
            <span>SNAP TRAP! ✋🫙</span>
          </button>
        )}

        {/* Caught / Missed Result overlay card */}
        {catchResult && (
          <motion.div
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className={`z-30 max-w-sm w-full p-4 rounded-2xl border-2 text-center shadow-lg ${
              catchResult === 'caught'
                ? 'bg-white/95 border-emerald-400 text-emerald-950'
                : 'bg-white/95 border-red-300 text-red-950'
            }`}
          >
            <div className="text-4xl mb-1">
              {catchResult === 'caught' ? '🎉🫙' : '🦟💨'}
            </div>
            <h4 className="text-lg font-black">
              {catchResult === 'caught' ? 'CAUGHT IN TRAP!' : 'MISSED!'}
            </h4>
            <p className="text-xs font-semibold leading-relaxed my-2">
              {feedbackText}
            </p>
            <button
              onClick={handleNext}
              className={`w-full py-2.5 px-4 rounded-xl font-black text-xs text-white shadow-sm active:scale-95 transition-all ${
                catchResult === 'caught' ? 'bg-emerald-500 hover:bg-emerald-600' : 'bg-amber-500 hover:bg-amber-600'
              }`}
            >
              {catchResult === 'caught' ? 'Next Clue! ➔' : 'Try Again! ➔'}
            </button>
          </motion.div>
        )}
      </div>

      {/* BOTTOM: QUESTION + 3 LARGE ANSWER OPTIONS */}
      <div className="mt-4">
        <h3 className="text-sm sm:text-base font-black text-slate-900 mb-3 bg-white p-3.5 rounded-2xl border border-slate-200 shadow-soft-sm text-center leading-snug">
          {currentQ.q}
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          {currentQ.options.map((opt, i) => {
            const isSelected = selectedOption === opt;
            return (
              <button
                key={i}
                onClick={() => handleSelectOption(opt)}
                disabled={!!catchResult || isCatching}
                className={`p-3.5 rounded-2xl border-2 text-left font-bold text-xs sm:text-sm transition-all active:scale-95 shadow-soft-sm flex items-center justify-between ${
                  isSelected
                    ? 'bg-emerald-100 border-emerald-500 text-emerald-950 ring-2 ring-emerald-300'
                    : 'bg-white border-slate-200 hover:border-emerald-300 text-slate-800 hover:bg-emerald-50/40'
                }`}
              >
                <span className="flex-1 pr-1">{opt}</span>
                <span className="w-6 h-6 rounded-full bg-emerald-50 text-emerald-700 font-black text-xs flex items-center justify-center shrink-0 border border-emerald-200">
                  {isSelected ? '✓' : i + 1}
                </span>
              </button>
            );
          })}
        </div>
      </div>

    </div>
  );
};
