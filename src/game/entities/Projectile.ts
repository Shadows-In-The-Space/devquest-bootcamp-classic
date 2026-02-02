import { Entity } from '../Entity';

export class Projectile extends Entity {
    constructor(x: number, y: number, public isPlayer: boolean) {
        super(x, y, 4, 10);
        this.velocity.y = isPlayer ? -500 : 200;
        this.color = isPlayer ? [0, 1, 0, 1] : [1, 0, 0, 1]; // Green for player, Red for enemy
    }
}
