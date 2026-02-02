import { Entity } from '../Entity';

export class MovementSystem {
    static update(entity: Entity, dt: number, bounds?: { x: number, y: number, width: number, height: number } | number, heightBound?: number) {
        if (!entity.active) return;

        // Handle varying arguments (overload support not strictly needed but good for safety if called differently)
        // Actually, let's look at how Game.ts calls it: MovementSystem.update(this.player, dt, this.canvas.width, this.canvas.height);
        // Wait, Game.ts calls it with (entity, dt, width, height)??
        // MovementSystem signature was (entity, dt, bounds object).
        // I need to align Game.ts or MovementSystem.

        // Let's stick to the simpler signature used in Game.ts if possible, or update Game.ts.
        // Game.ts calls: MovementSystem.update(p, dt, this.canvas.width, this.canvas.height) which is 4 args.
        // My previous MovementSystem implementation had 3 args (bounds object).

        // Let's update MovementSystem to accept (entity, dt, width, height) to match Game.ts, which is easier than changing all calls in Game.ts?
        // Actually Game.ts is easier to fix if I want clean code (passing bounds object).
        // BUT, I'll update MovementSystem to match Game.ts usage for now to fix the crash faster for the user.
        // Wait, the error reported was about velocity property. I should fix that first.

        entity.x += entity.velocity.x * dt;
        entity.y += entity.velocity.y * dt;

        // If bounds are passed as numbers (legacy/game.ts style)
        if (typeof bounds === 'number' && typeof heightBound === 'number') {
            const w = bounds;
            const h = heightBound;
            if (entity.x < 0) entity.x = 0;
            if (entity.y < 0) entity.y = 0;
            if (entity.x + entity.width > w) entity.x = w - entity.width;
            if (entity.y + entity.height > h) entity.y = h - entity.height;
        }
        // If bounds is object (test style)
        else if (bounds && typeof bounds === 'object') {
            if (entity.x < bounds.x) entity.x = bounds.x;
            if (entity.y < bounds.y) entity.y = bounds.y;
            if (entity.x + entity.width > bounds.x + bounds.width) entity.x = bounds.x + bounds.width - entity.width;
            if (entity.y + entity.height > bounds.y + bounds.height) entity.y = bounds.y + bounds.height - entity.height;
        }
    }
}
