import { Item, Rite } from "../Classes";
import { GetNextId } from "../utils/Data";

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
