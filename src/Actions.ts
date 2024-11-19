import { Action, Entity, IAction, IGameState, Item, ItemRequirement, Kin, Requirement, Rite } from "./BaseClasses";
import { EntityDefinitions, LanguageRite, RiteDefinitions } from "./Eras/One";
import { MilestoneDefinitions } from "./Eras/MilestoneDefinitions";
import { Change, Compare, ParseOperatorValue, RemoveItem } from "./Functions";
import { GetRandom } from "./utils/Random";
import { GetNextId } from "./utils/Data";
import { Recipe } from "./Recipe";
import { ItemDefinitions } from "./Eras/ItemDefinitions";

interface ActionDefinition {
    name: string;
    icon: string;
    comment?: string;
    perform: [string, ...(string | number)[]][];
    requires?: [string, string, number | string, ...[string, string, number]][];
    duration?: number;
    allowedEntities?: string[];
    milestones?: string[];
    type?: string[];
}

const actionDefinitions = [
    {
        name: "Collect Stone",
        icon: "🪨",
        perform: [["addToInventory", "Stone", 1]],
        duration: 2,
        allowedEntities: ["*", "Kin"],
    },
    {
        name: "Collect Wood",
        icon: "🪵",
        perform: [["addToInventory", "Wood", 1]],
        duration: 2,
        allowedEntities: ["*", "Kin"],
    },
    {
        name: "Make Fire",
        icon: "🔥",
        perform: [
            ["removeFromInventory", "Wood", 2],
            ["createEntity", "Fire"],
        ],
        requires: [["item", "Wood", 2]],
        duration: 5,
    },
    {
        name: "Make Tool",
        icon: "🛠️",
        perform: [
            ["removeFromInventory", "Stone", 1],
            ["addToInventory", "Tool", 1, 10],
            ["chance", 6, "awardMilestone", "Hafting"],
        ],
        requires: [["item", "Stone", 1]],
        duration: 8,
    },
    {
        name: "Feed Fire",
        icon: "🪵🔥",
        perform: [
            ["removeFromInventory", "Wood", 1],
            ["forEntity", "Fire", "temperature", "<", 200, "changeEntityProperty", "temperature", "+", 10],
        ],
        duration: 1,
        allowedEntities: ["Fire", "Kin"],
        requires: [
            ["item", "Wood", 1],
            ["entity", "Fire", 1, ["temperature", "<", 220]],
        ],
    },
    {
        name: "Emberstone",
        icon: "🔥🪨🔥",
        perform: [
            ["removeFromInventory", "Heated Stone", 2],
            ["createEntity", "Emberstone"],
        ],
        requires: [
            ["item", "Heated Stone", 2],
            ["entity", "*", 1, ["temperature", ">", 200]],
            ["timeName", "Midnight", "="],
        ],
        milestones: ["Emberstone"],
        type: ["Ritual"],
    },
    {
        name: "Heat Stone",
        icon: "🔥🪨",
        perform: [
            ["removeFromInventory", "Stone", 1],
            ["forEntity", "*", "temperature", ">=", 150, "changeEntityProperty", "temperature", "-", 10],
            ["addToInventory", "Heated Stone", 1],
        ],
        requires: [
            ["item", "Stone", 1],
            ["entity", "*", 1, ["temperature", ">=", 150]],
        ],
        allowedEntities: ["Fire", "Emberstone"],
    },
    {
        name: "Language",
        icon: "🔤",
        perform: [["startRite", "Language"]],
        requires: [
            ["kin", "Kin", 5],
            ["rite", "Language", "<1"],
        ],
        milestones: ["Language"],
        type: ["Rite"],
    },
    {
        name: "Wood Shaft",
        icon: "🪵🪵",
        perform: [
            ["removeFromInventory", "Wood", 1],
            ["forItem", "Tool", "durability", ">=", 1, "changeItemProperty", "durability", "-", 1],
            ["addToInventory", "Wooden Shaft", 1],
        ],
        requires: [
            ["item", "Wood", 1],
            ["item", "Tool", 1, ["durability", ">=", 1]],
        ],
        milestones: ["Hafting"],
        allowedEntities: ["*", "Kin"],
    },
] as ActionDefinition[];

interface IActionFunction {
    (state: IGameState, source: Entity | null, kin: Kin | null, ...params): void;
}

interface IActionFunctions {
    [key: string]: IActionFunction;
}

