import * as React from "react";
import { Routes, Route, useLocation, useNavigate } from "react-router-dom";

import DarkModeSwitch, { useDarkMode } from "./components/DarkModeSwitch";
import { Box, Grommet } from "grommet";
import Theme from "./utils/Theme";

import ErrorBoundary from "./components/ErrorBoundary";

import Home from "./Home";

function App() {
    const navigate = useNavigate();

    const [isDarkMode, toggleDarkMode] = useDarkMode();

    const [grommetProps, setGrommetProps] = React.useState({});

    React.useEffect(() => {}, []);

    return (
        <Grommet {...grommetProps} full theme={Theme} themeMode={isDarkMode ? "dark" : "light"}>
            <Box background={{ color: "background" }}>
                <DarkModeSwitch></DarkModeSwitch>

                <Box style={{ backgroundSize: "cover" }} height={{ min: "100vh" }} pad={{ top: "small" }}>
                    <Box width={{ max: "1100px" }} pad={{ left: "medium", right: "medium" }} style={{ position: "relative" }}>
                        <ErrorBoundary>
                            <Routes>
                                <Route path="/*" element={<Home></Home>}></Route>
                            </Routes>
                        </ErrorBoundary>
                    </Box>
                </Box>
            </Box>
        </Grommet>
    );
}

export default App;
