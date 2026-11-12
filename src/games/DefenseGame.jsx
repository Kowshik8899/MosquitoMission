import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, RotateCcw, Wind } from 'lucide-react';
import { useGame } from '../context/GameContext';
import { getQuestionsForGame } from '../data/questionBank';
import { playPopSound, playWinSound, playOopsSound } from '../utils/audio';

// Custom SVG Electric Table Fan component (Clearly recognizable!)
const ElectricTableFan = ({ speedLevel }) => {
  // Rotation duration based on speed
  const rotationDuration = speedLevel === 1 ? 1.4 : speedLevel === 2 ? 0.6 : speedLevel === 3 ? 0.25 : 0.12;

  return (
    <div className="relative w-28 h-36 sm:w-32 sm:h-40 flex flex-col items-center justify-end select-none">
      
      {/* Fan Head (Cage + Blades) */}
      <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-full border-4 border-slate-700 bg-slate-100 shadow-md flex items-center justify-center overflow-hidden">
        
        {/* Fan Grill Wire Lines */}
        <div className="absolute inset-0 flex items-center justify-center opacity-40">
          <div className="w-full h-0.5 bg-slate-600" />
          <div className="absolute w-0.5 h-full bg-slate-600" />
          <div className="absolute w-16 h-16 rounded-full border border-slate-600" />
        </div>

        {/* Rotating 3-Blade Fan Propeller */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: rotationDuration, ease: 'linear' }}
          className="relative w-20 h-20 flex items-center justify-center"
        >
          {/* Blade 1 (Up) */}
          <div className="absolute top-1 w-5 h-8 bg-sky-500 rounded-full shadow-xs origin-bottom" />
          {/* Blade 2 (Down-Right) */}
          <div className="absolute bottom-2 right-2 w-5 h-8 bg-sky-500 rounded-full shadow-xs origin-top rotate-[120deg]" />
          {/* Blade 3 (Down-Left) */}
          <div className="absolute bottom-2 left-2 w-5 h-8 bg-sky-500 rounded-full shadow-xs origin-top rotate-[240deg]" />
          
          {/* Center Hub */}
          <div className="w-5 h-5 rounded-full bg-slate-800 z-10 border-2 border-white shadow-xs" />
        </motion.div>
      </div>

      {/* Fan Neck / Motor Mount */}
      <div className="w-3 h-5 bg-slate-600 z-10" />

      {/* Fan Stand Neck */}
      <div className="w-4 h-6 bg-slate-500" />

      {/* Fan Base */}
      <div className="w-20 h-4 bg-slate-700 rounded-full border-2 border-slate-600 shadow-md flex items-center justify-center">
        {/* Speed buttons on base */}
        <div className="flex gap-1.5">
          <span className={`w-2 h-2 rounded-full ${speedLevel >= 1 ? 'bg-sky-400' : 'bg-slate-500'}`} />
          <span className={`w-2 h-2 rounded-full ${speedLevel >= 2 ? 'bg-sky-400' : 'bg-slate-500'}`} />
          <span className={`w-2 h-2 rounded-full ${speedLevel >= 3 ? 'bg-sky-400' : 'bg-slate-500'}`} />
        </div>
      </div>
    </div>
  );
};

