import { grommet } from "grommet";
import { deepMerge } from "grommet/utils";
import { ThemeType } from "grommet/themes";

const ssacovidtheme: ThemeType = {
    global: {
        font: {
            family: "OpenSans",
        },
        colors: {
            brandColor: "var(--accent, #FFCA58)",
            /* BEGIN: Color Palette Definition */
            brand: {
                dark: "white",
                light: "black",
            },
            text: {
                dark: "white",
                light: "black",
            },
            "light-1": "#f7f7f7",
            "light-2": "#e1e1e1",
            "light-3": "#b1b1b1",
            "dark-1": "#0c0e12",
            "dark-2": "#212224bf",
            "dark-3": "#3b3b3b",
            /* END: Color Palette Definition */
            /* BEGIN: Mapping Colors to Grommet Namespaces */
            background: {
                dark: "dark-1",
                light: "light-1",
            },
            "background-back": {
                dark: "dark-2",
                light: "light-2",
            },
            "background-front": {
                dark: "dark-3",
                light: "light-3",
            },
            "background-contrast": {
                dark: "light-3",
                light: "dark-3",
            },
            control: {
                dark: "brand",
            },
            focus: {
                dark: "brand",
                light: "brand",
            },
        },
        breakpoints: {
            small: {
                value: 1000,
            },
            medium: {
                value: 1400,
            },
            large: {
                value: 1800,
            },
            xlarge: {
                value: 2400,
            },
        },
        /* END: Mapping Colors to Grommet Namespaces */
    },
    /* BEGIN: Mapping Colors to Components */
    anchor: {
        color: "brandColor",
        hover: {
            textDecoration: "none",
        },
    },
    button: {
        size: {
            small: {
                border: {
                    radius: "2px",
                },
            },
            medium: {
                border: {
                    radius: "2px",
                },
            },
            large: {
                border: {
                    radius: "2px",
                },
            },
        },
        border: {
            radius: "2px",
        },
        extend: {
            "font-size": "16px",
        },
    },
    layer: {
        background: {
            dark: "background",
            light: "background",
        },
    },
    heading: {
        weight: 300,
        extend: {
            margin: "0px",
        },
    },
    formField: {
        label: {
            size: "small",
            margin: "xxsmall",
        },
        margin: "5px",
    },
    textInput: {
        extend: "padding:5px",
    },
    text: {
        small: {
            size: "12px",
        },
        medium: {
            size: "16px",
        },
        large: {
            size: "20px",
        },
        xlarge: {
            size: "24px",
        },
        xxlarge: {
            size: "32px",
        },
    },
    meter: {
        extend: {
            borderRadius: "3px",
        },
    },
    /* END: Mapping Colors to Components */
};

const Theme = deepMerge(grommet, ssacovidtheme);

export default Theme;
