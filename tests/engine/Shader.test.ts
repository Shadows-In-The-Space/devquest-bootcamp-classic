import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { Shader } from '../../src/engine/Shader';

describe('Shader', () => {
    let mockGL: any;
    let mockProgram: any;
    let mockVs: any;
    let mockFs: any;

    beforeEach(() => {
        mockProgram = { id: 'program' };
        mockVs = { id: 'vs' };
        mockFs = { id: 'fs' };

        mockGL = {
            createProgram: vi.fn().mockReturnValue(mockProgram),
            createShader: vi.fn((type) => type === 1 ? mockVs : mockFs),
            shaderSource: vi.fn(),
            compileShader: vi.fn(),
            attachShader: vi.fn(),
            linkProgram: vi.fn(),
            getProgramParameter: vi.fn().mockReturnValue(true), // Success
            getShaderParameter: vi.fn().mockReturnValue(true), // Success
            getProgramInfoLog: vi.fn().mockReturnValue(''),
            getShaderInfoLog: vi.fn().mockReturnValue(''),
            useProgram: vi.fn(),
            deleteProgram: vi.fn(),
            deleteShader: vi.fn(),
            VERTEX_SHADER: 1,
            FRAGMENT_SHADER: 2,
            LINK_STATUS: 3,
            COMPILE_STATUS: 4,
        };
    });

    it('should compile and link shaders successfully', () => {
        const shader = new Shader(mockGL as unknown as WebGL2RenderingContext, 'void main() {}', 'void main() {}');

        expect(mockGL.createProgram).toHaveBeenCalled();
        expect(mockGL.createShader).toHaveBeenCalledTimes(2);
        expect(mockGL.shaderSource).toHaveBeenCalledTimes(2);
        expect(mockGL.compileShader).toHaveBeenCalledTimes(2);
        expect(mockGL.attachShader).toHaveBeenCalledTimes(2);
        expect(mockGL.linkProgram).toHaveBeenCalledWith(mockProgram);
    });

    it('should throw error on linker failure', () => {
        mockGL.getProgramParameter.mockReturnValue(false); // Fail link
        mockGL.getProgramInfoLog.mockReturnValue('Link error');

        expect(() => {
            new Shader(mockGL as unknown as WebGL2RenderingContext, 'vs', 'fs');
        }).toThrow('Shader link error: Link error');
    });

    it('should throw error on compilation failure', () => {
        mockGL.getShaderParameter.mockReturnValue(false); // Fail compile
        mockGL.getShaderInfoLog.mockReturnValue('Compile error');

        expect(() => {
            new Shader(mockGL as unknown as WebGL2RenderingContext, 'vs', 'fs');
        }).toThrow('Shader compile error: Compile error');
    });

    it('should activate the program', () => {
        const shader = new Shader(mockGL as unknown as WebGL2RenderingContext, 'vs', 'fs');
        shader.bind();
        expect(mockGL.useProgram).toHaveBeenCalledWith(mockProgram);
    });
});
