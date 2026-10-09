import React, { useState } from 'react';

interface SettingsScreenProps {
  onSave?: () => void;
}

export const SettingsScreen: React.FC<SettingsScreenProps> = () => {
  const [chamber, setChamber] = useState('IONIQ 7 · Lab 3B');
  const [rigId, setRigId] = useState('ARIG-NVH-IONIQ7-03B');
  const [roadProfile, setRoadProfile] = useState('Wet Asphalt @ 80 km/h · Dual HVAC');
  const [gainDb, setGainDb] = useState(12.0);
  const [splBase, setSplBase] = useState(68.4);
  const [gpuCluster, setGpuCluster] = useState('CUDA Core 04 (Namyang Rig)');
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const handleSave = () => {
    setToastMsg('Rig calibration parameters locked & synced to DSP hardware.');
    setTimeout(() => {
      setToastMsg(null);
    }, 2600);
  };

  return (
    <div className="flex flex-col w-full px-4 pt-24 pb-36 gap-4 max-w-lg mx-auto">
      {/* Active Rig Status Card */}
      <section className="bg-white rounded-2xl p-4 shadow-sm border border-[#c4c6d1]/30 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#006780] text-[22px]">
              settings_input_component
            </span>
            <h2 className="text-[16px] font-bold text-[#001839]">
              Acoustic Rig Calibration
            </h2>
          </div>
          <span className="font-mono text-[10px] bg-[#dce9ff] text-[#002c5f] px-2 py-0.5 rounded font-bold uppercase">
            CALIBRATED
          </span>
        </div>

        <div className="flex flex-col gap-3 font-mono text-[12px]">
          {/* Chamber selection */}
          <label className="flex flex-col gap-1">
            <span className="text-[11px] text-[#43474f] font-sans font-medium">
              Chamber Facility
            </span>
            <select
              value={chamber}
              onChange={(e) => setChamber(e.target.value)}
              className="border border-[#c4c6d1]/40 rounded-xl p-2.5 bg-[#eff4ff] text-[#001839] font-bold"
            >
              <option>IONIQ 7 · Lab 3B (Acoustic Chamber)</option>
              <option>Rig-02 Namyang Pilot Fleet Test Cell</option>
              <option>Wind Tunnel Aero Acoustic Suite #1</option>
            </select>
          </label>

          {/* Rig ID */}
          <label className="flex flex-col gap-1">
            <span className="text-[11px] text-[#43474f] font-sans font-medium">
              Automotive Hardware Rig ID
            </span>
            <input
              type="text"
              value={rigId}
              onChange={(e) => setRigId(e.target.value)}
              className="border border-[#c4c6d1]/40 rounded-xl p-2.5 bg-[#eff4ff] text-[#001839] font-bold"
            />
          </label>

          {/* Road Noise Profile */}
          <label className="flex flex-col gap-1">
            <span className="text-[11px] text-[#43474f] font-sans font-medium">
              Cabin NVH Noise Baseline Profile
            </span>
            <select
              value={roadProfile}
              onChange={(e) => setRoadProfile(e.target.value)}
              className="border border-[#c4c6d1]/40 rounded-xl p-2.5 bg-[#eff4ff] text-[#001839] font-bold"
            >
              <option>Wet Asphalt @ 80 km/h · Dual HVAC</option>
              <option>100 km/h Highway Aero Track Mode</option>
              <option>Rough Cobblestone NVH Transient</option>
              <option>Engine Idle 800 RPM · HVAC Stage 3</option>
            </select>
          </label>
        </div>
      </section>

      {/* Pre-amp Gain & Calibration Slider */}
      <section className="bg-white rounded-2xl p-4 shadow-sm border border-[#c4c6d1]/30 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <span className="text-[14px] font-bold text-[#001839]">
            Pre-amp Staging & Sensitivity
          </span>
          <span className="font-mono text-[12px] font-bold text-[#006780]">
            +{gainDb.toFixed(1)} dB
          </span>
        </div>

        <div className="flex flex-col gap-1">
          <input
            type="range"
            min="0"
            max="24"
            step="0.5"
            value={gainDb}
            onChange={(e) => setGainDb(parseFloat(e.target.value))}
            className="w-full accent-[#002c5f] cursor-pointer"
          />
          <div className="flex justify-between font-mono text-[10px] text-[#43474f]">
            <span>0.0 dB (Unity)</span>
            <span>+12.0 dB (Nominal)</span>
            <span>+24.0 dB (High)</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#c4c6d1]/20">
          <div className="flex flex-col">
            <span className="text-[11px] text-[#43474f]">SPL Reference Floor</span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <input
                type="number"
                value={splBase}
                step="0.1"
                onChange={(e) => setSplBase(parseFloat(e.target.value))}
                className="w-20 font-mono text-[14px] font-bold text-[#001839] border border-[#c4c6d1]/40 rounded px-1 py-0.5 bg-[#eff4ff]"
              />
              <span className="font-mono text-[11px] text-[#43474f]">dBA</span>
            </div>
          </div>

          <div className="flex flex-col">
            <span className="text-[11px] text-[#43474f]">Pink Ref Attenuation</span>
            <span className="font-mono text-[14px] font-bold text-[#006780] mt-0.5">
              -42.0 dBFS
            </span>
          </div>
        </div>
      </section>

      {/* Compute Engine & Hardware Acceleration */}
      <section className="bg-white rounded-2xl p-4 shadow-sm border border-[#c4c6d1]/30 flex flex-col gap-3 font-mono text-[12px]">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-[#006780] text-[20px]">
            memory
          </span>
          <h3 className="text-[14px] font-bold text-[#001839] font-sans">
            DSP & CUDA Acceleration Core
          </h3>
        </div>

        <div className="flex flex-col gap-2">
          <label className="flex flex-col gap-1">
            <span className="text-[11px] text-[#43474f] font-sans">Allocated GPU Device</span>
            <select
              value={gpuCluster}
              onChange={(e) => setGpuCluster(e.target.value)}
              className="border border-[#c4c6d1]/40 rounded-xl p-2 bg-[#eff4ff] text-[#001839] font-bold"
            >
              <option>CUDA Core 04 (Namyang Rig - RTX A6000)</option>
              <option>Tensor Core Array 02 (Distributed Node)</option>
              <option>Direct DSP On-Vehicle Hardware Loop (CAN-FD)</option>
            </select>
          </label>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-[#c4c6d1]/20 text-[11px]">
          <span className="text-[#43474f]">Firmware Validation Target</span>
          <span className="font-bold text-[#002c5f]">v4.2.0-RC3 / IONIQ 7 Pilot</span>
        </div>
      </section>

      {/* Actions */}
      <div className="flex flex-col gap-2 pt-1">
        <button
          type="button"
          onClick={handleSave}
          className="w-full bg-[#002c5f] hover:bg-[#001839] text-white py-3 px-4 rounded-xl font-semibold text-[14px] shadow-sm active:scale-98 transition-all flex items-center justify-center gap-2"
        >
          <span className="material-symbols-outlined text-[18px]">save</span>
          <span>Save Calibration & Lock Staging</span>
        </button>
      </div>

      {toastMsg && (
        <div className="fixed bottom-20 left-4 right-4 z-50 max-w-sm mx-auto">
          <div className="bg-[#213145] text-[#eaf1ff] px-4 py-2.5 rounded-xl shadow-2xl flex items-center justify-between border border-white/10">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#56d5ff] text-[18px]">
                check_circle
              </span>
              <span className="text-[12px] font-medium">{toastMsg}</span>
            </div>
            <span className="font-mono text-[9px] text-[#abc7ff] uppercase">AQE SYS</span>
          </div>
        </div>
      )}
    </div>
  );
};
