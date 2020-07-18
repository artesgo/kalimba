import { tabStore } from "./tab.store";
import { derived } from "svelte/store";

// you could think of these as selectors
export const totalNotes = derived(
    tabStore,
    $tab => $tab.notes.length
);

export const progress = derived(
    tabStore,
    $tabStore => {
        if ($tabStore.notes.length > 0) {
            $tabStore.current / $tabStore.notes.length
        }
        return 0;
    }
);

export const notes = derived(
    tabStore,
    $tabStore => $tabStore.notes
);