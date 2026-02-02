import './styles/main.css';
import '@fontsource/space-grotesk'; // Defaults to weight 400
import '@fontsource/space-grotesk/500.css';
import '@fontsource/space-grotesk/600.css';
import '@fontsource/space-grotesk/700.css';
import '@fontsource/space-mono';
import '@fontsource/space-mono/700.css';
import 'material-symbols';

import { ThemeManager } from './logic/theme';
import { GamificationSystem } from './logic/gamification';
import { AnimationSystem, TextGlitcher, StaggeredRevealController } from './logic/animations';
import { GameLauncher } from './game/Launcher';
import { ScoreManager } from './game/ScoreManager';

document.addEventListener('DOMContentLoaded', async () => {
    // Initialize Logic Modules
    new ThemeManager();
    new GamificationSystem();
    new AnimationSystem();
    new GameLauncher();

    // Initialize Staggered Reveal
    const revealController = new StaggeredRevealController();
    revealController.init();

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
            requestAnimationFrame(() => glitcher.reveal());
        }
    }

    // Load Hall of Fame
    const leaderboardList = document.getElementById('landing-leaderboard-list');
    if (leaderboardList) {
        try {
            const scores = await ScoreManager.getLeaderboard(5);
            // ASCII Art Header (Neon Green & Thick)
            const asciiHeader = `
<pre class="text-[0.6rem] sm:text-[0.8rem] leading-[0.8rem] text-center text-[#39ff14] font-black font-mono mb-6 select-none whitespace-pre overflow-x-hidden drop-shadow-[0_0_10px_rgba(57,255,20,0.8)]">
 █  █  █  ████  █  █    ████  ████  ████  ████  ████ 
 █  █  █  █     █  █    █     █     █  █  █  █  █    
 ████  █  █ ██  ████    ████  █     █  █  ████  ████ 
 █  █  █  █  █  █  █       █  █     █  █  █  █  █    
 █  █  █  ████  █  █    ████  ████  ████  █  █  ████ 
</pre>`;

            // ASCII Table Header
            const tableHeader = `
<div class="flex justify-between text-xs sm:text-sm text-brand-green/80 font-mono mb-2 px-4 border-b-2 border-brand-green/40 pb-2 tracking-widest bg-black/20">
    <span>RANK</span>
    <span>PILOT.......</span>
    <span>SCORE</span>
</div>`;

            leaderboardList.innerHTML = asciiHeader + tableHeader + '<div class="space-y-3">' + scores.map((s, i) => {
                const rank = (i + 1).toString().padStart(2, '0');
                const score = s.score.toString().padStart(6, '0');
                const name = s.email.split('@')[0].toUpperCase().substring(0, 10).padEnd(10, '.');

                // Arcade Colors: 1st=Yellow, 2nd=Cyan, 3rd=Magenta
                let colorClass = 'text-gray-400';
                let scoreClass = 'text-gray-300';
                let icon = '  ';

                if (i === 0) {
                    colorClass = 'text-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.8)] animate-pulse';
                    scoreClass = 'text-yellow-400 font-black text-xl'; // Bigger Score for #1
                    icon = '👑';
                }
                else if (i === 1) {
                    colorClass = 'text-cyan-400 drop-shadow-[0_0_5px_rgba(34,211,238,0.8)]';
                    scoreClass = 'text-cyan-400 font-bold text-lg';
                    icon = '🥈';
                }
                else if (i === 2) {
                    colorClass = 'text-fuchsia-400 drop-shadow-[0_0_5px_rgba(232,121,249,0.8)]';
                    scoreClass = 'text-fuchsia-400 font-bold text-lg';
                    icon = '🥉';
                }
                else {
                    scoreClass = 'text-brand-green font-bold text-lg';
                }

                return `
                <div class="flex items-center justify-between font-mono text-base sm:text-lg border-b border-brand-green/20 py-3 hover:bg-brand-green/10 transition-colors group cursor-crosshair px-4 relative overflow-hidden">
                    <div class="absolute inset-0 bg-brand-green/5 -translate-x-full group-hover:translate-x-0 transition-transform duration-500 will-change-transform z-0"></div>
                    <div class="flex items-center gap-4 relative z-10 w-full">
                        <span class="${colorClass} font-black opacity-90 group-hover:opacity-100 min-w-8 drop-shadow-md">${rank}</span>
                        <span class="text-white/70 group-hover:text-white transition-colors text-sm">${icon}</span>
                        <span class="${colorClass} tracking-widest group-hover:tracking-[0.25em] transition-all duration-300 font-bold drop-shadow-sm grow">
                            ${name}
                        </span>
                    </div>
                    <div class="${scoreClass} tracking-wider filter drop-shadow-[0_0_4px_currentColor] relative z-10 font-mono">${score}</div>
                </div>
                `;
            }).join('') + '</div>';

            if (scores.length === 0) {
                leaderboardList.innerHTML = `
                    <div class="text-center py-8 animate-pulse text-brand-green font-mono uppercase tracking-widest">
                        INSERT COIN TO START<br>
                        <span class="text-xs opacity-50">No Scores Yet</span>
                    </div>`;
            }
        } catch (e) {
            console.error('Failed to load leaderboard:', e);
            leaderboardList.innerHTML = '<p class="text-center text-red-500 text-sm py-4">Error loading scores.</p>';
        }
    }

    console.log('DevQuest Bootcamp - System Initialized');
});
