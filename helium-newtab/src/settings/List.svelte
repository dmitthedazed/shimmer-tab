<script lang="ts">
    import type { Snippet } from "svelte";
    import { pop } from "../motion";

    /** pops in and out with the option that reveals it */
    let { animate = false, children }: { animate?: boolean; children: Snippet } = $props();
</script>

<div class="list" transition:pop|global={animate ? { from: 0.96, duration: 150 } : { duration: 0 }}>
    {@render children()}
</div>

<style>
    /* grouped Prism cards: 2px apart, big radius only on the outer corners */
    .list {
        display: flex;
        flex-direction: column;
        gap: 2px;
    }

    .list > :global(*) {
        border-radius: 5px;
        background-color: var(--helium-elevated-7);
    }

    .list > :global(:first-child) {
        border-top-left-radius: 14px;
        border-top-right-radius: 14px;
    }

    .list > :global(:last-child) {
        border-bottom-left-radius: 14px;
        border-bottom-right-radius: 14px;
    }

    .list :global(.toggle-button) {
        min-height: 54px;
        padding: 10px 14px 10px 16px;
    }

    .list :global(.toggle-button:active) {
        transform: none;
        background-color: var(--helium-elevated-15);
    }

    .list :global(h4) {
        font-size: 15px;
    }

    .list :global(p) {
        font-size: 13px;
    }

    .list > :global(.row) {
        --row-height: 54px;
        --row-padding: 10px 10px 10px 16px;
    }

    .list :global(.danger) {
        color: #fff;
        background-color: #e5484d !important;
    }
</style>
