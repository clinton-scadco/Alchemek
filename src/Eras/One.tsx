import { Entity, Kin, Rite } from "../BaseClasses";

export class LanguageRite extends Rite {
    icon: string = "🔤";
    constructor() {
        super({ name: "Language", ingredients: [["Tool", 10]] });
    }
}

export const EntityDefinitions = {
    Fire: {
        create: (ticks: number) =>
            new Entity({
                name: "Fire",
                ttl: 60,
                temperature: 100,
                tick: ({ tickRate }, source) => {
                    if (source.temperature <= 100) {
                        source.ttl -= 1 / tickRate;
                    } else {
                        source.ttl = 60;
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
            }),
    },
    Emberstone: {
        create: () =>
            new Entity({
                name: "Emberstone",
                temperature: 200,
            }),
    },
};
