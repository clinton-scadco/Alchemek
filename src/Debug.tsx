import { Box, Button } from "grommet";
import React from "react";
import { MilestoneDefinitions } from "./Eras/MilestoneDefinitions";
import { GameState } from "./GameState";
import { Kin } from "./BaseClasses";
import { EntityDefinitions } from "./Eras/One";
import { ItemDefinitions } from "./Eras/ItemDefinitions";
import { ActionFunctions } from "./Actions";

const Debug = ({ perform }) => {
    return (
        <Box direction="row" gap="small" wrap>
            {Object.values(MilestoneDefinitions).map((milestone) => {
                return (
                    <Button
                        key={milestone.name}
                        label={milestone.name}
                        onClick={() =>
                            perform({
                                perform: (gameState) => {
                                    gameState.milestones.push(milestone);
                                },
                            })
                        }
                    />
                );
            })}
            {Object.keys(ItemDefinitions).map((item) => {
                return (
                    <Button
                        key={item}
                        label={item}
                        onClick={() =>
                            perform({
                                perform: (gameState) => {
                                    gameState.inventory.push(ItemDefinitions[item].create(1));
                                },
                            })
                        }
                    />
                );
            })}
            <Button
                label={"Tick"}
                onClick={() =>
                    perform({
                        perform: (gameState: GameState) => {
                            gameState.tick();
                        },
                    })
                }
            />
            <Button
                label={"Fire"}
                onClick={() =>
                    perform({
                        perform: (gameState: GameState) => {
                            gameState.entities.push(EntityDefinitions.Fire.create(gameState.ticks));
                        },
                    })
                }
            />
            <Button
                label={"Kin"}
                onClick={() =>
                    perform({
                        perform: (gameState: GameState) => {
                            gameState.kins.push(new Kin({ name: "Kin" }));
                        },
                    })
                }
            />
            <Button
                label={"Emberstone"}
                onClick={() =>
                    perform({
                        perform: (gameState: GameState) => {
                            ActionFunctions.createEntity(gameState, null, "Emberstone");
                        },
                    })
                }
            />
        </Box>
    );
};

export default Debug;
