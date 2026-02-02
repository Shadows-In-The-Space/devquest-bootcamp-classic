import { describe, it, expect, vi, beforeEach } from 'vitest';
import { PostProcessor } from '../../src/engine/PostProcessor';
import { WebGLContext } from '../../src/engine/WebGLContext';

// Mock Shader
vi.mock('../../src/engine/Shader', () => {
    return {
        Shader: class {
            bind = vi.fn();
            program = {};
            constructor(gl: any, vs: string, fs: string) { }
        }
    };
});

describe('PostProcessor', () => {
    let mockContext: any;
    let mockGL: any;
    let canvas: HTMLCanvasElement;

    beforeEach(() => {
        canvas = document.createElement('canvas');
        canvas.width = 800;
        canvas.height = 600;

        mockGL = {
            createFramebuffer: vi.fn().mockReturnValue({}),
            bindFramebuffer: vi.fn(),
            createTexture: vi.fn().mockReturnValue({}),
            bindTexture: vi.fn(),
            texImage2D: vi.fn(),
            texParameteri: vi.fn(),
            framebufferTexture2D: vi.fn(),
            createBuffer: vi.fn().mockReturnValue({}),
            bindBuffer: vi.fn(),
            bufferData: vi.fn(),
            createVertexArray: vi.fn().mockReturnValue({}),
            bindVertexArray: vi.fn(),
            enableVertexAttribArray: vi.fn(),
            vertexAttribPointer: vi.fn(),
            drawArrays: vi.fn(),
            activeTexture: vi.fn(),
            viewport: vi.fn(),
            checkFramebufferStatus: vi.fn().mockReturnValue(36053), // FRAMEBUFFER_COMPLETE
            FRAMEBUFFER: 1,
            TEXTURE_2D: 2,
            RGBA: 3,
            UNSIGNED_BYTE: 4,
            COLOR_ATTACHMENT0: 5,
            FRAMEBUFFER_COMPLETE: 36053,
            LINEAR: 6,
            CLAMP_TO_EDGE: 7,
            TEXTURE_MIN_FILTER: 8,
            TEXTURE_MAG_FILTER: 9,
            TEXTURE_WRAP_S: 10,
            TEXTURE_WRAP_T: 11,
            ARRAY_BUFFER: 12,
            STATIC_DRAW: 13,
            FLOAT: 14,
            TRIANGLES: 15,
            TEXTURE0: 16
        };

        mockContext = {
            gl: mockGL,
            canvas: canvas,
            clear: vi.fn()
        } as unknown as WebGLContext;
    });

    it('should create framebuffers on init', () => {
        const pp = new PostProcessor(mockContext, 800, 600);
        expect(mockGL.createFramebuffer).toHaveBeenCalled();
        expect(mockGL.createTexture).toHaveBeenCalled();
        expect(mockGL.texImage2D).toHaveBeenCalledWith(
            mockGL.TEXTURE_2D, 0, mockGL.RGBA, 800, 600, 0, mockGL.RGBA, mockGL.UNSIGNED_BYTE, null
        );
    });

    it('should bind for writing', () => {
        const pp = new PostProcessor(mockContext, 800, 600);
        pp.bindForWriting();
        expect(mockGL.bindFramebuffer).toHaveBeenCalledWith(mockGL.FRAMEBUFFER, expect.anything());
        expect(mockGL.viewport).toHaveBeenCalledWith(0, 0, 800, 600);
    });

    it('should render to screen', () => {
        const pp = new PostProcessor(mockContext, 800, 600);
        pp.renderToScreen();
        // Should unbind framebuffer (bind to null)
        expect(mockGL.bindFramebuffer).toHaveBeenLastCalledWith(mockGL.FRAMEBUFFER, null);
        expect(mockGL.drawArrays).toHaveBeenCalled();
    });
});
