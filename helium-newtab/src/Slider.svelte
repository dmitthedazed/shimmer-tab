<script lang="ts" generics="T extends string">
    // A stepped slider over a few named stops (Settings → Look → Effects). The range input
    // carries keyboard and screen reader support; the stop names under it are click targets.
    type Props = {
        options: { value: T; label: string; desc?: string }[];
        value: T;
        label: string;
        /** a visible heading above the slider */
        name?: string;
        onchange?: (value: T) => void;
    };

    let { options, value = $bindable(), label, name, onchange }: Props = $props();

    const index = $derived(Math.max(0, options.findIndex((o) => o.value === value)));
    const max = $derived(options.length - 1);
    const desc = $derived(options[index]?.desc);

    function set(i: number) {
        const next = options[i]?.value;
        if (next === undefined || next === value) return;
        value = next;
        onchange?.(next);
    }
</script>

<div class="slider">
    {#if name}<span class="name">{name}</span>{/if}
    <input
        type="range"
        min="0"
        {max}
        step="1"
        value={index}
        aria-label={label}
        aria-valuetext={options[index]?.label}
        style:--fill="{max ? (index / max) * 100 : 0}%"
        oninput={(e) => set(e.currentTarget.valueAsNumber)}
    />
    <div class="labels" aria-hidden="true">
        {#each options as option, i (option.value)}
            <button
                type="button"
                tabindex="-1"
                class={[i === index && "active"]}
                style:--at={max ? i / max : 0}
                onclick={() => set(i)}
            >
                {option.label}
            </button>
        {/each}
    </div>
    {#if desc}
        <p class="desc" aria-live="polite">{desc}</p>
    {/if}
</div>

<style>
    .slider {
        display: flex;
        flex-direction: column;
        gap: var(--gap-1);
        padding: 14px 16px 12px;
    }

    input {
        appearance: none;
        width: 100%;
        height: 24px;
        margin: 0;
        background: transparent;
        cursor: pointer;
        outline: none;
    }

    input::-webkit-slider-runnable-track {
        height: 6px;
        border-radius: 3px;
        background: linear-gradient(
            to right,
            var(--helium-elevated) var(--fill),
            var(--helium-elevated-15) var(--fill)
        );
    }

    input::-webkit-slider-thumb {
        appearance: none;
        width: 18px;
        height: 18px;
        margin-top: -6px;
        border-radius: 50%;
        background: var(--helium-elevated);
        border: 3px solid var(--background);
        box-shadow: 0 0 0 1px var(--helium-elevated-40), 0 2px 6px var(--tooltip-shadow);
        transition: scale 0.15s cubic-bezier(0.215, 0.61, 0.355, 1), box-shadow 0.15s;
    }

    input:hover::-webkit-slider-thumb {
        scale: 1.06;
    }

    input:active::-webkit-slider-thumb {
        scale: 1.12;
    }

    input:focus-visible::-webkit-slider-thumb {
        box-shadow: 0 0 0 1px var(--helium-elevated-40), 0 0 0 4px var(--helium-elevated-40);
    }

    /* each name sits under its stop: the thumb's center runs 9px in from either end */
    .labels {
        position: relative;
        height: 24px;
    }

    .labels button {
        all: unset;
        position: absolute;
        top: 0;
        left: calc(9px + (100% - 18px) * var(--at));
        translate: -50%;
        white-space: nowrap;
        padding: 4px 6px;
        border-radius: 6px;
        cursor: pointer;
        font-size: 12px;
        color: var(--tertiary);
        transition: color 0.2s;
    }

    /* the end names line up with the track ends (their text, not their padding) */
    .labels button:first-child {
        left: -6px;
        translate: none;
    }

    .labels button:last-child {
        left: auto;
        right: -6px;
        translate: none;
    }

    .labels button:hover {
        color: var(--secondary);
    }

    .labels button.active {
        color: var(--primary);
    }

    .desc {
        margin: 0;
        font-size: 13px;
        color: var(--secondary);
    }

    .name {
        font-size: 14px;
        font-weight: 500;
        color: var(--primary);
    }
</style>
