<script lang="ts">
    import { openInternal } from "./open";
    import { t } from "./i18n";
    import { Button, Input, Text } from "@imput/helium-prism";
    import { flip } from "svelte/animate";
    import { cubicOut } from "svelte/easing";
    import { pop } from "./motion";
    import { slide } from "svelte/transition";

    // names fold away under the icon instead of popping out
    function collapse(node: Element) {
        const s = slide(node, { duration: 220, easing: cubicOut });
        const css = s.css!;
        return { ...s, css: (t: number, u: number) => `${css(t, u)}; opacity: ${t};` };
    }
    import SiteIcon from "./SiteIcon.svelte";
    import { forgetIcon } from "./icons";
    import { normalizeUrl, type Shortcut } from "./storage.svelte";

    type Props = {
        items: Shortcut[];
        /** read-only list (most visited) */
        readonly?: boolean;
        label: string;
        /** icons on a uniform plate instead of bare logos */
        contained?: boolean;
        /** show names under the icons */
        titles?: boolean;
        /** show 1–9 badges while Alt is held (the number keys) */
        numbers?: boolean;
        /** CSS color for single-color icons */
        tint?: string | null;
        onchange?: () => void;
        /** return true to handle a tile click yourself (the link's href stays for middle-click) */
        onopen?: (index: number, e: MouseEvent) => boolean;
    };

    let {
        items = $bindable(),
        readonly = false,
        label,
        contained = false,
        titles = true,
        numbers = false,
        tint = null,
        onchange,
        onopen,
    }: Props = $props();

    let editing: number | null = $state(null); // index, or -1 for a new one
    let title = $state("");
    let url = $state("");
    let urlInput: HTMLInputElement | undefined = $state();
    let dragFrom: number | null = $state(null);
    let dragOver: number | null = $state(null);
    let altHeld = $state(false);

    // stable keys for animate:flip, even if the same URL is pinned twice
    const keyed = $derived(
        items.map((item, i) => ({
            item,
            i,
            key: `${item.url}#${items.slice(0, i).filter((x) => x.url === item.url).length}`,
        })),
    );

    const host = (u: string) => {
        try {
            return new URL(u).hostname.replace(/^www\./, "");
        } catch {
            return u;
        }
    };

    function open(i: number) {
        editing = i;
        title = i >= 0 ? items[i].title : "";
        url = i >= 0 ? items[i].url : "";
        queueMicrotask(() => urlInput?.focus());
    }

    function close() {
        editing = null;
    }

    function submit(e: SubmitEvent) {
        e.preventDefault();
        const normalized = normalizeUrl(url);
        if (!normalized || editing === null) return;
        const entry = { title: title.trim() || host(normalized), url: normalized };
        if (editing >= 0) {
            if (items[editing].url !== normalized) forgetIcon(items[editing].url);
            items[editing] = entry;
        } else {
            items.push(entry);
        }
        close();
        onchange?.();
    }

    function remove(i: number) {
        items.splice(i, 1);
        close();
        onchange?.();
    }

    function drop(to: number) {
        if (dragFrom === null || dragFrom === to) return;
        const [moved] = items.splice(dragFrom, 1);
        items.splice(to, 0, moved);
        onchange?.();
    }
</script>

<svelte:window
    onkeydown={(e) => {
        if (e.key === "Escape" && editing !== null) close();
        if (e.key === "Alt") altHeld = true;
    }}
    onkeyup={(e) => {
        if (e.key === "Alt") altHeld = false;
    }}
    onblur={() => (altHeld = false)}
/>

