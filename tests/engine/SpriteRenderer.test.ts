import { describe, it, expect, vi, beforeEach } from 'vitest';
import { SpriteRenderer } from '../../src/engine/SpriteRenderer';
import { WebGLContext } from '../../src/engine/WebGLContext';
import { Texture } from '../../src/engine/Texture';

describe('SpriteRenderer', () => {
    let mockContext: WebGLContext;
    let mockGL: any;

    beforeEach(() => {
        mockGL = {
            createVertexArray: vi.fn(() => ({})),
            bindVertexArray: vi.fn(),
            createBuffer: vi.fn(() => ({})),
            bindBuffer: vi.fn(),
            bufferData: vi.fn(),
            bufferSubData: vi.fn(),
            vertexAttribPointer: vi.fn(),
            enableVertexAttribArray: vi.fn(),
            drawArrays: vi.fn(),
            createProgram: vi.fn(() => ({})),
            createShader: vi.fn(() => ({})),
            shaderSource: vi.fn(),
            compileShader: vi.fn(),
            attachShader: vi.fn(),
            linkProgram: vi.fn(),
            getProgramParameter: vi.fn(() => true),
            getShaderParameter: vi.fn(() => true),
            useProgram: vi.fn(),
            getUniformLocation: vi.fn(() => 1),
            deleteShader: vi.fn(),
            uniform2f: vi.fn(),
            uniform4f: vi.fn(),
            activeTexture: vi.fn(),
            bindTexture: vi.fn(),
            // Constants
            ARRAY_BUFFER: 0x8892,
            STATIC_DRAW: 0x88E4,
            DYNAMIC_DRAW: 0x88E8,
            TRIANGLES: 0x0004,
            FLOAT: 0x1406,
            TEXTURE0: 0x84C0,
            TEXTURE_2D: 0x0DE1,
            VERTEX_SHADER: 0x8B31,
            FRAGMENT_SHADER: 0x8B30
        };

        mockContext = {
            gl: mockGL,
            canvas: { width: 800, height: 600 }
        } as unknown as WebGLContext;
    });

    it('should initialize and create buffers', () => {
        const renderer = new SpriteRenderer(mockContext);
        expect(mockGL.createVertexArray).toHaveBeenCalled();
        expect(mockGL.createBuffer).toHaveBeenCalled();
        // Should use dynamic draw
        expect(mockGL.bufferData).toHaveBeenCalledWith(
            mockGL.ARRAY_BUFFER,
            expect.any(Number),
            mockGL.DYNAMIC_DRAW
        );
    });

    it('should buffer data and draw when flushed', () => {
        const renderer = new SpriteRenderer(mockContext);
        const mockTexture = { bind: vi.fn() } as unknown as Texture;

        renderer.begin();
        renderer.drawSprite(mockTexture, 0, 0, 10, 10);
        renderer.end(); // Calls flush

        expect(mockTexture.bind).toHaveBeenCalled();
        expect(mockGL.bufferSubData).toHaveBeenCalled();
        expect(mockGL.drawArrays).toHaveBeenCalledWith(mockGL.TRIANGLES, 0, 6);
    });
});
