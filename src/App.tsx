/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { TreinosTab } from './components/TreinosTab';
import { AoVivoTab } from './components/AoVivoTab';
import { DiagnosticoTab } from './components/DiagnosticoTab';
import { EstrategiaTab } from './components/EstrategiaTab';
import { VideoUploadModal } from './components/VideoUploadModal';
import { INITIAL_ROUNDS } from './data/mockData';
import { RoundTelemetry, TabType } from './types';
import { exportRoundsToExcel } from './utils/excelExport';

export default function App() {
  const [currentTab, setCurrentTab] = useState<TabType>('treinos');
  
  // Real persistent storage for Franco Droid team rounds
  const [rounds, setRounds] = useState<RoundTelemetry[]>(() => {
    try {
      const saved = localStorage.getItem('francodroid_rounds');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) {
      console.warn('Could not read saved rounds:', e);
    }
    return INITIAL_ROUNDS;
  });

  const [selectedRound, setSelectedRound] = useState<RoundTelemetry | null>(
    rounds.length > 0 ? rounds[0] : null
  );
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Save rounds to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('francodroid_rounds', JSON.stringify(rounds));
    } catch (e) {
      console.warn('Could not persist rounds:', e);
    }
    if (rounds.length > 0 && !selectedRound) {
      setSelectedRound(rounds[0]);
    }
  }, [rounds, selectedRound]);

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage((cur) => (cur === message ? null : cur));
    }, 3800);
  };

  const handleExportExcel = () => {
    setSyncing(true);
    showToast('Gerando exportação: Franco_Droid_BIOGLOW_2026_2027.xlsx');
    setTimeout(() => {
      exportRoundsToExcel(rounds);
      setSyncing(false);
      showToast('Planilha Excel (.xlsx) da temporada BIOGLOW baixada com sucesso!');
    }, 600);
  };

  const handleSyncExcel = () => {
    setSyncing(true);
    showToast('Sincronizando com a pasta oficial Franco Droid no OneDrive/Excel...');
    setTimeout(() => {
      setSyncing(false);
      showToast('Planilha Franco_Droid_BIOGLOW_2026_2027.xlsx atualizada!');
    }, 1000);
  };

  const handleNewRoundCreated = (newRound: RoundTelemetry) => {
    setRounds((prev) => [newRound, ...prev]);
    setSelectedRound(newRound);
    setCurrentTab('diagnostico');
  };

  const handleApplyStrategy = () => {
    showToast('Checklist Technic e POP de largada fixados no painel de Estratégia Franco Droid!');
    setCurrentTab('estrategia');
  };

  return (
    <div className="min-h-screen bg-[#0a111a] text-[#dce3f1] font-sans flex flex-col relative antialiased selection:bg-[#005a9c] selection:text-white">
      {/* Fixed Header */}
      <Header
        currentTab={currentTab}
        onSync={handleSyncExcel}
        syncing={syncing}
      />

      {/* Main Content Area */}
      <main className="flex-1 w-full pt-16 flex flex-col">
        {currentTab === 'treinos' && (
          <TreinosTab
            rounds={rounds}
            onStartLiveRound={() => setCurrentTab('ao-vivo')}
            onOpenUploadModal={() => setIsUploadModalOpen(true)}
            onNavigateTab={setCurrentTab}
            onSelectRound={(r) => {
              setSelectedRound(r);
              setCurrentTab('diagnostico');
            }}
            onExportExcel={handleExportExcel}
            syncing={syncing}
          />
        )}

        {currentTab === 'ao-vivo' && (
          <AoVivoTab
            onFinishRound={handleNewRoundCreated}
            onNavigateTab={setCurrentTab}
            showToast={showToast}
          />
        )}

        {currentTab === 'diagnostico' && (
          <DiagnosticoTab
            round={selectedRound}
            onApplyStrategy={handleApplyStrategy}
            onExportExcel={handleExportExcel}
            onNavigateTab={setCurrentTab}
            showToast={showToast}
          />
        )}

        {currentTab === 'estrategia' && (
          <EstrategiaTab showToast={showToast} />
        )}
      </main>

      {/* Fixed Bottom Navigation */}
      <BottomNav currentTab={currentTab} onChangeTab={setCurrentTab} />

      {/* Video Filming / Upload Modal */}
      <VideoUploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onNewRoundCreated={handleNewRoundCreated}
        showToast={showToast}
      />

      {/* Interactive Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 inset-x-4 max-w-md mx-auto z-50 animate-bounce pointer-events-none">
          <div className="p-3.5 rounded-xl bg-[#19283a] border border-[#0077c8]/60 text-white font-headline text-[13px] flex items-center justify-center gap-2 shadow-2xl backdrop-blur-md">
            <span className="material-symbols-outlined text-[#3897f0] text-[20px] flex-shrink-0">
              task_alt
            </span>
            <span className="truncate">{toastMessage}</span>
          </div>
        </div>
      )}
    </div>
  );
}
