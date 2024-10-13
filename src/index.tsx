import * as ReactDOM from "react-dom";
import * as React from "react";
import { createRoot } from "react-dom/client";

import { library } from "@fortawesome/fontawesome-svg-core";
import { fad } from "@fortawesome/pro-duotone-svg-icons";

library.add(fad);

import App from "./App";

import { createBrowserRouter, RouterProvider } from "react-router-dom";

const router = createBrowserRouter([
    {
        path: "/*",
        element: <App />,
    },
]);

const container = document.getElementById("app");
const root = createRoot(container!); // createRoot(container!) if you use TypeScript

root.render(<RouterProvider router={router} />);
