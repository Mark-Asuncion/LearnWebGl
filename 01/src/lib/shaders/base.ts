import type { Renderable } from "../utils/types";

export default class Shader {
    program: WebGLProgram;
    name: string;
    constructor(name: string) {
        this.program = null;
        this.name = name;
    }

    render(_ctx: Renderable) {}
}

export enum ShaderKey {
    Default = "Default"
}
