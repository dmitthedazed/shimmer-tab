// Single-color icons. A tint color can't simply replace an icon's pixels: YouTube would lose
// its play triangle and app icons would turn into flat squares. So we build an alpha mask per
// icon: the main body of a logo stays solid and near-white/near-black details (low saturation,
// far from the dominant lightness) become cut-outs. Opaque app icons get the reverse, iOS-style:
// a faint plate with the glyph at full strength. The mask is then filled with the tint in CSS.

const N = 192;
const cache = new Map<string, Promise<string>>();

function load(src: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = src;
    });
}

const clamp = (v: number) => Math.min(1, Math.max(0, v));

/** Most common color among opaque pixels (4 bits per channel buckets, averaged). */
export function dominantColor(d: Uint8ClampedArray, inset = 0.1): number[] {
    // skip the outer band: frames and white corners around a tile aren't its background
    const lo = Math.round(N * inset), hi = N - lo;
    const buckets = new Map<number, number[]>();
    for (let i = 0; i < d.length; i += 4) {
        const x = (i / 4) % N, y = Math.floor(i / 4 / N);
        if (x < lo || x >= hi || y < lo || y >= hi) continue;
        if (d[i + 3] < 200) continue;
        const key = ((d[i] >> 4) << 8) | ((d[i + 1] >> 4) << 4) | (d[i + 2] >> 4);
        const b = buckets.get(key) ?? [0, 0, 0, 0];
        b[0] += d[i]; b[1] += d[i + 1]; b[2] += d[i + 2]; b[3]++;
        buckets.set(key, b);
    }
    let best = [255, 255, 255, 0];
    for (const b of buckets.values()) if (b[3] > best[3]) best = b;
    return best[3] ? [best[0] / best[3], best[1] / best[3], best[2] / best[3]] : [255, 255, 255];
}

function dilate(src: Float32Array): Float32Array {
    const out = new Float32Array(src.length);
    for (let y = 0; y < N; y++) {
        for (let x = 0; x < N; x++) {
            let m = 0;
            for (let dy = -1; dy <= 1; dy++) {
                for (let dx = -1; dx <= 1; dx++) {
                    const xx = x + dx, yy = y + dy;
                    if (xx >= 0 && yy >= 0 && xx < N && yy < N) m = Math.max(m, src[yy * N + xx]);
                }
            }
            out[y * N + x] = m;
        }
    }
    return out;
}

async function build(src: string, opaque: boolean): Promise<string> {
    const img = await load(src);
    const canvas = document.createElement("canvas");
    canvas.width = canvas.height = N;
    const ctx = canvas.getContext("2d", { willReadFrequently: true })!;
    // same contain-fit as the <img>, so the mask lines up with the fit transform
    const w = img.naturalWidth || N;
    const h = img.naturalHeight || N;
    const k = N / Math.max(w, h);
    ctx.drawImage(img, (N - w * k) / 2, (N - h * k) / 2, w * k, h * k);
    const image = ctx.getImageData(0, 0, N, N);
    const d = image.data;

    const light = new Float32Array(N * N);
    const sat = new Float32Array(N * N);
    const seen: number[] = [];
    for (let i = 0; i < N * N; i++) {
        const r = d[i * 4] / 255, g = d[i * 4 + 1] / 255, b = d[i * 4 + 2] / 255;
        const max = Math.max(r, g, b), min = Math.min(r, g, b);
        light[i] = 0.2126 * r + 0.7152 * g + 0.0722 * b;
        sat[i] = max === 0 ? 0 : (max - min) / max;
        if (d[i * 4 + 3] > 128) seen.push(light[i]);
    }
    seen.sort((a, b) => a - b);
    const dominant = seen.length ? seen[Math.floor(seen.length / 2)] : 0;

    // opaque icons: the background is their most common color (edges can be a frame, like Notion's)
    const bg = opaque ? dominantColor(d) : [0, 0, 0];

    const details = new Float32Array(N * N);
    const alphas = new Float32Array(N * N);
    for (let i = 0; i < N * N; i++) {
        const a = d[i * 4 + 3] / 255;
        let detail: number;
        if (opaque) {
            // the glyph is anything that differs from the background color
            const dist = Math.hypot(d[i * 4] - bg[0], d[i * 4 + 1] - bg[1], d[i * 4 + 2] - bg[2]) / 441;
            detail = clamp((dist - 0.12) / 0.2);
        } else {
            // near-white/near-black details on a logo body become cut-outs
            detail = clamp((Math.abs(light[i] - dominant) - 0.3) / 0.3) * clamp(1 - sat[i] * 2.5);
        }
        details[i] = detail;
        alphas[i] = a;
    }

    // some app icons cut their glyph out of the tile (LinkedIn's "in"): holes inside
    // the tile are glyph too; the rounded corners outside it get clipped by CSS
    if (opaque) {
        let x0 = N, y0 = N, x1 = -1, y1 = -1;
        for (let i = 0; i < N * N; i++) {
            if (alphas[i] < 0.5) continue;
            const x = i % N, y = Math.floor(i / N);
            x0 = Math.min(x0, x); x1 = Math.max(x1, x); y0 = Math.min(y0, y); y1 = Math.max(y1, y);
        }
        const m = Math.round(N * 0.12); // stay clear of the corner rounding
        for (let i = 0; i < N * N; i++) {
            const x = i % N, y = Math.floor(i / N);
            const inside = x > x0 + m && x < x1 - m && y > y0 + m && y < y1 - m;
            if (inside && alphas[i] < 0.5) {
                details[i] = 1 - alphas[i] * 2;
                alphas[i] = 1;
            }
        }
    }

    // thin glyphs (Wikipedia's serif W) wash out at icon size: thicken them by a pixel
    const glyph = opaque ? dilate(details) : details;
    for (let i = 0; i < N * N; i++) {
        const strength = opaque ? 0.22 + 0.78 * glyph[i] : 1 - 0.88 * glyph[i];
        d[i * 4] = d[i * 4 + 1] = d[i * 4 + 2] = 255;
        d[i * 4 + 3] = Math.round(255 * alphas[i] * strength);
    }
    ctx.putImageData(image, 0, 0);
    return canvas.toDataURL("image/png");
}

