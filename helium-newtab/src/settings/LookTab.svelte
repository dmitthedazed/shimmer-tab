<script lang="ts">
    import { Toggle } from "@imput/helium-prism";
    import { t } from "../i18n";
    import { grow } from "../motion";
    import { grant, WEB } from "../permissions.svelte";
    import type { Settings } from "../storage.svelte";
    import Row from "../Row.svelte";
    import Segmented from "../Segmented.svelte";
    import Slider from "../Slider.svelte";
    import Swatches from "../Swatches.svelte";
    import BackgroundPicker from "./BackgroundPicker.svelte";
    import Section from "./Section.svelte";
    import List from "./List.svelte";
    import PermToggle from "./PermToggle.svelte";

    type Props = {
        settings: Settings;
        themeSource: "policy" | "own" | "no-access" | "no-policy" | null;
        emphasize: () => void;
        advanced: boolean;
    };
    let { settings = $bindable(), themeSource, emphasize, advanced }: Props = $props();

    // a few of Chromium's own theme seeds, for browsers without the policy
    const themePresets = ["#3450d1", "#1a73e8", "#0b8043", "#c5221f", "#e8710a", "#9334e6"].map((c) => ({
        value: c,
        label: c,
        color: c,
    }));
</script>

<BackgroundPicker bind:settings {emphasize} {advanced} />

<Section title={t("appearance")}>
    <List>
        <Toggle bind:checked={settings.logoShown} onchange={emphasize} name={t("show_logo")} />
        {#if advanced && settings.logoShown}
            <div class="more" transition:grow>
                <Toggle bind:checked={settings.chromeLogo} onchange={emphasize} name={t("chrome_logo")} desc={t("chrome_logo_desc")} />
                <Row name={t("logo_text")} desc={t("next_to_the_mark")}>
                    <Segmented
                        small
                        options={[
                            { value: "greeting", label: t("greeting") },
                            { value: "wordmark", label: settings.chromeLogo ? "Chrome" : "Helium" },
                            { value: "clock", label: t("clock") },
                            { value: "mark", label: t("none") },
                        ]}
                        bind:value={
                            () => (settings.logo === "bigClock" ? "clock" : settings.logo),
                            (v) => (settings.logo = v)
                        }
                        label={t("logo_text")}
                        onchange={emphasize}
                    />
                </Row>
                {#if settings.logo === "clock" || settings.logo === "bigClock"}
                    <div class="more" transition:grow>
                        <Toggle
                            bind:checked={
                                () => settings.logo === "bigClock",
                                (v) => (settings.logo = v ? "bigClock" : "clock")
                            }
                            onchange={emphasize}
                            name={t("big_clock")}
                            desc={t("big_clock_desc")}
                        />
                    </div>
                {/if}
            </div>
        {/if}
        <Row name={t("position")} desc={t("where_the_search_and")}>
            <Segmented
                small
                options={[
                    { value: "left", label: t("left") },
                    { value: "center", label: t("center") },
                    { value: "right", label: t("right") },
                ]}
                bind:value={settings.align}
                label={t("position")}
                onchange={emphasize}
            />
        </Row>
        <Toggle bind:checked={settings.quiet} onchange={emphasize} name={t("focus_mode")} desc={t("only_the_logo_and")} />
        {#if advanced}
            <div class="more" transition:grow>
                <Toggle bind:checked={settings.idleFade} name={t("fade_when_idle")} desc={t("shortcuts_and_the_top_bar")} />
            </div>
        {/if}
        {#if !WEB}
        <PermToggle
            bind:checked={settings.browserTheme}
            request={() => grant("policy")}
            keep
            onchange={emphasize}
            name={t("browser_colors")}
            desc={themeSource === "no-access"
                ? t("allow_access_to_file")
                : themeSource === "own" || themeSource === "no-policy"
                  ? t("no_theme_policy_found")
                  : t("follow_the_browser_theme")}
        />
        {#if settings.browserTheme && themeSource && themeSource !== "policy"}
            <div class="more" transition:grow>
                <Row name={t("theme_color")}>
                    <Swatches
                        bind:value={settings.themeColor}
                        presets={themePresets}
                        label={t("theme_color")}
                        onchange={emphasize}
                    />
                </Row>
            </div>
        {/if}
        {/if}
    </List>
</Section>

<Section title={t("effects")}>
    <List>
        <Slider
            label={t("effects")}
            options={[
                { value: "performance", label: t("fx_performance"), desc: t("fx_performance_desc") },
                { value: "balanced", label: t("fx_balanced"), desc: t("fx_balanced_desc") },
                { value: "beauty", label: t("fx_beauty"), desc: t("fx_beauty_desc") },
            ]}
            bind:value={settings.effects}
            onchange={() => {
                // set by hand: never switched to Speed on our own again (App.svelte, perf.ts)
                settings.effectsChosen = true;
                settings.effectsAuto = false;
            }}
        />
        <!-- motion only: Speed has none, so the intro is offered with the other modes -->
        {#if advanced && settings.effects !== "performance"}
            <div class="more" transition:grow>
                <Toggle bind:checked={settings.intro} name={t("intro_animation")} desc={t("wallpaper_entrance_when_a")} />
            </div>
        {/if}
    </List>
</Section>
