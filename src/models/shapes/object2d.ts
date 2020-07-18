export class Object2d {
    constructor(x, y, interactive: boolean) {
        this.interactive = interactive;
        this.x = x;
        this.y = y;
    }
    interactive: boolean;
    x: number;
    y: number;
}