<nav class={["shortcuts", !titles && "compact"]} aria-label={label}>
    {#each keyed as { item, i, key } (key)}
        <div
            class={["tile-wrap", dragFrom === i && "dragging", dragOver === i && dragFrom !== i && "over"]}
            animate:flip={{ duration: 200, easing: cubicOut }}
            transition:pop
            role="listitem"
            draggable={!readonly}
            ondragstart={(e) => {
                dragFrom = i;
                e.dataTransfer?.setData("text/uri-list", item.url);
                if (e.dataTransfer) e.dataTransfer.effectAllowed = "move";
            }}
            ondragover={(e) => {
                if (dragFrom === null) return;
                e.preventDefault();
                dragOver = i;
            }}
            ondragleave={() => dragOver === i && (dragOver = null)}
            ondrop={(e) => {
                e.preventDefault();
                drop(i);
            }}
            ondragend={() => (dragFrom = dragOver = null)}
        >
            <a class="button transparent tile" href={item.url} draggable="false" onclick={(e) => (onopen?.(i, e) || openInternal(item.url, e.ctrlKey || e.metaKey)) && e.preventDefault()}
                onauxclick={(e) => e.button === 1 && openInternal(item.url, true) && e.preventDefault()} title={titles ? item.url : item.title || host(item.url)} aria-label={item.title || host(item.url)}>
                <SiteIcon url={item.url} title={item.title} {contained} {tint} />
                {#if titles}
                    <span class="title" transition:collapse>{item.title || host(item.url)}</span>
                {/if}
            </a>
            {#if !readonly}
                <button type="button" class="circle edit" aria-label={t("edit_name", { name: item.title })} onclick={() => open(i)}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" /><path d="M12 12m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" /><path d="M19 12m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" /></svg>
                </button>
            {/if}
            {#if numbers && altHeld && i < 9}
                <span class="hint" aria-hidden="true" transition:pop>{i + 1}</span>
            {/if}
        </div>
    {/each}

    {#if !readonly}
        <div class="tile-wrap" transition:pop>
            <button type="button" class="transparent tile add" onclick={() => open(-1)}>
                <span class="add-icon" aria-hidden="true">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M12 5v14M5 12h14" /></svg>
                </span>
                {#if titles}
                    <span class="title" transition:collapse>{t("add")}</span>
                {/if}
            </button>
        </div>
    {/if}
</nav>

{#if editing !== null}
    <div class="scrim" role="presentation" onclick={close} transition:pop={{ from: 1 }}></div>
    <form class="dialog" onsubmit={submit} transition:pop>
        <Text variant="subheading">{editing >= 0 ? t("edit_shortcut") : t("add_shortcut")}</Text>
        <Input bind:value={title} aria-label={t("name")} placeholder={t("name")} />
        <Input
            bind:value={url}
            bind:input={urlInput}
            aria-label="URL"
            placeholder="example.com"
            spellcheck="false"
            autocapitalize="off"
        />
        <div class="actions">
            {#if editing >= 0}
                <Button transparent onclick={() => remove(editing!)}>{t("remove")}</Button>
            {/if}
            <span class="spacer"></span>
            <Button onclick={close}>{t("cancel")}</Button>
            <Button primary type="submit" disabled={!normalizeUrl(url)}>{t("save")}</Button>
        </div>
    </form>
{/if}

<style>
    /* flex, not grid: tiles change width smoothly and the row reflows with them */
    .shortcuts {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        gap: 6px;
        /* room for 8 tiles in a row */
        width: min(100%, 800px);
    }

    .tile-wrap {
        position: relative;
        transition: opacity 0.2s;
    }

    .tile-wrap.dragging {
        opacity: 0.35;
    }

    /* a transparent Prism card button: hover and press come from Prism */
    .tile {
        flex-direction: column;
        justify-content: flex-start;
        gap: 0;
        width: 92px;
        transition:
            background-color 0.2s,
            transform 0.2s,
            color 0.2s,
            width 0.25s ease,
            padding 0.25s ease;
        min-height: 0;
        padding: 12px 6px 10px !important;
        border: none;
        border-radius: 18px;
        color: var(--secondary);
        font: inherit;
        text-decoration: none;
        cursor: pointer;
    }

    .compact .tile {
        width: 72px;
        padding: 12px !important;
    }

    .tile:hover {
        color: var(--primary);
    }

    .tile-wrap.over .tile {
        background-color: var(--helium-elevated-10);
    }

    .tile:focus-visible {
        outline-offset: -2px;
    }

    .title {
        margin-top: 8px;
        max-width: 100%;
        overflow: hidden;
        font-size: 13px;
        white-space: nowrap;
        text-overflow: ellipsis;
        transition: color 0.2s;
    }

    .add {
        color: var(--tertiary);
    }

    :global(:root[data-picture]) .title {
        text-shadow: var(--text-halo);
    }

    /* the plate under "+" darkens with the halo, so the icon holds on a bright picture */
    :global(:root[data-picture]) .add-icon {
        background: color-mix(in srgb, var(--background) calc(var(--halo) * 100%), var(--helium-elevated-7));
    }

    :global(:root[data-picture]) .add:hover .add-icon {
        background: color-mix(in srgb, var(--background) calc(var(--halo) * 100%), var(--helium-elevated-10));
    }

    .add-icon {
        display: grid;
        place-items: center;
        width: 48px;
        height: 48px;
        border-radius: 14px;
        background: var(--helium-elevated-7);
        transition: background-color 0.2s;
    }

    .add:hover .add-icon {
        background: var(--helium-elevated-10);
    }

    .add-icon svg {
        width: 20px;
        height: 20px;
        stroke-width: 1.8;
    }

    /* small Prism circle button, appears like a tooltip */
    .edit {
        --size: 26px;
        position: absolute;
        top: 2px;
        right: 2px;
        color: var(--secondary);
        background-color: var(--background) !important;
        box-shadow: 0 0 0 1px var(--helium-elevated-10), 0 2px 6px var(--tooltip-shadow);
        opacity: 0;
        scale: 0.8;
        transition: opacity 0.15s, scale 0.15s, color 0.2s;
    }

    .edit svg {
        width: 16px;
        height: 16px;
    }

    /* the number key for this tile, shown only while Alt is held */
    .hint {
        position: absolute;
        top: 2px;
        left: 2px;
        z-index: 1;
        display: grid;
        place-items: center;
        width: 18px;
        height: 18px;
        border-radius: 50%;
        font-size: 11px;
        font-weight: 600;
        line-height: 1;
        color: var(--background);
        background-color: var(--secondary);
        pointer-events: none;
    }

    .tile-wrap:hover .edit,
    .edit:focus-visible {
        opacity: 1;
        scale: 1;
    }

    .edit:hover {
        color: var(--primary);
    }

    .scrim {
        position: fixed;
        inset: 0;
        z-index: 10;
        background: rgb(0 0 0 / 0.2);
    }

    /* same surface as the settings panel */
    .dialog {
        position: fixed;
        top: 50%;
        left: 50%;
        z-index: 11;
        display: flex;
        flex-direction: column;
        gap: var(--gap-2);
        width: min(calc(100vw - 32px), 380px);
        padding: var(--gap-4);
        border-radius: var(--card-border-radius);
        background: var(--background);
        outline: 1.5px solid var(--helium-elevated-10);
        outline-offset: -1.5px;
        box-shadow: 4px 4px 24px 0 var(--tooltip-shadow);
        translate: -50% -50%;
    }

    .dialog :global(h4) {
        margin: 0 0 4px;
        font-size: 18px;
        font-weight: 600;
    }

    .actions {
        display: flex;
        gap: var(--gap-1);
        margin-top: var(--gap-2);
    }

    .spacer {
        flex: 1;
    }
</style>
