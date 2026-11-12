import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, RotateCcw, Sparkles } from 'lucide-react';
import { useGame } from '../context/GameContext';
import { getQuestionsForGame } from '../data/questionBank';
import { playCrunchSound, playSplashSound, playOopsSound } from '../utils/audio';

export const BiscuitTea = () => {
  const { addStars, markGameCompleted, soundEnabled } = useGame();

  const [questions, setQuestions] = useState(() => getQuestionsForGame('biscuit', 5));
  const [questionIdx, setQuestionIdx] = useState(0);
  const [dipProgress, setDipProgress] = useState(0); // 0 (safe) to 100 (in tea)
  const [gameState, setGameState] = useState('playing'); // 'playing', 'saved', 'splashed'
  const [factText, setFactText] = useState('');

  const currentQ = questions[questionIdx];

  // Timer loop that slowly dips the biscuit
  useEffect(() => {
    if (gameState !== 'playing') return;

    const timer = setInterval(() => {
      setDipProgress(prev => {
        if (prev >= 98) {
          handleSplash();
          return 100;
        }
        return prev + 1.0; // ~20 seconds (slower, child-friendly pace)
      });
    }, 200);

    return () => clearInterval(timer);
  }, [gameState, questionIdx]);

  const handleSplash = () => {
    setGameState('splashed');
    if (soundEnabled) playSplashSound();
    setFactText('SPLASH! 💦 The biscuit got too soggy and plunged into the tea! Answer fast to save it!');
  };

  const handleChoice = (selectedText) => {
    if (gameState !== 'playing') return;

    const isCorrect = selectedText === currentQ.correct;

    if (isCorrect) {
      setGameState('saved');
      if (soundEnabled) playCrunchSound();
      addStars(30);
      markGameCompleted('biscuit');
      setFactText(`CRUNCH! 😋 ${currentQ.fact}`);
    } else {
      if (soundEnabled) playOopsSound();
      // Drop biscuit deeper on wrong answer
      setDipProgress(prev => Math.min(95, prev + 15));
    }
  };

  const handleNextOrRetry = () => {
    if (gameState === 'saved') {
      if (questionIdx < questions.length - 1) {
        setQuestionIdx(prev => prev + 1);
        setDipProgress(0);
        setGameState('playing');
        setFactText('');
      } else {
        // Fetch new randomized set
        setQuestions(getQuestionsForGame('biscuit', 5));
        setQuestionIdx(0);
        setDipProgress(0);
        setGameState('playing');
        setFactText('');
      }
    } else {
      // Retry
      setDipProgress(0);
      setGameState('playing');
      setFactText('');
    }
  };

  const biscuitY = (dipProgress / 100) * 125;

  return (
    <div className="max-w-xl mx-auto px-4 py-6">
      
      {/* Top Header */}
      <div className="flex items-center justify-between gap-3 mb-5">
        <Link
          to="/"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-slate-200 text-slate-700 text-xs font-bold shadow-soft-sm hover:bg-slate-50 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 text-emerald-600" />
          <span>All Games</span>
        </Link>

        <span className="px-3.5 py-1 rounded-full bg-amber-100 border border-amber-300 text-amber-900 font-extrabold text-xs">
          Game 1 • Biscuit Battle ☕🍪
        </span>
      </div>

      {/* Main Fun Card (LIGHT THEME) */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-amber-200 shadow-soft-lg text-center relative overflow-hidden">
        
        {/* Question progress pill */}
        <div className="inline-block px-3 py-1 rounded-full bg-slate-100 text-slate-600 font-extrabold text-xs mb-2">
          Biscuit Challenge {questionIdx + 1} of {questions.length}
        </div>

        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mb-1">
          Save the Biscuit! 🍪
        </h2>
        <p className="text-xs sm:text-sm text-amber-700 font-semibold mb-6">
          Answer before the biscuit absorbs the hot tea and falls in!
        </p>

        {/* Visual Biscuit & Steaming Tea Stage */}
        <div className="relative w-64 h-64 mx-auto mb-6 flex flex-col items-center justify-between">
          
          {/* Thread holding biscuit */}
          <div className="w-1.5 bg-amber-400 h-8 rounded-full" />

          {/* Animated Dipping Biscuit */}
          <motion.div
            style={{ y: biscuitY }}
            animate={
              gameState === 'splashed'
                ? { y: 155, rotate: 30, opacity: 0 }
                : gameState === 'saved'
                ? { y: -25, scale: [1, 1.25, 1] }
                : {}
            }
            transition={{ type: 'spring', damping: 15 }}
            className="relative z-10"
          >
            <div className={`w-24 h-24 rounded-full flex flex-col items-center justify-center font-black text-3xl shadow-lg border-4 transition-colors ${
              dipProgress > 60
                ? 'bg-[#8c5738] border-[#5e351e] text-amber-100' // Soggy
                : 'bg-[#f6b472] border-[#c97f35] text-amber-950' // Crisp golden
            }`}>
              {gameState === 'saved' ? '😋' : gameState === 'splashed' ? '😱' : '🍪'}
              <span className="text-[10px] uppercase font-black tracking-wider">
                {dipProgress > 60 ? 'SOGGY!' : 'CRISP'}
              </span>
            </div>
          </motion.div>

          {/* Steaming Tea Cup */}
          <div className="relative z-20">
            {/* Steam */}
            <div className="flex justify-center gap-2 -mb-2 text-slate-400 text-sm animate-bounce opacity-80">
              <span>♨️</span>
              <span>♨️</span>
            </div>

            {/* Cup */}
            <div className="w-44 h-28 bg-gradient-to-r from-rose-500 via-red-500 to-rose-600 rounded-b-3xl border-4 border-white shadow-xl relative flex items-center justify-center">
              {/* Tea Liquid inside */}
              <div className="absolute top-2 left-2 right-2 h-6 bg-[#4a2613] rounded-full border border-amber-950/40 shadow-inner flex items-center justify-center">
                <span className="text-[10px] text-amber-200/90 font-bold">HOT TEA</span>
              </div>
              
              {/* Cup handle */}
              <div className="absolute -right-5 top-5 w-8 h-12 border-4 border-rose-500 rounded-r-2xl bg-white/20" />

              <span className="text-3xl mt-4">☕</span>
            </div>
          </div>
        </div>

        {/* Biscuit Dryness Progress Bar */}
        <div className="max-w-xs mx-auto mb-6">
          <div className="flex justify-between text-xs font-bold text-slate-600 mb-1">
            <span>Biscuit Dryness</span>
            <span className={dipProgress > 70 ? 'text-red-600 font-mono font-black animate-pulse' : 'text-amber-600 font-mono font-bold'}>
              {100 - Math.round(dipProgress)}%
            </span>
          </div>
          <div className="w-full h-3.5 bg-slate-100 rounded-full overflow-hidden border border-slate-200 p-0.5">
            <div
              className={`h-full rounded-full transition-all duration-200 ${
                dipProgress > 70 ? 'bg-red-500' : 'bg-gradient-to-r from-amber-400 to-amber-600'
              }`}
              style={{ width: `${100 - dipProgress}%` }}
            />
          </div>
        </div>

        {/* Question & 3 Large Visual Answer Buttons */}
        {gameState === 'playing' ? (
          <div>
            <h3 className="text-base sm:text-lg font-black text-slate-900 mb-4 bg-amber-50/70 p-4 rounded-2xl border border-amber-200/80 leading-snug">
              {currentQ.q}
            </h3>

            <div className="space-y-3">
              {currentQ.options.map((opt, i) => (
                <button
                  key={i}
                  onClick={() => handleChoice(opt)}
                  className="w-full p-4 rounded-2xl bg-white hover:bg-amber-50 border-2 border-slate-200 hover:border-amber-400 text-left font-bold text-sm sm:text-base text-slate-800 transition-all active:scale-95 shadow-sm hover:shadow-md flex items-center justify-between group"
                >
                  <span className="flex-1 pr-2">{opt}</span>
                  <span className="w-8 h-8 rounded-full bg-amber-100 text-amber-800 font-black text-xs flex items-center justify-center group-hover:bg-amber-400 transition-colors shrink-0">
                    ➔
                  </span>
                </button>
              ))}
            </div>
          </div>
        ) : (
          /* Victory or Splash Result Card */
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className={`p-6 rounded-2xl border-2 ${
              gameState === 'saved'
                ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
                : 'bg-red-50 border-red-300 text-red-950'
            }`}
          >
            <div className="text-5xl mb-2">
              {gameState === 'saved' ? '🎉' : '💦'}
            </div>
            <h3 className="text-2xl font-black mb-2">
              {gameState === 'saved' ? 'SAFE & CRUNCHY! 😋' : 'SPLASH! SOGGY BISCUIT! 😂'}
            </h3>
            <p className="text-xs sm:text-sm mb-5 leading-relaxed font-semibold">
              {factText}
            </p>

            <button
              onClick={handleNextOrRetry}
              className={`w-full py-3.5 px-6 rounded-2xl font-black text-sm flex items-center justify-center gap-2 shadow-md active:scale-95 transition-all ${
                gameState === 'saved'
                  ? 'bg-emerald-500 hover:bg-emerald-600 text-white'
                  : 'bg-amber-500 hover:bg-amber-600 text-white'
              }`}
            >
              <RotateCcw className="w-4 h-4" />
              <span>{gameState === 'saved' ? 'Next Biscuit!' : 'Try Again!'}</span>
            </button>
          </motion.div>
        )}

      </div>
    </div>
  );
};
