export type BangEntry = { s: string; ts: string[]; u: string; f?: number };
export function compactCatalog(entries: BangEntry[]): BangEntry[];
export function createBangResolver(
    catalog: BangEntry[],
): (text: string) => { url: string; service: string; siteOrigin: string } | null;
