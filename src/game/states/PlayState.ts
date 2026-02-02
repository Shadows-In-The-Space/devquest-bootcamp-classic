import { GameState } from './GameState';
import { Game } from '../Game';
import { Player } from '../entities/Player';
import { Invader } from '../entities/Invader';
import { Projectile } from '../entities/Projectile';
import { MovementSystem } from '../systems/MovementSystem';
import { Texture } from '../../engine/Texture';

export class PlayState implements GameState {
    private currentLevel: number = 1;
    private readonly MAX_LEVELS: number = 3;

    private player: Player;
    private invaders: Invader[] = [];
    private projectiles: Projectile[] = [];
    private invaderDirection: number = 1;

    constructor() { }

    enter(game: Game): void {
        console.log("Entering PlayState");
        // Setup Game
        this.player = new Player(game.canvas.width / 2, game.canvas.height - 100);
        this.currentLevel = 1;
        this.startLevel(game, this.currentLevel);

        game.audio.setTempo(1000); // Reset tempo
        game.lives = 3;
        game.score = 0;
        game.onScoreUpdateCallback(game.score);
        game.onLivesUpdateCallback(game.lives);
    }

    startLevel(game: Game, level: number) {
        this.invaders = [];
        this.projectiles = [];
        this.player.x = game.canvas.width / 2; // Reset player position for fairness

        // Ensure invaders don't start too low
        const startY = 80;
        const padding = 15;

        // Level Design Patterns
        if (level === 1) {
            // Standard Block (3x6)
            this.createInvaderGrid(3, 6, 50, startY, padding, 0);
        } else if (level === 2) {
            // "V" Shape / Split Formation - Faster
            // Creating two small groups
            this.createInvaderGrid(3, 3, 40, startY, padding, 0); // Left
            this.createInvaderGrid(3, 3, game.canvas.width - 200, startY, padding, 0); // Right
        } else if (level === 3) {
            // "The Wall" - Dense & Fast (4x8)
            this.createInvaderGrid(4, 8, 30, startY, 10, 0);
        }

        // Reset functionality
        this.invaderDirection = 1;

        // Notify user (simulated toast via console/log for now as we don't have UI toast in Game logic yet)
        console.log(`Starting Level ${level}`);
    }

