import React, { createContext, useContext, useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { playWinSound, playClickSound } from '../utils/audio';
import { TRANSLATIONS } from '../data/translations';

const GameContext = createContext();

const STORAGE_KEY = 'mosquito_mission_stars_v2';
const LANG_STORAGE_KEY = 'mosquito_mission_lang';

export const GameProvider = ({ children }) => {
  const [stars, setStars] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? parseInt(saved, 10) : 0;
    } catch {
      return 0;
    }
  });

  const [completedGames, setCompletedGames] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY + '_completed');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [soundEnabled, setSoundEnabled] = useState(true);

  const [language, setLanguageState] = useState(() => {
    try {
      const saved = localStorage.getItem(LANG_STORAGE_KEY);
      return saved && TRANSLATIONS[saved] ? saved : 'en';
    } catch {
      return 'en';
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, stars.toString());
      localStorage.setItem(STORAGE_KEY + '_completed', JSON.stringify(completedGames));
      localStorage.setItem(LANG_STORAGE_KEY, language);
    } catch {}
  }, [stars, completedGames, language]);

  const setLanguage = (lang) => {
    if (TRANSLATIONS[lang]) {
      setLanguageState(lang);
      if (soundEnabled) playClickSound();
    }
  };

  const t = (key) => {
    const dict = TRANSLATIONS[language] || TRANSLATIONS.en;
    return dict[key] || TRANSLATIONS.en[key] || key;
  };

  const addStars = (amount) => {
    if (amount <= 0) return;
    setStars(prev => prev + amount);
    if (soundEnabled) playWinSound();

    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#10b981', '#fbbf24', '#f43f5e', '#38bdf8'],
      });
    } catch {}
  };

  const markGameCompleted = (gameId) => {
    if (!completedGames.includes(gameId)) {
      setCompletedGames(prev => [...prev, gameId]);
    }
  };

  const toggleSound = () => {
    setSoundEnabled(prev => {
      const next = !prev;
      if (next) playClickSound();
      return next;
    });
  };

  const resetAll = () => {
    setStars(0);
    setCompletedGames([]);
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(STORAGE_KEY + '_completed');
  };

  return (
    <GameContext.Provider
      value={{
        stars,
        completedGames,
        soundEnabled,
        language,
        setLanguage,
        t,
        addStars,
        markGameCompleted,
        toggleSound,
        resetAll,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error('useGame must be used in GameProvider');
  return ctx;
};
