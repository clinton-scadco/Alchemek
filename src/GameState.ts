import { actions } from "./Actions";
import { Action, ActionDuration, Item, Entity, Kin, Rite, Milestone, Message } from "./BaseClasses";
import { MilestoneDefinitions } from "./Eras/MilestoneDefinitions";
import { EvaluateRequirements, RemoveItem } from "./Functions";
import { MilestoneMessage } from "./Messages";

export class GameState {
    inventory: Item[];
    entities: Entity[];
    kins: Kin[];
    rites: Rite[];
    milestones: Milestone[];
    ticks: number;
    tickRate: number;
    updates: number;
    performingActions: ActionDuration[];

    listeners: ((GameState: GameState, Messages: Message[]) => void)[];

    constructor() {
        this.inventory = [];
        this.entities = [];
        this.kins = [];
        this.rites = [];
        this.milestones = [];
        this.ticks = 0;
        this.tickRate = 10;
        this.performingActions = [];
        this.listeners = [];
        this.updates = 0;
        if (this.tickRate > 0) {
            setInterval(() => {
                this.ticks += 1 / this.tickRate;
                this.tick();
            }, 1000 / this.tickRate);
        }
    }

    snapshot = () => {
        return JSON.parse(JSON.stringify(this)) as GameState;
    };

    subscribe = (listener) => {
        this.listeners.push(listener);
    };

    unsubscribe = (listener) => {
        this.listeners = this.listeners.filter((l) => l !== listener);
    };

    notify = (oldState: GameState) => {
        try {
            let newMilestones = this.milestones.filter((milestone) => !oldState.milestones.some((m) => m.name == milestone.name));
            if (newMilestones.length > 0) {
                console.log(newMilestones);
            }

            let messages = [...newMilestones.map((m) => MilestoneMessage(m))];

            if (oldState.inventory.length !== this.inventory.length) {
                console.log("Inventory changed", this.inventory);
            }

            this.listeners.forEach((listener) => listener(this, messages));
        } catch (e) {
            console.error(e);
        }
    };

    performOffering = (rite: Rite, itemName: string) => {
        let oldState = this.snapshot();

        RemoveItem(this.inventory, itemName, 1);
        rite.offerItem(itemName);
        this.notify(oldState);
    };

    performAction = (action: Action) => {
        let oldState = this.snapshot();

        if (action.duration > 0) {
            this.performingActions.push(new ActionDuration(action));
        } else {
            action.perform(this, null, null);
        }
        this.notify(oldState);
    };

    performEntityAction = (action: Action, entity: Entity) => {
        let oldState = this.snapshot();

        if (action.duration > 0) {
            this.performingActions.push(new ActionDuration(action, entity));
        } else {
            action.perform(this, entity, null);
        }
        this.notify(oldState);
    };

    updateMilestones = () => {
        for (let m in MilestoneDefinitions) {
            let milestone = MilestoneDefinitions[m];
            if (milestone.requirements && !this.milestones.some((m) => m.name == milestone.name)) {
                if (EvaluateRequirements(this, MilestoneDefinitions[m].requirements)) {
                    this.milestones.push(MilestoneDefinitions[m]);
                    this.updates += 1;
                }
            }
        }
    };

    tick = () => {
        try {
            let oldState = this.snapshot();

            this.updates = 0;

            this.performingActions.forEach((performingAction) => {
                performingAction.remaining -= 1 / this.tickRate;
                if (performingAction.remaining <= 0) {
                    if (!performingAction.entity) {
                        performingAction.action.perform(this, null, null);
                        this.updates += 1;
                    } else {
                        performingAction.action.perform(this, performingAction.entity, null);
                        this.updates += 1;
                    }
                }
            });

            this.performingActions = this.performingActions.filter((performingAction) => performingAction.remaining > 0);

            // Decrease ttl of each entity
            this.entities.forEach((entity) => {
                entity.tick(this, entity);

                this.updates += 1;

                entity.performs.forEach((perform) => {
                    if (perform.ttp && this.ticks - perform.lastTickPerformed >= perform.ttp && perform.condition(this, entity)) {
                        perform.perform(this, entity);
                        perform.lastTickPerformed = this.ticks;
                        this.updates += 1;
                    }
                });
                return entity;
            });

            this.entities = this.entities.filter((entity) => entity.ttl > 0 || entity.ttl === -1);

            this.kins.forEach((kin) => {
                kin.tick(this);
            });

            this.inventory = this.inventory.filter((item) => !(item.maxDurability > 0 && item.durability < 1));

            this.updateMilestones();

            this.notify(oldState);
        } catch (e) {
            console.error(e);
        }
    };

    hasMilestone = (milestone: Milestone) => {
        return this.milestones.some((m) => m.name == milestone.name);
    };
}
