<script lang="ts">
    import { t } from "./i18n";
    import { onMount } from "svelte";
    import { drop, morphPage, pop, recede, reveal } from "./motion";
    import { forceScheme, type Forced } from "./scheme.svelte";
    import { perms } from "./permissions.svelte";
    import {
        Button,
        GradientShimmer,
        HeliumLogo,
        Input,
        IconSearch,
        Tooltip,
        IconBang,
    } from "@imput/helium-prism";
    import { searchUrl, suggestEndpoint, suggestions } from "./engines";
    import { hasBang, resolveBang, resolveBangAsync, suggestBangs } from "./bangs.svelte";
    import { answer } from "./calc";
    import { openInternal } from "./open";
    import ChromeLogo, { brand } from "./ChromeLogo.svelte";
    import Stars from "./Stars.svelte";
    import WeatherBg, { skyFor, type Sky } from "./WeatherBg.svelte";
    import ImageBg from "./ImageBg.svelte";
    import UpdateNotice from "./UpdateNotice.svelte";
    import { checkLatest, dismiss, updatedNotice, type Notice } from "./updates";
    import { lookAt } from "./wallpaper.svelte";
    import Shortcuts from "./Shortcuts.svelte";
    import SiteIcon from "./SiteIcon.svelte";
    import WeatherIcon from "./WeatherIcon.svelte";
    import { describe, getWeather, peekWeather, type Weather } from "./weather";
    import { holdGreeting } from "./greetings";
    import {
        loadCached,
        load,
        normalizeUrl,
        save,
        type Settings as SettingsData,
        type Shortcut,
    } from "./storage.svelte";
    import {
        applyBrowserTheme,
        hasFileAccess,
        clearBrowserTheme,
        onSchemeChange,
        refreshBrowserTheme,
    } from "./theme";

    let settings: SettingsData = $state(loadCached());

    // decided before the first paint, and kept for an hour so new tabs don't reroll it
    const greeting = (() => {
        let raw: string | null = null;
        let saved = null;
        try {
            raw = localStorage.getItem("greeting");
            saved = JSON.parse(raw ?? "null");
        } catch {}
        const g = holdGreeting(new Date(), saved);
        const next = JSON.stringify(g.held);
        try {
            if (next !== raw) localStorage.setItem("greeting", next);
        } catch {}
        return g.text;
    })();
    let addingShortcuts = $state(false);
    let ready = $state(false);
    let query = $state("");
    let now = $state(new Date());
    // #settings or #settings-<tab> opens the panel (handy for screenshots)
    let settingsOpen = $state(location.hash.startsWith("#settings"));
    let shimmer: { emphasize: () => void } | undefined = $state();

    const emphasize = () => shimmer?.emphasize();

    // panels load on first use, not with every new tab; hovering the corner fetches ahead
    let settingsView: Promise<typeof import("./Settings.svelte")> | undefined;
    let addView: Promise<typeof import("./AddShortcuts.svelte")> | undefined;
    const loadSettings = () => (settingsView ??= import("./Settings.svelte"));
    const loadAdd = () => (addView ??= import("./AddShortcuts.svelte"));


    // picked once per tab
    const randomPick = Math.random() < 0.5 ? "shimmer" : "stars";
    const bg = $derived(settings.background === "random" ? randomPick : settings.background);

    const tint = $derived(
        !settings.iconTint
            ? null
            : settings.tintColor === "accent"
              ? "var(--helium-elevated)"
              : settings.tintColor === "text"
                ? "var(--primary)"
                : settings.tintColor,
    );

    // The starfield forces Prism's dark colors, a picture whichever scheme reads best on it
    // (wallpaper.svelte.ts). On load that happens right away; when switching, every color
    // eases over in step with the background reveal.
    const look = $derived(bg === "image" ? lookAt(settings.imageBlur) : null);
    const mode: Forced = $derived(
        look ? (look.light ? "light" : "dark") : bg === "stars" || bg === "weather" ? "dark" : null,
    );
    const root = document.documentElement;
    const picture = (on: typeof look) => {
        root.toggleAttribute("data-picture", !!on);
        root.style.setProperty("--halo", String(on?.halo ?? 0));
    };
    forceScheme(mode);
    picture(look);
    if (settings.browserTheme) refreshBrowserTheme();
    let darkBg = bg;
    $effect(() => {
        const switching = bg !== darkBg;
        darkBg = bg;
        const [next, nextLook] = [mode, look];
        const apply = () => {
            // a new picture may flip the scheme: ease that too
            forceScheme(next, switching ? 1100 : 600);
            picture(nextLook);
            if (settings.browserTheme && refreshBrowserTheme()) themeVersion++;
        };
        // a frame later, so the outgoing wallpaper has captured its own colors first
        if (switching) requestAnimationFrame(apply);
        else apply();
    });

    // after an update, a link to what changed; with the check on, a newer release too
    let notice: Notice | null = $state(updatedNotice());
    $effect(() => {
        if (!ready || !settings.updateCheck || notice) return;
        checkLatest().then((found) => found && (notice = found));
    });

    // which wallpaper is on screen, for picking the transition into the next one
    let shownBg: string = bg;
    function enter(node: Element) {
        const from = shownBg;
        shownBg = bg;
        // stars → shimmer: stripes punch down from the top; everything else flows
        return from === "stars" && bg === "shimmer" ? drop(node) : reveal(node);
    }

    // the column hugs one edge of the page instead of the center
    const side = $derived(
        settings.align === "left" ? "flex-start" : settings.align === "right" ? "flex-end" : undefined,
    );

    // A new side glides everything over instead of jumping: each piece is measured before
    // the change and played back from where it was (FLIP). Only leaves move, so nothing
    // gets its parent's shift twice.
    const movers = () =>
        document.querySelectorAll<HTMLElement>(
            ".shell > :not(.below), .below .divider, .shortcuts > *, .datetime > *",
        );
    let before = new Map<HTMLElement, DOMRect>();
    $effect.pre(() => {
        settings.align;
        before = new Map([...movers()].map((el) => [el, el.getBoundingClientRect()]));
    });
    $effect(() => {
        settings.align;
        if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
        for (const [el, was] of before) {
            const now = el.getBoundingClientRect();
            const dx = was.left - now.left;
            const dy = was.top - now.top;
            if (!el.isConnected || (Math.abs(dx) < 1 && Math.abs(dy) < 1)) continue;
            el.animate([{ transform: `translate(${dx}px, ${dy}px)` }, { transform: "none" }], {
                duration: 450,
                easing: "cubic-bezier(0.3, 1, 0.5, 1)",
                composite: "add",
            });
        }
    });

    // #sky-rain or #sky-snow-13 shows that sky (at that hour) right away: for trying
    // the weather wallpaper out and for the showcase clips
    const readSkyHash = () => {
        const m = location.hash.match(/^#sky-([a-z]+)(?:-(\d+))?$/);
        return m ? { sky: m[1] as Sky, hour: m[2] ? Number(m[2]) : undefined } : null;
    };
    let skyPreview = $state(readSkyHash());
    onMount(() => {
        const onHash = () => (skyPreview = readSkyHash());
        addEventListener("hashchange", onHash);
        return () => removeEventListener("hashchange", onHash);
    });

    // the page UI rises in after the star entrance (see Stars.svelte)
    const starsEntrance =
        bg === "stars" && settings.intro && !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let starsArrived = $state(!starsEntrance);
    if (starsEntrance) setTimeout(() => (starsArrived = true), 1000); // never stay hidden

    // the shimmer's intro reveal is for page load only, not for switching to it
    // (derived, so the new wallpaper already reads it as it mounts: an effect would set it a
    // frame too late and the shimmer would play its intro under the transition, a blink)
    let firstBg: string | null = $state(null);
    let switchedOnce = $state(false);
    const bgSwitched = $derived(switchedOnce || (firstBg !== null && bg !== firstBg));
    $effect(() => {
        if (!ready) return;
        firstBg ??= bg;
        if (bgSwitched) switchedOnce = true;
    });


    // bumped to remount the shimmer, which only reads its colors on mount
    let themeVersion = $state(0);
    // where browser colors come from: the policy, the color picked in settings, or nowhere yet
    let themeSource: "policy" | "own" | "no-access" | "no-policy" | null = $state(null);

    let themeToggled = false;

    async function syncTheme() {
        if (!settings.browserTheme) return;
        const result = await applyBrowserTheme(settings.themeColor);
        themeSource = result
            ? result.fromPolicy
                ? "policy"
                : "own"
            : (await hasFileAccess())
              ? "no-policy"
              : "no-access";
        if (result?.changed) themeVersion++;
    }

    onMount(() => {
        load().then((s) => {
            settings = s;
            ready = true;
        });
        const onVisible = () => {
            if (document.visibilityState !== "visible") return;
            now = new Date();
            syncTheme();
        };
        document.addEventListener("visibilitychange", onVisible);
        const offScheme = onSchemeChange(syncTheme);
        return () => {
            offScheme();
            document.removeEventListener("visibilitychange", onVisible);
        };
    });

    $effect(() => {
        if (ready) save(settings);
    });

    // quiet when idle: after a while without input the shortcuts, top bar and corner buttons fade.
    // the search, settings and any open dialog keep it awake, since typing or tuning is still work
    const IDLE_MS = 6000;
    let idle = $state(false);
    let idleTimer: number | undefined;
    const busy = () =>
        !!query ||
        !!document.activeElement?.closest(".search") ||
        settingsOpen ||
        addingShortcuts ||
        document.visibilityState !== "visible";
    const wake = () => {
        idle = false;
        window.clearTimeout(idleTimer);
        idleTimer = window.setTimeout(sleep, IDLE_MS);
    };
    // if still busy, check again later instead of fading in the middle of typing
    const sleep = () => {
        if (busy()) idleTimer = window.setTimeout(sleep, IDLE_MS);
        else idle = true;
    };
    $effect(() => {
        if (!settings.idleFade) return;
        const events = ["pointermove", "pointerdown", "wheel", "keydown"] as const;
        for (const e of events) window.addEventListener(e, wake, { passive: true });
        document.addEventListener("visibilitychange", wake);
        wake();
        return () => {
            for (const e of events) window.removeEventListener(e, wake);
            document.removeEventListener("visibilitychange", wake);
            window.clearTimeout(idleTimer);
            idle = false;
        };
    });

    // the clock wakes up when its text changes: on the second, or only on the minute
    $effect(() => {
        const step = settings.seconds ? 1000 : 60000;
        let t: ReturnType<typeof setTimeout>;
        const tick = () => {
            now = new Date();
            t = setTimeout(tick, step - (Date.now() % step));
        };
        tick();
        return () => clearTimeout(t);
    });

    $effect(() => {
        if (!ready) return;
        const on = settings.browserTheme;
        const run = async () => {
            if (on) {
                await syncTheme();
            } else {
                themeSource = null;
                if (clearBrowserTheme()) themeVersion++;
            }
        };
        // toggling it morphs the whole page into the new palette; the first run doesn't
        if (themeToggled) morphPage(run);
        else run();
        themeToggled = true;
    });

    // a newly picked color applies right away
    let ownColor = settings.themeColor;
    $effect(() => {
        if (!ready || settings.themeColor === ownColor) return;
        ownColor = settings.themeColor;
        syncTheme();
    });

    const time = $derived(
        now.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
            second: settings.seconds ? "2-digit" : undefined,
            hour12: settings.hour12,
        }),
    );
    const date = $derived(
        now.toLocaleDateString([], { weekday: "short", day: "numeric", month: "long" }),
    );
    // tiles for the browser's own pages follow the logo
    $effect(() => {
        brand.chrome = settings.chromeLogo;
    });

    // the logo can be the clock; then the bar on top doesn't repeat what it shows
    const logoClock = $derived(settings.logoShown && (settings.logo === "clock" || settings.logo === "bigClock"));
    const barClock = $derived(settings.clock && !logoClock);
    // a clock logo takes the date and weather along, so the bar goes away
    const barWeather = $derived(logoClock ? null : weather);

    // Keyword mode like Helium's omnibox: a complete "!yt " leaves the text and
    // turns into the service chip; Backspace at the start or Esc leaves it.
    let keyword: string | null = $state(null);
    let searchInput: HTMLInputElement | undefined = $state();

    const bang = $derived(
        !settings.bangs ? null : keyword ? resolveBang(`!${keyword} ${query}`) : resolveBang(query),
    );

    $effect(() => {
        if (!settings.bangs || keyword) return;
        const m = query.match(/(?:^|\s)!(\S+)\s/);
        if (!m || !resolveBang(`!${m[1]}`)) return;
        keyword = m[1];
        query = (query.slice(0, m.index) + " " + query.slice(m.index! + m[0].length)).trimStart();
        queueMicrotask(() => searchInput?.setSelectionRange(query.length, query.length));
    });

    $effect(() => {
        if (!settings.bangs) keyword = null;
    });

    // a hidden search bar gives its room to the rest and opens up while you type
    let searchFocused = $state(false);
    const searchTucked = $derived(!settings.searchShown && !searchFocused && !query);

    // Number keys: 1–9 open the matching shortcut. Ctrl/Cmd opens it in a background tab.
    // Matches on the physical key (e.code) so Shift+digit still counts.
    function openByNumber(e: KeyboardEvent): boolean {
        const m = e.code.match(/^(?:Digit|Numpad)([1-9])$/);
        if (!m || e.altKey || e.isComposing || e.defaultPrevented) return false;
        if (!settings.shortcutKeys || !settings.shortcuts || settings.quiet) return false;
        // dialogs and the settings panel all sit under a scrim or are flagged here
        if (settingsOpen || addingShortcuts || document.querySelector(".scrim")) return false;
        const target = e.target as HTMLElement | null;
        if (target?.closest("input, textarea, select, [contenteditable]")) return false;
        const link = settings.links[Number(m[1]) - 1];
        if (!link?.url) return false;
        const newTab = e.ctrlKey || e.metaKey;
        if (openInternal(link.url, newTab)) return true;
        if (newTab) window.open(link.url, "_blank", "noopener");
        else location.href = link.url;
        return true;
    }

    // a bang always wins over an answer; Enter copies the answer instead of searching
    const result = $derived(settings.answers && !keyword && !hasBang(query) ? answer(query) : null);
    let copied = $state("");

    // Type-to-search: a printable key pressed anywhere outside a text field moves focus
    // into the search bar, and since focus moves during keydown the character lands there.
    function typeToSearch(e: KeyboardEvent) {
        if (e.defaultPrevented || e.ctrlKey || e.metaKey || e.altKey || e.isComposing) return;
        if (e.key.length !== 1 || !searchInput || document.activeElement === searchInput) return;
        const target = e.target as HTMLElement | null;
        if (target?.closest("input, textarea, select, [contenteditable]")) return;
        if (e.key === " " && target?.closest("button, a, [role=switch], [role=radio]")) return;
        searchInput.focus();
    }

    // Bang autocomplete: while a "!…" word is being typed at the end of the query,
    // list matching services; arrows move, Enter/Tab picks, Esc dismisses.
    let bangIndex = $state(0);
    let bangDismissed = $state("");
    const bangPrefix = $derived(
        settings.bangs && !keyword ? (query.match(/(?:^|\s)!(\S*)$/)?.[1] ?? null) : null,
    );
    const bangSuggestions = $derived(
        bangPrefix !== null && bangDismissed !== query ? suggestBangs(bangPrefix) : [],
    );
    $effect(() => {
        void bangPrefix;
        bangIndex = 0;
    });

    function pickBang(trigger: string) {
        query = query.replace(/!(\S*)$/, `!${trigger} `);
        searchInput?.focus();
    }

    // Engine suggestions: asked for only when switched on, a moment after typing stops
    let suggested: string[] = $state([]);
    let sugIndex = $state(-1);
    let sugDismissed = $state("");
    $effect(() => {
        const text = query.trim();
        const engine = settings.engine;
        suggested = [];
        sugIndex = -1;
        if (!settings.suggestions || !suggestEndpoint(engine) || !text || keyword || bangPrefix !== null) return;
        const ctl = new AbortController();
        const timer = setTimeout(() => {
            suggestions(engine, text, ctl.signal).then(
                (list) => (suggested = list.filter((s) => s !== text)),
                () => {},
            );
        }, 150);
        return () => {
            clearTimeout(timer);
            ctl.abort();
        };
    });
    const shownSuggestions = $derived(sugDismissed === query || !searchFocused ? [] : suggested);

    function onSearchKey(e: KeyboardEvent) {
        if (!bangSuggestions.length && shownSuggestions.length) {
            const n = shownSuggestions.length;
            if (e.key === "ArrowDown" || e.key === "ArrowUp") {
                e.preventDefault();
                sugIndex = e.key === "ArrowDown" ? (sugIndex + 1) % n : (sugIndex + n) % n;
                return;
            }
            if (e.key === "Enter" && sugIndex >= 0) {
                e.preventDefault();
                query = shownSuggestions[sugIndex];
                run();
                return;
            }
            if (e.key === "Escape") {
                e.preventDefault();
                sugDismissed = query;
                return;
            }
        }
        if (bangSuggestions.length) {
            const n = bangSuggestions.length;
            if (e.key === "ArrowDown" || e.key === "ArrowUp") {
                e.preventDefault();
                bangIndex = (bangIndex + (e.key === "ArrowDown" ? 1 : n - 1)) % n;
                return;
            }
            if (e.key === "Tab" || (e.key === "Enter" && bangPrefix)) {
                e.preventDefault();
                pickBang(bangSuggestions[bangIndex].trigger);
                return;
            }
            if (e.key === "Escape") {
                e.preventDefault();
                bangDismissed = query;
                return;
            }
        }
        if (!keyword) return;
        const atStart = searchInput?.selectionStart === 0 && searchInput?.selectionEnd === 0;
        if ((e.key === "Backspace" && atStart) || e.key === "Escape") {
            e.preventDefault();
            keyword = null;
        }
    }

    // how much sits under the search bar (see .shell); only animate after the first layout
    let belowH = $state(0);
    let settled = $state(false);
    onMount(() => {
        const t = setTimeout(() => (settled = true), 600);
        return () => clearTimeout(t);
    });

    // fetched when the widget is on or the weather wallpaper needs it; shown only with the widget
    let forecast: Weather | null = $state(
        settings.weather || bg === "weather" ? peekWeather(settings.city, settings.fahrenheit) : null,
    );
    const weather = $derived(settings.weather ? forecast : null);
    // last known list for the first frame, refreshed right after
    let top: Shortcut[] = $state(
        (() => {
            try {
                return JSON.parse(localStorage.getItem("top-sites") ?? "[]");
            } catch {
                return [];
            }
        })(),
    );

    // tabs closed recently, restored by session id rather than opened by url
    let recent: (Shortcut & { id: string })[] = $state([]);

    $effect(() => {
        void perms.recentTabs; // the API shows up once the optional permission is granted
        if (!settings.recentTabs || typeof chrome === "undefined" || !chrome.sessions) return;
        const load = () =>
            chrome.sessions.getRecentlyClosed({ maxResults: 10 }, (sessions) => {
                recent = sessions
                    .filter((s) => /^https?:\/\//.test(s.tab?.url ?? "") && s.tab?.sessionId)
                    .slice(0, 5)
                    .map((s) => ({ title: s.tab?.title ?? "", url: s.tab?.url ?? "", id: s.tab?.sessionId ?? "" }));
            });
        load();
        chrome.sessions.onChanged.addListener(load);
        return () => chrome.sessions.onChanged.removeListener(load);
    });

    // debounced so typing a city doesn't fire a request per key
    $effect(() => {
        if (!ready) return;
        if (!settings.weather && bg !== "weather") return (forecast = null);
        const { city, fahrenheit } = settings;
        const t = setTimeout(async () => (forecast = await getWeather(city, fahrenheit)), 500);
        return () => clearTimeout(t);
    });

    $effect(() => {
        void perms.topSites; // the API shows up once the optional permission is granted
        if (!settings.topSites || typeof chrome === "undefined" || !chrome.topSites) return;
        chrome.topSites.get((sites) => {
            top = sites.slice(0, 8).map(({ title, url }) => ({ title, url }));
            try {
                const json = JSON.stringify(top);
                if (localStorage.getItem("top-sites") !== json) localStorage.setItem("top-sites", json);
            } catch {}
        });
    });

    function search(e: SubmitEvent) {
        e.preventDefault();
        run();
    }

    async function run() {
        if (result) {
            const value = result.value;
            navigator.clipboard?.writeText(value).catch(() => {});
            copied = value;
            // the line goes back to the value on its own, so a later Enter reads as a fresh copy
            setTimeout(() => copied === value && (copied = ""), 1200);
            return;
        }
        const text = keyword ? `!${keyword} ${query.trim()}` : query.trim();
        if (!text) return;
        emphasize();
        const match = settings.bangs ? await resolveBangAsync(text) : null;
        if (match) {
            location.href = match.url;
            return;
        }
        const asUrl = /^\S+\.\S+$/.test(text) && !text.includes(" ") ? normalizeUrl(text) : null;
        if (asUrl) {
            location.href = asUrl;
        } else if (searchUrl(settings.engine, settings.customEngine, text)) {
            location.href = searchUrl(settings.engine, settings.customEngine, text)!;
        } else if (typeof chrome !== "undefined" && chrome.search) {
            chrome.search.query({ text, disposition: "CURRENT_TAB" });
        } else {
            location.href = `https://duckduckgo.com/?q=${encodeURIComponent(text)}`;
        }
    }

</script>

<!-- backgrounds crossfade when switched -->
<svelte:window onkeydown={(e) => openByNumber(e) || typeToSearch(e)} />

{#key bg}
    <div
        class="bg-layer"
        in:enter
        out:recede
        onintroend={() => bgSwitched && shimmer?.emphasize()}
    >
        {#if bg === "shimmer"}
            {#key themeVersion}
                <GradientShimmer
                    bind:this={shimmer}
                    background
                    intro={settings.intro && themeVersion === 0 && !bgSwitched}
                    class="bg"
                />
            {/key}
        {:else if bg === "stars"}
            <Stars intro={starsEntrance && !bgSwitched} onintro={() => (starsArrived = true)} />
        {:else if bg === "image"}
            <ImageBg blur={settings.imageBlur} />
        {:else if bg === "weather"}
            <WeatherBg
                sky={skyPreview?.sky ?? (forecast ? skyFor(forecast.code) : "clear")}
                hour={skyPreview?.hour ?? forecast?.hour}
                brisk={!!skyPreview}
            />
        {/if}
    </div>
{/key}

{#if notice && !settings.quiet}
    <UpdateNotice
        {notice}
        ondismiss={() => {
            dismiss(notice!);
            notice = null;
        }}
    />
{/if}

{#if (barClock || barWeather) && starsArrived && !settings.quiet}
    <header class={["datetime", side && "side", idle && "idle"]} style:--align={side} transition:pop>
        {#if barClock}
            <span class="group" transition:pop>
                {#if !logoClock}
                    <!-- a new format (12/24h, seconds) pops in instead of jumping -->
                    {#key `${settings.hour12}${settings.seconds}`}
                        <span class="time" in:pop={{ from: 0.9, duration: 200 }}>{time}</span>
                    {/key}
                    <span class="dot" aria-hidden="true">·</span>
                {/if}
                <span class="date">{date}</span>
            </span>
        {/if}
        {#if barClock && barWeather}
            <span class="dot" aria-hidden="true" transition:pop>·</span>
        {/if}
        {#if barWeather}
            {@const info = describe(weather.code)}
            {@const w = weather}
            <span class="group" transition:pop>
            <Tooltip>
                {#snippet anchor()}
                    <span class="weather" tabindex="0" aria-label="{w.temp}°, {info.label}">
                        {#key `${w.code}${w.day}`}
                            <span class="wi" in:pop={{ duration: 200 }}>
                                <WeatherIcon kind={info.kind} day={w.day} />
                            </span>
                        {/key}
                        {#key `${w.temp}${w.unit}`}
                            <span in:pop={{ from: 0.9, duration: 200 }}>{w.temp}°</span>
                        {/key}
                    </span>
                {/snippet}
                {#snippet content()}
                    <div class="weather-details">
                        <div class="wd-head">
                            <WeatherIcon kind={info.kind} day={w.day} />
                            <div>
                                <div class="wd-temp">{w.temp}°{w.unit}</div>
                                <div class="wd-label">{info.label}</div>
                            </div>
                        </div>
                        <div class="wd-place">{[w.place, w.country].filter(Boolean).join(", ")}</div>
                        <dl>
                            {#if w.feels !== undefined}<dt>{t("feels_like")}</dt><dd>{w.feels}°</dd>{/if}
                            {#if w.high !== undefined && w.low !== undefined}<dt>{t("high_low")}</dt><dd>{w.high}° / {w.low}°</dd>{/if}
                            {#if w.rain !== undefined}<dt>{t("precipitation")}</dt><dd>{w.rain}%</dd>{/if}
                            {#if w.humidity !== undefined}<dt>{t("humidity")}</dt><dd>{w.humidity}%</dd>{/if}
                            {#if w.wind !== undefined}<dt>{t("wind")}</dt><dd>{w.wind} {w.unit === "F" ? "mph" : "km/h"}</dd>{/if}
                        </dl>
                    </div>
                {/snippet}
            </Tooltip>
            </span>
        {/if}
    </header>
{/if}


{#snippet Mark({ height, text = false }: { height: string; text?: boolean })}
    {#if settings.chromeLogo}
        <ChromeLogo {height} {text} />
    {:else}
        <HeliumLogo {height} {text} />
    {/if}
{/snippet}

{#snippet dateLine()}
    <span class="date">{date}</span>
    {#if weather}
        {@const info = describe(weather.code)}
        <span aria-hidden="true">·</span>
        <span class="wi" title={info.label}><WeatherIcon kind={info.kind} day={weather.day} /></span>
        <span>{weather.temp}°</span>
    {/if}
{/snippet}

<main
    style:--below="{belowH}px"
    style:--align={side}
    class={["shell", side && "side", !settings.logoShown && "no-logo", searchTucked && "no-search", idle && "idle", settled && "settled", bg !== "none" && "glass-children", !starsArrived && "waiting", starsEntrance && "entrance"]}>
    <!-- fixed box: both variants swap in place without moving the search -->
    {#if settings.logoShown}
    <div class="logo" transition:pop>
        {#key settings.logo}
            <div class="logo-variant" transition:pop>
                {#if settings.logo === "greeting"}
                    <div class="greeting">
                        {@render Mark({ height: "40px" })}
                        <p dir="auto">{greeting}</p>
                    </div>
                {:else if settings.logo === "wordmark"}
                    {@render Mark({ height: "44px", text: true })}
                {:else if settings.logo === "clock"}
                    <div class="greeting">
                        {@render Mark({ height: "40px" })}
                        <div class="logo-clock">
                            <p class="logo-time">{time}</p>
                            <span class="date-line">{@render dateLine()}</span>
                        </div>
                    </div>
                {:else if settings.logo === "bigClock"}
                    <div class="big-clock">
                        <span class="date-line big-date">{@render dateLine()}</span>
                        <span class="big-time">{time}</span>
                    </div>
                {:else}
                    {@render Mark({ height: "56px" })}
                {/if}
            </div>
        {/key}
    </div>
    {/if}

    <form class={["search", searchTucked && "tucked"]} onsubmit={search} onfocusin={() => (searchFocused = true)} onfocusout={() => (searchFocused = false)}>
        <!-- like Helium's omnibox keyword mode (and exsesx/helium-new-tab):
             service icon and name, then a divider before the query -->
        <Input
            bind:value={query}
            bind:input={searchInput}
            onkeydown={onSearchKey}
            width="100%"
            type="search"
            aria-label={t("search")}
            aria-describedby="search-service"
            placeholder={keyword && bang ? t("search_service", { service: bang.service }) : t("search_or_enter_address")}
            autocomplete="off"
            spellcheck="false"
            enterkeyhint="search"
            class={["search-input", bang && "keyword"]}
            onfocus={emphasize}
        >
            {#snippet leading()}
                <span class="search-icon">
                    {#if bang?.siteOrigin}
                        <!-- same icons as the shortcuts: vector logos for popular services -->
                        {#key bang.siteOrigin}
                            <SiteIcon url={bang.siteOrigin} title={bang.service} size={18} />
                        {/key}
                    {:else if bang}
                        <IconBang />
                    {:else}
                        <IconSearch />
                    {/if}
                </span>
                {#if bang}
                    <span id="search-service" class="service-name" transition:pop>{bang.service}</span>
                {/if}
            {/snippet}
        </Input>

        {#if result}
            <div class="answer" aria-live="polite" transition:pop>{copied === result.value ? t("copied") : `= ${result.text}`}</div>
        {/if}

        {#if bangSuggestions.length}
            <ul class="bang-list" role="listbox" aria-label={t("bangs")} transition:pop={{ from: 0.96, duration: 150 }}>
                {#each bangSuggestions as item, i (item.trigger + item.service)}
                    <li role="option" aria-selected={i === bangIndex}>
                        <button
                            type="button"
                            class={["bang-item", i === bangIndex && "active"]}
                            onpointerenter={() => (bangIndex = i)}
                            onpointerdown={(e) => e.preventDefault()}
                            onclick={() => pickBang(item.trigger)}
                        >
                            <span class="bang-icon">
                                {#if item.origin}
                                    <SiteIcon url={item.origin} title={item.service} size={18} />
                                {:else}
                                    <IconBang />
                                {/if}
                            </span>
                            <span class="bang-trigger">!{item.trigger}</span>
                            <span class="bang-service">{item.service}</span>
                        </button>
                    </li>
                {/each}
            </ul>
        {/if}

        {#if shownSuggestions.length}
            <ul class="bang-list" role="listbox" aria-label={t("suggestions")} transition:pop={{ from: 0.96, duration: 150 }}>
                {#each shownSuggestions as item, i (item)}
                    <li role="option" aria-selected={i === sugIndex}>
                        <button
                            type="button"
                            class={["bang-item", i === sugIndex && "active"]}
                            onpointerenter={() => (sugIndex = i)}
                            onpointerdown={(e) => e.preventDefault()}
                            onclick={() => {
                                query = item;
                                run();
                            }}
                        >
                            <span class="bang-icon"><IconSearch /></span>
                            <span class="bang-service">{item}</span>
                        </button>
                    </li>
                {/each}
            </ul>
        {/if}
    </form>

    <!-- everything under the search; its height decides how far up the page sits -->
    <div class="below" bind:clientHeight={belowH}>
        {#if settings.shortcuts && !settings.quiet}
            <div class="row" transition:pop={{ from: 0.96, duration: 200 }}>
            <Shortcuts
                bind:items={settings.links}
                readonly={settings.lockShortcuts}
                contained={settings.iconStyle === "contained"}
                titles={settings.shortcutTitles}
                numbers={settings.shortcutKeys}
                {tint}
                label={t("shortcuts")}
                onchange={emphasize}
            />
            </div>
        {/if}
        {#if settings.topSites && top.length && !settings.quiet}
            <div class="row most-visited" transition:pop={{ from: 0.96, duration: 200 }}>
                {#if settings.shortcuts}
                    <div class="divider" aria-hidden="true"><span>{t("most_visited")}</span></div>
                {/if}
            <Shortcuts
                items={top}
                readonly
                contained={settings.iconStyle === "contained"}
                titles={settings.shortcutTitles}
                {tint}
                label={t("most_visited")}
            />
            </div>
        {/if}
        {#if settings.recentTabs && recent.length && !settings.quiet}
            <div class="row most-visited" transition:pop={{ from: 0.96, duration: 200 }}>
                {#if settings.shortcuts || (settings.topSites && top.length)}
                    <div class="divider" aria-hidden="true"><span>{t("recently_closed")}</span></div>
                {/if}
            <Shortcuts
                items={recent}
                readonly
                contained={settings.iconStyle === "contained"}
                titles={settings.shortcutTitles}
                {tint}
                label={t("recently_closed")}
                onopen={(i) => {
                    // the tab comes back with its history; this new tab has done its job
                    chrome.sessions.restore(recent[i].id).then(() => chrome.tabs.getCurrent((tab) => tab?.id && chrome.tabs.remove(tab.id)));
                    return true;
                }}
            />
            </div>
        {/if}
    </div>
</main>

<div class={["corner", settingsOpen && "open", idle && "idle"]} onpointerenter={loadSettings} onfocusin={loadSettings}>
    <Button
        circle
        transparent
        selected={settings.quiet}
        aria-label={settings.quiet ? t("show_everything") : t("focus_mode")}
        title={settings.quiet ? t("show_everything") : t("focus_mode_just_the")}
        onclick={() => {
            settings.quiet = !settings.quiet;
            emphasize();
        }}
    >
        {#key settings.quiet}
            <span class="corner-icon" in:pop={{ duration: 200 }}>
                {#if settings.quiet}
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M10.585 10.587a2 2 0 0 0 2.829 2.828" /><path d="M16.681 16.673a8.717 8.717 0 0 1 -4.681 1.327c-3.6 0 -6.6 -2 -9 -6c1.272 -2.12 2.712 -3.678 4.32 -4.674m2.86 -1.146a9.055 9.055 0 0 1 1.82 -.18c3.6 0 6.6 2 9 6c-.666 1.11 -1.379 2.067 -2.138 2.87" /><path d="M3 3l18 18" /></svg>
                {:else}
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M10 12a2 2 0 1 0 4 0a2 2 0 0 0 -4 0" /><path d="M21 12c-2.4 4 -5.4 6 -9 6c-3.6 0 -6.6 -2 -9 -6c2.4 -4 5.4 -6 9 -6c3.6 0 6.6 2 9 6" /></svg>
                {/if}
            </span>
        {/key}
    </Button>
    <Button
        circle
        transparent
        selected={settingsOpen}
        aria-label={t("settings")}
        onclick={() => {
            settingsOpen = !settingsOpen;
            emphasize();
        }}
    >
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M10.325 4.317c.426 -1.756 2.924 -1.756 3.35 0a1.724 1.724 0 0 0 2.573 1.066c1.543 -.94 3.31 .826 2.37 2.37a1.724 1.724 0 0 0 1.065 2.572c1.756 .426 1.756 2.924 0 3.35a1.724 1.724 0 0 0 -1.066 2.573c.94 1.543 -.826 3.31 -2.37 2.37a1.724 1.724 0 0 0 -2.572 1.065c-.426 1.756 -2.924 1.756 -3.35 0a1.724 1.724 0 0 0 -2.573 -1.066c-1.543 .94 -3.31 -.826 -2.37 -2.37a1.724 1.724 0 0 0 -1.065 -2.572c-1.756 -.426 -1.756 -2.924 0 -3.35a1.724 1.724 0 0 0 1.066 -2.573c-.94 -1.543 .826 -3.31 2.37 -2.37c1 .608 2.296 .07 2.572 -1.065z" /><path d="M9 12a3 3 0 1 0 6 0a3 3 0 0 0 -6 0" /></svg>
    </Button>
</div>

{#if settingsOpen}
    {#await loadSettings() then { default: Settings }}
        <Settings
            bind:settings
            {themeSource}
            {emphasize}
            glass={bg !== "none"}
            onclose={() => (settingsOpen = false)}
            onaddshortcuts={() => (addingShortcuts = true)}
        />
    {/await}
{/if}

{#if addingShortcuts}
    {#await loadAdd() then { default: AddShortcuts }}
        <AddShortcuts
            bind:items={settings.links}
            onchange={emphasize}
            onclose={() => (addingShortcuts = false)}
        />
    {/await}
{/if}

<style>
    :global(html),
    :global(body) {
        height: 100%;
        overflow-x: hidden;
    }

    .bg-layer {
        position: fixed;
        inset: 0;
        z-index: 0;
        overflow: hidden;
        /* opaque, so a revealing layer fully covers the one underneath */
        background: var(--background);
        pointer-events: none;
    }

    .row {
        display: flex;
        justify-content: center;
        width: 100%;
    }

    .most-visited {
        flex-direction: column;
        align-items: center;
        gap: var(--gap-3);
        margin-top: var(--gap-2);
    }

    /* a quiet label between two hairlines, so history doesn't read as your shortcuts */
    .divider {
        display: flex;
        align-items: center;
        gap: var(--gap-3);
        width: min(100%, 420px);
        color: var(--tertiary);
        font-size: 13px;
        white-space: nowrap;
    }

    .divider::before,
    .divider::after {
        content: "";
        flex: 1;
        height: 1px;
        background: linear-gradient(
            to var(--side, right),
            transparent,
            var(--helium-elevated-20)
        );
    }

    .divider::after {
        --side: left;
    }

    /* after the star entrance: the UI rises out of the light, one piece after another */
    .shell.waiting > :global(*) {
        opacity: 0;
    }

    .shell.entrance:not(.waiting) > :global(*) {
        animation: rise 0.45s cubic-bezier(0.16, 1, 0.3, 1) backwards;
    }

    .shell.entrance:not(.waiting) > :global(:nth-child(2)) {
        animation-delay: 0.04s;
    }

    .shell.entrance:not(.waiting) > :global(:nth-child(3)) {
        animation-delay: 0.08s;
    }

    .shell.entrance:not(.waiting) > :global(:nth-child(4)) {
        animation-delay: 0.12s;
    }

    @keyframes rise {
        from {
            opacity: 0;
            translate: 0 18px;
            scale: 0.96;
            filter: blur(10px);
        }
    }

    .logo {
        display: grid;
        place-items: center;
        height: 56px;
    }

    .logo-variant {
        grid-area: 1 / 1;
        display: grid;
        place-items: center;
    }

    .greeting {
        display: flex;
        align-items: center;
        gap: 14px;
        max-width: calc(100vw - 32px);
    }

    .greeting p {
        margin: 0;
        color: inherit; /* the wordmark's color, not Prism's muted paragraph */
        font-size: clamp(22px, 6.5vw, 30px);
        font-weight: 500;
        letter-spacing: -0.02em;
        line-height: 1.1;
        text-wrap: balance;
    }

    .logo-clock {
        display: grid;
        gap: 2px;
        text-align: start;
    }

    /* the same light weight as the big clock, quieter than a greeting */
    .greeting .logo-time {
        font-weight: 400;
        font-variant-numeric: tabular-nums;
    }

    .date-line {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        color: var(--secondary);
        font-size: 14px;
        font-variant-numeric: tabular-nums;
    }

    /* the time takes the logo's place; the date sits above it so the search stays put */
    /* the date line follows the column to its side (an absolute grid child still aligns) */
    .big-clock {
        position: relative;
        display: grid;
        place-items: center;
        justify-items: var(--align, center);
    }

    .big-time {
        font-size: 72px;
        font-weight: 400;
        letter-spacing: -0.04em;
        line-height: 56px;
        font-variant-numeric: tabular-nums;
    }

    .big-date {
        position: absolute;
        bottom: calc(100% + 10px);
        white-space: nowrap;
    }

    /* the words settle in a beat after the mark, like a tooltip popping in */
    @media (prefers-reduced-motion: no-preference) {
        .greeting p {
            animation: greet 0.35s 0.08s cubic-bezier(0.16, 1, 0.3, 1) both;
        }
    }

    @keyframes greet {
        from {
            opacity: 0;
            scale: 0.92;
        }
    }

    .shell {
        position: relative;
        z-index: 1;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 28px;
        min-height: 100vh;
        /* Logo + search sit at a fixed spot while what's under them fits; with more rows
           (shortcuts, most visited) the whole block rises to stay centered. 76px is the
           search and the gap under it (--search), --logo the logo and the gap under that. */
        --logo: 84px;
        --search: 76px;
        padding: max(48px, min(calc(50vh - 6px - var(--logo)), calc(50vh - (var(--search) + var(--logo) + var(--below, 0px)) / 2)))
            16px 96px;
    }

    /* without the logo the search keeps its spot */
    .shell.no-logo {
        --logo: 0px;
    }

    .shell.no-search {
        --search: 0px;
    }

    /* to one side: everything lines up along the column's edge */
    .shell.side {
        align-items: var(--align);
        padding-inline: max(16px, 8vw);
    }

    .shell.side .logo,
    .shell.side .logo-variant {
        justify-items: var(--align);
    }

    .shell.side .below,
    .shell.side .most-visited {
        align-items: var(--align);
    }

    .shell.side .row,
    .shell.side :global(.shortcuts) {
        justify-content: var(--align);
    }

    .datetime.side {
        justify-content: var(--align);
        padding-inline: max(16px, 8vw);
    }

    .shell.settled {
        transition: padding-top 0.45s cubic-bezier(0.3, 1, 0.5, 1);
    }

    .below {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 28px;
        width: 100%;
    }

    .below:empty {
        display: none;
    }

    .shell .below,
    .datetime {
        transition: opacity 0.25s ease;
    }

    .shell.idle .below,
    .datetime.idle,
    .corner.idle {
        opacity: 0;
        pointer-events: none;
        transition: opacity 0.8s ease;
    }

    .datetime {
        position: fixed;
        top: 16px;
        left: 0;
        right: 0;
        z-index: 2;
        display: flex;
        justify-content: center;
        gap: 8px;
        font-size: 14px;
        color: var(--secondary);
        font-variant-numeric: tabular-nums;
        pointer-events: none;
    }

    :global(:root[data-picture]) .datetime,
    :global(:root[data-picture]) .divider {
        text-shadow: var(--text-halo);
    }

    :global(:root[data-picture]) .wi {
        filter: drop-shadow(0 0 2px var(--halo-ink));
    }

    .date::first-letter {
        text-transform: uppercase;
    }

    .datetime .group,
    .datetime .time,
    .wi {
        display: inline-flex;
        align-items: center;
        gap: 8px;
    }

    .weather {
        display: inline-flex;
        align-items: center;
        gap: 4px;
        pointer-events: auto;
        cursor: default;
        border-radius: 6px;
    }

    .weather:focus-visible {
        outline: 2px solid var(--primary);
        outline-offset: 2px;
    }

    .datetime :global(.tooltip-anchor) {
        pointer-events: auto;
    }

    .weather-details {
        text-shadow: none;
        display: flex;
        flex-direction: column;
        gap: 8px;
        min-width: 190px;
        white-space: normal;
        font-variant-numeric: tabular-nums;
    }

    .wd-head {
        display: flex;
        align-items: center;
        gap: 10px;
    }

    .wd-head :global(svg) {
        width: 30px;
        height: 30px;
        color: var(--helium-elevated);
    }

    .wd-temp {
        font-size: 22px;
        font-weight: 600;
        line-height: 1;
    }

    .wd-label {
        margin-top: 2px;
        color: var(--secondary);
        font-size: 13px;
    }

    .wd-place {
        color: var(--tertiary);
        font-size: 13px;
    }

    .weather-details dl {
        display: grid;
        grid-template-columns: auto auto;
        gap: 4px 16px;
        margin: 0;
        padding-top: 8px;
        border-top: 1px solid var(--helium-elevated-10);
        font-size: 13px;
    }

    .weather-details dt {
        color: var(--secondary);
    }

    .weather-details dd {
        margin: 0;
        text-align: right;
    }

    .dot {
        color: var(--tertiary);
    }

    .search {
        position: relative;
        /* above the shortcut rows: the entrance animation makes every block its own
           stacking context, so the bang list's z-index alone can't escape the form */
        z-index: 10;
        width: min(100%, 600px);
        interpolate-size: allow-keywords;
        transition:
            height 0.3s cubic-bezier(0.3, 1, 0.5, 1),
            margin 0.3s cubic-bezier(0.3, 1, 0.5, 1),
            opacity 0.25s,
            scale 0.25s;
    }

    /* folded away along with the gap under it, but still focusable, so type-to-search
       can open it again */
    .search.tucked {
        height: 0;
        margin-bottom: -28px;
        opacity: 0;
        scale: 0.98;
        pointer-events: none;
    }

    /* on a bright picture the glass field takes on the halo too, so its placeholder holds */
    :global(:root[data-picture]) .search :global(.input-field) {
        background-color: color-mix(in srgb, var(--background) calc(var(--halo) * 100%), var(--helium-elevated-7));
    }

    :global(:root[data-picture]) .search :global(.input-field:is(:hover, :focus-within)) {
        background-color: color-mix(in srgb, var(--background) calc(var(--halo) * 100%), var(--helium-elevated-10));
    }

    /* out of flow, so the bar and shortcuts never move; the side follows the column */
    .answer {
        position: absolute;
        top: calc(100% + 6px);
        left: 0;
        right: 0;
        display: flex;
        justify-content: var(--align, center);
        padding-inline: 18px;
        font-size: 14px;
        font-variant-numeric: tabular-nums;
        color: var(--secondary);
        pointer-events: none;
    }

    /* bang autocomplete, same surface as the settings panel */
    .bang-list {
        position: absolute;
        top: calc(100% + 8px);
        left: 0;
        right: 0;
        z-index: 5;
        margin: 0;
        padding: 6px;
        list-style: none;
        border-radius: 16px;
        background: var(--background);
        outline: 1.5px solid var(--helium-elevated-10);
        outline-offset: -1.5px;
        box-shadow: 4px 4px 24px 0 var(--tooltip-shadow);
        transform-origin: top center;
    }

    .bang-item {
        display: flex;
        align-items: center;
        gap: 10px;
        width: 100%;
        min-height: 0;
        padding: 8px 10px !important;
        border: none;
        border-radius: 10px;
        background: none !important;
        color: var(--secondary);
        font: inherit;
        font-size: 14px;
        text-align: left;
        cursor: pointer;
        transition: background-color 0.15s, color 0.15s;
    }

    .bang-item.active {
        background: var(--helium-elevated-10) !important;
        color: var(--primary);
    }

    .bang-item:active {
        transform: none;
    }

    .bang-icon {
        display: grid;
        place-items: center;
        flex-shrink: 0;
        width: 18px;
        height: 18px;
        color: var(--tertiary);
    }


    .bang-trigger {
        min-width: 64px;
        color: var(--helium-elevated);
        font-variant-numeric: tabular-nums;
    }

    .bang-service {
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
    }

    .search-icon {
        position: relative;
        display: grid;
        place-items: center;
        width: 18px;
        height: 18px;
    }


    .service-name {
        max-width: 30vw;
        overflow: hidden;
        margin-left: 8px;
        padding-right: 10px;
        border-right: 1px solid color-mix(in srgb, var(--secondary) 40%, transparent);
        color: var(--helium-elevated);
        font-size: 16px;
        line-height: 20px;
        white-space: nowrap;
        text-overflow: ellipsis;
    }

    .search :global(.keyword .input-accessory) {
        color: var(--helium-elevated);
    }

    .search :global(input[type="search"]::-webkit-search-decoration),
    .search :global(input[type="search"]::-webkit-search-cancel-button) {
        -webkit-appearance: none;
    }

    @keyframes fade-in {
        from {
            opacity: 0;
        }
    }

    .corner {
        position: fixed;
        right: 20px;
        bottom: 20px;
        z-index: 3;
        display: flex;
        gap: var(--gap-1);
        opacity: 0.25;
        transition: opacity 0.3s;
    }

    .corner:hover,
    .corner:focus-within,
    .corner.open {
        opacity: 1;
    }

    .corner.idle,
    .corner.idle:hover {
        opacity: 0;
        pointer-events: none;
    }

    @media (prefers-reduced-motion: reduce) {
        .shell .below,
        .datetime,
        .corner,
        .shell.idle .below,
        .datetime.idle,
        .corner.idle {
            transition: none;
        }
    }

    .corner-icon {
        display: grid;
        place-items: center;
    }

    .corner :global(svg) {
        width: 18px;
        height: 18px;
    }
</style>
