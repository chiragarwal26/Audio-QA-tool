import React, { useState } from 'react';
import { AudioSample } from '../types';

interface AcousticHeatmapProps {
  sample: AudioSample;
  samples: AudioSample[];
  onSelectSample?: (sample: AudioSample) => void;
  onAuditionSlice?: (time: number) => void;
}

interface CellData {
  timeIndex: number;
  timeLabel: string;
  timeSec: number;
  rowId: string;
  rowLabel: string;
  valueDb: number;
  isSpike: boolean;
  isDrop: boolean;
  classification: 'SPIKE' | 'HIGH' | 'NOMINAL' | 'LOW' | 'DROP';
}

export const AcousticHeatmap: React.FC<AcousticHeatmapProps> = ({
  sample,
  samples,
  onSelectSample,
  onAuditionSlice,
}) => {
  const [viewMode, setViewMode] = useState<'spectral' | 'spatial'>('spectral');
  const [highlightSpikes, setHighlightSpikes] = useState(true);
  const [highlightDrops, setHighlightDrops] = useState(true);
  const [activeCell, setActiveCell] = useState<CellData | null>(null);

  // Frequency bands for spectral mode
  const spectralBands = [
    { id: 'air', label: 'Air (12k-24kHz)' },
    { id: 'treble', label: 'Treble (4k-12kHz)' },
    { id: 'vocal', label: 'Vocal (2k-4kHz)' },
    { id: 'formant', label: 'Formant (500-2kHz)' },
    { id: 'lowmid', label: 'Low-Mid (120-500Hz)' },
    { id: 'sub', label: 'Sub-Bass (<120Hz)' },
  ];

  // Spatial channels for spatial mode
  const spatialChannels = [
    { id: 'ch1', label: 'CH1 Driver Sunvisor' },
    { id: 'ch2', label: 'CH2 Passenger Console' },
    { id: 'ch3', label: 'CH3 Beam Reference' },
    { id: 'ch4', label: 'CH4 Cabin Ambience' },
  ];

  // 12 time slices across the sample duration (0.0s to ~2.8s)
  const timeSlices = [
    { idx: 0, label: '0.0s', sec: 0.0 },
    { idx: 1, label: '0.25s', sec: 0.25 },
    { idx: 2, label: '0.5s', sec: 0.5 },
    { idx: 3, label: '0.8s', sec: 0.8 },
    { idx: 4, label: '1.1s', sec: 1.12 }, // Known spike 1 for defective sample
    { idx: 5, label: '1.4s', sec: 1.4 },
    { idx: 6, label: '1.7s', sec: 1.7 },
    { idx: 7, label: '2.0s', sec: 2.04 }, // Known spike 2 for defective sample
    { idx: 8, label: '2.3s', sec: 2.3 },
    { idx: 9, label: '2.5s', sec: 2.5 },  // Drop / dropout for sample
    { idx: 10, label: '2.7s', sec: 2.7 },
    { idx: 11, label: '2.9s', sec: 2.9 },
  ];

  // Generate deterministic intensity matrix based on sample characteristics
  const generateIntensity = (rowId: string, timeSec: number): {
    val: number;
    isSpike: boolean;
    isDrop: boolean;
    classification: 'SPIKE' | 'HIGH' | 'NOMINAL' | 'LOW' | 'DROP';
  } => {
    const isClippedSample = sample.hasClipping;

    // Localized spike condition (at t=1.12s and t=2.04s in vocal band / CH1 / CH4)
    const isSpikeTime1 = Math.abs(timeSec - 1.12) < 0.15;
    const isSpikeTime2 = Math.abs(timeSec - 2.04) < 0.15;
    const isSpikeBand = rowId === 'vocal' || rowId === 'ch1' || rowId === 'ch4';

    if (isClippedSample && (isSpikeTime1 || isSpikeTime2) && isSpikeBand) {
      return {
        val: isSpikeTime1 ? 0.8 : 0.6,
        isSpike: true,
        isDrop: false,
        classification: 'SPIKE',
      };
    }

    // Localized drop condition (e.g. at t=2.5s due to I2S buffer pause or VAD cutoff notch)
    if (Math.abs(timeSec - 2.5) < 0.15 && (rowId === 'formant' || rowId === 'vocal' || rowId === 'ch3')) {
      return {
        val: -48.5,
        isSpike: false,
        isDrop: true,
        classification: 'DROP',
      };
    }

    // Sub-bass road rumble energy (<120Hz)
    if (rowId === 'sub') {
      const rumble = -18.0 + Math.sin(timeSec * 3) * 3;
      return { val: rumble, isSpike: false, isDrop: false, classification: 'NOMINAL' };
    }

    // Air band (12k-24kHz)
    if (rowId === 'air') {
      const air = isClippedSample && (isSpikeTime1 || isSpikeTime2) ? -6.0 : -42.0;
      return {
        val: air,
        isSpike: air > -8.0,
        isDrop: false,
        classification: air > -8.0 ? 'HIGH' : 'LOW',
      };
    }

    // Speech formant band normal envelope
    if (rowId === 'formant' || rowId === 'vocal' || rowId === 'ch1' || rowId === 'ch2') {
      // Speech presence curve
      const speechEnvelope = Math.sin((timeSec / 2.9) * Math.PI);
      const intensity = -28.0 + speechEnvelope * 16 + (Math.sin(timeSec * 7) * 3);
      const classification = intensity > -10 ? 'HIGH' : intensity > -26 ? 'NOMINAL' : 'LOW';
      return { val: intensity, isSpike: false, isDrop: false, classification };
    }

    // Default ambient floor
    const floor = -36.0 + (Math.sin(timeSec * 5 + rowId.length) * 4);
    return { val: floor, isSpike: false, isDrop: false, classification: 'LOW' };
  };

  const rows = viewMode === 'spectral' ? spectralBands : spatialChannels;

  // Compute color based on intensity value
  const getCellColor = (val: number, isSpike: boolean, isDrop: boolean) => {
    if (isSpike && highlightSpikes) {
      return 'bg-[#ba1a1a] shadow-[0_0_8px_rgba(186,26,26,0.8)] border border-[#ffdad6] animate-pulse';
    }
    if (isDrop && highlightDrops) {
      return 'bg-[#001839] border border-dashed border-[#56d5ff]/50 opacity-80';
    }
    if (val >= -1.0) {
      return 'bg-[#ba1a1a] text-white';
    }
    if (val >= -8.0) {
      return 'bg-[#f59e0b] text-[#001839]';
    }
    if (val >= -16.0) {
      return 'bg-[#56d5ff] text-[#001839]';
    }
    if (val >= -28.0) {
      return 'bg-[#00AAD2] text-white';
    }
    if (val >= -40.0) {
      return 'bg-[#006780] text-white';
    }
    return 'bg-[#002c5f] text-[#c4c6d1]';
  };

  return (
    <section className="bg-white rounded-2xl p-4 shadow-sm border border-[#c4c6d1]/30 flex flex-col gap-3">
      {/* Header with Title and Mode Toggle */}
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-[#dce9ff] flex items-center justify-center text-[#006780] shadow-xs">
            <span className="material-symbols-outlined text-[18px]">grid_view</span>
          </div>
          <div className="flex flex-col">
            <h3 className="text-[14px] font-bold text-[#001839] tracking-tight">
              Acoustic Intensity Heatmap
            </h3>
            <span className="font-mono text-[10px] text-[#43474f]">
              Localized Signal Energy · Spikes & Drops
            </span>
          </div>
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center bg-[#eff4ff] p-0.5 rounded-xl border border-[#c4c6d1]/25">
          <button
            type="button"
            onClick={() => setViewMode('spectral')}
            className={`px-2.5 py-1 rounded-lg font-mono text-[10px] font-bold transition-all ${
              viewMode === 'spectral'
                ? 'bg-[#002c5f] text-white shadow-xs'
                : 'text-[#43474f] hover:text-[#001839]'
            }`}
          >
            Frequency Bands
          </button>
          <button
            type="button"
            onClick={() => setViewMode('spatial')}
            className={`px-2.5 py-1 rounded-lg font-mono text-[10px] font-bold transition-all ${
              viewMode === 'spatial'
                ? 'bg-[#002c5f] text-white shadow-xs'
                : 'text-[#43474f] hover:text-[#001839]'
            }`}
          >
            4-CH Spatial Array
          </button>
        </div>
      </div>

      {/* Sample Selector Pill Strip */}
      <div className="flex items-center gap-1.5 overflow-x-auto py-1 border-y border-[#c4c6d1]/20">
        <span className="font-mono text-[10px] text-[#747780] uppercase tracking-wider shrink-0 font-bold mr-1">
          Sample:
        </span>
        {samples.map((s) => {
          const isSelected = s.id === sample.id;
          return (
            <button
              key={s.id}
              type="button"
              onClick={() => onSelectSample && onSelectSample(s)}
              className={`px-2.5 py-1 rounded-lg font-mono text-[10px] font-bold transition-all shrink-0 flex items-center gap-1 ${
                isSelected
                  ? 'bg-[#006780] text-white shadow-xs'
                  : 'bg-[#eff4ff] text-[#43474f] hover:bg-[#dce9ff]'
              }`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  s.hasClipping ? 'bg-[#ba1a1a]' : 'bg-emerald-400'
                }`}
              ></span>
              <span className="truncate max-w-[120px]">{s.filename}</span>
            </button>
          );
        })}
      </div>

      {/* Anomaly Detection Status Bar */}
      <div className="flex items-center justify-between text-[11px] font-mono bg-[#eff4ff] p-2 rounded-xl border border-[#c4c6d1]/20">
        <div className="flex items-center gap-2">
          {sample.hasClipping ? (
            <span className="flex items-center gap-1 text-[#ba1a1a] font-bold">
              <span className="w-2 h-2 rounded-full bg-[#ba1a1a] animate-ping"></span>
              2 Spikes Detected (&gt; -0.5 dBFS)
            </span>
          ) : (
            <span className="flex items-center gap-1 text-emerald-700 font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              Peak Levels Nominal (-4.8 dBFS)
            </span>
          )}
          <span className="text-[#c4c6d1]">|</span>
          <span className="text-[#006780] font-semibold">1 Signal Drop Notch</span>
        </div>

        {/* Highlight Toggles */}
        <div className="flex items-center gap-2">
          <label className="flex items-center gap-1 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={highlightSpikes}
              onChange={(e) => setHighlightSpikes(e.target.checked)}
              className="w-3 h-3 text-[#ba1a1a] rounded"
            />
            <span className="text-[9px] text-[#ba1a1a] font-bold uppercase">Spikes</span>
          </label>
          <label className="flex items-center gap-1 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={highlightDrops}
              onChange={(e) => setHighlightDrops(e.target.checked)}
              className="w-3 h-3 text-[#56d5ff] rounded"
            />
            <span className="text-[9px] text-[#006780] font-bold uppercase">Drops</span>
          </label>
        </div>
      </div>

      {/* Heatmap Grid Matrix Canvas (Sunken Navy Container) */}
      <div className="bg-[#001839] rounded-xl p-3 flex flex-col gap-1.5 relative overflow-hidden select-none border border-[#002c5f]">
        {/* Heatmap Grid Body */}
        <div className="flex flex-col gap-1">
          {rows.map((row) => (
            <div key={row.id} className="flex items-center gap-1">
              {/* Row Label */}
              <div className="w-28 shrink-0 text-right pr-2 font-mono text-[9px] text-[#7695ce] truncate font-semibold">
                {row.label}
              </div>

              {/* Time Slice Cells */}
              <div className="flex-1 grid grid-cols-12 gap-1">
                {timeSlices.map((time) => {
                  const { val, isSpike, isDrop, classification } = generateIntensity(
                    row.id,
                    time.sec
                  );
                  const colorClass = getCellColor(val, isSpike, isDrop);
                  const cellInfo: CellData = {
                    timeIndex: time.idx,
                    timeLabel: time.label,
                    timeSec: time.sec,
                    rowId: row.id,
                    rowLabel: row.label,
                    valueDb: val,
                    isSpike,
                    isDrop,
                    classification,
                  };

                  const isCellActive =
                    activeCell &&
                    activeCell.rowId === row.id &&
                    activeCell.timeIndex === time.idx;

                  return (
                    <div
                      key={time.idx}
                      onMouseEnter={() => setActiveCell(cellInfo)}
                      onClick={() => {
                        setActiveCell(cellInfo);
                        if (onAuditionSlice) onAuditionSlice(time.sec);
                      }}
                      className={`h-5 rounded-xs transition-all cursor-pointer relative group flex items-center justify-center ${colorClass} ${
                        isCellActive ? 'ring-2 ring-white scale-110 z-10' : 'hover:scale-105'
                      }`}
                      title={`${row.label} @ ${time.label}: ${val.toFixed(1)} dBFS`}
                    >
                      {/* Spike exclamation icon if highlighted */}
                      {isSpike && highlightSpikes && (
                        <span className="material-symbols-outlined text-[10px] text-white leading-none">
                          priority_high
                        </span>
                      )}
                      {/* Drop notch icon if highlighted */}
                      {isDrop && highlightDrops && (
                        <span className="w-1.5 h-1.5 rounded-full bg-[#56d5ff] leading-none"></span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* X-Axis Time Labels */}
        <div className="flex items-center gap-1 pt-1 border-t border-white/10 mt-1">
          <div className="w-28 shrink-0 text-right pr-2 font-mono text-[9px] text-[#43474f]">
            TIME (s)
          </div>
          <div className="flex-1 grid grid-cols-12 gap-1 text-center font-mono text-[8px] text-[#7695ce]">
            {timeSlices.map((time) => (
              <span key={time.idx} className="truncate">
                {time.label}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Active Cell Telemetry Inspector Box */}
      <div className="bg-[#eff4ff] rounded-xl p-2.5 flex items-center justify-between gap-2 border border-[#c4c6d1]/20 font-mono text-[11px]">
        {activeCell ? (
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-2">
              <span
                className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${
                  activeCell.isSpike
                    ? 'bg-[#ba1a1a] text-white'
                    : activeCell.isDrop
                    ? 'bg-[#002c5f] text-[#56d5ff]'
                    : activeCell.classification === 'HIGH'
                    ? 'bg-amber-100 text-amber-800'
                    : 'bg-[#dce9ff] text-[#002c5f]'
                }`}
              >
                {activeCell.isSpike
                  ? 'CRITICAL SPIKE'
                  : activeCell.isDrop
                  ? 'SIGNAL DROP NOTCH'
                  : `${activeCell.classification} INTENSITY`}
              </span>
              <span className="font-bold text-[#001839]">
                {activeCell.rowLabel}
              </span>
              <span className="text-[#43474f]">@ {activeCell.timeLabel}</span>
            </div>

            <div className="flex items-center gap-2">
              <span className="font-bold text-[#001839]">
                {activeCell.valueDb > 0 ? `+${activeCell.valueDb.toFixed(1)}` : activeCell.valueDb.toFixed(1)} dBFS
              </span>
              <button
                type="button"
                onClick={() => onAuditionSlice && onAuditionSlice(activeCell.timeSec)}
                className="bg-[#006780] hover:bg-[#005a71] text-white px-2 py-0.5 rounded text-[10px] font-bold flex items-center gap-0.5"
                title="Audition this acoustic window"
              >
                <span className="material-symbols-outlined text-[12px]">volume_up</span>
                <span>Audition</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-between w-full text-[#43474f]">
            <span className="flex items-center gap-1.5 text-[11px]">
              <span className="material-symbols-outlined text-[15px] text-[#006780]">
                touch_app
              </span>
              Hover or tap any matrix cell to inspect localized acoustic intensity & timestamps
            </span>
            <span className="text-[10px] text-[#747780]">12 × {rows.length} Bins</span>
          </div>
        )}
      </div>

      {/* Heatmap Legend Gradient Strip */}
      <div className="flex flex-col gap-1 pt-0.5">
        <div className="flex items-center justify-between font-mono text-[9px] text-[#43474f]">
          <span>-60 dBFS (Floor)</span>
          <span>-40 dBFS</span>
          <span>-20 dBFS (Nominal)</span>
          <span>-8 dBFS</span>
          <span className="text-[#ba1a1a] font-bold">&gt; -0.5 dBFS (Overload Spike)</span>
        </div>
        <div className="w-full h-2 rounded-full overflow-hidden flex">
          <div className="bg-[#002c5f] h-full flex-1" title="<-40 dBFS"></div>
          <div className="bg-[#006780] h-full flex-1" title="-40 to -28 dBFS"></div>
          <div className="bg-[#00AAD2] h-full flex-1" title="-28 to -16 dBFS"></div>
          <div className="bg-[#56d5ff] h-full flex-1" title="-16 to -8 dBFS"></div>
          <div className="bg-[#f59e0b] h-full flex-1" title="-8 to -1 dBFS"></div>
          <div className="bg-[#ba1a1a] h-full flex-1" title=">-0.5 dBFS Clipping"></div>
        </div>
      </div>
    </section>
  );
};
