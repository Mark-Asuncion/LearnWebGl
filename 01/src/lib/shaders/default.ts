import { Engine } from "../../engine";
import { load_asset_as_string } from "../utils/assets";
import { create_shader } from "../utils/gl";
import type { Renderable } from "../utils/types";
import Shader from "./base";

export type _DefaultShaderParams = {
    u_pivot: WebGLUniformLocation,
    u_transform: WebGLUniformLocation,
    u_rotation: WebGLUniformLocation,
    u_position: WebGLUniformLocation,
    u_scale: WebGLUniformLocation,
    a_vertex: number,
    a_color: number
}

export class DefaultShader extends Shader {
    _params: _DefaultShaderParams | null;
    constructor() {
        super("default_shader");
        this._params = null;
    }
    async init() {
        console.debug("Loading shaders...");
        const vertex_source = await load_asset_as_string("default_vertex");
        const fragment_source = await load_asset_as_string("default_fragment");

        console.debug("Compiling shaders...");
        const program = Engine.gl.createProgram();
        let shader = create_shader(Engine.gl, Engine.gl.VERTEX_SHADER, vertex_source);
        if (shader == null) {
            throw Error("01-Could not compile shader")
        }
        Engine.gl.attachShader(program, shader);
        shader = create_shader(Engine.gl, Engine.gl.FRAGMENT_SHADER, fragment_source);
        if (shader == null) {
            throw Error("02-Could not compile shader")
        }
        Engine.gl.attachShader(program, shader);
        Engine.gl.linkProgram(program);

        if (!Engine.gl.getProgramParameter(program, Engine.gl.LINK_STATUS)) {
            console.error('Program linking error:', Engine.gl.getProgramInfoLog(program));
            throw Error("Could not link the shader program");
        }
        console.debug("Create Shader Program");

        this.program = program;

        const gl = Engine.gl;
        this._params = {
            u_pivot: gl.getUniformLocation(program, "u_pivot"),
            u_transform: gl.getUniformLocation(program, "u_transform"),
            u_rotation: gl.getUniformLocation(program, "u_rotation"),
            u_position: gl.getUniformLocation(program, "u_position"),
            u_scale: gl.getUniformLocation(program, "u_scale"),
            a_vertex: gl.getAttribLocation(program, "a_vertex"),
            a_color: gl.getAttribLocation(program, "a_color")
        }
    }

    render(node: Renderable) {
        const gl = Engine.gl;

        gl.useProgram(this.program)
        gl.bindBuffer(gl.ARRAY_BUFFER, node.buffer);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, node.attrib.index_buffer);

        const el_size = Float32Array.BYTES_PER_ELEMENT;
        const _stride = node.stride*el_size;

        gl.uniformMatrix4fv(this._params.u_transform, false, Engine.cur_scene.projection.matrix());
        gl.uniform3f(this._params.u_pivot, node.pivot.x, node.pivot.y, node.pivot.z);
        gl.uniform3f(this._params.u_rotation, node.rotation.x, node.rotation.y, node.rotation.z);
        gl.uniform3f(this._params.u_position, node.position.x, node.position.y, node.position.z);
        gl.uniform3f(this._params.u_scale, node.scale.x, node.scale.y, node.scale.z);

        gl.vertexAttribPointer(this._params.a_vertex, 3, gl.FLOAT, false, _stride, 0);
        gl.vertexAttribPointer(this._params.a_color, 4, gl.FLOAT, false, _stride, 3*el_size);
        gl.enableVertexAttribArray(this._params.a_vertex);
        gl.enableVertexAttribArray(this._params.a_color);

        // gl.drawElements(gl.LINE_LOOP, node.attrib.index.length, gl.UNSIGNED_SHORT, 0);
        gl.drawElements(gl.TRIANGLES, node.attrib.index.length, gl.UNSIGNED_SHORT, 0);
        // gl.drawElements(gl.POINTS, node.attrib.index.length, gl.UNSIGNED_SHORT, 0)
    }
}
