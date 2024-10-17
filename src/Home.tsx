import { initialize } from "esbuild";
import { Box, Button, Grid, Heading, Meter, Stack, Text } from "grommet";
import * as React from "react";
import { Action, Entity, Item, Kin, Rite } from "./Classes";
import { groupBy, values } from "lodash";
import _ from "lodash";
import { actions, EvaluateRequirements, RemoveItem } from "./Actions";
import { AnimatePresence, LayoutGroup, motion } from "framer-motion";
import * as Items from "./Eras/One";

const Home = () => {
    const [inventory, setInventory] = React.useState([] as Item[]);
    const [entities, setEntities] = React.useState([] as Entity[]);
    const [milestones, setMilestones] = React.useState([] as string[]);
    const [kins, setKins] = React.useState([] as Kin[]);
    const [rites, setRites] = React.useState([] as Rite[]);

    React.useEffect(() => {}, []);

    const performOffering = (rite: Rite, itemName: string) => {
        RemoveItem(inventory, itemName, 1);
        setInventory([...inventory]);

        rite.offerItem(itemName);
        setRites([...rites]);
    };

    const performAction = (action: Action) => {
        action.perform(inventory, entities, kins, rites);
        setInventory([...inventory]);
        setEntities([...entities]);
        setKins([...kins]);
    };

    const performEntityAction = (action: Action, entity: Entity) => {
        action.perform(inventory, entities, kins, rites, entity);
        setInventory([...inventory]);
        setEntities([...entities]);
        setKins([...kins]);
    };

    React.useEffect(() => {
        let newMilestones = [...milestones];
        actions.forEach((action) => {
            action.milestones(inventory, entities, kins, rites, newMilestones);
        });
        setMilestones(newMilestones);
    }, [inventory, entities]);

    const [ticks, setTicks] = React.useState(0);

    React.useEffect(() => {
        const intervalId = setInterval(() => {
            // Decrease ttl of each entity
            const updatedEntities = entities.map((entity) => {
                entity.tick(inventory, entities, kins, ticks);
                return entity;
            });

            const updatedKins = kins.map((kin) => {
                kin.tick(inventory, entities, kins, ticks);
                return kin;
            });
            setEntities(updatedEntities.filter((entity) => entity.ttl != 0));
            setKins(updatedKins);
            setInventory([...inventory]);
            setTicks((prevTicks) => prevTicks + 1);
        }, 1000);

        // Cleanup function to clear interval on unmount
        return () => clearInterval(intervalId);
    }, [inventory, entities, kins]);

    return (
        <>
            <LayoutGroup>
                <Box style={{ maxHeight: "10px" }}>
                    <Meter value={ticks % 100} max={100}></Meter>
                </Box>
                <Box direction="row" gap="small">
                    <Box height={{ min: "200px" }} width={"320px"} border pad={"small"}>
                        <Heading level={3}>Inventory</Heading>
                        <Inventory inventory={inventory}></Inventory>
                    </Box>
                    <Box height={{ min: "200px" }} width={"320px"}>
                        {kins.length > 0 && <Heading level={3}>Kins</Heading>}
                        <Kins kins={kins}></Kins>
                    </Box>
                </Box>
                <Entities entities={entities} performEntityAction={performEntityAction} inventory={inventory} milestones={milestones} kins={kins} rites={rites}></Entities>
                <Box direction="row" gap="small">
                    <Box gap="small">
                        <Text>Actions</Text>
                        {actions
                            .filter((action) => action.source?.length == 0)
                            .filter((action) => action.type?.length == 0)
                            .filter((action) => action.milestones(inventory, entities, kins, rites, milestones))
                            .map((action) => (
                                <ActionButton
                                    key={action.name}
                                    action={action}
                                    performAction={performAction}
                                    disabled={!(action?.condition(inventory, entities, kins, rites) && EvaluateRequirements(inventory, entities, kins, action.requires))}
                                ></ActionButton>
                            ))}
                    </Box>
                    {milestones.length > 0 && (
                        <Box gap="small">
                            <Text>Rituals</Text>
                            {actions
                                .filter((action) => action.source?.length == 0)
                                .filter((action) => action.type?.includes("Ritual"))
                                .filter((action) => action.milestones(inventory, entities, kins, rites, milestones))
                                .map((action) => (
                                    <ActionButton
                                        key={action.name}
                                        action={action}
                                        performAction={performAction}
                                        disabled={!(action?.condition(inventory, entities, kins, rites) && EvaluateRequirements(inventory, entities, kins, action.requires))}
                                    ></ActionButton>
                                ))}
                        </Box>
                    )}
                    {milestones.length > 0 && (
                        <Box gap="small">
                            <Text>Rites</Text>
                            {actions
                                .filter((action) => action.source?.length == 0)
                                .filter((action) => action.type?.includes("Rite"))
                                .filter((action) => action.milestones(inventory, entities, kins, rites, milestones))
                                .map((action) => (
                                    <ActionButton
                                        key={action.name}
                                        action={action}
                                        performAction={performAction}
                                        disabled={!(action?.condition(inventory, entities, kins, rites) && EvaluateRequirements(inventory, entities, kins, action.requires))}
                                    ></ActionButton>
                                ))}
                        </Box>
                    )}
                    {milestones.length > 0 && (
                        <Box gap="small">
                            <Text>Active Rites</Text>
                            {rites
                                .filter((rite) => !rite.isComplete())
                                .map((rite) => (
                                    <Box key={rite.id}>
                                        <Text>{rite.icon}</Text>
                                        <Text>{rite.name}</Text>
                                        {rite.ingredients.map(([name, count]) => (
                                            <Box key={"rite" + rite.id + "ingredient" + name}>
                                                <Box direction="row" gap={"small"}>
                                                    <Text>
                                                        {name} x{count}
                                                    </Text>
                                                    <Button
                                                        label={"Offer " + name}
                                                        onClick={() => performOffering(rite, name)}
                                                        disabled={!EvaluateRequirements(inventory, entities, kins, [[name, 1]])}
                                                    ></Button>
                                                </Box>
                                                <Box fill="horizontal" height={"5px"} width={"50px"}>
                                                    <Meter value={rite.progress.find(([n, c]) => n == name)?.[1]} max={count}></Meter>
                                                </Box>
                                            </Box>
                                        ))}
                                    </Box>
                                ))}
                        </Box>
                    )}
                </Box>
            </LayoutGroup>
        </>
    );
};

