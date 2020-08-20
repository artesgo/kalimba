import type { Arc2d } from "../shapes/arc2d";
import { play } from "../../utils/audio";

export class Note implements Arc2d {
    constructor(
        x: number,
        y: number,
        radius: number,
        interactive: boolean,
    ) {
        this.x = x, this.y = y;
        this.radius = radius;
        this.interactive = interactive;
        this.id = Note._id++;
    }
    static _id: number = 0;
    id: number;
    name: string;
    tine: number;
    line: number;
    duration: number;
    x: number;
    y: number;
    radius: number;
    interactive: boolean;
    play() {
        play(this.name);
    };
    played: boolean;
}
