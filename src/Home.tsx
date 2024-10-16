import { initialize } from "esbuild";
import { Box, Button, Grid, Heading, Meter, Text } from "grommet";
import * as React from "react";
import { Action, Entity, Item, Kin } from "./Classes";
import { groupBy } from "lodash";
import _ from "lodash";
import { actions } from "./Actions";

const Home = () => {
    const [inventory, setInventory] = React.useState([] as Item[]);
    const [entities, setEntities] = React.useState([] as Entity[]);
    const [milestones, setMilestones] = React.useState([] as string[]);
    const [kins, setKins] = React.useState([] as Kin[]);

    React.useEffect(() => {}, []);

    const performAction = (action: Action) => {
        action.perform(inventory, entities, kins);
        setInventory([...inventory]);
        setEntities([...entities]);
        setKins([...kins]);
    };

    const performEntityAction = (action: Action, entity: Entity) => {
        action.perform(inventory, entities, kins, entity);
        setInventory([...inventory]);
        setEntities([...entities]);
        setKins([...kins]);
    };

    React.useEffect(() => {
        let newMilestones = [...milestones];
        actions.forEach((action) => {
            action.milestones(inventory, entities, newMilestones);
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
            <Box style={{ maxHeight: "10px" }}>
                <Meter value={ticks % 100} max={100}></Meter>
            </Box>
            <Box direction="row" gap="small">
                <Box height={{ min: "200px" }}>
                    <Heading level={3}>Inventory</Heading>
                    <Inventory inventory={inventory}></Inventory>
                </Box>
                <Box height={{ min: "200px" }}>
                    {kins.length > 0 && <Heading level={3}>Kins</Heading>}
                    <Kins kins={kins}></Kins>
                </Box>
            </Box>
            <Entities entities={entities} performEntityAction={performEntityAction} inventory={inventory} milestones={milestones}></Entities>
            <Box direction="row" gap="small">
                <Box gap="small">
                    <Text>Actions</Text>
                    {actions
                        .filter((action) => action.source?.length == 0)
                        .filter((action) => action.type?.length == 0)
                        .filter((action) => action.milestones(inventory, entities, milestones))
                        .map((action) => (
                            <ActionButton key={action.name} action={action} performAction={performAction} disabled={!action?.condition(inventory, entities)}></ActionButton>
                        ))}
                </Box>
                {milestones.length > 0 && (
                    <Box gap="small">
                        <Text>Rituals</Text>
                        {actions
                            .filter((action) => action.source?.length == 0)
                            .filter((action) => action.type?.includes("Ritual"))
                            .filter((action) => action.milestones(inventory, entities, milestones))
                            .map((action) => (
                                <ActionButton key={action.name} action={action} performAction={performAction} disabled={!action?.condition(inventory, entities)}></ActionButton>
                            ))}
                    </Box>
                )}
            </Box>
        </>
    );
};

const ActionButton = ({ action, performAction, disabled }) => {
    return <Button label={action.name} onClick={() => performAction(action)} disabled={disabled}></Button>;
};

const Inventory = ({ inventory, compact }: { inventory: Item[]; compact?: boolean }) => {
    return (
        <Grid columns={{ size: "20px", count: 5 }} gap={"small"}>
            {_(inventory)
                .orderBy((i) => i.name)
                .groupBy((i) => i.name)
                .toPairs()
                .map(([key, items]) => (
                    <Box key={"items" + key} border align="center">
                        <Text>{items[0].icon}</Text>
                        {!compact && (
                            <>
                                <Text>
                                    {key}: {items.length}
                                </Text>
                                {items.every((item) => item.durability != -1) && <Text>({_(items).meanBy((i) => i.durability / i.maxDurability) * 100}%)</Text>}
                            </>
                        )}
                        
                    </Box>
                ))
                .value()}
        </Grid>
    );
};

const Entities = ({ entities, performEntityAction, inventory, milestones }: { entities: Entity[]; performEntityAction: Function; inventory: Item[]; milestones: string[] }) => {
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
                                .filter((action) => action.milestones(inventory, entities, milestones))
                                .map((action) => (
                                    <ActionButton key={action.name} action={action} performAction={() => performEntityAction(action, entity)} disabled={!action?.condition(inventory, entities, entity)}></ActionButton>
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
        <Grid columns={{ size: "20px", count: 5 }} gap={"small"}>
            {_(kins)
                .orderBy((i) => i.name)
                .groupBy((i) => i.name)
                .toPairs()
                .map(([key, kins]) => (
                    <Box key={"kin" + key} border align="center">
                        <Text>{kins[0].icon}</Text>
                        <Text>
                            {key}: {kins.length}
                        </Text>
                        <Inventory inventory={kins.flatMap((k) => k.inventory)} compact={true}></Inventory>
                    </Box>
                ))
                .value()}
        </Grid>
    );
};

export default Home;
