import { Box, Text } from "grommet";
import React from "react";
import { Requirement } from "./BaseClasses";
import { ItemDefinitions } from "./Eras/ItemDefinitions";
import { RequirementDefinitions } from "./Eras/RequirementDefinitions";

const RenderRequirements = ({ requirements }: { requirements: Requirement[] }) => {
    return (
        <Box style={{ display: "inline-flex" }} gap={"xsmall"}>
            {requirements.map((requirement, i) => (
                <Box key={i} gap={"xsmall"}>
                    {requirement.name != "*" && (
                        <Box direction="row" gap={"xsmall"}>
                            {requirement.name && <Text>{ItemDefinitions[requirement.name]?.icon || RequirementDefinitions[requirement.name]?.icon || requirement.name}</Text>}
                            {!requirement.name && <Text>{RequirementDefinitions[requirement.type]?.icon || requirement.type}</Text>}
                            <Text>{requirement.operator}</Text>
                            <Text>{requirement.value}</Text>
                        </Box>
                    )}
                    {requirement.requires.length > 0 && <RenderRequirements requirements={requirement.requires}></RenderRequirements>}
                </Box>
            ))}
        </Box>
    );
};

export default RenderRequirements;
