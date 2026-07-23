import { mat4x4_to_column_major } from "../utils/matrix";
import Projection from "./base";

export default class Perspective extends Projection {
    aspect_ratio: number;
    fovy: number;
    znear: number;
    zfar: number;
    constructor(width: number, height: number, fovy: number, znear: number, zfar: number) {
        super();
        this.aspect_ratio = width/height;
        this.fovy = fovy;
        this.znear = znear;
        this.zfar = zfar;
        this.calculate();
    }

    calculate() {
        const fovyRadians = this.fovy * Math.PI / 180;
        const f = 1/Math.tan(fovyRadians/2);
        const initMatrix = new Float32Array([
            f/this.aspect_ratio, 0, 0, 0,
            0, f, 0, 0,
            0, 0, -(this.zfar+this.znear)/(this.zfar-this.znear), -(2*this.zfar*this.znear)/(this.zfar-this.znear),
            0, 0, -1, 0
        ]);

        this._matrix = mat4x4_to_column_major(initMatrix);
    }
}
