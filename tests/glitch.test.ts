import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { TextGlitcher } from '../src/logic/animations';

describe('TextGlitcher', () => {
    let container: HTMLElement;

    beforeEach(() => {
        container = document.createElement('h1');
        container.textContent = 'Glitch Me';
        document.body.appendChild(container);
    });

    afterEach(() => {
        document.body.removeChild(container);
    });

    it('should split text into individual spans', () => {
        const glitcher = new TextGlitcher(container);
        glitcher.splitText();

        const spans = container.querySelectorAll('span');
        expect(spans.length).toBe(9); // "Glitch Me" = 9 chars including space
        expect(spans[0].textContent).toBe('G');
        expect(spans[8].textContent).toBe('e');
    });

    it('should assign a random delay to each character', () => {
        const glitcher = new TextGlitcher(container);
        glitcher.splitText();

        const spans = container.querySelectorAll('span');
        spans.forEach(span => {
            const delay = parseFloat(span.style.getPropertyValue('--delay'));
            expect(delay).toBeGreaterThanOrEqual(0);
            expect(delay).toBeLessThan(1); // Assuming max delay is 1s
        });
    });

    it('should reveal characters sequentially', () => {
        vi.useFakeTimers();
        const glitcher = new TextGlitcher(container);
        glitcher.splitText();
        glitcher.reveal();

        const spans = container.querySelectorAll('span');

        // Initial state: spans might be hidden via CSS, but JS adds classes.
        // We expect timeouts to be set.

        // Advance time a bit
        vi.advanceTimersByTime(100);
        // Expect some spans to have 'glitching' class or visible class if delay was small

        // Advance time to finish
        vi.advanceTimersByTime(3000);
        spans.forEach(span => {
            expect(span.classList.contains('reveal-visible-letter')).toBe(true);
            expect(span.classList.contains('glitching')).toBe(false);
        });

        vi.useRealTimers();
    });
});

