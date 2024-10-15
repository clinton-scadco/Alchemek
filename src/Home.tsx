import { initialize } from "esbuild";
import { Box, Button, Heading, Meter, Text } from "grommet";
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
                let newEntity = { ...entity };
                newEntity.tick(inventory, entities, kins, ticks);
                return newEntity;
            });
            setEntities(updatedEntities.filter((entity) => entity.ttl != 0));
            setEntities(updatedEntities.filter((entity) => entity.ttl != 0));
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
                <Inventory inventory={inventory}></Inventory>
                <Kins kins={kins}></Kins>
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

const Inventory = ({ inventory }: { inventory: Item[] }) => {
    return (
        <Box height={{ min: "200px" }}>
            <Heading level={3}>Inventory</Heading>
            <ul>
                {_(inventory)
                    .groupBy((i) => i.name)
                    .toPairs()
                    .map(([key, items]) => (
                        <li key={"items" + key}>
                            <Text>
                                {key}: {items.length}
                            </Text>
                            {items.every((item) => item.durability != -1) && <Text>({_(items).meanBy((i) => i.durability / i.maxDurability) * 100}%)</Text>}
                        </li>
                    ))
                    .value()}
            </ul>
        </Box>
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
        <Box height={{ min: "200px" }}>
            {kins.length > 0 && <Heading level={3}>Kins</Heading>}
            <ul>
                {_(kins)
                    .groupBy((i) => i.name)
                    .toPairs()
                    .map(([key, items]) => (
                        <li key={"kin" + key}>
                            <Text>
                                {key}: {items.length}
                            </Text>
                        </li>
                    ))
                    .value()}
            </ul>
        </Box>
    );
};

export default Home;
