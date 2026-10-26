<script lang="ts">
    import { wallpaper, loadWallpaper, lookAt } from "./wallpaper.svelte";

    /** blur radius in px */
    let { blur = 0 }: { blur?: number } = $props();

    loadWallpaper();

    // a GIF plays unless the system asks for less motion; then its first frame stays
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const src = $derived(still ? wallpaper.url : (wallpaper.animUrl ?? wallpaper.url));
    // veil worked out at import for how much blur is on, so text always reads
    const look = $derived(lookAt(blur));

    let shown = $state(false);
</script>

<div class="image" aria-hidden="true">
    {#if src}
        <!-- decoded off the main thread; fades in over the gradient once it is ready -->
        <img
            {src}
            alt=""
            decoding="async"
            class:shown
            style:--blur="{blur}px"
            onload={() => (shown = true)}
        />
    {/if}
    <div class={["scrim", look.light && "light"]} style:opacity={look.scrim}></div>
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
        transition:
            opacity 0.6s ease,
            filter 0.25s ease;
    }

    img.shown {
        opacity: 1;
    }

    /* dark navy under light text, Prism's light surface under dark text (wallpaper.svelte.ts) */
    .scrim {
        position: absolute;
        inset: 0;
        background: rgb(8 12 32);
        transition:
            opacity 0.25s ease,
            background-color 0.6s ease;
    }

    .scrim.light {
        background: rgb(251 252 255);
    }
</style>
