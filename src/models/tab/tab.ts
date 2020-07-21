import { Note } from "./note";

export class Tab {
    tempo: number;
    name: string;
    author: string;
    notes: Note[];
    current: number;
    offset: number;
    playing: boolean;
    paused: boolean;
}
