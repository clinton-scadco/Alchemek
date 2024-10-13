import { initialize } from "esbuild";
import { Box, Button, Heading, Text } from "grommet";
import * as React from "react";

interface IAction {
    name: string;
    perform?: (inventory: any, entities: Entity[]) => void;
    initialize?: (inventory: any) => void;
    condition?: (inventory: any, entities: Entity[]) => boolean;
}

class Action implements IAction {
    name: string;
    perform: (inventory: any, entities: Entity[]) => void;
    initialize: (inventory: any) => void;
    condition: (inventory: any, entities: Entity[]) => boolean;

    constructor({ name, perform, initialize, condition }: IAction) {
        this.name = name;
        this.perform = perform || (() => {});
        this.initialize = initialize || (() => {});
        this.condition = condition || (() => true);
    }
}

interface IEntity {
    name: string;
    ttl?: number;
    temperature?: number;
    tick?: () => void;
}

class Entity implements IEntity {
    name: string;
    ttl: number;
    temperature: number;
    tick: () => void;

    constructor({ name, ttl, temperature, tick }: IEntity) {
        this.name = name;
        this.ttl = ttl || -1;
        this.temperature = temperature || 0;
        this.tick = tick || (() => {});
    }
}

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
        perform: (inventory, entities) => {
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
        perform: (inventory, entities) => {
            inventory.wood -= 1;
            let fire = entities.find((entity) => entity.name === "Fire");
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
    }),
];

const Home = () => {
    const [inventory, setInventory] = React.useState({});
    const [entities, setEntities] = React.useState([]);

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
            <Entities entities={entities}></Entities>
            <Box gap="small">
                {actions.map((action) => (
                    <Button key={action.name} label={action.name} onClick={() => performAction(action)} disabled={!action?.condition(inventory, entities)}></Button>
                ))}
            </Box>
        </>
    );
};

const Inventory = ({ inventory }) => {
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

const Entities = ({ entities }) => {
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
                        </Box>
                    </li>
                ))}
            </ul>
        </Box>
    );
};

export default Home;
