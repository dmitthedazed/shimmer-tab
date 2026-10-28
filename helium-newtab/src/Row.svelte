<script lang="ts">
    import type { Snippet } from "svelte";

    // A settings row with a control on the right; matches Prism's Toggle rows.
    let { name, desc, children }: { name: string; desc?: string; children: Snippet } = $props();
</script>

<div class="row">
    <div class="text">
        <h4>{name}</h4>
        {#if desc}<p>{desc}</p>{/if}
    </div>
    <div class="control">{@render children()}</div>
</div>

<style>
    .row {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        gap: var(--gap-2) var(--gap-3);
        min-height: var(--row-height, 52px);
        padding: var(--row-padding, 10px 14px);
    }

    .text {
        display: flex;
        /* on a narrow panel a wide control drops below the name instead of overflowing */
        flex: 1 1 96px;
        flex-direction: column;
        gap: 3px;
        min-width: 0;
    }

    .control {
        flex-shrink: 0;
        max-width: 100%;
        margin-left: auto;
    }
</style>
