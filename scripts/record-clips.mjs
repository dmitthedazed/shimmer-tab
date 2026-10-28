// Short, fast-paced showcase clips (dark theme comes from the browser flags in
// record-clips.sh). Usage: node record-clips.mjs <outdir> [clip names...]
import { baseSettings as base, connect } from "./rec-lib.mjs";

const OUT = process.argv[2];
const only = process.argv.slice(3);
const r = await connect();
const { sleep } = r;
const sw = (name) => r.byText("[role=switch]", name);
const tab = (name) => r.byText("aside footer .segmented button", name);
const mode = (name) => r.byText("aside header .segmented button", name);
const stop = (name) => r.byText(".slider .labels button", name);
const bgTile = (name) => r.byText(".bg-option", name);
const seg = (name) => r.byText(".segmented button", name);
const gear = `document.querySelector('[aria-label="Settings"]')`;

const clips = {
    // jump out of hyperspace, then whip the cursor around the starfield
    async warp(dir) {
        await r.setup({ ...base, background: "stars" });
        r.start(dir);
        await r.open();
        await sleep(250);
        await r.cursor();
        await sleep(1300);
        await r.moveTo(1150, 640, 350);
        await r.moveTo(150, 120, 650);
        await r.moveTo(1180, 160, 550);
        await r.moveTo(260, 650, 600);
        await r.moveTo(640, 470, 450);
        await sleep(500);
    },

    // bangs: autocomplete → keyword chip, twice
    async bangs(dir) {
        await r.setup({ ...base, background: "shimmer" });
        r.start(dir);
        await sleep(200);
        await r.clickEl(`document.querySelector('input[type=search]')`, 450);
        await r.type("!y", 90, 120);
        await sleep(550);
        await r.key("ArrowDown", 40);
        await sleep(250);
        await r.key("Tab", 9);
        await sleep(250);
        await r.type("synthwave mix");
        await sleep(700);
        await r.clearSearch();
        await sleep(250);
        await r.type("!g", 90, 120);
        await sleep(450);
        await r.key("ArrowDown", 40);
        await sleep(220);
        await r.key("Tab", 9);
        await sleep(250);
        await r.type("imputnet/helium");
        await sleep(800);
    },

    // wallpapers back to back: stripes punch down, blobs flow in
    async wallpapers(dir) {
        await r.setup({ ...base, background: "stars" });
        await r.clickEl(gear, 200);
        await sleep(500);
        r.start(dir);
        await sleep(150);
        await r.clickEl(bgTile("Shimmer"), 380);
        await sleep(1350);
        await r.clickEl(bgTile("Stars"), 300);
        await sleep(1450);
        await r.clickEl(bgTile("Weather"), 300);
        await sleep(1600);
        await r.clickEl(bgTile("None"), 300);
        await sleep(1250);
        await r.clickEl(bgTile("Shimmer"), 300);
        await sleep(1350);
        await r.clickEl(bgTile("Stars"), 300);
        await sleep(1300);
    },

    // icons: tiles, recolor through the palette, names off and on
    async icons(dir) {
        await r.setup({ ...base, background: "stars" }, { tab: "shortcuts", advanced: true });
        await r.clickEl(gear, 200);
        await sleep(500);
        r.start(dir);
        await sleep(150);
        await r.clickEl(sw("Icons on tiles"), 380);
        await sleep(700);
        await r.clickEl(sw("One color for icons"), 350);
        await sleep(650);
        for (const color of ["Red", "Amber", "Green", "Purple", "Text", "Accent"]) {
            await r.clickEl(`document.querySelector('.swatch[aria-label="${color}"]')`, 220);
            await sleep(380);
        }
        await r.clickEl(sw("One color for icons"), 350);
        await sleep(550);
        await r.clickEl(sw("Names under icons"), 350);
        await sleep(650);
        await r.clickEl(sw("Names under icons"), 300);
        await sleep(550);
        await r.clickEl(sw("Icons on tiles"), 350);
        await sleep(700);
    },

    // settings: simple first, morph through the tabs, then Advanced opens the rest
    async settings(dir) {
        await r.setup({ ...base, background: "shimmer" });
        r.start(dir);
        await sleep(150);
        await r.clickEl(gear, 450);
        await sleep(500);
        for (const t of ["Shortcuts", "Widgets", "Search", "Data", "Widgets"]) {
            await r.clickEl(tab(t), 330);
            await sleep(430);
        }
        await r.clickEl(mode("Advanced"), 330);
        await sleep(650);
        await r.clickEl(sw("Seconds"), 350);
        await sleep(550);
        await r.clickEl(r.byText(".segmented.small button, .segmented button", "12h"), 330);
        await sleep(550);
        await r.clickEl(r.byText(".segmented.small button, .segmented button", "24h"), 300);
        await sleep(450);
        await r.clickEl(tab("Look"), 330);
        await sleep(450);
        await r.clickEl(seg("Helium"), 350);
        await sleep(600);
        await r.clickEl(seg("Greeting"), 300);
        await sleep(600);
        await r.clickEl(mode("Simple"), 330);
        await sleep(700);
        await r.click(220, 560, 450);
        await sleep(600);
    },

    // effects: Speed drops the glass and the motion, Beauty deepens it
    async effects(dir) {
        await r.setup({ ...base, background: "stars" });
        await r.clickEl(gear, 200);
        await sleep(600);
        r.start(dir);
        await sleep(300);
        await r.clickEl(stop("Speed"), 450);
        await sleep(1300);
        await r.clickEl(stop("Beauty"), 450);
        await sleep(1500);
        await r.clickEl(stop("Balanced"), 450);
        await sleep(1300);
    },

    // your own pictures fade into each other and the page takes the picture's colors
    async pictures(dir) {
        await r.setup({ ...base, background: "image" }, { pictures: 3, advanced: true });
        await r.clickEl(gear, 200);
        await sleep(700);
        r.start(dir);
        await sleep(300);
        const thumb = (i) => `document.querySelectorAll('.thumb .pick')[${i}]`;
        await r.clickEl(thumb(1), 400);
        await sleep(1400);
        await r.clickEl(thumb(2), 350);
        await sleep(1400);
        await r.clickEl(sw("Colors from picture"), 400);
        await sleep(1100);
        await r.clickEl(thumb(0), 350);
        await sleep(1500);
        await r.clickEl(thumb(1), 350);
        await sleep(1500);
    },

    // the page slides to either side, then the logo cycles greeting → wordmark → mark
    async layout(dir) {
        await r.setup({ ...base, background: "shimmer" }, { advanced: true });
        r.start(dir);
        await sleep(150);
        for (const side of ["Left", "Right", "Center"]) {
            await r.clickEl(gear, 380);
            await sleep(450);
            await r.clickEl(seg(side), 330);
            await sleep(300);
            await r.key("Escape", 27);
            await sleep(1100);
        }
        await r.clickEl(gear, 380);
        await sleep(450);
        for (const logo of ["Helium", "None", "Greeting"]) {
            await r.clickEl(seg(logo), 330);
            await sleep(650);
        }
        await r.key("Escape", 27);
        await sleep(700);
    },

    // the live sky through every kind of weather, then into the night
    async weather(dir) {
        await r.setup({ ...base, background: "weather" });
        await r.ev(`location.hash = "sky-clear-13"; location.reload()`);
        await sleep(3000);
        r.start(dir);
        await sleep(500);
        for (const sky of ["overcast-13", "rain-13", "thunderstorm-13", "snow-12", "fog-9", "fair-17", "clear-21"]) {
            await r.ev(`location.hash = "sky-${sky}"`);
            await sleep(1100);
        }
        await sleep(400);
    },

    // weather details, then focus mode strips the page to the search bar
    async focus(dir) {
        await r.setup({ ...base, background: "stars" });
        r.start(dir);
        await sleep(150);
        await r.hover(`document.querySelector('.weather')`, 500);
        await sleep(1300);
        await r.clickEl(`document.querySelector('[aria-label="Focus mode"]')`, 550);
        await sleep(1100);
        await r.clickEl(`document.querySelector('input[type=search]')`, 450);
        await r.type("helium browser");
        await sleep(600);
        await r.clearSearch();
        await r.clickEl(`document.querySelector('[aria-label="Show everything"]')`, 550);
        await sleep(1100);
    },
};

// warm-up (not recorded): icons, weather and the bang catalog get fetched and cached
await r.setup({ ...base, background: "shimmer" }, { wait: 8000 });
await r.ev(`fetch('bangs.json').then((res) => res.text())`);

for (const [name, run] of Object.entries(clips)) {
    if (only.length && !only.includes(name)) continue;
    await run(`${OUT}/${name}`);
    const n = r.stop();
    console.log(name, n, "frames");
}
process.exit(0);
