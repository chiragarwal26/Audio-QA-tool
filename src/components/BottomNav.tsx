import React from 'react';
import { AppTab } from '../types';

interface BottomNavProps {
  currentTab: AppTab;
  onTabChange: (tab: AppTab) => void;
  defectCount?: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({ currentTab, onTabChange, defectCount = 15 }) => {
  const tabs: { id: AppTab; label: string; icon: string; badge?: number }[] = [
    { id: 'upload', label: 'Upload', icon: 'upload_file' },
    { id: 'inspection', label: 'Inspect', icon: 'graphic_eq' },
    { id: 'reports', label: 'Reports', icon: 'analytics', badge: defectCount },
    { id: 'settings', label: 'Settings', icon: 'tune' },
  ];

  return (
    <nav className="fixed bottom-0 w-full z-50 bg-[#f8f9ff]/92 backdrop-blur-xl border-t border-[#c4c6d1]/25 shadow-[0_-2px_12px_rgba(0,44,95,0.05)]">
      <div className="flex items-center justify-around h-16 px-2 max-w-lg mx-auto">
        {tabs.map((tab) => {
          const isActive = currentTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onTabChange(tab.id)}
              className={`flex flex-col items-center justify-center min-w-[68px] min-h-[48px] px-2 py-1 rounded-xl transition-all relative ${
                isActive
                  ? 'text-[#002c5f] font-semibold bg-[#dce9ff] shadow-xs'
                  : 'text-[#43474f] hover:text-[#0b1c30] hover:bg-[#eff4ff]/60'
              }`}
            >
              <div className="relative">
                <span className={`material-symbols-outlined text-[22px] ${isActive ? 'scale-105' : ''}`}>
                  {tab.icon}
                </span>
                {tab.badge && tab.badge > 0 && tab.id === 'reports' && (
                  <span className="absolute -top-1 -right-2 bg-[#ba1a1a] text-white font-mono text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center shadow-xs">
                    {tab.badge}
                  </span>
                )}
              </div>
              <span className="font-mono text-[10px] mt-0.5 tracking-wider uppercase">
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
