import { GameState } from './GameState';
import { Game } from '../Game';
import { PlayState } from './PlayState';

export class InsertCoinState implements GameState {
    // Basic state to confirm player wants to start
    // In arcade, this waits for coin + start button.
    // Here we can just wait for Space again or show "CREDITS 1"

    enter(game: Game): void {
        console.log("InsertCoin State");
        // Play coin sound
    }

    exit(game: Game): void {
    }

    update(game: Game, dt: number): void {
        if (game.input.isPressed('Space')) {
            game.switchState(new PlayState());
        }
    }

    render(game: Game): void {
        // Blink "PUSH START"
        // Again, no text rendering yet, so we use sprites or rely on imagination/DOM
        const cx = game.canvas.width / 2;
        const cy = game.canvas.height / 2;
        game.renderer.drawSprite(game.assets.shipTex, cx, cy, 32, 32);
    }

    onKeyDown(game: Game, code: string): void {
    }
}
