import { DayNightColors, GetLinearGradient } from "../utils/Theme";

export const TimeDefinitions = {
    Dawn: [5, 6],
    Day: [7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17],
    Dusk: [18, 19],
    Midnight: [22, 23],
    Night: [20, 21, 22, 23, 0, 1, 2, 3, 4],
    GetTimeColor(time: number) {
        return DayNightColors[time];
    },
    GetTimeGradient(name: string) {
        return GetLinearGradient(TimeDefinitions[name].map((time) => DayNightColors[time]));
    },
};
