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
        // 16x16 Starfighter Sprite (fallback if PNG fails)
        const T = 0, K = 1, G = 2, D = 3, C = 4, P = 5, O = 6, Y = 7;
        const palette: Record<number, number[]> = {
            [T]: [0,0,0,0], [K]: [17,17,17,255], [G]: [50,215,75,255],
            [D]: [26,138,46,255], [C]: [0,255,255,255], [P]: [124,58,237,255],
            [O]: [255,136,0,255], [Y]: [255,220,50,255],
        };
        const grid = [
            [T,T,T,T,T,T,T,K,K,T,T,T,T,T,T,T],
            [T,T,T,T,T,T,K,G,G,K,T,T,T,T,T,T],
            [T,T,T,T,T,K,G,C,C,G,K,T,T,T,T,T],
            [T,T,T,T,T,K,G,G,G,G,K,T,T,T,T,T],
            [T,T,T,T,K,G,D,G,G,D,G,K,T,T,T,T],
            [T,T,T,K,P,G,D,G,G,D,G,P,K,T,T,T],
            [T,T,K,P,P,G,D,G,G,D,G,P,P,K,T,T],
            [T,K,P,P,K,G,K,G,G,K,G,K,P,P,K,T],
            [K,P,P,K,T,K,K,G,G,K,K,T,K,P,P,K],
            [T,K,P,K,T,K,D,G,G,D,K,T,K,P,K,T],
            [T,T,K,T,T,K,D,D,D,D,K,T,T,K,T,T],
            [T,T,T,T,T,K,D,K,K,D,K,T,T,T,T,T],
            [T,T,T,T,T,K,K,K,K,K,K,T,T,T,T,T],
            [T,T,T,T,T,T,O,T,T,O,T,T,T,T,T,T],
            [T,T,T,T,T,T,Y,T,T,Y,T,T,T,T,T,T],
            [T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T],
        ];
        const data = new Uint8Array(16 * 16 * 4);
        for (let y = 0; y < 16; y++)
            for (let x = 0; x < 16; x++) {
                const c = palette[grid[y][x]];
                const i = (y * 16 + x) * 4;
                data[i] = c[0]; data[i+1] = c[1]; data[i+2] = c[2]; data[i+3] = c[3];
            }
        this.updateTexture(data, 16, 16);
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
