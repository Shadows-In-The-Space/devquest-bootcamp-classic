export class AudioSystem {
    private context: AudioContext;
    private gainNode: GainNode;
    private enabled: boolean = false;

    private bgmInterval: any = null;
    private noteIndex: number = 0;
    private tempo: number = 1000; // ms per beat
    private baseFreqs: number[] = [180, 170, 160, 150]; // Classic 4-note descent

    constructor(context?: AudioContext) {
        // Handle browser differences or lack of support safely
        try {
            this.context = context || new (window.AudioContext || (window as any).webkitAudioContext)();
            this.gainNode = this.context.createGain();
            this.gainNode.connect(this.context.destination);
            this.gainNode.gain.value = 0.1; // Default low volume
            this.enabled = true;
        } catch (e) {
            console.warn('Web Audio API not supported', e);
            // Fallback mock context if needed, or just guard methods
            this.enabled = false;
        }
    }

    playShoot() {
        if (!this.enabled) return;
        this.context.resume(); // Ensure context is running

        const osc = this.context.createOscillator();
        const gain = this.context.createGain();

        osc.connect(gain);
        gain.connect(this.gainNode);

        // Pew-pew: Square wave dropping in pitch
        osc.type = 'square';
        osc.frequency.setValueAtTime(800, this.context.currentTime);
        osc.frequency.exponentialRampToValueAtTime(100, this.context.currentTime + 0.1);

        gain.gain.setValueAtTime(0.1, this.context.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.context.currentTime + 0.1);

        osc.start();
        osc.stop(this.context.currentTime + 0.1);
    }

    playExplosion() {
        if (!this.enabled) return;
        this.context.resume();

        const osc = this.context.createOscillator();
        const gain = this.context.createGain();

        osc.connect(gain);
        gain.connect(this.gainNode);

        // Explosion: Sawtooth low pitch
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(100, this.context.currentTime);
        osc.frequency.exponentialRampToValueAtTime(10, this.context.currentTime + 0.3);

        gain.gain.setValueAtTime(0.2, this.context.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.context.currentTime + 0.3);

        osc.start();
        osc.stop(this.context.currentTime + 0.3);
    }

    startBGM() {
        if (!this.enabled || this.bgmInterval) return;
        this.context.resume();

        this.noteIndex = 0;
        this.scheduleNextBeat();
    }

    private scheduleNextBeat() {
        if (this.bgmInterval) clearTimeout(this.bgmInterval);

        this.playBeat();

        // Loop
        this.bgmInterval = setTimeout(() => {
            this.scheduleNextBeat();
        }, this.tempo);
    }

    private playBeat() {
        if (this.context.state === 'suspended') this.context.resume();

        const osc = this.context.createOscillator();
        const gain = this.context.createGain();
        osc.connect(gain);
        gain.connect(this.gainNode);

        // Short, punchy bass note
        osc.type = 'square';
        osc.frequency.setValueAtTime(this.baseFreqs[this.noteIndex % 4], this.context.currentTime);
        osc.frequency.exponentialRampToValueAtTime(this.baseFreqs[this.noteIndex % 4] - 20, this.context.currentTime + 0.1);

        gain.gain.setValueAtTime(0.1, this.context.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.context.currentTime + 0.1);

        osc.start();
        osc.stop(this.context.currentTime + 0.1);

        this.noteIndex++;
    }

    stopBGM() {
        if (this.bgmInterval) {
            clearTimeout(this.bgmInterval);
            this.bgmInterval = null;
        }
    }

    setTempo(ms: number) {
        this.tempo = Math.max(100, ms); // Cap max speed
    }
}
