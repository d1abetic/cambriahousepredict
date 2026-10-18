// Authentic Chain Rustling Sound Engine
// Exclusively uses the user's uploaded MP3 file: /sounds/chainrustlingsfx.mp3
// Loops repeatedly on every scroll (up or down) and smoothly pauses when scrolling stops.

class ChainSoundEngine {
  private targetVolume: number = 0.95;
  private ctx: AudioContext | null = null;
  private audioBuffer: AudioBuffer | null = null;
  private sourceNode: AudioBufferSourceNode | null = null;
  private gainNode: GainNode | null = null;
  private stopTimeout: any = null;
  private isWebAudioReady: boolean = false;

  // HTML5 Audio fallback
  private htmlAudio: HTMLAudioElement | null = null;
  private isHtmlStarting: boolean = false;
  private isHtmlPlaying: boolean = false;
  private shouldBePlaying: boolean = false;

  constructor() {
    if (typeof window !== 'undefined') {
      try {
        localStorage.removeItem('cambria_chain_sound_muted');
      } catch (e) {}

      this.initHtmlAudio();
      this.initWebAudio();
      this.setupInteractionListeners();
    }
  }

  private initHtmlAudio() {
    if (typeof window === 'undefined') return;
    if (!this.htmlAudio) {
      this.htmlAudio = new Audio('/sounds/chainrustlingsfx.mp3');
      this.htmlAudio.loop = true;
      this.htmlAudio.preload = 'auto';
      this.htmlAudio.volume = this.targetVolume;
    }
  }

  private initWebAudio() {
    if (typeof window === 'undefined') return;
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return;

    if (!this.ctx) {
      this.ctx = new AudioCtx();
    }

    // Fetch and decode chainrustlingsfx.mp3 for instant zero-latency looping
    fetch('/sounds/chainrustlingsfx.mp3')
      .then((res) => res.arrayBuffer())
      .then((buf) => this.ctx!.decodeAudioData(buf))
      .then((decoded) => {
        this.audioBuffer = decoded;
        this.setupWebAudioLoop();
      })
      .catch((err) => {
        console.debug('WebAudio fetch/decode error, using HTML5 audio:', err);
      });
  }

  private setupWebAudioLoop() {
    if (!this.ctx || !this.audioBuffer) return;
    try {
      this.sourceNode = this.ctx.createBufferSource();
      this.sourceNode.buffer = this.audioBuffer;
      this.sourceNode.loop = true;

      this.gainNode = this.ctx.createGain();
      this.gainNode.gain.setValueAtTime(0, this.ctx.currentTime); // silent until scroll

      this.sourceNode.connect(this.gainNode);
      this.gainNode.connect(this.ctx.destination);
      this.sourceNode.start(0);
      this.isWebAudioReady = true;
    } catch (e) {
      console.debug('WebAudio loop error:', e);
    }
  }

  private setupInteractionListeners() {
    if (typeof window === 'undefined') return;

    const unlock = () => {
      // Resume AudioContext if suspended by browser autoplay policy
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume().catch(() => {});
      }
      if (this.htmlAudio) {
        this.htmlAudio.load();
      }
    };

    window.addEventListener('pointerdown', unlock, { passive: true });
    window.addEventListener('click', unlock, { passive: true });
    window.addEventListener('keydown', unlock, { passive: true });
    window.addEventListener('touchstart', unlock, { passive: true });
    window.addEventListener('wheel', unlock, { passive: true });
  }

  public getMuted(): boolean {
    return false;
  }

  public setMuted(_muted: boolean) {}

  public toggleMute(): boolean {
    return false;
  }

  public subscribe(callback: (muted: boolean) => void): () => void {
    callback(false);
    return () => {};
  }

  /**
   * Triggers the continuous repeating chain rustle loop while scrolling
   */
  public onUserScroll() {
    this.shouldBePlaying = true;

    // Reset stop timer on every scroll tick
    if (this.stopTimeout) {
      clearTimeout(this.stopTimeout);
      this.stopTimeout = null;
    }

    // 1. Primary: Web Audio API (smooth gain ramp, zero race-conditions)
    if (this.isWebAudioReady && this.ctx && this.gainNode) {
      if (this.ctx.state === 'suspended') {
        this.ctx.resume().catch(() => {});
      }
      try {
        this.gainNode.gain.cancelScheduledValues(this.ctx.currentTime);
        this.gainNode.gain.setTargetAtTime(this.targetVolume, this.ctx.currentTime, 0.02);
      } catch (e) {
        // ignore
      }
    } else {
      // 2. Fallback: HTML5 Audio with promise guards to prevent interruption errors
      this.initHtmlAudio();
      if (this.htmlAudio && !this.isHtmlPlaying && !this.isHtmlStarting) {
        this.isHtmlStarting = true;
        this.htmlAudio.volume = this.targetVolume;
        const p = this.htmlAudio.play();
        if (p !== undefined) {
          p.then(() => {
            this.isHtmlPlaying = true;
            this.isHtmlStarting = false;
            if (!this.shouldBePlaying && this.htmlAudio) {
              this.htmlAudio.pause();
              this.isHtmlPlaying = false;
            }
          }).catch((err) => {
            this.isHtmlStarting = false;
            console.debug('Autoplay waiting for gesture:', err?.message || err);
          });
        }
      }
    }

    // Stop after scrolling pauses (250ms of inactivity)
    this.stopTimeout = setTimeout(() => {
      this.stop();
    }, 250);
  }

  public playRattle(_direction: 'up' | 'down' = 'down', _speed: number = 1.0, _force: boolean = false) {
    this.onUserScroll();
  }

  public stop() {
    this.shouldBePlaying = false;

    // Stop Web Audio by ramping gain to 0
    if (this.isWebAudioReady && this.ctx && this.gainNode) {
      try {
        this.gainNode.gain.cancelScheduledValues(this.ctx.currentTime);
        this.gainNode.gain.setTargetAtTime(0, this.ctx.currentTime, 0.06);
      } catch (e) {
        // ignore
      }
    }

    // Stop HTML5 Audio if playing
    if (this.htmlAudio && this.isHtmlPlaying && !this.isHtmlStarting) {
      this.htmlAudio.pause();
      this.isHtmlPlaying = false;
    }
  }
}

export const chainSoundEngine = new ChainSoundEngine();
