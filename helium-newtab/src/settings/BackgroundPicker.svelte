<script lang="ts">
    import { IconCheck } from "@imput/helium-prism";
    import { t } from "../i18n";
    import { pop } from "../motion";
    import { wallpaper, loadWallpaper, addWallpaper } from "../wallpaper.svelte";
    import type { Settings } from "../storage.svelte";
    import Stars from "../Stars.svelte";
    import Section from "./Section.svelte";
    import WallpaperManager from "./WallpaperManager.svelte";

    let { settings = $bindable(), emphasize, advanced }: { settings: Settings; emphasize: () => void; advanced: boolean } = $props();

    const backgrounds: { value: Settings["background"]; label: string }[] = [
        { value: "shimmer", label: t("shimmer") },
        { value: "stars", label: t("stars") },
        { value: "weather", label: t("weather") },
        { value: "image", label: t("image") },
        { value: "random", label: t("random") },
        { value: "none", label: t("none") },
    ];

    // custom pictures: choosing the tile without one opens the file picker first
    loadWallpaper();
    let pictureInput: HTMLInputElement | undefined = $state();
    let pictureNote = $state("");

    async function pickPicture(files: FileList | null) {
        pictureNote = "";
        for (const file of files ?? []) {
            pictureNote = (await addWallpaper(file)) ?? "";
            if (pictureNote) break;
            settings.background = "image";
            emphasize();
        }
        if (pictureInput) pictureInput.value = "";
    }

    // previews render the real background at window size and scale it down
    let winW = $state(window.innerWidth);
    let winH = $state(window.innerHeight);
    let tileW = $state(0);
    const previewScale = $derived(tileW / winW || 0.1);
</script>

<svelte:window bind:innerWidth={winW} bind:innerHeight={winH} />

