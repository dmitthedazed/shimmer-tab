// Browser color hack: Chromium has no API that exposes the browser theme to extensions,
// but the color comes from the BrowserThemeColor policy, so we read the policy file
// (needs "Allow access to file URLs") and expand the seed into a Material palette
// the same way Chromium does (tonal spot). The palette library is loaded only to expand a
// new seed; both schemes are kept in localStorage, so tabs paint them synchronously.
import { isDark } from "./scheme.svelte";

const POLICY_DIRS = ["/etc/chromium/policies/managed/", "/etc/chromium/policies/recommended/"];
const CACHE = "browser-theme-seed";
const PALETTE = "browser-theme-palette";
const dark = window.matchMedia("(prefers-color-scheme: dark)");
let lastSeed = "";

// CSS variable → MaterialDynamicColors role
const map = {
    "--bg-surface": "surface",
    "--background": "surface",
    "--primary": "onSurface",
    "--secondary": "onSurfaceVariant",
    "--tertiary": "outline",
    "--white": "onPrimary",
    "--helium-blue": "primary",
    "--helium-blue-hover": "primary",
    "--helium-blue-press": "primary",
    "--helium-elevated": "primary",
    "--tooltip-bg": "surfaceContainerHigh",
    "--bg-gradient-start": "surfaceContainerLow",
    "--bg-gradient-end": "primaryContainer",
    "--stars-top": "surfaceContainerLowest",
    "--stars-bottom": "primaryContainer",
    "--star-color": "onPrimaryContainer",
} as const;

type Palette = { seed: string; light: Record<string, string>; dark: Record<string, string> };
let palette: Palette | null = null;

async function expand(seed: string) {
    const { Hct, MaterialDynamicColors: C, SchemeTonalSpot, argbFromHex, hexFromArgb } =
        await import("@material/material-color-utilities");
    const colors = (night: boolean) => {
        const scheme = new SchemeTonalSpot(Hct.fromInt(argbFromHex(seed)), night, 0);
        return Object.fromEntries(
            Object.entries(map).map(([prop, role]) => [prop, hexFromArgb(C[role].getArgb(scheme))]),
        );
    };
    palette = { seed, light: colors(false), dark: colors(true) };
    try {
        localStorage.setItem(PALETTE, JSON.stringify(palette));
    } catch {}
}

let applied = "";

// The wallpaper's colors are for the page, not for the Shimmer and Stars backgrounds (or their
// previews in settings): when the palette is the picture's, these keep their own colors.
const OWN = ["--bg-gradient-start", "--bg-gradient-end", "--stars-top", "--stars-bottom", "--star-color"];
const PICTURE_FLAG = "browser-theme-picture";
let fromPicture = (() => {
    try {
        return localStorage.getItem(PICTURE_FLAG) === "1";
    } catch {
        return false;
    }
})();

// With browser colors on, a picture only lends its accent: these roles come from the picture's
// palette on top of the browser's.
const ACCENT = ["--helium-blue", "--helium-blue-hover", "--helium-blue-press", "--helium-elevated"];
const ACCENT_CACHE = "picture-accent";
type Accent = { seed: string; light: Record<string, string>; dark: Record<string, string> };
let accent: Accent | null = (() => {
    try {
        return JSON.parse(localStorage.getItem(ACCENT_CACHE) ?? "null");
    } catch {
        return null;
    }
})();

function readFile(path: string): Promise<string | null> {
    // fetch() refuses file://, XHR works for extensions with file access
    return new Promise((resolve) => {
        const xhr = new XMLHttpRequest();
        xhr.open("GET", `file://${path}`);
        xhr.onload = () => resolve(xhr.responseText || null);
        xhr.onerror = () => resolve(null);
        try {
            xhr.send();
        } catch {
            resolve(null);
        }
    });
}

