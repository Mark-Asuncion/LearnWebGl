import { Engine } from "../../engine";
import { Point3, Point4 } from "../point";
import { ShaderKey } from "../shaders/base";
import { get_shader } from "../shaders/util";
import { Node } from "./base";
import { create_buffer, set_face_data, set_vertices_data } from "../utils/gl";

export class Square extends Node {
    constructor(name: string) {
        super(name);
    }

    _create_buffer_data() {
        const f = [];
        for (let i=0;i<this.vertices.length;i++) {
            f.push(this.vertices[i].x);
            f.push(this.vertices[i].y);
            f.push(this.vertices[i].z);

            if (this.attrib.colors.length > 0) {
                f.push(this.attrib.colors[i].x);
                f.push(this.attrib.colors[i].y);
                f.push(this.attrib.colors[i].z);
                f.push(this.attrib.colors[i].w);
            }
        }
        console.debug(`_create_buffer_data ${this.id}:${this.name}: `, f);
        this.stride = 7;
        this.buffer_data = new Float32Array(f);
        const gl = Engine.gl;
        if (!this.buffer) throw new Error("Buffer is null");
        set_vertices_data(gl, this.buffer, this.buffer_data);
    }

    async init() {
        const default_shader = await get_shader(ShaderKey.Default);
        this.position.x = -2;
        this.position.z = -5;
        this.vertices = [
            // by chatgpt cause im  lazy
            // Triangle 1
            new Point3(-1,  1, 0), // top-left
            new Point3( 1,  1, 0), // top-right
            new Point3( 1, -1, 0), // bottom-right

            // Triangle 2
            new Point3(-1,  1, 0), // top-left
            new Point3( 1, -1, 0), // bottom-right
            new Point3(-1, -1, 0)  // bottom-left
        ];
        this.attrib.colors = [
            new Point4(1, 0, 0, 1),
            new Point4(0, 1, 0, 1),
            new Point4(0, 0, 1, 1),

            new Point4(1, 0, 0, 1),
            new Point4(0, 0, 1, 1),
            new Point4(0, 1, 0, 1)
        ];
        this.attrib.index = new Uint16Array([
            0, 1, 2,
            3, 4, 5
        ]);
        this.shader = default_shader;
        this.buffer = create_buffer(Engine.gl);
        this._create_buffer_data();
        this.attrib.index_buffer = create_buffer(Engine.gl)
        set_face_data(Engine.gl, this.attrib.index_buffer, this.attrib.index);
    }

    render() {
        super.render();

        let rot_speed = 60;
        this.rotation.x += Engine.delta * rot_speed;
        this.rotation.y -= Engine.delta * rot_speed;
        this.rotation.z += Engine.delta * rot_speed;

        this.shader.render(this);
    }
}
