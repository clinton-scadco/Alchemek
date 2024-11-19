import React from "react";
import { Action, ActionDuration, IGameState } from "./BaseClasses";
import ProgressButton from "./components/ProgressButton";
import { Box, Text } from "grommet";
import RenderRequirements from "./Requirements";
import { actions } from "./Actions";
import { EvaluateRequirements } from "./Functions";
import PlusMinus from "./components/PlusMinus";

interface ActionButtonsProps {
    gameState: IGameState;
    condition: (action: Action) => boolean;
    performingActions: ActionDuration[];
    performAction: Function;
}

export const ActionButtons = ({ gameState, performingActions, performAction, condition }: ActionButtonsProps) => {
    const assignPreference = (action: Action) => {
        for (let kin of gameState.kins) {
            if (!kin.actionPreference.some((a) => a.id == action.id)) {
                kin.actionPreference.push(action);
                gameState.update();
                break;
            }
        }
    };

    const removePreference = (action: Action) => {
        for (let kin of gameState.kins) {
            if (kin.actionPreference.some((a) => a.id == action.id)) {
                kin.actionPreference = kin.actionPreference.filter((a) => a.id != action.id);
                gameState.update();
                break;
            }
        }
    };

    const handlePreferenceChange = (action: Action, value) => {
        if (value > 0) {
            assignPreference(action);
        } else {
            removePreference(action);
        }
    };

    return (
        <Box gap={"xsmall"}>
            {actions
                .filter((action) => action.allowedEntities?.length == 0 || action.allowedEntities?.includes("*"))
                .filter(condition)
                .filter((action) => action.milestones(gameState))
                .map((action) => (
                    <Box gap="xsmall" key={action.name}>
                        <ActionButton
                            performingActions={performingActions}
                            primary={action.type?.includes("Rite") && gameState.rites.find((rite) => rite.name == action.name)?.isComplete()}
                            action={action}
                            performAction={performAction}
                            disabled={!EvaluateRequirements(gameState, action.requires) || !!performingActions.find((performingAction) => performingAction.action.id == action.id)}
                        ></ActionButton>
                        {action.allowedEntities?.includes("Kin") && gameState.rites.some((rite) => rite.name == "Tasks" && rite.isComplete()) && (
                            <Box direction="row" gap={"xsmall"}>
                                <Text>Kins Assigned</Text>
                                <PlusMinus
                                    value={gameState.kins.filter((k) => k.actionPreference.some((a) => a.id == action.id) && k.inventory.some((i) => i.name == "Tool")).length}
                                    onChange={(v) => handlePreferenceChange(action, v)}
                                ></PlusMinus>
                            </Box>
                        )}
                    </Box>
                ))}
        </Box>
    );
};

interface ActionButtonProps {
    action: Action;
    performingActions: ActionDuration[];
    performAction: Function;
    disabled: boolean;
    [key: string]: any;
}

const ActionButton = ({ action, performingActions, performAction, disabled, ...props }: ActionButtonProps) => {
    let performingAction = performingActions.find((performingAction) => performingAction.action.id == action.id);
    return (
        <ProgressButton
            id={performingAction?.id || -1}
            remaining={performingAction?.remaining}
            max={action.duration}
            icon={<Text>{action.icon}</Text>}
            label={action.name}
            onClick={() => performAction(action)}
            disabled={disabled}
            active={!!performingAction}
            {...props}
            info={action.requires.length > 0 ? <RenderRequirements requirements={action.requires}></RenderRequirements> : undefined}
        ></ProgressButton>
    );
};

export default ActionButton;
