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

export const GetLinearGradient = (colors: string[]) => {
    return `linear-gradient(90deg, ${colors.join(",")})`;
};

export const DayNightColors = [
    "#012459", //0
    "#003972", //1
    "#003972", //2
    "#004372", //3
    "#004372", //4
    "#016792", //5
    "#07729f", //6
    "#12a1c0", //7
    "#74d4cc", //8
    "#efeebc", //9
    "#fee154", //10
    "#fdc352", //11
    "#ffac6f", //12
    "#fda65a", //13
    "#fd9e58", //14
    "#f18448", //15
    "#f06b7e", //16
    "#ca5a92", //17
    "#5b2c83", //18
    "#371a79", //19
    "#28166b", //20
    "#192861", //21
    "#040b3c", //22
    "#040b3c", //23
];

export const DayNightGradient = GetLinearGradient(DayNightColors);
