<script lang="ts">
    import { IconX } from "@imput/helium-prism";
    import { t } from "./i18n";
    import { pop } from "./motion";
    import type { Notice } from "./updates";

    let { notice, ondismiss }: { notice: Notice; ondismiss: () => void } = $props();
</script>

<div class="notice" role="status" transition:pop={{ from: 0.96, duration: 200 }}>
    <span class="text">
        {notice.kind === "updated" ? t("updated_to", { version: notice.version }) : t("update_out", { version: notice.version })}
    </span>
    <a class="link" href={notice.url} target="_blank" rel="noopener" onclick={ondismiss}>
        {notice.kind === "updated" ? t("whats_new") : t("view_release")}
    </a>
    <button type="button" class="close" aria-label={t("dismiss")} onclick={ondismiss}><IconX /></button>
</div>

<style>
    /* same surface as the settings panel */
    .notice {
        position: fixed;
        left: 16px;
        bottom: 16px;
        z-index: 3;
        display: flex;
        align-items: center;
        gap: var(--gap-2);
        max-width: calc(100vw - 32px);
        padding: 8px 8px 8px 16px;
        border-radius: 16px;
        background: var(--background);
        outline: 1.5px solid var(--helium-elevated-10);
        outline-offset: -1.5px;
        box-shadow: 4px 4px 24px 0 var(--tooltip-shadow);
        transform-origin: bottom left;
        font-size: 14px;
        color: var(--secondary);
    }

    .link {
        color: var(--helium-blue);
        font-weight: 500;
        text-decoration: none;
        white-space: nowrap;
    }

    .link:hover {
        text-decoration: underline;
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
