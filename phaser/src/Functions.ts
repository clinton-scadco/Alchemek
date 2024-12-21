import { Entity, IGameState, Item, Kin, Requirement, Rite } from "./BaseClasses";
import { TimeDefinitions } from "./Eras/TimeDefinitions";

export const Change = (a, b, operator) => {
    switch (operator) {
        case "+":
            return a + b;
        case "-":
            return a - b;
        case "*":
            return a * b;
        case "/":
            return a / b;
        default:
            return a;
    }
};

export const Compare = (a, b, operator) => {
    switch (operator) {
        case ">":
            return a > b;
        case "<":
            return a < b;
        case "=":
            return a === b;
        case ">=":
            return a >= b;
        case "<=":
            return a <= b;
        default:
            return false;
    }
};

export const ParseOperatorValue = (value: string | number) => {
    if (typeof value === "number") {
        return { operator: ">=", value: value };
    }

    const operator = value.match(/[<>=]+/g);
    const val = value.match(/[0-9]+/g);
    if (!operator || !val) {
        return { operator: ">=", value: value };
    }
    return { operator: operator[0], value: val[0] };
};

const MeetsRequirement = (requirement: Requirement, source: Item | Entity | Kin | Rite, state: IGameState) => {
    let met = true;

    if (requirement.name) {
        met = met && (source.name === requirement.name || requirement.name === "*");
    }

    if (requirement.type == "temperature") {
        met = met && Compare(source[requirement.type], requirement.value, requirement.operator);
    }

    if (requirement.requires.length > 0) {
        met = met && requirement.requires.every((r) => MeetsRequirement(r, source, state));
    }

    return met;
};

export const EvaluateRequirements = (state: IGameState, requirements: Requirement[]) => {
    let met = true;
    requirements.forEach((requirement) => {
        if (requirement.type === "item") {
            met = met && Compare(state.inventory.filter((i) => MeetsRequirement(requirement, i, state)).length, requirement.value, requirement.operator);
        }
        if (requirement.type === "entity") {
            met = met && Compare(state.entities.filter((i) => MeetsRequirement(requirement, i, state)).length, requirement.value, requirement.operator);
        }
        if (requirement.type === "kin") {
            met = met && Compare(state.kins.filter((i) => MeetsRequirement(requirement, i, state)).length, requirement.value, requirement.operator);
        }
        if (requirement.type === "rite") {
            met = met && Compare(state.rites.filter((i) => MeetsRequirement(requirement, i, state)).length, requirement.value, requirement.operator);
        }
        if (requirement.type === "timeName") {
            met = met && Compare(TimeDefinitions.GetTimeName(state.ticks), requirement.name, requirement.operator);
        }
        if (requirement.type === "milestone") {
            met = met && state.milestones.filter((i) => i.name === requirement.name).length > 0;
        }
    });
    return met;
};

export function RemoveItem(inventory: Item[], name, count) {
    let removedCount = 0;

    while (removedCount < count && inventory.some((i) => i.name === name)) {
        for (let i = inventory.length - 1; i >= 0; i--) {
            if (inventory[i].name === name) {
                inventory.splice(i, 1);
                removedCount++;
                break;
            }
        }
    }
}
