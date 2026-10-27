// Search engines for the bar. `suggest` endpoints all answer in the OpenSearch JSON shape
// `[query, [suggestion, …]]`, so one reader serves them all.
export type Engine = { name: string; url: string; suggest?: string };

export const ENGINES: Record<string, Engine> = {
    google: {
        name: "Google",
        url: "https://www.google.com/search?q=%s",
        suggest: "https://suggestqueries.google.com/complete/search?client=firefox&q=%s",
    },
    duckduckgo: {
        name: "DuckDuckGo",
        url: "https://duckduckgo.com/?q=%s",
        suggest: "https://duckduckgo.com/ac/?type=list&q=%s",
    },
    bing: {
        name: "Bing",
        url: "https://www.bing.com/search?q=%s",
        suggest: "https://api.bing.com/osjson.aspx?query=%s",
    },
    brave: {
        name: "Brave",
        url: "https://search.brave.com/search?q=%s",
        suggest: "https://search.brave.com/api/suggest?q=%s",
    },
    ecosia: {
        name: "Ecosia",
        url: "https://www.ecosia.org/search?q=%s",
        suggest: "https://ac.ecosia.org/autocomplete?type=list&q=%s",
    },
    startpage: { name: "Startpage", url: "https://www.startpage.com/do/search?q=%s" },
};

const fill = (template: string, text: string) => template.replace("%s", encodeURIComponent(text));

/** the page for a search, or null to leave it to the browser's own default engine */
export function searchUrl(engine: string, custom: string, text: string): string | null {
    const template = engine === "custom" ? custom.trim() : ENGINES[engine]?.url;
    if (!template?.includes("%s")) return null;
    try {
        const url = new URL(fill(template, text));
        return url.protocol === "https:" || url.protocol === "http:" ? url.toString() : null;
    } catch {
        return null;
    }
}

/** where suggestions come from for this engine, if anywhere */
export const suggestEndpoint = (engine: string) => ENGINES[engine]?.suggest ?? null;

export async function suggestions(engine: string, text: string, signal: AbortSignal): Promise<string[]> {
    const endpoint = suggestEndpoint(engine);
    if (!endpoint) return [];
    const res = await fetch(fill(endpoint, text), { signal, credentials: "omit" });
    const data = await res.json();
    // unique: they key the list
    return Array.isArray(data?.[1]) ? [...new Set(data[1].filter((s: unknown) => typeof s === "string"))].slice(0, 6) as string[] : [];
}
