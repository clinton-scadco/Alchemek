import { Item } from "../BaseClasses";
import { LanguageRite } from "./One";

export const ItemDefinitions = {
    Stone: {
        icon: "🪨",
        create: () => new Item({ icon: "🪨", name: "Stone", durability: -1 } as Item),
    },
    Wood: {
        icon: "🪵",
        create: () => new Item({ icon: "🪵", name: "Wood", durability: -1 } as Item),
    },
    Tool: {
        icon: "🛠️",
        create: (durability: number) => new Item({ icon: "🛠️", name: "Tool", durability } as Item),
    },
    "Heated Stone": {
        icon: "🔥🪨",
        create: () => new Item({ icon: "🔥🪨", name: "Heated Stone", durability: -1 } as Item),
    },
    "Language Rite": {
        icon: "🔤",
        class: LanguageRite,
    },
};
