import type { Scene } from "./lib/scenes/base";
import { DefaultScene } from "./lib/scenes/default";
import { load_asset_infos } from "./lib/utils/assets";

export enum AssetInfoType {
    VERTEX_SHADER = "VERTEX_SHADER",
    FRAGMENT_SHADER = "FRAGMENT_SHADER"
}

export type AssetInfo = {
    type: AssetInfoType;
    name: string;
    value: string;
    data?: any;
}

export class Engine {
    static gl: WebGL2RenderingContext = null;
    static assets_infos: Record<string, AssetInfo> = null;
    static cur_time: number = 0.0;
    static delta: number = 0.0;
    static cur_scene: Scene = null;

    static loop() {
        Engine.delta = Date.now()-Engine.cur_time;
        Engine.cur_time = Date.now();
        Engine.cur_scene.render();
        requestAnimationFrame(Engine.loop);
    }
}

export async function init(id: string) {
    const el: HTMLCanvasElement = document.querySelector(id);
    const gl = el.getContext("webgl2");
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    Engine.gl = gl;
    Engine.cur_scene = new DefaultScene();
    await load_asset_infos();
    await Engine.cur_scene.init();
    // @ts-ignore
    window.Engine = Engine;
}
