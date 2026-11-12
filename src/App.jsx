import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { GameProvider } from './context/GameContext';
import { Navbar } from './components/Navbar';
import { HomePage } from './pages/HomePage';

// The Mini-Games
import { BiscuitTea } from './games/BiscuitTea';
import { DiseaseDetective } from './games/DiseaseDetective';
import { BreedingGround } from './games/BreedingGround';
import { DefenseGame } from './games/DefenseGame';
import { MosquitoNet } from './games/MosquitoNet';
import { MythBuster } from './games/MythBuster';
import { EcoGame } from './games/EcoGame';
import { HouseEscape } from './games/HouseEscape';
import { YardCleanup } from './games/YardCleanup';

export function App() {
  return (
    <GameProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-[#f8fafc] text-slate-800 flex flex-col justify-between selection:bg-emerald-200 selection:text-emerald-950">
          
          {/* Top Clean Light Navigation */}
          <Navbar />

          {/* Game Views */}
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/game/biscuit" element={<BiscuitTea />} />
              <Route path="/game/detective" element={<DiseaseDetective />} />
              <Route path="/game/breeding" element={<BreedingGround />} />
              <Route path="/game/fan" element={<DefenseGame />} />
              <Route path="/game/net" element={<MosquitoNet />} />
              <Route path="/game/myth" element={<MythBuster />} />
              <Route path="/game/eco" element={<EcoGame />} />
              <Route path="/game/escape" element={<HouseEscape />} />
              <Route path="/game/cleanup" element={<YardCleanup />} />
              
              {/* Catch-all */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>

        </div>
      </BrowserRouter>
    </GameProvider>
  );
}

export default App;
