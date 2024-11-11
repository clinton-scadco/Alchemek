import { normalizeColor } from "grommet/utils";
import * as React from "react";
import styled from "styled-components";
import Theme from "../utils/Theme";
import { useDarkMode } from "./DarkModeSwitch";

const ScrollContainerDiv = styled.default.div`
    overflow${({ direction }) => direction}:auto;
    position:relative;

    &::-webkit-scrollbar-track {
        background-color: ${({ darkMode }) => normalizeColor("background", Theme, darkMode)};
    }

    &::-webkit-scrollbar {
        width: 10px;
        height: 10px;
    }

    &::-webkit-scrollbar-thumb {
        border-radius: 5px;
        background: -webkit-linear-gradient(${({ direction }) => (direction == "-y" ? "90deg" : "180deg")} , ${({ darkMode }) => normalizeColor("background-front", Theme, darkMode)} 44%, ${({
    darkMode,
}) => normalizeColor("background-back", Theme, darkMode)} 86%);
    }
`;

const ScrollContainer = ({ children, direction }) => {
    const [isDarkMode] = useDarkMode();
    return (
        <ScrollContainerDiv id="scrollContainer" darkMode={isDarkMode} direction={direction}>
            {children}
        </ScrollContainerDiv>
    );
};

export default ScrollContainer;
