import './styles/main.css';
import { ThemeManager } from './logic/theme';
import { GamificationSystem } from './logic/gamification';
import { AnimationSystem } from './logic/animations';

document.addEventListener('DOMContentLoaded', () => {
    // Initialize Logic Modules
    new ThemeManager();
    new GamificationSystem();
    new AnimationSystem();

    console.log('DevQuest Bootcamp - System Initialized');
});
