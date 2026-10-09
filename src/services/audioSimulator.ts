// Audio Synthesis and DSP filter simulator using standard Web Audio API
class AudioSimulatorService {
  private ctx: AudioContext | null = null;
  private osc: OscillatorNode | null = null;
  private noiseNode: AudioBufferSourceNode | null = null;
  private gainNode: GainNode | null = null;
  private filterNode: BiquadFilterNode | null = null;
  private isPlaying = false;
  private onTimeUpdate?: (time: number) => void;
  private timer: number | null = null;
  private currentTime = 0;
  private duration = 2.9;

  private initContext() {
    if (!this.ctx) {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioContextClass();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public play(
    sampleType: 'clipped' | 'clean' | 'rumble' = 'clipped',
    isDeClipped = false,
    onTimeUpdate?: (time: number) => void,
    onEnded?: () => void
  ) {
    this.stop();
    this.initContext();
    if (!this.ctx) return;

    this.onTimeUpdate = onTimeUpdate;
    this.isPlaying = true;
    this.currentTime = 0;

    const ctx = this.ctx;
    const now = ctx.currentTime;

    // Master gain
    this.gainNode = ctx.createGain();
    this.gainNode.gain.setValueAtTime(0.2, now);

    // Filter node for de-clip preview
    this.filterNode = ctx.createBiquadFilter();
    if (isDeClipped) {
      // Soft de-clip smoothing: lowpass at 4200Hz, reduce harsh 2.4k spike
      this.filterNode.type = 'lowpass';
      this.filterNode.frequency.setValueAtTime(4200, now);
      this.gainNode.gain.setValueAtTime(0.12, now);
    } else {
      // Raw: wideband with harmonic edge
      this.filterNode.type = 'allpass';
    }

    // Voice simulation tone (FM sweep to sound like human vocal formant + cabin acoustic test)
    this.osc = ctx.createOscillator();
    this.osc.type = sampleType === 'clipped' && !isDeClipped ? 'sawtooth' : 'triangle';
    this.osc.frequency.setValueAtTime(220, now);
    this.osc.frequency.exponentialRampToValueAtTime(480, now + 0.8);
    this.osc.frequency.exponentialRampToValueAtTime(180, now + 1.8);
    this.osc.frequency.exponentialRampToValueAtTime(320, now + 2.8);

    // If clipped and not fixed, inject distorted harmonic spikes at t=1.12s and t=2.04s
    if (sampleType === 'clipped' && !isDeClipped) {
      const clipOsc = ctx.createOscillator();
      clipOsc.type = 'square';
      clipOsc.frequency.setValueAtTime(2400, now);
      const clipGain = ctx.createGain();
      clipGain.gain.setValueAtTime(0.0001, now);
      
      // Spike at 1.12s
      clipGain.gain.setValueAtTime(0.0001, now + 1.1);
      clipGain.gain.linearRampToValueAtTime(0.15, now + 1.12);
      clipGain.gain.linearRampToValueAtTime(0.0001, now + 1.25);
      
      // Spike at 2.04s
      clipGain.gain.setValueAtTime(0.0001, now + 2.02);
      clipGain.gain.linearRampToValueAtTime(0.18, now + 2.04);
      clipGain.gain.linearRampToValueAtTime(0.0001, now + 2.18);

      clipOsc.connect(clipGain);
      clipGain.connect(this.filterNode);
      clipOsc.start(now);
      clipOsc.stop(now + this.duration);
    }

    // Subtle pink noise for car cabin background aero/road
    try {
      const bufferSize = ctx.sampleRate * 3;
      const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      let b0 = 0, b1 = 0, b2 = 0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.96900 * b2 + white * 0.1538520;
        output[i] = (b0 + b1 + b2) * 0.04;
      }
      this.noiseNode = ctx.createBufferSource();
      this.noiseNode.buffer = noiseBuffer;
      this.noiseNode.connect(this.filterNode);
      this.noiseNode.start(now);
      this.noiseNode.stop(now + this.duration);
    } catch {
      // Audio buffer fallback if restricted
    }

    this.osc.connect(this.filterNode);
    this.filterNode.connect(this.gainNode);
    this.gainNode.connect(ctx.destination);

    this.osc.start(now);
    this.osc.stop(now + this.duration);

    // Timer loop for playhead
    const startTime = Date.now();
    this.timer = window.setInterval(() => {
      const elapsed = (Date.now() - startTime) / 1000;
      this.currentTime = elapsed;
      if (this.onTimeUpdate) {
        this.onTimeUpdate(Math.min(elapsed, this.duration));
      }
      if (elapsed >= this.duration) {
        this.stop();
        if (onEnded) onEnded();
      }
    }, 40);
  }

  public stop() {
    this.isPlaying = false;
    if (this.timer !== null) {
      clearInterval(this.timer);
      this.timer = null;
    }
    try {
      if (this.osc) {
        this.osc.stop();
        this.osc.disconnect();
        this.osc = null;
      }
      if (this.noiseNode) {
        this.noiseNode.stop();
        this.noiseNode.disconnect();
        this.noiseNode = null;
      }
    } catch {
      // ignore already stopped nodes
    }
  }

  public getIsPlaying() {
    return this.isPlaying;
  }
}

export const audioSimulator = new AudioSimulatorService();
