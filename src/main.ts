import './styles/main.css';
import { ThemeManager } from './logic/theme';
import { GamificationSystem } from './logic/gamification';
import { AnimationSystem, TextGlitcher } from './logic/animations';

document.addEventListener('DOMContentLoaded', () => {
    // Initialize Logic Modules
    new ThemeManager();
    new GamificationSystem();
    new AnimationSystem();

    // Initialize Hero Glitch
    const heroTitle = document.getElementById('hero-title');
    if (heroTitle) {
        const glitcher = new TextGlitcher(heroTitle);
        // Accessibility Check
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        if (prefersReducedMotion) {
            heroTitle.style.opacity = '1';
        } else {
            glitcher.splitText();
            // Add a small delay before revealing to ensure layout is stable?
            // Or just reveal immediately.
            requestAnimationFrame(() => glitcher.reveal());
        }
    }

    console.log('DevQuest Bootcamp - System Initialized');
});
