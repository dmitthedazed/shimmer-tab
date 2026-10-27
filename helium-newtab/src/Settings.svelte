<script lang="ts">
    import { t } from "./i18n";
    import { untrack } from "svelte";
    import { Text } from "@imput/helium-prism";
    import { cubicOut } from "svelte/easing";
    import type { Settings } from "./storage.svelte";
    import "./settings/settings.css";
    import Segmented from "./Segmented.svelte";

    import { pop } from "./motion";
    import LookTab from "./settings/LookTab.svelte";
    import DataTab from "./settings/DataTab.svelte";
    import SearchTab from "./settings/SearchTab.svelte";
    import ShortcutsTab from "./settings/ShortcutsTab.svelte";
    import WidgetsTab from "./settings/WidgetsTab.svelte";

    type Props = {
        settings: Settings;
        themeSource: "policy" | "own" | "no-access" | "no-policy" | null;
        emphasize: () => void;
        glass?: boolean;
        onclose: () => void;
        onaddshortcuts: () => void;
    };

    let {
        settings = $bindable(),
        themeSource,
        emphasize,
        glass = false,
        onclose,
        onaddshortcuts,
    }: Props = $props();

    type Tab = "look" | "shortcuts" | "widgets" | "search" | "data";
    const tabs: { value: Tab; label: string }[] = [
        { value: "look", label: t("look") },
        { value: "shortcuts", label: t("shortcuts") },
        { value: "widgets", label: t("widgets") },
        { value: "search", label: t("search") },
        { value: "data", label: t("data") },
    ];

    let tab: Tab = $state(
        (() => {
            try {
                const fromHash = location.hash.match(/^#settings-(\w+)/)?.[1] as Tab | undefined;
                if (fromHash && tabs.some((t) => t.value === fromHash)) return fromHash;
                return (localStorage.getItem("settings-tab") as Tab) || "look";
            } catch {
                return "look";
            }
        })(),
    );

    $effect(() => {
        try {
            localStorage.setItem("settings-tab", tab);
        } catch {}
    });

    let panel: HTMLElement | undefined = $state();

    // tab switch morph: the body animates to the new content height while the new
    // pane slides in from the side of the tab you moved to
    let contentH = $state(0);
    let morph = $state(false);
    $effect(() => {
        // only animate after the first layout, not on open
        if (contentH && !untrack(() => morph)) requestAnimationFrame(() => (morph = true));
    });

    // Prism-style swap (like its CopyIcon/Tooltip): the old pane shrinks and fades out
    // while the new one grows in, 0.2s ease, while the body eases to the new height
    function swapIn(_node: Element) {
        if (!morph) return { duration: 0 };
        return {
            duration: 200,
            easing: cubicOut,
            css: (e: number) => {
                return `opacity: ${e}; transform: scale(${0.96 + 0.04 * e});`;
            },
        };
    }

    function swapOut(_node: Element) {
        if (!morph) return { duration: 0 };
        return {
            duration: 150,
            easing: cubicOut,
            css: (e: number) => {
                // out of the flow so the new pane takes its place right away
                return `position: absolute; inset: var(--gap-1) var(--gap-4) auto; opacity: ${e}; transform: scale(${0.96 + 0.04 * e});`;
            },
        };
    }


    function onPointerDown(e: PointerEvent) {
        const target = e.target as Element | null;
        if (panel && target && !panel.contains(target) && !target.closest(".corner")) onclose();
    }
</script>

<svelte:window
    onkeydown={(e) => e.key === "Escape" && onclose()}
    onpointerdown={onPointerDown}
/>

<aside
    bind:this={panel}
    class={["panel", glass && "glass"]}
    aria-label={t("settings")}
    transition:pop|global
>
    <header>
        <Text variant="subheading">{t("settings")}</Text>
        <Segmented options={tabs} bind:value={tab} label={t("settings_section")} />
    </header>

    <div class="body" style:height={contentH ? `${contentH}px` : undefined} class:morph>
        <div class="content" bind:clientHeight={contentH}>
        {#key tab}
        <div class="pane" in:swapIn out:swapOut>
        {#if tab === "look"}
            <LookTab bind:settings {themeSource} {emphasize} />
        {:else if tab === "shortcuts"}
            <ShortcutsTab bind:settings {emphasize} {onclose} {onaddshortcuts} />
        {:else if tab === "widgets"}
            <WidgetsTab bind:settings {emphasize} />
        {:else if tab === "data"}
            <DataTab bind:settings {emphasize} />
        {:else}
            <SearchTab bind:settings {emphasize} />
        {/if}
        </div>
        {/key}
        </div>
    </div>
</aside>

<style>
    .panel {
        position: fixed;
        right: 16px;
        bottom: 68px;
        z-index: 4;
        display: flex;
        flex-direction: column;
        width: min(calc(100vw - 32px), 400px);
        max-height: calc(100vh - 88px);
        overflow: hidden;
        border-radius: var(--card-border-radius);
        /* like Prism's tooltip: the corner pointing at the button is the sharp one */
        border-bottom-right-radius: 6px;
        background: var(--background);
        outline: 1.5px solid var(--helium-elevated-10);
        outline-offset: -1.5px;
        box-shadow: 4px 4px 24px 0 var(--tooltip-shadow);
        transform-origin: bottom right;
    }

    /* the glass goes on the panel itself; per-child backdrop filters escape rounded clips */
    .panel.glass {
        background: color-mix(in srgb, var(--background) 80%, transparent);
        backdrop-filter: var(--glass-filter) blur(12px);
    }

    header {
        display: flex;
        flex-direction: column;
        gap: var(--gap-3);
        padding: var(--gap-4) var(--gap-4) var(--gap-3);
    }

    header :global(h4) {
        margin: 0;
        font-size: 18px;
        font-weight: 600;
    }

    .body {
        flex: 0 1 auto;
        min-height: 0;
        overflow-x: hidden;
        overflow-y: auto;
    }

    .body.morph {
        transition: height 0.2s ease;
    }

    .content {
        position: relative;
        padding: var(--gap-1) var(--gap-4) var(--gap-4);
    }

    .pane {
        transform-origin: top center;
        display: flex;
        flex-direction: column;
        gap: var(--gap-4);
    }
</style>
