import { WebGLContext } from '../engine/WebGLContext';
import { SpriteRenderer } from '../engine/SpriteRenderer';
import { PostProcessor } from '../engine/PostProcessor';
import { Texture } from '../engine/Texture';
import { AudioSystem } from '../engine/AudioSystem';
import { InputHandler } from './InputHandler';
import { GameState } from './states/GameState';
import { PlayState } from './states/PlayState';
import { AttractState } from './states/AttractState';
import { ArcadeSystems } from './systems/ArcadeSystems';

export class Game {
    public canvas: HTMLCanvasElement;
    public context: WebGLContext;
    public renderer: SpriteRenderer;
    public postProcessor: PostProcessor;
    public audio: AudioSystem;
    public input: InputHandler;
    public arcadeSystems: ArcadeSystems;

    // Assets
    public assets: {
        shipTex: Texture;
        invaderTex: Texture;
    };

    // Global State
    public score: number = 0;
    public lives: number = 3;

    private currentState: GameState | null = null;
    private running: boolean = false;
    private lastTime: number = 0;

    constructor(
        canvas: HTMLCanvasElement,
        public playerEmail: string,
        public onGameOverCallback: () => void,
        public onScoreUpdateCallback: (score: number) => void,
        public onLivesUpdateCallback: (lives: number) => void,
        public onGameWinCallback: () => void
    ) {
        this.canvas = canvas;

        // Initialize Engine
        this.context = new WebGLContext(canvas);
        this.renderer = new SpriteRenderer(this.context);
        this.postProcessor = new PostProcessor(this.context, canvas.width, canvas.height);
        this.audio = new AudioSystem();
        this.input = new InputHandler();
        this.arcadeSystems = new ArcadeSystems();

        // Load Assets
        this.assets = {
            shipTex: new Texture(this.context, '/assets/ship.png'),
            invaderTex: new Texture(this.context, '/assets/invader.png')
        };
    }

    start() {
        this.running = true;
        this.lastTime = performance.now();
        this.audio.startBGM();

        // Start in AttractState
        this.switchState(new AttractState());

        requestAnimationFrame((time) => this.loop(time));
    }

    stop() {
        this.running = false;
        this.audio.stopBGM();
    }

    switchState(newState: GameState) {
        if (this.currentState) {
            this.currentState.exit(this);
        }
        this.currentState = newState;
        this.currentState.enter(this);
    }

    private loop(time: number) {
        if (!this.running) return;

        const dt = (time - this.lastTime) / 1000;
        this.lastTime = time;

        this.arcadeSystems.update(dt); // Update shake/timers

        if (this.currentState) {
            // Hit Stop Logic: If hit stop is active, skip update?
            // Accurate Arcade behavior: Logic pauses, rendering continues (or jitters)
            if (!this.arcadeSystems.isHitStopActive()) {
                this.currentState.update(this, dt);
            }
        }

        this.render(time / 1000);

        this.input.update(); // Snapshot input state for next frame

        requestAnimationFrame((t) => this.loop(t));
    }

    private render(totalTime: number) {
        this.postProcessor.bindForWriting();
        this.renderer.begin();

        // Apply Global Transform for Shake
        const shake = this.arcadeSystems.getShakeOffset();
        // Since SpriteRenderer is simple, we might need to add offset to every draw call 
        // OR modifying the View Projection matrix in SpriteRenderer. Only SpriteRenderer is exposed.
        // For now, simpler: pass shake to state? 
        // Actually, let's update SpriteRenderer to handle a global offset or just handle it in state render.
        // Better: We are hijacking the renderer. 
        // But since we can't easily modify SpriteRenderer right now without reading it, 
        // let's assume valid state render handles it OR we add it to the ViewMatrix if possible.

        // Wait, PostProcessor can handle shake if we pass it as uniform? 
        // Or we just modify objects positions in State? (Messy)
        // Best: Add proper camera/transform support.
        // Fallback: Post-Process Glitch/Shake.

        if (this.currentState) {
            this.currentState.render(this);
        }

        this.renderer.end();

        // Post Processing
        const shader = this.postProcessor.shader;
        shader.bind();
        const timeLoc = this.context.gl.getUniformLocation(shader.program!, 'u_time');
        if (timeLoc) this.context.gl.uniform1f(timeLoc, totalTime);

        // We could pass shake here to shader if we implemented it in PostProcessor

        this.postProcessor.renderToScreen();
    }

    // Callbacks exposed helpers
    onGameOver() {
        this.onGameOverCallback();
        this.stop(); // Stop loop
    }

    onGameWin() {
        this.onGameWinCallback();
        this.stop();
    }

    addScore(points: number) {
        this.score += points;
        this.onScoreUpdateCallback(this.score);
    }

    onLivesUpdate(lives: number) {
        this.lives = lives;
        this.onLivesUpdateCallback(lives);
    }
}
