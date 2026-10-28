<script lang="ts">
    import { wallpaper, loadWallpaper, lookAt } from "./wallpaper.svelte";

    /** blur radius in px; dim: whether the readability veil is on, veil: its strength factor, picture: the veil in the page palette (the picture's colors) */
    let { blur = 0, dim = true, veil = 1, picture = false }: { blur?: number; dim?: boolean; veil?: number; picture?: boolean } = $props();

    loadWallpaper();

    // a GIF plays unless the system asks for less motion; then its first frame stays
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const src = $derived(still ? wallpaper.url : (wallpaper.animUrl ?? wallpaper.url));
    // veil worked out at import for how much blur is on, so text always reads
    const look = $derived(lookAt(blur));

    // a new picture fades in over the previous one, which is dropped once it is covered
    let layers = $state<{ key: number; src: string; shown: boolean }[]>([]);
    let key = 0;
    $effect(() => {
        const s = src;
        if (!s || layers.at(-1)?.src === s) return;
        layers.push({ key: key++, src: s, shown: false });
    });

    function loaded(k: number) {
        const i = layers.findIndex((l) => l.key === k);
        if (i < 0) return;
        layers[i].shown = true;
        if (i > 0) setTimeout(() => (layers = layers.filter((l) => l.key >= k)), 700);
    }
</script>

<div class={["image", layers.length > 1 && "switching"]} aria-hidden="true">
    {#each layers as layer (layer.key)}
        <!-- decoded off the main thread; fades in over the gradient / previous picture once ready -->
        <img
            src={layer.src}
            alt=""
            class="bg-fade"
            decoding="async"
            class:shown={layer.shown}
            style:--blur="{blur}px"
            onload={(e) => {
                // an image that is ready at once would get its class before it was ever painted
                // hidden, and pop in instead of fading: settle the hidden style first
                void (e.currentTarget as HTMLElement).offsetWidth;
                loaded(layer.key);
            }}
            onerror={() => (layers = layers.filter((l) => l.key !== layer.key))}
        />
    {/each}
    <div
        class={["scrim", look.light && "light"]}
        style:opacity={dim ? look.scrim * veil : 0}
        style:--scrim={picture ? "var(--bg-surface)" : null}
    ></div>
</div>

<style>
    /* Stars' colors while the picture decodes, or when there is none yet */
    .image {
        position: fixed;
        inset: 0;
        z-index: 0;
        overflow: hidden;
        background: linear-gradient(hsl(234 40% 14%), hsl(230 47% 29%));
    }

    /* bleed past the edges so the blur never fades to transparent at the border */
    img {
        position: absolute;
        inset: calc(var(--blur) * -2);
        width: calc(100% + var(--blur) * 4);
        height: calc(100% + var(--blur) * 4);
        object-fit: cover;
        filter: blur(var(--blur));
        opacity: 0;
        scale: 1.05;
        transition:
            opacity 0.7s cubic-bezier(0.215, 0.61, 0.355, 1),
            scale 0.9s cubic-bezier(0.215, 0.61, 0.355, 1),
            filter 0.25s ease;
    }

    /* Speed: a plain fade, no zoom (lock.css leaves .bg-fade's transitions alone) */
    :global(:root[data-fx="performance"]) img {
        scale: 1;
        transition: opacity 0.4s linear;
    }

    /* Prism's motion: fades in while settling from a slight zoom */
    img.shown {
        opacity: 1;
        scale: 1;
    }

    /* dark navy under light text, Prism's light surface under dark text (wallpaper.svelte.ts) */
    .scrim {
        position: absolute;
        inset: 0;
        background: var(--scrim, rgb(8 12 32));
        transition:
            opacity 0.25s ease,
            background-color 0.6s ease;
    }

    /* the veil follows the picture's own fade, so it doesn't jump ahead of it */
    .switching .scrim {
        transition:
            opacity 0.7s cubic-bezier(0.215, 0.61, 0.355, 1),
            background-color 0.7s cubic-bezier(0.215, 0.61, 0.355, 1);
    }

    .scrim.light {
        background: var(--scrim, rgb(251 252 255));
    }
</style>
