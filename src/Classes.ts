export interface IAction {
    name: string;
    perform?: (inventory: Item[], entities: Entity[], kins: Kin[], source?: Entity) => void;

    condition?: (inventory: Item[], entities: Entity[], source?: Entity) => boolean;
    milestones?: (inventory: Item[], entities: Entity[], milestones: string[]) => boolean;
    source?: string[];
    type?: string[];
}

export class Action implements IAction {
    name: string;
    perform: (inventory: Item[], entities: Entity[], kins: Kin[], source?: Entity) => void;

    condition: (inventory: Item[], entities: Entity[], source?: Entity) => boolean;
    milestones: (inventory: Item[], entities: Entity[], milestones: string[]) => boolean;
    source?: string[];
    type?: string[];

    constructor({ name, perform, condition, milestones, source, type }: IAction) {
        this.name = name;
        this.perform = perform || (() => {});

        this.condition = condition || (() => true);
        this.milestones = milestones || (() => true);
        this.source = source || [];
        this.type = type || [];
    }
}

export interface IEntity {
    name: string;
    ttl?: number;
    temperature?: number;
    tick?: (inventory: Item[], entities: Entity[], kins: Kin[], ticks?: number) => void;
}

export class Entity implements IEntity {
    name: string;
    ttl: number;
    temperature: number;
    tick: (inventory: Item[], entities: Entity[], kins: Kin[], ticks?: number) => void;

    constructor({ name, ttl, temperature, tick }: IEntity) {
        this.name = name;
        this.ttl = ttl || -1;
        this.temperature = temperature || 0;
        this.tick = tick || (() => {});
    }
}

export interface IItem {
    name: string;
    durability?: number;
    maxDurability?: number;
}

export class Item implements IItem {
    name: string;
    durability: number;
    maxDurability: number;

    constructor({ name, durability, maxDurability }: IItem) {
        this.name = name;
        this.durability = durability || -1;
        this.maxDurability = maxDurability || durability || -1;
    }
}

export interface IKin {
    name: string;
}

export class Kin implements IKin {
    name: string;

    constructor({ name, durability, maxDurability }: IItem) {
        this.name = name;
    }
}
