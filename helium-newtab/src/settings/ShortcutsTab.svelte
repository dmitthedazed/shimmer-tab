<script lang="ts">
    import { Button, Toggle } from "@imput/helium-prism";
    import { t } from "../i18n";
    import { grant, perms, revoke, WEB } from "../permissions.svelte";
    import type { Settings } from "../storage.svelte";
    import Row from "../Row.svelte";
    import Swatches from "../Swatches.svelte";
    import Section from "./Section.svelte";
    import List from "./List.svelte";
    import PermToggle from "./PermToggle.svelte";

    type Props = { settings: Settings; emphasize: () => void; onclose: () => void; onaddshortcuts: () => void };
    let { settings = $bindable(), emphasize, onclose, onaddshortcuts }: Props = $props();

    // mirrors the optional permission, which can also change from the browser's side
    let sitesAccess = $state(perms.sites);
    $effect(() => {
        sitesAccess = perms.sites;
    });
</script>

<Section title={t("shortcuts")}>
    <List>
        <Toggle bind:checked={settings.shortcuts} onchange={emphasize} name={t("show_shortcuts")} desc={t("hover_to_edit_drag")} />
        {#if settings.shortcuts}
            <Toggle bind:checked={settings.shortcutTitles} onchange={emphasize} name={t("names")} />
            <Toggle bind:checked={settings.shortcutKeys} onchange={emphasize} name={t("number_keys")} desc={t("number_keys_desc")} />
            <Toggle
                checked={settings.iconStyle === "contained"}
                onchange={(on) => {
                    settings.iconStyle = on ? "contained" : "plain";
                    emphasize();
                }}
                name={t("icon_containers")}
            />
            <Toggle bind:checked={settings.iconTint} onchange={emphasize} name={t("single_color")} desc={t("paint_all_icons_in")} />
            {#if settings.iconTint}
                <Row name={t("color")}>
                    <Swatches bind:value={settings.tintColor} onchange={emphasize} />
                </Row>
            {/if}
            <Toggle bind:checked={settings.lockShortcuts} onchange={emphasize} name={t("lock")} desc={t("hide_add_and_edit")} />
            <Row name={t("add_shortcuts")} desc={t("paste_or_open_a")}>
                <Button
                    onclick={() => {
                        onclose();
                        onaddshortcuts();
                    }}>{t("add")}</Button
                >
            </Row>
            {#if !WEB}
                <PermToggle
                    bind:checked={sitesAccess}
                    request={() => grant("sites")}
                    release={() => revoke("sites")}
                    onchange={emphasize}
                    name={t("icons_for_every_site")}
                    desc={t("read_sites_own_hq")}
                />
            {/if}
        {/if}
    </List>
</Section>

{#if !WEB}
    <Section title={t("history")}>
        <List>
            <PermToggle
                bind:checked={settings.topSites}
                request={() => grant("topSites")}
                onchange={emphasize}
                name={t("most_visited")}
                desc={t("top_sites_below_your")}
            />
            <PermToggle
                bind:checked={settings.recentTabs}
                request={() => grant("recentTabs")}
                release={() => revoke("recentTabs")}
                onchange={emphasize}
                name={t("recently_closed")}
                desc={t("recently_closed_desc")}
            />
        </List>
    </Section>
{/if}
