import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { GamificationSystem, Ranks } from '../src/logic/gamification';

describe('GamificationSystem', () => {
    let gamification: GamificationSystem;

    beforeEach(() => {
        document.body.innerHTML = `
            <div id="xp-bar-fill" style="width: 0%"></div>
            <div id="player-level">01</div>
            <div id="player-rank">Novice</div>
            <div id="achievement-toast" class="opacity-0 translate-y-20"></div>
            <div id="achievement-text"></div>
        `;
        gamification = new GamificationSystem();
        vi.useFakeTimers();
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it('should calculate level accurately based on percent', () => {
        expect(gamification.calculateLevel(0)).toBe(1);
        expect(gamification.calculateLevel(50)).toBe(51);
        expect(gamification.calculateLevel(99)).toBe(100);
    });

    it('should determine correct rank based on threshold', () => {
        expect(gamification.getRankName(0)).toBe(Ranks[0].name); // Novice
        expect(gamification.getRankName(15)).toBe(Ranks[1].name); // Initiate
        expect(gamification.getRankName(95)).toBe(Ranks[5].name); // Legend
    });

    it('should update DOM elements on progress update', () => {
        // Mock getBoundingClientRect/scrollTop since JSDOM doesn't handle layout
        // We will call the update method directly with a progress value for testing logic
        // separating DOM reading from DOM writing is good practice, but here we'll simulate the effect

        gamification.updateUI(50); // 50%

        const xpBar = document.getElementById('xp-bar-fill');
        const levelEl = document.getElementById('player-level');
        const rankEl = document.getElementById('player-rank');

        expect(xpBar?.style.width).toBe('50%');
        expect(levelEl?.textContent).toBe('51');
        expect(rankEl?.textContent).toBe('Shader Coder'); // Threshold 50 matches Shader Coder
    });

    it('should trigger toast on rank up', () => {
        // Start at 0
        gamification.updateUI(0);

        // Jump to 20 (Target: Initiate, threshold 15)
        gamification.updateUI(20);

        const toast = document.getElementById('achievement-toast');
        const toastText = document.getElementById('achievement-text');

        // Should have removed hidden classes
        expect(toast?.classList.contains('translate-y-20')).toBe(false);
        expect(toastText?.textContent).toContain('Initiate');
    });
});
