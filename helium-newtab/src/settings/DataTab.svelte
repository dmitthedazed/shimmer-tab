<script lang="ts">
    import { Button, Link } from "@imput/helium-prism";
    import { t } from "../i18n";
    import { pop } from "../motion";
    import { version } from "../../package.json";
    import { exportSettings, importSettings, resetSettings } from "../backup.svelte";
    import type { Settings } from "../storage.svelte";
    import Row from "../Row.svelte";
    import Section from "./Section.svelte";
    import List from "./List.svelte";

    let { settings = $bindable(), emphasize }: { settings: Settings; emphasize: () => void } = $props();

    let importInput: HTMLInputElement | undefined = $state();
    let note = $state("");
    let confirmReset = $state(false);

    async function pickBackup(file: File | undefined) {
        if (!file) return;
        note = await importSettings(file, settings);
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
        note = resetSettings(settings);
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
        <Row name={t("import")} desc={t("restore_from_a_saved")}>
            <Button onclick={() => importInput?.click()}>{t("open")}</Button>
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
            <p class="s-note" in:pop={{ from: 0.96, duration: 150 }}>{note}</p>
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
        <Row name="Shimmer Tab" desc={t("version", { version })}>
            <Link href="https://github.com/dmitthedazed/shimmer-tab">GitHub</Link>
        </Row>
        <Row name={t("made_by")} desc="Dmytrii Savin">
            <Link href="https://github.com/dmitthedazed">@dmitthedazed</Link>
        </Row>
    </List>
</Section>
