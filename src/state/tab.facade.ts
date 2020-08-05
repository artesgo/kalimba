// export 

import { tabStore } from "./tab.store";
import { Note } from "../models/tab/note";

/**
 * Update Store
 */
function insertNote(note: Note) {
    tabStore.update(tab => ({
        ...tab,
        notes: [...tab.notes, note]
    }));
}

function deleteNote(tine: number, position: number) {
    tabStore.update(tab => ({
        ...tab,
        notes: [...removeNote(tab.notes, tine, position)]
    }));
}

function removeNote(notes: Note[], x: number, y: number) {
    let filtered = notes.filter(note => note.x !== x || note.y !== y);
    return filtered;
}

function updateOffset(offset: number) {
    tabStore.update(tab => ({
        ...tab,
        offset: tab.offset + offset
    }));
}

function play() {
    tabStore.update(tab => ({
        ...tab,
        playing: true,
        paused: false,
        stopped: false,
        notes: [...tab.notes.map(note => {
            note.played = false;
            return note;
        })],
    }));
}

function pause() {
    tabStore.update(tab => ({
        ...tab,
        playing: false,
        paused: true,
        stopped: false,
    }));
}

function stop() {
    tabStore.update(tab => ({
        ...tab,
        playing: false,
        paused: false,
        stopped: true,
    }));
}

export {
    insertNote,
    deleteNote,
    updateOffset,
    play,
    stop,
    pause,
}