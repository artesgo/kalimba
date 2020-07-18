import { Object2d } from "./object2d";

export class Rect2d extends Object2d {
    constructor(x, y, width, height, interactive) {
        super(x, y, interactive);
        this.width = width;
        this.height = height;
    }
    width: number;
    height: number;

    get points() {
        return {
            a: this.x,
            b: this.y,
            c: this.x + this.width,
            d: this.x + this.width + this.height,
            center: {
                x: this.x + (this.width / 2),
                y: this.y + (this.height / 2)
            }
        }
    }
}