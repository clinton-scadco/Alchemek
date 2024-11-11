import React, { useState } from "react";
import ProgressButton from "./ProgressButton";
import { Button, Stack } from "grommet";

const ComponentTest = () => {
    const [value, setValue] = useState(50);

    return (
        <>
            <ProgressButton
                label="Click me"
                value={value}
                max={100}
                onClick={() => {
                    setValue(value + 1);
                }}
            ></ProgressButton>
        </>
    );
};

export default ComponentTest;
