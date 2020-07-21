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

export function updateOffset(offset: number) {
    tabStore.update(tab => ({
        ...tab,
        offset: tab.offset + offset
    }));
}

export function play() {
    tabStore.update(tab => ({
        ...tab,
        playing: true,
        paused: false,
    }));
}

export function pause() {
    tabStore.update(tab => ({
        ...tab,
        playing: false,
        paused: true,
    }));
}

export function stop() {
    tabStore.update(tab => ({
        ...tab,
        playing: false,
        paused: false,
    }));
}