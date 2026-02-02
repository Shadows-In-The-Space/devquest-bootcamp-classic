import { WebGLContext } from './WebGLContext';
import { Shader } from './Shader';
import { Texture } from './Texture';

// Simple Sprite Shader
const VERTEX_SHADER = `#version 300 es
layout(location = 0) in vec2 a_position;
layout(location = 1) in vec2 a_texCoord;
uniform vec2 u_resolution;
out vec2 v_texCoord;
void main() {
    // Convert from pixel space to clip space
    vec2 clipSpace = (a_position / u_resolution) * 2.0 - 1.0;
    gl_Position = vec4(clipSpace * vec2(1, -1), 0, 1);
    v_texCoord = a_texCoord;
}
`;

const FRAGMENT_SHADER = `#version 300 es
precision mediump float;
in vec2 v_texCoord;
uniform sampler2D u_texture;
uniform vec4 u_color;
out vec4 outColor;
void main() {
    outColor = texture(u_texture, v_texCoord) * u_color;
}
`;

export class SpriteRenderer {
    context: WebGLContext;
    gl: WebGL2RenderingContext;
    vbo: WebGLBuffer | null;
    vao: WebGLVertexArrayObject | null;
    shader: Shader;

    // Batching
    private maxSprites = 1000;
    private vertices: Float32Array;
    private spriteCount = 0;
    private vertexSize = 4; // x, y, u, v
    private currentTexture: WebGLTexture | null = null;

    constructor(context: WebGLContext) {
        this.context = context;
        this.gl = context.gl;
        this.vbo = null;
        this.vao = null;

        // 6 vertices per sprite (2 triangles), 4 floats per vertex
        this.vertices = new Float32Array(this.maxSprites * 6 * this.vertexSize);

        this.shader = new Shader(this.gl, VERTEX_SHADER, FRAGMENT_SHADER);
        this.init();
    }

    private init(): void {
        this.vao = this.gl.createVertexArray();
        this.gl.bindVertexArray(this.vao);

        this.vbo = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vbo);

        // Dynamic draw for batching
        this.gl.bufferData(this.gl.ARRAY_BUFFER, this.vertices.byteLength, this.gl.DYNAMIC_DRAW);

        // Position (vec2)
        this.gl.enableVertexAttribArray(0);
        this.gl.vertexAttribPointer(0, 2, this.gl.FLOAT, false, this.vertexSize * 4, 0);

        // TexCoord (vec2)
        this.gl.enableVertexAttribArray(1);
        this.gl.vertexAttribPointer(1, 2, this.gl.FLOAT, false, this.vertexSize * 4, 2 * 4);

        this.gl.bindVertexArray(null);
    }

    begin(): void {
        this.spriteCount = 0;
        this.currentTexture = null;
        this.shader.bind();

        // Update resolution uniform
        const loc = this.gl.getUniformLocation(this.shader.program!, 'u_resolution');
        this.gl.uniform2f(loc, this.context.canvas.width, this.context.canvas.height);

        // Default color (white)
        const colLoc = this.gl.getUniformLocation(this.shader.program!, 'u_color');
        this.gl.uniform4f(colLoc, 1, 1, 1, 1);
    }

    drawSprite(texture: Texture, x: number, y: number, width: number, height: number, rotation: number = 0): void {
        if (this.spriteCount >= this.maxSprites) {
            this.flush();
        }

        // Check if texture changed
        if (this.currentTexture !== texture.texture) {
            this.flush(); // Flush previous batch with old texture
            this.currentTexture = texture.texture;
            texture.bind(0);
        }

        // Calculate vertices with rotation
        // Top-Left: -w/2, -h/2
        const x1 = 0; const y1 = 0;
        const x2 = width; const y2 = 0;
        const x3 = width; const y3 = height;
        const x4 = 0; const y4 = height;

        // TexCoords (0,0 to 1,1)
        const u1 = 0; const v1 = 0;
        const u2 = 1; const v2 = 0;
        const u3 = 1; const v3 = 1;
        const u4 = 0; const v4 = 1;

        // Add to buffer (6 vertices)
        let offset = this.spriteCount * 6 * this.vertexSize;

        // Tri 1
        this.addVertex(offset + 0, x + x1, y + y1, u1, v1);
        this.addVertex(offset + 4, x + x2, y + y2, u2, v2);
        this.addVertex(offset + 8, x + x4, y + y4, u4, v4);

        // Tri 2
        this.addVertex(offset + 12, x + x2, y + y2, u2, v2);
        this.addVertex(offset + 16, x + x3, y + y3, u3, v3);
        this.addVertex(offset + 20, x + x4, y + y4, u4, v4);

        this.spriteCount++;
    }

    private addVertex(offset: number, x: number, y: number, u: number, v: number) {
        this.vertices[offset + 0] = x;
        this.vertices[offset + 1] = y;
        this.vertices[offset + 2] = u;
        this.vertices[offset + 3] = v;
    }

    flush(): void {
        if (this.spriteCount === 0) return;

        this.gl.bindVertexArray(this.vao);
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vbo);

        // Upload only the used part of the buffer
        const view = this.vertices.subarray(0, this.spriteCount * 6 * this.vertexSize);
        this.gl.bufferSubData(this.gl.ARRAY_BUFFER, 0, view);

        this.gl.drawArrays(this.gl.TRIANGLES, 0, this.spriteCount * 6);
        this.gl.bindVertexArray(null);

        this.spriteCount = 0;
    }

    end(): void {
        this.flush();
    }
}