const ActionButton = ({ action, performAction, disabled }) => {
    return <Button label={action.name} onClick={() => performAction(action)} disabled={disabled}></Button>;
};

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

const Entities = ({
    entities,
    performEntityAction,
    inventory,
    milestones,
    kins,
    rites,
}: {
    entities: Entity[];
    performEntityAction: Function;
    inventory: Item[];
    milestones: string[];
    kins: Kin[];
    rites: Rite[];
}) => {
    return (
        <Box height={{ min: "200px" }}>
            <Heading level={3}>Entities</Heading>
            <ul>
                {entities.map((entity, i) => (
                    <li key={"entitiy" + entity.name + i}>
                        <Box direction="row" gap="small">
                            <Text>{entity.name}</Text>
                            {entity.ttl > 0 && <Text>{entity.ttl.toFixed(0)}s</Text>}
                            <Text>{entity.temperature.toFixed(0)} &#176;C</Text>
                            {actions
                                .filter((action) => action.source?.includes(entity.name))
                                .filter((action) => action.milestones(inventory, entities, kins, rites, milestones))
                                .map((action) => (
                                    <ActionButton
                                        key={action.name}
                                        action={action}
                                        performAction={() => performEntityAction(action, entity)}
                                        disabled={!(action?.condition(inventory, entities, kins, rites, entity) && EvaluateRequirements(inventory, entities, kins, action.requires))}
                                    ></ActionButton>
                                ))}
                        </Box>
                    </li>
                ))}
            </ul>
        </Box>
    );
};

const Kins = ({ kins }: { kins: Kin[] }) => {
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
                                <Box width={"300px"}>
                                    <Inventory inventory={kin.inventory} compact={true}></Inventory>
                                </Box>
                            </Box>
                        </Stack>
                    </motion.div>
                ))}
            </Box>
        </AnimatePresence>
    );
};

export default Home;
