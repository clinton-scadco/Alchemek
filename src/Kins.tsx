import { AnimatePresence, motion } from "framer-motion";
import { Box, Stack, Button, Text } from "grommet";
import ActionButton from "./ActionButton";
import { actions } from "./Actions";
import { Entity, Item, Milestone, Kin, Rite } from "./BaseClasses";
import { EvaluateRequirements } from "./Functions";
import { GameState } from "./GameState";
import Inventory from "./Inventory";
import React from "react";

const Kins = ({ inventory, entities, kins, rites, milestones, ticks }: { entities: Entity[]; inventory: Item[]; milestones: Milestone[]; kins: Kin[]; rites: Rite[]; ticks: number }) => {
    return (
        <AnimatePresence>
            <Box gap={"small"}>
                {kins.map((kin, i) => (
                    <motion.div
                        layout
                        layoutId={kin.id.toString()}
                        key={kin.id}
                        initial={{ opacity: 0, scale: 0 }}
                        exit={{ opacity: [1, 1, 1, 1, 0], scale: [1, 1, 1, 1, 0], rotate: [3, 0, -3, 3, -3] }}
                        animate={{ opacity: 1, scale: [0, 0.8, 1.1, 1] }}
                        transition={{ ease: "easeIn", duration: 0.3 }}
                    >
                        <Stack anchor="bottom" fill>
                            <Box direction="row" border pad={"small"} width={"350px"}>
                                <Box align="center" height={"50px"}>
                                    <Text>{kin.icon}</Text>
                                    <Text>{kin.name}</Text>
                                </Box>
                                <Box width={"300px"} gap={"xsmall"}>
                                    <Inventory inventory={kin.inventory} compact={true}></Inventory>

                                    {rites.some((rite) => rite.name == "Language" && rite.isComplete()) &&
                                        actions
                                            .filter((action) => action.allowedEntities?.includes(kin.name))
                                            .filter((action) => action.milestones({ inventory, entities, kins, rites, milestones, ticks } as GameState))
                                            .map((action) => (
                                                <Box key={action.name} direction="row" gap={"xsmall"}>
                                                    <ActionButton
                                                        performingActions={kin.performingActions}
                                                        primary={kin.actionPreference.find((a) => a.name == action.name) != undefined}
                                                        action={action}
                                                        performAction={() => kin.giveActionPreference(action)}
                                                        disabled={!EvaluateRequirements({ inventory, entities, kins, rites, milestones, ticks } as GameState, action.requires)}
                                                    ></ActionButton>
                                                    <Button
                                                        style={{ padding: 0 }}
                                                        icon={<Text>{kin.actionPreference.some((a) => a.name == action.name) ? "✔️" : "🗙"}</Text>}
                                                        onClick={() => kin.removeActionPreference(action)}
                                                    ></Button>
                                                </Box>
                                            ))}
                                </Box>
                            </Box>
                        </Stack>
                    </motion.div>
                ))}
            </Box>
        </AnimatePresence>
    );
};

export default Kins;