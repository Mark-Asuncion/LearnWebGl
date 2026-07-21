"use strict";
class Perspective {
    constructor(width, height, fovy, znear, zfar) {
        this.aspect_ratio = width/height;
        this.fovy = fovy;
        this.znear = znear;
        this.zfar = zfar;
        this.matrix = new Float32Array();
        this.calculate();
    }

    calculate() {
        const fovyRadians = this.fovy * Math.PI / 180;
        const f = 1/ Math.tan(fovyRadians/2);
        const initMatrix = new Float32Array([
            this.aspect_ratio/f, 0, 0, 0,
            0, f, 0, 0,
            0, 0, -(this.zfar+this.znear)/(this.zfar-this.znear), -(2*this.zfar*this.znear)/(this.zfar-this.znear),
            0, 0, -1, 0
        ]);
        // glsl is column major matrices
        this.matrix = new Float32Array([
            initMatrix[0], initMatrix[4], initMatrix[8],initMatrix[12],
            initMatrix[1], initMatrix[5], initMatrix[9],initMatrix[13],
            initMatrix[2], initMatrix[6], initMatrix[10], initMatrix[14],
            initMatrix[3], initMatrix[7], initMatrix[11], initMatrix[15]
        ]);
        console.debug(this.matrix);
    }
}
