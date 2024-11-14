import React from "react";
import { Action, ActionDuration } from "./BaseClasses";
import ProgressButton from "./components/ProgressButton";
import { Text } from "grommet";
import RenderRequirements from "./Requirements";

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
