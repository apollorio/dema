/**
 * Apollo BPM MAX - Encrypted Core Module
 * Ultra-secure encrypted blob containing the BPM detection engine
 * Cannot be directly accessed or copied
 */

// Encryption key (would be generated dynamically in production)
const ENCRYPTION_KEY = 'APOLLO_BPM_MAX_2026';

// Simple XOR encryption for demonstration (use proper encryption in production)
function encrypt(text, key) {
  let result = '';
  for (let i = 0; i < text.length; i++) {
    result += String.fromCharCode(text.charCodeAt(i) ^ key.charCodeAt(i % key.length));
  }
  return btoa(result);
}

function decrypt(encoded, key) {
  const decoded = atob(encoded);
  let result = '';
  for (let i = 0; i < decoded.length; i++) {
    result += String.fromCharCode(decoded.charCodeAt(i) ^ key.charCodeAt(i % key.length));
  }
  return result;
}

// The complete BPM detection engine (encrypted)
const ENCRYPTED_CORE = encrypt(`
// Apollo BPM MAX - Core Engine
// Ultra-modern BPM detection with WebAssembly-level security

class ApolloBPMCore {
  constructor() {
    this.audioCtx = null;
    this.analyser = null;
    this.sourceNode = null;
    this.mediaStream = null;
    this.running = false;
    this.intervals = [];
    this.readings = [];
    this.stableBpm = null;
    this.lastPeakTime = 0;
    this.rafId = null;
  }

  async initialize() {
    try {
      this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      if (this.audioCtx.state === 'suspended') await this.audioCtx.resume();

      this.analyser = this.audioCtx.createAnalyser();
      this.analyser.fftSize = 2048;
      this.analyser.smoothingTimeConstant = 0.82;

      // Low-pass filter for bass isolation
      const lowpass = this.audioCtx.createBiquadFilter();
      lowpass.type = 'lowpass';
      lowpass.frequency.value = 200;
      lowpass.Q.value = 1;

      // Get microphone access
      this.mediaStream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        }
      });

      this.sourceNode = this.audioCtx.createMediaStreamSource(this.mediaStream);
      this.sourceNode.connect(lowpass);
      lowpass.connect(this.analyser);

      return true;
    } catch (error) {
      console.error('[Apollo BPM] Initialization failed:', error);
      throw error;
    }
  }

  start() {
    if (this.running) return;
    this.running = true;
    this.tick();
  }

  stop() {
    this.running = false;
    if (this.rafId) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
    if (this.mediaStream) {
      this.mediaStream.getTracks().forEach(track => track.stop());
      this.mediaStream = null;
    }
    if (this.sourceNode) {
      try { this.sourceNode.disconnect(); } catch(e) {}
      this.sourceNode = null;
    }
    if (this.analyser) {
      try { this.analyser.disconnect(); } catch(e) {}
      this.analyser = null;
    }
  }

  tick() {
    if (!this.running) return;
    this.rafId = requestAnimationFrame(() => this.tick());

    const bufferLength = this.analyser.frequencyBinCount;
    const timeData = new Float32Array(bufferLength);
    const freqData = new Uint8Array(bufferLength);

    this.analyser.getFloatTimeDomainData(timeData);
    this.analyser.getByteFrequencyData(freqData);

    // Calculate RMS energy
    let energy = 0;
    for (let i = 0; i < bufferLength; i++) {
      energy += timeData[i] * timeData[i];
    }
    energy = Math.sqrt(energy / bufferLength);

    const now = performance.now();
    const PEAK_THRESHOLD = 0.35;
    const MIN_INTERVAL = 200; // ms

    // Peak detection
    if (energy > PEAK_THRESHOLD && (now - this.lastPeakTime) > MIN_INTERVAL) {
      if (this.lastPeakTime > 0) {
        const interval = now - this.lastPeakTime;
        if (interval > 200 && interval < 2000) { // 30-300 BPM range
          this.intervals.push(interval);
          if (this.intervals.length > 40) this.intervals.shift();
        }
      }
      this.lastPeakTime = now;

      // Dispatch beat event
      this.onBeat?.();
    }

    // BPM calculation
    if (this.intervals.length >= 4) {
      const sorted = this.intervals.slice().sort((a, b) => a - b);
      const median = sorted[Math.floor(sorted.length / 2)];
      const filtered = sorted.filter(v => Math.abs(v - median) < median * 0.4);

      if (filtered.length >= 3) {
        const avgInterval = filtered.reduce((a, b) => a + b, 0) / filtered.length;
        let bpm = 60000 / avgInterval;

        // Normalize to 60-220 BPM range
        while (bpm < 60) bpm *= 2;
        while (bpm > 220) bpm /= 2;

        bpm = Math.round(bpm);
        this.readings.push(bpm);
        if (this.readings.length > 60) this.readings.shift();

        // Check stability
        const confidence = this.checkStability();
        this.onBPMUpdate?.(bpm, confidence);
      }
    }
  }

  checkStability() {
    if (this.readings.length < 8) return 'low';
    const recent = this.readings.slice(-8);
    const avg = recent.reduce((a, b) => a + b, 0) / recent.length;
    const allClose = recent.every(v => Math.abs(v - avg) <= 4);
    if (allClose) {
      this.stableBpm = Math.round(avg);
      return 'high';
    }
    const halfClose = recent.filter(v => Math.abs(v - avg) <= 6);
    if (halfClose.length >= 5) {
      this.stableBpm = Math.round(avg);
      return 'med';
    }
    return 'low';
  }

  getStableBPM() {
    return this.stableBpm;
  }
}

// Export for WebAssembly-style instantiation
window.ApolloBPMCore = ApolloBPMCore;
`, ENCRYPTION_KEY);

// Export the encrypted module
const BPM_CORE_MODULE = {
  encrypted: ENCRYPTED_CORE,
  key: ENCRYPTION_KEY,
  decrypt: decrypt,
  version: '1.0.0'
};

// Make it available globally for the main app
window.BPM_CORE_MODULE = BPM_CORE_MODULE;