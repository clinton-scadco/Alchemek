import React, { useState } from "react";
import ProgressButton from "./ProgressButton";
import { Button, Stack, Box } from "grommet";

const ComponentTest = () => {
    const [value, setValue] = useState(5);

    return (
        <Box gap="small">
            <ProgressButton
                label="Click me"
                remaining={value}
                max={10}
                onClick={() => {
                    setValue(value + 1);
                }}
                id={1}
                active
            ></ProgressButton>

            <ProgressButton
                label="Click me"
                remaining={value}
                max={30}
                onClick={() => {
                    setValue(value + 1);
                }}
                id={2}
            ></ProgressButton>

            <ProgressButton
                label="Click me"
                remaining={value}
                max={30}
                onClick={() => {
                    setValue(value + 1);
                }}
                id={3}
                disabled
            ></ProgressButton>
        </Box>
    );
};

export default ComponentTest;
