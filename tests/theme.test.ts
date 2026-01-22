import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ThemeManager } from '../src/logic/theme';

describe('ThemeManager', () => {
    let themeManager: ThemeManager;

    beforeEach(() => {
        // Reset DOM
        document.documentElement.className = '';
        localStorage.clear();
        vi.clearAllMocks();
    });

    it('should initialize with "dark" if localStorage says "dark"', () => {
        localStorage.setItem('theme', 'dark');
        themeManager = new ThemeManager();
        expect(document.documentElement.classList.contains('dark')).toBe(true);
    });

    it('should initialize with "light" if localStorage says "light"', () => {
        localStorage.setItem('theme', 'light');
        themeManager = new ThemeManager();
        expect(document.documentElement.classList.contains('dark')).toBe(false);
    });

    it('should respect system preference (dark) if localStorage is empty', () => {
        // Mock matchMedia
        window.matchMedia = vi.fn().mockImplementation(query => ({
            matches: query === '(prefers-color-scheme: dark)',
            media: query,
            onchange: null,
            addListener: vi.fn(), // deprecated
            removeListener: vi.fn(), // deprecated
            addEventListener: vi.fn(),
            removeEventListener: vi.fn(),
            dispatchEvent: vi.fn(),
        }));

        themeManager = new ThemeManager();
        expect(document.documentElement.classList.contains('dark')).toBe(true);
    });

    it('should toggle from light to dark', () => {
        localStorage.setItem('theme', 'light');
        themeManager = new ThemeManager();

        themeManager.toggle();

        expect(document.documentElement.classList.contains('dark')).toBe(true);
        expect(localStorage.getItem('theme')).toBe('dark');
    });

    it('should toggle from dark to light', () => {
        localStorage.setItem('theme', 'dark');
        themeManager = new ThemeManager();

        themeManager.toggle();

        expect(document.documentElement.classList.contains('dark')).toBe(false);
        expect(localStorage.getItem('theme')).toBe('light');
    });
});
