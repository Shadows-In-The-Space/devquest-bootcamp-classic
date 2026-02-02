import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { Game } from '../../src/game/Game';
import { Invader } from '../../src/game/entities/Invader';

// Mock dependencies
vi.mock('../../src/engine/WebGLContext');
vi.mock('../../src/engine/SpriteRenderer');
vi.mock('../../src/engine/PostProcessor');
vi.mock('../../src/engine/Texture');

describe('Game Over Logic', () => {
    let game: Game;
    let canvas: HTMLCanvasElement;
    let onGameOver: any;
    let onScoreUpdate: any;
    let onLivesUpdate: any;

    beforeEach(() => {
        canvas = { width: 800, height: 600 } as HTMLCanvasElement;
        onGameOver = vi.fn();
        onScoreUpdate = vi.fn();
        onLivesUpdate = vi.fn();
        game = new Game(canvas, 'test@test.com', onGameOver, onScoreUpdate, onLivesUpdate);

        // Expose invaders for testing (casting to any to access private property)
        (game as any).invaders = [];
        // Force lives to 1 for game over tests if needed, or default 3
        game.start();
    });

    afterEach(() => {
        game.stop();
        vi.clearAllMocks();
    });

    it('should trigger Game Over when an invader reaches the bottom', () => {
        const invader = new Invader(100, 601, 1);
        (game as any).invaders.push(invader);

        (game as any).update(0.016);

        expect(onGameOver).toHaveBeenCalled();
        expect((game as any).running).toBe(false);
    });

    it('should decrement lives on collision and NOT trigger Game Over if lives > 0', () => {
        const player = (game as any).player;
        player.x = 400;
        player.y = 500;
        player.width = 30;
        player.height = 30;

        const invader = new Invader(400, 500, 1);
        invader.width = 30;
        invader.height = 30;
        (game as any).invaders.push(invader);

        (game as any).update(0.016);

        expect(onLivesUpdate).toHaveBeenCalledWith(2); // Started at 3
        expect(onGameOver).not.toHaveBeenCalled();
    });

    it('should trigger Game Over when lives reach 0', () => {
        (game as any).lives = 1; // Force 1 life

        const player = (game as any).player;
        player.x = 400;
        player.y = 500;
        player.width = 30;
        player.height = 30;

        const invader = new Invader(400, 500, 1);
        invader.width = 30;
        invader.height = 30;
        (game as any).invaders.push(invader);

        (game as any).update(0.016);

        expect(onLivesUpdate).toHaveBeenCalledWith(0);
        expect(onGameOver).toHaveBeenCalled();
    });
});
