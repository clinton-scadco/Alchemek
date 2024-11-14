import { Milestone, Requirement } from "../BaseClasses";

export const MilestoneDefinitions = {
    Emberstone: new Milestone("Emberstone", "A small, glowing emberstone. It seems to keep a very high temperature.", [
        new Requirement({ type: "entity", value: 1, name: "Fire", requires: [new Requirement({ type: "temperature", value: 200, operator: ">" })] }),
    ]),
    Hafting: new Milestone("Hafting", "We can make better tools by attaching a handle."),
    Language: new Milestone("Language", "The ability to talk, it can only get better from here... Right?", [new Requirement({ type: "kin", value: 5, name: "Kin", operator: ">=" })]),
};
