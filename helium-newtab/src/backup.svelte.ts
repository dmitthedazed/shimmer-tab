// Backup file: everything lives in `settings` (shortcuts included), so that's the file.
import { t } from "./i18n";
import { countLinks, defaults, normalize, parseShortcuts, type Settings } from "./storage.svelte";

const FORMAT = "shimmer-tab";
const OLD_FORMATS = ["helium-prism-newtab"];

/** downloads the settings as a file; returns the note to show */
export function exportSettings(settings: Settings) {
    const data = { format: FORMAT, version: 1, exported: new Date().toISOString(), settings: $state.snapshot(settings) };
    const url = URL.createObjectURL(new Blob([JSON.stringify(data, null, 2)], { type: "application/json" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = `shimmer-tab-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    return t("saved_to_your_downloads");
}

/** a backup replaces the settings; a list of links (or a Yet Another Speed Dial export) is added to the shortcuts */
export async function importSettings(file: File, settings: Settings) {
    try {
        const data = JSON.parse(await file.text());
        const added = Array.isArray(data) || Array.isArray(data?.shortcuts) || Array.isArray(data?.yasd?.bookmarks) ? parseShortcuts(JSON.stringify(data)) : [];
        if (added.length) {
            settings.links = [...settings.links, ...added];
            return { ok: true, text: t("shortcuts_added", { count: countLinks(added) }) };
        }
        const raw = data?.format === FORMAT || OLD_FORMATS.includes(data?.format) ? data.settings : data;
        if (!raw || typeof raw !== "object" || Array.isArray(raw)) throw new Error();
        Object.assign(settings, normalize(raw));
        return { ok: true, text: t("backup_loaded") };
    } catch {
        return { ok: false, text: t("that_file_isn_t") };
    }
}

export function resetSettings(settings: Settings) {
    Object.assign(settings, structuredClone(defaults));
    return t("back_to_defaults");
}
