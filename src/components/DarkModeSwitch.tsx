import * as React from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { singletonHook } from "react-singleton-hook";

const darkModeFactory = () => {
    let userPrefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;

    let darkMode = JSON.parse(localStorage.getItem("dark-mode") || userPrefersDark.toString());
    const [isDarkMode, setDarkMode] = React.useState(darkMode);

    const toggleDarkMode = () => {
        setDarkMode(!isDarkMode);
        localStorage.setItem("dark-mode", JSON.stringify(!isDarkMode));
    };

    return [isDarkMode, toggleDarkMode];
};

export const useDarkMode = singletonHook([false], darkModeFactory);

let DarkModeSwitch = () => {
    const [isDarkMode, toggleDarkMode] = useDarkMode();

    return (
        <div style={{ padding: "1rem", position: "absolute", right: "1rem", zIndex: 100 }}>
            {isDarkMode && <FontAwesomeIcon color="#f5d01b" icon={["fad", "sun"]} onClick={toggleDarkMode}></FontAwesomeIcon>}
            {!isDarkMode && <FontAwesomeIcon color="#3f51b5" icon={["fad", "moon"]} onClick={toggleDarkMode}></FontAwesomeIcon>}
            {/* <Switch sm defaultChecked={isDarkMode} onClick={toggleDarkMode} /> */}
        </div>
    );
};

export default DarkModeSwitch;
