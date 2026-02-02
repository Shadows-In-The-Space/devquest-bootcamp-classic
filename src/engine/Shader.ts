export class Shader {
    gl: WebGL2RenderingContext;
    program: WebGLProgram;

    constructor(gl: WebGL2RenderingContext, vertexSource: string, fragmentSource: string) {
        this.gl = gl;

        const vertexShader = this.compile(gl.VERTEX_SHADER, vertexSource);
        const fragmentShader = this.compile(gl.FRAGMENT_SHADER, fragmentSource);

        const program = gl.createProgram();
        if (!program) throw new Error('Could not create WebGL program');

        gl.attachShader(program, vertexShader);
        gl.attachShader(program, fragmentShader);
        gl.linkProgram(program);

        if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
            const info = gl.getProgramInfoLog(program);
            throw new Error(`Shader link error: ${info}`);
        }

        this.program = program;

        // Cleanup shaders after link
        gl.deleteShader(vertexShader);
        gl.deleteShader(fragmentShader);
    }

    private compile(type: number, source: string): WebGLShader {
        const shader = this.gl.createShader(type);
        if (!shader) throw new Error('Could not create shader');

        this.gl.shaderSource(shader, source);
        this.gl.compileShader(shader);

        if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
            const info = this.gl.getShaderInfoLog(shader);
            throw new Error(`Shader compile error: ${info}`);
        }

        return shader;
    }

    bind(): void {
        this.gl.useProgram(this.program);
    }
}
