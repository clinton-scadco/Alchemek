import { Action, Entity, Item, Kin } from "./Classes";
import { HeatedStone, LanguageRite, Stone, Tool, Wood } from "./Eras/One";

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

export const EvaluateRequirements = (inventory: Item[], entities: Entity[], kins: Kin[], requirements: [string, number][], source?: Entity) => {
    let met = true;
    requirements.forEach((requirement) => {
        let [item, count] = requirement;
        met = met && (inventory.filter((i) => i.name == item).length >= count || entities.filter((i) => i.name == item).length >= count || kins.filter((i) => i.name == item).length >= count);
    });
    return met;
};

export const actions = [
    new Action({
        name: "Collect Stone",
        perform: (inventory) => inventory.push(new Stone()),
    }),
    new Action({
        name: "Collect Wood",
        perform: (inventory) => inventory.push(new Wood()),
    }),
    new Action({
        name: "Make Fire",
        perform: (inventory, entities, kins, source) => {
            RemoveItem(inventory, "Wood", 2);
            entities.push(
                new Entity({
                    name: "Fire",
                    ttl: 30,
                    temperature: 100,
                    tick: function (inventory, entities, kins, ticks) {
                        if (this.temperature <= 100) {
                            this.ttl -= 1;
                        } else {
                            this.ttl = 30;
                        }
                        this.temperature -= 2;

                        if (ticks && ticks % 10 == 0 && this.temperature > 60 && kins.length < 5) {
                            kins.push(new Kin({ name: "Kin" }));
                        }
                    },
                })
            );
        },
        requires: [["Wood", 2]],
    }),
    new Action({
        name: "Make Tool",
        perform: (inventory, entities, source) => {
            RemoveItem(inventory, "Wood", 1);
            RemoveItem(inventory, "Stone", 1);
            inventory.push(new Tool(10));
        },
        requires: [
            ["Wood", 1],
            ["Stone", 1],
        ],
    }),
    new Action({
        name: "Feed Fire",
        perform: (inventory, entities, kins, rites, source) => {
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
        requires: [
            ["Wood", 1],
            ["Fire", 1],
        ],
    }),
    new Action({
        name: "Emberstone",
        perform: (inventory, entities) => {
            RemoveItem(inventory, "Heated Stone", 2);
            entities.push(
                new Entity({
                    name: "Emberstone",
                    temperature: 200,
                })
            );
        },
        condition: (inventory, entities) => {
            return !!entities.find((entity) => entity.name === "Fire" && entity.temperature > 200);
        },
        requires: [["Heated Stone", 2]],
        milestones: (inventory, entities, kins, rites, milestones) => {
            if (!!entities.find((entity) => entity.name === "Fire" && entity.temperature > 200) && !milestones.includes("Emberstone")) {
                milestones.push("Emberstone");
            }
            return milestones.includes("Emberstone");
        },
        type: ["Ritual"],
    }),
    new Action({
        name: "Heat Stone",
        perform: (inventory, entities, kins, rites, source) => {
            RemoveItem(inventory, "Stone", 1);
            let fire = source;
            if (fire && fire.name == "Fire") {
                fire.temperature -= 10;
            }
            inventory.push(new HeatedStone());
        },
        condition: (inventory, entities, kins, rites, source) => {
            return !!entities.find((entity) => entity.name === "Fire") && !!source && source.temperature >= 150;
        },
        source: ["Fire", "Emberstone"],
        requires: [["Stone", 1]],
    }),
    new Action({
        name: "Language",
        perform: (inventory, entities, source, rites) => {
            rites.push(new LanguageRite());
        },
        condition: (inventory, entities, kins, rites) => {
            return kins.filter((kin) => kin.name === "Kin").length >= 5 && !rites.find((rite) => rite.name === "Language");
        },
        requires: [["Kin", 5]],
        milestones: (inventory, entities, kins, rites, milestones) => {
            if (kins.filter((kin) => kin.name === "Kin").length >= 5 && !milestones.includes("Language")) {
                milestones.push("Language");
            }
            return milestones.includes("Language");
        },
        type: ["Rite"],
    }),
];
