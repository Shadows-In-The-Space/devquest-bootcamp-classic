import { describe, it, expect, vi, beforeEach } from 'vitest';
import { SpriteRenderer } from '../../src/engine/SpriteRenderer';
import { WebGLContext } from '../../src/engine/WebGLContext';
import { Texture } from '../../src/engine/Texture';

// Mocks
const mockGL = {
    createVertexArray: vi.fn(() => ({})),
    bindVertexArray: vi.fn(),
    createBuffer: vi.fn(() => ({})),
    bindBuffer: vi.fn(),
    bufferData: vi.fn(),
    bufferSubData: vi.fn(),
    enableVertexAttribArray: vi.fn(),
    vertexAttribPointer: vi.fn(),
    createProgram: vi.fn(() => ({})),
    createShader: vi.fn(() => ({})),
    shaderSource: vi.fn(),
    compileShader: vi.fn(),
    attachShader: vi.fn(),
    linkProgram: vi.fn(),
    useProgram: vi.fn(),
    getUniformLocation: vi.fn(() => 1),
    getAttribLocation: vi.fn(() => 0),
    uniform2f: vi.fn(),
    uniform4f: vi.fn(),
    drawArrays: vi.fn(),
    deleteShader: vi.fn(),
    getShaderParameter: vi.fn(() => true),
    getProgramParameter: vi.fn(() => true),
    VERTEX_SHADER: 0x8B31,
    FRAGMENT_SHADER: 0x8B30,
    ARRAY_BUFFER: 0x8892,
    DYNAMIC_DRAW: 0x88E8,
    FLOAT: 0x1406,
    TRIANGLES: 0x0004
} as unknown as WebGL2RenderingContext;

describe('SpriteRenderer Batching', () => {
    let renderer: SpriteRenderer;
    let mockContext: WebGLContext;

    beforeEach(() => {
        mockContext = {
            gl: mockGL,
            canvas: { width: 800, height: 600 } as HTMLCanvasElement
        } as WebGLContext;
        renderer = new SpriteRenderer(mockContext);
        vi.clearAllMocks();
    });

    it('should flush batch when switching textures', () => {
        const tex1 = { texture: { id: 1 }, bind: vi.fn() } as unknown as Texture;
        const tex2 = { texture: { id: 2 }, bind: vi.fn() } as unknown as Texture;

        renderer.begin();

        // Draw with Texture 1
        renderer.drawSprite(tex1, 0, 0, 10, 10);

        // Should not have flushed yet
        expect(mockGL.drawArrays).not.toHaveBeenCalled();

        // Draw with Texture 2 (Should trigger flush of first batch)
        renderer.drawSprite(tex2, 20, 20, 10, 10);

        // Assert: First batch (size 1) should be drawn
        expect(mockGL.drawArrays).toHaveBeenCalledTimes(1);
        expect(mockGL.drawArrays).toHaveBeenCalledWith(mockGL.TRIANGLES, 0, 6); // 6 verts for 1 sprite

        // End checks remaining batch
        renderer.end();
        expect(mockGL.drawArrays).toHaveBeenCalledTimes(2); // Second batch drawn
    });

    it('should NOT flush if texture is the same', () => {
        const tex1 = { texture: { id: 1 }, bind: vi.fn() } as unknown as Texture;

        renderer.begin();
        renderer.drawSprite(tex1, 0, 0, 10, 10);
        renderer.drawSprite(tex1, 20, 20, 10, 10);

        // Should be 0 calls before end
        expect(mockGL.drawArrays).not.toHaveBeenCalled();

        renderer.end();
        // Should be 1 call with 12 verts (2 sprites)
        expect(mockGL.drawArrays).toHaveBeenCalledTimes(1);
        expect(mockGL.drawArrays).toHaveBeenCalledWith(mockGL.TRIANGLES, 0, 12);
    });
});
