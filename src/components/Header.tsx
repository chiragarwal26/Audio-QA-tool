import React from 'react';
import { AppTab } from '../types';

interface HeaderProps {
  currentTab: AppTab;
  onTabChange: (tab: AppTab) => void;
  onBack?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ currentTab, onTabChange, onBack }) => {
  const getScreenDetails = () => {
    switch (currentTab) {
      case 'upload':
        return {
          title: 'Pre-flight Ingestion',
          badge: 'CALIBRATED · 48kHz',
          subPill: 'Batch Stems'
        };
      case 'inspection':
        return {
          title: 'Inspection',
          badge: 'ONLINE · 48kHz',
          subPill: 'Acoustic Pipeline'
        };
      case 'reports':
        return {
          title: 'Defect Report',
          badge: 'ONLINE · 48kHz',
          subPill: 'Protocol v4.2'
        };
      case 'settings':
        return {
          title: 'Acoustic Rig Setup',
          badge: 'RIG-B32 · 48kHz',
          subPill: 'Chamber Config'
        };
      case 'sample-detail':
        return {
          title: 'Sample Detail Inspector',
          badge: 'AEC/VAD PIPELINE',
          subPill: 'Diagnostic Session'
        };
    }
  };

  const details = getScreenDetails();

  if (currentTab === 'sample-detail') {
    return (
      <header className="fixed top-0 w-full z-50 bg-[#f8f9ff]/90 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,44,95,0.04)] border-b border-[#c4c6d1]/20">
        <div className="h-16 px-4 flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 min-w-0">
            <button
              type="button"
              onClick={onBack || (() => onTabChange('inspection'))}
              className="w-10 h-10 flex items-center justify-center rounded-lg text-[#002c5f] hover:bg-[#e5eeff] active:scale-95 transition-all shrink-0"
              title="Back to previous screen"
            >
              <span className="material-symbols-outlined text-[24px]">arrow_back</span>
            </button>
            <div className="flex items-center gap-2 min-w-0">
              <img
                alt="Hyundai Audio Quality Evaluation Logo"
                className="h-7 w-auto object-contain shrink-0"
                src="https://lh3.googleusercontent.com/aida/AEtjO1XURqc0orpcJkTttL6tlLvn4oRmw7Y8l38aKHmjSqVuupZfx_mlY5WlYEr2yFh0VmIy_eGsIXqF8WikAScTvhE0e41GOAjG5eA11XYPkyvhcws9znvSfr-Lh612DiSrHSeLr7Sn99tBrFZHYc8I0a7U7S35b4iWS1mJsujvYXqwXIRu46t4G-t-B4iiv-lQzf4qRy7dxg1hh385Sc1lafUlt827kpwoyYmcIMlXK4VPOVv-0ihhA_gEjw"
              />
              <div className="flex flex-col min-w-0">
                <h1 className="font-semibold text-[15px] sm:text-[17px] text-[#002c5f] leading-tight truncate">
                  Sample Detail Inspector
                </h1>
                <span className="font-mono text-[10px] tracking-wide text-[#006780] font-semibold uppercase leading-none">
                  DIAGNOSTIC SESSION · LAB 3B
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <div className="hidden xs:flex items-center gap-1 bg-[#e5eeff] px-2 py-1 rounded-full text-[11px] font-mono text-[#43474f]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#006780]"></span>
              <span>Bench 3B</span>
            </div>
            <div className="w-8 h-8 rounded-full overflow-hidden ring-1 ring-[#c4c6d1]/40">
              <img
                alt="Engineer Profile"
                className="w-8 h-8 rounded-full object-cover"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAxTxMYj5ltpfiaWOjQNym5Aj9CzmnKgGOs3Wao8JMSjiM7ryVulUGB4bTrkyDJyFyxphZkbTLE25RPHa9qLsSFcQEprn7JuKqvk7ZLawMku6N7Ux2R08Dduk22zz8rnXlUsVotl0wuLX52S57pcFy1VjYzkkikGQYaaWC0N4yjXlR6zYaa8VQ8VQnM9K4JUjL-dn4VCv6-nGFv_UXMhVjlE7Clkz1WpRznHBNUe4WRvVPzVcWSDmGU"
              />
            </div>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="fixed top-0 w-full z-50 bg-[#f8f9ff]/92 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,44,95,0.04)] border-b border-[#c4c6d1]/20">
      <div className="h-20 px-4 flex flex-col justify-center">
        {/* Top Brand Bar */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img
              alt="Hyundai Audio Quality Evaluation Logo"
              className="h-8 w-auto object-contain"
              src="https://lh3.googleusercontent.com/aida/AEtjO1XURqc0orpcJkTttL6tlLvn4oRmw7Y8l38aKHmjSqVuupZfx_mlY5WlYEr2yFh0VmIy_eGsIXqF8WikAScTvhE0e41GOAjG5eA11XYPkyvhcws9znvSfr-Lh612DiSrHSeLr7Sn99tBrFZHYc8I0a7U7S35b4iWS1mJsujvYXqwXIRu46t4G-t-B4iiv-lQzf4qRy7dxg1hh385Sc1lafUlt827kpwoyYmcIMlXK4VPOVv-0ihhA_gEjw"
            />
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="text-[17px] font-semibold text-[#002c5f] tracking-tight leading-tight">
                  AQE Lab
                </span>
                <span className="font-mono text-[10px] bg-[#56d5ff]/20 text-[#005a71] px-1.5 py-0.5 rounded font-bold">
                  #HY-2025-084-B
                </span>
              </div>
              <span className="font-mono text-[10px] uppercase tracking-wider text-[#43474f] leading-none mt-0.5">
                Hyundai Voice AI · Acoustic Suite
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 bg-[#e5eeff] px-2.5 py-1 rounded-full shadow-[0_1px_4px_rgba(0,0,0,0.02)]">
              <span className="w-2 h-2 rounded-full bg-[#006780] animate-pulse"></span>
              <span className="font-mono text-[11px] text-[#43474f] font-semibold">
                IONIQ 7 · Lab 3B
              </span>
            </div>
            <div className="w-8 h-8 rounded-full overflow-hidden ring-1 ring-[#c4c6d1]/40">
              <img
                alt="Profile"
                className="w-8 h-8 rounded-full object-cover"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAxTxMYj5ltpfiaWOjQNym5Aj9CzmnKgGOs3Wao8JMSjiM7ryVulUGB4bTrkyDJyFyxphZkbTLE25RPHa9qLsSFcQEprn7JuKqvk7ZLawMku6N7Ux2R08Dduk22zz8rnXlUsVotl0wuLX52S57pcFy1VjYzkkikGQYaaWC0N4yjXlR6zYaa8VQ8VQnM9K4JUjL-dn4VCv6-nGFv_UXMhVjlE7Clkz1WpRznHBNUe4WRvVPzVcWSDmGU"
              />
            </div>
          </div>
        </div>

        {/* Sub Navigation Title & Telemetry State */}
        <div className="flex items-center justify-between mt-1">
          <div className="flex items-center gap-2">
            <h1 className="text-[18px] text-[#0b1c30] font-semibold tracking-tight">
              {details.title}
            </h1>
            <span className="w-1.5 h-1.5 rounded-full bg-[#006780]"></span>
            <span className="text-[12px] text-[#43474f] font-medium hidden xs:inline">
              {details.subPill}
            </span>
          </div>
          <span className="font-mono text-[11px] text-[#006780] bg-[#eff4ff] border border-[#006780]/20 px-2 py-0.5 rounded font-semibold tracking-wide">
            {details.badge}
          </span>
        </div>
      </div>
    </header>
  );
};
