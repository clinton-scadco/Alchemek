import { Box, Meter, Text } from "grommet";
import React from "react";
import { actions } from "./Actions";
import { Entity, Item, Milestone, Kin, Rite, ActionDuration } from "./BaseClasses";
import { EvaluateRequirements } from "./Functions";
import { GameState } from "./GameState";
import ActionButton from "./ActionButton";

const Entities = ({
    entities,
    performEntityAction,
    inventory,
    milestones,
    kins,
    rites,
    ticks,
    performingActions,
}: {
    entities: Entity[];
    performEntityAction: Function;
    inventory: Item[];
    milestones: Milestone[];
    kins: Kin[];
    rites: Rite[];
    ticks: number;
    performingActions: ActionDuration[];
}) => {
    return (
        <Box height={{ min: "200px" }} fill align="start">
            <Text>Entities</Text>
            <Box gap={"xsmall"}>
                {entities.map((entity, i) => (
                    <Box key={"entity" + entity.name + i} gap="small">
                        <Box>
                            <Box direction="row" gap={"small"}>
                                <Text>{entity.icon}</Text>
                                <Text>{entity.name}</Text>
                                {entity.ttl > 0 && <Text>{entity.ttl.toFixed(0)}s</Text>}
                                {entity.temperature != 0 && <Text>{entity.temperature.toFixed(0)} &#176;C</Text>}
                            </Box>
                            {entity.performs.map((perform) => (
                                <Box key={"entity" + entity.name + i + "perform" + perform.name} direction="row" gap={"xsmall"} align="center">
                                    {perform.ttp > 0 && perform.condition({ inventory, entities, kins, rites, milestones, ticks } as GameState, entity) && (
                                        <>
                                            <Text>{perform.icon}</Text>
                                            <Meter value={ticks - perform.lastTickPerformed} max={perform.ttp} thickness="10px" size="full"></Meter>
                                        </>
                                    )}
                                </Box>
                            ))}
                        </Box>
                        {actions
                            .filter((action) => action.allowedEntities?.includes(entity.name))
                            .filter((action) => action.milestones({ inventory, entities, kins, rites, milestones, ticks } as GameState))
                            .map((action) => (
                                <ActionButton
                                    performingActions={performingActions}
                                    key={action.name}
                                    action={action}
                                    performAction={() => performEntityAction(action, entity)}
                                    disabled={!EvaluateRequirements({ inventory, entities, kins, rites, milestones, ticks } as GameState, action.requires)}
                                ></ActionButton>
                            ))}
                    </Box>
                ))}
            </Box>
        </Box>
    );
};

export default Entities;
