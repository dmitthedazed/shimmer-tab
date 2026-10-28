<script lang="ts">
    import { Input, Toggle } from "@imput/helium-prism";
    import { t } from "../i18n";
    import { grow } from "../motion";
    import type { Settings } from "../storage.svelte";
    import type { WeatherProblem } from "../weather";
    import { pop } from "../motion";
    import Row from "../Row.svelte";
    import Segmented from "../Segmented.svelte";
    import List from "./List.svelte";

    type Props = { settings: Settings; emphasize: () => void; advanced: boolean; weatherIssue?: WeatherProblem };
    let { settings = $bindable(), emphasize, advanced, weatherIssue = null }: Props = $props();
</script>

<!-- the tab name says what these are: one list, no section headings -->
<List>
    <Toggle bind:checked={settings.clock} onchange={emphasize} name={t("date_and_time")} />
    {#if settings.clock && advanced}
        <div class="more" transition:grow>
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
        </div>
    {/if}
    <Toggle bind:checked={settings.weather} onchange={emphasize} name={t("weather")} desc={t("next_to_the_clock")} />
    {#if settings.weather}
        <div class="more" transition:grow>
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
            {#if advanced}
                <div class="more" transition:grow>
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
                </div>
            {/if}
        </div>
    {/if}
</List>
{#if settings.weather && settings.city.trim() && weatherIssue}
    <p class="s-note" transition:pop={{ from: 0.96, duration: 150 }}>
        {t(weatherIssue === "city" ? "weather_city_not_found" : "weather_offline")}
    </p>
{/if}
