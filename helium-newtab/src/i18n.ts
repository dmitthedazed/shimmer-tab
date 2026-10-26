// UI strings: locales/en.json is the source, Crowdin fills in the other files
// (crowdin.yml). The language follows the browser; anything untranslated stays English.
import en from "./locales/en.json";

type Strings = typeof en;
type Key = Exclude<keyof Strings, "greetings">;

const all = import.meta.glob<Partial<Strings>>("./locales/*.json", { eager: true, import: "default" });

function pick(): [string, Partial<Strings>] {
    for (const tag of navigator.languages ?? [navigator.language]) {
        // files use Chrome's codes: exact (pt_BR), then the language alone (pt)
        for (const name of [tag.replace("-", "_"), tag.split("-")[0]]) {
            const strings = all[`./locales/${name}.json`];
            if (strings) return [name, strings];
        }
    }
    return ["en", en];
}

const [lang, local] = pick();
document.documentElement.lang = lang;

/** The string for `key`, with `{name}` placeholders filled from `vars`. */
export function t(key: Key, vars?: Record<string, string | number>) {
    const text = (local[key] as string | undefined) || en[key];
    return vars ? text.replace(/\{(\w+)\}/g, (m: string, name: string) => String(vars[name] ?? m)) : text;
}

/** Greeting pools in this language; a pool that isn't translated yet stays English. */
export function greetingTable<T extends Record<string, string[]>>(fallback: T): T {
    const table = (local.greetings ?? {}) as Partial<Record<keyof T, string[]>>;
    return Object.fromEntries(
        Object.entries(fallback).map(([pool, lines]) => {
            const own = table[pool as keyof T]?.filter(Boolean);
            return [pool, own?.length ? own : lines];
        }),
    ) as T;
}
