import { Point3, Point4 } from "../point";
import type Shader from "../shaders/base";

export class VertexAttributes {
    colors: Point4[];
    faces: number[];

    constructor() {
        this.colors = [];
        this.faces = [];
    }
}

export class Node {
    id: string;
    name: string;
    parent: Node;

    origin: Point3;
    position: Point3;
    rotation: Point3;

    vertices: Point3[];
    attrib: VertexAttributes;

    buffer?: WebGLBuffer;
    buffer_data?: Float32Array;

    shader?: Shader;
    stride: number;

    constructor(name: string) {
        this.id = crypto.randomUUID();
        this.name = name;
        this.parent = null;
        this.origin = new Point3(0,0,0);
        this.position = new Point3(0,0,0);
        this.rotation = new Point3(0,0,0);

        this.vertices = [];
        this.attrib = new VertexAttributes();
        this.buffer = null;
        this.stride = 0;

        this.shader = null;
        this.buffer_data = null;
    }

    async init() { }
    render() { }
}
