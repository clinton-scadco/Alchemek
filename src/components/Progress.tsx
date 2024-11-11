import * as React from "react";
import styled from "styled-components";
import { AnimatePresence, LayoutGroup, motion } from "framer-motion";
import { values } from "lodash";

const ProgressContainer = styled.default.div`
    background-color: #888888;
    border-radius: 5px;
    overflow: hidden;
    min-width: ${({ width }) => width || "200px"};
`;

const Progress = ({ value, color, ttl, width, name }) => {
    return (
        <ProgressContainer width={width}>
            <motion.div
                key={name}
                initial={{ width: (value / ttl) * 100 + "%" }}
                animate={{ width: `100%` }}
                style={{ height: "10px", backgroundColor: color || "green" }}
                transition={{ duration: ttl - value }}
            />
        </ProgressContainer>
    );
};

export default Progress;
