import { Item } from "../BaseClasses";
import { TasksRite } from "./One";

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
    "Wooden Shaft": {
        icon: "🪵🪵",
        create: () => new Item({ icon: "🪵🪵", name: "Wooden Shaft", durability: -1 } as Item),
    },
    "Tasks": {
        icon: "🔤",
        class: TasksRite,
    },
};
