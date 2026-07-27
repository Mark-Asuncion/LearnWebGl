import { Point3 } from "../point";
import type Shader from "../shaders/base";
import { VertexAttributes, type Renderable } from "../utils/types";

export class Node implements Renderable {
    id: string;
    name: string;
    parent: Node;

    vertices: Point3[];
    stride: number;
    attrib: VertexAttributes;

    origin: Point3;
    position: Point3;
    rotation: Point3;
    scale: Point3

    buffer?: WebGLBuffer;
    buffer_data?: Float32Array;

    shader?: Shader;

    constructor(name: string) {
        this.id = crypto.randomUUID();
        this.name = name;
        this.parent = null;
        this.origin = new Point3(0,0,0);
        this.position = new Point3(0,0,0);
        this.rotation = new Point3(0,0,0);
        this.scale = new  Point3(1,1,1);

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
