export class ArcadeSystems {
    // Screen Shake
    private shakeTime: number = 0;
    private shakeMagnitude: number = 0;

    // Hit Stop
    private hitStopTime: number = 0;

    update(dt: number) {
        if (this.shakeTime > 0) this.shakeTime -= dt;
        if (this.hitStopTime > 0) this.hitStopTime -= dt;
    }

    triggerShake(magnitude: number, duration: number) {
        this.shakeMagnitude = magnitude;
        this.shakeTime = duration;
    }

    triggerHitStop(duration: number) {
        this.hitStopTime = duration;
    }

    getShakeOffset(): { x: number, y: number } {
        if (this.shakeTime <= 0) return { x: 0, y: 0 };
        const x = (Math.random() * 2 - 1) * this.shakeMagnitude;
        const y = (Math.random() * 2 - 1) * this.shakeMagnitude;
        return { x, y };
    }

    isHitStopActive(): boolean {
        return this.hitStopTime > 0;
    }
}
