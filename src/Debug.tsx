import { Box, Button } from "grommet";
import React from "react";
import { MilestoneDefinitions } from "./Eras/MilestoneDefinitions";
import { GameState } from "./GameState";
import { Kin } from "./BaseClasses";
import { EntityDefinitions } from "./Eras/One";
import { ItemDefinitions } from "./Eras/ItemDefinitions";

const Debug = ({ perform }) => {
    return (
        <Box direction="row" gap="small">
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
                label={"Tool"}
                onClick={() =>
                    perform({
                        perform: (gameState: GameState) => {
                            gameState.inventory.push(ItemDefinitions.Tool.create(10));
                        },
                    })
                }
            />
        </Box>
    );
};

export default Debug;
