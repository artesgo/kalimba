import { tabStore } from "./tab.store";
import { derived } from "svelte/store";
import type { Note } from "../models/tab/note";

// you could think of these as selectors
export const totalNotes = derived(
    tabStore,
    $tab => $tab.notes.length
);

export const notes = derived(
    tabStore,
    $tabStore => $tabStore.notes
);

export const offset = derived(
    tabStore,
    $tabStore => $tabStore.offset
);

export const playback = derived(
    tabStore,
    $tabStore => {
        return {
            playing: $tabStore.playing,
            paused: $tabStore.paused,
            stopped: $tabStore.stopped,
            duration: getDuration($tabStore.notes),
            tempo: $tabStore.tempo,
            offset: $tabStore.offset,
        }
    }
);

function getDuration(notes: Note[]) {
    if (notes.length > 1) {
        const sorted = notes.sort((a, b) => (b.y - a.y));
        const [first, ...rest] = sorted;
        const [last, ...other] = rest.reverse();
        return first.y - last.y;
    }
    return 0;
}