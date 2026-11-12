import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, RotateCcw, Droplets, Sparkles } from 'lucide-react';
import { useGame } from '../context/GameContext';
import { getQuestionsForGame } from '../data/questionBank';
import { playSplashSound, playOopsSound, playWinSound } from '../utils/audio';

export const BreedingGround = () => {
  const { addStars, markGameCompleted, soundEnabled } = useGame();

  const [questions, setQuestions] = useState(() => getQuestionsForGame('breeding', 5));
  const [questionIdx, setQuestionIdx] = useState(0);
  // Water level in percent: 10% to 100%
  const [waterLevel, setWaterLevel] = useState(40);
  const [gameState, setGameState] = useState('playing'); // 'playing', 'won', 'hatched'
  const [feedback, setFeedback] = useState('');

  const currentQ = questions[questionIdx];

  // Danger indicator
  const dangerLevel = waterLevel < 35 ? 'safe' : waterLevel < 70 ? 'warning' : 'danger';
  // Floating eggs count based on water height
  const eggCount = waterLevel <= 15 ? 0 : waterLevel < 40 ? 2 : waterLevel < 70 ? 4 : 7;

  const handleChoice = (selectedText) => {
    if (gameState !== 'playing') return;

    const isCorrect = selectedText === currentQ.correct;

    if (isCorrect) {
      if (soundEnabled) playSplashSound();
      // Water level goes down!
      const newWater = Math.max(0, waterLevel - 25);
      setWaterLevel(newWater);

      if (questionIdx >= questions.length - 1 || newWater <= 10) {
        setWaterLevel(0);
        setGameState('won');
        addStars(35);
        markGameCompleted('breeding');
        if (soundEnabled) playWinSound();
        setFeedback(`✨ BREEDING STOPPED! You removed all the standing water!`);
      } else {
        setQuestionIdx(prev => prev + 1);
        setFeedback(`Water removed! 💧⬇️ Eggs disappeared! Great job!`);
      }
    } else {
      if (soundEnabled) playOopsSound();
      // Water level goes up!
      const newWater = Math.min(100, waterLevel + 25);
      setWaterLevel(newWater);

      if (newWater >= 95) {
        setWaterLevel(100);
        setGameState('hatched');
        setFeedback(`OH NO! The bucket overflowed and the mosquito eggs hatched into flying biters! 🦟🦟🦟`);
      } else {
        setFeedback(`Oops! Water is rising! 💧⬆️ More eggs appeared!`);
      }
    }
  };

  const handleRestart = () => {
    setQuestions(getQuestionsForGame('breeding', 5));
    setQuestionIdx(0);
    setWaterLevel(40);
    setGameState('playing');
    setFeedback('');
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-4 min-h-[92vh] flex flex-col justify-between">
      
      {/* TOP: Back & Score / Danger Level */}
      <div className="flex items-center justify-between gap-3 mb-3">
        <Link
          to="/"
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white border border-slate-200 text-slate-700 text-xs font-bold shadow-soft-sm hover:bg-slate-50 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 text-cyan-600" />
          <span>All Games</span>
        </Link>

        {/* Danger Level Pill */}
        <div className={`px-3.5 py-1 rounded-full font-black text-xs border ${
          dangerLevel === 'safe'
            ? 'bg-emerald-100 border-emerald-300 text-emerald-800'
            : dangerLevel === 'warning'
            ? 'bg-amber-100 border-amber-300 text-amber-800'
            : 'bg-red-100 border-red-300 text-red-800 animate-pulse'
        }`}>
          {dangerLevel === 'safe' ? '🟢 SAFE' : dangerLevel === 'warning' ? '🟡 WARNING' : '🔴 DANGER!'}
        </div>
      </div>

      {/* MIDDLE: THE ACTUAL GAME ARENA (BIGGEST PART OF SCREEN) */}
      <div className="relative flex-1 w-full min-h-[300px] sm:min-h-[360px] bg-gradient-to-b from-cyan-50/90 to-sky-50/60 rounded-3xl border-2 border-cyan-200 shadow-soft-lg flex flex-col items-center justify-between p-5 overflow-hidden">
        
        {/* Top status */}
        <div className="flex items-center justify-between w-full z-10 px-2">
          <span className="text-xs font-black uppercase text-cyan-900 bg-white/80 px-3 py-1 rounded-full border border-cyan-200 shadow-xs">
            🪣 Mosquito Water Drop
          </span>
          <span className="text-xs font-mono font-bold text-slate-600 bg-white/80 px-2.5 py-1 rounded-full border border-slate-200">
            Water: {waterLevel}%
          </span>
        </div>

        {/* LARGE CUTE ANIMATED BUCKET */}
        <div className="relative w-56 h-56 flex flex-col items-center justify-end my-auto select-none">
          
          {/* Hatched Mosquitoes Swarm if lost */}
          {gameState === 'hatched' && (
            <motion.div
              initial={{ scale: 0.5, y: 40 }}
              animate={{ scale: [1, 1.25, 1], y: [-30, -60, -50] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              className="absolute -top-8 text-5xl z-30"
            >
              🦟🦟🦟
            </motion.div>
          )}

          {/* Clean sparkles if won */}
          {gameState === 'won' && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute -top-6 text-4xl z-30"
            >
              ✨🪣✨
            </motion.div>
          )}

          {/* Large Bucket Body */}
          <div className="relative w-48 h-52 bg-slate-100 rounded-b-3xl border-4 border-slate-400 overflow-hidden shadow-md flex flex-col justify-end">
            
            {/* Bucket Metal Handle */}
            <div className="absolute -top-10 left-6 right-6 h-20 border-4 border-slate-400 rounded-t-full pointer-events-none" />

            {/* Rising / Falling Blue Water */}
            <motion.div
              animate={{ height: `${waterLevel}%` }}
              transition={{ type: 'spring', damping: 15 }}
              className="w-full bg-gradient-to-t from-cyan-500 via-sky-400 to-sky-300 relative flex items-start justify-center shadow-inner"
            >
              {/* Water Surface Wave */}
              <div className="w-full h-2.5 bg-cyan-200/90 rounded-full" />

              {/* Floating Mosquito Eggs */}
              {eggCount > 0 && gameState !== 'won' && (
                <div className="absolute top-1 flex gap-2 text-sm animate-bounce select-none">
                  {Array.from({ length: eggCount }).map((_, i) => (
                    <span key={i} title="Mosquito Egg">🥚</span>
                  ))}
                </div>
              )}
            </motion.div>

            {/* 100% Dry indicator when water = 0 */}
            {waterLevel === 0 && (
              <div className="absolute inset-0 flex items-center justify-center font-black text-emerald-600 text-sm">
                100% EMPTY & DRY! ✨
              </div>
            )}
          </div>
        </div>

        {/* Small live feedback text */}
        {feedback && gameState === 'playing' && (
          <div className={`p-2 px-4 rounded-full text-xs font-black shadow-xs z-10 ${
            feedback.includes('removed')
              ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
              : 'bg-amber-100 text-amber-900 border border-amber-300'
          }`}>
            {feedback}
          </div>
        )}

        {/* Victory or Game Over Overlay */}
        {gameState !== 'playing' && (
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className={`z-20 max-w-sm w-full p-4 rounded-2xl border-2 text-center shadow-lg ${
              gameState === 'won'
                ? 'bg-white/95 border-emerald-400 text-emerald-950'
                : 'bg-white/95 border-red-300 text-red-950'
            }`}
          >
            <div className="text-4xl mb-1">
              {gameState === 'won' ? '🏆✨' : '🦟💦'}
            </div>
            <h4 className="text-lg font-black">
              {gameState === 'won' ? 'BREEDING STOPPED! YOU WIN!' : 'OH NO! THEY HATCHED!'}
            </h4>
            <p className="text-xs font-semibold my-2">
              {gameState === 'won'
                ? 'You completely emptied the bucket before the eggs could hatch!'
                : 'The water filled the bucket and mosquitoes hatched! Empty water weekly!'}
            </p>
            <button
              onClick={handleRestart}
              className={`w-full py-2.5 px-4 rounded-xl font-black text-xs text-white shadow-sm active:scale-95 transition-all ${
                gameState === 'won' ? 'bg-emerald-500 hover:bg-emerald-600' : 'bg-amber-500 hover:bg-amber-600'
              }`}
            >
              {gameState === 'won' ? 'Drain Again! ➔' : 'Try Again! ➔'}
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
          {currentQ.options.map((opt, i) => (
            <button
              key={i}
              onClick={() => handleChoice(opt)}
              disabled={gameState !== 'playing'}
              className="p-3.5 rounded-2xl bg-white hover:bg-cyan-50 border-2 border-slate-200 hover:border-cyan-400 text-left font-bold text-xs sm:text-sm text-slate-800 transition-all active:scale-95 shadow-soft-sm flex items-center justify-between group"
            >
              <span className="flex-1 pr-1">{opt}</span>
              <span className="w-6 h-6 rounded-full bg-cyan-50 text-cyan-700 font-black text-xs flex items-center justify-center shrink-0 border border-cyan-200 group-hover:bg-cyan-400 group-hover:text-white transition-colors">
                💧
              </span>
            </button>
          ))}
        </div>
      </div>

    </div>
  );
};
