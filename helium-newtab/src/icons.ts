import { canReadSites, WEB } from "./permissions.svelte";

// High-res site icons. The browser's favicon cache only has 16–32px icons, so we look
// for what the site offers for home screens instead: web app manifest icons, apple-touch-icon,
// SVG favicons and sized <link rel="icon">s, take the largest one, rasterize it to 192px and
// cache it locally. Reading sites needs the optional host permission (see permissions.svelte.ts).

export type SiteIcon = {
    /** 192px PNG or SVG data URL, or "" if the site has nothing usable */
    src: string;
    /** SVG variant for dark backgrounds, when the logo has one */
    dark?: string;
    /** opaque square icon (app-icon style), drawn with rounded corners */
    fullBleed: boolean;
    /** optical fit: scale and offset (fractions of the tile) that center the artwork */
    fit?: Fit;
};

/** s/x/y: scale and offset; b: artwork box (max side, 0..1); f: it's a filled square */
export type Fit = { s: number; x: number; y: number; b?: number; f?: boolean };

type Candidate = { url: string; size: number; kind: "manifest" | "apple" | "svg" | "icon" };

const SIZE = 192;
const MIN_SIZE = 48;
const MAX_AGE = 30 * 24 * 60 * 60 * 1000;
const TIMEOUT = 8000;
// bumped when the stored shape changes
const PREFIX = "icon3:";
const SVG_PREFIX = "svg4:";

// Share of the tile area a logo should cover. Logos differ a lot in padding, shape and
// aspect ratio, so we measure the actual artwork and size it by area instead of by box.
const TARGET_AREA = 0.66;
const ALPHA = 24;

/** Finds the drawn artwork on an n×n canvas and derives how to fit it optically. */
function analyze(ctx: CanvasRenderingContext2D, n: number): { fit: Fit; fullBleed: boolean } {
    const { data } = ctx.getImageData(0, 0, n, n);
    let minX = n, minY = n, maxX = -1, maxY = -1, filled = 0;
    for (let y = 0; y < n; y++) {
        for (let x = 0; x < n; x++) {
            if (data[(y * n + x) * 4 + 3] <= ALPHA) continue;
            filled++;
            if (x < minX) minX = x;
            if (x > maxX) maxX = x;
            if (y < minY) minY = y;
            if (y > maxY) maxY = y;
        }
    }
    if (maxX < 0) return { fit: { s: 1, x: 0, y: 0 }, fullBleed: false };

    const bw = (maxX - minX + 1) / n;
    const bh = (maxY - minY + 1) / n;
    // a circle looks smaller than a square of the same box, so count coverage in half
    const coverage = filled / ((maxX - minX + 1) * (maxY - minY + 1));
    const area = bw * bh * (0.5 + 0.5 * coverage);
    const s = Math.min(Math.sqrt(TARGET_AREA / area), 0.92 / Math.max(bw, bh), 3);

    const alpha = (x: number, y: number) => data[(Math.round(y) * n + Math.round(x)) * 4 + 3];
    const i = n * 0.06;
    const j = n - 1 - i;
    const fullBleed =
        bw > 0.97 && bh > 0.97 && [alpha(i, i), alpha(j, i), alpha(i, j), alpha(j, j)].every((a) => a > 250);

    // a filled (rounded) square, i.e. the logo already is an app icon
    const square = Math.abs(bw - bh) < 0.06 * Math.max(bw, bh);
    return {
        fit: {
            b: Math.round(Math.max(bw, bh) * 1000) / 1000,
            f: square && coverage > 0.86,
            s: Math.round(s * 1000) / 1000,
            x: Math.round((0.5 - (minX + maxX + 1) / 2 / n) * 1000) / 1000,
            y: Math.round((0.5 - (minY + maxY + 1) / 2 / n) * 1000) / 1000,
        },
        fullBleed,
    };
}

function loadUrl(src: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = src;
    });
}

/** Measures a (vector) image without rasterizing what we store. */
export async function measure(src: string): Promise<{ fit: Fit; fullBleed: boolean } | null> {
    try {
        const img = await loadUrl(src);
        const n = 128;
        const canvas = document.createElement("canvas");
        canvas.width = canvas.height = n;
        const ctx = canvas.getContext("2d", { willReadFrequently: true })!;
        const w = img.naturalWidth || n;
        const h = img.naturalHeight || n;
        const k = n / Math.max(w, h);
        ctx.drawImage(img, (n - w * k) / 2, (n - h * k) / 2, w * k, h * k);
        return analyze(ctx, n);
    } catch {
        return null;
    }
}

const hasChrome = typeof chrome !== "undefined" && !!chrome.storage?.local;
const memory = new Map<string, Promise<SiteIcon>>();

