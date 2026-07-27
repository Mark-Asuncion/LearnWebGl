import type { Point3, Point4 } from "../point";

export interface Renderable {
    origin: Point3;
    vertices: Point3[];
    stride: number;
    attrib: VertexAttributes;

    position: Point3;
    rotation: Point3;
    scale: Point3;

    buffer?: WebGLBuffer;
    buffer_data?: Float32Array;
}

export class VertexAttributes {
    colors: Point4[];
    index:number[];
    index_buffer?: WebGLBuffer;

    constructor() {
        this.colors = [];
        this.index = [];
    }
}

