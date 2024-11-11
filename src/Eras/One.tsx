import { Item, Rite } from "../Classes";
import { DayNightColors, GetLinearGradient } from "../utils/Theme";

export class Stone extends Item {
    icon: string = "🪨";

    constructor() {
        super({ name: "Stone", durability: -1 } as Item);
    }
}

export class Wood extends Item {
    icon: string = "🪵";

    constructor() {
        super({ name: "Wood", durability: -1 } as Item);
    }
}

export class Tool extends Item {
    icon: string = "🛠️";

    constructor(durability: number) {
        super({ name: "Tool", durability: durability } as Item);
    }
}

export class HeatedStone extends Item {
    icon: string = "🔥🪨";

    constructor() {
        super({ name: "Heated Stone", durability: -1 } as Item);
    }
}

export class LanguageRite extends Rite {
    icon: string = "🔤";
    constructor() {
        super({ name: "Language", ingredients: [["Tool", 10]] });
    }
}

export const ItemDefinitions = {
    Stone: {
        icon: "🪨",
        class: Stone,
    },
    Wood: {
        icon: "🪵",
        class: Wood,
    },
    Tool: {
        icon: "🛠️",
        class: Tool,
    },
    "Heated Stone": {
        icon: "🔥🪨",
        class: HeatedStone,
    },
    "Language Rite": {
        icon: "🔤",
        class: LanguageRite,
    },
};

export class Milestone {
    name: string;
    constructor(name: string) {
        this.name = name;
    }
}

export const MilestoneDefinitions = {
    Emberstone: new Milestone("Emberstone"),
    Hafting: new Milestone("Hafting"),
    Language: new Milestone("Language"),
};

export const TimeDefinitions = {
    Dawn: [5, 6],
    Day: [7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17],
    Dusk: [18, 19],
    Midnight: [22, 23],
    Night: [20, 21, 22, 23, 0, 1, 2, 3, 4],
    GetTimeColor(time: number) {
        return DayNightColors[time];
    },
    GetTimeGradient(name: string) {
        return GetLinearGradient(TimeDefinitions[name].map((time) => DayNightColors[time]));
    },
};
