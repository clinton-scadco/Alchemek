import { AnimatePresence, motion } from "framer-motion";
import { Grid, Stack, Box, Meter, Text } from "grommet";
import { Item } from "./BaseClasses";
import React from "react";

const Inventory = ({ inventory, compact }: { inventory: Item[]; compact?: boolean }) => {
    return (
        <Grid columns={{ size: "auto", count: 5 }} gap={"small"}>
            <AnimatePresence>
                {inventory.map((item, i) => (
                    <motion.div
                        layout
                        layoutId={item.id.toString()}
                        key={item.id}
                        initial={{ opacity: 0, scale: 0 }}
                        exit={{ opacity: [1, 1, 1, 1, 0], scale: [1, 1, 1, 1, 0], rotate: [3, 0, -3, 3, -3] }}
                        animate={{ opacity: 1, scale: [0, 0.8, 1.1, 1] }}
                        transition={{ ease: "easeIn", duration: 0.3 }}
                    >
                        <Stack anchor="bottom" fill>
                            <Box border={!compact} align="center" width={"50px"} height={compact ? "30px" : "50px"}>
                                <Text>{item.icon}</Text>
                                {!compact && (
                                    <>
                                        <Text>{item.name}</Text>
                                        {/* {item.durability != -1 && <Text>({(item.durability / item.maxDurability) * 100}%)</Text>} */}
                                    </>
                                )}
                            </Box>
                            <Box fill="horizontal" height={"5px"} width={"50px"}>
                                {item.durability != -1 && <Meter value={item.durability} max={item.maxDurability}></Meter>}
                            </Box>
                        </Stack>
                    </motion.div>
                ))}
            </AnimatePresence>
        </Grid>
    );
};

export default Inventory;