<Section title={t("background")}>
    <div class="backgrounds" role="radiogroup" aria-label={t("background")}>
        {#each backgrounds as option, i (option.value)}
            <button
                type="button"
                role="radio"
                aria-checked={settings.background === option.value}
                class={["bg-option", settings.background === option.value && "active"]}
                onclick={() => {
                    if (option.value === "image" && !wallpaper.url) return pictureInput?.click();
                    settings.background = option.value;
                    emphasize();
                }}
            >
                <span class="bg-preview" style:aspect-ratio="{winW} / {winH}">
                    {#if i === 0}
                        <span class="measure" bind:clientWidth={tileW}></span>
                    {/if}
                    <span
                        class="viewport"
                        style:width="{winW}px"
                        style:height="{winH}px"
                        style:transform="scale({previewScale})"
                    >
                        {#if option.value === "shimmer" || option.value === "random"}
                            <span class="still shimmer"></span>
                        {/if}
                        {#if option.value === "weather"}
                            <span class="still weather"></span>
                        {/if}
                        {#if option.value === "image"}
                            <span
                                class="still picture"
                                style:background-image={wallpaper.url ? `url(${wallpaper.url})` : null}
                            ></span>
                        {/if}
                        {#if option.value === "stars" || option.value === "random"}
                            <span class={["layer", option.value === "random" && "split"]}>
                                <Stars preview starSize={0.8 / previewScale} />
                            </span>
                        {/if}
                    </span>
                    {#if settings.background === option.value}
                        <span class="check" aria-hidden="true" transition:pop={{ from: 0.5 }}><IconCheck /></span>
                    {/if}
                    {#if option.value === "random"}
                        <svg class="dice" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 5a2 2 0 0 1 2 -2h14a2 2 0 0 1 2 2v14a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2z" /><path d="M8.5 8.5m-.5 0a.5 .5 0 1 0 1 0a.5 .5 0 1 0 -1 0" fill="currentColor" /><path d="M15.5 8.5m-.5 0a.5 .5 0 1 0 1 0a.5 .5 0 1 0 -1 0" fill="currentColor" /><path d="M15.5 15.5m-.5 0a.5 .5 0 1 0 1 0a.5 .5 0 1 0 -1 0" fill="currentColor" /><path d="M8.5 15.5m-.5 0a.5 .5 0 1 0 1 0a.5 .5 0 1 0 -1 0" fill="currentColor" /></svg>
                    {/if}
                </span>
                <span class="bg-label">{option.label}</span>
            </button>
        {/each}
    </div>
    <input
        bind:this={pictureInput}
        class="s-file"
        type="file"
        accept="image/*"
        multiple
        onchange={(e) => pickPicture(e.currentTarget.files)}
    />
    {#if settings.background === "image"}
        <WallpaperManager bind:settings {emphasize} {advanced} onadd={() => pictureInput?.click()} />
    {/if}
    {#if pictureNote}
        <p class="s-note" transition:pop={{ from: 0.96, duration: 150 }}>{pictureNote}</p>
    {/if}
    {#if settings.background === "weather" && !settings.city.trim()}
        <p class="s-note" transition:pop={{ from: 0.96, duration: 150 }}>
            {t("clear_skies_until_you")}
        </p>
    {/if}
</Section>

<style>
    /* background picker */
    .backgrounds {
        display: grid;
        grid-template-columns: repeat(6, 1fr);
        gap: var(--gap-1);
    }

    .bg-option {
        display: flex;
        flex-direction: column;
        align-items: stretch;
        gap: 6px;
        width: 100%;
        min-width: 0;
        /* Prism pads buttons that contain an svg */
        padding: 0 !important;
        border: none;
        background: none;
        color: var(--tertiary);
        font: inherit;
        font-size: 12px;
        cursor: pointer;
    }

    .bg-preview {
        position: relative;
        display: block;
        width: 100%;
        max-height: 56px;
        overflow: hidden;
        border-radius: 10px;
        background: var(--background);
        outline: 1px solid var(--helium-elevated-15);
        outline-offset: -1px;
        transition: outline-color 0.15s, transform 0.15s, box-shadow 0.15s;
    }

    .bg-option:hover .bg-preview {
        outline-color: var(--helium-elevated-40);
    }

    .bg-option:active .bg-preview {
        transform: scale(0.96);
    }

    .bg-option.active {
        color: var(--primary);
    }

    .bg-option.active .bg-preview {
        outline: 2px solid var(--helium-elevated);
        outline-offset: -2px;
        box-shadow: 0 0 0 3px var(--helium-elevated-15);
    }

    .bg-option:focus-visible {
        outline: none;
    }

    .bg-option:focus-visible .bg-preview {
        box-shadow: 0 0 0 3px var(--helium-elevated-40);
    }

    .bg-label {
        max-width: 100%;
        overflow: hidden;
        text-align: center;
        text-overflow: ellipsis;
        white-space: nowrap;
    }

    /* a phone-narrow panel (100vw - 32px, see Settings.svelte): two rows of three */
    @media (max-width: 394px) {
        .backgrounds {
            grid-template-columns: repeat(3, 1fr);
            row-gap: var(--gap-2);
        }
    }

    .measure {
        position: absolute;
        inset: 0;
    }

    .viewport {
        position: absolute;
        top: 0;
        left: 0;
        transform-origin: 0 0;
        pointer-events: none;
    }

    .layer {
        position: absolute;
        inset: 0;
    }

    /* the tiles are stills, so the panel doesn't run a live WebGL view per wallpaper */
    .still {
        position: absolute;
        inset: 0;
    }

    .shimmer {
        background:
            repeating-linear-gradient(90deg, rgb(255 255 255 / 0.06) 0 7%, transparent 7% 14%),
            linear-gradient(var(--bg-gradient-start), var(--bg-gradient-end));
    }

    .picture {
        background-color: var(--helium-elevated-10);
        background-position: center;
        background-size: cover;
    }

    .weather {
        background:
            radial-gradient(ellipse 38% 26% at 24% 34%, rgb(210 225 255 / 0.32), transparent),
            radial-gradient(ellipse 46% 24% at 70% 52%, rgb(210 225 255 / 0.24), transparent),
            radial-gradient(ellipse 34% 20% at 40% 78%, rgb(210 225 255 / 0.18), transparent),
            linear-gradient(hsl(226 44% 30%), hsl(220 48% 46%));
    }

    .layer.split {
        clip-path: polygon(60% 0, 100% 0, 100% 100%, 40% 100%);
    }

    .dice {
        position: absolute;
        top: 50%;
        left: 50%;
        width: 18px;
        height: 18px;
        transform: translate(-50%, -50%);
        color: #fff;
        filter: drop-shadow(0 1px 3px rgb(0 0 0 / 0.4));
    }

    .check {
        position: absolute;
        right: 4px;
        bottom: 4px;
        z-index: 1;
        display: grid;
        place-items: center;
        width: 16px;
        height: 16px;
        border-radius: 50%;
        background: var(--helium-elevated);
        color: var(--background);
    }

    .check :global(svg) {
        width: 11px;
        height: 11px;
        stroke-width: 3;
    }
</style>
