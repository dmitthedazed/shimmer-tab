// A line next to the logo mark instead of the wordmark, picked from the local clock.
//
// Voice, after helium.computer, the imputnet/helium README and release notes:
// - short declaratives and fragments, ending in a full stop: "By default."
// - calm and confident, no hype: "Helium is designed to get out of your way."
// - dry, light humour: "Bang, clack, done." / "Faster than you blink"
// - plain words, sentence case, lowercase !bangs, no emoji
// - privacy and calm as defaults, never a sales pitch: "No need to opt out of anything."
// So: a few words, a full stop or a question mark, warm but never pushy or guilt-tripping.

import enLocale from "./locales/en.json";
import { greetingTable } from "./i18n";

type Ctx = { y: number; m: number; d: number; dow: number; h: number; yday: number; easter: [number, number] };

// another language is another table with the same keys
// the lines live in locales/en.json (and its translations), one list per pool
const en = greetingTable(enLocale.greetings);

type Pool = keyof typeof en;

const night = (c: Ctx) => c.h < 5;
const at = (from: number, to: number) => (c: Ctx) => c.h >= from && c.h < to;
const on = (m: number, d: number) => (c: Ctx) => c.m === m && c.d === d;
const day = (dow: number) => (c: Ctx) => c.dow === dow && !night(c);

// a matching pool's chance is its weight over the sum of all matching weights, so a
// holiday wins most tabs but the everyday lines still come through now and then
const HOLIDAY = 12;
const COMBO = 4;
const TIME = 3;
const WEEKDAY = 2;

const rules: [Pool, number, (c: Ctx) => boolean][] = [
    ["generic", 1, () => true],
    ["night", TIME, night],
    ["early", TIME, at(5, 8)],
    ["morning", TIME, at(8, 12)],
    ["afternoon", TIME, at(12, 18)],
    ["evening", TIME, at(18, 22)],
    ["late", TIME, at(22, 24)],

    ["monday", WEEKDAY, day(1)],
    ["tuesday", WEEKDAY, day(2)],
    ["wednesday", WEEKDAY, day(3)],
    ["thursday", WEEKDAY, day(4)],
    ["friday", WEEKDAY, day(5)],
    ["weekend", WEEKDAY, (c) => (c.dow === 0 || c.dow === 6) && !night(c)],
    ["saturday", WEEKDAY, day(6)],
    ["sunday", WEEKDAY, day(0)],

    ["mondayMorning", COMBO, (c) => c.dow === 1 && c.h >= 5 && c.h < 11],
    ["sundayLate", COMBO, (c) => (c.dow === 0 && c.h >= 22) || (c.dow === 1 && c.h < 5)],
    ["fridayAfternoon", COMBO, (c) => c.dow === 5 && c.h >= 14 && c.h < 18],
    ["fridayNight", COMBO, (c) => (c.dow === 5 && c.h >= 18) || (c.dow === 6 && c.h < 5)],
    ["saturdayNight", COMBO, (c) => (c.dow === 6 && c.h >= 20) || (c.dow === 0 && c.h < 5)],
    ["sundayEvening", COMBO, (c) => c.dow === 0 && c.h >= 17 && c.h < 22],

    ["newYear", HOLIDAY, on(1, 1)],
    ["newYearsEve", HOLIDAY, on(12, 31)],
    ["winter", HOLIDAY, (c) => c.m === 12 && c.d >= 24 && c.d <= 26],
    ["valentine", HOLIDAY, on(2, 14)],
    ["leapDay", HOLIDAY, on(2, 29)],
    ["piDay", HOLIDAY, on(3, 14)],
    ["aprilFools", HOLIDAY, on(4, 1)],
    ["earthDay", HOLIDAY, on(4, 22)],
    ["starWars", HOLIDAY, on(5, 4)],
    ["towelDay", HOLIDAY, on(5, 25)],
    ["sysadminDay", HOLIDAY, (c) => c.m === 7 && c.dow === 5 && c.d > 24], // last Friday of July
    ["programmersDay", HOLIDAY, (c) => c.yday === 256],
    ["adaLovelaceDay", HOLIDAY, (c) => c.m === 10 && c.dow === 2 && c.d > 7 && c.d <= 14], // 2nd Tuesday
    ["halloween", HOLIDAY, on(10, 31)],
    ["winterSolstice", HOLIDAY, on(12, 21)],
    ["friday13", HOLIDAY, (c) => c.dow === 5 && c.d === 13],
    ["easter", HOLIDAY, (c) => c.m === c.easter[0] && c.d === c.easter[1]],
];

/** Western Easter Sunday as [month, day] (anonymous Gregorian algorithm). */
export function easter(y: number): [number, number] {
    const a = y % 19;
    const b = Math.floor(y / 100);
    const c = y % 100;
    const h = (19 * a + b - Math.floor(b / 4) - Math.floor((8 * b + 13) / 25) + 15) % 30;
    const l = (32 + 2 * (b % 4) + 2 * Math.floor(c / 4) - h - (c % 4)) % 7;
    const m = Math.floor((a + 11 * h + 22 * l) / 451);
    const n = h + l - 7 * m + 114;
    return [Math.floor(n / 31), (n % 31) + 1];
}

function context(date: Date): Ctx {
    const y = date.getFullYear();
    const m = date.getMonth() + 1;
    const d = date.getDate();
    // calendar days in UTC, so DST shifts can't skew the count
    const yday = (Date.UTC(y, m - 1, d) - Date.UTC(y, 0, 1)) / 864e5 + 1;
    return { y, m, d, dow: date.getDay(), h: date.getHours(), yday, easter: easter(y) };
}

export type Greeting = { id: string; text: string };

const fill = (text: string, c: Ctx) => text.replace("{year}", String(c.y)).replace("{next}", String(c.y + 1));

/** One line for this moment, never `previousId` again; `random` makes it deterministic. */
export function pickGreeting(date: Date, previousId?: string | null, random = Math.random): Greeting {
    const c = context(date);
    const pools = rules.flatMap(([pool, weight, when]) => {
        if (!when(c)) return [];
        const ids = en[pool].map((_, i) => `${pool}.${i}`).filter((id) => id !== previousId);
        return ids.length ? [{ pool, weight, ids }] : [];
    });
    let x = random() * pools.reduce((sum, p) => sum + p.weight, 0);
    const p = pools.find((p) => (x -= p.weight) < 0) ?? pools[0];
    const id = p.ids[Math.floor(random() * p.ids.length)];
    return { id, text: fill(en[p.pool][Number(id.slice(p.pool.length + 1))], c) };
}

/** how long one line is kept, so opening tabs in a row doesn't reroll it */
export const HOLD = 60 * 60 * 1000;

export type Held = { id: string; at: number };

/**
 * The line to show: the saved one while it is younger than HOLD and still fits the moment
 * (a "good morning" doesn't outlive the morning, a holiday line the day), else a new pick.
 * `held` is what to save back; it keeps its time while the line is reused.
 */
export function holdGreeting(date: Date, saved?: Held | null, random = Math.random): Greeting & { held: Held } {
    const now = date.getTime();
    if (saved && now >= saved.at && now - saved.at < HOLD) {
        const c = context(date);
        const pool = saved.id.slice(0, saved.id.lastIndexOf("."));
        const text = en[pool as Pool]?.[Number(saved.id.slice(pool.length + 1))];
        if (text && rules.some(([name, , when]) => name === pool && when(c))) {
            return { id: saved.id, text: fill(text, c), held: saved };
        }
    }
    const g = pickGreeting(date, saved?.id, random);
    return { ...g, held: { id: g.id, at: now } };
}
