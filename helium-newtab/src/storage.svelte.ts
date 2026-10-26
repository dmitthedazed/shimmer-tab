export type Shortcut = { title: string; url: string };

export type Settings = {
    background: "shimmer" | "stars" | "weather" | "image" | "random" | "none";
    /** blur of the picture wallpaper, in px */
    imageBlur: number;
    clock: boolean;
    hour12: boolean;
    seconds: boolean;
    browserTheme: boolean;
    /** seed for browser colors when no BrowserThemeColor policy is set (unmanaged browsers) */
    themeColor: string;
    bangs: boolean;
    /** next to the mark: a line for the time of day, the "Helium" wordmark, or nothing */
    logo: "greeting" | "wordmark" | "clock" | "bigClock" | "mark";
    /** where the logo, search and shortcuts sit across the page */
    align: "left" | "center" | "right";
    /** focus mode: only the logo and the search bar */
    quiet: boolean;
    /** entrance animation of the wallpaper on page load */
    intro: boolean;
    shortcuts: boolean;
    lockShortcuts: boolean;
    shortcutTitles: boolean;
    /** paint all icons in one color */
    iconTint: boolean;
    /** "accent", "text" or a hex color */
    tintColor: string;
    iconStyle: "plain" | "contained";
    links: Shortcut[];
    topSites: boolean;
    weather: boolean;
    city: string;
    fahrenheit: boolean;
};

export const defaults: Settings = {
    background: "shimmer",
    imageBlur: 0,
    clock: true,
    hour12: false,
    seconds: false,
    browserTheme: false,
    themeColor: "",
    bangs: true,
    logo: "greeting",
    align: "center",
    quiet: false,
    intro: true,
    shortcuts: true,
    lockShortcuts: false,
    shortcutTitles: true,
    iconTint: false,
    tintColor: "accent",
    iconStyle: "plain",
    links: [
        { title: "GitHub", url: "https://github.com/" },
        { title: "YouTube", url: "https://www.youtube.com/" },
        { title: "Helium", url: "https://helium.computer/" },
    ],
    topSites: false,
    weather: false,
    city: "",
    fahrenheit: false,
};

const KEY = "settings";
const hasChrome = typeof chrome !== "undefined" && !!chrome.storage?.sync;

const MIRROR = "settings-mirror";

export function normalize(raw: Record<string, unknown> | null | undefined): Settings {
    const settings = { ...defaults, ...(raw ?? {}) } as Settings;
    // pre-1.1 had a plain shimmer on/off toggle
    if (raw && !raw.background && raw.shimmer === false) settings.background = "none";
    delete (settings as { shimmer?: boolean }).shimmer;
    // before greetings: a `logoText` toggle; existing setups keep what they had
    if (raw && !["greeting", "wordmark", "clock", "bigClock", "mark"].includes(raw.logo as string))
        settings.logo = Object.keys(raw).length ? (raw.logoText === false ? "mark" : "wordmark") : defaults.logo;
    delete (settings as { logoText?: boolean }).logoText;
    // imported backups go through here too: only links that open as pages
    if (Array.isArray(settings.links)) {
        settings.links = settings.links.flatMap((link) => {
            const url = typeof link?.url === "string" ? normalizeUrl(link.url) : null;
            return url ? [{ title: String(link.title ?? ""), url }] : [];
        });
    } else settings.links = [...defaults.links];
    return settings;
}

/**
 * Synchronous first guess from a localStorage mirror of the synced settings, so the first
 * frame already has the right logo, background and widgets instead of the defaults.
 */
export function loadCached(): Settings {
    try {
        return normalize(JSON.parse(localStorage.getItem(MIRROR) ?? "null"));
    } catch {
        return { ...defaults };
    }
}

// what the stores hold now, in a fixed key order: opening a tab must not write anything
let stored = "";
const canon = (settings: Settings) => JSON.stringify(normalize(settings as unknown as Record<string, unknown>));

