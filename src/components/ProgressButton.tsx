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
    .info {
        position: absolute;
        z-index: 1;
        left: 100%;
        pad-left:4px;
    }
`;

interface ProgressButtonProps {
    icon?: JSX.Element;
    info?: JSX.Element;
    active?: boolean;
    id: number;
    label: string;
    remaining?: number;
    max: number;
    color?: string;
    disabled?: boolean;
    onClick: () => void;
}

const ProgressButton = ({ icon, active, id, label, remaining, max, color, disabled, onClick, info }: ProgressButtonProps) => {
    const [showInfo, setShowInfo] = useState(false);

    return (
        <ProgressButtonContainer>
            <Box direction="row" onMouseEnter={() => setShowInfo(true)} onMouseLeave={() => setShowInfo(false)} align="center">
                <Button icon={icon} onClick={onClick} label={<Text>{label}</Text>} disabled={disabled}></Button>
                {info && showInfo && <div className="info">{info}</div>}
                <motion.div
                    className="progress"
                    key={id}
                    initial={{ width: "0%" }}
                    animate={active && { width: `100%` }}
                    style={{ height: "10px", backgroundColor: color || "rgba(255,255,255,0.5" }}
                    transition={{ duration: remaining }}
                />
            </Box>
        </ProgressButtonContainer>
    );
};

export default ProgressButton;
