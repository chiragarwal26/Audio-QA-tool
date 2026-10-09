import React, { useState, useEffect } from 'react';
import { AudioSample } from '../types';
import { audioSimulator } from '../services/audioSimulator';

interface SampleDetailInspectorProps {
  sample: AudioSample;
  onBack: () => void;
}

export const SampleDetailInspector: React.FC<SampleDetailInspectorProps> = ({
  sample,
  onBack,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(1.42);
  const [zoomLevel, setZoomLevel] = useState<'1x' | '2x' | '5x'>('1x');
  const [isDeClipped, setIsDeClipped] = useState(false);
  const [isLooping, setIsLooping] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const duration = 2.90;

  useEffect(() => {
    return () => {
      audioSimulator.stop();
    };
  }, []);

  const togglePlayback = () => {
    if (isPlaying) {
      audioSimulator.stop();
      setIsPlaying(false);
    } else {
      setIsPlaying(true);
      audioSimulator.play(
        sample.hasClipping ? 'clipped' : 'clean',
        isDeClipped,
        (time) => {
          setCurrentTime(time);
        },
        () => {
          if (isLooping) {
            togglePlayback();
          } else {
            setIsPlaying(false);
            setCurrentTime(1.42);
          }
        }
      );
    }
  };

  const handleDeClipToggle = () => {
    const nextState = !isDeClipped;
    setIsDeClipped(nextState);
    if (isPlaying) {
      // Re-trigger audio with filter active
      audioSimulator.play(
        sample.hasClipping ? 'clipped' : 'clean',
        nextState,
        (time) => setCurrentTime(time),
        () => setIsPlaying(false)
      );
    }
    showToast(
      nextState
        ? 'DSP Biquad De-Clip Filter Active: Harmonic flaring suppressed'
        : 'Reverted to Raw Sensor Capture (Unfiltered)'
    );
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2600);
  };

  const formattedTime =
    currentTime < 10
      ? `00:0${currentTime.toFixed(2)}`
      : `00:${currentTime.toFixed(2)}`;

  const percentProgress = Math.min(100, Math.max(0, (currentTime / duration) * 100));

  return (
    <div className="flex flex-col w-full px-4 pt-20 pb-36 gap-4 max-w-lg mx-auto">
      {/* Top Forensic Identification Banner */}
      <div className="flex flex-col gap-1.5 pt-2">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 min-w-0">
            <span className="inline-flex items-center justify-center w-6 h-6 rounded-lg bg-[#ffdad6] text-[#93000a] shrink-0">
              <span className="material-symbols-outlined text-[16px]">crisis_alert</span>
            </span>
            <span className="font-mono text-[11px] text-[#ba1a1a] font-bold uppercase tracking-wider truncate">
              File #{sample.sampleNumber} · {sample.severity === 'critical' ? 'CRITICAL SEVERITY' : 'INSPECTION'}
            </span>
          </div>
          <span className="inline-flex items-center px-2 py-0.5 rounded bg-[#dce9ff] text-[#43474f] font-mono text-[10px] shrink-0 font-semibold">
            {sample.micPosition}
          </span>
        </div>

        <div className="flex items-baseline justify-between gap-2">
          <h2 className="font-mono text-[14px] text-[#001839] font-bold tracking-tight truncate">
            {sample.filename}
          </h2>
          <span className="font-mono text-[10px] text-[#006780] font-bold shrink-0">
            {sample.pipeline}
          </span>
        </div>
      </div>

      {/* Primary Visualizer Deck: Oscillogram & Spectrogram Engine */}
      <div className="bg-[#001839] text-white rounded-2xl p-4 shadow-md flex flex-col gap-3 relative overflow-hidden">
        {/* Telemetry Sub-header & Visual Zoom Controls */}
        <div className="flex items-center justify-between gap-2 border-b border-white/10 pb-2">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#56d5ff] animate-pulse"></span>
            <span className="font-mono text-[10px] text-[#56d5ff] uppercase tracking-wider font-bold">
              Dual Channel Scope
            </span>
            <span className="text-[#7695ce] font-mono text-[10px]">
              | {sample.sampleRate} / {sample.bitDepth}
            </span>
          </div>

          {/* Zoom Controls */}
          <div className="flex items-center bg-[#002c5f] rounded-lg p-0.5">
            {(['1x', '2x', '5x'] as const).map((lvl) => (
              <button
                key={lvl}
                type="button"
                onClick={() => setZoomLevel(lvl)}
                className={`px-2 py-0.5 rounded font-mono text-[10px] font-bold transition-all ${
                  zoomLevel === lvl
                    ? 'bg-[#006780] text-white shadow-xs'
                    : 'text-[#7695ce] hover:text-white'
                }`}
              >
                {lvl}
              </button>
            ))}
          </div>
        </div>

        {/* Scope Canvas 1: Amplitude Envelope Waveform with Clipping Indicators */}
        <div className="flex flex-col gap-1">
          <div className="flex justify-between items-center text-[#7695ce]">
            <span className="font-mono text-[10px] uppercase tracking-wider">
              1. Amplitude Envelope (RMS / Peak)
            </span>
            <span className="font-mono text-[10px] text-[#ffdad6] font-bold">
              {isDeClipped ? 'HARMONICS DAMPED (SAFE)' : '2 CLIPPED REGIONS DETECTED'}
            </span>
          </div>

          <div
            onClick={togglePlayback}
            className="relative w-full h-24 bg-[#002538] rounded-xl overflow-hidden flex items-center justify-center cursor-pointer select-none"
          >
            {/* Ambient Grid Overlay */}
            <svg className="absolute inset-0 w-full h-full opacity-20 pointer-events-none">
              <line stroke="#fff" strokeDasharray="2 3" strokeWidth="0.5" x1="0" x2="100%" y1="20%" y2="20%"></line>
              <line stroke="#fff" strokeWidth="0.8" x1="0" x2="100%" y1="50%" y2="50%"></line>
              <line stroke="#fff" strokeDasharray="2 3" strokeWidth="0.5" x1="0" x2="100%" y1="80%" y2="80%"></line>
              <line stroke="#fff" strokeDasharray="2 4" strokeWidth="0.5" x1="25%" x2="25%" y1="0" y2="100%"></line>
              <line stroke="#fff" strokeDasharray="2 4" strokeWidth="0.5" x1="50%" x2="50%" y1="0" y2="100%"></line>
              <line stroke="#fff" strokeDasharray="2 4" strokeWidth="0.5" x1="75%" x2="75%" y1="0" y2="100%"></line>
            </svg>

            {/* 0 dBFS Limit Indicators */}
            <div className="absolute top-1 left-2 font-mono text-[9px] text-[#ffdad6] opacity-90 font-bold">
              {isDeClipped ? '-1.2 dBFS [PAD ACTIVE]' : '+0.8 dBFS [PEAK]'}
            </div>
            <div className="absolute bottom-1 left-2 font-mono text-[9px] text-[#c4c6d1] opacity-60">
              -oo dBFS
            </div>

            {/* Highlight Overlays for Clipping (t=1.12s and t=2.04s) */}
            {!isDeClipped && (
              <>
                <div className="absolute top-0 bottom-0 left-[36%] w-[12%] bg-[#ba1a1a]/35 flex flex-col justify-between items-center py-1 border-x border-[#ba1a1a]/40">
                  <span className="font-mono text-[9px] text-white bg-[#ba1a1a] px-1 rounded font-bold">
                    1.12s
                  </span>
                  <span className="font-mono text-[9px] text-white font-bold">CLIP</span>
                </div>
                <div className="absolute top-0 bottom-0 left-[68%] w-[10%] bg-[#ba1a1a]/35 flex flex-col justify-between items-center py-1 border-x border-[#ba1a1a]/40">
                  <span className="font-mono text-[9px] text-white bg-[#ba1a1a] px-1 rounded font-bold">
                    2.04s
                  </span>
                  <span className="font-mono text-[9px] text-white font-bold">CLIP</span>
                </div>
              </>
            )}

            {/* High-Definition Vector Waveform */}
            <svg
              className={`w-full h-full pointer-events-none transition-transform duration-300 ${
                zoomLevel === '2x' ? 'scale-125' : zoomLevel === '5x' ? 'scale-150' : ''
              }`}
              preserveAspectRatio="none"
              viewBox="0 0 400 100"
            >
              {/* RMS Base Layer */}
              <path
                d="M0,50 Q15,46 30,52 T60,49 T90,54 T120,44 T145,28 T155,10 T165,10 T175,25 T190,48 T220,53 T250,42 T270,12 T285,12 T300,38 T330,52 T360,47 T400,50 L400,50 L0,50 Z"
                fill="#00AAD2"
                opacity={isDeClipped ? '0.2' : '0.35'}
              ></path>
              <path
                d="M0,50 Q15,54 30,48 T60,51 T90,46 T120,56 T145,72 T155,90 T165,90 T175,75 T190,52 T220,47 T250,58 T270,88 T285,88 T300,62 T330,48 T360,53 T400,50 L400,50 L0,50 Z"
                fill="#00AAD2"
                opacity={isDeClipped ? '0.2' : '0.35'}
              ></path>

              {/* Dynamic Peak Transients */}
              <polyline
                fill="none"
                points="0,50 10,48 20,52 30,44 40,56 50,42 60,58 70,39 80,61 90,46 100,54 110,35 120,65 130,28 140,72 145,15 148,4 153,0 162,0 167,4 172,20 180,82 190,40 200,60 210,38 220,62 230,45 240,55 250,30 260,70 268,14 274,0 282,0 288,10 295,35 305,75 315,44 325,56 335,42 345,58 355,47 365,53 380,48 400,50"
                stroke={isDeClipped ? '#3e9ec9' : '#56d5ff'}
                strokeWidth={isDeClipped ? '1.2' : '1.5'}
              ></polyline>
              <polyline
                fill="none"
                points="0,50 10,52 20,48 30,56 40,44 50,58 60,42 70,61 80,39 90,54 100,46 110,65 120,35 130,72 140,28 145,85 148,96 153,100 162,100 167,96 172,80 180,18 190,60 200,40 210,62 220,38 230,55 240,45 250,70 260,30 268,86 274,100 282,100 288,90 295,65 305,25 315,56 325,44 335,58 345,42 355,53 365,47 380,52 400,50"
                stroke={isDeClipped ? '#3e9ec9' : '#56d5ff'}
                strokeWidth={isDeClipped ? '1.2' : '1.5'}
              ></polyline>

              {/* Red Flatline Clips if not filtered */}
              {!isDeClipped && (
                <>
                  <line stroke="#ffdad6" strokeWidth="3" x1="151" x2="164" y1="2" y2="2"></line>
                  <line stroke="#ffdad6" strokeWidth="3" x1="151" x2="164" y1="98" y2="98"></line>
                  <line stroke="#ffdad6" strokeWidth="3" x1="272" x2="284" y1="2" y2="2"></line>
                  <line stroke="#ffdad6" strokeWidth="3" x1="272" x2="284" y1="98" y2="98"></line>
                </>
              )}
            </svg>

            {/* Interactive Scrubber Playhead */}
            <div
              className="absolute top-0 bottom-0 w-0.5 bg-[#56d5ff] flex flex-col items-center pointer-events-none transition-all duration-75"
              style={{ left: `${percentProgress}%` }}
            >
              <div className="w-2.5 h-2.5 bg-[#56d5ff] rounded-full -mt-1 shadow-[0_0_6px_#56d5ff]"></div>
              <div className="w-1.5 h-1.5 bg-white rounded-full -mt-2"></div>
            </div>
          </div>
        </div>

        {/* Scope Canvas 2: High-Resolution Mel-Spectrogram (0 Hz - 24 kHz) */}
        <div className="flex flex-col gap-1">
          <div className="flex justify-between items-center text-[#7695ce]">
            <div className="flex items-center gap-1.5">
              <span className="font-mono text-[10px] uppercase tracking-wider">
                2. Mel-Spectrogram (0 Hz — 24 kHz)
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#006780]"></span>
              <span className="font-mono text-[10px] text-[#56d5ff]">FFT 2048 / Hann</span>
            </div>
            <span className="font-mono text-[10px] text-[#c1e8ff] font-semibold">
              {isDeClipped ? 'Flaring Filtered' : 'Harmonic Flaring Active'}
            </span>
          </div>

          <div className="relative w-full h-28 rounded-xl overflow-hidden bg-[#001839]">
            <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 300 120">
              <defs>
                <linearGradient id="roadRumble" x1="0" x2="0" y1="1" y2="0">
                  <stop offset="0%" stopColor="#ba1a1a" stopOpacity="0.95"></stop>
                  <stop offset="25%" stopColor="#006780" stopOpacity="0.7"></stop>
                  <stop offset="60%" stopColor="#002c5f" stopOpacity="0.4"></stop>
                  <stop offset="100%" stopColor="#001839" stopOpacity="0.05"></stop>
                </linearGradient>
                <radialGradient cx="38%" cy="50%" id="clippingBurst1" r="40%">
                  <stop offset="0%" stopColor="#ffdad6" stopOpacity={isDeClipped ? '0.1' : '0.9'}></stop>
                  <stop offset="30%" stopColor="#ba1a1a" stopOpacity={isDeClipped ? '0.05' : '0.75'}></stop>
                  <stop offset="70%" stopColor="#006780" stopOpacity="0.3"></stop>
                  <stop offset="100%" stopColor="transparent" stopOpacity="0"></stop>
                </radialGradient>
                <radialGradient cx="71%" cy="50%" id="clippingBurst2" r="35%">
                  <stop offset="0%" stopColor="#ffdad6" stopOpacity={isDeClipped ? '0.1' : '0.9'}></stop>
                  <stop offset="30%" stopColor="#ba1a1a" stopOpacity={isDeClipped ? '0.05' : '0.75'}></stop>
                  <stop offset="70%" stopColor="#006780" stopOpacity="0.3"></stop>
                  <stop offset="100%" stopColor="transparent" stopOpacity="0"></stop>
                </radialGradient>
              </defs>

              {/* Base Acoustic Floor */}
              <rect fill="#001839" height="120" width="300"></rect>

              {/* Road Rumble Base Frequency (<200Hz) */}
              <rect fill="url(#roadRumble)" height="28" width="300" y="92"></rect>

              {/* Speech Formant Tracks (300Hz - 3.4kHz) */}
              <path
                d="M10,88 Q40,82 80,85 T140,80 T200,86 T260,82 T300,84"
                fill="none"
                opacity="0.65"
                stroke="#56d5ff"
                strokeLinecap="round"
                strokeWidth="4"
              ></path>
              <path
                d="M10,72 Q50,68 90,73 T150,67 T210,71 T270,68 T300,72"
                fill="none"
                opacity="0.55"
                stroke="#77d1fe"
                strokeLinecap="round"
                strokeWidth="3"
              ></path>
              <path
                d="M15,55 Q60,50 110,54 T170,48 T230,52 T285,49 T300,53"
                fill="none"
                opacity="0.45"
                stroke="#3e9ec9"
                strokeLinecap="round"
                strokeWidth="2"
              ></path>

              {/* Severe Harmonic Flares */}
              {!isDeClipped && (
                <>
                  <rect fill="url(#clippingBurst1)" height="120" width="35" x="110" y="0"></rect>
                  <rect fill="url(#clippingBurst2)" height="120" width="30" x="206" y="0"></rect>
                  <line opacity="0.8" stroke="#ffdad6" strokeDasharray="1 2" strokeWidth="0.7" x1="127" x2="127" y1="0" y2="120"></line>
                  <line opacity="0.8" stroke="#ffdad6" strokeDasharray="1 2" strokeWidth="0.7" x1="221" x2="221" y1="0" y2="120"></line>
                </>
              )}
            </svg>

            {/* Frequency Axis Labels */}
            <div className="absolute right-2 top-1 bottom-1 flex flex-col justify-between text-right pointer-events-none font-mono text-[9px]">
              <span className="text-[#c1e8ff] font-bold">24 kHz</span>
              <span className="text-[#7695ce]">12 kHz</span>
              <span className="text-[#7695ce]">4 kHz</span>
              <span className="text-[#ffdad6] font-bold">120 Hz [RUMBLE]</span>
            </div>

            {/* Playhead tracking line on spectrogram */}
            <div
              className="absolute top-0 bottom-0 w-0.5 bg-[#56d5ff]/70 pointer-events-none transition-all duration-75"
              style={{ left: `${percentProgress}%` }}
            ></div>
          </div>
        </div>

        {/* Integrated Scrubbing & Audio Playback Toolbar */}
        <div className="flex items-center justify-between gap-2 pt-2 border-t border-white/10">
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={togglePlayback}
              className="w-10 h-10 rounded-full bg-[#006780] hover:bg-[#005a71] text-white flex items-center justify-center active:scale-95 transition-all shadow-md"
              title={isPlaying ? 'Pause' : 'Play Audition'}
            >
              <span className="material-symbols-outlined text-[20px]">
                {isPlaying ? 'pause' : 'play_arrow'}
              </span>
            </button>
            <button
              type="button"
              onClick={() => setCurrentTime((t) => Math.max(0, t - 1))}
              className="w-8 h-8 rounded-lg bg-[#002c5f] hover:bg-[#001839] text-white flex items-center justify-center transition-all"
              title="Rewind 1s"
            >
              <span className="material-symbols-outlined text-[16px]">replay_10</span>
            </button>
            <button
              type="button"
              onClick={() => setCurrentTime((t) => Math.min(duration, t + 1))}
              className="w-8 h-8 rounded-lg bg-[#002c5f] hover:bg-[#001839] text-white flex items-center justify-center transition-all"
              title="Fast Forward 1s"
            >
              <span className="material-symbols-outlined text-[16px]">forward_10</span>
            </button>
          </div>

          {/* Time Code Readout */}
          <div className="flex items-center gap-1.5 bg-[#002c5f] px-3 py-1.5 rounded-lg border border-white/10">
            <span className="material-symbols-outlined text-[14px] text-[#56d5ff]">timer</span>
            <span className="font-mono text-[12px] font-bold text-white">
              {formattedTime}
            </span>
            <span className="text-[#7695ce] font-mono text-[11px]">/ 00:02.90</span>
          </div>

          {/* Loop toggle */}
          <button
            type="button"
            onClick={() => setIsLooping(!isLooping)}
            className={`px-2 py-1.5 rounded-lg font-mono text-[10px] font-bold flex items-center gap-1 transition-all ${
              isLooping
                ? 'bg-[#006780] text-white'
                : 'bg-[#002c5f] text-[#56d5ff] hover:bg-[#001839]'
            }`}
          >
            <span className="material-symbols-outlined text-[14px]">repeat</span>
            <span className="hidden xs:inline">LOOP</span>
          </button>
        </div>
      </div>

      {/* Codec & Container Telemetry */}
      <div className="bg-[#eff4ff] rounded-2xl p-4 flex flex-col gap-2 border border-[#c4c6d1]/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[#006780] text-[18px]">
              graphic_eq
            </span>
            <span className="text-[14px] font-bold text-[#001839]">
              Codec & Container Telemetry
            </span>
          </div>
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#d3e4fe] text-[#006780] font-mono text-[10px] font-bold">
            <span className="w-1.5 h-1.5 rounded-full bg-[#006780]"></span> HEADER OK
          </span>
        </div>

        <div className="grid grid-cols-3 gap-2 mt-1">
          <div className="bg-white p-2.5 rounded-xl border border-[#c4c6d1]/20 flex flex-col font-mono">
            <span className="text-[9px] uppercase text-[#747780]">CONTAINER</span>
            <span className="text-[11px] font-bold text-[#001839]">RIFF .WAV</span>
            <span className="text-[9px] text-[#43474f]">PCM Little-Endian</span>
          </div>
          <div className="bg-white p-2.5 rounded-xl border border-[#c4c6d1]/20 flex flex-col font-mono">
            <span className="text-[9px] uppercase text-[#747780]">DEPTH / RATE</span>
            <span className="text-[11px] font-bold text-[#001839]">24-bit / 48kHz</span>
            <span className="text-[9px] text-[#43474f]">Single Channel</span>
          </div>
          <div className="bg-white p-2.5 rounded-xl border border-[#c4c6d1]/20 flex flex-col font-mono">
            <span className="text-[9px] uppercase text-[#747780]">BITRATE</span>
            <span className="text-[11px] font-bold text-[#001839]">1,152 kbps</span>
            <span className="text-[9px] text-[#43474f]">Uncompressed</span>
          </div>
        </div>
      </div>

      {/* Classified Defect Diagnosis */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-[#c4c6d1]/30 flex flex-col gap-3">
        <div className="flex items-center justify-between border-b border-[#c4c6d1]/20 pb-2">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#ba1a1a] animate-ping"></span>
            <h3 className="text-[15px] font-bold text-[#001839]">
              Classified Defect Diagnosis
            </h3>
          </div>
          <span className="font-mono text-[10px] bg-[#ffdad6] text-[#93000a] px-2 py-0.5 rounded font-bold">
            2 DEFECTS LOGGED
          </span>
        </div>

        {/* Defect 1 */}
        <div className="bg-[#eff4ff] rounded-xl p-3 flex flex-col gap-1 border border-[#c4c6d1]/20">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-1.5">
              <span className="font-mono text-[10px] font-bold px-1.5 py-0.5 rounded bg-[#ba1a1a] text-white">
                P01
              </span>
              <span className="text-[13px] font-bold text-[#001839]">
                Hard Digital Peak Clipping
              </span>
            </div>
            <span className="font-mono text-[11px] text-[#ba1a1a] font-bold">
              {isDeClipped ? '-1.2 dBFS (Normalized)' : '+0.8 dBFS'}
            </span>
          </div>
          <p className="text-[11px] text-[#43474f] leading-relaxed">
            Pre-amp gain in Sunvisor Node #2 exceeds DSP saturation threshold. Transients at
            1.12s and 2.04s clipped across 28 consecutive samples, resulting in square-wave
            harmonic flaring up to 22kHz.
          </p>
        </div>

        {/* Defect 2 */}
        <div className="bg-[#eff4ff] rounded-xl p-3 flex flex-col gap-1 border border-[#c4c6d1]/20">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-1.5">
              <span className="font-mono text-[10px] font-bold px-1.5 py-0.5 rounded bg-[#ffdad6] text-[#93000a]">
                P04
              </span>
              <span className="text-[13px] font-bold text-[#001839]">
                In-Cabin Acoustic Reverberation
              </span>
            </div>
            <span className="font-mono text-[11px] text-[#ba1a1a] font-bold">RT60: 420 ms</span>
          </div>
          <p className="text-[11px] text-[#43474f] leading-relaxed">
            Reflections from driver-side windshield rake angle exceeding baseline nominal
            threshold of 250ms, causing temporal smear across consonants in speech prompts.
          </p>
        </div>

        {/* Voice AI Impact Warning Module */}
        <div className="bg-[#ffdad6]/40 rounded-xl p-3 flex items-start gap-2.5 border border-[#ba1a1a]/20">
          <span className="material-symbols-outlined text-[#ba1a1a] text-[22px] shrink-0 mt-0.5">
            warning
          </span>
          <div className="flex flex-col gap-0.5">
            <span className="text-[13px] text-[#93000a] font-bold">
              Speech Recognition Impact
            </span>
            <p className="text-[11px] text-[#93000a] leading-tight">
              Estimated Wake-Word{' '}
              <strong className="underline decoration-[#ba1a1a]">"Hey Hyundai"</strong>{' '}
              false reject rate increased by{' '}
              <strong className="font-mono">+28.4%</strong> under 80 km/h highway cabin
              conditions.
            </p>
          </div>
        </div>
      </div>

      {/* Acoustic Benchmark Verification Table */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-[#c4c6d1]/30 flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <h3 className="text-[15px] font-bold text-[#001839]">
            Acoustic Benchmark Verification
          </h3>
          <span className="font-mono text-[10px] text-[#747780]">CALIBRATION ISO 3382-1</span>
        </div>

        <div className="w-full flex flex-col font-mono text-[11px]">
          {/* Table Header */}
          <div className="grid grid-cols-4 pb-2 border-b border-[#c4c6d1]/30 text-[#747780] text-[9px] uppercase tracking-wider font-bold">
            <span>Metric</span>
            <span className="text-center">Measured</span>
            <span className="text-center">Target</span>
            <span className="text-right">Verdict</span>
          </div>

          {/* Row 1: SNR */}
          <div className="grid grid-cols-4 py-2 items-center border-b border-[#eff4ff]">
            <div className="flex flex-col">
              <span className="font-bold text-[#001839]">SNR</span>
              <span className="text-[9px] text-[#43474f]">Signal-to-Noise</span>
            </div>
            <span className="text-center font-bold text-[#ba1a1a]">11.4 dB</span>
            <span className="text-center text-[#747780]">&gt; 18.0 dB</span>
            <div className="flex justify-end">
              <span className="px-2 py-0.5 rounded bg-[#ba1a1a] text-white text-[9px] font-bold">
                FAIL
              </span>
            </div>
          </div>

          {/* Row 2: PESQ MOS */}
          <div className="grid grid-cols-4 py-2 items-center border-b border-[#eff4ff]">
            <div className="flex flex-col">
              <span className="font-bold text-[#001839]">PESQ MOS</span>
              <span className="text-[9px] text-[#43474f]">Speech Quality</span>
            </div>
            <span className="text-center font-bold text-[#ba1a1a]">2.41</span>
            <span className="text-center text-[#747780]">&gt; 3.50</span>
            <div className="flex justify-end">
              <span className="px-2 py-0.5 rounded bg-[#ba1a1a] text-white text-[9px] font-bold">
                FAIL
              </span>
            </div>
          </div>

          {/* Row 3: THD+N */}
          <div className="grid grid-cols-4 py-2 items-center border-b border-[#eff4ff]">
            <div className="flex flex-col">
              <span className="font-bold text-[#001839]">THD+N</span>
              <span className="text-[9px] text-[#43474f]">Harmonic Distortion</span>
            </div>
            <span className="text-center font-bold text-[#ba1a1a]">6.2%</span>
            <span className="text-center text-[#747780]">&lt; 1.5%</span>
            <div className="flex justify-end">
              <span className="px-2 py-0.5 rounded bg-[#ba1a1a] text-white text-[9px] font-bold">
                FAIL
              </span>
            </div>
          </div>

          {/* Row 4: True Peak */}
          <div className="grid grid-cols-4 py-2 items-center">
            <div className="flex flex-col">
              <span className="font-bold text-[#001839]">True Peak</span>
              <span className="text-[9px] text-[#43474f]">ITU-R BS.1770</span>
            </div>
            <span
              className={`text-center font-bold ${
                isDeClipped ? 'text-emerald-600' : 'text-[#ba1a1a]'
              }`}
            >
              {isDeClipped ? '-1.2 dBFS' : '+0.8 dBFS'}
            </span>
            <span className="text-center text-[#747780]">&lt; -1.0 dBFS</span>
            <div className="flex justify-end">
              <span
                className={`px-2 py-0.5 rounded text-white text-[9px] font-bold ${
                  isDeClipped ? 'bg-emerald-600' : 'bg-[#ba1a1a]'
                }`}
              >
                {isDeClipped ? 'PASS' : 'FAIL'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Test Lead Observation */}
      <div className="bg-[#dce9ff]/60 rounded-2xl p-3.5 flex items-center justify-between gap-3 border border-[#c4c6d1]/20">
        <div className="flex items-center gap-2.5 min-w-0">
          <span className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-[#002c5f] shrink-0 shadow-xs">
            <span className="material-symbols-outlined text-[18px]">engineering</span>
          </span>
          <div className="flex flex-col min-w-0">
            <span className="text-[12px] text-[#001839] font-bold">
              Test Lead Observation
            </span>
            <span className="text-[11px] text-[#43474f] truncate">
              "{sample.leadObservation || 'Recommend gain pad -4.5dB on MIC2 input branch.'}"
            </span>
          </div>
        </div>
        <span className="font-mono text-[10px] text-[#006780] font-bold shrink-0 bg-white px-2 py-1 rounded">
          B3B-ENG
        </span>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col gap-2 pt-1">
        {/* Primary CTA: DSP De-Clip Filter Preview */}
        <button
          type="button"
          onClick={handleDeClipToggle}
          className={`w-full py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 shadow-md active:scale-[0.99] transition-all font-semibold text-[14px] ${
            isDeClipped
              ? 'bg-emerald-700 hover:bg-emerald-800 text-white'
              : 'bg-[#002c5f] hover:bg-[#001839] text-white'
          }`}
        >
          <span className="material-symbols-outlined text-[20px] text-[#56d5ff]">
            auto_fix_high
          </span>
          <span>
            {isDeClipped
              ? 'De-Clip Filter Applied (-4.5dB Active)'
              : 'Apply DSP De-Clip Filter Preview'}
          </span>
        </button>

        {/* Secondary Actions */}
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => showToast('Sample #102 tagged for wake-word acoustic retraining')}
            className="w-full py-2.5 px-3 rounded-xl bg-white hover:bg-[#eff4ff] text-[#001839] border border-[#c4c6d1]/30 active:scale-95 font-semibold text-[12px] flex items-center justify-center gap-1.5 transition-all shadow-xs"
          >
            <span className="material-symbols-outlined text-[18px] text-[#ba1a1a]">
              label_important
            </span>
            <span>Tag for Retraining</span>
          </button>

          <button
            type="button"
            onClick={() => showToast('Downloading raw 24-bit/48kHz WAV stream...')}
            className="w-full py-2.5 px-3 rounded-xl bg-white hover:bg-[#eff4ff] text-[#001839] border border-[#c4c6d1]/30 active:scale-95 font-semibold text-[12px] flex items-center justify-center gap-1.5 transition-all shadow-xs"
          >
            <span className="material-symbols-outlined text-[18px] text-[#006780]">
              download
            </span>
            <span>Download Raw .WAV</span>
          </button>
        </div>
      </div>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-20 left-4 right-4 z-50 max-w-sm mx-auto">
          <div className="bg-[#213145] text-[#eaf1ff] px-4 py-2.5 rounded-xl shadow-2xl flex items-center justify-between border border-white/10">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#56d5ff] text-[18px]">
                check_circle
              </span>
              <span className="text-[12px] font-medium">{toastMessage}</span>
            </div>
            <span className="font-mono text-[9px] text-[#abc7ff] uppercase">
              AQE SYS
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
