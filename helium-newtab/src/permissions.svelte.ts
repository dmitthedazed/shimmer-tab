// Optional permissions, asked for only when the matching option is turned on, so the
// install prompt doesn't ask for access to every site or to the browsing history.
const SITES: chrome.permissions.Permissions = { origins: ["https://*/*", "http://*/*"] };
const POLICY: chrome.permissions.Permissions = { origins: ["file:///etc/chromium/policies/*"] };
const TOP_SITES: chrome.permissions.Permissions = { permissions: ["topSites"] };
const RECENT_TABS: chrome.permissions.Permissions = { permissions: ["sessions"] };

const api = typeof chrome !== "undefined" ? chrome.permissions : undefined;

/** The plain web page (GitHub Pages): no extension APIs, and other sites can't be read. */
export const WEB = import.meta.env.MODE === "web";

/** `epoch` bumps on every change so icons can re-resolve with the new access. */
export const perms = $state({ sites: false, policy: false, topSites: false, recentTabs: false, epoch: 0 });

async function refresh() {
    if (!api) return;
    const [sites, policy, topSites, recentTabs] = await Promise.all([
        api.contains(SITES),
        api.contains(POLICY),
        api.contains(TOP_SITES),
        api.contains(RECENT_TABS),
    ]);
    Object.assign(perms, { sites, policy, topSites, recentTabs, epoch: perms.epoch + 1 });
}

refresh();
api?.onAdded.addListener(refresh);
api?.onRemoved.addListener(refresh);

/** Reading other sites (for their own icons). Outside the extension there's nothing to ask. */
export async function canReadSites() {
    return api ? api.contains(SITES) : !WEB;
}

const sets = { sites: SITES, policy: POLICY, topSites: TOP_SITES, recentTabs: RECENT_TABS };
export type Access = keyof typeof sets;

/** Call straight from a click: Chrome only shows the prompt during a user gesture. */
export async function grant(kind: Access) {
    if (!api) return true;
    try {
        return await api.request(sets[kind]);
    } catch {
        return false;
    }
}

export async function revoke(kind: Access) {
    if (!api) return;
    try {
        await api.remove(sets[kind]);
    } catch {}
}
