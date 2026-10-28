<script lang="ts">
    import { Button, Link, Toggle } from "@imput/helium-prism";
    import { t } from "../i18n";
    import { pop } from "../motion";
    import { WEB } from "../permissions.svelte";
    import { fromZip } from "../updates";
    import { version } from "../../package.json";
    import { offerUndo } from "../undo.svelte";
    import { exportSettings, importSettings, resetSettings } from "../backup.svelte";
    import type { Settings } from "../storage.svelte";
    import Row from "../Row.svelte";
    import Section from "./Section.svelte";
    import List from "./List.svelte";

    let { settings = $bindable(), emphasize }: { settings: Settings; emphasize: () => void } = $props();

    let importInput: HTMLInputElement | undefined = $state();
    let note = $state("");
    let confirmReset = $state(false);

    // a backup replaces everything: the old settings stay one Undo away
    const keep = () => {
        const before = $state.snapshot(settings);
        return () => {
            Object.assign(settings, before);
            note = "";
            emphasize();
        };
    };

    async function pickBackup(file: File | undefined) {
        if (!file) return;
        const restore = keep();
        const result = await importSettings(file, settings);
        note = result.ok ? "" : result.text;
        if (result.ok) offerUndo(result.text, restore);
        emphasize();
        if (importInput) importInput.value = "";
    }

    function reset() {
        if (!confirmReset) {
            confirmReset = true;
            setTimeout(() => (confirmReset = false), 4000);
            return;
        }
        confirmReset = false;
        const restore = keep();
        note = "";
        offerUndo(resetSettings(settings), restore);
        emphasize();
    }
</script>

<Section title={t("backup")}>
    <List>
        <Row name={t("export")} desc={t("settings_and_shortcuts_as")}>
            <Button
                onclick={() => {
                    note = exportSettings(settings);
                    emphasize();
                }}>{t("save")}</Button
            >
        </Row>
        <Row name={t("import")} desc={t("import_desc")}>
            <Button onclick={() => importInput?.click()}>{t("open_file")}</Button>
        </Row>
    </List>
    <input
        bind:this={importInput}
        class="s-file"
        type="file"
        accept="application/json,.json"
        onchange={(e) => pickBackup(e.currentTarget.files?.[0])}
    />
    {#if note}
        {#key note}
            <p class="s-note" transition:pop={{ from: 0.96, duration: 150 }}>{note}</p>
        {/key}
    {/if}
</Section>

<Section title={t("reset")}>
    <List>
        <Row name={t("defaults")} desc={t("your_shortcuts_are_reset")}>
            <Button onclick={reset} class={[confirmReset && "danger"]}>
                {confirmReset ? t("sure") : t("reset")}
            </Button>
        </Row>
    </List>
</Section>

<Section title={t("about")}>
    <List>
        {#if !WEB && fromZip()}
            <Toggle bind:checked={settings.updateCheck} onchange={emphasize} name={t("check_for_updates")} desc={t("check_for_updates_desc")} />
        {/if}
        <!-- one row: name, version and author, the project page on the right -->
        <Row name="Shimmer Tab" desc="{t('version', { version })} · {t('made_by')} Dmytrii Savin">
            <Link href="https://github.com/dmitthedazed/shimmer-tab">GitHub</Link>
        </Row>
    </List>
</Section>
