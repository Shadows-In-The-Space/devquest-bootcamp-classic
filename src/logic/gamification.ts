export interface Rank {
    threshold: number;
    name: string;
    id: number;
}

export const Ranks: Rank[] = [
    { threshold: 0, name: "Novice", id: 1 },
    { threshold: 15, name: "Initiate", id: 2 },
    { threshold: 30, name: "Apprentice", id: 3 },
    { threshold: 50, name: "Shader Coder", id: 4 },
    { threshold: 75, name: "GPU Master", id: 5 },
    { threshold: 90, name: "Legend", id: 6 }
];

export class GamificationSystem {
    private currentRankIndex: number = 0;

    // UI Elements
    private xpBarFill: HTMLElement | null = null;
    private playerLevelEl: HTMLElement | null = null;
    private playerRankEl: HTMLElement | null = null;
    private toastEl: HTMLElement | null = null;
    private toastText: HTMLElement | null = null;

    constructor() {
        // We will decouple DOM binding to allow for testing updateUI manually
        // But for browser init, we can try to bind
        if (typeof document !== 'undefined') {
            this.bindElements();
            this.init();
        }
    }

    public bindElements(): void {
        this.xpBarFill = document.getElementById('xp-bar-fill');
        this.playerLevelEl = document.getElementById('player-level');
        this.playerRankEl = document.getElementById('player-rank');
        this.toastEl = document.getElementById('achievement-toast');
        this.toastText = document.getElementById('achievement-text');
    }

    public init(): void {
        window.addEventListener('scroll', () => this.handleScroll(), { passive: true });
        window.addEventListener('resize', () => this.handleScroll());
        this.handleScroll(); // Initial check
    }

    private handleScroll(): void {
        window.requestAnimationFrame(() => {
            const scrollTop = window.scrollY || document.documentElement.scrollTop;
            const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;

            let percent = 0;
            if (docHeight > 0) {
                percent = (scrollTop / docHeight) * 100;
            }
            percent = Math.max(0, Math.min(100, percent));

            this.updateUI(percent);
        });
    }

    public calculateLevel(percent: number): number {
        return Math.floor(percent) + 1;
    }

    public getRankName(percent: number): string {
        let rankName = Ranks[0].name;
        for (let i = Ranks.length - 1; i >= 0; i--) {
            if (percent >= Ranks[i].threshold) {
                rankName = Ranks[i].name;
                break;
            }
        }
        return rankName;
    }

    public updateUI(percent: number): void {
        // Update XP Bar
        if (this.xpBarFill) {
            this.xpBarFill.style.width = percent + '%';
        }

        // Update Level Number
        if (this.playerLevelEl) {
            const level = this.calculateLevel(percent);
            this.playerLevelEl.textContent = level < 10 ? '0' + level : level.toString();
        }

        // Rank Logic
        let newRankIndex = this.currentRankIndex;
        for (let i = Ranks.length - 1; i >= 0; i--) {
            if (percent >= Ranks[i].threshold) {
                newRankIndex = i;
                break;
            }
        }

        if (newRankIndex > this.currentRankIndex) {
            this.currentRankIndex = newRankIndex;
            const rankData = Ranks[this.currentRankIndex];

            // Update Rank Text
            if (this.playerRankEl) {
                this.playerRankEl.textContent = rankData.name;
                this.playerRankEl.classList.add('animate-level-up');
                setTimeout(() => this.playerRankEl?.classList.remove('animate-level-up'), 500);
            }

            // Trigger Toast
            if (this.toastEl && this.toastText) {
                this.toastText.textContent = `New Rank: ${rankData.name}`;

                this.toastEl.classList.remove('translate-y-20', 'opacity-0');

                setTimeout(() => {
                    this.toastEl?.classList.add('translate-y-20', 'opacity-0');
                }, 4000);
            }
        }
    }
}
