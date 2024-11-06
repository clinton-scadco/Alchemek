import { RemoveItem, actions } from "./Actions";
import { Item, Entity, Kin, Rite, ActionDuration, Action } from "./Classes";

export class GameState {
    inventory: Item[];
    entities: Entity[];
    kins: Kin[];
    rites: Rite[];
    milestones: string[];
    ticks: number;
    tickRate: number;

    performingActions: ActionDuration[];

    listeners: ((GameState) => void)[];

    constructor() {
        this.inventory = [];
        this.entities = [];
        this.kins = [];
        this.rites = [];
        this.milestones = [];
        this.ticks = 0;
        this.tickRate = 30;
        this.performingActions = [];
        this.listeners = [];

        setInterval(() => {
            this.ticks += 1 / this.tickRate;
            this.tick();
        }, 1000 / this.tickRate);
    }

    subscribe = (listener) => {
        this.listeners.push(listener);
    };

    unsubscribe = (listener) => {
        this.listeners = this.listeners.filter((l) => l !== listener);
    };

    notify = () => {
        this.listeners.forEach((listener) => listener(this));
    };

    performOffering = (rite: Rite, itemName: string) => {
        RemoveItem(this.inventory, itemName, 1);
        rite.offerItem(itemName);
        this.notify();
    };

    performAction = (action: Action) => {
        if (action.duration > 0) {
            this.performingActions.push(new ActionDuration(action));
        } else {
            action.perform(this);
        }
        this.notify();
    };

    performEntityAction = (action: Action, entity: Entity) => {
        if (action.duration > 0) {
            this.performingActions.push(new ActionDuration(action, entity));
        } else {
            action.perform(this, entity);
        }
        this.notify();
    };

    updateMilestones = () => {
        actions.forEach((action) => {
            action.milestones(this);
        });
        this.notify();
    };

    tick = () => {
        this.performingActions.forEach((performingAction) => {
            performingAction.remaining -= 1 / this.tickRate;
            if (performingAction.remaining <= 0) {
                if (!performingAction.entity) {
                    performingAction.action.perform(this);
                } else {
                    performingAction.action.perform(this, performingAction.entity);
                }
            }
        });

        this.performingActions = this.performingActions.filter((performingAction) => performingAction.remaining > 0);

        // Decrease ttl of each entity
        this.entities.forEach((entity) => {
            entity.tick(this, entity);
            entity.performs.forEach((perform) => {
                if (perform.ttp && this.ticks - perform.lastTickPerformed >= perform.ttp && perform.condition(this, entity)) {
                    perform.perform(this, entity);
                    perform.lastTickPerformed = this.ticks;
                }
            });
            return entity;
        });

        this.entities = this.entities.filter((entity) => entity.ttl != 0);

        this.kins.forEach((kin) => {
            kin.tick(this);
        });
        this.notify();
    };
}
