import React, { useState, useRef } from 'react';
import { AudioSample, EngineToggle } from '../types';
import { audioSimulator } from '../services/audioSimulator';

interface UploadScreenProps {
  samples: AudioSample[];
  engines: EngineToggle[];
  onToggleEngine: (id: string) => void;
  onSelectAllEngines: () => void;
  onOpenSampleDetail: (sample: AudioSample) => void;
  onStartBatch: () => void;
  activeFilter: string;
  setActiveFilter: (filter: string) => void;
}

export const UploadScreen: React.FC<UploadScreenProps> = ({
  samples,
  engines,
  onToggleEngine,
  onSelectAllEngines,
  onOpenSampleDetail,
  onStartBatch,
  activeFilter,
  setActiveFilter,
}) => {
  const [playingSampleId, setPlayingSampleId] = useState<string | null>(null);
  const [isDispatching, setIsDispatching] = useState(false);
  const [dispatchText, setDispatchText] = useState('Start Batch Analysis');
  const [showPcmModal, setShowPcmModal] = useState(false);
  const [pcmConfig, setPcmConfig] = useState({
    sampleRate: '48,000 Hz',
    byteOrder: 'Little-Endian',
    channels: '4-Ch Interleaved',
    bitDepth: '16-bit Signed'
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const filteredSamples = samples.filter((s) => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'wav') return s.format === 'wav';
    if (activeFilter === 'mp3') return s.format === 'mp3';
    if (activeFilter === 'pcm') return s.format === 'pcm';
    return true;
  });

  const handlePlayToggle = (sample: AudioSample) => {
    if (playingSampleId === sample.id) {
      audioSimulator.stop();
      setPlayingSampleId(null);
    } else {
      setPlayingSampleId(sample.id);
      const isClipped = sample.hasClipping;
      audioSimulator.play(
        isClipped ? 'clipped' : 'clean',
        false,
        undefined,
        () => setPlayingSampleId(null)
      );
    }
  };

  const handleStartAnalysis = () => {
    setIsDispatching(true);
    setDispatchText('Dispatching CUDA Pipeline...');
    setTimeout(() => {
      setDispatchText('Sweep Dispatched!');
      setTimeout(() => {
        setIsDispatching(false);
        setDispatchText('Start Batch Analysis');
        onStartBatch();
      }, 1000);
    }, 1200);
  };

  return (
    <div className="flex flex-col w-full px-4 pt-24 pb-36 gap-4 max-w-lg mx-auto">
      {/* STEP 1: Active Acoustic Test Cell Configuration */}
      <section className="bg-white border border-[#c4c6d1]/30 rounded-2xl p-4 shadow-sm relative overflow-hidden">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5">
            <span className="w-5 h-5 rounded-full bg-[#002c5f] text-white font-mono text-[10px] flex items-center justify-center font-bold">
              1
            </span>
            <span className="font-mono text-[10px] uppercase tracking-wider text-[#006780] font-bold">
              Acoustic Test Cell Configuration
            </span>
          </div>
          <span className="font-mono text-[10px] text-[#005a71] bg-[#56d5ff]/30 px-2 py-0.5 rounded font-bold">
            STAGE 01 READY
          </span>
        </div>

        <div className="bg-[#eff4ff] rounded-xl p-3 flex flex-col gap-2">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-[16px] text-[#0b1c30] font-bold tracking-tight">
                IONIQ 7 Cabin Acoustic Chamber #3B
              </h2>
              <p className="text-[12px] text-[#43474f] mt-0.5">
                Automotive Rig ID:{' '}
                <span className="font-mono font-semibold text-[#002c5f]">
                  ARIG-NVH-IONIQ7-03B
                </span>
              </p>
            </div>
            <span className="material-symbols-outlined text-[#006780] text-[24px]">
              directions_car
            </span>
          </div>

          <div className="grid grid-cols-1 gap-1.5 pt-2 border-t border-[#c4c6d1]/20 font-mono text-[11px]">
            <div className="flex items-center justify-between">
              <span className="text-[#43474f] flex items-center gap-1">
                <span className="material-symbols-outlined text-[15px] text-[#006780]">mic</span>{' '}
                Mic Array Config:
              </span>
              <span className="text-[#0b1c30] font-semibold text-right">
                Roof Consoles & A-Pillars (4-CH)
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[#43474f] flex items-center gap-1">
                <span className="material-symbols-outlined text-[15px] text-[#006780]">water_drop</span>{' '}
                Road Condition:
              </span>
              <span className="text-[#0b1c30] font-semibold text-right">
                Wet Asphalt @ 80 km/h · Dual HVAC
              </span>
            </div>
          </div>
        </div>

        {/* 4-Column Calibration Telemetry Strip */}
        <div className="grid grid-cols-2 gap-2 pt-2.5 sm:grid-cols-4 mt-1 border-t border-[#c4c6d1]/20">
          <div className="bg-[#eff4ff]/70 rounded-lg p-2 flex flex-col">
            <span className="font-mono text-[9px] uppercase tracking-wider text-[#43474f] font-semibold">Mic Array #2</span>
            <span className="font-mono text-[11px] font-bold text-[#0b1c30] truncate">4-CH MEMS Beam</span>
            <span className="font-mono text-[9px] text-[#006780] mt-0.5">Cartesian (X,Y,Z)</span>
          </div>
          <div className="bg-[#eff4ff]/70 rounded-lg p-2 flex flex-col">
            <span className="font-mono text-[9px] uppercase tracking-wider text-[#43474f] font-semibold">SPL Noise Floor</span>
            <span className="font-mono text-[11px] font-bold text-[#0b1c30]">68.4 dBA</span>
            <span className="font-mono text-[9px] text-[#43474f] mt-0.5">Pink Ref -42dBFS</span>
          </div>
          <div className="bg-[#eff4ff]/70 rounded-lg p-2 flex flex-col">
            <span className="font-mono text-[9px] uppercase tracking-wider text-[#43474f] font-semibold">Gain Calibration</span>
            <span className="font-mono text-[11px] font-bold text-[#0b1c30]">+12.0 dB</span>
            <span className="font-mono text-[9px] text-[#006780] mt-0.5">Pre-amp Locked</span>
          </div>
          <div className="bg-[#eff4ff]/70 rounded-lg p-2 flex flex-col">
            <span className="font-mono text-[9px] uppercase tracking-wider text-[#43474f] font-semibold">NVH Baseline</span>
            <span className="font-mono text-[11px] font-bold text-[#0b1c30]">100km/h Aero</span>
            <span className="font-mono text-[9px] text-[#43474f] mt-0.5">HVAC Stage 3</span>
          </div>
        </div>
      </section>

      {/* STEP 2: Payload Stems Dropzone with Interactive Visualizer */}
      <section className="bg-white border border-[#c4c6d1]/30 rounded-2xl p-4 shadow-sm flex flex-col gap-3" id="upload-zone">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="w-5 h-5 rounded-full bg-[#002c5f] text-white font-mono text-[10px] flex items-center justify-center font-bold">
              2
            </span>
            <span className="font-mono text-[10px] uppercase tracking-wider text-[#006780] font-bold">
              Payload Stems Dropzone
            </span>
          </div>
          <span className="font-mono text-[11px] text-[#43474f]">142 Files · 418.6 MB</span>
        </div>

        {/* Format Filter Tabs */}
        <div className="flex items-center gap-1 bg-[#dce9ff] p-1 rounded-xl">
          <button
            type="button"
            onClick={() => setActiveFilter('all')}
            className={`flex-1 py-1 rounded-lg font-mono text-[11px] font-semibold transition-all ${
              activeFilter === 'all'
                ? 'bg-white text-[#002c5f] shadow-xs'
                : 'text-[#43474f] hover:text-[#0b1c30]'
            }`}
          >
            All (142)
          </button>
          <button
            type="button"
            onClick={() => setActiveFilter('wav')}
            className={`flex-1 py-1 rounded-lg font-mono text-[11px] font-semibold transition-all ${
              activeFilter === 'wav'
                ? 'bg-white text-[#002c5f] shadow-xs'
                : 'text-[#43474f] hover:text-[#0b1c30]'
            }`}
          >
            WAV (96)
          </button>
          <button
            type="button"
            onClick={() => setActiveFilter('mp3')}
            className={`flex-1 py-1 rounded-lg font-mono text-[11px] font-semibold transition-all ${
              activeFilter === 'mp3'
                ? 'bg-white text-[#002c5f] shadow-xs'
                : 'text-[#43474f] hover:text-[#0b1c30]'
            }`}
          >
            MP3 (34)
          </button>
          <button
            type="button"
            onClick={() => setActiveFilter('pcm')}
            className={`flex-1 py-1 rounded-lg font-mono text-[11px] font-semibold transition-all ${
              activeFilter === 'pcm'
                ? 'bg-white text-[#002c5f] shadow-xs'
                : 'text-[#43474f] hover:text-[#0b1c30]'
            }`}
          >
            PCM (12)
          </button>
        </div>

        {/* Upload Drop Target Box */}
        <div
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-[#c4c6d1] hover:border-[#006780] rounded-2xl p-5 flex flex-col items-center justify-center text-center bg-[#eff4ff]/50 cursor-pointer transition-all hover:bg-[#eff4ff]"
        >
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            multiple
            accept=".wav,.mp3,.pcm,.flac"
            onChange={() => {
              // file selection simulation feedback
            }}
          />
          <div className="w-12 h-12 rounded-2xl bg-[#dce9ff] flex items-center justify-center text-[#006780] mb-2 shadow-xs">
            <span className="material-symbols-outlined text-[26px]">cloud_upload</span>
          </div>
          <p className="text-[15px] text-[#0b1c30] font-semibold leading-tight">
            Drag Ingestion Bundles or Tap to Browse
          </p>
          <p className="text-[12px] text-[#43474f] mt-1 max-w-xs">
            Automotive pipeline auto-demuxes multi-track stems & sample rates
          </p>

          {/* Interactive Waveform Bar Visual */}
          <div className="w-full max-w-xs my-2.5 bg-white/80 rounded-lg p-2 border border-[#dce9ff] flex items-center justify-between gap-1">
            <div className="flex items-center gap-1 h-6 flex-1 justify-center">
              <span className="w-1 bg-[#006780]/40 rounded-full h-2"></span>
              <span className="w-1 bg-[#006780]/60 rounded-full h-3.5"></span>
              <span className="w-1 bg-[#006780] rounded-full h-5 animate-pulse"></span>
              <span className="w-1 bg-[#002c5f] rounded-full h-6"></span>
              <span className="w-1 bg-[#006780] rounded-full h-4"></span>
              <span className="w-1 bg-[#006780]/70 rounded-full h-2.5"></span>
              <span className="w-1 bg-[#006780] rounded-full h-5"></span>
              <span className="w-1 bg-[#002c5f] rounded-full h-6 animate-pulse"></span>
              <span className="w-1 bg-[#006780]/80 rounded-full h-3"></span>
              <span className="w-1 bg-[#006780]/50 rounded-full h-2"></span>
            </div>
            <button
              type="button"
              className="bg-[#002c5f] text-white px-2.5 py-1 rounded text-[11px] font-semibold flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-[13px]">add</span>
              <span>Browse</span>
            </button>
          </div>

          <div className="flex items-center gap-2 text-[#43474f] text-[11px] font-mono">
            <span className="text-[#006780] flex items-center gap-1 font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-[#006780]"></span> Auto-Sync: IONIQ 7 Rig 3B
            </span>
            <span>•</span>
            <span>Max 2.0 GB / session</span>
          </div>
        </div>

        {/* Format Breakdown Segmented Bar */}
        <div className="bg-[#eff4ff]/60 rounded-xl p-3 flex flex-col gap-2 border border-[#c4c6d1]/20">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[11px] font-bold text-[#0b1c30] uppercase tracking-wide">
              Format Breakdown
            </span>
            <span className="font-mono text-[10px] text-[#43474f]">142 Total Files</span>
          </div>
          <div className="w-full h-2 bg-[#dce9ff] rounded-full overflow-hidden flex">
            <div className="bg-[#002c5f] h-full w-[68%]" title="WAV 68%"></div>
            <div className="bg-[#56d5ff] h-full w-[24%]" title="MP3 24%"></div>
            <div className="bg-[#77d1fe] h-full w-[8%]" title="PCM 8%"></div>
          </div>
          <div className="grid grid-cols-3 gap-2 pt-0.5 text-center font-mono text-[10px]">
            <div className="bg-white rounded-lg p-1.5 border border-[#c4c6d1]/20">
              <span className="font-bold text-[#002c5f] block">.WAV (68%)</span>
              <span className="text-[#43474f]">96 items</span>
            </div>
            <div className="bg-white rounded-lg p-1.5 border border-[#c4c6d1]/20">
              <span className="font-bold text-[#006780] block">.MP3 (24%)</span>
              <span className="text-[#43474f]">34 items</span>
            </div>
            <div className="bg-white rounded-lg p-1.5 border border-[#c4c6d1]/20">
              <span className="font-bold text-[#003143] block">.PCM (8%)</span>
              <span className="text-[#43474f]">12 items</span>
            </div>
          </div>
        </div>

        {/* Graphic Multi-Channel Ingestion Mapping (4-CH Synchronized) */}
        <div className="bg-[#dce9ff]/50 rounded-xl p-3 flex flex-col gap-2 border border-[#c4c6d1]/20">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[11px] font-bold text-[#0b1c30] uppercase tracking-wide">
              Multi-Channel Ingestion Mapping
            </span>
            <span className="font-mono text-[11px] text-[#006780] font-semibold">
              4-CH Synchronized
            </span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {/* CH 1 */}
            <div className="bg-white rounded-lg p-2.5 flex items-center justify-between border border-[#c4c6d1]/20 shadow-2xs">
              <div className="flex items-center gap-2 min-w-0">
                <span className="w-2 h-2 rounded-full bg-[#006780] shrink-0"></span>
                <div className="flex flex-col min-w-0">
                  <span className="font-mono text-[11px] font-bold text-[#0b1c30]">CH 1</span>
                  <span className="text-[10px] text-[#43474f] truncate">Driver Sunvisor</span>
                </div>
              </div>
              <div className="flex items-end gap-0.5 h-3">
                <span className="w-1 h-3 bg-[#006780] rounded-xs animate-pulse"></span>
                <span className="w-1 h-2 bg-[#006780] rounded-xs"></span>
                <span className="w-1 h-2.5 bg-[#006780] rounded-xs animate-pulse"></span>
              </div>
            </div>

            {/* CH 2 */}
            <div className="bg-white rounded-lg p-2.5 flex items-center justify-between border border-[#c4c6d1]/20 shadow-2xs">
              <div className="flex items-center gap-2 min-w-0">
                <span className="w-2 h-2 rounded-full bg-[#006780] shrink-0"></span>
                <div className="flex flex-col min-w-0">
                  <span className="font-mono text-[11px] font-bold text-[#0b1c30]">CH 2</span>
                  <span className="text-[10px] text-[#43474f] truncate">Passenger Console</span>
                </div>
              </div>
              <div className="flex items-end gap-0.5 h-3">
                <span className="w-1 h-2 bg-[#006780] rounded-xs"></span>
                <span className="w-1 h-1.5 bg-[#006780] rounded-xs animate-pulse"></span>
                <span className="w-1 h-2 bg-[#006780] rounded-xs"></span>
              </div>
            </div>

            {/* CH 3 */}
            <div className="bg-white rounded-lg p-2.5 flex items-center justify-between border border-[#c4c6d1]/20 shadow-2xs">
              <div className="flex items-center gap-2 min-w-0">
                <span className="w-2 h-2 rounded-full bg-[#002c5f] shrink-0"></span>
                <div className="flex flex-col min-w-0">
                  <span className="font-mono text-[11px] font-bold text-[#0b1c30]">CH 3</span>
                  <span className="text-[10px] text-[#43474f] truncate">Beam Reference</span>
                </div>
              </div>
              <div className="flex items-end gap-0.5 h-3">
                <span className="w-1 h-2.5 bg-[#002c5f] rounded-xs animate-pulse"></span>
                <span className="w-1 h-3 bg-[#002c5f] rounded-xs"></span>
                <span className="w-1 h-2 bg-[#002c5f] rounded-xs animate-pulse"></span>
              </div>
            </div>

            {/* CH 4 */}
            <div className="bg-white rounded-lg p-2.5 flex items-center justify-between border border-[#c4c6d1]/20 shadow-2xs">
              <div className="flex items-center gap-2 min-w-0">
                <span className="w-2 h-2 rounded-full bg-[#006780] shrink-0"></span>
                <div className="flex flex-col min-w-0">
                  <span className="font-mono text-[11px] font-bold text-[#0b1c30]">CH 4</span>
                  <span className="text-[10px] text-[#43474f] truncate">Cabin Ambience</span>
                </div>
              </div>
              <div className="flex items-end gap-0.5 h-3">
                <span className="w-1 h-1.5 bg-[#006780] rounded-xs"></span>
                <span className="w-1 h-1 bg-[#006780] rounded-xs animate-pulse"></span>
                <span className="w-1 h-1.5 bg-[#006780] rounded-xs"></span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Configuration Panel for Raw PCM Stream Decoder */}
        <div className="bg-[#dce9ff]/40 rounded-xl p-3 border border-[#dce9ff] flex flex-col gap-2">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[#003143] text-white flex items-center justify-center font-mono text-[11px] font-bold">
                PCM
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="text-[13px] font-semibold text-[#0b1c30]">
                    Raw PCM Stream Decoder
                  </span>
                  <span className="font-mono text-[9px] bg-[#56d5ff]/40 text-[#005a71] px-1.5 py-0.2 rounded font-bold">
                    ACTIVE
                  </span>
                </div>
                <span className="text-[11px] text-[#43474f]">
                  Required for 12 headerless acoustic array recordings
                </span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setShowPcmModal(true)}
              className="px-2.5 py-1 rounded-lg bg-white text-[#006780] font-mono text-[10px] font-bold border border-[#c4c6d1]/40 hover:bg-[#eff4ff] shadow-xs shrink-0 flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-[13px]">tune</span>
              <span>Edit PCM Headers</span>
            </button>
          </div>
          <div className="grid grid-cols-3 gap-1.5 pt-1 text-[#43474f] font-mono text-[10px]">
            <div className="bg-white/90 px-2 py-1.5 rounded flex flex-col">
              <span className="text-[9px] uppercase text-[#747780]">Sampling</span>
              <span className="font-semibold text-[#0b1c30]">{pcmConfig.sampleRate}</span>
            </div>
            <div className="bg-white/90 px-2 py-1.5 rounded flex flex-col">
              <span className="text-[9px] uppercase text-[#747780]">Byte Order</span>
              <span className="font-semibold text-[#0b1c30]">{pcmConfig.byteOrder}</span>
            </div>
            <div className="bg-white/90 px-2 py-1.5 rounded flex flex-col">
              <span className="text-[9px] uppercase text-[#747780]">Channels</span>
              <span className="font-semibold text-[#0b1c30]">{pcmConfig.channels}</span>
            </div>
          </div>
        </div>
      </section>

      {/* STEP 3: Granular File Inspection / Ready Queue */}
      <section className="flex flex-col gap-2" id="queue-list">
        <div className="flex items-center justify-between px-0.5">
          <div className="flex items-center gap-1.5">
            <span className="w-5 h-5 rounded-full bg-[#002c5f] text-white font-mono text-[10px] flex items-center justify-center font-bold">
              3
            </span>
            <span className="font-mono text-[10px] uppercase tracking-wider text-[#006780] font-bold">
              Granular File Inspection
            </span>
          </div>
          <span className="font-mono text-[11px] text-[#43474f]">
            Showing {filteredSamples.length} of {samples.length}
          </span>
        </div>

        {/* Sample List Cards */}
        {filteredSamples.map((sample) => {
          const isPlaying = playingSampleId === sample.id;
          const isDefective = sample.hasClipping;

          return (
            <div
              key={sample.id}
              className={`bg-white border rounded-2xl p-3.5 shadow-sm flex flex-col gap-2 transition-all ${
                isDefective ? 'border-[#ba1a1a]/40 bg-[#fffbfb]' : 'border-[#c4c6d1]/30 hover:border-[#006780]/40'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2.5 min-w-0">
                  <button
                    type="button"
                    onClick={() => handlePlayToggle(sample)}
                    className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 hover:opacity-90 active:scale-95 transition-all shadow-xs ${
                      isDefective
                        ? 'bg-[#ba1a1a] text-white'
                        : sample.format === 'wav'
                        ? 'bg-[#002c5f] text-white'
                        : sample.format === 'mp3'
                        ? 'bg-[#006780] text-white'
                        : 'bg-[#d3e4fe] text-[#002c5f]'
                    }`}
                    title={isPlaying ? 'Pause audition' : 'Audition audio'}
                  >
                    <span className="material-symbols-outlined text-[20px]">
                      {isPlaying ? 'pause' : 'play_arrow'}
                    </span>
                  </button>

                  <div
                    className="flex flex-col min-w-0 cursor-pointer"
                    onClick={() => onOpenSampleDetail(sample)}
                  >
                    <span className="text-[13px] font-semibold text-[#0b1c30] truncate hover:text-[#006780]">
                      {sample.filename}
                    </span>
                    <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
                      <span className="font-mono text-[10px] bg-[#e5eeff] px-1.5 py-0.5 rounded text-[#002c5f] font-semibold">
                        {sample.formatBadge}
                      </span>
                      <span className="font-mono text-[10px] bg-[#e5eeff] px-1.5 py-0.5 rounded text-[#43474f]">
                        {sample.bitDepth} · {sample.duration}
                      </span>
                      {isDefective ? (
                        <span className="font-mono text-[10px] bg-[#ffdad6] text-[#93000a] px-1.5 py-0.5 rounded font-bold">
                          Clipping Detected
                        </span>
                      ) : (
                        <span className="font-mono text-[10px] bg-[#e5eeff] px-1.5 py-0.5 rounded text-[#006780] font-semibold">
                          {sample.channels}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div
                  className="flex flex-col items-end shrink-0 cursor-pointer"
                  onClick={() => onOpenSampleDetail(sample)}
                >
                  <span
                    className={`font-mono text-[13px] font-bold ${
                      isDefective ? 'text-[#ba1a1a]' : 'text-[#006780]'
                    }`}
                  >
                    {sample.lufsDisplay}
                  </span>
                  <span
                    className={`text-[10px] font-medium ${
                      isDefective ? 'text-[#ba1a1a]' : 'text-[#43474f]'
                    }`}
                  >
                    {isDefective ? 'Overload Warning' : sample.hasClipping === false ? 'Normal Headroom' : 'Clean SNR'}
                  </span>
                </div>
              </div>

              {/* Waveform Micro-Thumbnail Graphic */}
              <div
                className={`rounded-lg p-2 flex items-center gap-2 h-7 cursor-pointer ${
                  isDefective
                    ? 'bg-[#ffdad6]/35 border border-[#ba1a1a]/20'
                    : 'bg-[#eff4ff]'
                }`}
                onClick={() => onOpenSampleDetail(sample)}
              >
                <div className="flex items-center gap-0.5 h-full flex-1">
                  {[...Array(24)].map((_, i) => {
                    const heightClass =
                      isDefective && (i === 5 || i === 6 || i === 14 || i === 15)
                        ? 'h-5 bg-[#ba1a1a]'
                        : isDefective
                        ? 'h-3.5 bg-[#ba1a1a]/70'
                        : i % 4 === 0
                        ? 'h-4 bg-[#006780]'
                        : i % 2 === 0
                        ? 'h-3 bg-[#006780]/80'
                        : 'h-2 bg-[#006780]/60';
                    return (
                      <span
                        key={i}
                        className={`w-1 rounded-full transition-all ${heightClass} ${
                          isPlaying ? 'animate-pulse' : ''
                        }`}
                      ></span>
                    );
                  })}
                </div>
                <span
                  className={`font-mono text-[10px] shrink-0 ${
                    isDefective ? 'text-[#ba1a1a] font-bold' : 'text-[#43474f]'
                  }`}
                >
                  {isDefective ? `Peak Margin: ${sample.peakMargin}` : `RMS Peak: ${sample.rmsPeak}`}
                </span>
              </div>
            </div>
          );
        })}
      </section>

      {/* STEP 4: Engine Pre-flight Checklist (Evaluation Matrix) */}
      <section className="bg-[#e5eeff] rounded-2xl p-4 shadow-sm flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="w-5 h-5 rounded-full bg-[#002c5f] text-white font-mono text-[10px] flex items-center justify-center font-bold">
              4
            </span>
            <span className="font-mono text-[10px] uppercase tracking-wider text-[#002c5f] font-bold">
              Engine Pre-flight Checklist
            </span>
          </div>
          <button
            type="button"
            onClick={onSelectAllEngines}
            className="font-mono text-[10px] text-[#006780] bg-[#dce9ff] px-2 py-0.5 rounded font-bold hover:underline"
          >
            THRESHOLDS ARMED
          </button>
        </div>

        <div className="flex flex-col gap-2">
          {engines.map((engine) => (
            <div
              key={engine.id}
              className="bg-white border border-[#c4c6d1]/30 rounded-xl p-3 flex flex-col gap-1.5 shadow-2xs"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span
                    className={`w-2 h-2 rounded-full ${
                      engine.enabled ? 'bg-[#006780]' : 'bg-[#c4c6d1]'
                    }`}
                  ></span>
                  <span className="text-[13px] font-semibold text-[#0b1c30]">
                    {engine.name}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[10px] font-semibold text-[#002c5f] bg-[#eff4ff] px-2 py-0.5 rounded">
                    {engine.tag}
                  </span>
                  <label className="relative inline-flex items-center cursor-pointer shrink-0">
                    <input
                      type="checkbox"
                      checked={engine.enabled}
                      onChange={() => onToggleEngine(engine.id)}
                      className="sr-only peer"
                    />
                    <div className="w-8 h-4 bg-[#c4c6d1] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-[#002c5f]"></div>
                  </label>
                </div>
              </div>
              <div className="flex items-center justify-between text-[#43474f] font-mono text-[10px] pl-4">
                <span>{engine.subtitle}</span>
                <span className="text-[#006780] font-semibold">{engine.indicator}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Sticky Dual-Action Bar Above Bottom Nav */}
      <aside className="fixed bottom-16 inset-x-0 z-40 bg-[#f8f9ff]/95 backdrop-blur-xl border-t border-[#c4c6d1]/30 px-4 py-2.5 shadow-[0_-4px_16px_rgba(0,44,95,0.06)] max-w-lg mx-auto">
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => {
              // Pre-check stems micro interaction
            }}
            className="flex-1 bg-[#dce9ff] border border-[#c4c6d1]/40 text-[#0b1c30] hover:bg-[#cbdbf5] rounded-xl py-3 px-3 flex items-center justify-center gap-1.5 font-mono text-[12px] font-semibold active:scale-[0.98] transition-transform"
          >
            <span className="material-symbols-outlined text-[18px] text-[#006780]">rule</span>
            <span>Pre-check Stems</span>
          </button>
          <button
            type="button"
            onClick={handleStartAnalysis}
            disabled={isDispatching}
            className="flex-[1.6] bg-[#002c5f] hover:bg-[#001839] text-white rounded-xl py-3 px-3 flex items-center justify-center gap-2 text-[14px] font-semibold shadow-md active:scale-[0.98] transition-all"
          >
            <span
              className={`material-symbols-outlined text-[20px] ${
                isDispatching ? 'animate-spin' : ''
              }`}
            >
              {isDispatching ? 'sync' : 'rocket_launch'}
            </span>
            <span>{dispatchText}</span>
          </button>
        </div>
      </aside>

      {/* PCM Config Modal */}
      {showPcmModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-5 max-w-sm w-full shadow-xl border border-[#c4c6d1]/40 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <h3 className="text-[16px] font-bold text-[#002c5f]">
                Edit Raw PCM Headers
              </h3>
              <button
                type="button"
                onClick={() => setShowPcmModal(false)}
                className="text-[#43474f] hover:text-[#0b1c30]"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>
            <p className="text-[12px] text-[#43474f]">
              Configure stream interpretation parameters for headerless acoustic recordings:
            </p>

            <div className="flex flex-col gap-2 font-mono text-[12px]">
              <label className="flex flex-col gap-1">
                <span className="text-[11px] text-[#747780]">Sampling Frequency</span>
                <select
                  value={pcmConfig.sampleRate}
                  onChange={(e) => setPcmConfig({ ...pcmConfig, sampleRate: e.target.value })}
                  className="border border-[#c4c6d1] rounded-lg p-2 bg-[#eff4ff]"
                >
                  <option>48,000 Hz</option>
                  <option>44,100 Hz</option>
                  <option>16,000 Hz</option>
                  <option>96,000 Hz</option>
                </select>
              </label>

              <label className="flex flex-col gap-1">
                <span className="text-[11px] text-[#747780]">Byte Ordering</span>
                <select
                  value={pcmConfig.byteOrder}
                  onChange={(e) => setPcmConfig({ ...pcmConfig, byteOrder: e.target.value })}
                  className="border border-[#c4c6d1] rounded-lg p-2 bg-[#eff4ff]"
                >
                  <option>Little-Endian</option>
                  <option>Big-Endian</option>
                </select>
              </label>

              <label className="flex flex-col gap-1">
                <span className="text-[11px] text-[#747780]">Interleaving</span>
                <select
                  value={pcmConfig.channels}
                  onChange={(e) => setPcmConfig({ ...pcmConfig, channels: e.target.value })}
                  className="border border-[#c4c6d1] rounded-lg p-2 bg-[#eff4ff]"
                >
                  <option>4-Ch Interleaved</option>
                  <option>Mono Raw</option>
                  <option>Stereo L/R</option>
                </select>
              </label>
            </div>

            <button
              type="button"
              onClick={() => setShowPcmModal(false)}
              className="mt-2 bg-[#002c5f] text-white py-2.5 rounded-xl font-semibold text-[13px]"
            >
              Save & Re-interpret Queue
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
