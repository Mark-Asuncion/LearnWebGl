import { mat4x4_to_column_major } from "../utils/matrix";
import Projection from "./base";

export default class Ortographic extends Projection {
    left: number;
    right: number;
    top: number;
    bottom: number;
    near: number;
    far: number;
    constructor(left: number, right: number, top: number, bottom: number, near: number, far: number) {
        super();
        this.left = left;
        this.right = right;
        this.top = top;
        this.bottom = bottom;
        this.near = near;
        this.far = far;
        this.calculate();
    }

    calculate() {
        const initMatrix = new Float32Array([
            2/(this.right-this.left), 0, 0, -(this.right+this.left)/(this.right-this.left),
            0, 2/(this.top-this.bottom), 0, -(this.top+this.bottom)/(this.top-this.bottom),
            0, 0, -2/(this.far-this.near), -(this.far+this.near)/(this.far-this.near),
            0, 0, 0, 1
        ]);

        this._matrix = mat4x4_to_column_major(initMatrix);
    }
}
