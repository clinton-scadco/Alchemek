import { DayNightColors, GetLinearGradient } from "../utils/Theme";

export const TimeDefinitions = {
    Dawn: [5, 6],
    Day: [7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17],
    Dusk: [18, 19],
    Midnight: [22, 23],
    Night: [20, 21, 22, 23, 0, 1, 2, 3, 4],
    GetTime(ticks: number) {
        return Math.floor(((ticks % 100) / 100) * DayNightColors.length);
    },
    GetTimeColor(ticks: number) {
        return DayNightColors[TimeDefinitions.GetTime(ticks)];
    },
    GetTimeName(ticks: number) {
        const time = TimeDefinitions.GetTime(ticks);
        return Object.keys(TimeDefinitions).find((name) => TimeDefinitions[name].includes(time));
    },
    GetTimeGradient(name: string) {
        return GetLinearGradient(TimeDefinitions[name].map((time) => DayNightColors[time]));
    },
};