// lookups made without access to sites hold placeholders; drop them when access changes
if (typeof chrome !== "undefined" && chrome.permissions) {
    chrome.permissions.onAdded.addListener(() => memory.clear());
    chrome.permissions.onRemoved.addListener(() => memory.clear());
}

const origin = (url: string) => {
    try {
        return new URL(url).origin;
    } catch {
        return url;
    }
};

async function readCache(key: string): Promise<(SiteIcon & { at: number }) | null> {
    try {
        if (hasChrome) return ((await chrome.storage.local.get(key))[key] as never) ?? null;
        return JSON.parse(localStorage.getItem(key) ?? "null");
    } catch {
        return null;
    }
}

async function writeCache(key: string, icon: SiteIcon) {
    const value = { ...icon, at: Date.now() };
    try {
        if (hasChrome) await chrome.storage.local.set({ [key]: value });
        else localStorage.setItem(key, JSON.stringify(value));
    } catch {}
}

// Only public http(s) addresses. A site's manifest or <link> tags decide which URLs we
// fetch, so without this a page could point us at file://, localhost or the local network.
const PRIVATE_V4 = [
    [0, 8], [10, 8], [100, 64, 10], [127, 8], [169, 254, 16], [172, 16, 12], [192, 0, 24],
    [192, 168, 16], [198, 18, 15], [224, 4], [240, 4],
] as const;

function isPublicHttp(raw: string) {
    let url: URL;
    try {
        url = new URL(raw);
    } catch {
        return false;
    }
    if (url.protocol !== "https:" && url.protocol !== "http:") return false;
    // "localhost." resolves like "localhost"
    const host = url.hostname.toLowerCase().replace(/\.+$/, "");
    if (host === "localhost" || /\.(localhost|local|internal|lan|home\.arpa)$/.test(host)) return false;
    const v4 = host.match(/^(\d+)\.(\d+)\.(\d+)\.(\d+)$/);
    if (v4) {
        const ip = v4.slice(1).reduce((n, o) => n * 256 + Number(o), 0);
        return !PRIVATE_V4.some((r) => {
            const [a, b, bits] = r.length === 2 ? [r[0], 0, r[1]] : r;
            const base = (a * 256 + b) * 65536;
            return Math.floor(ip / 2 ** (32 - bits)) === Math.floor(base / 2 ** (32 - bits));
        });
    }
    if (host.startsWith("[")) {
        // IPv6 literal: loopback, IPv4-mapped, unique local (fc00::/7), link-local (fe80::/10)
        return !/^\[(::1?\]|::ffff:|f[cd][0-9a-f]*:|fe[89ab][0-9a-f]*:)/.test(host);
    }
    return true;
}

/**
 * `follow` only for the site's own page (the user picked that URL). Icon URLs come from
 * the site's markup, so they may not redirect: an extension can't see a redirect's target
 * before following it, so it can't check it first.
 */
