// The browser's own pages (chrome://, helium://, about:) can't be reached by a plain link
// from this page, so those go through chrome.tabs; everything else is a normal navigation.
const INTERNAL = ["chrome:", "helium:", "about:"];

export const isInternal = (url: string) => INTERNAL.some((p) => url.startsWith(p));

/** Opens `url` here, or in a new background tab; false when the browser can handle it itself. */
export function openInternal(url: string, newTab = false) {
    if (!isInternal(url) || typeof chrome === "undefined" || !chrome.tabs) return false;
    if (newTab) chrome.tabs.create({ url, active: false });
    else chrome.tabs.update({ url });
    return true;
}
