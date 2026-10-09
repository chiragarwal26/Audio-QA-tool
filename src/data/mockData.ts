import { AudioSample, EngineToggle, AnomalyItem } from '../types';

export const INITIAL_SAMPLES: AudioSample[] = [
  {
    id: 'sample-102',
    sampleNumber: 102,
    filename: 'driver_sunvisor_mic_clipping_test.wav',
    format: 'wav',
    formatBadge: 'PCM 48kHz',
    sampleRate: '48kHz',
    bitDepth: '24-bit',
    duration: '2.9s',
    channels: 'Mono',
    channelDesc: 'Driver Sunvisor (CH 1)',
    lufs: -1.2,
    lufsDisplay: '-1.2 LUFS',
    peakMargin: '+0.2 dBFS',
    rmsPeak: '+0.8 dBFS',
    status: 'PEAK SAT',
    severity: 'critical',
    hasClipping: true,
    clippedRegionsCount: 2,
    snr: 11.4,
    targetSnr: 18.0,
    pesq: 2.41,
    targetPesq: 3.5,
    thdn: 6.2,
    targetThdn: 1.5,
    truePeak: 0.8,
    targetTruePeak: -1.0,
    rt60: 420,
    targetRt60: 250,
    micPosition: 'PASSENGER CABIN MIC 01',
    pipeline: 'AEC/VAD PIPELINE',
    leadObservation: 'Recommend gain pad -4.5dB on MIC2 input branch.',
    defects: [
      {
        code: 'P01',
        title: 'Hard Digital Peak Clipping',
        value: '+0.8 dBFS',
        description: 'Pre-amp gain in Sunvisor Node #2 exceeds DSP saturation threshold. Transients at 1.12s and 2.04s clipped across 28 consecutive samples, resulting in square-wave harmonic flaring up to 22kHz.'
      },
      {
        code: 'P04',
        title: 'In-Cabin Acoustic Reverberation',
        value: 'RT60: 420 ms',
        description: 'Reflections from driver-side windshield rake angle exceeding baseline nominal threshold of 250ms, causing temporal smear across consonants in speech prompts.'
      }
    ]
  },
  {
    id: 'sample-014',
    sampleNumber: 14,
    filename: 'cabin_hvac_p2_command_014.wav',
    format: 'wav',
    formatBadge: 'PCM 48kHz',
    sampleRate: '48kHz',
    bitDepth: '24-bit',
    duration: '3.4s',
    channels: '4-CH Quad',
    channelDesc: 'Ch 1-4 Stem Quad',
    lufs: -14.2,
    lufsDisplay: '-14.2 LUFS',
    rmsPeak: '-4.8dBFS',
    status: 'READY',
    severity: 'clean',
    hasClipping: false,
    snr: 24.5,
    targetSnr: 18.0,
    pesq: 4.18,
    targetPesq: 3.5,
    thdn: 0.42,
    targetThdn: 1.5,
    truePeak: -4.8,
    targetTruePeak: -1.0,
    micPosition: 'ROOF CONSOLE ARRAY 01',
    pipeline: 'DUAL HVAC COMPENSATED',
    leadObservation: 'Balanced speech level with optimal intelligibility headroom.'
  },
  {
    id: 'sample-008',
    sampleNumber: 8,
    filename: 'bluetooth_handsfree_highspeed_08.mp3',
    format: 'mp3',
    formatBadge: 'MP3 CBR',
    sampleRate: '44.1kHz',
    bitDepth: '16-bit',
    duration: '5.1s',
    channels: 'Stereo',
    channelDesc: 'Ch 1 Mono VAD',
    lufs: -18.9,
    lufsDisplay: '-18.9 LUFS',
    rmsPeak: '-8.1dBFS',
    status: 'READY',
    severity: 'minor',
    hasClipping: false,
    snr: 16.8,
    targetSnr: 18.0,
    pesq: 3.25,
    targetPesq: 3.5,
    thdn: 1.8,
    targetThdn: 1.5,
    truePeak: -6.2,
    targetTruePeak: -1.0,
    micPosition: 'STEERING COLUMN MIC',
    pipeline: 'BLUETOOTH HFP 1.8 WBS',
    leadObservation: 'High frequency roll-off detected above 3.4kHz band during aero burst.'
  },
  {
    id: 'sample-109',
    sampleNumber: 109,
    filename: 'raw_beamforming_mic_array_ch4.pcm',
    format: 'pcm',
    formatBadge: 'Raw Headerless',
    sampleRate: '16kHz LE',
    bitDepth: '16-bit',
    duration: '4.8s',
    channels: 'Mono Raw',
    channelDesc: 'CH 4 Cabin Ambience',
    lufs: -16.5,
    lufsDisplay: '-16.5 LUFS',
    rmsPeak: '-5.2dBFS',
    status: 'CONFIG',
    severity: 'critical',
    hasClipping: true,
    clippedRegionsCount: 1,
    snr: 14.2,
    targetSnr: 18.0,
    pesq: 3.12,
    targetPesq: 3.5,
    thdn: 4.8,
    targetThdn: 1.5,
    truePeak: -0.5,
    targetTruePeak: -1.0,
    micPosition: 'A-PILLAR CABIN AMBIENCE',
    pipeline: 'RAW I2S STREAM CCU',
    leadObservation: 'DC offset bias & 2.4kHz harmonic spike found on channel 4.'
  }
];

export const INITIAL_ENGINES: EngineToggle[] = [
  {
    id: 'pesq',
    name: 'PESQ P.862',
    subtitle: 'Speech MOS / Wideband',
    enabled: true,
    tag: 'ITU-T Calibrated',
    indicator: 'Ready'
  },
  {
    id: 'polqa',
    name: 'POLQA P.863',
    subtitle: 'Super-wideband HD',
    enabled: true,
    tag: 'SWB Mode',
    indicator: 'Ready'
  },
  {
    id: 'snr',
    name: 'SNR Floor Check',
    subtitle: 'A-Weighted RMS Noise',
    enabled: true,
    tag: 'Min 22dB Target',
    indicator: 'Ready'
  },
  {
    id: 'thdn',
    name: 'THD+N Saturation',
    subtitle: 'Mic Preamplifier Clip',
    enabled: true,
    tag: '0.05% Threshold',
    indicator: 'Ready'
  },
  {
    id: 'aec',
    name: 'AEC Echo Leakage',
    subtitle: 'Echo Return Loss (ERL)',
    enabled: true,
    tag: '>45dB Damping',
    indicator: 'Ready'
  },
  {
    id: 'vad',
    name: 'Low-pass VAD Guard',
    subtitle: 'Voice Activity Cutoff',
    enabled: true,
    tag: '120Hz High-pass',
    indicator: 'Ready'
  }
];

export const INITIAL_ANOMALIES: AnomalyItem[] = [
  {
    id: 'anom-1',
    type: 'ALERT',
    sampleNumber: 102,
    format: '.wav',
    sampleId: 'sample-102',
    description: 'Severe digital clipping on beam mic input',
    timestamp: '14:28:02'
  },
  {
    id: 'anom-2',
    type: 'WARN',
    sampleNumber: 105,
    format: '.mp3',
    sampleId: 'sample-008',
    description: 'High frequency roll-off (< 3.2 kHz)',
    timestamp: '14:27:58'
  },
  {
    id: 'anom-3',
    type: 'PASS',
    sampleNumber: 108,
    format: '.pcm',
    sampleId: 'sample-014',
    description: 'Clean intelligibility score (4.21 PESQ)',
    timestamp: '14:27:42'
  }
];
