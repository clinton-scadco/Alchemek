import React, { ReactNode, useEffect, useState } from "react";
import { motion } from "framer-motion";
import styled from "styled-components";
import { Box, Text, Button, Tip, Drop } from "grommet";

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
    const ref = React.useRef(null);

    return (
        <ProgressButtonContainer>
            <Box ref={ref} onMouseEnter={() => setShowInfo(true)} onMouseLeave={() => setShowInfo(false)}>
                {info && showInfo && (
                    <Drop target={ref} plain align={{ left: "right" }}>
                        <Box border={{ size: "2px", color: "white" }} margin="xsmall" pad="xsmall" background={"rgba(0,0,0,0.5)"}>
                            {info}
                        </Box>
                    </Drop>
                )}
                <Button icon={icon} onClick={onClick} label={<Text>{label}</Text>} disabled={disabled}></Button>
                <motion.div
                    className="progress"
                    key={id}
                    initial={{ width: "0%" }}
                    animate={active && { width: `100%` }}
                    style={{ height: "10px", backgroundColor: color || "rgba(255,255,255,0.5" }}
                    transition={{ type: "tween", duration: remaining }}
                />
            </Box>
        </ProgressButtonContainer>
    );
};

export default ProgressButton;
