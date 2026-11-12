import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, RotateCcw, Shield, CheckCircle2 } from 'lucide-react';
import { useGame } from '../context/GameContext';
import { getQuestionsForGame } from '../data/questionBank';
import { playPopSound, playWinSound, playOopsSound } from '../utils/audio';

export const MosquitoNet = () => {
  const { addStars, markGameCompleted, soundEnabled } = useGame();

  // 4 rounds of questions to completely lower the 4-sided net around the bed
  const [questions, setQuestions] = useState(() => getQuestionsForGame('net', 4));
  const [questionIdx, setQuestionIdx] = useState(0);
  
  // Net closure level: 0 (fully raised / open), 1, 2, 3, 4 (fully enclosed around bed)
  const [netStage, setNetStage] = useState(0);
  
  // Mosquito state: 'approaching', 'bounced', 'too_close', 'won', 'lost'
  const [mosquitoState, setMosquitoState] = useState('approaching');
  const [wrongTries, setWrongTries] = useState(0); // Max 3 misses before mosquito reaches sleeper
  const [gameState, setGameState] = useState('playing'); // 'playing', 'won', 'lost'
  const [feedback, setFeedback] = useState('');

  const currentQ = questions[questionIdx];

  // Danger calculation: 0 = safe, 1 = warning, 2+ = danger
  const dangerLevel = wrongTries === 0 ? 'safe' : wrongTries === 1 ? 'warning' : 'danger';

  const handleChoice = (selectedText) => {
    if (gameState !== 'playing') return;

    const isCorrect = selectedText === currentQ.correct;

    if (isCorrect) {
      if (soundEnabled) playPopSound();
      const nextStage = netStage + 1;
      setNetStage(nextStage);
      setMosquitoState('bounced');

      if (nextStage >= 4 || questionIdx >= questions.length - 1) {
        setNetStage(4);
        setGameState('won');
        setMosquitoState('won');
        addStars(30);
        markGameCompleted('net');
        if (soundEnabled) playWinSound();
        setFeedback('✨ BED PROTECTED! The mosquito net is fully closed and sealed! Mosquito flew away! 😴💤');
      } else {
        setFeedback('SAFE! 🕸️⬇️ Net curtains dropped further down! Mosquito bounced away!');
        // Reset mosquito after bounce animation
        setTimeout(() => {
          setMosquitoState('approaching');
          setQuestionIdx(prev => prev + 1);
        }, 1200);
      }
    } else {
      if (soundEnabled) playOopsSound();
      const newWrong = wrongTries + 1;
      setWrongTries(newWrong);
      setMosquitoState('too_close');

      if (newWrong >= 3) {
        setGameState('lost');
        setFeedback('Oops! The net was left wide open! Always close your bed net in time! 🛏️');
      } else {
        setFeedback('Oops! Net stayed open! Mosquito crept closer to the bed! 🦟→');
        setTimeout(() => {
          setMosquitoState('approaching');
        }, 1200);
      }
    }
  };

  const handleRestart = () => {
    setQuestions(getQuestionsForGame('net', 4));
    setQuestionIdx(0);
    setNetStage(0);
    setWrongTries(0);
    setMosquitoState('approaching');
    setGameState('playing');
    setFeedback('');
  };

  // Percent of net descent: stage 0 = 15% (at canopy top), 1 = 40%, 2 = 65%, 3 = 85%, 4 = 100% (fully tucked)
  const netHeightPercent = [18, 42, 68, 88, 100][netStage];

  return (
    <div className="max-w-xl mx-auto px-4 py-6">
      
      {/* Top Bar: Back & Danger Meter */}
      <div className="flex items-center justify-between gap-3 mb-4">
        <Link
          to="/"
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white border border-slate-200 text-slate-700 text-xs font-bold shadow-soft-sm hover:bg-slate-50 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 text-indigo-600" />
          <span>All Games</span>
        </Link>

        {/* Danger Status Indicator */}
        <div className={`px-3.5 py-1 rounded-full font-black text-xs border flex items-center gap-1.5 shadow-soft-sm ${
          dangerLevel === 'safe'
            ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
            : dangerLevel === 'warning'
            ? 'bg-amber-50 border-amber-300 text-amber-800'
            : 'bg-red-50 border-red-300 text-red-800 animate-pulse'
        }`}>
          <span>{dangerLevel === 'safe' ? '🟢 SAFE' : dangerLevel === 'warning' ? '🟡 WARNING' : '🔴 DANGER!'}</span>
          <span className="text-[10px] opacity-75 font-semibold">({4 - netStage} Net Steps Left)</span>
        </div>
      </div>

      {/* Main Light Card */}
      <div className="bg-white rounded-3xl p-5 sm:p-7 border-2 border-indigo-200 shadow-soft-lg text-center relative overflow-hidden">
        
        {/* Progress pill */}
        <div className="inline-block px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 font-extrabold text-xs mb-2">
          Step {questionIdx + 1} of {questions.length} • Protect the Sleeper
        </div>

        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mb-1">
          Mosquito & Net 🛏️🕸️
        </h2>
        <p className="text-xs sm:text-slate-600 font-semibold mb-4">
          Lower the canopy net to safely enclose the bed before the mosquito gets close!
        </p>

        {/* ======================================================== */}
        {/* PHYSICAL GAME ARENA: BED + SLEEPER + CANOPY NET + MOSQUITO */}
        {/* ======================================================== */}
        <div className="relative w-full h-64 bg-gradient-to-b from-sky-50 via-indigo-50/50 to-amber-50/40 rounded-3xl border-2 border-indigo-100 mb-5 overflow-hidden flex flex-col justify-end items-center select-none shadow-inner">
          
          {/* Ceiling Canopy Hook & Frame Header */}
          <div className="absolute top-2 w-72 h-4 bg-amber-800/80 rounded-full border-2 border-amber-900 shadow-sm flex items-center justify-around z-30">
            <div className="w-2 h-2 rounded-full bg-amber-300" />
            <span className="text-[9px] font-black uppercase tracking-wider text-amber-100">
              Canopy Bed Frame
            </span>
            <div className="w-2 h-2 rounded-full bg-amber-300" />
          </div>

          {/* 4 Wooden Corner Posts of the Bed Frame */}
          <div className="absolute top-4 w-72 h-48 flex justify-between pointer-events-none z-10 px-2">
            {/* Left Bed Post */}
            <div className="w-2.5 h-full bg-gradient-to-r from-amber-700 to-amber-900 rounded-sm shadow-sm" />
            {/* Right Bed Post */}
            <div className="w-2.5 h-full bg-gradient-to-r from-amber-700 to-amber-900 rounded-sm shadow-sm" />
          </div>

          {/* ======================================================== */}
          {/* THE PHYSICAL MOSQUITO NET (Curtains that Lower from Canopy) */}
          {/* Visually connected to canopy frame & encloses the bed */}
          {/* ======================================================== */}
          <motion.div
            initial={false}
            animate={{
              height: `${netHeightPercent}%`,
              opacity: 0.95,
            }}
            transition={{ type: 'spring', damping: 16, stiffness: 120 }}
            className="absolute top-4 w-72 bg-gradient-to-b from-sky-100/85 via-white/80 to-indigo-100/90 border-x-4 border-b-4 border-indigo-400/90 rounded-b-2xl z-25 shadow-lg backdrop-blur-xs flex flex-col justify-between overflow-hidden"
            style={{
              backgroundImage: 'radial-gradient(#6366f1 1px, transparent 1px)',
              backgroundSize: '12px 12px',
            }}
          >
            {/* Top Net Ruffle / Hanging Trim */}
            <div className="w-full h-3 bg-indigo-300/80 flex items-center justify-around">
              <div className="text-[10px] text-indigo-900">🕸️</div>
              <div className="text-[10px] text-indigo-900">🕸️</div>
              <div className="text-[10px] text-indigo-900">🕸️</div>
            </div>

            {/* Middle Net Mesh Watermark / Seal status */}
            <div className="flex-1 flex items-center justify-center pointer-events-none">
              {netStage >= 4 ? (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="px-3 py-1 rounded-full bg-emerald-500/90 text-white font-black text-xs shadow-md border border-white flex items-center gap-1"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>100% SEALED & TUCKED! ✨</span>
                </motion.div>
              ) : (
                <div className="text-indigo-400/60 font-black text-[11px] tracking-wide">
                  FINE INSECT MESH
                </div>
              )}
            </div>

            {/* Bottom Weighted Edge / Tucking Hem */}
            <div className={`w-full py-1 text-center font-black text-[10px] uppercase transition-colors ${
              netStage >= 4 
                ? 'bg-emerald-500 text-white' 
                : 'bg-indigo-400 text-white'
            }`}>
              {netStage === 0 ? 'Net Open (Tied Up)' : netStage >= 4 ? 'Tucked Under Mattress 🔒' : 'Net Lowering ⬇️'}
            </div>
          </motion.div>

          {/* ======================================================== */}
          {/* COZY BED WITH SLEEPING PERSON (Center of Screen) */}
          {/* ======================================================== */}
          <div className="relative z-20 flex flex-col items-center mb-3">
            {/* Pillow and Sleeping Face */}
            <div className="relative flex items-center justify-center -mb-2">
              {/* Fluffy Pillow */}
              <div className="w-28 h-10 bg-white rounded-full border-2 border-slate-200 shadow-sm flex items-center justify-center" />
              {/* Sleeping Person Emoji */}
              <span className="absolute text-4xl select-none">
                😴
              </span>
              {/* Floating "Zzz" bubble */}
              <motion.span
                animate={{ y: [-2, -10, -2], opacity: [0.6, 1, 0.6] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="absolute -top-4 right-1 text-indigo-600 font-black text-xs"
              >
                z Z Z
              </motion.span>
            </div>

            {/* Bed Mattress & Cozy Warm Quilt */}
            <div className="w-64 h-18 bg-gradient-to-r from-indigo-500 via-indigo-600 to-blue-600 rounded-2xl border-4 border-white shadow-md flex flex-col justify-center px-4 text-white">
              <div className="flex items-center justify-between text-xs font-black">
                <span className="flex items-center gap-1">
                  <span>🛏️</span>
                  <span>Cozy Mattress</span>
                </span>
                <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-full font-bold">
                  Warm & Safe
                </span>
              </div>
              <div className="w-full h-1.5 bg-white/30 rounded-full mt-2" />
            </div>

            {/* Bed Wooden Legs */}
            <div className="w-56 flex justify-between px-4 -mt-1">
              <div className="w-3 h-4 bg-amber-900 rounded-b-md shadow-sm" />
              <div className="w-3 h-4 bg-amber-900 rounded-b-md shadow-sm" />
            </div>
          </div>

          {/* ======================================================== */}
          {/* ANIMATED MOSQUITO: APPROACHES, BONKS ON NET, OR ESCAPES */}
          {/* ======================================================== */}
          <motion.div
            className="absolute z-40 text-4xl select-none filter drop-shadow-md"
            animate={
              mosquitoState === 'won'
                ? { x: 180, y: -90, opacity: 0, scale: 0.5 }
                : mosquitoState === 'bounced'
                ? {
                    x: [30, -10, 80, 110],
                    y: [-10, -30, -10, 0],
                    rotate: [0, -35, 45, 180],
                  }
                : mosquitoState === 'too_close'
                ? { x: 15, y: -10, rotate: 10, scale: 1.2 }
                : {
                    // Normal hovering near right side of bed
                    x: wrongTries === 0 ? [80, 70, 80] : wrongTries === 1 ? [45, 35, 45] : [15, 5, 15],
                    y: [-4, 6, -4],
                    rotate: [-8, 8, -8],
                  }
            }
            transition={{
              repeat: mosquitoState === 'approaching' ? Infinity : 0,
              duration: mosquitoState === 'bounced' ? 0.9 : 1.4,
            }}
            style={{
              top: '70px',
              right: '25px',
            }}
          >
            🦟
            {/* Cartoon Hit / Bonk Star effect on bounce */}
            {mosquitoState === 'bounced' && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1.5, opacity: 0 }}
                transition={{ duration: 0.6 }}
                className="absolute -top-3 -left-3 text-2xl"
              >
                💥✨
              </motion.span>
            )}
          </motion.div>

        </div>

        {/* Feedback Banner */}
        {feedback && (
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className={`p-3 rounded-2xl border text-xs sm:text-sm font-bold mb-4 leading-relaxed ${
              feedback.includes('SAFE') || feedback.includes('PROTECTED')
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
            <div className="bg-indigo-50/70 p-4 rounded-2xl border border-indigo-200/80 mb-4 text-left">
              <span className="text-[10px] font-black uppercase text-indigo-700 tracking-wider block mb-1">
                Question {questionIdx + 1} • Sleep Protection
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
                  className="w-full p-4 rounded-2xl bg-white hover:bg-indigo-50 border-2 border-slate-200 hover:border-indigo-400 text-left font-bold text-xs sm:text-sm text-slate-800 transition-all active:scale-98 shadow-soft-sm hover:shadow-md flex items-center justify-between group"
                >
                  <span className="flex-1 pr-3 leading-relaxed">{opt}</span>
                  <span className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-800 font-black text-xs flex items-center justify-center group-hover:bg-indigo-500 group-hover:text-white transition-colors shrink-0">
                    🕸️
                  </span>
                </button>
              ))}
            </div>
          </div>
        ) : (
          /* VICTORY OR TRY AGAIN OVERLAY */
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className={`p-6 rounded-2xl border-2 ${
              gameState === 'won'
                ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
                : 'bg-red-50 border-red-300 text-red-950'
            }`}
          >
            <div className="text-5xl mb-2 select-none">
              {gameState === 'won' ? '🛏️🕸️😴' : '🦟💨'}
            </div>
            <h4 className="text-xl font-black mb-2">
              {gameState === 'won' ? 'BED PROTECTED! ZERO BITES!' : 'MOSQUITO GOT TOO CLOSE!'}
            </h4>
            <p className="text-xs sm:text-sm mb-5 leading-relaxed font-semibold">
              {gameState === 'won'
                ? 'The mosquito bounced against the tight mesh net and flew away! A tucked bed net provides 100% safe, chemical-free protection against night-biting malaria mosquitoes.'
                : 'The net was not lowered in time. Always tuck your bed net securely before sleeping to keep yourself safe!'}
            </p>

            <button
              onClick={handleRestart}
              className={`w-full py-3.5 px-6 rounded-2xl font-black text-sm flex items-center justify-center gap-2 shadow-md active:scale-95 transition-all ${
                gameState === 'won'
                  ? 'bg-emerald-500 hover:bg-emerald-600 text-white'
                  : 'bg-amber-500 hover:bg-amber-600 text-white'
              }`}
            >
              <RotateCcw className="w-4 h-4" />
              <span>{gameState === 'won' ? 'Protect Again!' : 'Try Again!'}</span>
            </button>
          </motion.div>
        )}

      </div>
    </div>
  );
};
