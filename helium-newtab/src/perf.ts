// Frame monitor: for a few seconds after a new tab opens, it times requestAnimationFrame.
// A device that keeps missing frames with the effects on is moved to Speed (App.svelte),
// but only after it struggled on CONFIRM tabs in a row, so one busy moment doesn't count.

/** the first frames carry page load, image decoding and the intro: not counted */
const WARMUP = 1000;
/** how long frames are timed after the warm-up, in ms */
const WINDOW = 3500;
/** a frame slower than this (25 fps) is a missed one */
const SLOW_FRAME = 40;
/** share of missed frames that counts as struggling */
const SLOW_SHARE = 0.35;
/** or an average under this; Chrome's energy saver caps pages at 30 fps, so stay below that */
const MIN_FPS = 24;
/** fewer frames than this in the whole window: not a measurement (see finish) */
const MIN_FRAMES = 12;
/** struggling tabs in a row before switching */
const CONFIRM = 2;
const STRIKES = "perf-strikes";

const strikes = () => {
    try {
        return Number(localStorage.getItem(STRIKES)) || 0;
    } catch {
        return 0;
    }
};
const setStrikes = (n: number) => {
    try {
        if (n) localStorage.setItem(STRIKES, String(n));
        else localStorage.removeItem(STRIKES);
    } catch {}
};

/**
 * Times the frames once; `ondone(true)` when this is the CONFIRM-th struggling tab in a row.
 * A tab that goes hidden starts over when it is back (hidden tabs get no frames).
 * Returns a stop function; a stopped watch reports nothing.
 */
export function watchFrames(ondone: (struggling: boolean) => void): () => void {
    let raf = 0;
    let start = 0;
    let last = 0;
    let frames = 0;
    let slow = 0;
    let total = 0;

    const reset = () => {
        start = last = frames = slow = total = 0;
    };
    const onVisibility = () => {
        cancelAnimationFrame(raf);
        reset();
        if (document.visibilityState === "visible") raf = requestAnimationFrame(tick);
    };

    const finish = () => {
        stop();
        // next to no frames: the window was covered or minimized and Chrome held them back,
        // which says nothing about the device
        if (frames < MIN_FRAMES) return ondone(false);
        const fps = (frames * 1000) / total;
        const struggling = slow / frames > SLOW_SHARE || fps < MIN_FPS;
        const n = struggling ? strikes() + 1 : 0;
        setStrikes(n >= CONFIRM ? 0 : n);
        ondone(n >= CONFIRM);
    };

    function tick(now: number) {
        if (!start) start = now;
        if (now - start >= WARMUP) {
            if (last) {
                const dt = now - last;
                frames++;
                total += dt;
                if (dt > SLOW_FRAME) slow++;
            }
            last = now;
            if (now - start >= WARMUP + WINDOW) return finish();
        }
        raf = requestAnimationFrame(tick);
    }

    function stop() {
        cancelAnimationFrame(raf);
        document.removeEventListener("visibilitychange", onVisibility);
    }

    document.addEventListener("visibilitychange", onVisibility);
    if (document.visibilityState === "visible") raf = requestAnimationFrame(tick);
    return stop;
}
