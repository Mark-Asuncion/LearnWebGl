import { Engine } from "../../engine";
import { Point3, Point4 } from "../point";
import { ShaderKey } from "../shaders/base";
import { get_shader } from "../shaders/util";
import { Node } from "./base";
import { create_buffer, set_face_data, set_vertices_data } from "../utils/gl";

export class Gizmo extends Node {
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
        this.position.z = -3;
        this.vertices = [
            // ---------- X Axis ----------
            new Point3(0.0,-0.05, 0.05), //0
            new Point3(1.0,-0.05, 0.05), //1
            new Point3(1.0, 0.05, 0.05), //2
            new Point3(0.0, 0.05, 0.05), //3
            new Point3(0.0,-0.05,-0.05), //4
            new Point3(1.0,-0.05,-0.05), //5
            new Point3(1.0, 0.05,-0.05), //6
            new Point3(0.0, 0.05,-0.05), //7

            // ---------- Y Axis ----------
            new Point3(-0.05,0.0, 0.05), //8
            new Point3( 0.05,0.0, 0.05), //9
            new Point3( 0.05,1.0, 0.05), //10
            new Point3(-0.05,1.0, 0.05), //11
            new Point3(-0.05,0.0,-0.05), //12
            new Point3( 0.05,0.0,-0.05), //13
            new Point3( 0.05,1.0,-0.05), //14
            new Point3(-0.05,1.0,-0.05), //15

            // ---------- Z Axis ----------
            new Point3(-0.05,-0.05,0.0), //16
            new Point3( 0.05,-0.05,0.0), //17
            new Point3( 0.05, 0.05,0.0), //18
            new Point3(-0.05, 0.05,0.0), //19
            new Point3(-0.05,-0.05,1.0), //20
            new Point3( 0.05,-0.05,1.0), //21
            new Point3( 0.05, 0.05,1.0), //22
            new Point3(-0.05, 0.05,1.0), //23
        ];
        this.attrib.colors = [];

        // X (red)
        for (let i = 0; i < 8; i++)
            this.attrib.colors.push(new Point4(1,0,0,1));

        // Y (green)
        for (let i = 0; i < 8; i++)
            this.attrib.colors.push(new Point4(0,1,0,1));

        // Z (blue)
        for (let i = 0; i < 8; i++)
            this.attrib.colors.push(new Point4(0,0,1,1));

        this.attrib.index = new Uint16Array([
            // X
            0,1,2, 0,2,3,
            4,6,5, 4,7,6,
            0,4,5, 0,5,1,
            3,2,6, 3,6,7,
            0,3,7, 0,7,4,
            1,5,6, 1,6,2,

            // Y (+8)
            8,9,10, 8,10,11,
            12,14,13, 12,15,14,
            8,12,13, 8,13,9,
            11,10,14, 11,14,15,
            8,11,15, 8,15,12,
            9,13,14, 9,14,10,

            // Z (+16)
            16,17,18, 16,18,19,
            20,22,21, 20,23,22,
            16,20,21, 16,21,17,
            19,18,22, 19,22,23,
            16,19,23, 16,23,20,
            17,21,22, 17,22,18
        ]);
        this.shader = default_shader;
        this.buffer = create_buffer(Engine.gl);
        this._create_buffer_data();
        this.attrib.index_buffer = create_buffer(Engine.gl)
        set_face_data(Engine.gl, this.attrib.index_buffer, this.attrib.index);
    }

    render() {
        super.render();

        Engine.gl.disable(Engine.gl.DEPTH_TEST);
        this.shader.render(this);
        Engine.gl.enable(Engine.gl.DEPTH_TEST);
    }
}
