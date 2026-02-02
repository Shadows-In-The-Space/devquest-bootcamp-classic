import { describe, it, expect } from 'vitest';
import { MovementSystem } from '../../src/game/systems/MovementSystem';
import { Entity } from '../../src/game/Entity';

describe('MovementSystem', () => {
    it('should update entity position based on velocity', () => {
        const entity = new Entity(0, 0);
        entity.velocity.x = 10;
        entity.velocity.y = 5;

        // Simulate 1 second (dt = 1)
        MovementSystem.update(entity, 1.0);

        expect(entity.x).toBe(10);
        expect(entity.y).toBe(5);
    });

    it('should scale by delta time', () => {
        const entity = new Entity(0, 0);
        entity.velocity.x = 100;

        // Simulate 0.5 second
        MovementSystem.update(entity, 0.5);

        expect(entity.x).toBe(50);
    });

    it('should constrain to bounds if provided', () => {
        const entity = new Entity(10, 10);
        entity.velocity.x = -20; // moving left
        const bounds = { x: 0, y: 0, width: 100, height: 100 };

        MovementSystem.update(entity, 1.0, bounds);

        expect(entity.x).toBe(0); // Clamped to 0
    });
});
