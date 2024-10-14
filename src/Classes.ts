export interface IAction {
    name: string;
    perform?: (inventory: any, entities: Entity[], source: Entity) => void;
    initialize?: (inventory: any) => void;
    condition?: (inventory: any, entities: Entity[]) => boolean;
    source?: string[];
}

export class Action implements IAction {
    name: string;
    perform: (inventory: any, entities: Entity[], source: Entity) => void;
    initialize: (inventory: any) => void;
    condition: (inventory: any, entities: Entity[]) => boolean;
    source?: string[];

    constructor({ name, perform, initialize, condition, source }: IAction) {
        this.name = name;
        this.perform = perform || (() => {});
        this.initialize = initialize || (() => {});
        this.condition = condition || (() => true);
        this.source = source || [];
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
