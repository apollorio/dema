// Apollo BPM Ultra Pro - AudioWorklet Processor
// Ultra-low latency BPM detection with hybrid algorithms
// FIX v2: corrected score/threshold domain, autocorrelation window,
//          beat gating, dynamic rate propagation via postMessage

class BPMProcessor extends AudioWorkletProcessor {
  constructor() {
    super();

    // Peaks / intervals
    this.lastPeak      = 0;
    this.intervals     = [];
    this.smoothBPM     = 0;
    this.phase         = 0;
    this.downbeatCount = 0;

    // Adaptive RMS (float domain, 0-1 scale)
    this.avgRMS        = 0.02;

    // Spectral flux: keep one previous block (float domain, per-sample)
    this.prevBlock     = new Float32Array(128);
    this.smoothFlux    = 0;

    // Circular sample buffer for autocorrelation over ~1 sec
    // 4096 samples ≈ 93ms at 44100 — use 8192 for ~185ms window
    // Full beat-period autocorrelation needs  sampleRate / MIN_BPM samples
    // At 44100: 44100/60 ≈ 735 — so 2048 is sufficient for 60–220 BPM
    this.CORR_BUF  = 2048;
    this.corrBuf   = new Float32Array(this.CORR_BUF);
    this.corrIdx   = 0;
    this.corrFull  = false; // true once buffer filled once

    // Tick throttle for battery optimization (controlled from main thread)
    // process() is called every 128 samples → ~344 calls/sec at 44100Hz
    // To post at 60Hz: 344/60 ≈ 5.7 → postEvery = 6
    this.tickCount    = 0;
    this.quantaPerSec = Math.max(1, Math.floor(sampleRate / 128));
    this.postEvery    = Math.max(1, Math.floor(this.quantaPerSec / 60));

    // Listen to dynamic-rate messages from main thread
    this.port.onmessage = (e) => {
      if (e.data && e.data.dynamicRate) {
        this.postEvery = Math.max(1, Math.floor(this.quantaPerSec / e.data.dynamicRate));
      }
    };
  }

  process(inputs, outputs) {
    const input = inputs[0][0];
    if (!input || !input.length) return true;

    // ── 0. PASS-THROUGH: copy input → output so downstream analyser gets audio ──
    const output = outputs[0];
    for (let ch = 0; ch < output.length; ch++) {
      const src = inputs[0][ch] || input;
      const dst = output[ch];
      if (dst) dst.set(src);
    }

    const now = currentTime * 1000; // ms

    // ── 1. Accumulate samples into circular correlation buffer ──
    for (let i = 0; i < input.length; i++) {
      this.corrBuf[this.corrIdx] = input[i];
      this.corrIdx = (this.corrIdx + 1) % this.CORR_BUF;
      if (this.corrIdx === 0) this.corrFull = true;
    }

    // ── 2. Throttle heavy analysis (battery optimization) ──
    this.tickCount++;
    if (this.tickCount % this.postEvery !== 0) return true;

    // ── 3. Hybrid analysis ──
    const rms  = this.calculateRMS(input);       // float, 0-1
    const flux = this.calculateSpectralFlux(input); // float, 0-1 normalised
    const corr = this.calculateAutocorrelation();   // float, 0-1 normalised

    // ── 4. Adaptive threshold — all in float 0-1 domain (FIX #1) ──
    this.avgRMS = this.avgRMS * 0.88 + rms * 0.12;
    const threshold = Math.max(0.03, this.avgRMS * 0.35);

    // ── 5. Hybrid score — all components 0-1 (FIX #1) ──
    const score = rms * 0.5 + flux * 0.3 + corr * 0.2;

    // ── 6. Peak / beat detection ──
    let beat = false;
    if (score > threshold && (now - this.lastPeak) > 120) {
      beat = true;
      if (this.lastPeak > 0) {
        const interval = now - this.lastPeak;
        if (interval > 200 && interval < 2000) {
          this.intervals.push(interval);
          if (this.intervals.length > 24) this.intervals.shift();

          // Phase & downbeat
          this.phase = (this.phase + 1) % 4;
          if (this.phase === 0) this.downbeatCount++;
        }
      }
      this.lastPeak = now;
    }

    // ── 7. BPM calculation with EMA continuity smoothing ──
    if (this.intervals.length >= 6) {
      this.calculateBPM();
    }

    // ── 8. Post to main thread — beat flag is explicit (FIX #3) ──
    this.port.postMessage({
      bpm:      Math.round(this.smoothBPM),
      phase:    this.phase,
      downbeat: this.downbeatCount,
      rms:      rms,
      beat:     beat          // FIX: explicit beat flag, NOT just rms > 0
    });

    return true;
  }

