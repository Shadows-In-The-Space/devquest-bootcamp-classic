export class InputHandler {
    private keys: { [key: string]: boolean } = {};
    private previousKeys: { [key: string]: boolean } = {};

    constructor() {
        window.addEventListener('keydown', (e) => {
            if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space'].includes(e.code)) {
                e.preventDefault();
            }
            this.keys[e.code] = true;
        });

        window.addEventListener('keyup', (e) => {
            this.keys[e.code] = false;
        });
    }

    update() {
        this.previousKeys = { ...this.keys };
    }

    isDown(code: string): boolean {
        return !!this.keys[code];
    }

    isPressed(code: string): boolean {
        return !!this.keys[code] && !this.previousKeys[code];
    }
}
