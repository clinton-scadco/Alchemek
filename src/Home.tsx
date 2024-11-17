import { Box, Button, Grid, Heading, Meter, Stack, Text, Tip } from "grommet";
import * as React from "react";
import { ActionDuration, Entity, IGameState, Item, ItemRequirement, Kin, Rite, Requirement, Action, Message } from "./BaseClasses";
import { groupBy, values } from "lodash";
import _ from "lodash";
import { actions } from "./Actions";
import { AnimatePresence, LayoutGroup, motion } from "framer-motion";
import * as Items from "./Eras/One";
import { DayNightColors } from "./utils/Theme";
import { GameState } from "./GameState";
import Modal from "./components/Modal";
import { use } from "framer-motion/client";
import { Milestone } from "./BaseClasses";
import Debug from "./Debug";
import Progress from "./components/Progress";
import { EvaluateRequirements } from "./Functions";
import { ItemDefinitions } from "./Eras/ItemDefinitions";
import ProgressButton from "./components/ProgressButton";
import { RequirementDefinitions } from "./Eras/RequirementDefinitions";
import ActionButton from "./ActionButton";
import Inventory from "./Inventory";
import Kins from "./Kins";
import Entities from "./Entities";

const Home = () => {
    const [gameState, setGameState] = React.useState(new GameState());

    const [inventory, setInventory] = React.useState([] as Item[]);
    const [entities, setEntities] = React.useState([] as Entity[]);
    const [milestones, setMilestones] = React.useState([] as Milestone[]);
    const [kins, setKins] = React.useState([] as Kin[]);
    const [rites, setRites] = React.useState([] as Rite[]);
    const [ticks, setTicks] = React.useState(0);
    const [performingActions, setPerformingActions] = React.useState([] as ActionDuration[]);
    const [messages, setMessages] = React.useState([] as Message[]);
    const [showMessages, setShowMessages] = React.useState(false);

    React.useEffect(() => {
        const listener = (newState: GameState, newMessages: Message[]) => {
            setInventory(newState.inventory);
            setEntities(newState.entities);
            setMilestones(newState.milestones);
            setKins(newState.kins);
            setRites(newState.rites);
            setTicks(newState.ticks);
            setPerformingActions(newState.performingActions);
            if (newMessages.length > 0) {
                setMessages([...messages, ...newMessages]);
                setShowMessages(true);
            }
        };

        gameState.subscribe(listener);

        // Cleanup on unmount
        return () => {
            gameState.unsubscribe(listener);
        };
    }, [messages]);

    return (
        <>
            <LayoutGroup>
                <Box align="center" fill gap={"xsmall"}>
                    {/* {gameState.updates} */}
                    <Progress
                        color={DayNightColors[Math.floor(((ticks % 100) / 100) * DayNightColors.length)]}
                        value={0}
                        name={"Day " + (Math.floor(ticks / 100) + 1)}
                        ttl={100}
                        width={"100%"}
                    ></Progress>
                    {"Day " + (Math.floor(ticks / 100) + 1)}
                    <Box direction="row" gap="small" align="start" fill>
                        <Box gap="small">
                            <Text>Actions</Text>
                            {actions
                                .filter((action) => action.allowedEntities?.length == 0 || action.allowedEntities?.includes("*"))
                                .filter((action) => action.type?.length == 0)
                                .filter((action) => action.milestones(gameState))
                                .map((action) => (
                                    <ActionButton
                                        performingActions={performingActions}
                                        key={action.name}
                                        action={action}
                                        performAction={gameState.performAction}
                                        disabled={!EvaluateRequirements(gameState, action.requires) || !!performingActions.find((performingAction) => performingAction.action.id == action.id)}
                                    ></ActionButton>
                                ))}
                        </Box>

                        {/* <Box gap="small">
                            <Text>Tasks</Text>
                            {performingActions.map((performingAction, i) => (
                                <Box key={i}>
                                    <Text>{performingAction.action.name}</Text>
                                    <Progress
                                        name={performingAction.id}
                                        width={"200px"}
                                        color="green"
                                        value={performingAction.action.duration - performingAction.remaining}
                                        ttl={performingAction.action.duration}
                                    ></Progress>
                                </Box>
                            ))}
                        </Box> */}

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
                                    .filter((action) => action.allowedEntities?.length == 0)
                                    .filter((action) => action.type?.includes("Ritual"))
                                    .filter((action) => action.milestones(gameState))
                                    .map((action) => (
                                        <ActionButton
                                            performingActions={performingActions}
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
                                    .filter((action) => action.allowedEntities?.length == 0)
                                    .filter((action) => action.type?.includes("Rite"))
                                    .filter((action) => action.milestones(gameState))
                                    .map((action) => (
                                        <ActionButton
                                            performingActions={performingActions}
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
                    <Entities
                        performingActions={performingActions}
                        entities={entities}
                        performEntityAction={gameState.performEntityAction}
                        inventory={inventory}
                        milestones={milestones}
                        kins={kins}
                        rites={rites}
                        ticks={ticks}
                    ></Entities>
                    <Box direction="row" gap="small" fill align="start">
                        <Box height={{ min: "200px" }} width={"320px"} border pad={"small"}>
                            <Text>Inventory</Text>
                            <Inventory inventory={inventory}></Inventory>
                        </Box>
                        <Box height={{ min: "200px" }} width={"320px"}>
                            {kins.length > 0 && <Text>Kins</Text>}
                            <Kins entities={entities} inventory={inventory} milestones={milestones} kins={kins} rites={rites} ticks={ticks}></Kins>
                        </Box>
                    </Box>
                    <Box>
                        <Debug perform={(p) => gameState.performAction(p)}></Debug>
                    </Box>
                </Box>
                {showMessages && (
                    <Box>
                        {messages.map((message, i) => (
                            <Box key={i} gap={"xsmall"}>
                                <Box direction="row" gap={"xsmall"}>
                                    <Text>{message.icon}</Text>
                                    <Text>{message.text}</Text>
                                </Box>
                                <Text>{message.content}</Text>
                            </Box>
                        ))}
                    </Box>
                )}
            </LayoutGroup>
        </>
    );
};

export default Home;
