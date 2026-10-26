<script lang="ts" module>
    export type Sky = "clear" | "fair" | "summer" | "overcast" | "fog" | "rain" | "thunderstorm" | "snow";

    /** WMO weather code → the closest sky preset */
    export function skyFor(code: number): Sky {
        if (code === 0) return "clear";
        if (code === 1) return "fair";
        if (code === 2) return "summer";
        if (code === 3) return "overcast";
        if (code <= 48) return "fog";
        if (code <= 67) return "rain";
        if (code <= 77) return "snow";
        if (code <= 82) return "rain";
        if (code <= 86) return "snow";
        return "thunderstorm";
    }
</script>

<script lang="ts">
    import { onMount } from "svelte";

    // The sky is @takustaqu/atmosphere (MIT): one WebGL fragment shader that draws clouds,
    // rain, snow, lightning, sun and stars for a preset and a time of day. It is loaded on
    // demand, so it costs nothing unless this wallpaper is picked.
    type Props = {
        sky?: Sky;
        /** local hour 0..24 at the place when it was read; the viewer's clock when omitted */
        hour?: number;
        /** weather changes arrive in well under a second (previews), not over a few */
        brisk?: boolean;
    };
    let { sky = "clear", hour, brisk = false }: Props = $props();

    const nowHour = () => {
        const d = new Date();
        return d.getHours() + d.getMinutes() / 60;
    };
    // the sun keeps moving while the tab stays open
    let readAt = Date.now();
    let beat = $state(0);
    $effect(() => {
        void hour;
        readAt = Date.now();
    });
    $effect(() => {
        const id = setInterval(() => document.hidden || beat++, 60_000);
        return () => clearInterval(id);
    });
    const cur = $derived.by(() => {
        void beat;
        return { sky, hour: hour === undefined ? nowHour() : (hour + (Date.now() - readAt) / 3.6e6) % 24 };
    });

    // Helium grade. The shader's photo look is pushed into Helium's deep blue: a cool tint
    // with part of the color drained, highlights bleached and the exposure pulled down by
    // daylight and by how bright the sky preset is, so Prism's light text always reads.
    // The camera faces north-west, away from the sun's path: no disc, only the glow of dusk.
    // The canvas is screened over Helium's gradient, which keeps the night navy, not black.
    const DAY_EXPOSURE: Record<Sky, number> = {
        clear: -2.5,
        fair: -2.8,
        summer: -3,
        overcast: -3.3,
        fog: -3.5,
        rain: -3.1,
        thunderstorm: -2.6,
        snow: -3.5,
    };
    const smooth = (a: number, b: number, x: number) => {
        const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
        return t * t * (3 - 2 * t);
    };
    // the library's sun rises at 6 and sets at 18
    const daylight = (h: number) => smooth(5.4, 7.5, h) * (1 - smooth(16.8, 18.6, h));
    const grade = (sky: Sky, hour: number) => ({
        weather: sky,
        time: hour,
        tone: {
            exposure: -0.4 + (DAY_EXPOSURE[sky] + 0.4) * daylight(hour),
            contrast: 1,
            knee: 0.45,
            bleach: 0.7,
        },
        filter: { amount: 1, tint: [0.55, 0.7, 1.2] as const, saturation: 0.7, lift: 0 },
        sunset: { warmth: 0.6, glow: 0.5 },
        camera: { yaw: -0.5, pitch: 0.6 },
    });

    // Sunlit dusk clouds and the like outshine the table. The light probe measures the frame
    // and the canvas fades toward the gradient under it until it is below these (linear
    // luminance). Outside the shader, so it never fights the sky's own transitions.
    const CEILING = { average: 0.013, peak: 0.028 };
    const PROBE = { grid: [6, 4] as [number, number], environment: false };
    let gain = $state(1);
    const limit = (light: import("@takustaqu/atmosphere").AtmosphereLight | null) => {
        const frame = light?.frame;
        if (!frame) return;
        const peak = Math.max(...frame.grid.cells.map((c) => c.luminance));
        const over = Math.min(CEILING.average / frame.average.luminance, CEILING.peak / peak);
        // opacity mixes display-encoded values, luminance is about their 2.2 power
        const next = Math.min(1, Math.max(0.3, over ** (1 / 2.2)));
        if (Math.abs(next - gain) > 0.03) gain = next;
    };

    let canvas: HTMLCanvasElement | undefined = $state();
    let atmosphere: import("@takustaqu/atmosphere").Atmosphere | undefined = $state();
    let ready = $state(false);

    onMount(() => {
        let gone = false;
        let instance: typeof atmosphere;
        import("@takustaqu/atmosphere").then(({ Atmosphere }) => {
            if (gone || !canvas) return;
            instance = new Atmosphere(canvas, {
                ...grade(cur.sky, cur.hour),
                fps: 30,
                animator: brisk ? { tau: 0.35 } : undefined,
                // only acts when a frame overruns its budget: weak GPUs get a softer sky
                // instead of a stuttering one
                adaptiveResolution: true,
                // know the gain before the canvas fades in. A cached shader can report
                // ready from inside the constructor, before `instance` is assigned.
                onReady: (ok) => {
                    const settle = () => {
                        if (gone || !instance) return;
                        // no WebGL or a failed shader: the gradient stays, the loop rests
                        if (!ok) instance.stop();
                        else if (!ready) {
                            instance.start();
                            limit(instance.measureLight(PROBE));
                        }
                        ready = ok;
                    };
                    if (instance) settle();
                    else queueMicrotask(settle);
                },
                lightProbe: { ...PROBE, rate: 1 },
                onLight: limit,
            });
            atmosphere = instance;
        });
        return () => {
            gone = true;
            // the canvas goes with this component, so free its GPU context now
            instance?.dispose({ loseContext: true });
        };
    });

    $effect(() => {
        atmosphere?.set(grade(cur.sky, cur.hour));
    });
</script>

<div class="sky" aria-hidden="true">
    <canvas bind:this={canvas} style:opacity={ready ? gain : 0}></canvas>
</div>

<style>
    /* Stars' colors until the shader has compiled, then the sky fades in over them */
    .sky {
        position: fixed;
        inset: 0;
        z-index: 0;
        overflow: hidden;
        isolation: isolate;
        background: linear-gradient(hsl(234 40% 14%), hsl(230 47% 29%));
    }

    canvas {
        position: absolute;
        inset: 0;
        width: 100%;
        height: 100%;
        transition: opacity 1.5s ease;
        mix-blend-mode: screen;
    }
</style>
