import Phaser, { Game } from "phaser";
import { GameState } from "./src/GameState";

// import Phaser from 'phaser';
// import { GameState } from './GameState';
import { EvaluateRequirements } from "./src/Functions";
import { DayNightColors } from "./src/utils/Theme";
import { ItemDefinitions } from "./src/Eras/ItemDefinitions";

class GameScene extends Phaser.Scene {
    dayText: Phaser.GameObjects.Text;
    progressBar: Phaser.GameObjects.Rectangle;
    inventoryText: Phaser.GameObjects.Text;
    messages: { icon: string; text: string }[] = [];

    constructor() {
        super({ key: "GameScene" });
    }

    preload() {
        // Load assets here, e.g., sprites, backgrounds, etc.
        this.load.image("logo", "/assets/logo.png");
    }

    create() {
        const logo = this.physics.add.image(960, 540, "logo");

        const gameState = new GameState();

        gameState.inventory.push(ItemDefinitions.Stone.create());

        // Subscribe to GameState updates
        gameState.subscribe((newState, newMessages) => {
            this.updateGameState(newState, newMessages);
        });

        this.setupUI();
        // this.setupActions();

        this.registry.set("state", gameState);
    }

    update(time, delta) {
        let state = this.registry.get("state") as GameState;

        state.tick(delta);

        const day = Math.floor(state.ticks / 100) + 1;
        const colorIndex = Math.floor(((state.ticks % 100) / 100) * DayNightColors.length);

        this.registry.set("state", state);

        this.dayText.setText(`Day ${day}`);
        this.progressBar.setFillStyle(DayNightColors[colorIndex.toString()], 1);
    }

    setupUI() {
        // Example: Adding text for day display
        this.dayText = this.add.text(10, 10, "Day 1", { font: "16px Arial", color: "#ffffff" });

        // Example: Adding a progress bar for day-night cycle
        this.progressBar = this.add.rectangle(10, 30, 200, 20, 0xffffff);
        this.progressBar.setOrigin(0, 0);

        // Example: Adding inventory UI
        this.inventoryText = this.add.text(10, 60, "Inventory:", { font: "16px Arial", color: "#ffffff" });

        // Update inventory display
        this.updateInventory();
    }

    // setupActions() {
    //     // Setup buttons for actions, e.g., rituals, crafting, etc.
    //     const actionsButton = this.add
    //         .text(10, 100, "Perform Action", {
    //             font: "16px Arial",
    //             color: "#ffffff",
    //             backgroundColor: "#0000ff",
    //         })
    //         .data
    //         .setInteractive();

    //     actionsButton.on("pointerdown", () => {
    //         let state = this.registry.get("state") as GameState;

    //         const exampleAction = state.getActionByName("Example Action");
    //         if (exampleAction && EvaluateRequirements(this.gameState, exampleAction.requirements)) {
    //             this.gameState.performAction(exampleAction);
    //         }
    //     });
    // }

    updateGameState(newState, newMessages) {
        // this.inventory = newState.inventory;
        // this.entities = newState.entities;
        // this.milestones = newState.milestones;
        // this.kins = newState.kins;
        // this.rites = newState.rites;
        // this.ticks = newState.ticks;
        // this.performingActions = newState.performingActions;
        if (newMessages.length > 0) {
            this.messages = [...this.messages, ...newMessages];
            this.displayMessages();
        }
        this.updateInventory();
    }

    updateInventory() {
        let state = this.registry.get("state") as GameState;
        if (state) {
            const inventoryContent = state.inventory.map((item) => `${item.name}`).join("\n");
            this.inventoryText.setText(`Inventory:\n${inventoryContent}`);
        }
    }

    displayMessages() {
        let state = this.registry.get("state") as GameState;

        const messageText = this.messages.map((msg) => `${msg.icon} ${msg.text}`).join("\n");
        this.add.text(10, 200, messageText, { font: "14px Arial", color: "#ffffff" });
    }
}

const config = {
    type: Phaser.AUTO,
    width: 1920,
    height: 1080,
    scene: GameScene,
    pixelArt: true,
    autoCenter: Phaser.Scale.Center.CENTER_BOTH,
    physics: {
        default: "arcade",
        arcade: {
            gravity: { y: 0, x: 0 },
        },
    },
} as Phaser.Types.Core.GameConfig;

const game = new Phaser.Game(config);
