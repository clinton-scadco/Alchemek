export interface IAction {
    name: string;
    perform?: (inventory: any, entities: Entity[], source: Entity) => void;
    initialize?: (inventory: any) => void;
    condition?: (inventory: any, entities: Entity[]) => boolean;
    milestones?: (inventory: any, entities: Entity[], milestones: string[]) => boolean;
    source?: string[];
    type?: string[];
}

export class Action implements IAction {
    name: string;
    perform: (inventory: any, entities: Entity[], source: Entity) => void;
    initialize: (inventory: any) => void;
    condition: (inventory: any, entities: Entity[]) => boolean;
    milestones: (inventory: any, entities: Entity[], milestones: string[]) => boolean;
    source?: string[];
    type?: string[];

    constructor({ name, perform, initialize, condition, milestones, source, type }: IAction) {
        this.name = name;
        this.perform = perform || (() => {});
        this.initialize = initialize || (() => {});
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
    tick?: () => void;
}

export class Entity implements IEntity {
    name: string;
    ttl: number;
    temperature: number;
    tick: () => void;

    constructor({ name, ttl, temperature, tick }: IEntity) {
        this.name = name;
        this.ttl = ttl || -1;
        this.temperature = temperature || 0;
        this.tick = tick || (() => {});
    }
}
