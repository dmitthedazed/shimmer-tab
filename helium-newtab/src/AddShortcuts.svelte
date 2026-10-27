<script lang="ts">
    import { t } from "./i18n";
    import { Button, Text } from "@imput/helium-prism";
    import { pop } from "./motion";
    import { countLinks, parseShortcuts, type Shortcut } from "./storage.svelte";

    type Props = {
        items: Shortcut[];
        onchange?: () => void;
        onclose: () => void;
    };

    let { items = $bindable(), onchange, onclose }: Props = $props();

    let text = $state("");
    let fileInput: HTMLInputElement | undefined = $state();
    let area: HTMLTextAreaElement | undefined = $state();
    const found = $derived(text.trim() ? parseShortcuts(text) : []);
    const count = $derived(countLinks(found));

    $effect(() => area?.focus());

    async function pickFile(file: File | undefined) {
        if (file) text = await file.text();
        if (fileInput) fileInput.value = "";
    }

    function submit(e: SubmitEvent) {
        e.preventDefault();
        if (!found.length) return;
        items.push(...found);
        onchange?.();
        onclose();
    }
</script>

<svelte:window onkeydown={(e) => e.key === "Escape" && onclose()} />

<div class="scrim" role="presentation" onclick={onclose} transition:pop={{ from: 1 }}></div>
<form class="dialog" onsubmit={submit} transition:pop>
    <Text variant="subheading">{t("add_shortcuts")}</Text>
    <label class="input-field">
        <textarea
            bind:this={area}
            bind:value={text}
            aria-label={t("shortcuts")}
            placeholder={'github.com\nReddit reddit.com\n\nor JSON: [{ "name": "…", "url": "…" }]'}
            spellcheck="false"
            autocapitalize="off"
            rows="6"
        ></textarea>
    </label>
    <p class="hint" class:ready={found.length}>
        {#if found.length}
            {count} {count === 1 ? "shortcut" : "shortcuts"} found
        {:else}
            One link per line, optionally with a name, a JSON list or a Yet Another Speed Dial export
        {/if}
    </p>
    <input
        bind:this={fileInput}
        class="file"
        type="file"
        accept="application/json,text/plain,.json,.txt"
        onchange={(e) => pickFile(e.currentTarget.files?.[0])}
    />
    <div class="actions">
        <Button transparent onclick={() => fileInput?.click()}>{t("open_file")}</Button>
        <span class="spacer"></span>
        <Button onclick={onclose}>{t("cancel")}</Button>
        <Button primary type="submit" disabled={!found.length}>{t("add")}</Button>
    </div>
</form>

<style>
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
        width: min(calc(100vw - 32px), 420px);
        padding: var(--gap-4);
        border-radius: var(--card-border-radius);
        background: var(--background);
        outline: 1.5px solid var(--helium-elevated-10);
        outline-offset: -1.5px;
        box-shadow: 4px 4px 24px 0 var(--tooltip-shadow);
        translate: -50% -50%;
    }

    .input-field {
        padding: 13px 16px;
        align-items: stretch;
    }

    textarea {
        appearance: none;
        width: 100%;
        min-width: 0;
        resize: none;
        color: inherit;
        background: none;
        border: none;
        outline: none;
        font: inherit;
        font-size: 14px;
        font-weight: 500;
        line-height: 1.45;
    }

    textarea::placeholder {
        color: var(--tertiary);
        font-weight: 500;
    }

    .hint {
        margin: 0;
        padding: 0 var(--gap-1);
        color: var(--tertiary);
        font-size: 13px;
        transition: color 0.2s;
    }

    .hint.ready {
        color: var(--secondary);
    }

    .file {
        display: none;
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
