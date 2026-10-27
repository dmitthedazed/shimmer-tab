# Contributing

## Run it

```sh
cd helium-newtab
pnpm install
pnpm build          # extension in dist/, load it unpacked in helium://extensions
pnpm build:web      # the web version in dist-web/
```

## Rules of thumb

- No analytics and no server of our own. Any new network request needs a line in [PRIVACY.md](PRIVACY.md).
- Ask for a permission only when the user turns on the option that needs it, and list it in PRIVACY.md.
- UI text goes into `src/locales/en.json`, never straight into components, so it can be translated.
- The page must work as the plain web version too. Guard extension-only APIs.
- Respect `prefers-reduced-motion` and the setting that turns the opening animation off.

## Translations

Translate on [Crowdin](https://crowdin.com) rather than editing locale files here. Only `en.json` is edited by hand.

## Pull requests

Keep them small. For visual changes, add a screenshot or a short clip.