async function get(url: string, accept: string, redirect: RequestRedirect = "error") {
    if (!isPublicHttp(url)) throw new Error("not a public http(s) URL");
    const res = await fetch(url, {
        credentials: "omit",
        redirect,
        headers: { accept },
        signal: AbortSignal.timeout(TIMEOUT),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    // redirects get the same check
    if (res.url && !isPublicHttp(res.url)) throw new Error("redirected to a non-public URL");
    return res;
}

const parseSizes = (sizes: string | null | undefined) => {
    if (!sizes) return 0;
    if (/any/i.test(sizes)) return 1024;
    return Math.max(0, ...sizes.split(/\s+/).map((s) => parseInt(s, 10) || 0));
};

async function findCandidates(site: string): Promise<Candidate[]> {
    const list: Candidate[] = [];
    let base = site;

    try {
        const res = await get(site, "text/html", "follow");
        base = res.url || site;
        const doc = new DOMParser().parseFromString(await res.text(), "text/html");
        const abs = (href: string) => new URL(href, base).href;

        const manifest = doc.querySelector<HTMLLinkElement>('link[rel~="manifest"]');
        if (manifest?.getAttribute("href")) {
            try {
                const manifestUrl = abs(manifest.getAttribute("href")!);
                const json = await (await get(manifestUrl, "application/json")).json();
                for (const icon of json.icons ?? []) {
                    if (!icon?.src) continue;
                    // monochrome icons are single-color silhouettes meant for tinting
                    if (/monochrome/.test(icon.purpose ?? "") && !/any/.test(icon.purpose ?? "")) continue;
                    // maskable icons have a big safe-zone padding, use them only as a last resort
                    const maskableOnly = /maskable/.test(icon.purpose ?? "") && !/any/.test(icon.purpose ?? "");
                    list.push({
                        url: new URL(icon.src, manifestUrl).href,
                        size: parseSizes(icon.sizes) / (maskableOnly ? 4 : 1),
                        kind: "manifest",
                    });
                }
            } catch {}
        }

        for (const link of doc.querySelectorAll<HTMLLinkElement>("link[rel][href]")) {
            const rel = link.getAttribute("rel")!.toLowerCase();
            const href = abs(link.getAttribute("href")!);
            if (rel.includes("apple-touch-icon")) {
                list.push({ url: href, size: parseSizes(link.getAttribute("sizes")) || 180, kind: "apple" });
            } else if (/(^|\s)icon(\s|$)/.test(rel) || rel.includes("shortcut")) {
                const svg = link.type === "image/svg+xml" || /\.svg(\?|$)/i.test(href);
                list.push(
                    svg
                        ? { url: href, size: 512, kind: "svg" }
                        : { url: href, size: parseSizes(link.getAttribute("sizes")) || 32, kind: "icon" },
                );
            }
        }
    } catch {}

    // well-known fallbacks for sites that don't declare them
    list.push({ url: new URL("/apple-touch-icon.png", base).href, size: 180, kind: "apple" });
    list.push({ url: new URL("/favicon.ico", base).href, size: 32, kind: "icon" });

    const rank = { manifest: 3, apple: 2, svg: 1, icon: 0 };
    const seen = new Set<string>();
    return list
        .filter((c) => !seen.has(c.url) && seen.add(c.url))
        .sort((a, b) => b.size - a.size || rank[b.kind] - rank[a.kind]);
}

function loadImage(blob: Blob): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
        const url = URL.createObjectURL(blob);
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = url;
        img.decode?.().catch(() => {});
        setTimeout(() => URL.revokeObjectURL(url), TIMEOUT);
    });
}

/** Draws the icon centered on a SIZE×SIZE canvas; returns null if it's too small. */
function rasterize(img: HTMLImageElement, svg: boolean): SiteIcon | null {
    const w = img.naturalWidth || (svg ? SIZE : 0);
    const h = img.naturalHeight || (svg ? SIZE : 0);
    if (!svg && Math.min(w, h) < MIN_SIZE) return null;

    const canvas = document.createElement("canvas");
    canvas.width = canvas.height = SIZE;
    const ctx = canvas.getContext("2d", { willReadFrequently: true })!;
    ctx.imageSmoothingQuality = "high";
    const scale = SIZE / Math.max(w, h);
    const dw = w * scale;
    const dh = h * scale;
    ctx.drawImage(img, (SIZE - dw) / 2, (SIZE - dh) / 2, dw, dh);

    return { src: canvas.toDataURL("image/png"), ...analyze(ctx, SIZE) };
}

async function resolve(site: string): Promise<SiteIcon> {
    for (const candidate of await findCandidates(site)) {
        try {
            const blob = await (await get(candidate.url, "image/*")).blob();
            if (!blob.type.startsWith("image/") && candidate.kind !== "icon") continue;
            const svg = blob.type.includes("svg") || candidate.kind === "svg";
            const icon = rasterize(await loadImage(blob), svg);
            if (icon) return icon;
        } catch {}
    }
    return { src: "", fullBleed: false };
}

// Vector logos for popular services from svgl (scripts/refresh-svg-icons.mjs).
type SvgEntry = { p: string; s?: string; l?: string; d?: string };
// svgl.app sends no CORS headers, so the web page reads the same files from its repo
const SVGL = WEB
    ? "https://cdn.jsdelivr.net/gh/pheralb/svgl@main/static/library/"
    : "https://svgl.app/library/";
let svgMap: Promise<Record<string, SvgEntry[]>> | undefined;

function loadSvgMap() {
    svgMap ??= fetch("svg-icons.json")
        .then((r) => (r.ok ? r.json() : {}))
        .catch(() => ({}));
    return svgMap;
}

async function findSvg(url: string): Promise<SvgEntry | null> {
    let parsed: URL;
    try {
        parsed = new URL(url);
    } catch {
        return null;
    }
    const map = await loadSvgMap();
    const path = parsed.pathname.replace(/\/+$/, "") || "/";
    const labels = parsed.hostname.replace(/^www\./, "").toLowerCase().split(".");
    // exact host first, then parent domains (mail.example.com → example.com)
    for (let i = 0; i < labels.length - 1; i++) {
        const entries = map[labels.slice(i).join(".")];
        if (!entries) continue;
        const matches = entries.filter(
            (e) => e.p === "/" || path === e.p || path.startsWith(e.p + "/"),
        );
        if (matches.length) return matches.sort((a, b) => b.p.length - a.p.length)[0];
    }
    return null;
}

