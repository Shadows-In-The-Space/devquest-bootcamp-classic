import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Texture } from '../../src/engine/Texture';
import { WebGLContext } from '../../src/engine/WebGLContext';

describe('Texture', () => {
    let mockContext: WebGLContext;
    let mockGL: any;

    beforeEach(() => {
        mockGL = {
            createTexture: vi.fn(() => ({})),
            bindTexture: vi.fn(),
            texImage2D: vi.fn(),
            generateMipmap: vi.fn(),
            texParameteri: vi.fn(),
            activeTexture: vi.fn(),
            TEXTURE_2D: 3553,
            TEXTURE0: 33984,
            RGBA: 6408,
            UNSIGNED_BYTE: 5121,
            NEAREST: 9728,
            NEAREST_MIPMAP_NEAREST: 9985
        };

        mockContext = {
            gl: mockGL
        } as unknown as WebGLContext;
    });

    it('should create a texture and set a placeholder', () => {
        const texture = new Texture(mockContext);
        expect(mockGL.createTexture).toHaveBeenCalled();
        expect(mockGL.bindTexture).toHaveBeenCalled();
        expect(mockGL.texImage2D).toHaveBeenCalled(); // Should be called for 1x1 placeholder
    });

    it('should bind texture to a unit', () => {
        const texture = new Texture(mockContext);
        texture.bind(1);
        expect(mockGL.activeTexture).toHaveBeenCalledWith(mockGL.TEXTURE0 + 1);
        expect(mockGL.bindTexture).toHaveBeenCalledWith(mockGL.TEXTURE_2D, texture.texture);
    });
});
