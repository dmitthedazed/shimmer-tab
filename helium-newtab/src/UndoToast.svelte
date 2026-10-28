<script lang="ts">
    import { IconX } from "@imput/helium-prism";
    import { t } from "./i18n";
    import { pop } from "./motion";
    import { dropUndo, holdUndo, runUndo, undo } from "./undo.svelte";
</script>

<!-- bottom left, clear of the corner buttons and above the settings panel -->
{#if undo.restore}
    {#key undo.id}
        <div
            class="undo-toast"
            role="status"
            transition:pop
            onpointerenter={() => holdUndo(true)}
            onpointerleave={() => holdUndo(false)}
            onfocusin={() => holdUndo(true)}
            onfocusout={() => holdUndo(false)}
        >
            <span class="text">{undo.text}</span>
            <button type="button" class="link" onclick={runUndo}>{t("undo")}</button>
            <button type="button" class="close" aria-label={t("dismiss")} onclick={dropUndo}><IconX /></button>
        </div>
    {/key}
{/if}

<style>
    .undo-toast {
        position: fixed;
        left: 16px;
        bottom: 16px;
        z-index: 6;
        display: flex;
        align-items: center;
        gap: var(--gap-2);
        /* leaves the two corner buttons free */
        max-width: min(420px, calc(100vw - 132px));
        padding: 8px 8px 8px 16px;
        border-radius: 16px;
        border-bottom-left-radius: 6px;
        background: var(--background);
        outline: 1.5px solid var(--helium-elevated-10);
        outline-offset: -1.5px;
        box-shadow: 4px 4px 24px 0 var(--tooltip-shadow);
        transform-origin: bottom left;
        font-size: 14px;
        line-height: 1.35;
        color: var(--secondary);
    }

    .text {
        min-width: 0;
    }

    .link {
        all: unset;
        flex: none;
        padding: 4px 6px;
        margin: -4px -2px;
        border-radius: 6px;
        cursor: pointer;
        color: var(--primary);
        font-weight: 500;
        text-decoration: underline;
        text-decoration-color: var(--tertiary);
        text-underline-offset: 3px;
        white-space: nowrap;
        transition: text-decoration-color 0.15s;
    }

    .link:hover {
        text-decoration-color: currentColor;
    }

    .link:focus-visible {
        outline: 2px solid var(--primary);
    }

    .close {
        all: unset;
        flex: none;
        display: grid;
        place-items: center;
        width: 28px;
        height: 28px;
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