// Masks are kept in localStorage too, so a new tab paints icons already tinted instead of
// showing the colored ones for a moment while the masks are rebuilt.
const STORE = "tint-mask2:";
const fingerprint = (key: string) => {
    let h = 5381;
    for (let i = 0; i < key.length; i++) h = ((h << 5) + h + key.charCodeAt(i)) | 0;
    return `${STORE}${(h >>> 0).toString(36)}.${key.length}`;
};
const maskKey = (src: string, opaque: boolean) => `${opaque ? 1 : 0}${src}`;

// localStorage is shared with the settings mirror, weather and icon caches: only the masks of
// the last MAX_STORED icons are kept (oldest out first), and masks of earlier builds go
const MAX_STORED = 48;
const INDEX = "tint-mask-index";
function remember(storeKey: string, mask: string) {
    try {
        let keys: string[] = JSON.parse(localStorage.getItem(INDEX) ?? "null") ?? [];
        if (!Array.isArray(keys)) keys = [];
        if (!localStorage.getItem(INDEX)) {
            // first run with an index: drop whatever an older build left behind
            for (const k of Object.keys(localStorage))
                if (k.startsWith("tint-mask") && k !== INDEX) localStorage.removeItem(k);
        }
        keys = keys.filter((k) => k !== storeKey);
        keys.push(storeKey);
        while (keys.length > MAX_STORED) localStorage.removeItem(keys.shift()!);
        localStorage.setItem(INDEX, JSON.stringify(keys));
        localStorage.setItem(storeKey, mask);
    } catch {} // full: it is rebuilt next time
}

/** the mask if a previous tab already built it: synchronous, for the first frame */
export function cachedMask(src: string, opaque: boolean): string {
    try {
        return localStorage.getItem(fingerprint(maskKey(src, opaque))) ?? "";
    } catch {
        return "";
    }
}

/** Alpha mask (data URL) for tinting an icon. */
export function tintMask(src: string, opaque: boolean) {
    const key = maskKey(src, opaque);
    let mask = cache.get(key);
    if (!mask) {
        mask = build(src, opaque);
        cache.set(key, mask);
        mask.then((m) => remember(fingerprint(key), m), () => {});
    }
    return mask;
}

// White app icons (Wikipedia, Arch) glare as bright tiles on a dark container plate.
// There we drop their white background and show just the artwork, like any logo.
const knockouts = new Map<string, Promise<string | null>>();

async function buildKnockout(src: string): Promise<string | null> {
    const img = await load(src);
    const canvas = document.createElement("canvas");
    canvas.width = canvas.height = N;
    const ctx = canvas.getContext("2d", { willReadFrequently: true })!;
    const w = img.naturalWidth || N;
    const h = img.naturalHeight || N;
    const k = N / Math.max(w, h);
    ctx.drawImage(img, (N - w * k) / 2, (N - h * k) / 2, w * k, h * k);
    const image = ctx.getImageData(0, 0, N, N);
    const d = image.data;
    const bg = dominantColor(d);
    const light = (0.2126 * bg[0] + 0.7152 * bg[1] + 0.0722 * bg[2]) / 255;
    if (light < 0.85) return null; // only near-white backgrounds
    let sum = 0, weight = 0;
    for (let i = 0; i < d.length; i += 4) {
        const dist = Math.hypot(d[i] - bg[0], d[i + 1] - bg[1], d[i + 2] - bg[2]) / 441;
        d[i + 3] = Math.round(d[i + 3] * clamp((dist - 0.06) / 0.18));
        const a = d[i + 3] / 255;
        sum += a * (0.2126 * d[i] + 0.7152 * d[i + 1] + 0.0722 * d[i + 2]) / 255;
        weight += a;
    }
    // black artwork (Wikipedia's W, Notion's N) would vanish on the dark plate: make it light
    if (weight && sum / weight < 0.35) {
        for (let i = 0; i < d.length; i += 4) {
            d[i] = 0xe3; d[i + 1] = 0xe6; d[i + 2] = 0xf2;
        }
    }
    ctx.putImageData(image, 0, 0);
    return canvas.toDataURL("image/png");
}

/** The icon without its near-white background, or null if it doesn't have one. */
export function knockout(src: string) {
    let result = knockouts.get(src);
    if (!result) {
        result = buildKnockout(src).catch(() => null);
        knockouts.set(src, result);
    }
    return result;
}
