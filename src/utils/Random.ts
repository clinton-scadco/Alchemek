const instances = new Map<number, Random>();

class Random {
    chance: number;
    iterations: number;
    constructor(id: number, chance: number) {
        this.chance = chance;
        this.iterations = 0;
    }
    next() {
        let r = Math.random();

        if (r < this.chance) {
            this.iterations = 0;
            return true;
        } else {
            this.iterations++;
        }

        if (this.iterations >= 1 / this.chance) {
            this.iterations = 0;
            return true;
        }
        return false;
    }
}

export const GetRandom = (id: number, change: number): Random => {
    let instance = instances.get(id);
    if (instance) {
        return instance;
    } else {
        const instance = new Random(id, change);
        instances.set(id, instance);
        return instance;
    }
};
