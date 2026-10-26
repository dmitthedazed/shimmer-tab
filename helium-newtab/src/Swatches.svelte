<script lang="ts" module>
    import { t } from "./i18n";
    // Color choice: a few presets and a custom one (icon tint by default).
    const iconPresets = [
        { value: "accent", label: t("accent"), color: "var(--helium-elevated)" },
        { value: "text", label: t("text"), color: "var(--primary)" },
        { value: "#e5484d", label: t("red"), color: "#e5484d" },
        { value: "#f5a524", label: t("amber"), color: "#f5a524" },
        { value: "#30a46c", label: t("green"), color: "#30a46c" },
        { value: "#8e4ec6", label: t("purple"), color: "#8e4ec6" },
    ];
</script>

<script lang="ts">
    type Preset = { value: string; label: string; color: string };
    let {
        value = $bindable(),
        onchange,
        presets = iconPresets,
        label = t("icon_color"),
    }: { value: string; onchange?: () => void; presets?: Preset[]; label?: string } = $props();

    const custom = $derived(!!value && !presets.some((p) => p.value === value));

    // The browser opens its picker from the input's left edge and doesn't always keep it
    // on screen (Wayland, fullscreen), so near the right edge the input reaches leftward.
    let towardLeft = $state(false);
    function aim(e: Event) {
        const box = (e.currentTarget as HTMLElement).getBoundingClientRect();
        towardLeft = box.left > innerWidth / 2;
    }

    function pick(v: string) {
        value = v;
        onchange?.();
    }
</script>

<div class="swatches" role="radiogroup" aria-label={label}>
    {#each presets as preset (preset.value)}
        <button
            type="button"
            role="radio"
            aria-checked={value === preset.value}
            aria-label={preset.label}
            title={preset.label}
            class={["swatch", value === preset.value && "active"]}
            style:--swatch={preset.color}
            onclick={() => pick(preset.value)}
        ></button>
    {/each}
    <label
        class={["swatch", "custom", custom && "active"]}
        style:--swatch={custom ? value : undefined}
        title={t("custom")}
        onpointerenter={aim}
        onfocusin={aim}
    >
        <input
            type="color"
            aria-label={t("custom_color")}
            class:toward-left={towardLeft}
            value={custom ? value : "#3450d1"}
            oninput={(e) => pick(e.currentTarget.value)}
        />
    </label>
</div>

<style>
    .swatches {
        display: flex;
        gap: 6px;
    }

    .swatch {
        position: relative;
        width: 22px;
        height: 22px;
        min-height: 0;
        padding: 0 !important;
        border: none;
        border-radius: 50%;
        background: var(--swatch) !important;
        box-shadow: inset 0 0 0 1px rgb(0 0 0 / 0.08);
        cursor: pointer;
        transition: transform 0.2s, box-shadow 0.2s;
    }

    .swatch:active {
        transform: scale(0.9);
    }

    .swatch.active {
        box-shadow:
            0 0 0 2px var(--background),
            0 0 0 4px var(--helium-elevated);
    }

    .custom {
        background: var(
            --swatch,
            conic-gradient(#e5484d, #f5a524, #30a46c, #0090ff, #8e4ec6, #e5484d)
        ) !important;
    }

    .custom input {
        position: absolute;
        inset: 0;
        width: 100%;
        height: 100%;
        opacity: 0;
        cursor: pointer;
    }

    /* the label still takes the clicks and passes them on */
    .custom input.toward-left {
        left: auto;
        width: 240px;
        pointer-events: none;
    }

    .swatch:focus-visible,
    .custom:focus-within {
        outline: 2px solid var(--primary);
        outline-offset: 3px;
    }
</style>
