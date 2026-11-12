import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, RotateCcw, Leaf, Sparkles, CheckCircle2 } from 'lucide-react';
import { useGame } from '../context/GameContext';
import { getQuestionsForGame } from '../data/questionBank';
import { playPopSound, playWinSound, playOopsSound } from '../utils/audio';

export const EcoGame = () => {
  const { addStars, markGameCompleted, soundEnabled } = useGame();

  // 4 rounds of eco-cleaning to turn the whole yard into a clean blooming sanctuary
  const [questions, setQuestions] = useState(() => getQuestionsForGame('eco', 4));
  const [questionIdx, setQuestionIdx] = useState(0);

  // Cleaned zones count: 0 (dirty puddles everywhere) to 4 (100% clean blooming yard)
  const [cleanedZones, setCleanedZones] = useState(0);
  const [gameState, setGameState] = useState('playing'); // 'playing', 'won'
  const [feedback, setFeedback] = useState('');

  const currentQ = questions[questionIdx];

  const handleChoice = (selectedText) => {
    if (gameState !== 'playing') return;

    const isCorrect = selectedText === currentQ.correct;

    if (isCorrect) {
      if (soundEnabled) playPopSound();
      const newCleaned = cleanedZones + 1;
      setCleanedZones(newCleaned);

      if (newCleaned >= 4 || questionIdx >= questions.length - 1) {
        setCleanedZones(4);
        setGameState('won');
        addStars(35);
        markGameCompleted('eco');
        if (soundEnabled) playWinSound();
        setFeedback('🏆 ECO HERO! All standing water eliminated! Garden is blooming & zero mosquitoes remain! 🌸✨');
      } else {
        setFeedback('🌱 GOOD CHOICE! Water removed & flowers bloomed! Mosquitoes flew away! 💧→✨🌸');
        setQuestionIdx(prev => prev + 1);
      }
    } else {
      if (soundEnabled) playOopsSound();
      setFeedback('💧 Try a safer choice! Chemical runoff or stagnant water leaves mosquitoes buzzing!');
    }
  };

  const handleRestart = () => {
    setQuestions(getQuestionsForGame('eco', 4));
    setQuestionIdx(0);
    setCleanedZones(0);
    setGameState('playing');
    setFeedback('');
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-6">
      
      {/* Top Bar: Back & Eco Health Meter */}
      <div className="flex items-center justify-between gap-3 mb-4">
        <Link
          to="/"
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white border border-slate-200 text-slate-700 text-xs font-bold shadow-soft-sm hover:bg-slate-50 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 text-emerald-600" />
          <span>All Games</span>
        </Link>

        {/* Eco Health Meter */}
        <div className="flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-emerald-50 border border-emerald-300 text-emerald-900 font-extrabold text-xs shadow-soft-sm">
          <Leaf className="w-4 h-4 text-emerald-600 fill-current animate-pulse" />
          <span>Yard Cleanliness: {cleanedZones * 25}%</span>
        </div>
      </div>

      {/* Main Light Card */}
      <div className="bg-white rounded-3xl p-5 sm:p-7 border-2 border-emerald-200 shadow-soft-lg text-center relative overflow-hidden">
        
        {/* Progress pill */}
        <div className="inline-block px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 font-extrabold text-xs mb-2">
          Step {questionIdx + 1} of {questions.length} • Eco Yard Clean-Up
        </div>

        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mb-1">
          Eco Hero 🌱🏡
        </h2>
        <p className="text-xs sm:text-slate-600 font-semibold mb-4">
          Choose eco-safe actions to dry up standing water and restore the sunny garden!
        </p>

        {/* ======================================================== */}
        {/* PHYSICAL GAME ARENA: SUNNY YARD + HOUSE + WATER HAZARDS */}
        {/* ======================================================== */}
        <div className="relative w-full h-64 bg-gradient-to-b from-sky-100/70 via-sky-50 to-emerald-50 rounded-3xl border-2 border-emerald-100 mb-5 overflow-hidden flex flex-col justify-between p-3 select-none shadow-inner">
          
          {/* Top Sky: Sun, Clouds, House */}
          <div className="flex justify-between items-start z-10 px-2">
            {/* Friendly House */}
            <div className="flex items-center gap-1.5 bg-white/80 backdrop-blur-xs px-3 py-1.5 rounded-2xl border border-slate-200 shadow-sm">
              <span className="text-3xl">🏠</span>
              <div className="text-left">
                <span className="text-[11px] font-black text-slate-800 block">Clean Home</span>
                <span className="text-[9px] font-bold text-emerald-600">Zero-Bite Yard</span>
              </div>
            </div>

            {/* Sun & Butterflies */}
            <div className="flex items-center gap-2">
              {cleanedZones >= 2 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1, y: [-2, 2, -2] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                  className="text-2xl"
                >
                  🦋
                </motion.span>
              )}
              <span className="text-4xl filter drop-shadow-sm">☀️</span>
            </div>
          </div>

          {/* ======================================================== */}
          {/* MIDDLE / GROUND: 4 VISUAL YARD SPOTS (TRANSFORM FROM HAZARD TO BLOOM) */}
          {/* ======================================================== */}
          <div className="grid grid-cols-4 gap-2 z-10 my-auto">
            
            {/* Spot 1: Standing Puddle -> Turned into Clean Gravel Flowerbed */}
            <div className={`p-2 rounded-2xl border-2 transition-all flex flex-col items-center justify-center ${
              cleanedZones >= 1
                ? 'bg-emerald-100/90 border-emerald-400 text-emerald-900 shadow-sm'
                : 'bg-amber-100/80 border-amber-300 text-amber-900'
            }`}>
              <span className="text-2xl mb-1">
                {cleanedZones >= 1 ? '🌸✨' : '💧🦟'}
              </span>
              <span className="text-[9px] font-black uppercase">
                {cleanedZones >= 1 ? 'Puddle Cleared' : 'Stagnant Puddle'}
              </span>
            </div>

            {/* Spot 2: Uncovered Bucket -> Turned into Upturned Dry Barrel with Plant */}
            <div className={`p-2 rounded-2xl border-2 transition-all flex flex-col items-center justify-center ${
              cleanedZones >= 2
                ? 'bg-emerald-100/90 border-emerald-400 text-emerald-900 shadow-sm'
                : 'bg-amber-100/80 border-amber-300 text-amber-900'
            }`}>
              <span className="text-2xl mb-1">
                {cleanedZones >= 2 ? '🪴✨' : '🪣🦟'}
              </span>
              <span className="text-[9px] font-black uppercase">
                {cleanedZones >= 2 ? 'Bucket Dried' : 'Open Bucket'}
              </span>
            </div>

            {/* Spot 3: Clogged Tire -> Removed, Grass Sprouted */}
            <div className={`p-2 rounded-2xl border-2 transition-all flex flex-col items-center justify-center ${
              cleanedZones >= 3
                ? 'bg-emerald-100/90 border-emerald-400 text-emerald-900 shadow-sm'
                : 'bg-amber-100/80 border-amber-300 text-amber-900'
            }`}>
              <span className="text-2xl mb-1">
                {cleanedZones >= 3 ? '🌻🌱' : '🛞🦟'}
              </span>
              <span className="text-[9px] font-black uppercase">
                {cleanedZones >= 3 ? 'Recycled' : 'Old Wet Tire'}
              </span>
            </div>

            {/* Spot 4: Citronella Garden / Natural Candle Zone */}
            <div className={`p-2 rounded-2xl border-2 transition-all flex flex-col items-center justify-center ${
              cleanedZones >= 4
                ? 'bg-emerald-100/90 border-emerald-400 text-emerald-900 shadow-sm'
                : 'bg-amber-100/80 border-amber-300 text-amber-900'
            }`}>
              <span className="text-2xl mb-1">
                {cleanedZones >= 4 ? '🕯️🌿' : '🪴🦟'}
              </span>
              <span className="text-[9px] font-black uppercase">
                {cleanedZones >= 4 ? 'Citronella Zone' : 'Plant Saucer'}
              </span>
            </div>

          </div>

          {/* Bottom Grass Lawn with Healthy Green Border */}
          <div className="w-full bg-emerald-500 h-8 rounded-2xl border-2 border-emerald-600 shadow-sm flex items-center justify-around px-4 text-white text-xs font-bold z-10">
            <span>🌱 Healthy Grass</span>
            <span>🌳 Shady Trees</span>
            <span>🌸 Sweet Blossoms</span>
          </div>

        </div>

        {/* Feedback Banner */}
        {feedback && (
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className={`p-3 rounded-2xl border text-xs sm:text-sm font-bold mb-4 leading-relaxed ${
              feedback.includes('GOOD') || feedback.includes('HERO')
                ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                : 'bg-amber-50 border-amber-300 text-amber-800'
            }`}
          >
            {feedback}
          </motion.div>
        )}

        {/* ======================================================== */}
        {/* BOTTOM: QUESTION + 3 LARGE TOUCH ANSWER BUTTONS */}
        {/* ======================================================== */}
        {gameState === 'playing' ? (
          <div>
            <div className="bg-emerald-50/70 p-4 rounded-2xl border border-emerald-200/80 mb-4 text-left">
              <span className="text-[10px] font-black uppercase text-emerald-700 tracking-wider block mb-1">
                Question {questionIdx + 1} • Green Choice
              </span>
              <h3 className="text-sm sm:text-base font-black text-slate-900 leading-snug">
                {currentQ.q}
              </h3>
            </div>

            <div className="space-y-2.5">
              {currentQ.options.map((opt, i) => (
                <button
                  key={i}
                  onClick={() => handleChoice(opt)}
                  className="w-full p-4 rounded-2xl bg-white hover:bg-emerald-50 border-2 border-slate-200 hover:border-emerald-400 text-left font-bold text-xs sm:text-sm text-slate-800 transition-all active:scale-98 shadow-soft-sm hover:shadow-md flex items-center justify-between group"
                >
                  <span className="flex-1 pr-3 leading-relaxed">{opt}</span>
                  <span className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 font-black text-xs flex items-center justify-center group-hover:bg-emerald-500 group-hover:text-white transition-colors shrink-0">
                    🌱
                  </span>
                </button>
              ))}
            </div>
          </div>
        ) : (
          /* VICTORY OVERLAY */
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="p-6 rounded-2xl bg-emerald-50 border-2 border-emerald-300 text-emerald-950"
          >
            <div className="text-5xl mb-2 select-none">🏆🌱🌸✨</div>
            <h4 className="text-2xl font-black mb-2">
              YOU ARE AN ECO HERO!
            </h4>
            <p className="text-xs sm:text-sm mb-5 leading-relaxed font-semibold">
              All 4 standing water zones have been eliminated safely without toxic chemical fogging! The yard is green, dragonflies are thriving, and mosquitoes have nowhere to lay eggs!
            </p>

            <button
              onClick={handleRestart}
              className="w-full py-3.5 px-6 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-black text-sm shadow-md active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Clean Up Again!</span>
            </button>
          </motion.div>
        )}

      </div>
    </div>
  );
};
