import React from 'react';
import { TabType } from '../types';

interface BottomNavProps {
  currentTab: TabType;
  onChangeTab: (tab: TabType) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ currentTab, onChangeTab }) => {
  const navItems = [
    {
      id: 'treinos' as TabType,
      label: 'Treinos',
      icon: 'dashboard',
    },
    {
      id: 'ao-vivo' as TabType,
      label: 'Ao Vivo',
      icon: 'videocam',
    },
    {
      id: 'diagnostico' as TabType,
      label: 'Diagnóstico',
      icon: 'analytics',
    },
    {
      id: 'estrategia' as TabType,
      label: 'Estratégia',
      icon: 'precision_manufacturing',
    },
  ];

  return (
    <nav className="fixed bottom-0 inset-x-0 z-50 pb-safe bg-[#0a121c]/95 backdrop-blur-xl border-t border-[#1c2c40] shadow-[0_-3px_16px_rgba(0,0,0,0.6)]">
      <div className="flex justify-around items-center h-16 max-w-4xl mx-auto px-2">
        {navItems.map((item) => {
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onChangeTab(item.id)}
              className={`flex flex-col items-center justify-center gap-1 min-w-[64px] min-h-[48px] transition-colors rounded-lg ${
                isActive
                  ? 'text-[#a1c9ff] font-bold'
                  : 'text-[#8b919b] hover:text-[#dce3f1]'
              }`}
            >
              <span
                className="material-symbols-outlined text-[24px]"
                style={isActive ? { fontVariationSettings: "'FILL' 1" } : undefined}
              >
                {item.icon}
              </span>
              <span className={`text-[11px] font-headline tracking-wide ${isActive ? 'text-[#a1c9ff]' : 'text-[#8b919b]'}`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
