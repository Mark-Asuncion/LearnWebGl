import { Engine } from "../../engine";
import { Point3, Point4 } from "../point";
import { ShaderKey } from "../shaders/base";
import { get_shader } from "../shaders/util";
import { Node } from "./base";
import { create_buffer, set_face_data, set_vertices_data } from "../utils/gl";

export class Triangle extends Node {
    speed: number;
    orig_pos: Point3;
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
        this.position.x = 2;
        this.position.z = -5;
        this.vertices = [
            new Point3(0,  1, 0),
            new Point3(1, -1, 0),
            new Point3(-1, -1, 0),
        ];
        this.attrib.colors = [
            new Point4(1, 0, 0, 1),
            new Point4(0, 1, 0, 1),
            new Point4(0, 0, 1, 1)
        ];
        this.attrib.index = new Uint16Array([
            0, 1, 2
        ]);
        this.shader = default_shader;
        this.buffer = create_buffer(Engine.gl);
        this._create_buffer_data();
        this.attrib.index_buffer = create_buffer(Engine.gl);
        set_face_data(Engine.gl, this.attrib.index_buffer, this.attrib.index);
        this.orig_pos = new Point3(this.position.x, this.position.y, this.position.z);
        this.speed = 0.4;
    }

    render() {
        super.render();

        let rot_speed = 30;
        this.rotation.x += Engine.delta * rot_speed;
        this.rotation.y -= Engine.delta * rot_speed;
        this.rotation.z += Engine.delta * rot_speed;
        this.position.y += this.speed * Engine.delta;
        if (this.position.y >= this.orig_pos.y+0.5) {
            this.speed = -this.speed
        }
        else if (this.position.y <= this.orig_pos.y-1) {
            this.speed = Math.abs(this.speed);
        }

        this.shader.render(this);
    }
}
