export class Entity {
    x: number;
    y: number;
    width: number;
    height: number;
    active: boolean;
    velocity: { x: number, y: number };
    color: number[] = [1, 1, 1, 1];
    type: string = 'generic';

    constructor(x: number = 0, y: number = 0, width: number = 0, height: number = 0) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.active = true;
        this.velocity = { x: 0, y: 0 };
    }
}
