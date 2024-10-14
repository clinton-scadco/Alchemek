import { initialize } from "esbuild";
import { Box, Button, Heading, Text } from "grommet";
import * as React from "react";
import { Action, Entity } from "./Classes";

const actions = [
    new Action({
        name: "Collect Stone",
        perform: (inventory) => (inventory.stone += 1),
        initialize: (inventory) => (inventory.stone = 0),
    }),
    new Action({
        name: "Collect Wood",
        perform: (inventory) => (inventory.wood += 1),
        initialize: (inventory) => (inventory.wood = 0),
    }),
    new Action({
        name: "Make Fire",
        perform: (inventory, entities, source) => {
            inventory.wood -= 2;
            entities.push(
                new Entity({
                    name: "Fire",
                    ttl: 50,
                    temperature: 100,
                    tick: function () {
                        if (this.temperature <= 100) {
                            this.ttl -= 1;
                        } else {
                            this.ttl = 50;
                        }
                        this.temperature -= 2;
                    },
                })
            );
        },
        initialize: (inventory) => {},
        condition: (inventory) => inventory.wood >= 2,
    }),
    new Action({
        name: "Feed Fire",
        perform: (inventory, entities, source) => {
            inventory.wood -= 1;
            let fire = source;
            if (fire) {
                fire.ttl += 5;

                if (fire.ttl > 50) {
                    fire.ttl = 50;
                }

                fire.temperature += 10;
            }
        },
        initialize: (inventory) => {},
        condition: (inventory, entities) => {
            return inventory.wood >= 1 ? !!entities.find((entity) => entity.name === "Fire") : false;
        },
        source: ["Fire"],
    }),
];

const Home = () => {
    const [inventory, setInventory] = React.useState({} as any);
    const [entities, setEntities] = React.useState([] as Entity[]);

    React.useEffect(() => {
        const newInventory = {};
        actions.forEach((action) => {
            action.initialize(newInventory);
        });
        setInventory(newInventory);
    }, []);

    const performAction = (action) => {
        action.perform(inventory, entities);
        setInventory({ ...inventory });
        setEntities([...entities]);
    };

    const performEntityAction = (action, entity) => {
        action.perform(inventory, entities, entity);
        setInventory({ ...inventory });
        setEntities([...entities]);
    };

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
                return updatedEntities.filter((entity) => entity.ttl > 0);
            });
        }, 1000);

        // Cleanup function to clear interval on unmount
        return () => clearInterval(intervalId);
    }, []);

    return (
        <>
            <Inventory inventory={inventory}></Inventory>
            <Entities entities={entities} performEntityAction={performEntityAction} inventory={inventory}></Entities>
            <Box gap="small">
                {actions
                    .filter((action) => action.source?.length == 0)
                    .map((action) => (
                        <ActionButton key={action.name} action={action} performAction={performAction} disabled={!action?.condition(inventory, entities)}></ActionButton>
                    ))}
            </Box>
        </>
    );
};

const ActionButton = ({ action, performAction, disabled }) => {
    return <Button label={action.name} onClick={() => performAction(action)} disabled={disabled}></Button>;
};

const Inventory = ({ inventory }: { inventory: { [key: string]: number } }) => {
    return (
        <Box>
            <Heading level={3}>Inventory</Heading>
            <ul>
                {Object.entries(inventory).map(([key, value]) => (
                    <li>
                        <Text>
                            {key}: {value}
                        </Text>
                    </li>
                ))}
            </ul>
        </Box>
    );
};

const Entities = ({ entities, performEntityAction, inventory }: { entities: Entity[]; performEntityAction: Function; inventory: { [key: string]: number } }) => {
    return (
        <Box>
            <Heading level={3}>Entities</Heading>
            <ul>
                {entities.map((entity) => (
                    <li>
                        <Box direction="row" gap="small">
                            <Text>{entity.name}</Text>
                            <Text>{entity.ttl.toFixed(0)}s</Text>
                            <Text>{entity.temperature.toFixed(0)} &#176;C</Text>
                            {actions
                                .filter((action) => action.source?.includes(entity.name))
                                .map((action) => (
                                    <ActionButton key={action.name} action={action} performAction={() => performEntityAction(action, entity)} disabled={!action?.condition(inventory, entities)}></ActionButton>
                                ))}
                        </Box>
                    </li>
                ))}
            </ul>
        </Box>
    );
};

export default Home;
