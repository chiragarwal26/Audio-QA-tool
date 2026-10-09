import React, { useState, useEffect } from 'react';
import { AudioSample, AnomalyItem } from '../types';
import { audioSimulator } from '../services/audioSimulator';
import { AcousticHeatmap } from './AcousticHeatmap';

interface InspectionScreenProps {
  onOpenSampleDetail: (sample: AudioSample) => void;
  samples: AudioSample[];
  anomalies: AnomalyItem[];
  onNavigateToReports: () => void;
}

export const InspectionScreen: React.FC<InspectionScreenProps> = ({
  onOpenSampleDetail,
  samples,
  anomalies,
  onNavigateToReports,
}) => {
  const [isPaused, setIsPaused] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [currentTime, setCurrentTime] = useState(1.42);
  const [progressPercent, setProgressPercent] = useState(76);
  const [processedCount, setProcessedCount] = useState(108);
  const [inspectedSample, setInspectedSample] = useState<AudioSample>(
    samples.find((s) => s.id === 'sample-109') || samples[0]
  );

  const activeSample = inspectedSample;

  useEffect(() => {
    let interval: number;
    if (!isPaused && progressPercent < 100) {
      interval = window.setInterval(() => {
        setProgressPercent((prev) => {
          if (prev >= 99) return 100;
          return prev + 1;
        });
        setProcessedCount((prev) => Math.min(142, prev + 1));
      }, 3000);
    }
    return () => clearInterval(interval);
  }, [isPaused, progressPercent]);

  const handleTogglePlay = () => {
    if (isPlayingAudio) {
      audioSimulator.stop();
      setIsPlayingAudio(false);
    } else {
      setIsPlayingAudio(true);
      audioSimulator.play('clipped', false, (time) => {
        setCurrentTime(time);
      }, () => {
        setIsPlayingAudio(false);
      });
    }
  };

  const handleTogglePauseEvaluation = () => {
    setIsPaused(!isPaused);
  };

  return (
    <div className="flex flex-col w-full px-4 pt-24 pb-36 gap-4 max-w-lg mx-auto">
      {/* Batch Progress Overview Bento Card */}
      <section className="bg-white rounded-2xl p-4 shadow-sm border border-[#c4c6d1]/30 flex flex-col gap-3">
        <div className="flex items-start justify-between">
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span
                className={`w-2 h-2 rounded-full ${
                  isPaused ? 'bg-[#747780]' : 'bg-[#006780] animate-ping'
                }`}
              ></span>
              <span className="font-mono text-[10px] uppercase tracking-wider text-[#006780] font-bold">
                {isPaused ? 'Pipeline Paused' : 'Acoustic Pipeline Active'}
              </span>
            </div>
            <h2 className="text-[17px] text-[#001839] font-bold mt-0.5">
              Batch #HY-2025-084
            </h2>
            <span className="text-[12px] text-[#43474f]">
              IONIQ 7 Beamforming Mic Calibration Suite
            </span>
          </div>

          {/* Circular Progress Ring (Precision SVG) */}
          <div
            onClick={onNavigateToReports}
            className="relative flex items-center justify-center w-14 h-14 cursor-pointer group"
            title="View Final Report"
          >
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 44 44">
              <circle
                className="text-[#e5eeff]"
                cx="22"
                cy="22"
                fill="none"
                r="18"
                stroke="currentColor"
                strokeWidth="3.5"
              ></circle>
              <circle
                className="text-[#006780] transition-all duration-500"
                cx="22"
                cy="22"
                fill="none"
                r="18"
                stroke="currentColor"
                strokeDasharray="113.1"
                strokeDashoffset={113.1 * (1 - progressPercent / 100)}
                strokeLinecap="round"
                strokeWidth="3.5"
              ></circle>
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="font-mono text-[13px] text-[#001839] leading-none font-bold">
                {progressPercent}%
              </span>
            </div>
          </div>
        </div>

        {/* Progress Breakdown Stats */}
        <div className="grid grid-cols-3 gap-2 bg-[#eff4ff] rounded-xl p-2.5 text-center font-mono">
          <div className="flex flex-col">
            <span className="text-[10px] text-[#43474f] uppercase">Processed</span>
            <span className="text-[13px] font-bold text-[#001839] mt-0.5">
              {processedCount}
              <span className="text-[#43474f] font-normal">/142</span>
            </span>
          </div>
          <div className="flex flex-col border-x border-[#c4c6d1]/20">
            <span className="text-[10px] text-[#43474f] uppercase">Elapsed</span>
            <span className="text-[13px] font-bold text-[#001839] mt-0.5">00:14s</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] text-[#43474f] uppercase">Est. Left</span>
            <span className="text-[13px] font-bold text-[#006780] mt-0.5">00:04s</span>
          </div>
        </div>
      </section>

      {/* Live Sample Acoustic Monitor Card */}
      <section className="bg-white rounded-2xl p-4 shadow-sm border border-[#c4c6d1]/30 flex flex-col gap-3">
        {/* Active Sample Metadata */}
        <div className="flex items-center justify-between">
          <div
            className="flex flex-col min-w-0 pr-2 cursor-pointer"
            onClick={() => onOpenSampleDetail(activeSample)}
          >
            <div className="flex items-center gap-1.5">
              <span className="px-1.5 py-0.5 rounded bg-[#e5eeff] text-[#43474f] font-mono text-[10px] uppercase font-semibold">
                PCM · CH4
              </span>
              <span className="font-mono text-[11px] text-[#43474f]">
                Sample 109 of 142
              </span>
            </div>
            <p className="font-mono text-[13px] text-[#001839] truncate mt-0.5 font-bold hover:text-[#006780]">
              raw_beamforming_mic_array_ch4.pcm
            </p>
          </div>
          <button
            type="button"
            onClick={() => onOpenSampleDetail(activeSample)}
            className="flex items-center gap-1 bg-[#ffdad6] text-[#93000a] px-2.5 py-1 rounded-full shrink-0 hover:bg-[#ffdad6]/80"
          >
            <span className="material-symbols-outlined text-[14px]">warning</span>
            <span className="font-mono text-[10px] font-bold tracking-wider">DEFECT</span>
          </button>
        </div>

        {/* Waveform & Real-time Clipping Visualizer (Sunken Dark Telemetry Canvas) */}
        <div
          onClick={handleTogglePlay}
          className="relative bg-[#001839] rounded-xl p-3 overflow-hidden flex flex-col gap-2 cursor-pointer select-none group"
        >
          {/* HUD Header */}
          <div className="flex items-center justify-between text-[#d3e4fe]">
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[#56d5ff] text-[16px]">
                graphic_eq
              </span>
              <span className="font-mono text-[10px] text-[#56d5ff] tracking-wider uppercase font-semibold">
                Waveform Telemetry
              </span>
            </div>
            <span className="font-mono text-[10px] text-[#ba1a1a] bg-[#ffdad6]/30 px-1.5 py-0.5 rounded font-semibold">
              -0.5 dBFS THRESHOLD
            </span>
          </div>

          {/* Realtime Audio Waveform Visual (Electric Cyan + Red Clipping Spikes) */}
          <div className="relative h-24 w-full flex items-center justify-between gap-[2px] pt-1">
            {/* Visual Clipping Threshold Lines */}
            <div className="absolute top-2 inset-x-0 h-[1px] border-b border-dashed border-[#ba1a1a]/70 pointer-events-none"></div>
            <div className="absolute bottom-2 inset-x-0 h-[1px] border-b border-dashed border-[#ba1a1a]/70 pointer-events-none"></div>

            {/* Waveform Bars */}
            <div className="w-1 rounded-full bg-[#56d5ff] h-4 opacity-70"></div>
            <div className="w-1 rounded-full bg-[#56d5ff] h-8 opacity-80"></div>
            <div className="w-1 rounded-full bg-[#56d5ff] h-12"></div>
            <div className="w-1 rounded-full bg-[#56d5ff] h-9 opacity-85"></div>
            <div className="w-1 rounded-full bg-[#56d5ff] h-6 opacity-75"></div>
            <div className="w-1 rounded-full bg-[#56d5ff] h-14"></div>
            <div className="w-1 rounded-full bg-[#56d5ff] h-10"></div>

            {/* Clipping Segment 1 */}
            <div className="w-1.5 rounded-full bg-[#ba1a1a] h-20 shadow-[0_0_8px_rgba(186,26,26,0.8)] animate-pulse"></div>

            <div className="w-1 rounded-full bg-[#56d5ff] h-16"></div>
            <div className="w-1 rounded-full bg-[#56d5ff] h-11"></div>
            <div className="w-1 rounded-full bg-[#56d5ff] h-7 opacity-80"></div>
            <div className="w-1 rounded-full bg-[#56d5ff] h-15"></div>
            <div className="w-1 rounded-full bg-[#56d5ff] h-13"></div>

            {/* Clipping Segment 2 */}
            <div className="w-1.5 rounded-full bg-[#ba1a1a] h-20 shadow-[0_0_8px_rgba(186,26,26,0.8)] animate-pulse"></div>

            <div className="w-1 rounded-full bg-[#56d5ff] h-10"></div>
            <div className="w-1 rounded-full bg-[#56d5ff] h-8 opacity-90"></div>
            <div className="w-1 rounded-full bg-[#56d5ff] h-14"></div>
            <div className="w-1 rounded-full bg-[#56d5ff] h-16"></div>

            {/* Playhead / Scrubber Needle */}
            <div
              className="absolute top-0 bottom-0 w-0.5 bg-[#56d5ff] flex flex-col items-center pointer-events-none transition-all"
              style={{ left: `${(currentTime / 2.9) * 100}%` }}
            >
              <div className="w-2.5 h-2.5 rounded-full bg-[#56d5ff] shadow-[0_0_6px_#56d5ff] -mt-1"></div>
            </div>

            <div className="w-1 rounded-full bg-[#56d5ff]/60 h-11"></div>
            <div className="w-1 rounded-full bg-[#56d5ff]/60 h-7"></div>
            <div className="w-1 rounded-full bg-[#56d5ff]/50 h-5"></div>
            <div className="w-1 rounded-full bg-[#56d5ff]/40 h-8"></div>
            <div className="w-1 rounded-full bg-[#56d5ff]/30 h-4"></div>
            <div className="w-1 rounded-full bg-[#56d5ff]/20 h-3"></div>
          </div>

          {/* Time Stamp Indicator */}
          <div className="flex items-center justify-between text-[#d3e4fe] font-mono text-[10px] pt-1 border-t border-white/10">
            <span>00:01.420</span>
            <span className="text-[#56d5ff] flex items-center gap-1 font-semibold">
              <span className="material-symbols-outlined text-[13px]">
                {isPlayingAudio ? 'volume_up' : 'play_circle'}
              </span>
              SWEEP: 20Hz - 20kHz
            </span>
            <span>00:03.200</span>
          </div>
        </div>

        {/* Mini Spectrogram Preview Strip */}
        <div className="bg-[#eff4ff] rounded-xl p-2.5 flex flex-col gap-1.5 border border-[#c4c6d1]/20">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[10px] uppercase font-bold text-[#43474f]">
              FFT Spectrum Anomaly
            </span>
            <span className="font-mono text-[10px] font-bold text-[#ba1a1a] flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#ba1a1a] animate-ping"></span>
              Harmonic Spike @ 2.4 kHz
            </span>
          </div>

          {/* Spectrogram Bar Graph */}
          <div className="h-10 w-full rounded-lg bg-[#dce9ff] relative overflow-hidden flex items-end px-2 gap-1.5">
            <div className="flex-1 bg-[#006780]/40 h-3 rounded-t-xs"></div>
            <div className="flex-1 bg-[#006780]/50 h-4 rounded-t-xs"></div>
            <div className="flex-1 bg-[#006780]/60 h-6 rounded-t-xs"></div>
            <div className="flex-1 bg-[#006780]/70 h-5 rounded-t-xs"></div>
            <div className="flex-1 bg-[#006780]/80 h-7 rounded-t-xs"></div>
            {/* 2.4 kHz Distortion Peak */}
            <div className="flex-1 bg-[#ba1a1a] h-9 rounded-t-xs relative">
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-[8px] font-mono text-[#ba1a1a] font-bold leading-none">
                2.4k
              </span>
            </div>
            <div className="flex-1 bg-[#006780]/70 h-5 rounded-t-xs"></div>
            <div className="flex-1 bg-[#006780]/50 h-4 rounded-t-xs"></div>
            <div className="flex-1 bg-[#006780]/40 h-3 rounded-t-xs"></div>
            <div className="flex-1 bg-[#006780]/30 h-2 rounded-t-xs"></div>
            <div className="flex-1 bg-[#006780]/20 h-2 rounded-t-xs"></div>
            <div className="flex-1 bg-[#006780]/20 h-1 rounded-t-xs"></div>
          </div>
        </div>
      </section>

      {/* Acoustic Intensity Heatmap Visualization Component */}
      <AcousticHeatmap
        sample={activeSample}
        samples={samples}
        onSelectSample={(s) => setInspectedSample(s)}
        onAuditionSlice={(timeSec) => {
          audioSimulator.stop();
          setIsPlayingAudio(true);
          audioSimulator.play(
            activeSample.hasClipping ? 'clipped' : 'clean',
            false,
            (t) => setCurrentTime(t),
            () => setIsPlayingAudio(false)
          );
        }}
      />

      {/* 2x2 Acoustic Telemetry Metric Cards Grid */}
      <section className="grid grid-cols-2 gap-2.5">
        {/* SNR Ratio */}
        <div className="bg-white rounded-2xl p-3.5 shadow-sm border border-[#c4c6d1]/30 flex flex-col justify-between relative overflow-hidden">
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-amber-500"></div>
          <div className="flex items-center justify-between pl-1">
            <span className="font-mono text-[10px] uppercase font-bold text-[#43474f]">
              SNR Ratio
            </span>
            <span className="material-symbols-outlined text-[16px] text-amber-500">
              warning
            </span>
          </div>
          <div className="pl-1 mt-2">
            <div className="flex items-baseline gap-1">
              <span className="font-mono text-[22px] text-[#001839] font-bold leading-none">
                14.2
              </span>
              <span className="font-mono text-[11px] text-[#43474f] font-semibold">dB</span>
            </div>
            <span className="font-mono text-[10px] text-[#43474f] block mt-1">
              Target: &gt; 18.0 dB
            </span>
          </div>
        </div>

        {/* PESQ Score */}
        <div className="bg-white rounded-2xl p-3.5 shadow-sm border border-[#c4c6d1]/30 flex flex-col justify-between relative overflow-hidden">
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-amber-500"></div>
          <div className="flex items-center justify-between pl-1">
            <span className="font-mono text-[10px] uppercase font-bold text-[#43474f]">
              PESQ Score
            </span>
            <span className="material-symbols-outlined text-[16px] text-amber-500">
              record_voice_over
            </span>
          </div>
          <div className="pl-1 mt-2">
            <div className="flex items-baseline gap-1">
              <span className="font-mono text-[22px] text-[#001839] font-bold leading-none">
                3.12
              </span>
              <span className="font-mono text-[11px] text-[#43474f] font-semibold">/ 5.0</span>
            </div>
            <span className="text-[10px] text-[#43474f] block mt-1 truncate">
              Sub-optimal voice
            </span>
          </div>
        </div>

        {/* Clipping Incidents */}
        <div className="bg-white rounded-2xl p-3.5 shadow-sm border border-[#ba1a1a]/30 flex flex-col justify-between relative overflow-hidden">
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#ba1a1a]"></div>
          <div className="flex items-center justify-between pl-1">
            <span className="font-mono text-[10px] uppercase font-bold text-[#ba1a1a]">
              Clipping
            </span>
            <span className="material-symbols-outlined text-[16px] text-[#ba1a1a]">
              error
            </span>
          </div>
          <div className="pl-1 mt-2">
            <div className="flex items-baseline gap-1">
              <span className="font-mono text-[22px] text-[#ba1a1a] font-bold leading-none">
                3
              </span>
              <span className="font-mono text-[11px] text-[#ba1a1a] font-semibold">
                Peaks
              </span>
            </div>
            <span className="font-mono text-[10px] text-[#43474f] block mt-1 truncate">
              &gt; -0.5 dBFS detected
            </span>
          </div>
        </div>

        {/* THD + N Metric */}
        <div className="bg-white rounded-2xl p-3.5 shadow-sm border border-[#c4c6d1]/30 flex flex-col justify-between relative overflow-hidden">
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-amber-500"></div>
          <div className="flex items-center justify-between pl-1">
            <span className="font-mono text-[10px] uppercase font-bold text-[#43474f]">
              THD + N
            </span>
            <span className="material-symbols-outlined text-[16px] text-amber-500">
              waves
            </span>
          </div>
          <div className="pl-1 mt-2">
            <div className="flex items-baseline gap-1">
              <span className="font-mono text-[22px] text-[#001839] font-bold leading-none">
                4.8
              </span>
              <span className="font-mono text-[11px] text-[#43474f] font-semibold">%</span>
            </div>
            <span className="text-[10px] text-[#43474f] block mt-1 truncate">
              Acoustic distortion
            </span>
          </div>
        </div>
      </section>

      {/* Live Anomaly Stream (Realtime Feed) */}
      <section className="bg-white rounded-2xl p-4 shadow-sm border border-[#c4c6d1]/30 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[#006780] text-[20px]">
              troubleshoot
            </span>
            <h3 className="text-[15px] text-[#001839] font-bold">
              Live Anomaly Stream
            </h3>
          </div>
          <span className="font-mono text-[10px] text-[#43474f] uppercase tracking-wider">
            Realtime Feed
          </span>
        </div>

        <div className="flex flex-col gap-2">
          {anomalies.map((item) => {
            const matchedSample =
              samples.find((s) => s.id === item.sampleId) || samples[0];

            return (
              <div
                key={item.id}
                onClick={() => onOpenSampleDetail(matchedSample)}
                className="flex items-start gap-2.5 p-2.5 rounded-xl bg-[#eff4ff] hover:bg-[#dce9ff] transition-all cursor-pointer border border-[#c4c6d1]/20 shadow-2xs group"
              >
                <span
                  className={`mt-0.5 px-1.5 py-0.5 rounded font-mono text-[10px] font-bold tracking-wider shrink-0 ${
                    item.type === 'ALERT'
                      ? 'bg-[#ffdad6] text-[#93000a]'
                      : item.type === 'WARN'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-emerald-100 text-emerald-800'
                  }`}
                >
                  {item.type}
                </span>

                <div className="flex flex-col min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[11px] font-bold text-[#001839] group-hover:text-[#006780]">
                      Sample #{item.sampleNumber}
                    </span>
                    <span className="font-mono text-[10px] text-[#43474f]">
                      {item.format}
                    </span>
                  </div>
                  <p className="text-[12px] text-[#0b1c30] truncate mt-0.5">
                    {item.description}
                  </p>
                </div>

                <span className="material-symbols-outlined text-[16px] text-[#43474f] group-hover:text-[#006780] mt-1">
                  chevron_right
                </span>
              </div>
            );
          })}
        </div>
      </section>

      {/* Quick Engineering Transport Controls */}
      <section className="flex items-center gap-2 mt-1">
        {/* Pause / Resume Button */}
        <button
          type="button"
          onClick={handleTogglePauseEvaluation}
          className={`flex-1 min-h-[48px] rounded-xl px-4 py-2.5 flex items-center justify-center gap-2 text-white font-semibold text-[14px] shadow-sm active:scale-98 transition-all ${
            isPaused ? 'bg-[#006780] hover:bg-[#005a71]' : 'bg-[#001839] hover:bg-[#002c5f]'
          }`}
        >
          <span className="material-symbols-outlined text-[20px]">
            {isPaused ? 'play_arrow' : 'pause'}
          </span>
          <span>{isPaused ? 'Resume Sweep' : 'Pause Evaluation'}</span>
        </button>

        {/* Skip Sample Button */}
        <button
          type="button"
          onClick={() => {
            // Next sample
            const nextIdx = (samples.findIndex((s) => s.id === activeSample.id) + 1) % samples.length;
            onOpenSampleDetail(samples[nextIdx]);
          }}
          className="min-h-[48px] px-4 bg-[#e5eeff] hover:bg-[#dce9ff] text-[#0b1c30] rounded-xl flex items-center justify-center gap-1 font-semibold text-[13px] active:scale-95 transition-all"
        >
          <span className="material-symbols-outlined text-[20px]">skip_next</span>
          <span>Skip</span>
        </button>

        {/* Reports Navigation Trigger */}
        <button
          type="button"
          onClick={onNavigateToReports}
          className="min-h-[48px] w-12 bg-[#e5eeff] hover:bg-[#dce9ff] text-[#002c5f] rounded-xl flex items-center justify-center active:scale-95 transition-all"
          title="Open Defect Report"
        >
          <span className="material-symbols-outlined text-[22px]">list_alt</span>
        </button>
      </section>
    </div>
  );
};