async function svgDataUrl(file: string) {
    const res = await get(file.startsWith("http") ? file : SVGL + file, "image/svg+xml");
    const doc = new DOMParser().parseFromString(await res.text(), "image/svg+xml");
    const svg = doc.documentElement;
    if (svg.nodeName.toLowerCase() !== "svg") throw new Error("not an svg");
    // explicit pixel size from the viewBox, so <img> and the canvas we measure on
    // lay it out the same way (percent or missing sizes render differently)
    const box = svg.getAttribute("viewBox")?.trim().split(/[\s,]+/).map(Number);
    if (box?.length === 4 && box[2] > 0 && box[3] > 0) {
        svg.setAttribute("width", String(box[2]));
        svg.setAttribute("height", String(box[3]));
    }
    const text = new XMLSerializer().serializeToString(svg);
    return `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(text)))}`;
}

async function resolveSvg(entry: SvgEntry): Promise<SiteIcon | null> {
    try {
        const [light, dark] = entry.s
            ? [await svgDataUrl(entry.s), undefined]
            : await Promise.all([svgDataUrl(entry.l!), svgDataUrl(entry.d!)]);
        // both variants share the geometry, measure one
        const shape = (await measure(light)) ?? { fit: undefined, fullBleed: false };
        return { src: light, dark, ...shape };
    } catch {
        return null;
    }
}

// svgl unreachable (offline, down, blocked): leave it alone for a few minutes instead of
// asking again on every tab
const SVGL_REST = "svgl-rest";
const svglResting = () => {
    try {
        return Date.now() - Number(localStorage.getItem(SVGL_REST)) < 10 * 60 * 1000;
    } catch {
        return false;
    }
};
const restSvgl = () => {
    try {
        localStorage.setItem(SVGL_REST, String(Date.now()));
    } catch {}
};

/** Cached HQ icon for a site; resolves to src "" when the site has none. */
export function siteIcon(url: string): Promise<SiteIcon> {
    const site = origin(url);
    const memoKey = url;
    let pending = memory.get(memoKey);
    if (pending) return pending;

    pending = (async () => {
        const svg = svglResting() ? null : await findSvg(url);
        if (svg) {
            const key = SVG_PREFIX + (svg.s ?? svg.l);
            const cached = await readCache(key);
            if (cached?.src) return cached;
            const icon = await resolveSvg(svg);
            if (icon) {
                await writeCache(key, icon);
                return icon;
            }
            restSvgl();
        }

        const key = PREFIX + site;
        const cached = await readCache(key);
        if (cached && Date.now() - cached.at < MAX_AGE) return cached;
        // without access to sites: the browser's own favicon, not cached, so the real
        // icon replaces it once access is granted
        if (!(await canReadSites())) return cached?.src ? cached : browserFavicon(site);
        const icon = await resolve(site);
        // keep a stale icon over a failed refresh
        if (!icon.src && cached?.src) return cached;
        await writeCache(key, icon);
        return icon;
    })();
    memory.set(memoKey, pending);
    return pending;
}

function faviconUrl(site: string) {
    const url = new URL(chrome.runtime.getURL("/_favicon/"));
    url.searchParams.set("pageUrl", site);
    url.searchParams.set("size", "64");
    return url.toString();
}

/** A small pixel fingerprint, to spot the browser's generic globe icon. */
async function fingerprint(src: string) {
    try {
        const img = await loadUrl(src);
        const canvas = document.createElement("canvas");
        canvas.width = canvas.height = 16;
        const ctx = canvas.getContext("2d", { willReadFrequently: true })!;
        ctx.drawImage(img, 0, 0, 16, 16);
        return Array.from(ctx.getImageData(0, 0, 16, 16).data, (v) => v >> 4).join("");
    } catch {
        return "";
    }
}

let globe: Promise<string> | undefined;

async function browserFavicon(site: string): Promise<SiteIcon> {
    const none = { src: "", fullBleed: false };
    if (typeof chrome === "undefined" || !chrome.runtime?.id) return none;
    const src = faviconUrl(site);
    // a site the browser hasn't seen gets the generic globe: a letter looks better
    globe ??= fingerprint(faviconUrl("https://unknown.invalid/"));
    const [own, generic] = await Promise.all([fingerprint(src), globe]);
    if (!own || own === generic) return none;
    const shape = await measure(src);
    return { src, fullBleed: false, ...(shape ?? {}) };
}

/** Drops the cached icon so the next lookup fetches it again. */
export function forgetIcon(url: string) {
    memory.delete(url);
    const key = PREFIX + origin(url);
    if (hasChrome) chrome.storage.local.remove(key).catch(() => {});
    else localStorage.removeItem(key);
}