    createInvaderGrid(rows: number, cols: number, startX: number, startY: number, padding: number, typeOffset: number) {
        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
                const invader = new Invader(
                    startX + c * (24 + padding),
                    startY + r * (24 + padding),
                    ((r + typeOffset) % 2) + 1
                );
                this.invaders.push(invader);
            }
        }
    }

    exit(game: Game): void {
        this.projectiles = [];
        this.invaders = [];
    }

    // Removed old setupInvaders in favor of startLevel + createInvaderGrid

    update(game: Game, dt: number): void {
        // Player Input (Unchanged)
        this.player.velocity.x = 0;
        if (game.input.isDown('ArrowLeft')) this.player.velocity.x = -300;
        if (game.input.isDown('ArrowRight')) this.player.velocity.x = 300;

        if (game.input.isPressed('Space') && this.player.cooldown <= 0) {
            this.projectiles.push(new Projectile(this.player.x + 12, this.player.y, true));
            this.player.cooldown = 0.5;
            game.audio.playShoot();
        }
        if (this.player.cooldown > 0) this.player.cooldown -= dt;

        // Movement Logic
        MovementSystem.update(this.player, dt, game.canvas.width, game.canvas.height);
        this.projectiles.forEach(p => MovementSystem.update(p, dt, game.canvas.width, game.canvas.height));

        // Invader Logic
        this.updateInvaders(game, dt);

        // Collisions
        this.checkCollisions(game);

        // Level Progression Condition
        if (this.invaders.length === 0) {
            if (this.currentLevel < this.MAX_LEVELS) {
                this.currentLevel++;
                this.startLevel(game, this.currentLevel);
                // Bonus for clearing level?
                game.addScore(500 * this.currentLevel);
            } else {
                game.onGameWin();
            }
        }
    }

    updateInvaders(game: Game, dt: number) {
        let hitEdge = false;

        // Speed Calculation: Base + Score Factor + Level Factor
        // Level 1: Base 30
        // Level 2: Base 50
        // Level 3: Base 70
        const baseSpeed = 30 + (this.currentLevel - 1) * 20;
        const scoreFactor = game.score * 0.05; // Slightly reduced score scaling to prevent uncontrollability
        const speed = baseSpeed + scoreFactor;

        const direction = this.invaderDirection;

        for (const inv of this.invaders) {
            if (inv.active) {
                if (direction === 1 && inv.x + inv.width >= game.canvas.width - 10) {
                    hitEdge = true;
                    break;
                } else if (direction === -1 && inv.x <= 10) {
                    hitEdge = true;
                    break;
                }
            }
        }

        if (hitEdge) {
            this.invaderDirection *= -1;
            for (const inv of this.invaders) {
                inv.y += 10;
            }
        } else {
            for (const inv of this.invaders) {
                inv.velocity.x = speed * direction;
                inv.velocity.y = 0;
                MovementSystem.update(inv, dt, game.canvas.width, game.canvas.height);

                if (inv.y + inv.height >= game.canvas.height) {
                    this.triggerGameOver(game);
                    return;
                }

                if (this.checkCollisionRect(inv, this.player)) {
                    this.handlePlayerHit(game);
                    return;
                }
            }
        }

        // Tempo Update
        const totalStart = 18; // 3 * 6
        if (this.invaders.length > 0) {
            const ratio = this.invaders.length / totalStart;
            const newTempo = 200 + (800 * ratio);
            game.audio.setTempo(newTempo);
        }
    }

    checkCollisions(game: Game) {
        for (let i = this.projectiles.length - 1; i >= 0; i--) {
            const p = this.projectiles[i];
            if (!p.active) continue;

            if (p.y < 0 || p.y > game.canvas.height) {
                p.active = false;
                continue;
            }

            if (p.isPlayer) {
                for (let j = this.invaders.length - 1; j >= 0; j--) {
                    const inv = this.invaders[j];
                    if (!inv.active) continue;

                    if (this.checkCollisionRect(p, inv)) {
                        inv.active = false;
                        p.active = false;
                        game.addScore(100);
                        game.audio.playExplosion();
                        game.arcadeSystems.triggerShake(5, 0.2); // Screen Shake!

                        // Particle Effect could go here
                    }
                }
            }
        }

        this.projectiles = this.projectiles.filter(p => p.active);
        this.invaders = this.invaders.filter(i => i.active);
    }

    handlePlayerHit(game: Game) {
        game.lives--;
        game.onLivesUpdate(game.lives);
        game.audio.playExplosion();
        game.arcadeSystems.triggerShake(10, 0.5);

        if (game.lives <= 0) {
            this.triggerGameOver(game);
        } else {
            this.projectiles = [];
            // Maybe temporary invulnerability
        }
    }

    triggerGameOver(game: Game) {
        game.onGameOver(); // This will eventually likely switch state to GameOverState
    }

    render(game: Game): void {
        const shake = game.arcadeSystems.getShakeOffset();
        const ox = shake.x;
        const oy = shake.y;

        game.renderer.drawSprite(game.assets.shipTex, this.player.x + ox, this.player.y + oy, this.player.width, this.player.height);

        for (const inv of this.invaders) {
            game.renderer.drawSprite(game.assets.invaderTex, inv.x + ox, inv.y + oy, inv.width, inv.height);
        }

        for (const p of this.projectiles) {
            game.renderer.drawSprite(game.assets.shipTex, p.x + ox, p.y + oy, p.width, p.height);
        }
    }

    onKeyDown(game: Game, code: string): void {
        // Handled in update via input handler mostly
    }

    private checkCollisionRect(a: any, b: any): boolean {
        return a.x < b.x + b.width &&
            a.x + a.width > b.x &&
            a.y < b.y + b.height &&
            a.y + a.height > b.y;
    }
}
