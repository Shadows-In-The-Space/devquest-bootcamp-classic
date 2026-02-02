import { Entity } from '../Entity';

export class Invader extends Entity {
    rank: number;

    constructor(x: number, y: number, rank: number) {
        super(x, y, 24, 24);
        this.rank = rank;
        this.type = 'invader'; // Set Entity type
        this.color = [0.8, 0.8, 0.8, 1];
        // Different colors per rank
        if (rank === 1) this.color = [1, 0, 1, 1]; // Magenta
        if (rank === 2) this.color = [0, 1, 1, 1]; // Cyan
    }
}
