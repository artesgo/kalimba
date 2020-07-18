import { Arc2d } from "../shapes/arc2d";

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
    }
    name: string;
    tine: number;
    line: number;
    duration: number;
    x: number;
    y: number;
    radius: number;
    interactive: boolean;
}
  