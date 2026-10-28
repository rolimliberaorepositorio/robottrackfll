import React from 'react';
import { MASCOT_IMAGE_URL } from '../data/mockData';
import { TabType } from '../types';

interface HeaderProps {
  currentTab: TabType;
  onSync: () => void;
  syncing: boolean;
}

export const Header: React.FC<HeaderProps> = ({ currentTab, onSync, syncing }) => {
  const getTabTitle = () => {
    switch (currentTab) {
      case 'treinos':
        return 'Treinos';
      case 'ao-vivo':
        return 'Franco Droid Ao Vivo';
      case 'diagnostico':
        return 'Diagnóstico IA';
      case 'estrategia':
        return 'Estratégia & Anexos';
    }
  };

  const getSubTitle = () => {
    switch (currentTab) {
      case 'treinos':
        return 'Franco Droid';
      case 'ao-vivo':
        return 'Franco Droid • FLL BIOGLOW';
      case 'diagnostico':
        return 'Franco Droid • BIOGLOW 26/27';
      case 'estrategia':
        return 'Franco Droid • Engenharia';
    }
  };

  return (
    <header className="fixed top-0 inset-x-0 z-50 bg-[#0a121c]/90 backdrop-blur-xl pt-safe border-b border-[#1c2c40] shadow-[0_2px_14px_rgba(0,0,0,0.5)]">
      <div className="h-16 px-3 sm:px-4 max-w-4xl mx-auto flex items-center justify-between gap-2">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="relative flex-shrink-0">
            <img
              src={MASCOT_IMAGE_URL}
              alt="Mascote Franco Droid"
              className="h-10 w-10 object-contain rounded-lg p-1 bg-[#132030] border border-[#0077c8]/40 shadow-sm"
              onError={(e) => {
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
          </div>
          <div className="flex flex-col truncate">
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-bold tracking-wider text-[#a1c9ff] uppercase">
                {getSubTitle()}
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#e51a24]"></span>
            </div>
            <h1 className="text-[18px] sm:text-[20px] font-bold text-[#dce3f1] font-headline truncate leading-tight">
              {getTabTitle()}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            onClick={onSync}
            disabled={syncing}
            className="w-10 h-10 flex items-center justify-center rounded-xl bg-[#19283a] hover:bg-[#22354c] text-[#c1c7d2] hover:text-[#a1c9ff] active:scale-95 transition-all border border-[#414750]/50 shadow-sm"
            title="Sincronizar e Atualizar Planilha Excel"
            aria-label="Sincronizar e Atualizar Planilha Excel"
          >
            <span className={`material-symbols-outlined text-[20px] ${syncing ? 'animate-spin text-[#a1c9ff]' : ''}`}>
              refresh
            </span>
          </button>
        </div>
      </div>
    </header>
  );
};
