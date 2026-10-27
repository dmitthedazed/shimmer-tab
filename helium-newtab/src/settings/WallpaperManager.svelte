<script lang="ts">
    import { Button } from "@imput/helium-prism";
    import { IconX } from "@imput/helium-prism";
    import { cubicOut } from "svelte/easing";
    import { flip } from "svelte/animate";
    import { t } from "../i18n";
    import { pop } from "../motion";
    import { wallpaper, selectWallpaper, removeWallpaper } from "../wallpaper.svelte";
    import type { Settings } from "../storage.svelte";
    import Row from "../Row.svelte";
    import Segmented from "../Segmented.svelte";
    import List from "./List.svelte";

    type Props = { settings: Settings; emphasize: () => void; onadd: () => void };
    let { settings = $bindable(), emphasize, onadd }: Props = $props();

    let winW = $state(window.innerWidth);
    let winH = $state(window.innerHeight);

    const blurs = [
        { value: "0", label: t("off") },
        { value: "8", label: t("soft") },
        { value: "20", label: t("medium") },
        { value: "40", label: t("strong") },
    ];
    const everys = [
        { value: "tab", label: t("every_tab") },
        { value: "hour", label: t("every_hour") },
        { value: "day", label: t("every_day") },
    ];
    const orders = [
        { value: "random", label: t("random") },
        { value: "order", label: t("in_order") },
    ];

    async function dropPicture(id: string) {
        await removeWallpaper(id);
        if (!wallpaper.items.length && settings.background === "image") settings.background = "shimmer";
        emphasize();
    }
</script>

<svelte:window bind:innerWidth={winW} bind:innerHeight={winH} />

<List animate>
                        <Row name={t("pictures")} desc={t("photo_or_gif_stays")}>
                            <Button onclick={() => onadd()}>{t("add")}</Button>
                        </Row>
                        <div class="pictures">
                            {#each wallpaper.items as item, i (item.id)}
                                <div
                                    class={["thumb", item.id === wallpaper.id && "on"]}
                                    style:aspect-ratio="{winW} / {winH}"
                                    animate:flip={{ duration: 200, easing: cubicOut }}
                                    transition:pop={{ from: 0.9 }}
                                >
                                    <button
                                        type="button"
                                        class="pick"
                                        aria-label="{t('picture')} {i + 1}"
                                        aria-pressed={item.id === wallpaper.id}
                                        style:background-image="url({item.url})"
                                        onclick={() => selectWallpaper(item.id)}
                                    ></button>
                                    <button type="button" class="drop" aria-label={t("remove")} onclick={() => dropPicture(item.id)}>
                                        <IconX />
                                    </button>
                                </div>
                            {/each}
                        </div>
                        {#if wallpaper.items.length > 1}
                            <Row name={t("change_picture")} desc={t("when_the_next_one")}>
                                <Segmented
                                    small
                                    label={t("change_picture")}
                                    options={everys}
                                    value={settings.wallpaperEvery}
                                    onchange={(v) => (settings.wallpaperEvery = v as Settings["wallpaperEvery"])}
                                />
                            </Row>
                            <Row name={t("order")} desc={t("which_one_comes_next")}>
                                <Segmented
                                    small
                                    label={t("order")}
                                    options={orders}
                                    value={settings.wallpaperOrder}
                                    onchange={(v) => (settings.wallpaperOrder = v as Settings["wallpaperOrder"])}
                                />
                            </Row>
                        {/if}
                        <Row name={t("blur")} desc={t("softens_the_picture")}>
                            <Segmented
                                small
                                label={t("blur")}
                                options={blurs}
                                value={String(settings.imageBlur)}
                                onchange={(v) => {
                                    settings.imageBlur = Number(v);
                                    emphasize();
                                }}
                            />
                        </Row>
                    </List>

<style>
    /* the pictures, as small as the background picker's previews and lit up the same way */
    .pictures {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(76px, 1fr));
        gap: var(--gap-1);
        padding: 10px 16px;
    }

    .thumb {
        position: relative;
        isolation: isolate;
        width: 100%;
        max-height: 56px;
        border-radius: 10px;
        outline: 1px solid var(--helium-elevated-15);
        outline-offset: -1px;
        transition: outline-color 0.15s, box-shadow 0.15s;
    }

    .thumb:hover {
        outline-color: var(--helium-elevated-40);
    }

    .thumb.on {
        outline: 2px solid var(--helium-elevated);
        outline-offset: -2px;
        box-shadow: 0 0 0 3px var(--helium-elevated-15);
    }

    .thumb:has(.pick:focus-visible) {
        box-shadow: 0 0 0 3px var(--helium-elevated-40);
    }

    .thumb .pick {
        all: unset;
        position: absolute;
        inset: 0;
        z-index: -1;
        border-radius: inherit;
        cursor: pointer;
        background-color: var(--helium-elevated-10);
        background-size: cover;
        background-position: center;
        transition: scale 0.15s;
    }

    .thumb .pick:active {
        scale: 0.96;
    }

    /* small circle like the shortcuts' edit button, shown on hover */
    .thumb .drop {
        all: unset;
        position: absolute;
        top: -6px;
        right: -6px;
        display: grid;
        place-items: center;
        width: 20px;
        height: 20px;
        border-radius: 50%;
        cursor: pointer;
        color: var(--secondary);
        background: var(--background);
        box-shadow: 0 0 0 1px var(--helium-elevated-10), 0 2px 6px var(--tooltip-shadow);
        opacity: 0;
        scale: 0.8;
        transition: opacity 0.15s, scale 0.15s, color 0.2s;
    }

    .thumb .drop :global(svg) {
        width: 12px;
        height: 12px;
    }

    .thumb:hover .drop,
    .thumb .drop:focus-visible {
        opacity: 1;
        scale: 1;
    }

    .thumb .drop:hover {
        color: var(--primary);
    }
</style>
