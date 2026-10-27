<script lang="ts">
    import { Toggle } from "@imput/helium-prism";

    // A toggle for an option that needs an optional permission, asked for when it goes on.
    // `request` runs straight from the click (Chrome only prompts during a user gesture);
    // a refusal flips the toggle back unless `keep` (the option still works without it).
    type Props = {
        checked: boolean;
        name: string;
        desc?: string;
        request?: () => Promise<boolean>;
        /** runs when it goes off, to give the permission back */
        release?: () => void;
        keep?: boolean;
        onchange?: (on: boolean) => void;
    };

    let { checked = $bindable(), name, desc, request, release, keep = false, onchange }: Props = $props();
</script>

<Toggle
    bind:checked
    {name}
    {desc}
    onchange={(on) => {
        onchange?.(on);
        if (!on) return release?.();
        const asked = request?.();
        if (asked && !keep) asked.then((ok) => ok || (checked = false));
    }}
/>
