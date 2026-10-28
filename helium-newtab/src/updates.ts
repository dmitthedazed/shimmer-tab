// Update notices: after the extension was updated (no network, a link to its release), and
// optionally a daily look at GitHub's latest release for those who install the zip by hand.
const REPO = "dmitthedazed/shimmer-tab";
const SEEN = "seen-version";
const CHECKED = "update-checked";
const DISMISSED = "update-dismissed";
const DAY = 864e5;

export type Notice = { kind: "updated" | "available"; version: string; url: string };

const read = (key: string) => {
    try {
        return localStorage.getItem(key);
    } catch {
        return null;
    }
};
const write = (key: string, value: string) => {
    try {
        localStorage.setItem(key, value);
    } catch {}
};

export function currentVersion(): string | null {
    try {
        return chrome.runtime.getManifest().version;
    } catch {
        return null; // the plain web page
    }
}

/** a store install updates itself and its manifest carries the store's update_url; a zip does not */
export function fromZip(): boolean {
    try {
        return !chrome.runtime.getManifest().update_url;
    } catch {
        return false;
    }
}

const release = (version: string) => `https://github.com/${REPO}/releases/tag/v${version}`;

/** the version this one replaced is remembered; a first install just records itself */
export function updatedNotice(): Notice | null {
    const now = currentVersion();
    if (!now) return null;
    const seen = read(SEEN);
    if (!seen) write(SEEN, now);
    return seen && seen !== now ? { kind: "updated", version: now, url: release(now) } : null;
}

export function dismiss(notice: Notice) {
    if (notice.kind === "updated") write(SEEN, notice.version);
    else write(DISMISSED, notice.version);
}

const newer = (a: string, b: string) => {
    const [x, y] = [a, b].map((v) => v.split(".").map((n) => parseInt(n, 10) || 0));
    for (let i = 0; i < Math.max(x.length, y.length); i++) {
        if ((x[i] ?? 0) !== (y[i] ?? 0)) return (x[i] ?? 0) > (y[i] ?? 0);
    }
    return false;
};

/** asks GitHub for the latest release at most once a day */
export async function checkLatest(): Promise<Notice | null> {
    const now = currentVersion();
    if (!now) return null;
    let latest = read(CHECKED)?.split(" ") ?? [];
    if (!latest[0] || Date.now() - Number(latest[0]) > DAY) {
        try {
            const res = await fetch(`https://api.github.com/repos/${REPO}/releases/latest`, { credentials: "omit" });
            const tag: unknown = (await res.json()).tag_name;
            latest = [String(Date.now()), typeof tag === "string" ? tag.replace(/^v/i, "") : ""];
            write(CHECKED, latest.join(" "));
        } catch {
            return null;
        }
    }
    const version = latest[1];
    if (!version || !newer(version, now) || read(DISMISSED) === version) return null;
    return { kind: "available", version, url: release(version) };
}
