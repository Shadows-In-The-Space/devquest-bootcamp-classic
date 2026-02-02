import { WebGLContext } from './WebGLContext';

export class Texture {
    gl: WebGL2RenderingContext;
    texture: WebGLTexture | null;
    width: number = 0;
    height: number = 0;

    constructor(context: WebGLContext, url?: string) {
        this.gl = context.gl;
        this.texture = this.gl.createTexture();
        this.gl.bindTexture(this.gl.TEXTURE_2D, this.texture);

        // Placeholder 1x1 pixel (magenta) while loading
        this.gl.texImage2D(
            this.gl.TEXTURE_2D, 0, this.gl.RGBA, 1, 1, 0,
            this.gl.RGBA, this.gl.UNSIGNED_BYTE,
            new Uint8Array([255, 0, 255, 255])
        );

        if (url) {
            this.load(url);
        }
    }

    load(url: string): void {
        const image = new Image();
        image.src = url;
        image.onload = () => {
            this.gl.bindTexture(this.gl.TEXTURE_2D, this.texture);
            this.gl.texImage2D(
                this.gl.TEXTURE_2D, 0, this.gl.RGBA, this.gl.RGBA,
                this.gl.UNSIGNED_BYTE, image
            );
            this.gl.generateMipmap(this.gl.TEXTURE_2D);
            this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.NEAREST);
            this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.NEAREST_MIPMAP_NEAREST);

            this.width = image.width;
            this.height = image.height;
        };
        image.onerror = () => {
            console.warn(`Failed to load texture: ${url}. Generating procedural sprite.`);
            if (url.includes('ship')) this.generateShip();
            else if (url.includes('invader')) this.generateInvader();
        };
    }

    private generateShip() {
        // Simple 8x8 Ship Sprite (White)
        const data = new Uint8Array([
            0, 0, 0, 255, 255, 0, 0, 0,
            0, 0, 255, 255, 255, 255, 0, 0,
            0, 255, 255, 255, 255, 255, 255, 0,
            255, 255, 0, 255, 255, 0, 255, 255,
            255, 255, 255, 255, 255, 255, 255, 255,
            0, 0, 255, 0, 0, 255, 0, 0,
            0, 255, 0, 0, 0, 0, 255, 0,
            255, 0, 0, 0, 0, 0, 0, 255
        ].flatMap(p => p ? [255, 255, 255, 255] : [0, 0, 0, 0]));

        this.updateTexture(data, 8, 8);
    }

    private generateInvader() {
        // Simple 8x8 Invader Sprite (Green)
        const data = new Uint8Array([
            0, 0, 255, 255, 255, 255, 0, 0,
            0, 255, 255, 255, 255, 255, 255, 0,
            255, 255, 0, 255, 255, 0, 255, 255,
            255, 255, 255, 255, 255, 255, 255, 255,
            0, 0, 255, 0, 0, 255, 0, 0,
            0, 255, 0, 255, 255, 0, 255, 0,
            255, 0, 255, 0, 0, 255, 0, 255,
            0, 0, 0, 0, 0, 0, 0, 0
        ].flatMap(p => p ? [57, 255, 20, 255] : [0, 0, 0, 0]));

        this.updateTexture(data, 8, 8);
    }

    private updateTexture(data: Uint8Array, w: number, h: number) {
        this.gl.bindTexture(this.gl.TEXTURE_2D, this.texture);
        this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, w, h, 0, this.gl.RGBA, this.gl.UNSIGNED_BYTE, data);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.NEAREST);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.NEAREST);
        this.width = w;
        this.height = h;
    }

    bind(unit: number = 0): void {
        this.gl.activeTexture(this.gl.TEXTURE0 + unit);
        this.gl.bindTexture(this.gl.TEXTURE_2D, this.texture);
    }
}
