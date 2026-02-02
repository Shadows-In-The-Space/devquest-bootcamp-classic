import { Game } from './Game';
import { ScoreManager } from './ScoreManager';
import { PlayState } from './states/PlayState';

export class GameLauncher {
    private game: Game | null = null;
    private email: string = '';

    // UI Elements
    private modal: HTMLElement;
    private emailScreen: HTMLElement;
    private gameScreen: HTMLElement;
    private leaderboardScreen: HTMLElement;
    private victoryScreen: HTMLElement;
    private emailInput: HTMLInputElement;
    private canvas: HTMLCanvasElement;
    private leaderboardList: HTMLElement;

    constructor() {
        this.createModalConfig();
        this.bindEvents();
    }

    private createModalConfig() {
        // We assume elements exist in DOM (we will add them to index.html)
        this.modal = document.getElementById('game-modal')!;
        this.emailScreen = document.getElementById('game-screen-email')!;
        this.gameScreen = document.getElementById('game-screen-play')!;
        this.leaderboardScreen = document.getElementById('game-screen-leaderboard')!;
        this.victoryScreen = document.getElementById('game-screen-victory')!;
        this.emailInput = document.getElementById('game-email-input') as HTMLInputElement;
        this.canvas = document.getElementById('game-canvas') as HTMLCanvasElement;
        this.leaderboardList = document.getElementById('leaderboard-list')!;
    }

    private bindEvents() {
        // Open Modal Triggers
        document.querySelectorAll('.trigger-game-modal').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                this.openModal();
            });
        });

        // Email Submit
        document.getElementById('game-start-btn')?.addEventListener('click', () => {
            const email = this.emailInput.value.trim();
            if (email && email.includes('@')) {
                this.email = email;
                this.startGame();
            } else {
                alert('Please enter a valid email to play!');
            }
        });

        // Close Modal
        document.getElementById('game-modal-close')?.addEventListener('click', () => {
            this.closeModal();
        });

        // Play Again
        document.getElementById('game-restart-btn')?.addEventListener('click', () => {
            this.startGame();
        });
    }

    openModal() {
        this.modal.classList.remove('hidden');
        this.showScreen('email');
    }

    closeModal() {
        this.modal.classList.add('hidden');
        if (this.game) {
            this.game.stop();
            this.game = null;
        }
    }

    showScreen(screenName: 'email' | 'play' | 'leaderboard' | 'victory') {
        this.emailScreen.classList.add('hidden');
        this.gameScreen.classList.add('hidden');
        this.leaderboardScreen.classList.add('hidden');
        this.victoryScreen.classList.add('hidden');

        if (screenName === 'email') this.emailScreen.classList.remove('hidden');
        if (screenName === 'play') this.gameScreen.classList.remove('hidden');
        if (screenName === 'leaderboard') this.leaderboardScreen.classList.remove('hidden');
        if (screenName === 'victory') this.victoryScreen.classList.remove('hidden');
    }

    startGame() {
        this.showScreen('play');

        // Resize canvas to fit container
        const container = this.canvas.parentElement!;
        this.canvas.width = container.clientWidth;
        this.canvas.height = container.clientHeight;

        // Reset HUD
        this.updateScore(0);
        this.updateLives(3);

        this.game = new Game(
            this.canvas,
            this.email,
            () => this.onGameOver(),
            (score) => this.updateScore(score),
            (lives) => this.updateLives(lives),
            () => this.onGameWin()
        );
        this.game.start();
        this.game.switchState(new PlayState());
    }

    updateScore(score: number) {
        const scoreEl = document.getElementById('hud-score');
        if (scoreEl) {
            scoreEl.innerText = score.toString().padStart(6, '0');
        }
    }

    updateLives(lives: number) {
        const livesEl = document.getElementById('hud-lives');
        if (livesEl) {
            // Pixel Ship SVG (Green)
            const shipSvg = `
            <svg width="24" height="24" viewBox="0 0 16 16" fill="#4ade80" class="drop-shadow-[0_0_4px_rgba(74,222,128,0.6)]">
                <path d="M6 2h4v2H6z M4 4h8v2H4z M2 6h12v6H2z M0 12h16v2H0z"/>
            </svg>`;
            livesEl.innerHTML = shipSvg.repeat(Math.max(0, lives));
        }
    }

    async onGameOver() {
        this.showScreen('leaderboard');
        await this.loadLeaderboard();
    }

    onGameWin() {
        this.showScreen('victory');
        const trophy = `
  ___________
 '._==_==_=_.'
 .-\\:      /-.
| (|:.     |) |
 '-|:.     |-'
   \\::.    /
    '::. .'
      ) (
    _.' '._
   \`"""""""\`
`;
        const asciiContainer = document.getElementById('victory-ascii');
        if (asciiContainer) asciiContainer.textContent = trophy;

        // Re-bind Victory Button
        const vicBtn = document.getElementById('game-victory-btn');
        vicBtn?.replaceWith(vicBtn.cloneNode(true)); // remove old listeners
        document.getElementById('game-victory-btn')?.addEventListener('click', () => {
            this.startGame();
        });
    }

    async loadLeaderboard() {
        this.leaderboardList.innerHTML = '<p class="text-center animate-pulse">Loading scores...</p>';
        const scores = await ScoreManager.getLeaderboard(10);

        this.leaderboardList.innerHTML = scores.map((s, i) => `
            <div class="flex justify-between items-center py-2 border-b border-gray-700 font-mono text-sm">
                <span class="w-8 text-gray-500">#${i + 1}</span>
                <span class="flex-1 truncate pr-4 text-gray-300">${s.email.split('@')[0]}...</span>
                <span class="font-bold text-brand-primary">${s.score}</span>
            </div>
        `).join('');
    }
}
