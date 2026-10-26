import { svelte } from "@sveltejs/vite-plugin-svelte";
import { defineConfig } from "vite";

export default defineConfig({
    base: "./",
    plugins: [svelte()],
    build: {
        outDir: "dist",
        emptyOutDir: true,
        // extension pages: no inline scripts, no remote assets
        modulePreload: false,
        assetsInlineLimit: 0,
        // only ever runs in a current Chromium
        target: "chrome120",
    },
});
