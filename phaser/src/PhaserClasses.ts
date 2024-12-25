import { Kin } from "./BaseClasses";

export class WorldState {
    kins: { [key: string]: PhaserKin };

    constructor() {
        this.kins = {};
    }
}

export class PhaserKin extends Phaser.GameObjects.GameObject {
    kin: Kin;

    nameText: Phaser.GameObjects.Text;

    x: number;
    y: number;

    wander: WanderAI;

    constructor(scene: Phaser.Scene, kin: Kin, x: number, y: number) {
        super(scene, "PhaserKin");

        this.kin = kin;
        this.x = x;
        this.y = y;

        this.wander = new WanderAI(x, y, 0.5);

        this.nameText = scene.add.text(x, y, kin.name, { font: "16px Arial", color: "#ffffff" });
    }

    update(...args: any[]): void {
        super.update(...args);
        this.wander.update();
        this.x = this.wander.x;
        this.y = this.wander.y;

        this.nameText.setPosition(this.x, this.y);
    }
}

class WanderAI {
    x: number;
    y: number;
    targetX: number;
    targetY: number;
    speed: number;
    pause: number;
    constructor(x: number, y: number, speed: number) {
        this.x = x;
        this.y = y;
        this.speed = speed;
        this.chooseNewTarget(30, 60);
    }

    // Helper function to calculate distance
    private distanceToTarget(): number {
        const dx = this.targetX - this.x;
        const dy = this.targetY - this.y;
        return Math.sqrt(dx * dx + dy * dy);
    }

    // Update position and target
    public update(): void {
        if (this.pause > 0) {
            this.pause--;
            return;
        }
        // Calculate direction vector
        const dx = this.targetX - this.x;
        const dy = this.targetY - this.y;
        const distance = this.distanceToTarget();

        if (distance === 0) {
            return; // Already at target
        }

        // Normalize direction vector and scale by speed
        const moveX = (dx / distance) * this.speed;
        const moveY = (dy / distance) * this.speed;

        // Move towards the target
        this.x += moveX;
        this.y += moveY;

        // Check if we've reached the target (or overshot)
        if (distance <= this.speed) {
            this.x = this.targetX;
            this.y = this.targetY;
            this.chooseNewTarget(30, 60);
        }
    }

    // Choose a new random target within a min and max range in any direction
    private chooseNewTarget(minRange: number, maxRange): void {
        this.targetX = this.x + Math.floor(Math.random() * (maxRange - minRange) + minRange) * (Math.random() < 0.5 ? -1 : 1);
        this.targetY = this.y + Math.floor(Math.random() * (maxRange - minRange) + minRange) * (Math.random() < 0.5 ? -1 : 1);
        this.pause = Math.ceil(Math.random() * 360);
    }

    // Get current position
    public getPosition(): { x: number; y: number } {
        return { x: this.x, y: this.y };
    }
}
