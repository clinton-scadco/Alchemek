import { Action, Entity, Item, Kin } from "./Classes";
import { HeatedStone, Stone, Tool, Wood } from "./Eras/One";

function RemoveItem(inventory: Item[], name, count) {
    let removedCount = 0;

    while (removedCount < count) {
        for (let i = 0; i < inventory.length; i++) {
            if (inventory[i].name === name) {
                inventory.splice(i, 1);
                removedCount++;
                break;
            }
        }
    }
}

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

                        if (ticks && ticks % 10 == 0 && this.temperature > 60) {
                            kins.push(new Kin({ name: "Kin" }));
                        }
                    },
                })
            );
        },
        condition: (inventory) => inventory.filter((item) => item.name == "Wood").length >= 2,
    }),
    new Action({
        name: "Make Tool",
        perform: (inventory, entities, source) => {
            RemoveItem(inventory, "Wood", 1);
            RemoveItem(inventory, "Stone", 1);
            inventory.push(new Tool(10));
        },
        condition: (inventory) => inventory.filter((item) => item.name == "Wood").length >= 1 && inventory.filter((item) => item.name == "Stone").length >= 1,
    }),
    new Action({
        name: "Feed Fire",
        perform: (inventory, entities, kins, source) => {
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
        condition: (inventory, entities) => {
            return inventory.filter((item) => item.name == "Wood").length >= 1 ? !!entities.find((entity) => entity.name === "Fire") : false;
        },
        source: ["Fire"],
    }),
    new Action({
        name: "Emberstone",
        perform: (inventory, entities, source) => {
            RemoveItem(inventory, "Heated Stone", 2);
            entities.push(
                new Entity({
                    name: "Emberstone",
                    temperature: 200,
                })
            );
        },
        condition: (inventory, entities) => {
            return inventory.filter((item) => item.name == "Heated Stone").length >= 2 ? !!entities.find((entity) => entity.name === "Fire" && entity.temperature > 200) : false;
        },
        milestones: (inventory, entities, milestones) => {
            if (!!entities.find((entity) => entity.name === "Fire" && entity.temperature > 200) && !milestones.includes("Emberstone")) {
                milestones.push("Emberstone");
            }
            return milestones.includes("Emberstone");
        },
        type: ["Ritual"],
    }),
    new Action({
        name: "Heat Stone",
        perform: (inventory, entities, kins, source) => {
            RemoveItem(inventory, "Stone", 1);
            let fire = source;
            if (fire && fire.name == "Fire") {
                fire.temperature -= 10;
            }
            inventory.push(new HeatedStone());
        },
        condition: (inventory, entities, source) => {
            return inventory.filter((item) => item.name == "Stone").length >= 1 && !!entities.find((entity) => entity.name === "Fire") && !!source && source.temperature >= 150;
        },
        source: ["Fire", "Emberstone"],
    }),
];
