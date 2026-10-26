// The starfield is always dark, so on it the page switches to Prism's dark tokens even
// when the system is light; a picture may force either. Components that pick light/dark
// assets read this.
const media = window.matchMedia("(prefers-color-scheme: dark)");

export type Forced = "dark" | "light" | null;

export const scheme = $state<{ system: boolean; forced: Forced }>({ system: media.matches, forced: null });

media.addEventListener("change", () => (scheme.system = media.matches));

export const isDark = () => (scheme.forced ? scheme.forced === "dark" : scheme.system);

let recolorTimer: ReturnType<typeof setTimeout> | undefined;

/**
 * `morph` lets every color on the page ease to the new scheme over that many ms
 * (in step with a background reveal) instead of flipping in one frame.
 */
export function forceScheme(mode: Forced, morph = 0) {
    const root = document.documentElement;
    const current = root.hasAttribute("data-dark") ? "dark" : root.hasAttribute("data-light") ? "light" : null;
    if (scheme.forced === mode && current === mode) return;
    if (morph) {
        root.style.setProperty("--recolor", `${morph}ms`);
        root.setAttribute("data-recolor", "");
        clearTimeout(recolorTimer);
        recolorTimer = setTimeout(() => root.removeAttribute("data-recolor"), morph + 50);
    }
    scheme.forced = mode;
    root.toggleAttribute("data-dark", mode === "dark");
    root.toggleAttribute("data-light", mode === "light");
}
