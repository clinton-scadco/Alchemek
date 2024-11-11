import { Box, Button } from "grommet";
import React from "react";
import { MilestoneDefinitions } from "./Eras/MilestoneDefinitions";
import { GameState } from "./GameState";

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
        </Box>
    );
};

export default Debug;
