<script lang="ts">
    import type { Snippet } from "svelte";

    let { title, children }: { title: string; children: Snippet } = $props();
</script>

<section>
    <h5>{title}</h5>
    {@render children()}
</section>

<style>
    section {
        display: flex;
        flex-direction: column;
        gap: var(--gap-2);
    }

    h5 {
        margin: 0;
        padding: 0 var(--gap-1);
        color: var(--tertiary);
        font-size: 13px;
        font-weight: 500;
    }
</style>