async function readPolicySeed(): Promise<string | null> {
    for (const dir of POLICY_DIRS) {
        const listing = await readFile(dir);
        if (!listing) continue;
        const files = [...listing.matchAll(/addRow\("([^"]+\.json)"/g)].map((m) => m[1]);
        for (const name of files.sort()) {
            try {
                const color = JSON.parse((await readFile(dir + name)) ?? "{}").BrowserThemeColor;
                if (typeof color === "string" && /^#[0-9a-f]{6}$/i.test(color)) return color;
            } catch {}
        }
    }
    return null;
}

/** Needs `palette` expanded for this seed. */
function apply(seed: string) {
    if (palette?.seed !== seed) return false;
    lastSeed = seed;
    // follows the forced dark scheme of the starfield too, not just the system
    const key = `${seed}:${isDark()}:${accent?.seed ?? ""}:${fromPicture}`;
    if (key === applied) return false;
    const root = document.documentElement.style;
    const scheme = isDark() ? "dark" : "light";
    for (const [prop, color] of Object.entries(palette[scheme])) {
        if (fromPicture && OWN.includes(prop)) root.removeProperty(prop);
        else root.setProperty(prop, accent && ACCENT.includes(prop) ? accent[scheme][prop] : color);
    }
    applied = key;
    return true;
}

/** Applies the last seed synchronously so new tabs don't flash default colors. */
export function applyCachedBrowserTheme() {
    try {
        const seed = localStorage.getItem(CACHE);
        if (!seed) return;
        const cached: Palette | null = JSON.parse(localStorage.getItem(PALETTE) ?? "null");
        if (cached?.seed === seed && cached.light && cached.dark) palette = cached;
        apply(seed);
    } catch {}
}

/** Without "Allow access to file URLs" the policy files can't be read at all. */
export async function hasFileAccess() {
    try {
        return (await chrome.extension?.isAllowedFileSchemeAccess?.()) ?? false;
    } catch {
        return false;
    }
}

/**
 * The policy's color, or `own` when the browser isn't managed (no policy) or its files
 * can't be read; null if there's neither. `changed`: the page colors changed.
 */
export async function applyBrowserTheme(
    own = "",
): Promise<{ changed: boolean; fromPolicy: boolean } | null> {
    const policy = await readPolicySeed();
    const seed = policy ?? (/^#[0-9a-f]{6}$/i.test(own) ? own : null);
    if (!seed) return null;
    fromPicture = false;
    try {
        localStorage.setItem(CACHE, seed);
        localStorage.removeItem(PICTURE_FLAG);
    } catch {}
    if (palette?.seed !== seed) await expand(seed);
    return { changed: apply(seed), fromPolicy: !!policy };
}

/** The picture's most vivid color: the hue with the most saturated weight, averaged. */
export async function pictureSeed(url: string): Promise<string | null> {
    try {
        const img = new Image();
        img.src = url;
        await img.decode();
        const S = 48;
        const ctx = new OffscreenCanvas(S, S).getContext("2d", { willReadFrequently: true })!;
        ctx.drawImage(img, 0, 0, S, S);
        const d = ctx.getImageData(0, 0, S, S).data;
        const bins = Array.from({ length: 12 }, () => [0, 0, 0, 0]); // r, g, b, weight
        for (let i = 0; i < d.length; i += 4) {
            const [r, g, b] = [d[i], d[i + 1], d[i + 2]];
            const max = Math.max(r, g, b), min = Math.min(r, g, b);
            const chroma = (max - min) / 255;
            const mid = (max + min) / 510;
            const w = chroma * (1 - Math.abs(2 * mid - 1)); // vivid, not near white/black
            if (w < 0.02) continue;
            const h = max === r ? ((g - b) / (max - min) + 6) % 6 : max === g ? (b - r) / (max - min) + 2 : (r - g) / (max - min) + 4;
            const bin = bins[Math.floor(h * 2) % 12];
            bin[0] += r * w; bin[1] += g * w; bin[2] += b * w; bin[3] += w;
        }
        const best = bins.reduce((a, b) => (b[3] > a[3] ? b : a));
        if (best[3] < 0.5) return null;
        const hex = (v: number) => Math.round(v / best[3]).toString(16).padStart(2, "0");
        return `#${hex(best[0])}${hex(best[1])}${hex(best[2])}`;
    } catch {
        return null;
    }
}

/** Colors from a seed of our own (the wallpaper's); true if the page colors changed. */
export async function applySeedTheme(seed: string): Promise<boolean> {
    fromPicture = true;
    try {
        localStorage.setItem(CACHE, seed);
        localStorage.setItem(PICTURE_FLAG, "1");
    } catch {}
    if (palette?.seed !== seed) await expand(seed);
    return apply(seed);
}

/** The picture's accent over the browser palette (null: none); true if the page colors changed. */
export async function setPictureAccent(seed: string | null): Promise<boolean> {
    if (!seed) {
        if (!accent) return false;
        accent = null;
        try {
            localStorage.removeItem(ACCENT_CACHE);
        } catch {}
    } else if (accent?.seed !== seed) {
        const { Hct, MaterialDynamicColors: C, SchemeTonalSpot, argbFromHex, hexFromArgb } =
            await import("@material/material-color-utilities");
        const roles = { "--helium-blue": "primary", "--helium-blue-hover": "primary", "--helium-blue-press": "primary", "--helium-elevated": "primary" } as const;
        const colors = (night: boolean) => {
            const scheme = new SchemeTonalSpot(Hct.fromInt(argbFromHex(seed)), night, 0);
            return Object.fromEntries(ACCENT.map((p) => [p, hexFromArgb(C[roles[p as keyof typeof roles]].getArgb(scheme))]));
        };
        accent = { seed, light: colors(false), dark: colors(true) };
        try {
            localStorage.setItem(ACCENT_CACHE, JSON.stringify(accent));
        } catch {}
    } else return false;
    return lastSeed ? apply(lastSeed) : false;
}

/** Re-applies the current browser palette after a light/dark change; true if it changed. */
export function refreshBrowserTheme() {
    return lastSeed ? apply(lastSeed) : false;
}

export function onSchemeChange(fn: () => void) {
    dark.addEventListener("change", fn);
    return () => dark.removeEventListener("change", fn);
}

/** Returns true if browser colors were applied before. */
export function clearBrowserTheme() {
    const had = applied !== "";
    const root = document.documentElement.style;
    for (const prop of Object.keys(map)) root.removeProperty(prop);
    applied = "";
    lastSeed = "";
    palette = null;
    accent = null;
    fromPicture = false;
    try {
        localStorage.removeItem(ACCENT_CACHE);
        localStorage.removeItem(PICTURE_FLAG);
        localStorage.removeItem(CACHE);
        localStorage.removeItem(PALETTE);
    } catch {}
    return had;
}
