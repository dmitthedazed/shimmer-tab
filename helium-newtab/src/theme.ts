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
    const key = `${seed}:${isDark()}`;
    if (key === applied) return false;
    const root = document.documentElement.style;
    for (const [prop, color] of Object.entries(isDark() ? palette.dark : palette.light)) {
        root.setProperty(prop, color);
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
    try {
        localStorage.setItem(CACHE, seed);
    } catch {}
    if (palette?.seed !== seed) await expand(seed);
    return { changed: apply(seed), fromPolicy: !!policy };
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
    try {
        localStorage.removeItem(CACHE);
        localStorage.removeItem(PALETTE);
    } catch {}
    return had;
}
