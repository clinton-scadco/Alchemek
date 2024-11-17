import { EvaluateRequirements } from "./Functions";
import { GetNextId } from "./utils/Data";

export interface IRequirement {
    type: string;
    name?: string;
    value: number | string;
    operator?: string;
    requires?: Requirement[];
}

export class Requirement implements IRequirement {
    type: string;
    value: number | string;
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
    icon: string;
    perform: (state: IGameState, source: Entity | null, kin: Kin | null) => void;
    milestones?: (state: IGameState) => boolean;
    requires?: Requirement[];
    allowedEntities?: string[];
    type?: string[];
    duration?: number;
}

export class Action implements IAction {
    id: number;
    name: string;
    icon: string;
    perform: (state: IGameState, source: Entity | null, kin: Kin | null) => void;
    milestones: (state: IGameState) => boolean;
    requires: Requirement[];
    allowedEntities?: string[];
    type?: string[];
    duration: number;

    constructor({ name, icon, perform, milestones, requires, allowedEntities: entities, type, duration }: IAction) {
        this.id = GetNextId();
        this.name = name;
        this.icon = icon || "🫴";
        this.perform = perform || (() => {});

        this.milestones = milestones || (() => true);
        this.requires = requires || [];
        this.allowedEntities = entities || [];
        this.type = type || [];
        this.duration = duration || 0;
    }
}

export class ActionDuration {
    id: number;
    action: Action;
    remaining: number;
    entity?: Entity;

    constructor(action: Action, entity?: Entity) {
        this.id = GetNextId();
        this.action = action;
        this.remaining = action.duration || 0;
        this.entity = entity;
    }
}

export interface IRecipe {
    name: string;
    icon: string;
    ingredients: Requirement[];
    requires?: Requirement[];
    produces: [string, number, number?][];
    entities?: string[];
    type?: string[];
    duration: number;
    perform: (state: IGameState, source?: Entity) => void;
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
    icon: string;
    ttl?: number;
    temperature?: number;
    tick?: (state: IGameState, source: Entity) => void;
    performs?: IEntityPerform[];
}

export class Entity implements IEntity {
    name: string;
    icon: string;
    ttl: number;
    temperature: number;
    tick: (state: IGameState, source: Entity) => void;
    performs: IEntityPerform[];

    constructor({ name, icon, ttl, temperature, tick, performs }: IEntity) {
        this.name = name;
        this.icon = icon || "🏠";
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
    icon: string;
}

export class Item implements IItem {
    id: number;
    name: string;
    durability: number;
    maxDurability: number;

    icon: string = "📦";

    constructor({ icon, name, durability, maxDurability }: IItem) {
        this.id = GetNextId();
        this.icon = icon || this.icon;
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

    performingActions: ActionDuration[];
    actionPreference: Action[];

    constructor({ name, inventory }: IKin) {
        this.id = GetNextId();
        this.name = name;
        this.inventory = inventory || [];
        this.performingActions = [];
        this.actionPreference = [];
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
                state.updates += 1;
            }
        }
        if (this.actionPreference.length > 0) {
            for (let action of this.actionPreference) {
                if (!this.performingActions.some((a) => a.action.name == action.name)) {
                    if (EvaluateRequirements(state, action.requires)) {
                        this.performingActions.push(new ActionDuration(action));
                        state.updates += 1;
                    }
                }
            }
        }

        this.performingActions.forEach((a) => {
            a.remaining -= 1 / state.tickRate;
            if (a.remaining <= 0) {
                a.action.perform(state, null, this);
                state.updates += 1;
                this.performingActions.splice(this.performingActions.indexOf(a), 1);
            }
        });

        this.inventory = this.inventory.filter((item) => item.maxDurability > 0 || item.durability < 1);
    }

    giveActionPreference(action: Action) {
        this.actionPreference = [action];
    }

    removeActionPreference(action: Action) {
        this.actionPreference = this.actionPreference.filter((a) => a.name != action.name);
    }
}

export interface IActionDuration {
    action: IAction;
    remaining: number;
    entity?: Entity;
}

export interface IGameState {
    inventory: Item[];
    entities: Entity[];
    kins: Kin[];
    rites: Rite[];
    milestones: Milestone[];
    ticks: number;
    tickRate: number;
    updates: number;

    performingActions: IActionDuration[];
}

export class Milestone {
    name: string;
    help: string;
    requirements?: Requirement[];
    constructor(name: string, help: string, requirements?: Requirement[]) {
        this.name = name;
        this.help = help;
        this.requirements = requirements;
    }
}

export class Message {
    icon: string;
    text: string;
    content: string;
    constructor(icon: string, text: string, content: string) {
        this.icon = icon;
        this.text = text;
        this.content = content;
    }
}
