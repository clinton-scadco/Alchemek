import { Action, Entity, IGameState, Item, ItemRequirement, Kin, Requirement, Rite } from "./Classes";
import { HeatedStone, LanguageRite, MilestoneDefinitions, Stone, Tool, Wood } from "./Eras/One";
import { GetRandom } from "./utils/Random";

export function RemoveItem(inventory: Item[], name, count) {
    let removedCount = 0;

    while (removedCount < count) {
        for (let i = inventory.length - 1; i >= 0; i--) {
            if (inventory[i].name === name) {
                inventory.splice(i, 1);
                removedCount++;
                break;
            }
        }
    }
}

const Compare = (a, b, operator) => {
    switch (operator) {
        case ">":
            return a > b;
        case "<":
            return a < b;
        case "=":
            return a === b;
        case ">=":
            return a >= b;
        case "<=":
            return a <= b;
        default:
            return false;
    }
};

const MeetsRequirement = (requirement: Requirement, source: Item | Entity | Kin | Rite) => {
    let met = true;

    if (requirement.name) {
        met = met && source.name === requirement.name;
    }

    if (requirement.type == "temperature") {
        met = met && Compare(source[requirement.type], requirement.value, requirement.operator);
    }

    if (requirement.requires.length > 0) {
        met = met && requirement.requires.every((r) => MeetsRequirement(r, source));
    }

    return met;
};

export const EvaluateRequirements = (state: IGameState, requirements: Requirement[]) => {
    let met = true;
    requirements.forEach((requirement) => {
        if (requirement.type === "item") {
            met = met && Compare(state.inventory.filter((i) => MeetsRequirement(requirement, i)).length, requirement.value, requirement.operator);
        }
        if (requirement.type === "entity") {
            met = met && Compare(state.entities.filter((i) => MeetsRequirement(requirement, i)).length, requirement.value, requirement.operator);
        }
        if (requirement.type === "kin") {
            met = met && Compare(state.kins.filter((i) => MeetsRequirement(requirement, i)).length, requirement.value, requirement.operator);
        }
        if (requirement.type === "rite") {
            met = met && Compare(state.rites.filter((i) => MeetsRequirement(requirement, i)).length, requirement.value, requirement.operator);
        }
    });
    return met;
};

export const actions = [
    new Action({
        name: "Collect Stone",
        perform: ({ inventory }) => inventory.push(new Stone()),
        duration: 2,
    }),
    new Action({
        name: "Collect Wood",
        perform: ({ inventory }) => inventory.push(new Wood()),
        duration: 2,
    }),
    new Action({
        name: "Make Fire",
        perform: ({ inventory, entities, kins, rites, ticks }, source) => {
            RemoveItem(inventory, "Wood", 2);
            entities.push(
                new Entity({
                    name: "Fire",
                    ttl: 60,
                    temperature: 100,
                    tick: ({ tickRate }, source) => {
                        if (source.temperature <= 100) {
                            source.ttl -= 1 / tickRate;
                        } else {
                            source.ttl = 30;
                        }
                        source.temperature -= 2 / tickRate;
                    },
                    performs: [
                        {
                            name: "Gather",
                            icon: "👤",
                            ttp: 10,
                            lastTickPerformed: ticks,
                            condition: ({ kins }, source) => {
                                return source.temperature > 60 && kins.length < 5;
                            },
                            perform: ({ kins }, source) => {
                                kins.push(new Kin({ name: "Kin" }));
                            },
                        },
                    ],
                })
            );
        },
        requires: [ItemRequirement(["Wood", 2])],
        duration: 5,
    }),
    new Action({
        name: "Make Tool",
        perform: function ({ inventory, milestones }, source) {
            let random = GetRandom(this.id, 1 / 6);
            if (random.next()) {
                if (!milestones.some((m) => m.name == "Hafting")) {
                    milestones.push(MilestoneDefinitions.Hafting);
                }
            }
            RemoveItem(inventory, "Stone", 1);

            inventory.push(new Tool(10));
        },
        requires: [ItemRequirement(["Stone", 1])],
        duration: 8,
    }),
    new Action({
        name: "Feed Fire",
        perform: ({ inventory }, source) => {
            RemoveItem(inventory, "Wood", 1);
            let fire = source;
            if (fire) {
                fire.ttl += 5;

                if (fire.ttl > 50) {
                    fire.ttl = 50;
                }

                fire.temperature += 10;
            }
        },
        source: ["Fire"],
        requires: [ItemRequirement(["Wood", 1]), new Requirement({ type: "entity", name: "Fire", value: 1 })],
    }),
    new Action({
        name: "Emberstone",
        perform: ({ inventory, entities }) => {
            RemoveItem(inventory, "Heated Stone", 2);
            entities.push(
                new Entity({
                    name: "Emberstone",
                    temperature: 200,
                })
            );
        },
        requires: [ItemRequirement(["Heated Stone", 2]), new Requirement({ type: "entity", name: "Fire", value: 1, requires: [new Requirement({ type: "temperature", value: 200, operator: ">" })] })],
        milestones: ({ inventory, entities, kins, rites, milestones }) => {
            if (!!entities.find((entity) => entity.name === "Fire" && entity.temperature > 200) && !milestones.includes(MilestoneDefinitions.Emberstone)) {
                milestones.push(MilestoneDefinitions.Emberstone);
            }
            return milestones.includes(MilestoneDefinitions.Emberstone);
        },
        type: ["Ritual"],
    }),
    new Action({
        name: "Heat Stone",
        perform: ({ inventory, entities, kins, rites }, source) => {
            RemoveItem(inventory, "Stone", 1);
            let fire = source;
            if (fire && fire.name == "Fire") {
                fire.temperature -= 10;
            }
            inventory.push(new HeatedStone());
        },
        source: ["Fire", "Emberstone"],
        requires: [ItemRequirement(["Stone", 1]), new Requirement({ type: "entity", name: "Fire", value: 1, requires: [new Requirement({ type: "temperature", value: 150, operator: ">=" })] })],
    }),
    new Action({
        name: "Language",
        perform: ({ rites }) => {
            rites.push(new LanguageRite());
        },
        requires: [new Requirement({ type: "kin", name: "Kin", value: 5, operator: ">=" }), new Requirement({ type: "rite", name: "Language", value: 1, operator: "<" })],
        milestones: ({ inventory, entities, kins, rites, milestones }) => {
            if (kins.filter((kin) => kin.name === "Kin").length >= 5 && !milestones.includes(MilestoneDefinitions.Language)) {
                milestones.push(MilestoneDefinitions.Language);
            }
            return milestones.includes(MilestoneDefinitions.Language);
        },
        type: ["Rite"],
    }),
];
