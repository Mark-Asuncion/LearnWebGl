export default class Shader {
    program: WebGLProgram;
    name: string;
    constructor(name: string) {
        this.program = null;
        this.name = name;
    }
}

export enum ShaderKey {
    Default = "Default"
}
