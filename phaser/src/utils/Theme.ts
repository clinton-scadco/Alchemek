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

export const GetLinearGradient = (colors: number[]) => {
    return `linear-gradient(90deg, ${colors.join(",")})`;
};

export const DayNightColors = [
    0x012459, //0
    0x003972, //1
    0x003972, //2
    0x004372, //3
    0x004372, //4
    0x016792, //5
    0x07729f, //6
    0x12a1c0, //7
    0x74d4cc, //8
    0xefeebc, //9
    0xfee154, //10
    0xfdc352, //11
    0xffac6f, //12
    0xfda65a, //13
    0xfd9e58, //14
    0xf18448, //15
    0xf06b7e, //16
    0xca5a92, //17
    0x5b2c83, //18
    0x371a79, //19
    0x28166b, //20
    0x192861, //21
    0x040b3c, //22
    0x040b3c, //23
];

export const DayNightGradient = GetLinearGradient(DayNightColors);
