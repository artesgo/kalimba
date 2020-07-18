import { Object2d } from "./object2d";

export class Arc2d extends Object2d {
    constructor(x, y, radius, interactive) {
        super(x, y, interactive);
        this.radius = radius
    }
    radius: number;
}