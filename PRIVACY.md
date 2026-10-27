# Privacy policy

_Shimmer Tab for Helium, last updated October 26, 2026_

Shimmer Tab replaces your browser's new tab page. It has no account, no analytics, no ads
and no server of its own. Nothing you do on the page is sent to the developer.

## What stays in your browser

- **Settings and shortcuts** are saved with `chrome.storage.sync`, so your browser can sync
  them between your own devices if you use browser sync. A copy is kept in local storage so
  the page draws correctly on its first frame.
- **Your wallpaper picture or GIF** is stored in this browser only (IndexedDB, plus a few brightness numbers measured from it in localStorage); it is never uploaded or synced.
- **Icon, weather and top sites caches** are kept in local storage on your device.
- **Most visited sites** (optional) are read from your browser with the `topSites` API and
  only shown on the page. They are never sent anywhere.
- **Exported settings** are saved as a file on your computer only when you click Export.

## What leaves your browser, and to whom

The page talks to third parties only to show what you asked for:

| When | Request goes to | What it sends |
|---|---|---|
| Weather is turned on, or the weather wallpaper is picked | [Open-Meteo](https://open-meteo.com) (geocoding and forecast APIs) | The city name you typed and its coordinates; no device location is used |
| A shortcut's logo is shown | [svgl.app](https://svgl.app) | Which logo file to download (for example `github_dark.svg`) |
| "Icons for every site" is turned on | The websites in your shortcuts and most visited list | A normal request for the site's page, web app manifest and icon files, without cookies |
| "Check for updates" is turned on (off by default) | [GitHub](https://github.com) (releases API) | A plain request for the latest release of this extension, at most once a day; no cookies or identifiers |
| You search | The search engine you chose in settings (your browser's default unless you pick another), or the site of a bang you used | Your search text, the same as searching from the address bar |
| "Suggestions" is turned on (off by default) | The suggestion service of the engine you chose | What you type in the search bar, after a short pause, without cookies |

These requests are made only from your browser, directly to those services. Their own
privacy policies apply to them.

## Permissions

- `storage`: save your settings and caches.
- `search`: send searches to your default search engine.
- `favicon`: show the browser's own small site icons.
- Access to `svgl.app`: download vector logos for popular services.
- Optional, asked for when you turn the matching option on:
  - `topSites` for **Most visited**.
  - Access to websites (`http://*/*`, `https://*/*`) for **Icons for every site**.
  - Access to `file:///etc/chromium/policies/*` for **Browser colors**, to read the theme
    color your system set for the browser. Only that folder, and only on your computer.

You can turn these options off and remove the permissions from the extension's details
page at any time.

## Selling or sharing data

The extension does not collect, sell, rent or share personal data, and does not use data
for advertising, credit scoring or anything unrelated to drawing your new tab page.

## Contact

Questions or issues: [github.com/dmitthedazed/shimmer-tab/issues](https://github.com/dmitthedazed/shimmer-tab/issues)
