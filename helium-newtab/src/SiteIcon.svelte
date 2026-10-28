<script lang="ts">
    import { measure, siteIcon, type Fit, type SiteIcon } from "./icons";
    import { perms } from "./permissions.svelte";
    import { cachedMask, knockout, tintMask } from "./tint";
    import { fade } from "./motion";
    import { isDark } from "./scheme.svelte";
    import { HeliumLogo } from "@imput/helium-prism";
    import ChromeLogo, { brand } from "./ChromeLogo.svelte";

    type Props = {
        url: string;
        title?: string;
        size?: number;
        contained?: boolean;
        /** CSS color to paint the icon in, or null for its own colors */
        tint?: string | null;
    };
    let { url, title = "", size = 48, contained = false, tint = null }: Props = $props();

    // logos sit at this share of their optical size inside a container
    const INSET = 0.6;


    let icon = $state<SiteIcon | null>(null) as SiteIcon | null;

    const dark = $derived(isDark());

    // A tile of our own instead of a favicon: a dev server on this machine (code glyph and
    // its port), or one of the browser's own pages (the Helium mark and the page's name).
    const local = $derived.by(() => {
        try {
            const u = new URL(url);
            if (["chrome:", "helium:", "about:"].includes(u.protocol)) {
                return { internal: true, label: "" }; // the name under the tile already says which
            }
            const h = u.hostname.replace(/\.+$/, "");
            const isLocal =
                h === "localhost" || h.endsWith(".localhost") || h === "[::1]" || h === "0.0.0.0" || /^127\./.test(h);
            return isLocal ? { internal: false, label: u.port } : null;
        } catch {
            return null;
        }
    });

    $effect(() => {
        void perms.epoch; // look again when access to sites changes
        if (local) return;
        let alive = true;
        siteIcon(url).then((i) => alive && (icon = i));
        return () => (alive = false);
    });

    const src = $derived(icon?.src ? (dark && icon.dark ? icon.dark : icon.src) : "");
    const opaque = $derived(!!icon && (icon.fullBleed || !!icon.fit?.f));

    // white app icons on a dark container plate: show just the artwork instead
    let plain: { src: string; fit: Fit } | null = $state(null);
    $effect(() => {
        plain = null;
        if (!contained || !dark || tint || !opaque || !src) return;
        let alive = true;
        knockout(src).then(async (k) => {
            if (!k || !alive) return;
            const shape = await measure(k);
            if (alive && shape) plain = { src: k, fit: shape.fit };
        });
        return () => (alive = false);
    });

    const transform = $derived.by(() => {
        if (!icon?.src) return "";
        if (plain) {
            const f = plain.fit;
            return `scale(${f.s * INSET}) translate(${f.x * 100}%, ${f.y * 100}%)`;
        }
        const fit = icon.fit ?? { s: 0.82, x: 0, y: 0 };
        // app icons and filled-square logos already are a tile: let them become the container
        if (contained && (icon.fullBleed || fit.f)) {
            return `scale(${1.02 / (fit.b ?? 1)}) translate(${fit.x * 100}%, ${fit.y * 100}%)`;
        }
        const k = contained ? INSET : 1;
        return `scale(${fit.s * k}) translate(${fit.x * 100}%, ${fit.y * 100}%)`;
    });

    let mask = $state("");
    // the colored icon stays hidden while the mask is being made, unless it cannot be made
    let maskFailed = $state(false);
    $effect(() => {
        mask = tint && src ? cachedMask(src, opaque) : "";
        maskFailed = false;
        if (!tint || !src) return;
        let alive = true;
        tintMask(src, opaque).then((m) => alive && (mask = m), () => alive && (maskFailed = true));
        return () => (alive = false);
    });

    const host = $derived.by(() => {
        try {
            return new URL(url).hostname.replace(/^www\./, "");
        } catch {
            return url;
        }
    });
    const letter = $derived((title || host).trim().charAt(0).toUpperCase() || "?");
    const hue = $derived([...host].reduce((h, c) => (h * 31 + c.charCodeAt(0)) % 360, 7));
</script>

<span
    class={["site-icon", contained && "contained", (local || (icon && !icon.src)) && "letter", local && "local", local?.internal && "internal", local?.internal && brand.chrome && !tint && "chrome", tint && "tint", !icon && !local && "loading"]}
    style:--size="{size}px"
    style:--hue={hue}
    style:--tint={tint}
    aria-hidden="true"
