import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, RotateCcw, HeartHandshake } from 'lucide-react';
import { useGame } from '../context/GameContext';
import { playPopSound, playOopsSound, playWinSound } from '../utils/audio';

const SYMPTOM_CASES = [
  {
    id: 's-vomit',
    title: 'Cannot Stop Vomiting (>3 times)',
    emoji: '🤢',
    isEmergency: true,
    reason: 'Cannot keep water down! Doctors must provide hydration fluids immediately.',
  },
  {
    id: 's-bleed',
    title: 'Bleeding Gums or Nosebleeds',
    emoji: '🩸',
    isEmergency: true,
    reason: 'Bleeding indicates dropping platelets. Immediate hospital check needed!',
  },
  {
    id: 's-belly',
    title: 'Severe Continuous Belly Pain',
    emoji: '😣',
    isEmergency: true,
    reason: 'Continuous tummy pain when fever drops is a major danger sign for plasma leakage.',
  },
  {
    id: 's-tired',
    title: 'Mild Sleepiness on Day 1',
    emoji: '🥱',
    isEmergency: false,
    reason: 'Mild tiredness is normal with rest, oral fluids, and home temperature monitoring.',
  },
  {
    id: 's-sneeze',
    title: 'One Small Gentle Sneeze',
    emoji: '🤧',
    isEmergency: false,
    reason: 'Just a gentle sneeze! Rest at home with warm water and soup.',
  },
];

export const SymptomGame = () => {
  const { addStars, markGameCompleted, soundEnabled } = useGame();

  const [basket, setBasket] = useState([]);
  const [bouncedId, setBouncedId] = useState(null);
  const [activeMessage, setActiveMessage] = useState('');
  const [isDone, setIsDone] = useState(false);

  const urgentSymptoms = SYMPTOM_CASES.filter(s => s.isEmergency);
  const remainingSymptoms = SYMPTOM_CASES.filter(s => !basket.includes(s.id));

  const handleTapSymptom = (item) => {
    if (item.isEmergency) {
      if (soundEnabled) playPopSound();
      setBasket(prev => {
        const next = [...prev, item.id];
        if (next.length === urgentSymptoms.length) {
          setIsDone(true);
          addStars(30);
          markGameCompleted('symptoms');
          if (soundEnabled) playWinSound();
        }
        return next;
      });
      setActiveMessage(`YES! 🏥 Put in the GET HELP basket: ${item.reason}`);
    } else {
      if (soundEnabled) playOopsSound();
      setBouncedId(item.id);
      setActiveMessage(`BOING! 💨 ${item.title} is mild. Rest at home with warm fluids!`);
      setTimeout(() => setBouncedId(null), 1000);
    }
  };

  const handleRestart = () => {
    setBasket([]);
    setBouncedId(null);
    setActiveMessage('');
    setIsDone(false);
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-6">
      
      {/* Top Header */}
      <div className="flex items-center justify-between gap-3 mb-5">
        <Link
          to="/"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-slate-200 text-slate-700 text-xs font-bold shadow-soft-sm hover:bg-slate-50 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 text-teal-600" />
          <span>All Games</span>
        </Link>

        <span className="px-3.5 py-1 rounded-full bg-teal-100 border border-teal-300 text-teal-900 font-extrabold text-xs">
          Game 3 • Symptom Rescue 🩺
        </span>
      </div>

      {/* Main Light Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-teal-200 shadow-soft-lg text-center relative overflow-hidden">
        
        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mb-1">
          Help Sick Buddy! 🤒
        </h2>
        <p className="text-xs sm:text-sm text-teal-700 font-semibold mb-6">
          Tap the serious red-flag warning signs into the “GET HELP” basket!
        </p>

        {/* Cartoon Buddy & Rescue Basket Stage */}
        <div className="flex items-center justify-around gap-2 mb-6 p-4 rounded-3xl bg-teal-50/70 border-2 border-teal-200/80">
          
          {/* Sick cartoon buddy */}
          <div className="flex flex-col items-center">
            <motion.div
              animate={{ rotate: [-4, 4, -4] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="text-6xl select-none"
            >
              🤒
            </motion.div>
            <span className="text-xs font-black text-slate-700 mt-1">Buddy</span>
          </div>

          <div className="text-2xl text-teal-500 font-black">➔</div>

          {/* GET HELP Basket */}
          <motion.div
            animate={basket.length > 0 ? { scale: [1, 1.15, 1] } : {}}
            className="w-36 h-28 rounded-2xl bg-gradient-to-b from-rose-500 to-red-600 border-4 border-white p-2 flex flex-col items-center justify-between shadow-md relative"
          >
            <span className="text-[10px] font-black uppercase tracking-wider text-white bg-black/20 px-2 py-0.5 rounded-full">
              🚨 GET HELP
            </span>
            <div className="flex gap-1 text-2xl">
              {basket.map(id => {
                const s = SYMPTOM_CASES.find(x => x.id === id);
                return <span key={id}>{s?.emoji}</span>;
              })}
            </div>
            <span className="text-[10px] font-extrabold text-rose-100">
              {basket.length}/{urgentSymptoms.length} Red Flags
            </span>
          </motion.div>

        </div>

        {/* Dynamic Speech Message */}
        {activeMessage && (
          <div className="p-3.5 rounded-2xl bg-teal-50 border border-teal-200 text-xs sm:text-sm text-teal-900 mb-6 font-semibold leading-relaxed">
            {activeMessage}
          </div>
        )}

        {/* Symptom Bubble Cards to Tap */}
        {!isDone ? (
          <div>
            <span className="text-xs font-bold text-slate-600 uppercase tracking-wider block mb-3">
              Tap which signs mean Buddy should see a doctor immediately:
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {remainingSymptoms.map((sym) => {
                const isBouncing = bouncedId === sym.id;

                return (
                  <motion.button
                    key={sym.id}
                    onClick={() => handleTapSymptom(sym)}
                    animate={isBouncing ? { x: [-15, 15, -10, 10, 0], scale: [1, 0.9, 1] } : {}}
                    className="p-4 rounded-2xl bg-white hover:bg-teal-50 border-2 border-slate-200 hover:border-teal-400 text-left transition-all active:scale-95 flex items-center justify-between shadow-sm hover:shadow-md group"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="text-3xl">{sym.emoji}</span>
                      <span className="text-xs sm:text-sm font-bold text-slate-800">
                        {sym.title}
                      </span>
                    </div>
                    <span className="text-teal-600 text-xs font-black uppercase group-hover:text-teal-700 shrink-0">
                      Tap! ➔
                    </span>
                  </motion.button>
                );
              })}
            </div>
          </div>
        ) : (
          /* Victory Card */
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="p-6 rounded-2xl bg-emerald-50 border-2 border-emerald-300 text-emerald-950 text-center"
          >
            <span className="text-5xl block mb-2">🎉🏥</span>
            <h3 className="text-2xl font-black mb-2">
              Buddy Is Safe at the Clinic!
            </h3>
            <p className="text-xs sm:text-sm mb-6 leading-relaxed font-semibold">
              <strong>Remember:</strong> Continuous severe tummy pain, bleeding gums, or constant vomiting mean you must see a doctor immediately. Early hydration saves lives!
            </p>

            <button
              onClick={handleRestart}
              className="w-full py-3.5 px-6 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-black text-sm shadow-md active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Help Buddy Again!</span>
            </button>
          </motion.div>
        )}

      </div>
    </div>
  );
};
