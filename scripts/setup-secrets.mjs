// Reads secrets.env, gets a Chrome Web Store refresh token if there isn't one yet (you sign
// in to Google in the browser, the token is written back into secrets.env), then stores every
// filled-in value as a GitHub Actions secret. Usage: node scripts/setup-secrets.mjs
import { spawn, spawnSync } from "node:child_process";
import { readFileSync, writeFileSync } from "node:fs";
import { createServer } from "node:http";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const FILE = join(dirname(fileURLToPath(import.meta.url)), "..", "secrets.env");
const REPO = "dmitthedazed/shimmer-tab";
const SCOPE = "https://www.googleapis.com/auth/chromewebstore";

const read = () =>
    Object.fromEntries(
        readFileSync(FILE, "utf8")
            .split("\n")
            .filter((line) => /^[A-Z_]+=/.test(line))
            .map((line) => [line.slice(0, line.indexOf("=")), line.slice(line.indexOf("=") + 1).trim()]),
    );

const env = read();

if (!env.CWS_REFRESH_TOKEN && env.CWS_CLIENT_ID && env.CWS_CLIENT_SECRET) {
    env.CWS_REFRESH_TOKEN = await refreshToken(env.CWS_CLIENT_ID, env.CWS_CLIENT_SECRET);
    const text = readFileSync(FILE, "utf8").replace(/^CWS_REFRESH_TOKEN=.*$/m, `CWS_REFRESH_TOKEN=${env.CWS_REFRESH_TOKEN}`);
    writeFileSync(FILE, text);
    console.log("Refresh token saved to secrets.env");
}

for (const [name, value] of Object.entries(env)) {
    if (!value) {
        console.log(`skip ${name} (empty)`);
        continue;
    }
    // the value goes in on stdin, so it never shows up in the process list
    const res = spawnSync("gh", ["secret", "set", name, "-R", REPO], { input: value, stdio: ["pipe", "inherit", "inherit"] });
    console.log(res.status === 0 ? `set ${name}` : `FAILED ${name}`);
}

/** OAuth for an installed app: a one-shot server on localhost catches Google's redirect. */
function refreshToken(clientId, clientSecret) {
    return new Promise((resolve, reject) => {
        const server = createServer(async (req, res) => {
            const url = new URL(req.url, "http://localhost");
            const code = url.searchParams.get("code");
            if (!code) {
                res.end("No code in the redirect: " + (url.searchParams.get("error") ?? "unknown error"));
                return;
            }
            try {
                const token = await fetch("https://oauth2.googleapis.com/token", {
                    method: "POST",
                    body: new URLSearchParams({
                        code,
                        client_id: clientId,
                        client_secret: clientSecret,
                        redirect_uri: redirect,
                        grant_type: "authorization_code",
                    }),
                }).then((r) => r.json());
                if (!token.refresh_token) throw new Error(token.error_description ?? token.error ?? "no refresh token");
                res.end("Done, you can close this tab.");
                resolve(token.refresh_token);
            } catch (e) {
                res.end(`Failed: ${e.message}`);
                reject(e);
            } finally {
                server.close();
            }
        });
        let redirect = "";
        server.listen(0, "127.0.0.1", () => {
            redirect = `http://127.0.0.1:${server.address().port}`;
            const consent = new URL("https://accounts.google.com/o/oauth2/v2/auth");
            consent.search = new URLSearchParams({
                client_id: clientId,
                redirect_uri: redirect,
                response_type: "code",
                scope: SCOPE,
                access_type: "offline",
                prompt: "consent",
            }).toString();
            console.log(`Sign in to Google to allow Chrome Web Store uploads:\n${consent}\n`);
            spawn("xdg-open", [consent.toString()], { stdio: "ignore", detached: true }).on("error", () => {});
        });
    });
}
