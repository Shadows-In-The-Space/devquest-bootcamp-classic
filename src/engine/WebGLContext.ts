export class WebGLContext {
    gl: WebGL2RenderingContext;
    canvas: HTMLCanvasElement;

    constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
        const gl = canvas.getContext('webgl2');
        if (!gl) {
            throw new Error('WebGL2 not supported');
        }
        this.gl = gl as WebGL2RenderingContext;
    }

    resize(width: number, height: number): void {
        this.canvas.width = width;
        this.canvas.height = height;
        this.gl.viewport(0, 0, width, height);
    }

    clear(r: number = 0, g: number = 0, b: number = 0, a: number = 1): void {
        this.gl.clearColor(r, g, b, a);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT);
    }
}
