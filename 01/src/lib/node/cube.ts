import { Engine } from "../../engine";
import { Point3, Point4 } from "../point";
import { ShaderKey } from "../shaders/base";
import { get_shader } from "../shaders/util";
import { Node } from "./base";
import { create_buffer, set_vertices_data } from "../utils/gl";

export class Cube extends Node {
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
        this.position.x = 0;
        this.position.z = -3;
        this.vertices = [
          // Front face
          new Point3(-1.0, -1.0, 1.0),
          new Point3(1.0, -1.0, 1.0),
          new Point3(1.0, 1.0, 1.0),
          new Point3(-1.0, 1.0, 1.0),

          // Back face
          new Point3(-1.0, -1.0, -1.0),
          new Point3(-1.0, 1.0, -1.0),
          new Point3(1.0, 1.0, -1.0),
          new Point3(1.0, -1.0, -1.0),

          // Top face
          new Point3(-1.0, 1.0, -1.0),
          new Point3(-1.0, 1.0, 1.0),
          new Point3(1.0, 1.0, 1.0),
          new Point3(1.0, 1.0, -1.0),

          // Bottom face
          new Point3(-1.0, -1.0, -1.0),
          new Point3(1.0, -1.0, -1.0),
          new Point3(1.0, -1.0, 1.0),
          new Point3(-1.0, -1.0, 1.0),

          // Right face
          new Point3(1.0, -1.0, -1.0),
          new Point3(1.0, 1.0, -1.0),
          new Point3(1.0, 1.0, 1.0),
          new Point3(1.0, -1.0, 1.0),

          // Left face
          new Point3(-1.0, -1.0, -1.0),
          new Point3(-1.0, -1.0, 1.0),
          new Point3(-1.0, 1.0, 1.0),
          new Point3(-1.0, 1.0, -1.0)
        ];
        this.attrib.colors = [];

        const faceColors = [
          [1.0, 1.0, 1.0, 1.0], // Front face: white
          [1.0, 0.0, 0.0, 1.0], // Back face: red
          [0.0, 1.0, 0.0, 1.0], // Top face: green
          [0.0, 0.0, 1.0, 1.0], // Bottom face: blue
          [1.0, 1.0, 0.0, 1.0], // Right face: yellow
          [1.0, 0.0, 1.0, 1.0], // Left face: purple
        ];

        for (const c of faceColors) {
          const cc = new Point4(c[0], c[1], c[2], c[3]);
          this.attrib.colors.push(cc, cc, cc, cc);
        }

        this.attrib.index = [
            // Front face
             0,  2,  1,
             0,  3,  2,

            // Back face
             4,  6,  5,
             4,  7,  6,

            // Top face
             8, 10,  9,
             8, 11, 10,

            // Bottom face
            12, 14, 13,
            12, 15, 14,

            // Right face
            16, 18, 17,
            16, 19, 18,

            // Left face
            20, 22, 21,
            20, 23, 22,
        ];
        this.position.z = -10;
        this.shader = default_shader;
        this.buffer = create_buffer(Engine.gl);
        this._create_buffer_data();
    }

    render() {
        super.render();

        let rot_speed = 30;
        this.rotation.x += Engine.delta * rot_speed;
        this.rotation.y += Engine.delta * rot_speed;
        // this.rotation.z += Engine.delta * rot_speed;
        this.rotation.x = this.rotation.x % 360;
        this.rotation.y = this.rotation.y % 360;
        // this.rotation.z = this.rotation.z % 360;

        this.shader.render(this);
    }
}
