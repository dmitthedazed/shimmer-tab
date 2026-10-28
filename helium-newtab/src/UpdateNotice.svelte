<script lang="ts">
    import { IconX } from "@imput/helium-prism";
    import { t } from "./i18n";
    import { pop } from "./motion";
    import type { Notice } from "./updates";

    // an update, or Speed switched on because the device struggled (perf.ts)
    type Props = {
        notice: Notice | { kind: "speed" };
        ondismiss: () => void;
        onundo?: () => void;
    };
    let { notice, ondismiss, onundo }: Props = $props();
</script>

<div class="notice" role="status" transition:pop>
    {#if notice.kind === "speed"}
        <span class="text wrap">{t("speed_auto")}</span>
        <button type="button" class="link" onclick={onundo}>{t("undo")}</button>
    {:else}
        <span class="text">
            {notice.kind === "updated" ? t("updated_to", { version: notice.version }) : t("update_out", { version: notice.version })}
        </span>
        <a class="link" href={notice.url} target="_blank" rel="noopener" onclick={ondismiss}>
            {notice.kind === "updated" ? t("whats_new") : t("view_release")}
        </a>
    {/if}
    <button type="button" class="close" aria-label={t("dismiss")} onclick={ondismiss}><IconX /></button>
</div>

<style>
    .text {
        min-width: 0;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }

    .text.wrap {
        max-width: 300px;
        white-space: normal;
        line-height: 1.35;
    }

    /* grows out of the settings button like Prism's tooltip, the corner at the button sharp;
       same surface and anchor as the settings panel */
    .notice {
        position: fixed;
        right: 16px;
        bottom: 68px;
        z-index: 3;
        display: flex;
        align-items: center;
        gap: var(--gap-2);
        max-width: calc(100vw - 32px);
        padding: 8px 8px 8px 16px;
        border-radius: 16px;
        border-bottom-right-radius: 6px;
        background: var(--background);
        outline: 1.5px solid var(--helium-elevated-10);
        outline-offset: -1.5px;
        box-shadow: 4px 4px 24px 0 var(--tooltip-shadow);
        transform-origin: bottom right;
        font-size: 14px;
        color: var(--secondary);
    }

    .link {
        all: unset;
        flex: none;
        cursor: pointer;
        border-radius: 4px;
        color: var(--primary);
        font-weight: 500;
        text-decoration: underline;
        text-decoration-color: var(--tertiary);
        text-underline-offset: 3px;
        white-space: nowrap;
        transition: text-decoration-color 0.15s;
    }

    .link:focus-visible {
        outline: 2px solid var(--primary);
        outline-offset: 2px;
    }

    .link:hover {
        text-decoration-color: currentColor;
    }

    .close {
        all: unset;
        display: grid;
        place-items: center;
        width: 26px;
        height: 26px;
        border-radius: 50%;
        cursor: pointer;
        color: var(--tertiary);
        transition: background-color 0.15s, color 0.15s;
    }

    .close:hover,
    .close:focus-visible {
        color: var(--primary);
        background: var(--helium-elevated-10);
    }

    .close :global(svg) {
        width: 14px;
        height: 14px;
    }
</style>