export const DefenseGame = () => {
  const { addStars, markGameCompleted, soundEnabled } = useGame();

  const [questions, setQuestions] = useState(() => getQuestionsForGame('fan', 5));
  const [questionIdx, setQuestionIdx] = useState(0);
  // Fan speed: 1 (Slow), 2 (Medium), 3 (Fast), 4 (Max blown away)
  const [speedLevel, setSpeedLevel] = useState(2);
  // Mosquito position from left (28% near fan, 52% middle, 78% right near person)
  const [mosquitoLeft, setMosquitoLeft] = useState(50);
  const [gameState, setGameState] = useState('playing'); // 'playing', 'won', 'lost'
  const [feedback, setFeedback] = useState('');

  const currentQ = questions[questionIdx];

  // Danger distance indicator
  const dangerLevel = mosquitoLeft < 45 ? 'safe' : mosquitoLeft < 68 ? 'caution' : 'danger';

  const handleChoice = (selectedText) => {
    if (gameState !== 'playing') return;

    const isCorrect = selectedText === currentQ.correct;

    if (isCorrect) {
      if (soundEnabled) playPopSound();
      const newSpeed = Math.min(4, speedLevel + 1);
      setSpeedLevel(newSpeed);

      // Push mosquito backward to the left!
      const newPos = Math.max(18, mosquitoLeft - 28);
      setMosquitoLeft(newPos);

      if (questionIdx >= questions.length - 1 || newSpeed >= 4) {
        setMosquitoLeft(-30); // flies off-screen!
        setGameState('won');
        addStars(30);
        markGameCompleted('fan');
        if (soundEnabled) playWinSound();
        setFeedback('WHOOSH! 💨💨💨 Maximum Fan Power! The mosquito got blown completely away!');
      } else {
        setQuestionIdx(prev => prev + 1);
        setFeedback('WHOOSH! 🌀💨 Fan speed increased! Mosquito pushed backward!');
      }
    } else {
      if (soundEnabled) playOopsSound();
      const newSpeed = Math.max(1, speedLevel - 1);
      setSpeedLevel(newSpeed);

      // Mosquito creeps closer to the person on the right!
      const newPos = Math.min(84, mosquitoLeft + 25);
      setMosquitoLeft(newPos);

      if (newPos >= 78) {
        setGameState('lost');
        setFeedback('Too close! 🦟 The mosquito reached the person! Turn up the airflow next time!');
      } else {
        setFeedback('Too slow! 💨 The fan slowed down and the mosquito moved closer!');
      }
    }
  };

  const handleRestart = () => {
    setQuestions(getQuestionsForGame('fan', 5));
    setQuestionIdx(0);
    setSpeedLevel(2);
    setMosquitoLeft(50);
    setGameState('playing');
    setFeedback('');
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-4 min-h-[92vh] flex flex-col justify-between">
      
      {/* TOP: Back Button & Danger Gauge */}
      <div className="flex items-center justify-between gap-3 mb-3">
        <Link
          to="/"
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white border border-slate-200 text-slate-700 text-xs font-bold shadow-soft-sm hover:bg-slate-50 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 text-sky-600" />
          <span>All Games</span>
        </Link>

        {/* Distance Indicator */}
        <div className={`px-3.5 py-1 rounded-full font-black text-xs border ${
          dangerLevel === 'safe'
            ? 'bg-emerald-100 border-emerald-300 text-emerald-800'
            : dangerLevel === 'caution'
            ? 'bg-amber-100 border-amber-300 text-amber-800'
            : 'bg-red-100 border-red-300 text-red-800 animate-pulse'
        }`}>
          {dangerLevel === 'safe' ? '🟢 SAFE' : dangerLevel === 'caution' ? '🟡 CAUTION' : '🔴 DANGER!'}
        </div>
      </div>

      {/* MIDDLE: THE ACTUAL GAME ARENA (BIGGEST PART OF SCREEN) */}
      <div className="relative flex-1 w-full min-h-[280px] sm:min-h-[340px] bg-gradient-to-b from-sky-50 to-blue-50/70 rounded-3xl border-2 border-sky-200 shadow-soft-lg flex flex-col items-center justify-between p-4 overflow-hidden select-none">
        
        {/* Status top bar inside arena */}
        <div className="flex items-center justify-between w-full z-10 px-2">
          <span className="text-xs font-black uppercase text-sky-900 bg-white/80 px-3 py-1 rounded-full border border-sky-200 shadow-xs">
            🌀 Mosquito vs Fan
          </span>
          <span className="text-xs font-black text-sky-700 bg-white/80 px-2.5 py-1 rounded-full border border-slate-200">
            Speed: {speedLevel === 1 ? 'Slow 🌀' : speedLevel === 2 ? 'Medium 🌀🌀' : 'Fast 🌀🌀🌀'}
          </span>
        </div>

        {/* LOGICAL LAYOUT: [FAN]  →→→  [MOSQUITO]  →→→  [PERSON] */}
        <div className="relative w-full flex-1 flex items-center justify-between px-2 sm:px-6 my-auto">
          
          {/* LEFT: HOUSEHOLD ELECTRIC TABLE FAN (Facing right toward mosquito) */}
          <div className="relative z-10 flex flex-col items-center">
            <ElectricTableFan speedLevel={speedLevel} />
          </div>

          {/* VISIBLE WIND STREAMLINES BLOWING TOWARD MOSQUITO */}
          <div className="absolute left-28 sm:left-36 top-1/2 -translate-y-1/2 z-10 pointer-events-none flex flex-col gap-2">
            <motion.div
              animate={{ x: [0, 40, 80], opacity: [0, 0.9, 0] }}
              transition={{ repeat: Infinity, duration: speedLevel === 1 ? 1.2 : 0.5, ease: 'linear' }}
              className="text-sky-400 font-black text-2xl tracking-tighter"
            >
              ❯❯❯❯
            </motion.div>
            <motion.div
              animate={{ x: [0, 50, 90], opacity: [0, 0.8, 0] }}
              transition={{ repeat: Infinity, duration: speedLevel === 1 ? 1.1 : 0.45, delay: 0.15, ease: 'linear' }}
              className="text-sky-300 font-black text-xl tracking-tighter"
            >
              ❯❯❯❯❯
            </motion.div>
            <motion.div
              animate={{ x: [0, 35, 70], opacity: [0, 0.7, 0] }}
              transition={{ repeat: Infinity, duration: speedLevel === 1 ? 1.3 : 0.55, delay: 0.3, ease: 'linear' }}
              className="text-sky-400 font-black text-lg tracking-tighter"
            >
              ❯❯❯
            </motion.div>
          </div>

          {/* CENTER: FLYING MOSQUITO (Pushed backward or inching forward) */}
          <motion.div
            style={{ left: `${mosquitoLeft}%` }}
            animate={{
              y: [-6, 6, -6],
              rotate: gameState === 'won' ? -45 : [-6, 6, -6],
            }}
            transition={{ repeat: Infinity, duration: 1.2 }}
            className="absolute z-20 text-5xl select-none filter drop-shadow-md"
          >
            {gameState === 'won' ? '🦟💨' : '🦟'}
          </motion.div>

          {/* RIGHT: PERSON RELAXING BEHIND THE MOSQUITO */}
          <div className="relative z-10 flex flex-col items-center">
            <div className="w-18 h-24 sm:w-20 sm:h-28 flex flex-col items-center justify-end">
              <div className="text-5xl select-none mb-1">
                {gameState === 'lost' ? '😱' : gameState === 'won' ? '😎' : '🙂'}
              </div>
              <div className="w-16 h-8 bg-sky-500 rounded-t-2xl border-2 border-white shadow-xs flex items-center justify-center text-[10px] font-black text-white">
                Buddy
              </div>
            </div>
          </div>

        </div>

        {/* Small live feedback banner */}
        {feedback && gameState === 'playing' && (
          <div className={`p-2 px-4 rounded-full text-xs font-black shadow-xs z-10 ${
            feedback.includes('WHOOSH')
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
            className={`z-30 max-w-sm w-full p-4 rounded-2xl border-2 text-center shadow-lg ${
              gameState === 'won'
                ? 'bg-white/95 border-emerald-400 text-emerald-950'
                : 'bg-white/95 border-red-300 text-red-950'
            }`}
          >
            <div className="text-4xl mb-1">
              {gameState === 'won' ? '🏆💨' : '🦟😱'}
            </div>
            <h4 className="text-lg font-black">
              {gameState === 'won' ? 'FLY AWAY! YOU WIN!' : 'TOO CLOSE! BITTEN!'}
            </h4>
            <p className="text-xs font-semibold my-2">
              {gameState === 'won'
                ? 'Your electric table fan wind blew the mosquito completely away! Air turbulence stops mosquitoes from landing.'
                : 'The fan slowed down and the mosquito reached Buddy. Keep strong airflow to stay safe!'}
            </p>
            <button
              onClick={handleRestart}
              className={`w-full py-2.5 px-4 rounded-xl font-black text-xs text-white shadow-sm active:scale-95 transition-all ${
                gameState === 'won' ? 'bg-emerald-500 hover:bg-emerald-600' : 'bg-amber-500 hover:bg-amber-600'
              }`}
            >
              {gameState === 'won' ? 'Blow Away Again! ➔' : 'Try Again! ➔'}
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
              className="p-3.5 rounded-2xl bg-white hover:bg-sky-50 border-2 border-slate-200 hover:border-sky-400 text-left font-bold text-xs sm:text-sm text-slate-800 transition-all active:scale-95 shadow-soft-sm flex items-center justify-between group"
            >
              <span className="flex-1 pr-1">{opt}</span>
              <span className="w-6 h-6 rounded-full bg-sky-50 text-sky-700 font-black text-xs flex items-center justify-center shrink-0 border border-sky-200 group-hover:bg-sky-400 group-hover:text-white transition-colors">
                🌀
              </span>
            </button>
          ))}
        </div>
      </div>

    </div>
  );
};
