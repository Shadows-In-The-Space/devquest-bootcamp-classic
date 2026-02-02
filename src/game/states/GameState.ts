import { Game } from '../Game';

export interface GameState {
    enter(game: Game): void;
    exit(game: Game): void;
    update(game: Game, dt: number): void;
    render(game: Game): void;
    onKeyDown(game: Game, code: string): void;
}
