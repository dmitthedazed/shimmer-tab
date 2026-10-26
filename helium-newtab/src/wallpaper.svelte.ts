// The custom wallpaper lives in IndexedDB, not in the synced settings: it is far too big
// for chrome.storage. It is downscaled on import, so it stays cheap to decode and draw.
import { t } from "./i18n";
const DB = "shimmer-tab";
const STORE = "kv";
const KEY = "wallpaper";
const ANIM = "wallpaper-anim";
const LOOK = "wallpaper-look"; // localStorage: the first frame needs it synchronously
const MAX = 2560;

function open(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
        const req = indexedDB.open(DB, 1);
        req.onupgradeneeded = () => req.result.createObjectStore(STORE);
        req.onsuccess = () => resolve(req.result);
        req.onerror = () => reject(req.error);
    });
}

async function run<T>(mode: IDBTransactionMode, work: (store: IDBObjectStore) => IDBRequest<T>): Promise<T> {
    const db = await open();
    try {
        return await new Promise<T>((resolve, reject) => {
            const req = work(db.transaction(STORE, mode).objectStore(STORE));
            req.onsuccess = () => resolve(req.result);
            req.onerror = () => reject(req.error);
        });
    } finally {
        db.close();
    }
}

// How text stays readable on any picture, worked out at import for each blur level from
// what the window shows of it (cover crop, the same blur): the scheme whose text needs the
// least veil over the picture, that veil (the scrim) but no more than CEIL so the picture
// stays present, and for the rest a halo right behind the text (lock.css, data-picture).
// Text on a picture takes Prism's dim colors a step stronger, so these hold 4.5:1.
export const BLURS = [0, 8, 20, 40];
const DARK_MAX = 0.04; // relative luminance the backdrop may reach under light text
const LIGHT_MIN = 0.52; // and may not drop below under dark text
const NAVY = [8, 12, 32]; // dark veil, a very dark Helium navy
const MIST = [251, 252, 255]; // light veil, Prism's light surface
const FLOOR = [0.25, 0.1]; // least veil, dark / light
const CEIL = 0.65;
/** judged in cells of this many px: 2 px catches fine bright detail, blur spreads it wider */
const cellPx = (blur: number) => Math.max(2, blur / 2);
const BASE = "hsl(232 44% 21%)"; // the gradient under a transparent picture

export type Look = { light: boolean; scrim: number[]; halo: number[] };
/** for a picture that could not be judged */
const WORST: Look = { light: false, scrim: BLURS.map(() => CEIL), halo: BLURS.map(() => 1) };

const LIN = Float32Array.from({ length: 256 }, (_, c) => ((c /= 255) <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4));
const luma = (r: number, g: number, b: number) =>
    0.2126 * LIN[(r + 0.5) | 0] + 0.7152 * LIN[(g + 0.5) | 0] + 0.0722 * LIN[(b + 0.5) | 0];

/** the least veil that brings every one of these pixels to the target: one bright cell is enough to fail */
function need(px: Uint8ClampedArray, light: boolean): number {
    const veil = light ? MIST : NAVY;
    const fits = (a: number) => {
        for (let o = 0; o < px.length; o += 4) {
            const l = luma(px[o] + (veil[0] - px[o]) * a, px[o + 1] + (veil[1] - px[o + 1]) * a, px[o + 2] + (veil[2] - px[o + 2]) * a);
            if (light ? l < LIGHT_MIN : l > DARK_MAX) return false;
        }
        return true;
    };
    if (fits(0)) return 0;
    let lo = 0;
    let hi = 1;
    for (let i = 0; i < 8; i++) {
        const mid = (lo + hi) / 2;
        if (fits(mid)) hi = mid;
        else lo = mid;
    }
    return hi;
}

/** the frame as the window shows it: object-fit cover over the bleed ImageBg adds, then blurred */
function cells(ctx: OffscreenCanvasRenderingContext2D, frame: ImageBitmap, blur: number) {
    const { width: w, height: h } = ctx.canvas;
    const b = (blur * w) / innerWidth;
    const s = Math.max((w + 4 * b) / frame.width, (h + 4 * b) / frame.height);
    ctx.filter = "none";
    ctx.fillStyle = BASE;
    ctx.fillRect(0, 0, w, h);
    ctx.filter = b ? `blur(${b}px)` : "none";
    ctx.drawImage(frame, (w - frame.width * s) / 2, (h - frame.height * s) / 2, frame.width * s, frame.height * s);
    return ctx.getImageData(0, 0, w, h).data;
}

