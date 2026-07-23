import { Engine, init } from "./engine";

async function s() {
    await init("#gl");
    console.debug(Engine.cur_scene);
    Engine.loop();
}

s();
