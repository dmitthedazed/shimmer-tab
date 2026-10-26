<script lang="ts">
    import { t } from "./i18n";
    import { untrack } from "svelte";
    import { cubicOut } from "svelte/easing";
    import { IconCheck, Input, Link, Text, Toggle } from "@imput/helium-prism";
    import { version } from "../package.json";
    import Row from "./Row.svelte";
    import { wallpaper, loadWallpaper, setWallpaper } from "./wallpaper.svelte";
    import Segmented from "./Segmented.svelte";
    import Swatches from "./Swatches.svelte";

    // a few of Chromium's own theme seeds, for browsers without the policy
    const themePresets = ["#3450d1", "#1a73e8", "#0b8043", "#c5221f", "#e8710a", "#9334e6"].map((c) => ({
        value: c,
        label: c,
        color: c,
    }));
    import Stars from "./Stars.svelte";
    import { pop } from "./motion";
    import { grant, perms, revoke, WEB } from "./permissions.svelte";
    import { defaults, normalize, parseShortcuts, type Settings } from "./storage.svelte";
    import { Button } from "@imput/helium-prism";

    type Props = {
        settings: Settings;
        themeSource: "policy" | "own" | "no-access" | "no-policy" | null;
        emphasize: () => void;
        glass?: boolean;
        onclose: () => void;
        onaddshortcuts: () => void;
    };

    let {
        settings = $bindable(),
        themeSource,
        emphasize,
        glass = false,
        onclose,
        onaddshortcuts,
    }: Props = $props();

    type Tab = "look" | "shortcuts" | "widgets" | "search" | "data";
    const tabs: { value: Tab; label: string }[] = [
        { value: "look", label: t("look") },
        { value: "shortcuts", label: t("shortcuts") },
        { value: "widgets", label: t("widgets") },
        { value: "search", label: t("search") },
        { value: "data", label: t("data") },
    ];

    // backup: everything lives in `settings` (shortcuts included), so that's the file
    const FORMAT = "shimmer-tab";
    const OLD_FORMATS = ["helium-prism-newtab"];
    let importInput: HTMLInputElement | undefined = $state();
    let dataNote = $state("");
    let confirmReset = $state(false);

    function exportSettings() {
        const data = { format: FORMAT, version: 1, exported: new Date().toISOString(), settings: $state.snapshot(settings) };
        const url = URL.createObjectURL(new Blob([JSON.stringify(data, null, 2)], { type: "application/json" }));
        const a = document.createElement("a");
        a.href = url;
        a.download = `shimmer-tab-${new Date().toISOString().slice(0, 10)}.json`;
        a.click();
        setTimeout(() => URL.revokeObjectURL(url), 1000);
        dataNote = t("saved_to_your_downloads");
        emphasize();
    }

    async function importSettings(file: File | undefined) {
        if (!file) return;
        try {
            const data = JSON.parse(await file.text());
            const added = Array.isArray(data) || Array.isArray(data?.shortcuts) ? parseShortcuts(JSON.stringify(data)) : [];
            if (added.length) {
                settings.links = [...settings.links, ...added];
                dataNote = `Added ${added.length} shortcuts.`;
                emphasize();
                return;
            }
            const raw = data?.format === FORMAT || OLD_FORMATS.includes(data?.format) ? data.settings : data;
            if (!raw || typeof raw !== "object" || Array.isArray(raw)) throw new Error();
            Object.assign(settings, normalize(raw));
            dataNote = `Imported ${settings.links.length} shortcuts and your settings.`;
            emphasize();
        } catch {
            dataNote = t("that_file_isn_t");
        } finally {
            if (importInput) importInput.value = "";
        }
    }

    function resetSettings() {
        if (!confirmReset) {
            confirmReset = true;
            setTimeout(() => (confirmReset = false), 4000);
            return;
        }
        Object.assign(settings, structuredClone(defaults));
        confirmReset = false;
        dataNote = t("back_to_defaults");
        emphasize();
    }

    let tab: Tab = $state(
        (() => {
            try {
                const fromHash = location.hash.match(/^#settings-(\w+)/)?.[1] as Tab | undefined;
                if (fromHash && tabs.some((t) => t.value === fromHash)) return fromHash;
                return (localStorage.getItem("settings-tab") as Tab) || "look";
            } catch {
                return "look";
            }
        })(),
    );

    $effect(() => {
        try {
            localStorage.setItem("settings-tab", tab);
        } catch {}
    });

    const backgrounds: { value: Settings["background"]; label: string }[] = [
        { value: "shimmer", label: t("shimmer") },
        { value: "stars", label: t("stars") },
        { value: "weather", label: t("weather") },
        { value: "image", label: t("image") },
        { value: "random", label: t("random") },
        { value: "none", label: t("none") },
    ];

    // custom picture: choosing the tile without one opens the file picker first
    loadWallpaper();
    let pictureInput: HTMLInputElement | undefined = $state();
    let pictureNote = $state("");
    const blurs = [
        { value: "0", label: t("off") },
        { value: "8", label: t("soft") },
        { value: "20", label: t("medium") },
        { value: "40", label: t("strong") },
    ];

    async function pickPicture(file: File | undefined) {
        if (file) {
            pictureNote = (await setWallpaper(file)) ?? "";
            if (!pictureNote) {
                settings.background = "image";
                emphasize();
            }
        }
        if (pictureInput) pictureInput.value = "";
    }

    // previews render the real background at window size and scale it down
    let winW = $state(window.innerWidth);
    let winH = $state(window.innerHeight);
    let tileW = $state(0);
    const previewScale = $derived(tileW / winW || 0.1);

    let panel: HTMLElement | undefined = $state();

    // mirrors the optional permission; a declined prompt flips the toggle back
    let sitesAccess = $state(perms.sites);
    $effect(() => {
        sitesAccess = perms.sites;
    });

    // tab switch morph: the body animates to the new content height while the new
    // pane slides in from the side of the tab you moved to
    let contentH = $state(0);
    let morph = $state(false);
    $effect(() => {
        // only animate after the first layout, not on open
        if (contentH && !untrack(() => morph)) requestAnimationFrame(() => (morph = true));
    });

    // Prism-style swap (like its CopyIcon/Tooltip): the old pane shrinks and fades out
    // while the new one grows in, 0.2s ease, while the body eases to the new height
    function swapIn(_node: Element) {
        if (!morph) return { duration: 0 };
        return {
            duration: 200,
            easing: cubicOut,
            css: (e: number) => {
                return `opacity: ${e}; transform: scale(${0.96 + 0.04 * e});`;
            },
        };
    }

    function swapOut(_node: Element) {
        if (!morph) return { duration: 0 };
        return {
            duration: 150,
            easing: cubicOut,
            css: (e: number) => {
                // out of the flow so the new pane takes its place right away
                return `position: absolute; inset: var(--gap-1) var(--gap-4) auto; opacity: ${e}; transform: scale(${0.96 + 0.04 * e});`;
            },
        };
    }


    function onPointerDown(e: PointerEvent) {
        const target = e.target as Element | null;
        if (panel && target && !panel.contains(target) && !target.closest(".corner")) onclose();
    }
</script>

<svelte:window
    bind:innerWidth={winW}
    bind:innerHeight={winH}
    onkeydown={(e) => e.key === "Escape" && onclose()}
    onpointerdown={onPointerDown}
/>

<aside
    bind:this={panel}
    class={["panel", glass && "glass"]}
    aria-label={t("settings")}
    transition:pop|global
>
    <header>
        <Text variant="subheading">{t("settings")}</Text>
        <Segmented options={tabs} bind:value={tab} label={t("settings_section")} />
    </header>

    <div class="body" style:height={contentH ? `${contentH}px` : undefined} class:morph>
        <div class="content" bind:clientHeight={contentH}>
        {#key tab}
        <div class="pane" in:swapIn out:swapOut>
        {#if tab === "look"}
            <section>
                <h5>{t("background")}</h5>
                <div class="backgrounds" role="radiogroup" aria-label={t("background")}>
                    {#each backgrounds as option, i (option.value)}
                        <button
                            type="button"
                            role="radio"
                            aria-checked={settings.background === option.value}
                            class={["bg-option", settings.background === option.value && "active"]}
                            onclick={() => {
                                if (option.value === "image" && !wallpaper.url) return pictureInput?.click();
                                settings.background = option.value;
                                emphasize();
                            }}
                        >
                            <span class="bg-preview" style:aspect-ratio="{winW} / {winH}">
                                {#if i === 0}
                                    <span class="measure" bind:clientWidth={tileW}></span>
                                {/if}
                                <span
                                    class="viewport"
                                    style:width="{winW}px"
                                    style:height="{winH}px"
                                    style:transform="scale({previewScale})"
                                >
                                    {#if option.value === "shimmer" || option.value === "random"}
                                        <span class="still shimmer"></span>
                                    {/if}
                                    {#if option.value === "weather"}
                                        <span class="still weather"></span>
                                    {/if}
                                    {#if option.value === "image"}
                                        <span
                                            class="still picture"
                                            style:background-image={wallpaper.url ? `url(${wallpaper.url})` : null}
                                        ></span>
                                    {/if}
                                    {#if option.value === "stars" || option.value === "random"}
                                        <span class={["layer", option.value === "random" && "split"]}>
                                            <Stars preview starSize={0.8 / previewScale} />
                                        </span>
                                    {/if}
                                </span>
                                {#if settings.background === option.value}
                                    <span class="check" aria-hidden="true"><IconCheck /></span>
                                {/if}
                                {#if option.value === "random"}
                                    <svg class="dice" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 5a2 2 0 0 1 2 -2h14a2 2 0 0 1 2 2v14a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2z" /><path d="M8.5 8.5m-.5 0a.5 .5 0 1 0 1 0a.5 .5 0 1 0 -1 0" fill="currentColor" /><path d="M15.5 8.5m-.5 0a.5 .5 0 1 0 1 0a.5 .5 0 1 0 -1 0" fill="currentColor" /><path d="M15.5 15.5m-.5 0a.5 .5 0 1 0 1 0a.5 .5 0 1 0 -1 0" fill="currentColor" /><path d="M8.5 15.5m-.5 0a.5 .5 0 1 0 1 0a.5 .5 0 1 0 -1 0" fill="currentColor" /></svg>
                                {/if}
                            </span>
                            <span class="bg-label">{option.label}</span>
                        </button>
                    {/each}
                </div>
                <input
                    bind:this={pictureInput}
                    class="file"
                    type="file"
                    accept="image/*"
                    onchange={(e) => pickPicture(e.currentTarget.files?.[0])}
                />
                {#if settings.background === "image"}
                    <div class="list" transition:pop={{ from: 0.96, duration: 150 }}>
                        <Row name={t("picture")} desc={t("photo_or_gif_stays")}>
                            <Button onclick={() => pictureInput?.click()}>{t("replace")}</Button>
                        </Row>
                        <Row name={t("blur")} desc={t("softens_the_picture")}>
                            <Segmented
                                small
                                label={t("blur")}
                                options={blurs}
                                value={String(settings.imageBlur)}
                                onchange={(v) => {
                                    settings.imageBlur = Number(v);
                                    emphasize();
                                }}
                            />
                        </Row>
                    </div>
                {/if}
                {#if pictureNote}
                    <p class="note">{pictureNote}</p>
                {/if}
                {#if settings.background === "weather" && !settings.city.trim()}
                    <p class="note" transition:pop={{ from: 0.96, duration: 150 }}>
                        {t("clear_skies_until_you")}
                    </p>
                {/if}
            </section>

            <section>
                <h5>{t("appearance")}</h5>
                <div class="list">
                    <Toggle bind:checked={settings.logoShown} onchange={emphasize} name={t("show_logo")} desc={t("show_logo_desc")} />
                    {#if settings.logoShown}
                    <Row name={t("logo_text")} desc={t("next_to_the_mark")}>
                        <Segmented
                            small
                            options={[
                                { value: "greeting", label: t("greeting") },
                                { value: "wordmark", label: "Helium" },
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
                        <Toggle
                            bind:checked={
                                () => settings.logo === "bigClock",
                                (v) => (settings.logo = v ? "bigClock" : "clock")
                            }
                            onchange={emphasize}
                            name={t("big_clock")}
                            desc={t("big_clock_desc")}
                        />
                    {/if}
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
                    <Toggle bind:checked={settings.idleFade} name={t("fade_when_idle")} desc={t("shortcuts_and_the_top_bar")} />
                    <Toggle bind:checked={settings.intro} name={t("intro_animation")} desc={t("wallpaper_entrance_when_a")} />
                    {#if !WEB}
                    <Toggle
                        bind:checked={settings.browserTheme}
                        onchange={(on) => {
                            emphasize();
                            if (on) grant("policy").then((ok) => ok || (settings.browserTheme = false));
                        }}
                        name={t("browser_colors")}
                        desc={themeSource === "no-access"
                            ? t("allow_access_to_file")
                            : themeSource === "own" || themeSource === "no-policy"
                              ? t("no_theme_policy_found")
                              : t("follow_the_browser_theme")}
                    />
                    {#if settings.browserTheme && themeSource && themeSource !== "policy"}
                        <Row name={t("theme_color")}>
                            <Swatches
                                bind:value={settings.themeColor}
                                presets={themePresets}
                                label={t("theme_color")}
                                onchange={emphasize}
                            />
                        </Row>
                    {/if}
                    {/if}
                </div>
            </section>
        {:else if tab === "shortcuts"}
            <section>
                <h5>{t("shortcuts")}</h5>
                <div class="list">
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
                        {#if !WEB}
                        <Toggle
                            bind:checked={sitesAccess}
                            onchange={(on) => {
                                emphasize();
                                if (on) grant("sites").then((ok) => ok || (sitesAccess = false));
                                else revoke("sites");
                            }}
                            name={t("icons_for_every_site")}
                            desc={t("read_sites_own_hq")}
                        />
                        {/if}
                    {/if}
                </div>
            </section>

            {#if !WEB}
            <section>
                <h5>{t("history")}</h5>
                <div class="list">
                    <Toggle
                        bind:checked={settings.topSites}
                        onchange={(on) => {
                            emphasize();
                            if (on) grant("topSites").then((ok) => ok || (settings.topSites = false));
                        }}
                        name={t("most_visited")}
                        desc={t("top_sites_below_your")}
                    />
                </div>
            </section>
            {/if}
        {:else if tab === "widgets"}
            <section>
                <h5>{t("clock")}</h5>
                <div class="list">
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
                </div>
            </section>

            <section>
                <h5>{t("weather")}</h5>
                <div class="list">
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
                </div>
            </section>
        {:else if tab === "data"}
            <section>
                <h5>{t("backup")}</h5>
                <div class="list">
                    <Row name={t("export")} desc={t("settings_and_shortcuts_as")}>
                        <Button onclick={exportSettings}>{t("save")}</Button>
                    </Row>
                    <Row name={t("add_shortcuts")} desc={t("paste_or_open_a")}>
                        <Button
                            onclick={() => {
                                onclose();
                                onaddshortcuts();
                            }}>{t("add")}</Button
                        >
                    </Row>
                    <Row name={t("import")} desc={t("restore_from_a_saved")}>
                        <Button onclick={() => importInput?.click()}>{t("open")}</Button>
                    </Row>
                </div>
                <input
                    bind:this={importInput}
                    class="file"
                    type="file"
                    accept="application/json,.json"
                    onchange={(e) => importSettings(e.currentTarget.files?.[0])}
                />
                {#if dataNote}
                    {#key dataNote}
                        <p class="note" in:pop={{ from: 0.96, duration: 150 }}>{dataNote}</p>
                    {/key}
                {/if}
            </section>

            <section>
                <h5>{t("reset")}</h5>
                <div class="list">
                    <Row name={t("defaults")} desc={t("your_shortcuts_are_reset")}>
                        <Button onclick={resetSettings} class={[confirmReset && "danger"]}>
                            {confirmReset ? t("sure") : t("reset")}
                        </Button>
                    </Row>
                </div>
            </section>

            <section>
                <h5>{t("about")}</h5>
                <div class="list">
                    <Row name="Shimmer Tab" desc={t("version", { version })}>
                        <Link href="https://github.com/dmitthedazed/shimmer-tab">GitHub</Link>
                    </Row>
                    <Row name={t("made_by")} desc="Dmytrii Savin">
                        <Link href="https://github.com/dmitthedazed">@dmitthedazed</Link>
                    </Row>
                </div>
            </section>
        {:else}
            <section>
                <h5>{t("search")}</h5>
                <div class="list">
                    <Toggle bind:checked={settings.searchShown} onchange={emphasize} name={t("show_search_bar")} desc={t("show_search_bar_desc")} />
                    <Toggle bind:checked={settings.bangs} onchange={emphasize} name={t("bangs")} desc={t("yt_cats_w_helium")} />
                </div>
                <p class="note">{t("everything_else_goes_to")}</p>
            </section>
        {/if}
        </div>
        {/key}
        </div>
    </div>
</aside>

<style>
    .panel {
        position: fixed;
        right: 16px;
        bottom: 68px;
        z-index: 4;
        display: flex;
        flex-direction: column;
        width: min(calc(100vw - 32px), 400px);
        max-height: calc(100vh - 88px);
        overflow: hidden;
        border-radius: var(--card-border-radius);
        /* like Prism's tooltip: the corner pointing at the button is the sharp one */
        border-bottom-right-radius: 6px;
        background: var(--background);
        outline: 1.5px solid var(--helium-elevated-10);
        outline-offset: -1.5px;
        box-shadow: 4px 4px 24px 0 var(--tooltip-shadow);
        transform-origin: bottom right;
    }

    /* the glass goes on the panel itself; per-child backdrop filters escape rounded clips */
    .panel.glass {
        background: color-mix(in srgb, var(--background) 80%, transparent);
        backdrop-filter: var(--glass-filter) blur(12px);
    }

    header {
        display: flex;
        flex-direction: column;
        gap: var(--gap-3);
        padding: var(--gap-4) var(--gap-4) var(--gap-3);
    }

    header :global(h4) {
        margin: 0;
        font-size: 18px;
        font-weight: 600;
    }

    .body {
        flex: 0 1 auto;
        min-height: 0;
        overflow-x: hidden;
        overflow-y: auto;
    }

    .body.morph {
        transition: height 0.2s ease;
    }

    .content {
        position: relative;
        padding: var(--gap-1) var(--gap-4) var(--gap-4);
    }

    .pane {
        transform-origin: top center;
        display: flex;
        flex-direction: column;
        gap: var(--gap-4);
    }

    section {
        display: flex;
        flex-direction: column;
        gap: var(--gap-2);
    }

    h5 {
        margin: 0;
        padding: 0 var(--gap-1);
        color: var(--tertiary);
        font-size: 13px;
        font-weight: 500;
    }

    .file {
        display: none;
    }

    .list :global(.danger) {
        color: #fff;
        background-color: #e5484d !important;
    }

    .note {
        margin: 0;
        padding: 0 var(--gap-1);
        color: var(--tertiary);
        font-size: 13px;
    }

    /* grouped Prism cards: 2px apart, big radius only on the outer corners */
    .list {
        display: flex;
        flex-direction: column;
        gap: 2px;
    }

    .list > :global(*) {
        border-radius: 5px;
        background-color: var(--helium-elevated-7);
    }

    .list > :global(:first-child) {
        border-top-left-radius: 14px;
        border-top-right-radius: 14px;
    }

    .list > :global(:last-child) {
        border-bottom-left-radius: 14px;
        border-bottom-right-radius: 14px;
    }

    .list :global(.toggle-button) {
        min-height: 54px;
        padding: 10px 14px 10px 16px;
    }

    .list :global(.toggle-button:active) {
        transform: none;
        background-color: var(--helium-elevated-15);
    }

    .list :global(h4) {
        font-size: 15px;
    }

    .list :global(p) {
        font-size: 13px;
    }

    .list > :global(.row) {
        --row-height: 54px;
        --row-padding: 10px 10px 10px 16px;
    }

    /* background picker */
    .backgrounds {
        display: grid;
        grid-template-columns: repeat(6, 1fr);
        gap: var(--gap-1);
    }

    .bg-option {
        display: flex;
        flex-direction: column;
        align-items: stretch;
        gap: 6px;
        width: 100%;
        min-width: 0;
        /* Prism pads buttons that contain an svg */
        padding: 0 !important;
        border: none;
        background: none;
        color: var(--tertiary);
        font: inherit;
        font-size: 12px;
        cursor: pointer;
    }

    .bg-preview {
        position: relative;
        display: block;
        width: 100%;
        max-height: 56px;
        overflow: hidden;
        border-radius: 10px;
        background: var(--background);
        outline: 1px solid var(--helium-elevated-15);
        outline-offset: -1px;
        transition: outline-color 0.15s, transform 0.15s, box-shadow 0.15s;
    }

    .bg-option:hover .bg-preview {
        outline-color: var(--helium-elevated-40);
    }

    .bg-option:active .bg-preview {
        transform: scale(0.96);
    }

    .bg-option.active {
        color: var(--primary);
    }

    .bg-option.active .bg-preview {
        outline: 2px solid var(--helium-elevated);
        outline-offset: -2px;
        box-shadow: 0 0 0 3px var(--helium-elevated-15);
    }

    .bg-option:focus-visible {
        outline: none;
    }

    .bg-option:focus-visible .bg-preview {
        box-shadow: 0 0 0 3px var(--helium-elevated-40);
    }

    .bg-label {
        text-align: center;
    }

    .measure {
        position: absolute;
        inset: 0;
    }

    .viewport {
        position: absolute;
        top: 0;
        left: 0;
        transform-origin: 0 0;
        pointer-events: none;
    }

    .layer {
        position: absolute;
        inset: 0;
    }

    /* the tiles are stills, so the panel doesn't run a live WebGL view per wallpaper */
    .still {
        position: absolute;
        inset: 0;
    }

    .shimmer {
        background:
            repeating-linear-gradient(90deg, rgb(255 255 255 / 0.06) 0 7%, transparent 7% 14%),
            linear-gradient(var(--bg-gradient-start), var(--bg-gradient-end));
    }

    .picture {
        background-color: var(--helium-elevated-10);
        background-position: center;
        background-size: cover;
    }

    .weather {
        background:
            radial-gradient(ellipse 38% 26% at 24% 34%, rgb(210 225 255 / 0.32), transparent),
            radial-gradient(ellipse 46% 24% at 70% 52%, rgb(210 225 255 / 0.24), transparent),
            radial-gradient(ellipse 34% 20% at 40% 78%, rgb(210 225 255 / 0.18), transparent),
            linear-gradient(hsl(226 44% 30%), hsl(220 48% 46%));
    }

    .layer.split {
        clip-path: polygon(60% 0, 100% 0, 100% 100%, 40% 100%);
    }

    .dice {
        position: absolute;
        top: 50%;
        left: 50%;
        width: 18px;
        height: 18px;
        transform: translate(-50%, -50%);
        color: #fff;
        filter: drop-shadow(0 1px 3px rgb(0 0 0 / 0.4));
    }

    .check {
        position: absolute;
        right: 4px;
        bottom: 4px;
        z-index: 1;
        display: grid;
        place-items: center;
        width: 16px;
        height: 16px;
        border-radius: 50%;
        background: var(--helium-elevated);
        color: var(--background);
    }

    .check :global(svg) {
        width: 11px;
        height: 11px;
        stroke-width: 3;
    }
</style>
