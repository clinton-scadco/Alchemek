import { Item } from "../Classes";
import { GetNextId } from "../utils/Data";

export class Stone extends Item {
    icon: string = "🪨";

    constructor() {
        super({ id: GetNextId(), name: "Stone", durability: -1 } as Item);
    }
}

export class Wood extends Item {
    icon: string = "🪵";

    constructor() {
        super({ id: GetNextId(), name: "Wood", durability: -1 } as Item);
    }
}

export class Tool extends Item {
    icon: string = "🛠️";

    constructor(durability: number) {
        super({ id: GetNextId(), name: "Tool", durability: durability } as Item);
    }
}

export class HeatedStone extends Item {
    icon: string = "🔥🪨";

    constructor() {
        super({ id: GetNextId(), name: "Heated Stone", durability: -1 } as Item);
    }
}
