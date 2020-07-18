// export 

import { tabStore } from "./tab.store";
import { Note } from "../models/tab/note";

export function insertNote(note: Note) {
    console.log('insert', note)
    tabStore.update(tab => ({
        ...tab,
        notes: [...tab.notes, note]
    }));
}