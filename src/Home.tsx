import { initialize } from "esbuild";
import { Box, Button, Grid, Heading, Meter, Stack, Text, Tip } from "grommet";
import * as React from "react";
import { Action, Entity, IGameState, Item, ItemRequirement, Kin, Rite, Requirement, ActionDuration } from "./Classes";
import { groupBy, values } from "lodash";
import _ from "lodash";
import { actions, EvaluateRequirements, RemoveItem } from "./Actions";
import { AnimatePresence, LayoutGroup, motion } from "framer-motion";
import * as Items from "./Eras/One";
import { DayNightColors } from "./utils/Theme";
import { GameState } from "./GameState";
import Modal from "./components/Modal";
import { use } from "framer-motion/client";
import { Milestone } from "./Eras/One";
import Debug from "./Debug";
import Progress from "./components/Progress";

const Home = () => {
    const [gameState, setGameState] = React.useState(new GameState());

    const [inventory, setInventory] = React.useState([] as Item[]);
    const [entities, setEntities] = React.useState([] as Entity[]);
    const [milestones, setMilestones] = React.useState([] as Milestone[]);
    const [kins, setKins] = React.useState([] as Kin[]);
    const [rites, setRites] = React.useState([] as Rite[]);
    const [ticks, setTicks] = React.useState(0);
    const [performingActions, setPerformingActions] = React.useState([] as ActionDuration[]);
    const [messages, setMessages] = React.useState([] as string[]);
    const [showMessages, setShowMessages] = React.useState(false);

    React.useEffect(() => {
        const listener = (newState, messages) => {
            setInventory(newState.inventory);
            setEntities(newState.entities);
            setMilestones(newState.milestones);
            setKins(newState.kins);
            setRites(newState.rites);
            setTicks(newState.ticks);
            setPerformingActions(newState.performingActions);
            if (messages.length > 0) {
                setMessages(messages);
                setShowMessages(true);
            }
        };

        gameState.subscribe(listener);

        // Cleanup on unmount
        return () => {
            gameState.unsubscribe(listener);
        };
    }, []);

    return (
        <>
            <LayoutGroup>
                <Box align="center" fill gap={"xsmall"}>
                    <Progress color={DayNightColors[Math.floor(((ticks % 100) / 100) * DayNightColors.length)]} value={ticks % 100} ttl={100} width={"100%"}></Progress>
                    {messages.length}
                    <Box direction="row" gap="small" align="start" fill>
                        <Box gap="small">
                            <Text>Actions</Text>
                            {actions
                                .filter((action) => action.source?.length == 0)
                                .filter((action) => action.type?.length == 0)
                                .filter((action) => action.milestones(gameState))
                                .map((action) => (
                                    <ActionButton
                                        key={action.name}
                                        action={action}
                                        performAction={gameState.performAction}
                                        disabled={!EvaluateRequirements(gameState, action.requires) || !!performingActions.find((performingAction) => performingAction.action.id == action.id)}
                                    ></ActionButton>
                                ))}
                        </Box>

                        <Box gap="small">
                            <Text>Tasks</Text>
                            {performingActions.map((performingAction, i) => (
                                <Box key={i}>
                                    <Text>{performingAction.action.name}</Text>
                                    <Progress width={"200px"} color="green" value={performingAction.action.duration - performingAction.remaining} ttl={performingAction.action.duration}></Progress>
                                    {/* <Meter value={performingAction.remaining} max={performingAction.action.duration}></Meter> */}
                                </Box>
                            ))}
                        </Box>

                        {milestones.length > 0 && (
                            <Box gap="small">
                                <Text>Milestones</Text>
                                {milestones.map((milestone, i) => (
                                    <Button disabled key={milestone.name + i} label={milestone.name}></Button>
                                ))}
                            </Box>
                        )}
                        {milestones.length > 0 && (
                            <Box gap="small">
                                <Text>Rituals</Text>
                                {actions
                                    .filter((action) => action.source?.length == 0)
                                    .filter((action) => action.type?.includes("Ritual"))
                                    .filter((action) => action.milestones(gameState))
                                    .map((action) => (
                                        <ActionButton
                                            key={action.name}
                                            action={action}
                                            performAction={gameState.performAction}
                                            disabled={!EvaluateRequirements(gameState, action.requires)}
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
                                    .filter((action) => action.milestones(gameState))
                                    .map((action) => (
                                        <ActionButton
                                            primary={rites.find((rite) => rite.name == action.name)?.isComplete()}
                                            key={action.name}
                                            action={action}
                                            performAction={gameState.performAction}
                                            disabled={!EvaluateRequirements(gameState, action.requires)}
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
                                                            onClick={() => gameState.performOffering(rite, name)}
                                                            disabled={!EvaluateRequirements(gameState, [ItemRequirement([name, 1])])}
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
                    <Entities entities={entities} performEntityAction={gameState.performEntityAction} inventory={inventory} milestones={milestones} kins={kins} rites={rites} ticks={ticks}></Entities>
                    <Box direction="row" gap="small" fill align="start">
                        <Box height={{ min: "200px" }} width={"320px"} border pad={"small"}>
                            <Text>Inventory</Text>
                            <Inventory inventory={inventory}></Inventory>
                        </Box>
                        <Box height={{ min: "200px" }} width={"320px"}>
                            {kins.length > 0 && <Text>Kins</Text>}
                            <Kins kins={kins}></Kins>
                        </Box>
                    </Box>
                    <Box>
                        <Debug perform={(p) => gameState.performAction(p)}></Debug>
                    </Box>
                </Box>
                <Modal isOpen={showMessages} setIsOpen={setShowMessages}>
                    {messages.map((message, i) => (
                        <Box key={i}>{message}</Box>
                    ))}
                    <Box direction="row" justify="center">
                        <Button label="Continue" onClick={() => setShowMessages(false)}></Button>
                    </Box>
                </Modal>
            </LayoutGroup>
        </>
    );
};

const ActionButton = ({ action, performAction, disabled, ...props }) => {
    return action.requires.length > 0 ? (
        <Tip key={action.name} content={<RenderRequirements requirements={action.requires}></RenderRequirements>}>
            <Box>
                <Button label={action.name} onClick={() => performAction(action)} disabled={disabled} {...props}></Button>
            </Box>
        </Tip>
    ) : (
        <Button label={action.name} onClick={() => performAction(action)} disabled={disabled} {...props}></Button>
    );
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
    ticks,
}: {
    entities: Entity[];
    performEntityAction: Function;
    inventory: Item[];
    milestones: Milestone[];
    kins: Kin[];
    rites: Rite[];
    ticks: number;
}) => {
    return (
        <Box height={{ min: "200px" }} fill align="start">
            <Text>Entities</Text>
            <Box gap={"xsmall"}>
                {entities.map((entity, i) => (
                    <Box key={"entitiy" + entity.name + i} direction="row" gap="small">
                        <Box>
                            <Box direction="row" gap={"small"}>
                                <Text>{entity.name}</Text>
                                {entity.ttl > 0 && <Text>{entity.ttl.toFixed(0)}s</Text>}
                                {entity.temperature != 0 && <Text>{entity.temperature.toFixed(0)} &#176;C</Text>}
                            </Box>
                            {entity.performs.map((perform) => (
                                <Box key={"entitiy" + entity.name + i + "perform" + perform.name} direction="row" gap={"xsmall"} align="center">
                                    {perform.ttp > 0 && perform.condition({ inventory, entities, kins, rites, milestones, ticks } as GameState, entity) && (
                                        <>
                                            <Text>{perform.icon}</Text>
                                            <Meter value={ticks - perform.lastTickPerformed} max={perform.ttp} thickness="10px" size="full"></Meter>
                                        </>
                                    )}
                                </Box>
                            ))}
                        </Box>
                        {actions
                            .filter((action) => action.source?.includes(entity.name))
                            .filter((action) => action.milestones({ inventory, entities, kins, rites, milestones, ticks } as GameState))
                            .map((action) => (
                                <ActionButton
                                    key={action.name}
                                    action={action}
                                    performAction={() => performEntityAction(action, entity)}
                                    disabled={!EvaluateRequirements({ inventory, entities, kins, rites, milestones, ticks } as GameState, action.requires)}
                                ></ActionButton>
                            ))}
                    </Box>
                ))}
            </Box>
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

const RenderRequirements = ({ requirements }: { requirements: Requirement[] }) => {
    return (
        <Box gap={"small"}>
            {requirements.map((requirement, i) => (
                <Box key={i} gap={"xsmall"}>
                    <Box direction="row" gap={"xsmall"}>
                        {requirement.name && <Text>{Items.ItemDefinitions[requirement.name]?.icon || requirement.name}</Text>}
                        {!requirement.name && <Text>{requirement.type}</Text>}
                        <Text>{requirement.operator}</Text>
                        <Text>{requirement.value}</Text>
                    </Box>
                    {requirement.requires.length > 0 && <RenderRequirements requirements={requirement.requires}></RenderRequirements>}
                </Box>
            ))}
        </Box>
    );
};

export default Home;
