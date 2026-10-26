<script lang="ts" module>
    // the entrance plays once per page, not every time you switch back to the stars
    let introPlayed = false;
</script>

<script lang="ts">
    import { onMount } from "svelte";
    import { trackPointer } from "./pointer";

    // Starfield after ErrorZeros' Helium New Tab.
    // starSize compensates for previews that are scaled down.
    type Props = { preview?: boolean; starSize?: number; intro?: boolean; onintro?: () => void };
    let { preview = false, starSize = 1, intro = false, onintro }: Props = $props();

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const playing = intro && !preview && !introPlayed && !reduce;
    if (playing) introPlayed = true;

    let warp: HTMLCanvasElement | undefined = $state();

    onMount(() => (preview ? undefined : trackPointer()));

    // Entrance: dropping out of hyperspace. Streaks fly out of the center and brake,
    // a flash marks the arrival, then the starfield settles in from the depth.
    const WARP = 550;
    onMount(() => {
        if (!playing || !warp) return;
        const canvas = warp;
        const ctx = canvas.getContext("2d")!;
        const dpr = Math.min(devicePixelRatio || 1, 2);
        const w = innerWidth, h = innerHeight;
        canvas.width = w * dpr;
        canvas.height = h * dpr;
        ctx.scale(dpr, dpr);
        const cx = w / 2, cy = h / 2;
        const focal = Math.max(w, h) * 0.6;
        const stars = Array.from({ length: 420 }, () => ({
            x: (Math.random() - 0.5) * w * 2.2,
            y: (Math.random() - 0.5) * h * 2.2,
            z: Math.random() * 1000 + 50,
            hue: 220 + Math.random() * 40,
        }));
        const start = performance.now();
        let last = start, frame = 0;

        const draw = (now: number) => {
            const t = Math.min(1, (now - start) / WARP);
            const dt = Math.min(48, now - last);
            last = now;
            // speed: full warp, then a hard brake towards the end
            const speed = 3.2 * Math.pow(1 - t, 2.2) + 0.02;
            ctx.clearRect(0, 0, w, h);
            // deep space dark that lifts as we arrive
            ctx.fillStyle = `rgba(4, 6, 16, ${0.92 * (1 - t) ** 1.5})`;
            ctx.fillRect(0, 0, w, h);
            ctx.lineCap = "round";
            for (const s of stars) {
                const pz = s.z;
                s.z -= speed * dt;
                if (s.z < 1) {
                    s.z = 1000;
                    continue;
                }
                const x = (s.x / s.z) * focal + cx, y = (s.y / s.z) * focal + cy;
                const px = (s.x / pz) * focal + cx, py = (s.y / pz) * focal + cy;
                const near = 1 - s.z / 1050;
                ctx.strokeStyle = `hsla(${s.hue}, 90%, ${78 + near * 20}%, ${Math.min(1, near * 1.6) * (1 - t * 0.85)})`;
                ctx.lineWidth = 0.6 + near * 2.2;
                ctx.beginPath();
                ctx.moveTo(px, py);
                ctx.lineTo(x, y);
                ctx.stroke();
            }
            if (t < 1) frame = requestAnimationFrame(draw);
        };
        frame = requestAnimationFrame(draw);
        const done = setTimeout(() => onintro?.(), WARP * 0.65);
        return () => {
            cancelAnimationFrame(frame);
            clearTimeout(done);
        };
    });
</script>

