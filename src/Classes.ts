import { GetNextId } from "./utils/Data";

export interface IAction {
    name: string;
    perform?: (inventory: Item[], entities: Entity[], kins: Kin[], rites: Rite[], source?: Entity) => void;

    condition?: (inventory: Item[], entities: Entity[], kins: Kin[], rites: Rite[], source?: Entity) => boolean;
    milestones?: (inventory: Item[], entities: Entity[], kins: Kin[], rites: Rite[], milestones: string[]) => boolean;
    requires?: [string, number][];
    source?: string[];
    type?: string[];
}

export class Action implements IAction {
    name: string;
    perform: (inventory: Item[], entities: Entity[], kins: Kin[], rites: Rite[], source?: Entity) => void;

    condition: (inventory: Item[], entities: Entity[], kins: Kin[], rites: Rite[], source?: Entity) => boolean;
    milestones: (inventory: Item[], entities: Entity[], kins: Kin[], rites: Rite[], milestones: string[]) => boolean;
    requires: [string, number][];
    source?: string[];
    type?: string[];

    constructor({ name, perform, condition, milestones, requires, source, type }: IAction) {
        this.name = name;
        this.perform = perform || (() => {});

        this.condition = condition || (() => true);
        this.milestones = milestones || (() => true);
        this.requires = requires || [];
        this.source = source || [];
        this.type = type || [];
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

    tick(inventory: Item[], entities: Entity[], kins: Kin[], ticks?: number) {
        if (!this.inventory.some((i) => i.name == "Tool") && inventory.some((i) => i.name == "Tool")) {
            let tool = inventory.find((i) => i.name == "Tool");
            if (tool) {
                inventory.splice(inventory.indexOf(tool), 1);
                this.giveItem(tool);
            }
        }
    }
}
