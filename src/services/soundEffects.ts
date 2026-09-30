/**
 * Web Audio API procedural sound synthesizer for 2D Zombie Survival
 */

class SurvivalSoundEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private musicPlaying: boolean = false;
  private bgmInterval: number | null = null;
  private musicTempo: number = 120;
  private musicStep: number = 0;

  private initCtx(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtxClass =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtxClass) {
        this.ctx = new AudioCtxClass();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    if (muted && this.musicPlaying) {
      this.stopMusic();
    }
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  // Bazooka rocket shot
  public playBazookaShot() {
    if (this.isMuted) return;
    const ctx = this.initCtx();
    if (!ctx) return;

    // Whooshing rocket thrust
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(380, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(80, ctx.currentTime + 0.28);

    gain.gain.setValueAtTime(0.25, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.28);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.28);
  }

  // Shotgun blast
  public playShotgunShot() {
    if (this.isMuted) return;
    const ctx = this.initCtx();
    if (!ctx) return;

    const dur = 0.22;
    const bufferSize = ctx.sampleRate * dur;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.15));
    }
    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1600, ctx.currentTime);
    filter.frequency.exponentialRampToValueAtTime(120, ctx.currentTime + dur);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.3, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + dur);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    noise.start();
    noise.stop(ctx.currentTime + dur);
  }

  // Pistol shot
  public playPistolShot() {
    if (this.isMuted) return;
    const ctx = this.initCtx();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'square';
    osc.frequency.setValueAtTime(880, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(140, ctx.currentTime + 0.08);

    gain.gain.setValueAtTime(0.18, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.08);
  }

  // Sandal Launch
  public playSandalShot() {
    if (this.isMuted) return;
    const ctx = this.initCtx();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(320, ctx.currentTime);
    osc.frequency.linearRampToValueAtTime(750, ctx.currentTime + 0.08);
    osc.frequency.exponentialRampToValueAtTime(110, ctx.currentTime + 0.22);

    gain.gain.setValueAtTime(0.2, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.22);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.22);
  }

  // Massive explosion for rocket / airstrike impact
  public playExplosion(isLarge: boolean = false) {
    if (this.isMuted) return;
    const ctx = this.initCtx();
    if (!ctx) return;

    const dur = isLarge ? 0.6 : 0.35;
    const bufferSize = ctx.sampleRate * dur;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.35));
    }
    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(isLarge ? 500 : 900, ctx.currentTime);
    filter.frequency.exponentialRampToValueAtTime(40, ctx.currentTime + dur);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(isLarge ? 0.45 : 0.25, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + dur);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    noise.start();
    noise.stop(ctx.currentTime + dur);
  }

  // Zombie death / splatter
  public playZombieHit() {
    if (this.isMuted) return;
    const ctx = this.initCtx();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(160, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(50, ctx.currentTime + 0.1);

    gain.gain.setValueAtTime(0.12, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.1);
  }

  // Airstrike alert
  public playAirstrikeIncoming() {
    if (this.isMuted) return;
    const ctx = this.initCtx();
    if (!ctx) return;

    for (let i = 0; i < 2; i++) {
      const t = ctx.currentTime + i * 0.22;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(600, t);
      osc.frequency.linearRampToValueAtTime(950, t + 0.18);

      gain.gain.setValueAtTime(0.18, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.18);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(t);
      osc.stop(t + 0.18);
    }
  }

  // Supply pickup
  public playSupplyPickup() {
    if (this.isMuted) return;
    const ctx = this.initCtx();
    if (!ctx) return;

    const notes = [330, 440, 554.37, 659.25];
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.05);

      gain.gain.setValueAtTime(0.15, ctx.currentTime + idx * 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.05 + 0.12);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(ctx.currentTime + idx * 0.05);
      osc.stop(ctx.currentTime + idx * 0.05 + 0.12);
    });
  }

  // Combo Ding
  public playComboDing(combo: number) {
    if (this.isMuted) return;
    const ctx = this.initCtx();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    const pitch = Math.min(1200, 440 + combo * 25);
    osc.frequency.setValueAtTime(pitch, ctx.currentTime);

    gain.gain.setValueAtTime(0.14, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.15);
  }

  // Background Synth Music
  public startMusic(tempo: number = 124) {
    if (this.isMuted || this.musicPlaying) return;
    this.musicPlaying = true;
    this.musicTempo = tempo;
    this.musicStep = 0;

    const bassLine = [65.41, 65.41, 77.78, 87.31, 65.41, 65.41, 98.0, 87.31];
    const synthNotes = [261.63, 311.13, 349.23, 392.0, 466.16, 392.0];
    const stepDurationMs = (60 / this.musicTempo / 2) * 1000;

    this.bgmInterval = window.setInterval(() => {
      if (this.isMuted || !this.musicPlaying) return;
      const ctx = this.initCtx();
      if (!ctx) return;

      const step = this.musicStep % 16;
      this.musicStep++;

      // Heavy survival bassline on even steps
      if (step % 2 === 0) {
        const bassOsc = ctx.createOscillator();
        const bassGain = ctx.createGain();
        bassOsc.type = 'triangle';
        const noteIdx = Math.floor(step / 2) % bassLine.length;
        bassOsc.frequency.setValueAtTime(bassLine[noteIdx], ctx.currentTime);

        bassGain.gain.setValueAtTime(0.07, ctx.currentTime);
        bassGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.14);

        bassOsc.connect(bassGain);
        bassGain.connect(ctx.destination);
        bassOsc.start();
        bassOsc.stop(ctx.currentTime + 0.14);
      }

      // Eerie midnight arpeggios
      if (step % 4 === 1 || step === 14) {
        const leadOsc = ctx.createOscillator();
        const leadGain = ctx.createGain();
        leadOsc.type = 'sawtooth';
        const leadIdx = (step + 3) % synthNotes.length;
        leadOsc.frequency.setValueAtTime(synthNotes[leadIdx], ctx.currentTime);

        leadGain.gain.setValueAtTime(0.025, ctx.currentTime);
        leadGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);

        leadOsc.connect(leadGain);
        leadGain.connect(ctx.destination);
        leadOsc.start();
        leadOsc.stop(ctx.currentTime + 0.1);
      }
    }, stepDurationMs);
  }

  public stopMusic() {
    this.musicPlaying = false;
    if (this.bgmInterval !== null) {
      clearInterval(this.bgmInterval);
      this.bgmInterval = null;
    }
  }
}

export const sounds = new SurvivalSoundEngine();
