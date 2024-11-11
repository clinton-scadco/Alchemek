import { Requirement, IGameState, Entity, IRecipe, Action } from "./BaseClasses";
import { ItemDefinitions } from "./Eras/ItemDefinitions";
import { RemoveItem } from "./Functions";
import { GetNextId } from "./utils/Data";

export class Recipe extends Action {
    id: number;
    name: string;
    ingredients: Requirement[];
    requires: Requirement[];
    produces: [string, number, number?][];
    entities?: string[];
    type?: string[];
    duration: number;
    perform: (state: IGameState, source?: Entity) => void;

    constructor({ name, ingredients, requires, produces, entities, type, duration, perform }: IRecipe) {
        super({ name, requires, entities, type, duration });
        this.id = GetNextId();
        this.name = name;
        this.ingredients = ingredients || [];
        this.requires = (requires || []).concat(this.ingredients);
        this.produces = produces || [];
        this.entities = entities || [];
        this.type = type || [];
        this.duration = duration || 0;
        this.perform = (state: IGameState, source?: Entity) => {
            perform && perform(state, source);
            RemoveItem(state.inventory, this.ingredients[0].name, this.ingredients[0].value);
            state.inventory.push(
                ...this.produces.flatMap(([item, count, durability]) =>
                    Array(count)
                        .fill(item)
                        .map((i) => ItemDefinitions[item].create(durability))
                )
            );
        };
    }
}
