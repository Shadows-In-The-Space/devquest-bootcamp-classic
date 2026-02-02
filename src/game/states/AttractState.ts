import { Game } from '../Game';
import { InsertCoinState } from './InsertCoinState';
import { PlayState } from './PlayState';
import { GameState } from './GameState';

export class AttractState implements GameState {
    private timer: number = 0;
    private flash: boolean = false;

    enter(game: Game): void {
        console.log("Entering AttractMode");
    }

    exit(game: Game): void {
    }

    update(game: Game, dt: number): void {
        this.timer += dt;
        if (this.timer > 0.5) {
            this.timer = 0;
            this.flash = !this.flash;
        }

        // Check for "Insert Coin" or Start
        if (game.input.isPressed('Space') || game.input.isPressed('Enter')) {
            // Coin Sound?
            // game.audio.playCoin(); 
            // Skip InsertCoinState for now due to lack of text rendering
            game.switchState(new PlayState());
        }
    }

    render(game: Game): void {
        const cx = game.canvas.width / 2;
        const cy = game.canvas.height / 2;

        // Render Title (Placeholder text for now, should be sprite)
        // Since we don't have font rendering in SpriteRenderer easily yet, 
        // we might resort to just drawing sprites in a pattern or 
        // using the HTML overlay? 
        // But Arcade Veteran says "everything in canvas".
        // Let's assume we render some invaders dancing.

        game.renderer.drawSprite(game.assets.invaderTex, cx - 50, cy - 50, 48, 48);
        game.renderer.drawSprite(game.assets.shipTex, cx + 50, cy - 50, 48, 48);

        // We can't draw text with SpriteRenderer unless we have a font atlas.
        // For now, relies on DOM overlay or update SpriteRenderer?
        // Game.ts/Launcher has overlays.
        // But AttractMode should be VISUAL.
        // Let's stick to moving sprites.
    }

    onKeyDown(game: Game, code: string): void {
    }
}
