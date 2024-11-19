import { create } from "lodash";
import { Entity, Kin, Rite } from "../BaseClasses";

export class LanguageRite extends Rite {
    icon: string = "🔤";
    constructor() {
        super({ name: "Language", ingredients: [["Tool", 10]] });
    }
}

export const RiteDefinitions = {
    Language: {
        create: () => new LanguageRite(),
    },
};

export const EntityDefinitions = {
    Fire: {
        create: (ticks: number) =>
            new Entity({
                name: "Fire",
                icon: "🔥",
                temperature: 100,
                tick: ({ tickRate }, source) => {
                    source.temperature -= 2 / tickRate;
                    if (source.temperature <= 0) {
                        source.ttl = 0;
                    }
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
            }),
    },
    Emberstone: {
        create: () =>
            new Entity({
                name: "Emberstone",
                icon: "🔥🪨🔥",
                temperature: 200,
                tick: ({ tickRate }, source) => {
                    if (source.temperature <= 200) {
                        source.temperature += 2 / tickRate;
                    }
                },
            }),
    },
};
