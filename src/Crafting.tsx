import { AnimatePresence, m, motion } from "framer-motion";
import { Grid, Stack, Box, Meter, Text, Menu, Button } from "grommet";
import { IGameState, Item } from "./BaseClasses";
import React, { useEffect } from "react";
import { ItemDefinitions } from "./Eras/ItemDefinitions";
import { Schematic, Schematics } from "./Eras/CraftingDefinitions";
import { GameState } from "./GameState";
import ActionButton from "./ActionButton";
import { GetNextId } from "./utils/Data";

//crafting grid areas 5x5
const gridAreas = [
    ["a", "b", "c", "d", "e"],
    ["f", "g", "h", "i", "j"],
    ["k", "l", "m", "n", "o"],
    ["p", "q", "r", "s", "t"],
    ["u", "v", "w", "x", "y"],
];

const columns = ["auto", "auto", "auto", "auto", "auto"];
const rows = ["auto", "auto", "auto", "auto", "auto"];

const slots = gridAreas.flat();

const slotToPosition = (slot: string) => {
    return { x: slots.indexOf(slot) % 5, y: Math.floor(slots.indexOf(slot) / 5) };
};

function evaluateSchematics(schematics: Schematic[], items: { [slot: string]: Item }, gridWidth: number, gridHeight: number) {
    const outputs: { item: string; quantity: number }[] = [];
    const inputs: Item[] = [];

    for (const schematic of schematics) {
        // Check all possible starting positions
        for (let startX = 0; startX < gridWidth; startX++) {
            for (let startY = 0; startY < gridHeight; startY++) {
                const matchedInputs: Item[] = [];

                // Check if this schematic matches the grid at (startX, startY)
                const isMatch = schematic.input.every((inputItem) => {
                    const absoluteX = startX + inputItem.x;
                    const absoluteY = startY + inputItem.y;

                    // Ensure the position is within bounds
                    if (absoluteX < 0 || absoluteX >= gridWidth || absoluteY < 0 || absoluteY >= gridHeight) {
                        return false;
                    }

                    const playerPlacements = Object.entries(items).map(([slot, item]) => {
                        return { ...slotToPosition(slot), item };
                    });

                    // Find a matching placement
                    const matchingPlacement = playerPlacements.find((placement) => placement.x === absoluteX && placement.y === absoluteY && placement.item.name === inputItem.item);

                    if (matchingPlacement) {
                        matchedInputs.push(matchingPlacement.item);
                        return true;
                    }

                    return false;
                });

                if (isMatch) {
                    // Add the outputs and inputs for this schematic
                    outputs.push(...schematic.outputs);
                    inputs.push(...matchedInputs);
                }
            }
        }
    }

    return { outputs, inputs };
}

const Crafting = ({ inventory, gameState }: { inventory: Item[]; gameState: GameState }) => {
    const [items, setItems] = React.useState({} as { [key: string]: Item });
    const [usedItems, setUsedItems] = React.useState([] as Item[]);
    const [matchedItems, setMatchedItems] = React.useState([] as { item: string; quantity: number }[]);

    const [craftActionId, setCraftActionId] = React.useState(GetNextId());

    const selectItem = (slot: string, item: Item) => {
        if (!gameState.performingActions.some((performingAction) => performingAction.action.id === craftActionId)) {
            setItems((prev) => {
                return { ...prev, [slot]: item };
            });
        }
    };

    const clearItem = (slot: string) => {
        if (!gameState.performingActions.some((performingAction) => performingAction.action.id === craftActionId)) {
            setItems((prev) => {
                const newItems = { ...prev };
                delete newItems[slot];
                return newItems;
            });
        }
    };

    useEffect(() => {
        let result = evaluateSchematics(Schematics, items, 5, 5);
        setMatchedItems(result.outputs);
        setUsedItems(result.inputs);
    }, [items]);

    React.useEffect(() => {
        const listener = (newState: GameState) => {
            let newItems = { ...items };
            for (let slot in items) {
                let item = newState.inventory.find((i) => i.name === items[slot].name);
                if (!item) {
                    delete newItems[slot];
                }
            }
            setItems(newItems);
        };

        gameState.subscribe(listener);

        // Cleanup on unmount
        return () => {
            gameState.unsubscribe(listener);
        };
    }, [items]);

    return (
        <Box>
            <Grid columns={columns} rows={rows} gap={"small"} areas={gridAreas}>
                <AnimatePresence>
                    {slots.map((slot) => (
                        <Box
                            gridArea={slot}
                            key={slot}
                            width={"60px"}
                            height={"60px"}
                            align={"center"}
                            justify={"center"}
                            border={{ size: "2px", color: usedItems.includes(items[slot]) ? "status-ok" : !items[slot] ? "background-back" : "text" }}
                        >
                            {items[slot] && (
                                <motion.div
                                    layout
                                    layoutId={slot}
                                    initial={{ opacity: 0, scale: 0 }}
                                    exit={{ opacity: [1, 1, 1, 1, 0], scale: [1, 1, 1, 1, 0], rotate: [3, 0, -3, 3, -3] }}
                                    animate={{ opacity: 1, scale: [0, 0.8, 1.1, 1] }}
                                    transition={{ ease: "easeIn", duration: 0.3 }}
                                    onClick={() => {
                                        clearItem(slot);
                                    }}
                                >
                                    <Text>{items[slot].name}</Text>
                                </motion.div>
                            )}
                            {!items[slot] && (
                                <Box fill onClick={() => {}} hoverIndicator={"background-front"}>
                                    <Menu
                                        disabled={gameState.performingActions.some((performingAction) => performingAction.action.id === craftActionId)}
                                        fill
                                        icon={false}
                                        label=""
                                        items={inventory
                                            .filter((i) => Object.values(items).indexOf(i) === -1)
                                            .map((i) => ({
                                                label: i.name,
                                                onClick: () => {
                                                    selectItem(slot, i);
                                                },
                                            }))}
                                    />
                                </Box>
                            )}
                        </Box>
                    ))}
                </AnimatePresence>
            </Grid>
            {matchedItems.map((matchedItem, i) => (
                <Text key={i}>
                    {matchedItem.quantity}x {matchedItem.item}
                </Text>
            ))}
            {matchedItems.length > 0 && (
                <ActionButton
                    action={{
                        id: craftActionId,
                        duration: matchedItems.length * 2,
                        name: "Craft",
                        requires: [],
                        perform: (gameState: IGameState, entity, target) => {
                            matchedItems.forEach((matchedItem) => {
                                gameState.inventory.push(ItemDefinitions[matchedItem.item].create(matchedItem.quantity));
                            });
                            gameState.inventory = gameState.inventory.filter((i) => !usedItems.includes(i));
                        },
                        icon: "🔨",
                        milestones: (gameState: IGameState) => true,
                    }}
                    performingActions={gameState.performingActions}
                    performAction={gameState.performAction}
                    disabled={false}
                ></ActionButton>
            )}
        </Box>
    );
};

export default Crafting;
