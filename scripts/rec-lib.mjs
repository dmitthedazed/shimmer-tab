// Shared CDP helpers for recording showcase clips of the new tab page.
// The browser must run with --remote-debugging-port=9333 (see record-clips.sh).
import { mkdirSync, writeFileSync } from "node:fs";

export async function connect() {
    const targets = await (await fetch("http://127.0.0.1:9333/json/list")).json();
    const ws = new WebSocket(targets.find((t) => t.type === "page").webSocketDebuggerUrl);
    await new Promise((r) => ws.addEventListener("open", r, { once: true }));

    let id = 0;
    const pending = new Map();
    let sink = null; // where screencast frames go while recording

    const send = (method, params = {}) =>
        new Promise((r) => {
            const i = ++id;
            pending.set(i, r);
            ws.send(JSON.stringify({ id: i, method, params }));
        });

    ws.addEventListener("message", (e) => {
        const m = JSON.parse(e.data);
        if (m.id && pending.has(m.id)) {
            pending.get(m.id)(m);
            pending.delete(m.id);
        } else if (m.method === "Page.screencastFrame") {
            send("Page.screencastFrameAck", { sessionId: m.params.sessionId });
            if (!sink) return;
            const n = sink.times.length;
            writeFileSync(`${sink.dir}/${String(n).padStart(5, "0")}.jpg`, Buffer.from(m.params.data, "base64"));
            sink.times.push(m.params.metadata.timestamp);
        }
    });

    const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
    const ev = async (expression) =>
        (await send("Runtime.evaluate", { expression, returnByValue: true, awaitPromise: true })).result?.result
            ?.value;

    await send("Page.enable");
    await send("Page.startScreencast", { format: "jpeg", quality: 92, everyNthFrame: 1 });

    let mx = 1130, my = 630;
    const ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

    const api = {
        send,
        sleep,
        ev,

        /** Starts collecting frames into `dir`. */
        start(dir) {
            mkdirSync(dir, { recursive: true });
            sink = { dir, times: [] };
        },
        /** Stops and writes timestamps.json next to the frames. */
        stop() {
            const s = sink;
            sink = null;
            writeFileSync(`${s.dir}/timestamps.json`, JSON.stringify(s.times));
            return s.times.length;
        },

        async open(url = "chrome://newtab/") {
            await send("Page.navigate", { url: "about:blank" });
            await sleep(200);
            await send("Page.navigate", { url });
        },

        /** Applies settings through the extension's own storage, then reloads. */
        async setup(settings, { tab = "look", wait = 3000 } = {}) {
            // storage is only reachable from the extension's own page
            if (!(await ev("location.protocol")).startsWith("chrome-extension")) {
                await api.open();
                await sleep(2000);
            }
            await ev(`(async () => {
                await chrome.storage.sync.set({ settings: ${JSON.stringify(settings)} });
                localStorage.setItem('settings-mirror', ${JSON.stringify(JSON.stringify(settings))});
                localStorage.setItem('settings-tab', ${JSON.stringify(tab)});
                localStorage.removeItem('svgl-rest'); // a hiccup must not cost a whole run its logos
            })()`);
            await api.open();
            await sleep(wait);
            await api.cursor();
        },

        /** Draws a cursor into the page so it shows up in the capture. */
        async cursor() {
            await ev(`(() => {
              if (document.getElementById('demo-cursor')) return;
              const c = document.createElement('div');
              c.id = 'demo-cursor';
              const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
              svg.setAttribute('width', '26'); svg.setAttribute('height', '30'); svg.setAttribute('viewBox', '0 0 26 30');
              const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
              path.setAttribute('d', 'M3 2 L3 24 L9 18.5 L13.2 27.5 L17 25.8 L12.9 17 L21 17 Z');
              path.setAttribute('fill', '#fff'); path.setAttribute('stroke', '#111');
              path.setAttribute('stroke-width', '1.6'); path.setAttribute('stroke-linejoin', 'round');
              svg.appendChild(path);
              const ring = document.createElement('span');
              c.append(svg, ring);
              Object.assign(c.style, { position: 'fixed', left: '0', top: '0', zIndex: 2147483647, pointerEvents: 'none',
                filter: 'drop-shadow(0 2px 4px rgb(0 0 0 / .45))', opacity: '0', translate: '${mx - 3}px ${my - 2}px' });
              Object.assign(ring.style, { position: 'absolute', left: '-14px', top: '-14px', width: '34px', height: '34px',
                borderRadius: '50%', background: 'rgb(255 255 255 / .4)', scale: '0', opacity: '0' });
              document.documentElement.appendChild(c);
              addEventListener('mousemove', (e) => { c.style.opacity = '1'; c.style.translate = (e.clientX - 3) + 'px ' + (e.clientY - 2) + 'px'; }, true);
              addEventListener('mousedown', () => {
                ring.style.transition = 'none'; ring.style.scale = '.3'; ring.style.opacity = '1';
                requestAnimationFrame(() => { ring.style.transition = 'scale .3s cubic-bezier(.2,.8,.2,1), opacity .4s'; ring.style.scale = '1'; ring.style.opacity = '0'; });
              }, true);
            })()`);
        },

        async moveTo(x, y, ms = 450) {
            const sx = mx, sy = my;
            const cx = (sx + x) / 2 + (y - sy) * 0.12, cy = (sy + y) / 2 - (x - sx) * 0.12;
            const steps = Math.max(2, Math.round(ms / 16));
            for (let i = 1; i <= steps; i++) {
                const t = ease(i / steps);
                const px = (1 - t) * (1 - t) * sx + 2 * (1 - t) * t * cx + t * t * x;
                const py = (1 - t) * (1 - t) * sy + 2 * (1 - t) * t * cy + t * t * y;
                await send("Input.dispatchMouseEvent", { type: "mouseMoved", x: px, y: py });
                await sleep(16);
            }
            mx = x;
            my = y;
        },

        async click(x, y, ms = 420) {
            await api.moveTo(x, y, ms);
            await sleep(50);
            await send("Input.dispatchMouseEvent", { type: "mousePressed", x, y, button: "left", clickCount: 1 });
            await sleep(50);
            await send("Input.dispatchMouseEvent", { type: "mouseReleased", x, y, button: "left", clickCount: 1 });
        },

        async center(js) {
            const r = await ev(`(() => { const el = ${js}; if (!el) return null; const b = el.getBoundingClientRect(); return [b.x + b.width / 2, b.y + b.height / 2]; })()`);
            if (!r) throw new Error("not found: " + js);
            return r;
        },

        byText: (sel, text) =>
            `[...document.querySelectorAll(${JSON.stringify(sel)})].find(e => e.innerText.trim().startsWith(${JSON.stringify(text)}))`,

        async clickEl(js, ms) {
            const [x, y] = await api.center(js);
            await api.click(x, y, ms);
        },

        async hover(js, ms) {
            const [x, y] = await api.center(js);
            await api.moveTo(x, y, ms);
        },

        async type(text, min = 40, max = 85) {
            for (const ch of text) {
                await send("Input.dispatchKeyEvent", { type: "keyDown", key: ch, text: ch });
                await send("Input.dispatchKeyEvent", { type: "keyUp", key: ch });
                await sleep(min + Math.random() * (max - min));
            }
        },

        async key(k, vk) {
            await send("Input.dispatchKeyEvent", { type: "rawKeyDown", key: k, code: k, windowsVirtualKeyCode: vk });
            await send("Input.dispatchKeyEvent", { type: "keyUp", key: k, code: k, windowsVirtualKeyCode: vk });
        },

        async clearSearch() {
            await api.key("Escape", 27);
            await ev(`document.querySelector('input[type=search]').select()`);
            await api.key("Backspace", 8);
        },
    };
    return api;
}

export const baseSettings = {
    background: "stars",
    clock: true,
    hour12: false,
    seconds: false,
    browserTheme: false,
    bangs: true,
    logo: "greeting",
    align: "center",
    quiet: false,
    intro: true,
    shortcuts: true,
    lockShortcuts: false,
    shortcutTitles: true,
    iconTint: false,
    tintColor: "accent",
    iconStyle: "plain",
    links: [
        { title: "GitHub", url: "https://github.com/" },
        { title: "YouTube", url: "https://www.youtube.com/" },
        { title: "Reddit", url: "https://www.reddit.com/" },
        { title: "X", url: "https://x.com/" },
        { title: "Discord", url: "https://discord.com/" },
        { title: "Spotify", url: "https://open.spotify.com/" },
        { title: "Figma", url: "https://www.figma.com/" },
        { title: "ChatGPT", url: "https://chatgpt.com/" },
    ],
    topSites: false,
    weather: true,
    city: "Berlin",
    fahrenheit: false,
};