  // Returns RMS in float 0-1 domain
  calculateRMS(input) {
    let sum = 0;
    for (let i = 0; i < input.length; i++) sum += input[i] * input[i];
    return Math.sqrt(sum / input.length);
  }

  // Spectral flux approximation using half-wave rectified frame diff (float 0-1)
  // FIX #2: keeps the concept correct — energy increase detection between frames
  calculateSpectralFlux(input) {
    let flux = 0;
    const len = Math.min(input.length, this.prevBlock.length);
    for (let i = 0; i < len; i++) {
      const diff = Math.abs(input[i]) - Math.abs(this.prevBlock[i]);
      if (diff > 0) flux += diff; // half-wave rectify: only energy increases
      this.prevBlock[i] = input[i];
    }
    flux /= len; // normalise to 0-1 range (max diff = 1.0)
    this.smoothFlux = this.smoothFlux * 0.9 + flux * 0.1;
    return Math.min(1, this.smoothFlux * 4); // scale for sensitivity, cap at 1
  }

  // Tempo autocorrelation over accumulated circular buffer
  // FIX #2: lag range now in SAMPLES matching BPM 60-220 at actual sampleRate
  calculateAutocorrelation() {
    if (!this.corrFull && this.corrIdx < 800) return 0; // need enough data

    // Lag range: sampleRate/220 to sampleRate/60 (220 to 735 at 44100Hz)
    const lagMin = Math.floor(sampleRate / 220);
    const lagMax = Math.min(Math.floor(sampleRate / 60), this.CORR_BUF - 1);

    let maxCorr  = 0;
    const bufLen = this.CORR_BUF;

    for (let lag = lagMin; lag <= lagMax; lag += 4) { // step 4 for speed
      let corr = 0;
      const samples = Math.min(512, bufLen - lag);
      for (let i = 0; i < samples; i++) {
        const a = this.corrBuf[(this.corrIdx - 1 - i + bufLen) % bufLen];
        const b = this.corrBuf[(this.corrIdx - 1 - i - lag + bufLen) % bufLen];
        corr += a * b;
      }
      corr /= samples;
      if (corr > maxCorr) maxCorr = corr;
    }

    return Math.min(1, Math.max(0, maxCorr * 4)); // normalise to 0-1
  }

  // Calculate BPM from intervals using median + EMA continuity smoothing
  calculateBPM() {
    const sorted   = this.intervals.slice().sort((a, b) => a - b);
    const median   = sorted[Math.floor(sorted.length / 2)];
    const filtered = sorted.filter(v => Math.abs(v - median) < median * 0.3);
    if (filtered.length < 4) return;

    const avgInterval = filtered.reduce((a, b) => a + b, 0) / filtered.length;
    let bpm = 60000 / avgInterval;

    // Octave normalisation
    while (bpm < 60)  bpm *= 2;
    while (bpm > 220) bpm /= 2;

    // EMA continuity smoothing — prevents jumps (FIX: already correct)
    if (this.smoothBPM === 0) {
      this.smoothBPM = bpm; // cold start: seed directly
    } else {
      this.smoothBPM = this.smoothBPM * 0.85 + bpm * 0.15;
    }
  }
}

registerProcessor('bpm-processor', BPMProcessor);