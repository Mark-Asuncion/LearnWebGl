export default class Projection {
    _matrix: Float32Array<ArrayBuffer>;
    constructor() {
        this._matrix = new Float32Array();
    }
    calculate() {}
    matrix() { return this._matrix; }
}
