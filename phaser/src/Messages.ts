import { Milestone } from "./BaseClasses";

export const MilestoneMessage = (milestone: Milestone) => {
    return {
        icon: "⭐",
        text: milestone.name,
        content: milestone.help,
    };
};
