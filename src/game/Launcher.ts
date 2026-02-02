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

        // Set canvas to classic arcade aspect ratio (centered)
        const targetWidth = 800;
        const targetHeight = 600;

        this.canvas.width = targetWidth;
        this.canvas.height = targetHeight;

        // Center canvas with CSS
        this.canvas.style.margin = 'auto';
        this.canvas.style.display = 'block';
        this.canvas.style.maxWidth = '100%';
        this.canvas.style.maxHeight = '100%';
        this.canvas.style.objectFit = 'contain';

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
            // Clear previous
            livesEl.textContent = '';

            // Create ship icons (safe DOM creation)
            for (let i = 0; i < Math.max(0, lives); i++) {
                const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
                svg.setAttribute('width', '28');
                svg.setAttribute('height', '28');
                svg.setAttribute('viewBox', '0 0 32 32');
                svg.setAttribute('class', 'drop-shadow-[0_0_6px_rgba(74,222,128,0.8)]');

                // Cockpit
                const cockpit = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
                cockpit.setAttribute('x', '14');
                cockpit.setAttribute('y', '8');
                cockpit.setAttribute('width', '4');
                cockpit.setAttribute('height', '4');
                cockpit.setAttribute('fill', '#4ade80');

                // Main Wings
                const wings = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
                wings.setAttribute('x', '8');
                wings.setAttribute('y', '16');
                wings.setAttribute('width', '16');
                wings.setAttribute('height', '8');
                wings.setAttribute('fill', '#4ade80');

                // Wide Base
                const base = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
                base.setAttribute('x', '4');
                base.setAttribute('y', '20');
                base.setAttribute('width', '24');
                base.setAttribute('height', '4');
                base.setAttribute('fill', '#4ade80');

                // Engine Left
                const engineL = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
                engineL.setAttribute('x', '6');
                engineL.setAttribute('y', '24');
                engineL.setAttribute('width', '6');
                engineL.setAttribute('height', '2');
                engineL.setAttribute('fill', '#22c55e');

                // Engine Right
                const engineR = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
                engineR.setAttribute('x', '20');
                engineR.setAttribute('y', '24');
                engineR.setAttribute('width', '6');
                engineR.setAttribute('height', '2');
                engineR.setAttribute('fill', '#22c55e');

                // Front Tip
                const tip = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
                tip.setAttribute('x', '15');
                tip.setAttribute('y', '4');
                tip.setAttribute('width', '2');
                tip.setAttribute('height', '4');
                tip.setAttribute('fill', '#86efac');

                svg.appendChild(cockpit);
                svg.appendChild(wings);
                svg.appendChild(base);
                svg.appendChild(engineL);
                svg.appendChild(engineR);
                svg.appendChild(tip);

                livesEl.appendChild(svg);
            }
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
