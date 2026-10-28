// One "Undo" at a time for things that are easy to lose by a slip: a removed shortcut,
// folder or picture, a reset or an imported backup. App.svelte shows it as a small toast.
const TIME = 8000;

export const undo = $state<{ text: string; restore: (() => unknown) | null; id: number }>({ text: "", restore: null, id: 0 });

let timer: ReturnType<typeof setTimeout> | undefined;

/** shows `text` with an Undo button that runs `restore` (replacing an older offer) */
export function offerUndo(text: string, restore: () => unknown) {
    clearTimeout(timer);
    undo.text = text;
    undo.restore = restore;
    undo.id++;
    timer = setTimeout(dropUndo, TIME);
}

export function dropUndo() {
    clearTimeout(timer);
    undo.restore = null;
}

export function runUndo() {
    const restore = undo.restore;
    dropUndo();
    restore?.();
}

/** the toast stays while the pointer or focus is on it */
export function holdUndo(hold: boolean) {
    clearTimeout(timer);
    if (!hold && undo.restore) timer = setTimeout(dropUndo, TIME / 2);
}
