import { Entity } from '../Entity';

export class Player extends Entity {
    cooldown: number = 0;

    constructor(x: number, y: number) {
        super(x, y, 32, 32);
        this.color = [0, 1, 0, 1]; // Green
    }

    // Additional logic for shooting could go here or in a system
}
