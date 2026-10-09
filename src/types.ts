export type AudioFormat = 'wav' | 'mp3' | 'pcm';
export type DefectSeverity = 'clean' | 'minor' | 'critical';
export type AppTab = 'upload' | 'inspection' | 'reports' | 'settings' | 'sample-detail';

export interface AudioSample {
  id: string;
  sampleNumber: number;
  filename: string;
  format: AudioFormat;
  formatBadge: string;
  sampleRate: string;
  bitDepth: string;
  duration: string;
  channels: string;
  channelDesc: string;
  lufs: number;
  lufsDisplay: string;
  peakMargin?: string;
  rmsPeak?: string;
  status: 'READY' | 'CONFIG' | 'PEAK SAT' | 'CLIPPING' | 'ANALYZING';
  severity: DefectSeverity;
  hasClipping?: boolean;
  clippedRegionsCount?: number;
  snr: number;
  targetSnr: number;
  pesq: number;
  targetPesq: number;
  thdn: number;
  targetThdn: number;
  truePeak: number;
  targetTruePeak: number;
  rt60?: number;
  targetRt60?: number;
  defects?: {
    code: string;
    title: string;
    value: string;
    description: string;
  }[];
  micPosition: string;
  pipeline: string;
  leadObservation?: string;
}

export interface EngineToggle {
  id: string;
  name: string;
  subtitle: string;
  enabled: boolean;
  tag: string;
  indicator: string;
}

export interface AnomalyItem {
  id: string;
  type: 'ALERT' | 'WARN' | 'PASS';
  sampleNumber: number;
  format: string;
  sampleId: string;
  description: string;
  timestamp: string;
}
