import type { Note } from "./note";

export class Tab {
    tempo: number;
    name: string;
    author: string;
    notes: Note[];
    offset: number;
    playing: boolean;
    paused: boolean;
    stopped: boolean;
}
