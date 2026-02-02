import { WebGLContext } from './WebGLContext';
import { Shader } from './Shader';

const VERTEX_SHADER = `#version 300 es
layout(location = 0) in vec2 a_position;
layout(location = 1) in vec2 a_texCoord;
out vec2 v_texCoord;
void main() {
    gl_Position = vec4(a_position, 0.0, 1.0);
    v_texCoord = a_texCoord;
}
`;

const FRAGMENT_SHADER = `#version 300 es
precision mediump float;
in vec2 v_texCoord;
uniform sampler2D u_texture;
uniform float u_time;
out vec4 outColor;

vec2 curve(vec2 uv) {
    uv = (uv - 0.5) * 2.0;
    uv *= 1.1; // Zoom out a bit to fit curve
    uv.x *= 1.0 + pow((abs(uv.y) / 5.0), 2.0);
    uv.y *= 1.0 + pow((abs(uv.x) / 4.0), 2.0);
    uv  = (uv / 2.0) + 0.5;
    uv =  uv * 0.92 + 0.04;
    return uv;
}

void main() {
    vec2 q = v_texCoord;
    vec2 uv = curve(q);

    if (uv.x < 0.0 || uv.x > 1.0 || uv.y < 0.0 || uv.y > 1.0) {
        outColor = vec4(0.0, 0.0, 0.0, 1.0);
    } else {
        vec3 oricol = texture(u_texture, vec2(q.x, q.y)).rgb;
        vec3 col = texture(u_texture, uv).rgb;

        // Scanlines
        float scans = clamp(0.35 + 0.35 * sin(3.5 * u_time + uv.y * 1080.0), 0.0, 1.0);
        float s = pow(scans, 1.7);
        col = col * vec3(0.4 + 0.7 * s);

        // Bloom/Glow (Simulated)
        col *= 1.5;

        // Vignette
        float vig = (0.0 + 1.0 * 16.0 * uv.x * uv.y * (1.0 - uv.x) * (1.0 - uv.y));
        col *= vec3(pow(vig, 0.3));

        // Chromatic Aberration
        float r = texture(u_texture, uv + 0.003).r;
        float g = texture(u_texture, uv).g;
        float b = texture(u_texture, uv - 0.003).b;
        col.r = r;
        col.g = g;
        col.b = b;

        col *= vec3(0.95 + 0.05 * sin(100.0 * u_time + uv.y * 1000.0)); // Flickering

        outColor = vec4(col, 1.0);
    }
}
`;

export class PostProcessor {
    context: WebGLContext;
    gl: WebGL2RenderingContext;
    width: number;
    height: number;

    framebuffer: WebGLFramebuffer | null;
    texture: WebGLTexture | null;

    shader: Shader;
    vao: WebGLVertexArrayObject | null;

    constructor(context: WebGLContext, width: number, height: number) {
        this.context = context;
        this.gl = context.gl;
        this.width = width;
        this.height = height;
        this.framebuffer = null;
        this.texture = null;
        this.vao = null;

        this.shader = new Shader(this.gl, VERTEX_SHADER, FRAGMENT_SHADER);
        this.initFramebuffer();
        this.initQuad();
    }

    private initFramebuffer(): void {
        this.framebuffer = this.gl.createFramebuffer();
        this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, this.framebuffer);

        this.texture = this.gl.createTexture();
        this.gl.bindTexture(this.gl.TEXTURE_2D, this.texture);
        this.gl.texImage2D(
            this.gl.TEXTURE_2D, 0, this.gl.RGBA, this.width, this.height, 0,
            this.gl.RGBA, this.gl.UNSIGNED_BYTE, null
        );

        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.LINEAR);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.LINEAR);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_S, this.gl.CLAMP_TO_EDGE);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_T, this.gl.CLAMP_TO_EDGE);

        this.gl.framebufferTexture2D(
            this.gl.FRAMEBUFFER, this.gl.COLOR_ATTACHMENT0, this.gl.TEXTURE_2D, this.texture, 0
        );

        if (this.gl.checkFramebufferStatus(this.gl.FRAMEBUFFER) !== this.gl.FRAMEBUFFER_COMPLETE) {
            throw new Error('Framebuffer is not complete');
        }

        this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null);
    }

    private initQuad(): void {
        const vertices = new Float32Array([
            // Pos        // Tex
            -1.0, -1.0, 0.0, 0.0,
            1.0, -1.0, 1.0, 0.0,
            -1.0, 1.0, 0.0, 1.0,
            -1.0, 1.0, 0.0, 1.0,
            1.0, -1.0, 1.0, 0.0,
            1.0, 1.0, 1.0, 1.0,
        ]);

        this.vao = this.gl.createVertexArray();
        this.gl.bindVertexArray(this.vao);

        const vbo = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, vbo);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, vertices, this.gl.STATIC_DRAW);

        this.gl.enableVertexAttribArray(0);
        this.gl.vertexAttribPointer(0, 2, this.gl.FLOAT, false, 4 * 4, 0);

        this.gl.enableVertexAttribArray(1);
        this.gl.vertexAttribPointer(1, 2, this.gl.FLOAT, false, 4 * 4, 2 * 4);

        this.gl.bindVertexArray(null);
    }

    bindForWriting(): void {
        this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, this.framebuffer);
        this.gl.viewport(0, 0, this.width, this.height);
        this.context.clear(0, 0, 0, 1);
    }

    renderToScreen(): void {
        this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null); // Bind to default (screen)
        this.gl.viewport(0, 0, this.context.canvas.width, this.context.canvas.height);
        this.context.clear(0, 0, 0, 1);

        this.shader.bind();

        this.gl.activeTexture(this.gl.TEXTURE0);
        this.gl.bindTexture(this.gl.TEXTURE_2D, this.texture);
        // Assuming shader has uniform u_texture set to 0 by default or we set it

        this.gl.bindVertexArray(this.vao);
        this.gl.drawArrays(this.gl.TRIANGLES, 0, 6);
        this.gl.bindVertexArray(null);
    }
}
