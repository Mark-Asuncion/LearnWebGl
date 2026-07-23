import { Engine } from "../../engine";
import { load_asset_as_string } from "../utils/assets";
import { create_shader } from "../utils/gl";
import Shader from "./base";

export class DefaultShader extends Shader {
    constructor() {
        super();
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
    }
}
