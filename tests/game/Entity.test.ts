import { describe, it, expect } from 'vitest';
import { Entity } from '../../src/game/Entity';

describe('Entity', () => {
    it('should initialize with default values', () => {
        const entity = new Entity();
        expect(entity.active).toBe(true);
        expect(entity.x).toBe(0);
        expect(entity.y).toBe(0);
        expect(entity.width).toBe(0);
        expect(entity.height).toBe(0);
    });

    it('should set position', () => {
        const entity = new Entity(100, 200);
        expect(entity.x).toBe(100);
        expect(entity.y).toBe(200);
        expect(entity.velocity).toEqual({ x: 0, y: 0 });
    });
});
