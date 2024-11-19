import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Box, Button, Text } from "grommet";
import { normalizeColor } from "grommet/utils";
import React from "react";
import Theme from "../utils/Theme";
import { useDarkMode } from "./DarkModeSwitch";

const PlusMinus = ({ value, onChange }) => {
    const [isDarkMode] = useDarkMode();

    return (
        <Box direction="row" gap="small">
            <Box
                pad="xsmall"
                hoverIndicator="background-back"
                onClick={() => {
                    onChange(-1);
                }}
                round="3px"
            >
                <FontAwesomeIcon icon={["fad", "minus"]} color={normalizeColor("text", Theme, isDarkMode)} size="sm"></FontAwesomeIcon>
            </Box>
            <Text>{value}</Text>
            <Box
                pad="xsmall"
                background="brand"
                hoverIndicator="background-back"
                onClick={() => {
                    onChange(1);
                }}
                round="3px"
            >
                <FontAwesomeIcon icon={["fad", "plus"]} color={normalizeColor("background", Theme, isDarkMode)} size="sm"></FontAwesomeIcon>
            </Box>
        </Box>
    );
};

export default PlusMinus;