>
    {#if local}
        {#if local.internal}
            {#if brand.chrome && !tint}
                <ChromeLogo height="{Math.round(size * 0.62)}px" />
            {:else}
                <HeliumLogo height="{Math.round(size * 0.5)}px" />
            {/if}
        {:else}
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <path d="m8 7-5 5 5 5M16 7l5 5-5 5" />
            </svg>
        {/if}
        {#if local.label}
            <span class="port">{local.label}</span>
        {/if}
    {:else if icon?.src}
        <!-- both stay mounted so switching single-color mode crossfades -->
        <img
            class={[icon.fullBleed && !plain && "app", tint && !maskFailed && "hidden"]}
            src={plain?.src ?? src}
            alt=""
            draggable="false"
            style:transform={transform}
        />
        {#if tint && mask}
            <span
                class={["tinted", opaque && "app"]}
                style:background-color={tint}
                style:mask-image="url({mask})"
                style:transform={transform}
                transition:fade={{ duration: 250 }}
            ></span>
        {/if}
    {:else if icon}
        {letter}
    {/if}
</span>

<style>
    .site-icon {
        position: relative;
        transition:
            background-color 0.25s,
            box-shadow 0.25s;
        display: grid;
        place-items: center;
        flex-shrink: 0;
        width: var(--size);
        height: var(--size);
        border-radius: calc(var(--size) * 0.28);
    }

    img {
        /* explicit size: a percentage height doesn't resolve in the grid cell,
           and tall SVGs would then grow to their own aspect ratio */
        width: var(--size);
        height: var(--size);
        object-fit: contain;
        animation: appear 0.25s ease;
        transition:
            transform 0.25s ease,
            opacity 0.25s ease,
            border-radius 0.25s ease;
    }

    img,
    .tinted {
        grid-area: 1 / 1;
    }

    img.hidden {
        animation: none;
        opacity: 0;
    }

    img.app {
        border-radius: 22%;
    }

    .contained {
        overflow: hidden;
        background: var(--icon-plate, #fff);
        box-shadow:
            0 0 0 1px var(--icon-plate-edge, rgb(13 28 100 / 0.06)),
            0 2px 8px rgb(13 28 100 / 0.08);
    }

    .contained img.app {
        border-radius: 0;
    }

    :global(:root[data-dark]) .contained {
        --icon-plate: color-mix(in srgb, var(--helium-elevated) 12%, var(--background));
        --icon-plate-edge: color-mix(in srgb, var(--helium-elevated) 10%, transparent);
        box-shadow: 0 0 0 1px var(--icon-plate-edge);
    }

    @media (prefers-color-scheme: dark) {
        .contained {
            --icon-plate: color-mix(in srgb, var(--helium-elevated) 12%, var(--background));
            --icon-plate-edge: color-mix(in srgb, var(--helium-elevated) 10%, transparent);
            box-shadow: 0 0 0 1px var(--icon-plate-edge);
        }
    }

    .tinted.app {
        border-radius: 22%;
    }

    .tinted {
        transition:
            transform 0.25s ease,
            background-color 0.25s ease;
        display: block;
        width: var(--size);
        height: var(--size);
        mask-size: 100% 100%;
        mask-repeat: no-repeat;
        animation: appear 0.25s ease;
    }

    .letter {
        background: var(--tint, oklch(0.62 0.13 var(--hue)));
        color: #fff;
    }

    .local {
        display: flex;
        flex-direction: column;
        justify-content: center;
        gap: calc(var(--size) * 0.02);
        animation: appear 0.25s ease;
    }

    .local svg {
        width: 46%;
        height: 46%;
    }

    /* the browser's own pages wear Helium's blue */
    .internal {
        background: var(--tint, var(--helium-blue, #3450d1));
    }

    /* in Chrome mode the colored mark sits on a light plate, like an app icon */
    .internal.chrome {
        background: #fff;
    }

    .port {
        font-size: calc(var(--size) * 0.2);
        font-weight: 600;
        line-height: 1;
        font-variant-numeric: tabular-nums;
        letter-spacing: 0.02em;
    }

    .letter.tint {
        color: var(--background);
        font-size: calc(var(--size) * 0.44);
        font-weight: 600;
    }

    .loading {
        /* cached icons arrive within a frame or two; don't flash a placeholder for them */
        background: var(--helium-elevated-10);
        animation: pulse 1.2s ease-in-out 0.3s infinite;
    }

    /* like Prism's CopyIcon swap; `scale` so the fit transform stays intact */
    @keyframes appear {
        from {
            opacity: 0;
            scale: 0.8;
        }
    }

    @keyframes pulse {
        50% {
            opacity: 0.5;
        }
    }
</style>
