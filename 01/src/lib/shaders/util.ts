import { Engine } from "../../engine";
import Shader, { ShaderKey } from "./base";
import { DefaultShader } from "./default";

export async function get_shader(key: ShaderKey): Promise<Shader> {
    switch (key) {
        case ShaderKey.Default:
            if (Engine.shaders.has(key)) return Engine.shaders.get(key);
            const ds = new DefaultShader();
            await ds.init();
            Engine.shaders.set(key, ds);
            return ds;
        default:
            throw Error(`INVALID ${key}`);
    }
}
