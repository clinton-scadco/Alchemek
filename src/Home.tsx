import { initialize } from "esbuild";
import { Box, Button, Heading, Text } from "grommet";
import * as React from "react";
import { Action, Entity, Item } from "./Classes";
import { groupBy } from "lodash";
import _ from "lodash";
import { actions } from "./Actions";

const Home = () => {
    const [inventory, setInventory] = React.useState([] as Item[]);
    const [entities, setEntities] = React.useState([] as Entity[]);
    const [milestones, setMilestones] = React.useState([] as string[]);

    React.useEffect(() => {}, []);

    const performAction = (action) => {
        action.perform(inventory, entities);
        setInventory([...inventory]);
        setEntities([...entities]);
    };

    const performEntityAction = (action, entity) => {
        action.perform(inventory, entities, entity);
        setInventory([...inventory]);
        setEntities([...entities]);
    };

    React.useEffect(() => {
        let newMilestones = [...milestones];
        actions.forEach((action) => {
            action.milestones(inventory, entities, newMilestones);
        });
        setMilestones(newMilestones);
    }, [inventory, entities]);

    React.useEffect(() => {
        const intervalId = setInterval(() => {
            setEntities((prevEntities) => {
                // Decrease ttl of each entity
                const updatedEntities = prevEntities.map((entity) => {
                    let newEntity = { ...entity };
                    newEntity.tick();
                    return newEntity;
                });

                // Filter out entities with ttl <= 0
                return updatedEntities.filter((entity) => entity.ttl != 0);
            });
        }, 1000);

        // Cleanup function to clear interval on unmount
        return () => clearInterval(intervalId);
    }, []);

    return (
        <>
            <Inventory inventory={inventory}></Inventory>
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
                        <li>
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
                {entities.map((entity) => (
                    <li>
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

export default Home;
