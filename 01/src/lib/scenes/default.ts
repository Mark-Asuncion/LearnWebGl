import { Scene } from "./base";
import Perspective from "../projection/perspective";
import { Point3 } from "../point";
import { Engine } from "../../engine";
import { Triangle } from "../node/triangle";
import { Square } from "../node/square";

export class DefaultScene extends Scene {
    constructor() {
        super("DefaultScene");
        const canvas_rect = new Point3(Engine.gl.canvas.width, Engine.gl.canvas.height, 0);
        this.projection = new Perspective(canvas_rect.x, canvas_rect.y, 90, 0.1, 100);
    }

    async init() {
        super.init();
        const triangle = new Triangle("triangle");
        await triangle.init();

        const square = new Square("triangle");
        await square.init();

        this.nodes.push(triangle, square);

        Engine.gl.enable(Engine.gl.CULL_FACE);
        Engine.gl.cullFace(Engine.gl.BACK);
        Engine.gl.frontFace(Engine.gl.CW);
    }

    render() {
        super.render();
        Engine.gl.clearColor(0.1, 0.1, 0.1, 1.0);
        Engine.gl.clear(Engine.gl.COLOR_BUFFER_BIT);

        this.nodes.forEach(el => {
            el.render();
        });
    }
}
