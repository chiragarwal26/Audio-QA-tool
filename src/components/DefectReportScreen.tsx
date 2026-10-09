import React, { useState } from 'react';
import { AudioSample } from '../types';

interface DefectReportScreenProps {
  onOpenSampleDetail: (sample: AudioSample) => void;
  samples: AudioSample[];
  onNavigateToInspect: () => void;
}

export const DefectReportScreen: React.FC<DefectReportScreenProps> = ({
  onOpenSampleDetail,
  samples,
  onNavigateToInspect,
}) => {
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastIcon, setToastIcon] = useState('check_circle');
  const [showExportModal, setShowExportModal] = useState(false);

  const showToast = (message: string, icon = 'check_circle') => {
    setToastMessage(message);
    setToastIcon(icon);
    setTimeout(() => {
      setToastMessage(null);
    }, 2800);
  };

  const flaggedSample = samples.find((s) => s.id === 'sample-102') || samples[0];

  return (
    <div className="flex flex-col w-full px-4 pt-24 pb-36 gap-4 max-w-lg mx-auto">
      {/* Sub-header status strip */}
      <div className="flex items-center justify-between pt-1">
        <div className="flex items-center gap-1.5">
          <span className="material-symbols-outlined text-[#006780] text-[18px]">
            verified
          </span>
          <span className="font-mono text-[11px] text-[#43474f] uppercase tracking-wider font-semibold">
            Acoustic QA Protocol v4.2
          </span>
        </div>
        <div className="flex items-center gap-1.5 bg-[#e5eeff] px-2.5 py-0.5 rounded-full">
          <span className="w-1.5 h-1.5 rounded-full bg-[#56d5ff]"></span>
          <span className="font-mono text-[10px] text-[#43474f] font-semibold">
            Synced 2m ago
          </span>
        </div>
      </div>

      {/* Executive Summary Hero Card */}
      <div className="relative overflow-hidden bg-[#002c5f] text-white rounded-2xl p-4 shadow-md">
        <div className="absolute -right-12 -top-12 w-48 h-48 rounded-full bg-[#006780]/20 blur-2xl pointer-events-none"></div>
        <div className="relative z-10 flex flex-col gap-3">
          <div className="flex items-start justify-between">
            <div className="flex flex-col">
              <span className="font-mono text-[10px] text-[#7695ce] tracking-wider uppercase font-semibold">
                Validation Run #HY-2025-084
              </span>
              <h2 className="text-[17px] font-bold text-white tracking-tight mt-0.5">
                End-of-Cycle Diagnostic Summary
              </h2>
            </div>
            <span className="bg-[#006780] text-white px-2 py-0.5 rounded text-[10px] font-mono font-bold tracking-wider uppercase shadow-xs">
              FINALIZED
            </span>
          </div>

          {/* Score Ring & Conditional Verdict Lockup */}
          <div className="flex items-center gap-4 bg-[#001839]/60 backdrop-blur-md rounded-xl p-3 border border-white/10">
            {/* SVG Ring Dial */}
            <div className="relative w-20 h-20 shrink-0 flex items-center justify-center">
              <svg className="w-20 h-20 -rotate-90" viewBox="0 0 80 80">
                <circle
                  className="text-[#002c5f]"
                  cx="40"
                  cy="40"
                  fill="none"
                  opacity="0.4"
                  r="32"
                  stroke="currentColor"
                  strokeWidth="7"
                ></circle>
                <circle
                  className="text-[#56d5ff]"
                  cx="40"
                  cy="40"
                  fill="none"
                  r="32"
                  stroke="currentColor"
                  strokeDasharray="201"
                  strokeDashoffset="43.4"
                  strokeLinecap="round"
                  strokeWidth="7"
                ></circle>
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="font-mono text-[22px] font-bold text-white leading-none">
                  78.4
                </span>
                <span className="font-mono text-[9px] text-[#7695ce] mt-0.5">/ 100</span>
              </div>
            </div>

            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping"></span>
                <span className="font-mono text-[11px] text-amber-300 font-bold uppercase tracking-wide">
                  Conditional Pass
                </span>
              </div>
              <span className="text-[12px] text-white/85 mt-1 leading-snug">
                Engineering review required prior to flashing DSP firmware to IONIQ 7 Pilot fleet.
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* KPI Summary Matrix */}
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between px-1">
          <span className="font-mono text-[10px] text-[#43474f] uppercase tracking-wider font-semibold">
            Corpus Distribution
          </span>
          <span className="font-mono text-[11px] text-[#43474f] font-medium">
            142 Total Files Evaluated
          </span>
        </div>

        <div className="grid grid-cols-3 gap-2">
          {/* Clean */}
          <div className="flex flex-col bg-white p-3 rounded-2xl shadow-sm border border-[#c4c6d1]/20">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[11px] font-semibold text-[#43474f]">Passed</span>
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            </div>
            <span className="font-mono text-[24px] font-bold text-[#0b1c30] leading-tight">
              104
            </span>
            <div className="flex items-center gap-1 mt-1">
              <span className="font-mono text-[10px] text-emerald-700 bg-emerald-100 px-1 rounded font-bold">
                73.2%
              </span>
              <span className="text-[10px] text-[#43474f] truncate">Clean</span>
            </div>
          </div>

          {/* Minor */}
          <div className="flex flex-col bg-white p-3 rounded-2xl shadow-sm border border-[#c4c6d1]/20">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[11px] font-semibold text-[#43474f]">Minor</span>
              <span className="w-2 h-2 rounded-full bg-amber-500"></span>
            </div>
            <span className="font-mono text-[24px] font-bold text-[#0b1c30] leading-tight">
              23
            </span>
            <div className="flex items-center gap-1 mt-1">
              <span className="font-mono text-[10px] text-amber-800 bg-amber-100 px-1 rounded font-bold">
                16.2%
              </span>
              <span className="text-[10px] text-[#43474f] truncate">Anomalies</span>
            </div>
          </div>

          {/* Critical */}
          <div className="flex flex-col bg-white p-3 rounded-2xl shadow-sm border border-[#ba1a1a]/20">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[11px] font-semibold text-[#43474f]">Critical</span>
              <span className="w-2 h-2 rounded-full bg-[#ba1a1a]"></span>
            </div>
            <span className="font-mono text-[24px] font-bold text-[#ba1a1a] leading-tight">
              15
            </span>
            <div className="flex items-center gap-1 mt-1">
              <span className="font-mono text-[10px] text-white bg-[#ba1a1a] px-1 rounded font-bold">
                10.6%
              </span>
              <span className="text-[10px] text-[#43474f] truncate">Defects</span>
            </div>
          </div>
        </div>
      </div>

      {/* Format-Wise Reliability Breakdown */}
      <div className="flex flex-col bg-white rounded-2xl p-4 shadow-sm border border-[#c4c6d1]/30 gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#002c5f] text-[20px]">
              audio_file
            </span>
            <h3 className="text-[15px] text-[#0b1c30] font-bold">Format Reliability</h3>
          </div>
          <span className="font-mono text-[10px] text-[#006780] bg-[#e5eeff] px-2 py-0.5 rounded font-bold uppercase">
            3 Codecs Audited
          </span>
        </div>

        <div className="flex flex-col gap-2.5">
          {/* .WAV */}
          <div className="flex flex-col gap-1.5 p-2.5 bg-[#eff4ff] rounded-xl border border-[#c4c6d1]/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className="bg-[#002c5f] text-white font-mono text-[10px] px-1.5 py-0.5 rounded font-bold">
                  .WAV
                </span>
                <span className="text-[12px] text-[#0b1c30] font-medium">58 Files Ingested</span>
              </div>
              <span className="font-mono text-[11px] text-emerald-600 font-bold">
                91.4% PASS
              </span>
            </div>
            <div className="w-full bg-[#dce9ff] h-2 rounded-full overflow-hidden flex">
              <div className="bg-emerald-500 h-full rounded-full w-[91.4%]"></div>
            </div>
            <div className="flex items-center justify-between text-[#43474f] font-mono text-[10px]">
              <span>Avg SNR: <strong className="text-[#0b1c30]">24.1 dB</strong></span>
              <span className="text-emerald-700 bg-emerald-50 px-1 rounded font-semibold">
                Lab Standard Nominal
              </span>
            </div>
          </div>

          {/* .MP3 */}
          <div className="flex flex-col gap-1.5 p-2.5 bg-[#eff4ff] rounded-xl border border-[#c4c6d1]/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className="bg-[#006780] text-white font-mono text-[10px] px-1.5 py-0.5 rounded font-bold">
                  .MP3
                </span>
                <span className="text-[12px] text-[#0b1c30] font-medium">44 Files Ingested</span>
              </div>
              <span className="font-mono text-[11px] text-amber-700 font-bold">
                68.2% PASS
              </span>
            </div>
            <div className="w-full bg-[#dce9ff] h-2 rounded-full overflow-hidden flex">
              <div className="bg-amber-500 h-full rounded-full w-[68.2%]"></div>
            </div>
            <div className="flex items-center gap-1 text-[#43474f] text-[11px]">
              <span className="material-symbols-outlined text-amber-600 text-[15px] shrink-0">
                info
              </span>
              <span className="text-[11px] leading-tight">
                Noticeable compression artifacts in 8kHz band during sibilance
              </span>
            </div>
          </div>

          {/* .PCM */}
          <div className="flex flex-col gap-1.5 p-2.5 bg-[#eff4ff] rounded-xl border border-[#c4c6d1]/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className="bg-[#003143] text-white font-mono text-[10px] px-1.5 py-0.5 rounded font-bold">
                  .PCM
                </span>
                <span className="text-[12px] text-[#0b1c30] font-medium">40 Files Ingested</span>
              </div>
              <span className="font-mono text-[11px] text-[#ba1a1a] font-bold">
                55.0% PASS
              </span>
            </div>
            <div className="w-full bg-[#dce9ff] h-2 rounded-full overflow-hidden flex">
              <div className="bg-[#ba1a1a] h-full rounded-full w-[55%]"></div>
            </div>
            <div className="flex items-center gap-1 text-[#43474f] text-[11px]">
              <span className="material-symbols-outlined text-[#ba1a1a] text-[15px] shrink-0">
                warning
              </span>
              <span className="text-[11px] leading-tight">
                Low-level DC bias & clipping captured on microphone array #2
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Defect Classification Taxonomy */}
      <div className="flex flex-col bg-white rounded-2xl p-4 shadow-sm border border-[#c4c6d1]/30 gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#ba1a1a] text-[20px]">
              troubleshoot
            </span>
            <h3 className="text-[15px] text-[#0b1c30] font-bold">Defect Taxonomy</h3>
          </div>
          <span className="font-mono text-[11px] text-[#43474f]">38 Flagged Items</span>
        </div>

        <div className="flex flex-col gap-3">
          {/* 1. Clipping */}
          <div className="flex flex-col gap-1">
            <div className="flex items-center justify-between">
              <span className="text-[12px] text-[#0b1c30] font-semibold truncate">
                1. Digital Clipping / Hard Saturation
              </span>
              <div className="flex items-center gap-1">
                <span className="font-mono text-[11px] text-[#ba1a1a] font-bold">7 files</span>
                <span className="font-mono text-[10px] text-[#43474f]">(4.9%)</span>
              </div>
            </div>
            <div className="w-full bg-[#eff4ff] h-2 rounded-full overflow-hidden">
              <div className="bg-[#ba1a1a] h-full rounded-full w-[49%]"></div>
            </div>
            <span className="font-mono text-[10px] text-[#43474f]">
              dBFS &gt; -0.1 · Driver Seat Overhead Mic
            </span>
          </div>

          {/* 2. Noise Bleed */}
          <div className="flex flex-col gap-1">
            <div className="flex items-center justify-between">
              <span className="text-[12px] text-[#0b1c30] font-semibold truncate">
                2. Wind & Road NVH Noise Bleed
              </span>
              <div className="flex items-center gap-1">
                <span className="font-mono text-[11px] text-[#ba1a1a] font-bold">5 files</span>
                <span className="font-mono text-[10px] text-[#43474f]">(3.5%)</span>
              </div>
            </div>
            <div className="w-full bg-[#eff4ff] h-2 rounded-full overflow-hidden">
              <div className="bg-[#ba1a1a] h-full rounded-full w-[35%]"></div>
            </div>
            <span className="font-mono text-[10px] text-[#43474f]">
              SNR &lt; 10 dB · 100km/h Aero Track Mode
            </span>
          </div>

          {/* 3. Distortion THD */}
          <div className="flex flex-col gap-1">
            <div className="flex items-center justify-between">
              <span className="text-[12px] text-[#0b1c30] font-semibold truncate">
                3. Spectral Distortion & High THD+N
              </span>
              <div className="flex items-center gap-1">
                <span className="font-mono text-[11px] text-amber-700 font-bold">9 files</span>
                <span className="font-mono text-[10px] text-[#43474f]">(6.3%)</span>
              </div>
            </div>
            <div className="w-full bg-[#eff4ff] h-2 rounded-full overflow-hidden">
              <div className="bg-amber-500 h-full rounded-full w-[63%]"></div>
            </div>
            <span className="font-mono text-[10px] text-[#43474f]">
              THD+N &gt; 3.5% · Beamformer Center Channel
            </span>
          </div>

          {/* 4. Packet Loss Dropouts */}
          <div className="flex flex-col gap-1">
            <div className="flex items-center justify-between">
              <span className="text-[12px] text-[#0b1c30] font-semibold truncate">
                4. Packet Loss / Buffer Dropouts
              </span>
              <div className="flex items-center gap-1">
                <span className="font-mono text-[11px] text-[#ba1a1a] font-bold">3 files</span>
                <span className="font-mono text-[10px] text-[#43474f]">(2.1%)</span>
              </div>
            </div>
            <div className="w-full bg-[#eff4ff] h-2 rounded-full overflow-hidden">
              <div className="bg-[#ba1a1a] h-full rounded-full w-[21%]"></div>
            </div>
            <span className="font-mono text-[10px] text-[#43474f]">
              I2S Stream Interruption · CCU Gateway
            </span>
          </div>

          {/* 5. Low PESQ */}
          <div className="flex flex-col gap-1">
            <div className="flex items-center justify-between">
              <span className="text-[12px] text-[#0b1c30] font-semibold truncate">
                5. Low PESQ / Intelligibility Loss
              </span>
              <div className="flex items-center gap-1">
                <span className="font-mono text-[11px] text-amber-700 font-bold">14 files</span>
                <span className="font-mono text-[10px] text-[#43474f]">(9.8%)</span>
              </div>
            </div>
            <div className="w-full bg-[#eff4ff] h-2 rounded-full overflow-hidden">
              <div className="bg-amber-500 h-full rounded-full w-[98%]"></div>
            </div>
            <span className="font-mono text-[10px] text-[#43474f]">
              Score &lt; 3.0 · Acoustic Isolation Loss
            </span>
          </div>
        </div>
      </div>

      {/* DSP Recommendations */}
      <div className="flex flex-col bg-[#dce9ff]/60 rounded-2xl p-4 shadow-sm border border-[#c4c6d1]/20 gap-3">
        <div className="flex items-center gap-2 text-[#002c5f]">
          <span className="material-symbols-outlined text-[22px]">psychology</span>
          <h3 className="text-[15px] font-bold text-[#0b1c30]">DSP Recommendations</h3>
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex items-start gap-2.5 p-3 bg-white rounded-xl shadow-2xs border border-[#c4c6d1]/20">
            <span className="material-symbols-outlined text-[#006780] text-[20px] mt-0.5">
              tune
            </span>
            <div className="flex flex-col min-w-0">
              <span className="text-[13px] font-semibold text-[#0b1c30]">
                Adjust DSP AGC Gain on Mic Array #2
              </span>
              <p className="text-[11px] text-[#43474f] mt-0.5 leading-snug">
                Reduce input preamp staging by{' '}
                <span className="font-mono font-bold text-[#002c5f]">-3.2 dB</span> to
                eliminate recurring saturation on sudden vocal transients.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-2.5 p-3 bg-white rounded-xl shadow-2xs border border-[#c4c6d1]/20">
            <span className="material-symbols-outlined text-[#006780] text-[20px] mt-0.5">
              model_training
            </span>
            <div className="flex flex-col min-w-0">
              <span className="text-[13px] font-semibold text-[#0b1c30]">
                Retrain Wake-Word Acoustic Model
              </span>
              <p className="text-[11px] text-[#43474f] mt-0.5 leading-snug">
                Inject synthetic{' '}
                <span className="font-mono font-bold text-[#002c5f]">
                  60km/h HVAC blower profile
                </span>{' '}
                to fortify false rejection resistance in high-fan states.
              </p>
            </div>
          </div>
        </div>

        {/* Lab Sign-Off Micro Badge */}
        <div className="flex items-center justify-between pt-1 text-[#43474f] text-[11px]">
          <span>Audited by: Senior QA Engineer K. Park</span>
          <span className="font-mono text-[10px] bg-white px-2 py-0.5 rounded text-[#002c5f] font-bold border border-[#c4c6d1]/20">
            HYUNDAI R&D NAMYANG
          </span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col gap-2.5 pt-1">
        <button
          type="button"
          onClick={() => onOpenSampleDetail(flaggedSample)}
          className="w-full flex items-center justify-center gap-2 bg-[#002c5f] hover:bg-[#001839] text-white py-3.5 px-4 rounded-xl shadow-sm active:scale-[0.99] transition-all font-semibold text-[14px]"
        >
          <span className="material-symbols-outlined text-[20px]">flag</span>
          <span>View Flagged Samples (38)</span>
        </button>

        <div className="grid grid-cols-2 gap-2.5">
          <button
            type="button"
            onClick={() => {
              setShowExportModal(true);
              showToast('Packaging HY-2025-084 PDF/JSON archive...', 'downloading');
            }}
            className="flex items-center justify-center gap-1.5 bg-white hover:bg-[#eff4ff] text-[#002c5f] py-3 px-3 rounded-xl shadow-sm border border-[#c4c6d1]/30 active:scale-[0.99] transition-all text-[13px] font-semibold"
          >
            <span className="material-symbols-outlined text-[#006780] text-[18px]">
              file_download
            </span>
            <span>Export (.PDF/.JSON)</span>
          </button>

          <button
            type="button"
            onClick={() => {
              showToast('Dispatched 15 Critical items to IONIQ 7 Rig B', 'refresh');
              setTimeout(() => {
                onNavigateToInspect();
              }, 1200);
            }}
            className="flex items-center justify-center gap-1.5 bg-white hover:bg-[#eff4ff] text-[#002c5f] py-3 px-3 rounded-xl shadow-sm border border-[#c4c6d1]/30 active:scale-[0.99] transition-all text-[13px] font-semibold"
          >
            <span className="material-symbols-outlined text-[#ba1a1a] text-[18px]">
              replay
            </span>
            <span>Re-test Failed</span>
          </button>
        </div>
      </div>

      {/* Interactive Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-20 left-4 right-4 z-50 max-w-sm mx-auto transition-all animate-bounce">
          <div className="bg-[#213145] text-[#eaf1ff] px-4 py-2.5 rounded-xl shadow-2xl flex items-center justify-between border border-white/10">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#56d5ff] text-[20px]">
                {toastIcon}
              </span>
              <span className="text-[12px] font-medium">{toastMessage}</span>
            </div>
            <span className="font-mono text-[10px] text-[#abc7ff] uppercase">
              AQE SYS
            </span>
          </div>
        </div>
      )}

      {/* Export Modal */}
      {showExportModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-5 max-w-sm w-full shadow-2xl border border-[#c4c6d1]/30 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <h3 className="text-[16px] font-bold text-[#002c5f]">
                Export Diagnostic Package
              </h3>
              <button
                type="button"
                onClick={() => setShowExportModal(false)}
                className="text-[#43474f] hover:text-[#0b1c30]"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>
            <p className="text-[12px] text-[#43474f]">
              Select deliverables for Run #HY-2025-084:
            </p>
            <div className="flex flex-col gap-2 font-mono text-[12px]">
              <label className="flex items-center gap-2 p-2 bg-[#eff4ff] rounded-lg cursor-pointer">
                <input type="checkbox" defaultChecked className="rounded text-[#002c5f]" />
                <span>Executive Summary PDF (Full Color)</span>
              </label>
              <label className="flex items-center gap-2 p-2 bg-[#eff4ff] rounded-lg cursor-pointer">
                <input type="checkbox" defaultChecked className="rounded text-[#002c5f]" />
                <span>Raw Defect Telemetry JSON (.ndjson)</span>
              </label>
              <label className="flex items-center gap-2 p-2 bg-[#eff4ff] rounded-lg cursor-pointer">
                <input type="checkbox" defaultChecked className="rounded text-[#002c5f]" />
                <span>Audio Stems Bundle (15 Clipped Samples)</span>
              </label>
            </div>
            <button
              type="button"
              onClick={() => {
                setShowExportModal(false);
                showToast('Diagnostic package downloaded successfully');
              }}
              className="mt-2 bg-[#002c5f] text-white py-2.5 rounded-xl font-semibold text-[13px]"
            >
              Generate & Download Archive
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
