import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AudioSystem } from '../../src/engine/AudioSystem';

// Mock AudioContext
const mockConnect = vi.fn();
const mockGain = {
    gain: { value: 0, setValueAtTime: vi.fn(), exponentialRampToValueAtTime: vi.fn() },
    connect: mockConnect
};
const mockOscillator = {
    connect: vi.fn(),
    start: vi.fn(),
    stop: vi.fn(),
    type: '',
    frequency: { setValueAtTime: vi.fn(), exponentialRampToValueAtTime: vi.fn() }
};

const mockAudioContext = {
    createGain: vi.fn(() => mockGain),
    createOscillator: vi.fn(() => mockOscillator),
    resume: vi.fn(),
    destination: {},
    currentTime: 0
};

describe('AudioSystem', () => {
    let audioSystem: AudioSystem;

    beforeEach(() => {
        // Explicitly pass the mock context to avoid global scope issues
        audioSystem = new AudioSystem(mockAudioContext as unknown as AudioContext);
        vi.clearAllMocks();
    });

    it('should initialize successfully', () => {
        expect(audioSystem).toBeDefined();
    });

    it('should play shoot sound', () => {
        audioSystem.playShoot();
        expect(mockAudioContext.createOscillator).toHaveBeenCalled();
        expect(mockOscillator.start).toHaveBeenCalled();
        expect(mockOscillator.type).toBe('square');
    });

    it('should play explosion sound', () => {
        audioSystem.playExplosion();
        expect(mockAudioContext.createOscillator).toHaveBeenCalled();
        expect(mockOscillator.start).toHaveBeenCalled();
        expect(mockOscillator.type).toBe('sawtooth');
    });

    it('should start BGM sequence', () => {
        vi.useFakeTimers();
        audioSystem.startBGM();
        // First beat plays immediately
        expect(mockAudioContext.createOscillator).toHaveBeenCalled();

        // Advance time for next beat
        vi.advanceTimersByTime(1100);
        expect(mockAudioContext.createOscillator).toHaveBeenCalledTimes(2); // Initial + 1 loop

        audioSystem.stopBGM();
        vi.useRealTimers();
    });
});