<div class={["stars", preview && "preview", playing && "arrive"]} style:--star-size={starSize} aria-hidden="true"></div>
{#if !preview}
    <!-- a sparse, brighter layer "closer" to you: moves more with the cursor (parallax) -->
    <div class={["near", playing && "arrive-near"]} aria-hidden="true"></div>
{/if}
{#if playing}
    <canvas bind:this={warp} class="warp" aria-hidden="true"></canvas>
    <div class="flash" aria-hidden="true"></div>
{/if}

<style>
    /* the tiles live on ::before, which drifts by transform: the compositor moves it
       instead of the page repainting a full-screen background every frame */
    .stars {
        --star: var(--star-color, #ffffff);
        --k: var(--star-size, 1);
        position: fixed;
        inset: 0;
        z-index: 0;
        overflow: hidden;
        background: linear-gradient(
            var(--stars-top, hsl(234 40% 14%)),
            var(--stars-bottom, hsl(230 47% 29%))
        );
    }

    .stars::before {
        content: "";
        position: absolute;
        inset: 0 -350px 0 0;
        background:
            radial-gradient(calc(1px * var(--k)) calc(1px * var(--k)) at 20px 30px, var(--star), transparent),
            radial-gradient(calc(1.5px * var(--k)) calc(1.5px * var(--k)) at 70px 150px, var(--star), transparent),
            radial-gradient(calc(1px * var(--k)) calc(1px * var(--k)) at 120px 80px, var(--star), transparent),
            radial-gradient(calc(2px * var(--k)) calc(2px * var(--k)) at 200px 220px, var(--star), transparent),
            radial-gradient(calc(1.5px * var(--k)) calc(1.5px * var(--k)) at 280px 60px, var(--star), transparent),
            radial-gradient(calc(1px * var(--k)) calc(1px * var(--k)) at 310px 180px, var(--star), transparent);
        background-size: 350px 350px;
        animation: drift 20s linear infinite;
    }

    /* settings tile: a still frame */
    .stars.preview {
        position: absolute;
    }

    .stars.preview::before {
        animation: none;
    }

    /* parallax: the far field drifts a little against the cursor, the near one more */
    .stars:not(.preview) {
        inset: -24px;
        translate: calc(var(--mx, 0) * -10px) calc(var(--my, 0) * -10px);
    }

    .near {
        --star: var(--star-color, #ffffff);
        position: fixed;
        inset: -60px;
        z-index: 0;
        overflow: hidden;
        pointer-events: none;
        opacity: 0.85;
        translate: calc(var(--mx, 0) * -32px) calc(var(--my, 0) * -32px);
    }

    .near::before {
        content: "";
        position: absolute;
        inset: 0 -600px 0 0;
        background:
            radial-gradient(2.5px 2.5px at 60px 90px, var(--star), transparent),
            radial-gradient(2px 2px at 410px 260px, var(--star), transparent),
            radial-gradient(3px 3px at 230px 470px, var(--star), transparent),
            radial-gradient(2px 2px at 520px 40px, var(--star), transparent);
        background-size: 600px 560px;
        animation: drift-near 34s linear infinite;
    }

    @keyframes drift-near {
        to {
            transform: translateX(-600px);
        }
    }

    .arrive-near {
        animation: arrive 0.7s cubic-bezier(0.16, 1, 0.3, 1) 0.3s both;
    }

    @media (prefers-reduced-motion: reduce) {
        .near::before {
            animation: none;
        }
    }

    /* the field settles in from the depth once the warp brakes */
    .arrive {
        animation: arrive 0.7s cubic-bezier(0.16, 1, 0.3, 1) 0.3s both;
    }

    @keyframes arrive {
        from {
            opacity: 0;
            scale: 1.35;
            filter: brightness(2.2);
        }
    }

    .warp {
        position: fixed;
        inset: 0;
        z-index: 0;
        width: 100vw;
        height: 100vh;
        pointer-events: none;
        animation: warp-out 0.3s ease 0.4s both;
    }

    @keyframes warp-out {
        to {
            opacity: 0;
        }
    }

    /* arrival flash */
    .flash {
        position: fixed;
        top: 50%;
        left: 50%;
        z-index: 0;
        width: 140vmax;
        height: 140vmax;
        border-radius: 50%;
        background: radial-gradient(
            circle,
            rgb(214 224 255 / 0.9) 0%,
            rgb(140 160 255 / 0.35) 18%,
            rgb(80 100 220 / 0.08) 40%,
            transparent 62%
        );
        pointer-events: none;
        translate: -50% -50%;
        opacity: 0;
        animation: flash 0.55s cubic-bezier(0.2, 0.8, 0.2, 1) 0.3s both;
    }

    @keyframes flash {
        0% {
            opacity: 0;
            scale: 0.05;
        }
        18% {
            opacity: 1;
        }
        100% {
            opacity: 0;
            scale: 1;
        }
    }

    @keyframes drift {
        to {
            transform: translateX(-350px);
        }
    }

    @media (prefers-reduced-motion: reduce) {
        .stars::before {
            animation: none;
        }
    }
</style>
