import { Engine, init } from "./engine";

async function s() {
    await init("#gl");
    Engine.loop();
}

s();
