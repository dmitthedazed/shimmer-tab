<script lang="ts" generics="T extends string">
    import { untrack } from "svelte";

    type Props = {
        options: { value: T; label: string }[];
        value: T;
        label: string;
        small?: boolean;
        onchange?: (value: T) => void;
    };

    let { options, value = $bindable(), label, small = false, onchange }: Props = $props();

    // one indicator that morphs (slides and resizes) to the selected segment
    let root: HTMLDivElement | undefined = $state();
    let width = $state(0); // re-measure when the control resizes
    let indicator: { x: number; w: number } | null = $state(null);
    let animate = $state(false);

    $effect(() => {
        void width;
        const index = options.findIndex((o) => o.value === value);
        const el = root?.querySelectorAll<HTMLButtonElement>("button")[index];
        const next = el ? { x: el.offsetLeft, w: el.offsetWidth } : null;
        indicator = next;
        // no slide-in on first paint (read without tracking to avoid a loop)
        if (next && !untrack(() => animate)) requestAnimationFrame(() => (animate = true));
    });

    function pick(option: { value: T }) {
        if (option.value === value) return;
        value = option.value;
        onchange?.(option.value);
    }

    // a radio group is one tab stop; the arrows move the choice, like native radios
    function onkeydown(e: KeyboardEvent) {
        const keys: Record<string, number> = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 };
        const n = options.length;
        const at = Math.max(0, options.findIndex((o) => o.value === value));
        const next =
            e.key === "Home" ? 0 : e.key === "End" ? n - 1 : e.key in keys ? (at + keys[e.key] + n) % n : -1;
        if (next < 0) return;
        e.preventDefault();
        pick(options[next]);
        root?.querySelectorAll<HTMLButtonElement>("button")[next]?.focus();
    }
</script>

<div
    class={["segmented", small && "small"]}
    role="radiogroup"
    aria-label={label}
    tabindex="-1"
    bind:this={root}
    bind:clientWidth={width}
    {onkeydown}
>
    {#if indicator}
        <span
            class={["indicator", animate && "animate"]}
            style:transform="translateX({indicator.x}px)"
            style:width="{indicator.w}px"
            aria-hidden="true"
        ></span>
    {/if}
    {#each options as option, i (option.value)}
        <button
            type="button"
            role="radio"
            aria-checked={value === option.value}
            tabindex={value === option.value || (i === 0 && !options.some((o) => o.value === value)) ? 0 : -1}
            class={[value === option.value && "active"]}
            onclick={() => pick(option)}
        >
            {option.label}
        </button>
    {/each}
</div>

<style>
    .segmented {
        position: relative;
        display: flex;
        gap: 2px;
        padding: 3px;
        border-radius: 14px;
        background: var(--helium-elevated-7);
    }

    .indicator {
        position: absolute;
        top: 3px;
        bottom: 3px;
        left: 0;
        border-radius: 11px;
        background: color-mix(in srgb, var(--helium-elevated) 14%, var(--background));
        box-shadow:
            0 0 0 1px var(--helium-elevated-10),
            0 1px 3px var(--tooltip-shadow);
    }

    .indicator.animate {
        transition: transform 0.2s ease, width 0.2s ease;
    }

    button {
        position: relative;
        flex: 1;
        min-width: 0;
        padding: 7px 10px;
        border: none;
        border-radius: 11px;
        background: none;
        color: var(--secondary);
        font: inherit;
        font-size: 14px;
        white-space: nowrap;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: color 0.2s;
    }

    button:hover,
    button.active {
        color: var(--primary);
    }

    .small {
        border-radius: 11px;
    }

    .small .indicator {
        border-radius: 8px;
    }

    .small button {
        flex: none;
        padding: 5px 10px;
        border-radius: 8px;
        font-size: 13px;
    }

    button:focus-visible {
        outline: 2px solid var(--primary);
        outline-offset: -2px;
    }
</style>
