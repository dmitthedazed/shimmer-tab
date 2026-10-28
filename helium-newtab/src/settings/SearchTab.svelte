<script lang="ts">
    import { Dropdown, Input, Toggle } from "@imput/helium-prism";
    import { t } from "../i18n";
    import { grow } from "../motion";
    import { ENGINES, suggestEndpoint } from "../engines";
    import { grantOrigin, WEB } from "../permissions.svelte";
    import type { Settings } from "../storage.svelte";
    import Row from "../Row.svelte";
    import List from "./List.svelte";
    import PermToggle from "./PermToggle.svelte";

    let { settings = $bindable(), emphasize, advanced }: { settings: Settings; emphasize: () => void; advanced: boolean } = $props();

    const engineOptions = [
        { value: "browser", label: t("browser_default") },
        ...Object.entries(ENGINES).map(([value, e]) => ({ value, label: e.name })),
        { value: "custom", label: t("custom") },
    ];

    /** asks to read the engine's suggestions; settles to true where there is nothing to ask for */
    const askSuggest = () => {
        const endpoint = suggestEndpoint(settings.engine);
        return endpoint ? grantOrigin(endpoint) : Promise.resolve(true);
    };
</script>

<List>
    <Toggle bind:checked={settings.searchShown} onchange={emphasize} name={t("show_search_bar")} desc={t("show_search_bar_desc")} />
    <Row name={t("search_engine")}>
        <Dropdown
            width="196px"
            aria-label={t("search_engine")}
            value={settings.engine}
            options={engineOptions}
            onchange={(e) => {
                settings.engine = e.currentTarget.value;
                if (settings.suggestions) askSuggest().then((ok) => ok || (settings.suggestions = false));
                emphasize();
            }}
        />
    </Row>
    {#if settings.engine === "custom"}
        <div class="more" transition:grow>
            <Row name={t("custom_engine")} desc={t("custom_engine_url")}>
                <Input
                    small
                    width="200px"
                    bind:value={settings.customEngine}
                    aria-label={t("custom_engine")}
                    placeholder="https://example.com/?q=%s"
                    spellcheck="false"
                />
            </Row>
        </div>
    {/if}
    {#if !WEB}
        <PermToggle
            bind:checked={settings.suggestions}
            request={askSuggest}
            onchange={emphasize}
            name={t("suggestions")}
            desc={suggestEndpoint(settings.engine) ? t("suggestions_desc") : t("suggestions_pick_engine")}
        />
    {/if}
    {#if advanced}
        <div class="more" transition:grow>
            <Toggle bind:checked={settings.bangs} onchange={emphasize} name={t("bangs")} desc={t("yt_cats_w_helium")} />
            <Toggle bind:checked={settings.answers} onchange={emphasize} name={t("answers")} desc={t("answers_desc")} />
        </div>
    {/if}
</List>
