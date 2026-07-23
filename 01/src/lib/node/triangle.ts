import { Engine } from "../../engine";
import { Point3, Point4 } from "../point";
import { DefaultShader } from "../shaders/default";
import { Node } from "./base";

export class Triangle extends Node {
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
        return this.buffer_data;
    }

    create_buffer() {
        const gl = Engine.gl;
        if (this.buffer) {
            gl.deleteBuffer(this.buffer);
            this.buffer = null;
        }
        const buffer = gl.createBuffer();
        if (!buffer) {
            console.error("Failed to create the buffer object for " + this.name);
            throw Error("Failed to create the buffer object for " + this.name);
        }
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.bufferData(gl.ARRAY_BUFFER, this._create_buffer_data(), gl.STATIC_DRAW);
        this.buffer = buffer;
    }

    async init() {
        const default_shader = new DefaultShader();
        await default_shader.init();
        this.position.z = -5;
        this.vertices = [
            new Point3(0, 1, 0),
            new Point3(1, -1, 0),
            new Point3(-1, -1, 0)
        ];
        this.attrib.colors = [
            new Point4(1, 0, 0, 1),
            new Point4(0, 1, 0, 1),
            new Point4(0, 0, 1, 1)
        ];
        this.shader = default_shader;
        this.create_buffer();
        console.debug(this);
    }

    render() {
        super.render();
        if (!this.buffer) {
            console.error(`Could not render ${this.id}:${this.name}`);
            this.create_buffer();
            return;
        }
        const gl = Engine.gl;
        const program = this.shader.program;

        this.rotation.x += Engine.delta * 0.1;
        this.rotation.y += Engine.delta * 0.1;
        this.rotation.z += Engine.delta * 0.1;

        gl.useProgram(program)
        gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);

        const el_size = Float32Array.BYTES_PER_ELEMENT;
        const _stride = this.stride*el_size;

        let u_transform = gl.getUniformLocation(program, 'u_transform');
        let u_rotation = gl.getUniformLocation(program, 'u_rotation');
        let u_position = gl.getUniformLocation(program, 'u_position');
        let a_vertex = gl.getAttribLocation(program, 'a_vertex');
        let a_color = gl.getAttribLocation(program, 'a_color');

        gl.uniformMatrix4fv(u_transform, false, Engine.cur_scene.projection.matrix());
        gl.uniform3f(u_rotation, this.rotation.x, this.rotation.y, this.rotation.z);
        gl.uniform3f(u_position, this.position.x, this.position.y, this.position.z);

        gl.vertexAttribPointer(a_vertex, 3, gl.FLOAT, false, _stride, 0);
        gl.vertexAttribPointer(a_color, 4, gl.FLOAT, false, _stride, 3*el_size);
        gl.enableVertexAttribArray(a_vertex);
        gl.enableVertexAttribArray(a_color);

        gl.drawArrays(gl.TRIANGLES, 0, this.vertices.length);
        gl.drawArrays(gl.LINE_LOOP, 0,  this.vertices.length);
    }
}
