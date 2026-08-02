import { Scene } from "./base";
import Perspective from "../projection/perspective";
import { Point3 } from "../point";
import { Engine } from "../../engine";
import { Triangle } from "../node/triangle";
import { Square } from "../node/square";
import { Cube } from "../node/cube";
import { Gizmo } from "../node/gizmo";

export class DefaultScene extends Scene {
    gizmo: Gizmo;
    constructor() {
        super("DefaultScene");
        const canvas_rect = new Point3(Engine.gl.canvas.width, Engine.gl.canvas.height, 0);
        this.projection = new Perspective(canvas_rect.x, canvas_rect.y, 90, 0.1, 100);
        // const aspect_ratio = canvas_rect.x / canvas_rect.y;
        // this.projection = new Ortographic(-aspect_ratio, aspect_ratio, 1, -1, -10, 10);
    }

    async init() {
        super.init();
        const triangle = new Triangle("triangle");
        await triangle.init();

        const square = new Square("square");
        await square.init();

        const cube = new Cube("cube1");
        await cube.init();
        const cube2 = new Cube("cube2");
        await cube2.init();
        const cube3 = new Cube("cube2");
        await cube3.init();

        const gizmo = new Gizmo("Gizmo");
        await gizmo.init();
        this.gizmo = gizmo;

        // Closest (should appear in front)
        cube.position.x = 0;
        cube.position.y = 0;
        cube.position.z = -5;
        cube.scale.x = 1;
        cube.scale.y = 1;
        cube.scale.z = 1;

        // Middle
        cube2.position.x = -1;
        cube2.position.y = 0;
        cube2.position.z = -7;
        cube2.rotation.x = 45;
        cube2.rotation.y = 45;

        // Farthest
        cube3.position.x = 0;
        cube3.position.y = -1;
        cube3.scale.x = 0.5;
        cube3.scale.y = 0.5;
        cube3.scale.z = 0.5;
        cube3.position.z = -3;
        cube3.rotation.x = 175;

        // this.nodes.push(triangle, square, cube);
        // this.nodes.push(cube, cube2, cube3);
        this.nodes.push(cube, gizmo);

        Engine.gl.enable(Engine.gl.CULL_FACE);
        Engine.gl.cullFace(Engine.gl.BACK);
        Engine.gl.frontFace(Engine.gl.CW);

        // depth testing
        Engine.gl.enable(Engine.gl.DEPTH_TEST);
        Engine.gl.depthFunc(Engine.gl.LESS);
    }

    render() {
        super.render();
        Engine.gl.clearColor(0.1, 0.1, 0.1, 1.0);
        Engine.gl.clear(Engine.gl.COLOR_BUFFER_BIT | Engine.gl.DEPTH_BUFFER_BIT);

        this.gizmo.position = new Point3(
            this.nodes[0].pivot.x,
            this.nodes[0].pivot.y,
            this.nodes[0].position.z
        );
        // this.gizmo.rotation = this.nodes[0].rotation;
        // this.gizmo.pivot = this.nodes[0].pivot;

        this.nodes.forEach(el => {
            el.render();
        });
    }
}