/** an animation is judged by its worst frame */
function judge(frames: ImageBitmap[]): Look {
    const needs = [BLURS.map(() => 0), BLURS.map(() => 0)];
    BLURS.forEach((blur, i) => {
        const w = Math.round(Math.min(960, innerWidth / cellPx(blur)));
        const h = Math.round(Math.min(960, Math.max(16, (w * innerHeight) / innerWidth)));
        const ctx = new OffscreenCanvas(w, h).getContext("2d", { willReadFrequently: true })!;
        ctx.imageSmoothingQuality = "high";
        for (const frame of frames) {
            const px = cells(ctx, frame, blur);
            for (const light of [0, 1]) needs[light][i] = Math.max(needs[light][i], need(px, !!light));
        }
    });
    const total = (n: number[]) => n.reduce((a, b) => a + b);
    // dark text only where it needs clearly less veil: dark is Helium's look on a picture
    const light = total(needs[1]) + 0.15 * BLURS.length < total(needs[0]);
    const round = (n: number) => Math.round(n * 100) / 100;
    const scrim = needs[+light].map((n) => round(Math.min(CEIL, Math.max(FLOOR[+light], n))));
    // the share of the remaining picture the halo has to cover right behind the text
    const halo = needs[+light].map((n, i) => round(n > scrim[i] ? (n - scrim[i]) / (1 - scrim[i]) : 0));
    return { light, scrim, halo };
}

/** up to 48 frames spread over a GIF (every frame of a short one), for judging it */
async function gifFrames(file: File): Promise<ImageBitmap[]> {
    const decoder = new ImageDecoder({ data: file.stream(), type: "image/gif" });
    try {
        await decoder.tracks.ready;
        const count = decoder.tracks.selectedTrack?.frameCount ?? 1;
        const n = Math.min(48, count);
        const frames: ImageBitmap[] = [];
        for (let i = 0; i < n; i++) {
            const { image } = await decoder.decode({ frameIndex: Math.floor((i * count) / n) });
            frames.push(await createImageBitmap(image));
            image.close();
        }
        return frames;
    } finally {
        decoder.close();
    }
}

function readLook(): Look | null {
    try {
        const look = JSON.parse(localStorage.getItem(LOOK) ?? "null");
        return look?.scrim?.length === BLURS.length ? look : null;
    } catch {
        return null;
    }
}

/** the wallpaper: `url` is a still (a GIF's first frame), `animUrl` the GIF itself */
export const wallpaper = $state<{ url: string | null; animUrl: string | null; look: Look | null; loaded: boolean }>({
    url: null,
    animUrl: null,
    look: readLook(),
    loaded: false,
});

/** scheme, veil and halo for this blur level */
export function lookAt(blur: number) {
    const look = wallpaper.look ?? WORST;
    const i = Math.max(0, BLURS.indexOf(blur));
    return { light: look.light, scrim: look.scrim[i], halo: look.halo[i] };
}

function show(still: Blob | null, anim: Blob | null) {
    if (wallpaper.url) URL.revokeObjectURL(wallpaper.url);
    if (wallpaper.animUrl) URL.revokeObjectURL(wallpaper.animUrl);
    wallpaper.url = still ? URL.createObjectURL(still) : null;
    wallpaper.animUrl = anim ? URL.createObjectURL(anim) : null;
    wallpaper.loaded = true;
}

export async function loadWallpaper() {
    if (wallpaper.loaded) return;
    try {
        const [still, anim] = await Promise.all([
            run<Blob | undefined>("readonly", (s) => s.get(KEY)),
            run<Blob | undefined>("readonly", (s) => s.get(ANIM)),
        ]);
        show(still ?? null, anim ?? null);
    } catch {
        show(null, null);
    }
}

const MAX_GIF = 25 * 1024 * 1024;

/**
 * Stores the picture: stills are downscaled to at most 2560 px WebP; a GIF is kept as it is
 * (animated) with its first frame as the still. Returns an error message, or null.
 */
export async function setWallpaper(file: File): Promise<string | null> {
    const gif = file.type === "image/gif";
    if (gif && file.size > MAX_GIF) return t("gif_too_big");
    try {
        const bitmap = await createImageBitmap(file);
        const scale = Math.min(1, MAX / Math.max(bitmap.width, bitmap.height));
        const canvas = new OffscreenCanvas(Math.round(bitmap.width * scale), Math.round(bitmap.height * scale));
        canvas.getContext("2d")!.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
        const still = await canvas.convertToBlob({ type: "image/webp", quality: 0.88 });

        // a GIF whose frames can't be read is judged as the worst picture
        const frames = !gif
            ? [bitmap]
            : typeof ImageDecoder === "undefined"
              ? []
              : await gifFrames(file).catch(() => []);
        const look = frames.length ? judge(frames) : WORST;
        for (const frame of frames) frame.close();
        bitmap.close();

        const db = await open();
        try {
            await new Promise<void>((resolve, reject) => {
                const tx = db.transaction(STORE, "readwrite");
                const store = tx.objectStore(STORE);
                store.put(still, KEY);
                if (gif) store.put(file, ANIM);
                else store.delete(ANIM);
                tx.oncomplete = () => resolve();
                tx.onerror = () => reject(tx.error);
            });
        } finally {
            db.close();
        }
        try {
            localStorage.setItem(LOOK, JSON.stringify(look));
        } catch {}
        wallpaper.look = look;
        show(still, gif ? file : null);
        return null;
    } catch {
        return t("not_an_image");
    }
}
