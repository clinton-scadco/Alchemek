import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import styled from "styled-components";
import { Box } from "grommet";

const ProgressButtonContainer = styled.default.div`
    position: relative;
    user-select: none; 
    .progress {
        position: absolute;
        min-height: 100%;
        height: 100%;
        // transition: width 0.5s ease;
        pointer-events: none;
    }
`;

const ProgressButton = ({ label, value, max, onClick }) => {
    const [width, setWidth] = useState("0%");
    useEffect(() => {
        setWidth(`${(value / max) * 100}%`);
    }, [value, max]);

    return (
        <ProgressButtonContainer>
            <div className="progress" style={{ backgroundColor: "rgba(255,255,255,0.5)", width }}></div>
            <Box border={{ size: "2px", color: "white" }} onClick={onClick}>
                {label}
            </Box>
        </ProgressButtonContainer>
    );
};

export default ProgressButton;
