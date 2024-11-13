import { Action, Entity, IAction, IGameState, Item, ItemRequirement, Kin, Requirement, Rite } from "./BaseClasses";
import { EntityDefinitions, LanguageRite } from "./Eras/One";
import { MilestoneDefinitions } from "./Eras/MilestoneDefinitions";
import { RemoveItem } from "./Functions";
import { GetRandom } from "./utils/Random";
import { GetNextId } from "./utils/Data";
import { Recipe } from "./Recipe";
import { ItemDefinitions } from "./Eras/ItemDefinitions";

export const actions = [
    new Action({
        name: "Collect Stone",
        icon: "🪨",
        perform: ({ inventory }) => inventory.push(ItemDefinitions.Stone.create()),
        duration: 2,
        entities: ["*", "Kin"],
    }),
    new Action({
        name: "Collect Wood",
        icon: "🪵",
        perform: ({ inventory }) => inventory.push(ItemDefinitions.Wood.create()),
        duration: 2,
        entities: ["*", "Kin"],
    }),
    new Action({
        name: "Make Fire",
        icon: "🔥",
        perform: ({ inventory, entities, kins, rites, ticks }, source) => {
            RemoveItem(inventory, "Wood", 2);
            entities.push(EntityDefinitions.Fire.create(ticks));
        },
        requires: [ItemRequirement(["Wood", 2])],
        duration: 5,
    }),
    new Recipe({
        name: "Make Tool",
        icon: "🛠️",
        ingredients: [ItemRequirement(["Stone", 1])],
        produces: [["Tool", 1, 10]],
        perform: function ({ inventory, milestones }, source) {
            let random = GetRandom(this.id, 1 / 6);
            if (random.next()) {
                if (!milestones.some((m) => m.name == "Hafting")) {
                    milestones.push(MilestoneDefinitions.Hafting);
                }
            }
        },
        duration: 8,
    }),
    new Action({
        name: "Feed Fire",
        icon: "🪵🔥",
        perform: ({ inventory, entities }, source) => {
            if (!source) {
                source = entities.sort((a, b) => a.temperature - b.temperature).find((entity) => entity.name === "Fire");
                if (!source) {
                    return;
                }
            }
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
        duration: 1,
        entities: ["Fire", "Kin"],
        requires: [ItemRequirement(["Wood", 1]), new Requirement({ type: "entity", name: "Fire", value: 1, requires: [new Requirement({ type: "temperature", value: 220, operator: "<" })] })],
    }),
    new Action({
        name: "Emberstone",
        icon: "🔥🪨🔥",
        perform: ({ inventory, entities }) => {
            RemoveItem(inventory, "Heated Stone", 2);
            entities.push(EntityDefinitions.Emberstone.create());
        },
        requires: [ItemRequirement(["Heated Stone", 2]), new Requirement({ type: "entity", name: "Fire", value: 1, requires: [new Requirement({ type: "temperature", value: 200, operator: ">" })] }), new Requirement({type:"timeName", value: "Midnight", operator: "="})],
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
        icon: "🔥🪨",
        perform: ({ inventory, entities, kins, rites }, source) => {
            RemoveItem(inventory, "Stone", 1);
            let fire = source;
            if (fire && fire.name == "Fire") {
                fire.temperature -= 10;
            }
            inventory.push(ItemDefinitions["Heated Stone"].create());
        },
        entities: ["Fire", "Emberstone"],
        requires: [ItemRequirement(["Stone", 1]), new Requirement({ type: "entity", name: "Fire", value: 1, requires: [new Requirement({ type: "temperature", value: 150, operator: ">=" })] })],
    }),
    new Action({
        name: "Language",
        icon: "🔤",
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