const EntityFunctions = {
    changeEntityProperty: function (state: IGameState, source: Entity, kin: Kin, property: string, changeOperator: string, value: number) {
        if (source) {
            source[property] = Change(source[property], value, changeOperator);
        }
    },
};

const ItemFunctions = {
    changeItemProperty: (item: Item, property: string, changeOperator: string, value: number) => {
        item[property] = Change(item[property], value, changeOperator);
    },
};

const NestedActionFunctionValidations = {
    forItem: Object.keys(ItemFunctions),
    forEntity: Object.keys(EntityFunctions),
};

export const ActionFunctions = {
    addToInventory: (state: IGameState, source: Entity | null, kin: Kin, item: string, qty: number, durability: number) => {
        state.inventory.push(...new Array(qty).fill(ItemDefinitions[item].create(durability)));
    },
    removeFromInventory: (state: IGameState, source: Entity, kin: Kin, item: string, qty: number) => {
        RemoveItem(state.inventory, item, qty);
    },
    createEntity: (state: IGameState, source: Entity, kin: Kin, entity: string) => {
        state.entities.push(EntityDefinitions[entity].create());
    },
    chance: function (state: IGameState, source: Entity, kin: Kin, chance: number, actionFunction: string, ...params) {
        let random = GetRandom(this.id, 1 / chance);
        if (random.next()) {
            ActionFunctions[actionFunction](state, source, kin, ...params);
        }
    },
    awardMilestone: function (state: IGameState, source: Entity, kin: Kin, milestone: string) {
        state.milestones.push(MilestoneDefinitions[milestone]);
    },
    forEntity: function (state: IGameState, source: Entity, kin: Kin, entity: string, property: string, operator: string, value: number, actionFunction: string, ...params) {
        if (!source) {
            let entitySource = state.entities.sort((a, b) => a[property] - b[property]).find((e) => (entity != "*" ? e.name === entity : true) && Compare(e[property], value, operator));
            if (entitySource) {
                source = entitySource;
            } else {
                return;
            }
        }
        EntityFunctions[actionFunction](state, source, kin, ...params);
    },
    forItem: function (state: IGameState, source: Entity, kin: Kin, item: string, property: string, operator: string, value: number, actionFunction: string, ...params) {
        if (kin) {
            let forItem = kin.inventory.find((e) => (item != "*" ? e.name === item : true) && Compare(e[property], value, operator));
            ItemFunctions[actionFunction](forItem, ...params);
        } else {
            let forItem = state.inventory.find((e) => (item != "*" ? e.name === item : true) && Compare(e[property], value, operator));
            ItemFunctions[actionFunction](forItem, ...params);
        }
    },
    startRite: (state: IGameState, source: Entity, kin: Kin, rite: string) => {
        state.rites.push(RiteDefinitions[rite].create());
    },
} as IActionFunctions;

const ValidateActionFunction = (definition: ActionDefinition) => {
    if (definition.perform.length > 0 && definition.perform.every((x) => x.length > 0)) {
        definition.perform.forEach(([actionFunction, ...params]) => {
            if (NestedActionFunctionValidations[actionFunction]) {
                NestedActionFunctionValidations[actionFunction].forEach((validation) => {
                    if (!params.includes(validation)) {
                        throw new Error(`Action Function ${actionFunction} requires ${validation}`);
                    }
                });
            }
        });
    }
};

const CreateAction = (definition: ActionDefinition) => {
    ValidateActionFunction(definition);
    return new Action({
        name: definition.name,
        icon: definition.icon,
        perform: function (state: IGameState, source: Entity | null, kin: Kin | null) {
            definition.perform.forEach(([action, ...rest]) => {
                ActionFunctions[action](state, source, kin, ...rest);
            });
        },
        requires: definition.requires?.map(([type, name, value, ...subRequires]) => {
            let { operator, value: v } = ParseOperatorValue(value);

            return new Requirement({
                type,
                name,
                value: v,
                operator,
                requires: subRequires?.map((x) => {
                    let [type, operator, value] = [x[0], x[1], x[2]];
                    return new Requirement({ type, operator, value });
                }),
            });
        }),
        duration: definition.duration,
        allowedEntities: definition.allowedEntities,
        milestones: (state: IGameState) => {
            if (definition.milestones) {
                return definition.milestones?.every((m) => state.milestones.includes(MilestoneDefinitions[m]));
            }
            return true;
        },
        type: definition.type,
    });
};

export const actions = actionDefinitions.map(CreateAction);
