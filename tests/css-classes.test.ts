import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

describe('CSS Architecture', () => {
    it('should contain .reveal-item class', () => {
        const cssPath = path.resolve(__dirname, '../src/styles/main.css');
        const cssContent = fs.readFileSync(cssPath, 'utf-8');
        expect(cssContent).toContain('.reveal-item');
    });

    it('should contain .reveal-active class', () => {
        const cssPath = path.resolve(__dirname, '../src/styles/main.css');
        const cssContent = fs.readFileSync(cssPath, 'utf-8');
        expect(cssContent).toContain('.reveal-active');
    });

    it('should contain glitch-entry keyframes', () => {
        const cssPath = path.resolve(__dirname, '../src/styles/main.css');
        const cssContent = fs.readFileSync(cssPath, 'utf-8');
        expect(cssContent).toContain('@keyframes glitch-entry');
    });

    it('should contain motion utilities', () => {
        const cssPath = path.resolve(__dirname, '../src/styles/main.css');
        const cssContent = fs.readFileSync(cssPath, 'utf-8');
        expect(cssContent).toContain('.reveal-sweep-left');
        expect(cssContent).toContain('.reveal-sweep-right');
        expect(cssContent).toContain('.reveal-zoom');
    });

    it('should contain prefers-reduced-motion overrides', () => {
        const cssPath = path.resolve(__dirname, '../src/styles/main.css');
        const cssContent = fs.readFileSync(cssPath, 'utf-8');
        expect(cssContent).toContain('@media (prefers-reduced-motion: reduce)');
    });
});