export async function load(): Promise<Settings> {
    try {
        const raw = hasChrome
            ? (await chrome.storage.sync.get(KEY))[KEY]
            : JSON.parse(localStorage.getItem(MIRROR) ?? "null");
        const settings = normalize(raw);
        stored = canon(settings);
        return settings;
    } catch {
        return loadCached();
    }
}

// the old runtime-downloaded bang cache is no longer used; dropped once, not on every tab
if (hasChrome && !localStorage.getItem("bangs-dropped")) {
    chrome.storage.local
        .remove("bangs")
        .then(() => localStorage.setItem("bangs-dropped", "1"))
        .catch(() => {});
}

// chrome.storage.sync allows ~120 writes a minute: typing a city must not spend them, and
// neither must a page that is reloaded over and over. Only real changes are written, and a
// burst of them as one write after it settles. The local mirror is cheap, so it is immediate.
let latest: Settings | null = null;
let timer: ReturnType<typeof setTimeout> | undefined;

async function flush() {
    clearTimeout(timer);
    const settings = latest;
    latest = null;
    if (!settings || !hasChrome) return;
    const json = canon(settings);
    if (json === stored) return;
    stored = json;
    try {
        await chrome.storage.sync.set({ [KEY]: settings });
    } catch {
        stored = ""; // over quota or offline: the next change tries again
    }
}

if (typeof addEventListener !== "undefined") addEventListener("pagehide", () => void flush());

export function save(settings: Settings) {
    const plain = $state.snapshot(settings);
    const json = canon(plain);
    if (!hasChrome && json === stored) return;
    try {
        if (localStorage.getItem(MIRROR) !== json) localStorage.setItem(MIRROR, json);
    } catch {}
    if (!hasChrome) return void (stored = json);
    latest = plain;
    clearTimeout(timer);
    if (json !== stored) timer = setTimeout(flush, 500);
}

const SAFE_SCHEMES = ["http:", "https:", "chrome:", "about:"];

export function normalizeUrl(input: string) {
    const s = input.trim();
    if (!s) return null;
    try {
        const url = new URL(/^[a-z][a-z0-9+.-]*:/i.test(s) ? s : `https://${s}`);
        // a pasted list or a backup must not slip in javascript: or data: links
        return SAFE_SCHEMES.includes(url.protocol) ? url.toString() : null;
    } catch {
        return null;
    }
}

/** Icon from the browser's own favicon cache, so typing sends no requests. */
export function favicon(origin: string, size = 18) {
    if (typeof chrome === "undefined" || !chrome.runtime?.id) return "";
    const url = new URL(chrome.runtime.getURL("/_favicon/"));
    url.searchParams.set("pageUrl", origin);
    url.searchParams.set("size", String(Math.ceil(size * (devicePixelRatio || 1))));
    return url.toString();
}

/** shortcuts from a JSON list (`[{ name, url }]` or `{ shortcuts: [...] }`) or plain text, one `[name] url` per line */
export function parseShortcuts(text: string): Shortcut[] {
    const make = (title: string | undefined, raw: unknown) => {
        const url = typeof raw === "string" ? normalizeUrl(raw) : null;
        if (!url) return [];
        return [{ title: title?.trim() || new URL(url).hostname.replace(/^www\./, ""), url }];
    };
    let json: unknown;
    try {
        json = JSON.parse(text);
    } catch {
        return text.split("\n").flatMap((line) => {
            const [first, ...rest] = line.trim().split(/\s+/);
            return rest.length ? make(first, rest.at(-1)) : make(undefined, first);
        });
    }
    const list = Array.isArray(json) ? json : Array.isArray((json as { shortcuts?: unknown })?.shortcuts) ? (json as { shortcuts: unknown[] }).shortcuts : [];
    return list.flatMap((x: { title?: string; name?: string; url?: unknown }) => make(x?.title || x?.name, x?.url));
}
