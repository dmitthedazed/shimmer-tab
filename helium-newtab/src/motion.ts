// Motion borrowed from Prism: its Tooltip scales in from 0.8 with a fade in 0.15s,
// its CopyIcon swaps icons by scaling them, buttons press to 0.97 in 0.2s.
import { tick } from "svelte";
import { cubicOut } from "svelte/easing";
import { flip as svelteFlip } from "svelte/animate";
import { fade as svelteFade, slide as svelteSlide } from "svelte/transition";

const reduced = typeof window !== "undefined" ? window.matchMedia("(prefers-reduced-motion: reduce)") : null;

/** Speed mode (Settings → Look → Effects, data-fx set by App.svelte): no motion at all. */
export const speed = () => typeof document !== "undefined" && document.documentElement.dataset.fx === "performance";
/** no movement: Speed mode or the system's reduced motion */
export const still = () => speed() || !!reduced?.matches;

const NONE = { duration: 0 };

/** Wraps a Svelte transition/animation so it is skipped when nothing should move. */
function calm<A extends unknown[], R>(fn: (...args: A) => R) {
    return (...args: A): R => (still() ? (NONE as R) : fn(...args));
}

export const flip = calm(svelteFlip);
export const fade = calm(svelteFade);
export const slide = calm(svelteSlide);

/** Tooltip-style appear/disappear; with reduced motion just the fade, in Speed nothing. */
export function pop(_node: Element, { duration = 150, from = 0.8 } = {}) {
    if (speed()) return NONE;
    const s = reduced?.matches ? 1 : from;
    return {
        duration,
        easing: cubicOut,
        css: (t: number) => `opacity: ${t}; scale: ${s + (1 - s) * t};`,
    };
}

/** A settings row (or a group of them) opening up in its list: height and fade, Prism timing. */
export function grow(node: Element, { duration = 200 } = {}) {
    if (still()) return NONE;
    const h = (node as HTMLElement).offsetHeight;
    return {
        duration,
        easing: cubicOut,
        // the list's 2px gap comes and goes with it
        css: (t: number) => `overflow: hidden; height: ${t * h}px; opacity: ${t}; margin-top: ${(t - 1) * 2}px;`,
    };
}

// Background switch: the new wallpaper flows into the old one (see `reveal`), while the
// old one sinks back (slight zoom and dim) underneath.
let origin: { x: number; y: number } | null = null;
if (typeof window !== "undefined") {
    window.addEventListener("pointerdown", (e) => (origin = { x: e.clientX, y: e.clientY }), true);
}

const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

// Liquid flow: a smooth noise field (biased by distance from the click) is thresholded
// a bit further every frame, so the new wallpaper seeps through in growing, merging
// blobs with soft edges until it fills the screen. The mask is tiny (W×H) and the browser
// upscales it smoothly, which is what makes the edges look fluid.
const MW = 96;
const MH = 60;

function fbm(w: number, h: number, seed: number) {
    // value noise, three octaves
    const rand = (x: number, y: number) => {
        const n = Math.sin(x * 127.1 + y * 311.7 + seed * 74.7) * 43758.5453;
        return n - Math.floor(n);
    };
    const smooth = (t: number) => t * t * (3 - 2 * t);
    const noise = (x: number, y: number) => {
        const xi = Math.floor(x), yi = Math.floor(y);
        const xf = smooth(x - xi), yf = smooth(y - yi);
        const a = rand(xi, yi), b = rand(xi + 1, yi), c = rand(xi, yi + 1), d = rand(xi + 1, yi + 1);
        return a + (b - a) * xf + (c - a) * yf + (a - b - c + d) * xf * yf;
    };
    const out = new Float32Array(w * h);
    for (let y = 0; y < h; y++) {
        for (let x = 0; x < w; x++) {
            let v = 0, amp = 0.55, f = 1 / 14;
            for (let o = 0; o < 3; o++) {
                v += amp * noise(x * f, y * f);
                amp *= 0.5;
                f *= 2;
            }
            out[y * w + x] = v;
        }
    }
    return out;
}

