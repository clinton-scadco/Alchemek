import { Milestone } from "./Eras/One";
import { GetNextId } from "./utils/Data";

export interface IRequirement {
    type: string;
    name?: string;
    value: number;
    operator?: string;
    requires?: Requirement[];
}

export class Requirement implements IRequirement {
    type: string;
    value: number;
    operator: string;
    name?: string;

    requires: Requirement[];

    constructor({ type, name, value, operator, requires }: IRequirement) {
        this.type = type;
        this.name = name;
        this.value = value;
        this.operator = operator || ">=";
        this.requires = requires || [];
    }
}

export const ItemRequirement = ([item, amount]) => {
    return new Requirement({ type: "item", name: item, value: amount });
};

export interface IAction {
    name: string;
    perform?: (state: IGameState, source?: Entity) => void;
    milestones?: (state: IGameState) => boolean;
    requires?: Requirement[];
    source?: string[];
    type?: string[];
    duration?: number;
}

export class Action implements IAction {
    id: number;
    name: string;
    perform: (state: IGameState, source?: Entity) => void;
    milestones: (state: IGameState) => boolean;
    requires: Requirement[];
    source?: string[];
    type?: string[];
    duration: number;

    constructor({ name, perform, milestones, requires, source, type, duration }: IAction) {
        this.id = GetNextId();
        this.name = name;
        this.perform = perform || (() => {});

        this.milestones = milestones || (() => true);
        this.requires = requires || [];
        this.source = source || [];
        this.type = type || [];
        this.duration = duration || 0;
    }
}

export class ActionDuration {
    action: Action;
    remaining: number;
    entity?: Entity;

    constructor(action: Action, entity?: Entity) {
        this.action = action;
        this.remaining = action.duration;
        this.entity = entity;
    }
}

export interface IRite {
    name: string;
    ingredients: [string, number][];
    progress?: [string, number][];
}

export class Rite {
    id: number;
    name: string;
    ingredients: [string, number][];
    progress: [string, number][];

    icon: string = "📦";

    constructor({ name, ingredients }: IRite) {
        this.id = GetNextId();
        this.name = name;
        this.ingredients = ingredients || [];
        this.progress = [];
    }

    isComplete() {
        return this.ingredients.every(([name, count]) => {
            return this.progress.filter(([n, c]) => n == name && c == count).length > 0;
        });
    }

    offerItem(item: string) {
        let p = this.progress.find(([name, count]) => name == item);
        if (p) {
            p[1] += 1;
        } else [this.progress.push([item, 1])];
    }
}

interface IEntityPerform {
    icon: string;
    name: string;
    ttp: number;
    lastTickPerformed: number;

    condition: (state: IGameState, source: Entity) => boolean;
    perform: (state: IGameState, source: Entity) => void;
}

export interface IEntity {
    name: string;
    ttl?: number;
    temperature?: number;
    tick?: (state: IGameState, source: Entity) => void;
    performs?: IEntityPerform[];
}

export class Entity implements IEntity {
    name: string;
    ttl: number;
    temperature: number;
    tick: (state: IGameState, source: Entity) => void;
    performs: IEntityPerform[];

    constructor({ name, ttl, temperature, tick, performs }: IEntity) {
        this.name = name;
        this.ttl = ttl || -1;
        this.temperature = temperature || 0;

        this.performs = performs || [];

        this.tick = tick || (() => {});
    }
}

export interface IItem {
    name: string;
    durability?: number;
    maxDurability?: number;
}

export class Item implements IItem {
    id: number;
    name: string;
    durability: number;
    maxDurability: number;

    icon: string = "📦";

    constructor({ name, durability, maxDurability }: IItem) {
        this.id = GetNextId();
        this.name = name;
        this.durability = durability || -1;
        this.maxDurability = maxDurability || durability || -1;
    }
}

export interface IKin {
    name: string;
    inventory?: Item[];
}

export class Kin implements IKin {
    id: number;
    name: string;
    inventory: Item[];

    icon: string = "👤";

    constructor({ name, inventory }: IKin) {
        this.id = GetNextId();
        this.name = name;
        this.inventory = inventory || [];
    }

    giveItem(item: Item) {
        this.inventory.push(item);
    }

    tick(state: IGameState) {
        if (!this.inventory.some((i) => i.name == "Tool") && state.inventory.some((i) => i.name == "Tool")) {
            let tool = state.inventory.find((i) => i.name == "Tool");
            if (tool) {
                state.inventory.splice(state.inventory.indexOf(tool), 1);
                this.giveItem(tool);
            }
        }
    }
}

export interface IGameState {
    inventory: Item[];
    entities: Entity[];
    kins: Kin[];
    rites: Rite[];
    milestones: Milestone[];
    ticks: number;
    tickRate: number;

    performingActions: ActionDuration[];
}
