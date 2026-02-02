import { describe, it, expect, vi, beforeEach } from 'vitest';
import { WebGLContext } from '../../src/engine/WebGLContext';

describe('WebGLContext', () => {
    let canvas: HTMLCanvasElement;
    let mockGL: any;

    beforeEach(() => {
        canvas = document.createElement('canvas');
        mockGL = {
            getExtension: vi.fn(),
            viewport: vi.fn(),
            clearColor: vi.fn(),
            clear: vi.fn(),
            // meaningful properties for checks
            canvas: canvas
        };

        // Mock getContext to return our mockGL
        canvas.getContext = vi.fn().mockReturnValue(mockGL);
    });

    it('should initialize WebGL2 context', () => {
        const context = new WebGLContext(canvas);
        expect(context.gl).toBe(mockGL);
        expect(canvas.getContext).toHaveBeenCalledWith('webgl2');
    });

    it('should throw error if WebGL2 is not supported', () => {
        canvas.getContext = vi.fn().mockReturnValue(null);
        expect(() => new WebGLContext(canvas)).toThrow('WebGL2 not supported');
    });

    it('should set viewport on resize', () => {
        const context = new WebGLContext(canvas);
        context.resize(800, 600);

        expect(canvas.width).toBe(800);
        expect(canvas.height).toBe(600);
        expect(mockGL.viewport).toHaveBeenCalledWith(0, 0, 800, 600);
    });
});