export function reveal(node: Element, { duration = 1100 } = {}) {
    if (still()) return NONE;
    const el = node as HTMLElement;
    const { innerWidth: w, innerHeight: h } = window;
    const { x, y } = origin ?? { x: w / 2, y: h / 2 };
    const noise = fbm(MW, MH, Math.random() * 1000);
    // where each mask cell starts to fill: mostly noise, nearer the click goes first
    const far = Math.hypot(Math.max(x, w - x), Math.max(y, h - y));
    const start = new Float32Array(MW * MH);
    for (let j = 0; j < MH; j++) {
        for (let i = 0; i < MW; i++) {
            const d = Math.hypot(((i + 0.5) / MW) * w - x, ((j + 0.5) / MH) * h - y) / far;
            start[j * MW + i] = 0.55 * noise[j * MW + i] + 0.45 * d;
        }
    }
    const canvas = document.createElement("canvas");
    canvas.width = MW;
    canvas.height = MH;
    const ctx = canvas.getContext("2d")!;
    const image = ctx.createImageData(MW, MH);
    const soft = 0.12;

    const frame = (t: number) => {
        // threshold sweeps past the whole field (start values span roughly 0..1)
        const edge = -soft + t * (1 + 2 * soft);
        const d = image.data;
        for (let k = 0; k < MW * MH; k++) {
            const a = Math.min(1, Math.max(0, (edge - start[k]) / soft));
            d[k * 4 + 3] = Math.round(255 * a * a * (3 - 2 * a));
        }
        ctx.putImageData(image, 0, 0);
        const url = `url(${canvas.toDataURL()})`;
        el.style.maskImage = url;
        el.style.setProperty("-webkit-mask-image", url);
    };

    el.style.zIndex = "1";
    el.style.maskSize = "100% 100%";
    frame(0);
    return {
        duration,
        easing: easeInOut,
        tick: (t: number) => {
            frame(t);
            if (t === 1) {
                el.style.maskImage = "";
                el.style.removeProperty("-webkit-mask-image");
                el.style.zIndex = "";
            }
        },
    };
}

const FROZEN = [
    "--background",
    "--bg-surface",
    "--bg-gradient-start",
    "--bg-gradient-end",
    "--helium-elevated",
    "--stars-top",
    "--stars-bottom",
    "--star-color",
];

export function recede(node: Element, { duration = 1100 } = {}) {
    if (still()) return NONE;
    // keep the old wallpaper's own colors while the page recolors around it: the shimmer
    // re-reads these variables as it draws, so pin them on the layer it lives in
    const el = node as HTMLElement;
    const style = getComputedStyle(el);
    el.style.backgroundColor = style.backgroundColor;
    for (const name of FROZEN) {
        const value = style.getPropertyValue(name);
        if (value) el.style.setProperty(name, value);
    }
    return {
        duration,
        easing: easeInOut,
        // t runs 1 → 0 on the way out; stays opaque so nothing muddy shows through
        css: (t: number) => `z-index: 0; scale: ${1 + (1 - t) * 0.04};`,
    };
}

/**
 * Crossfades the whole page into whatever `update` changes (a new color palette) using the
 * View Transitions API; falls back to an instant change.
 */
export async function morphPage(update: () => unknown) {
    if (!document.startViewTransition || still()) return update();
    await document.startViewTransition(async () => {
        await update();
        await tick();
    }).finished;
}

// Stars → shimmer: the shimmer's stripes punch down from the top, one per shimmer stripe
// (same ~110px width), staggered from the center outward like the shimmer's own intro.
const STRIPE_TARGET = 110;

export function drop(node: Element, { duration = 1000 } = {}) {
    if (still()) return NONE;
    const el = node as HTMLElement;
    const w = window.innerWidth;
    const count = Math.max(1, Math.round(w / STRIPE_TARGET));
    const PX = 8; // mask pixels per stripe, keeps the stripe sides crisp
    const MH2 = 120;
    const canvas = document.createElement("canvas");
    canvas.width = count * PX;
    canvas.height = MH2;
    const ctx = canvas.getContext("2d")!;
    const image = ctx.createImageData(canvas.width, MH2);
    const center = (count - 1) / 2;
    const maxDelay = Math.ceil(center) || 1;
    const fall = 0.55; // share of the duration one stripe takes to reach the bottom
    const soft = 0.18; // soft leading edge, share of the height
    const ease = (t: number) => 1 - Math.pow(1 - t, 3);

    const frame = (t: number) => {
        const d = image.data;
        for (let s = 0; s < count; s++) {
            const delay = (Math.abs(s - center) / maxDelay) * (1 - fall);
            const p = ease(Math.min(1, Math.max(0, (t - delay) / fall)));
            const front = p * (1 + soft); // edge position, overshoots so it fully closes
            for (let y = 0; y < MH2; y++) {
                const a = Math.min(1, Math.max(0, (front - y / MH2) / soft));
                const v = Math.round(255 * a);
                for (let x = s * PX; x < (s + 1) * PX; x++) d[(y * canvas.width + x) * 4 + 3] = v;
            }
        }
        ctx.putImageData(image, 0, 0);
        const url = `url(${canvas.toDataURL()})`;
        el.style.maskImage = url;
        el.style.setProperty("-webkit-mask-image", url);
    };

    el.style.zIndex = "1";
    el.style.maskSize = "100% 100%";
    frame(0);
    return {
        duration,
        tick: (t: number) => {
            frame(t);
            if (t === 1) {
                el.style.maskImage = "";
                el.style.removeProperty("-webkit-mask-image");
                el.style.zIndex = "";
            }
        },
    };
}
