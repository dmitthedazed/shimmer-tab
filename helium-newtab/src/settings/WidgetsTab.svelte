<script lang="ts">
    import { Input, Toggle } from "@imput/helium-prism";
    import { t } from "../i18n";
    import type { Settings } from "../storage.svelte";
    import Row from "../Row.svelte";
    import Segmented from "../Segmented.svelte";
    import Section from "./Section.svelte";
    import List from "./List.svelte";

    let { settings = $bindable(), emphasize }: { settings: Settings; emphasize: () => void } = $props();
</script>

<Section title={t("clock")}>
    <List>
        <Toggle bind:checked={settings.clock} onchange={emphasize} name={t("date_and_time")} desc={t("at_the_top_of")} />
        {#if settings.clock}
            <Row name={t("format")}>
                <Segmented
                    small
                    options={[
                        { value: "24", label: t("24h") },
                        { value: "12", label: t("12h") },
                    ]}
                    value={settings.hour12 ? "12" : "24"}
                    label={t("clock_format")}
                    onchange={(v) => {
                        settings.hour12 = v === "12";
                        emphasize();
                    }}
                />
            </Row>
            <Toggle bind:checked={settings.seconds} onchange={emphasize} name={t("seconds")} />
        {/if}
    </List>
</Section>

<Section title={t("weather")}>
    <List>
        <Toggle bind:checked={settings.weather} onchange={emphasize} name={t("weather")} desc={t("next_to_the_clock")} />
        {#if settings.weather}
            <Row name={t("city")}>
                <Input
                    small
                    width="150px"
                    bind:value={settings.city}
                    aria-label={t("city")}
                    placeholder={t("berlin")}
                    spellcheck="false"
                />
            </Row>
            <Row name={t("units")}>
                <Segmented
                    small
                    options={[
                        { value: "c", label: t("c") },
                        { value: "f", label: t("f") },
                    ]}
                    value={settings.fahrenheit ? "f" : "c"}
                    label={t("temperature_unit")}
                    onchange={(v) => {
                        settings.fahrenheit = v === "f";
                        emphasize();
                    }}
                />
            </Row>
        {/if}
    </List>
</Section>
