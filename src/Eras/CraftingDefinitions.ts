export interface Schematic {
    name: string;
    input: { item: string; x: number; y: number }[];
    outputs: { item: string; quantity: number }[];
}

export const Schematics = [
    {
        name: "Craft Tool",
        input: [
            { item: "Stone", x: 0, y: 0 },
            { item: "Wood", x: 0, y: 1 },
        ],
        outputs: [{ item: "Tool", quantity: 1 }],
    },
];
