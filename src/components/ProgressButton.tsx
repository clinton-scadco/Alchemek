import React, { ReactNode, useEffect, useState } from "react";
import { motion } from "framer-motion";
import styled from "styled-components";
import { Box, Text, Button } from "grommet";

const ProgressButtonContainer = styled.default.div`
    position: relative;
    user-select: none; 
    .progress {
        position: absolute;
        min-height: 100%;
        height: 100%;
        pointer-events: none;
        top:0;
        z-index: 0;
    }
    width: fit-content;
`;

interface ProgressButtonProps {
    icon?: JSX.Element;
    active?: boolean;
    id: number;
    label: string;
    remaining?: number;
    max: number;
    color?: string;
    disabled?: boolean;
    onClick: () => void;
}

const ProgressButton = ({ icon, active, id, label, remaining, max, color, disabled, onClick }: ProgressButtonProps) => {
    return (
        <ProgressButtonContainer>
            <Button icon={icon} onClick={onClick} label={label} disabled={disabled}></Button>
            <motion.div
                className="progress"
                key={id}
                initial={{ width: "0%" }}
                animate={active && { width: `100%` }}
                style={{ height: "10px", backgroundColor: color || "rgba(255,255,255,0.5" }}
                transition={{ duration: remaining }}
            />
        </ProgressButtonContainer>
    );
};

export default ProgressButton;
