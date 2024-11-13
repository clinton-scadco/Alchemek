import { Entity, IGameState, Item, Kin, Requirement, Rite } from "./BaseClasses";
import { TimeDefinitions } from "./Eras/TimeDefinitions";

const Compare = (a, b, operator) => {
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

const MeetsRequirement = (requirement: Requirement, source: Item | Entity | Kin | Rite, state: IGameState) => {
    let met = true;

    if (requirement.name) {
        met = met && source.name === requirement.name;
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
            met = met && Compare(TimeDefinitions.GetTimeName(state.ticks), requirement.value, requirement.operator);
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
