// One row of the README's settings picture: the settings panel on each tab, cropped to the
// bottom-right corner. Usage: node settings-shots.mjs <outdir> <dark|light>
import { writeFileSync } from "node:fs";
import { baseSettings as base, connect } from "./rec-lib.mjs";

const [OUT, theme] = process.argv.slice(2);
const r = await connect();
const { sleep } = r;
const gear = `document.querySelector('[aria-label="Settings"]')`;
const tab = (name) => r.byText("aside footer .segmented button", name);

await r.setup({ ...base, background: "shimmer" }, { wait: 6000 });
await r.clickEl(gear, 200);
await sleep(900);
await r.ev(`document.getElementById('demo-cursor')?.style.setProperty('display', 'none')`);
const [width, height] = await r.ev("[innerWidth, innerHeight]");

for (const [i, name] of ["Look", "Shortcuts", "Widgets", "Search"].entries()) {
    await r.ev(`(${tab(name)}).click()`);
    await sleep(900);
    const clip = { x: width - 440, y: height - 640, width: 440, height: 640, scale: 1 };
    const res = await r.send("Page.captureScreenshot", { format: "png", clip });
    writeFileSync(`${OUT}/${theme}-${i}.png`, Buffer.from(res.result.data, "base64"));
}
process.exit(0);
