import { Engine } from "../../engine";
import type { Node } from "../node/base";
import type Projection from "../projection/base";

export class Scene {
    id: string;
    nodes: Node[]
    projection: Projection;
    constructor(id: string) {
        this.id = id;
        this.nodes = [];
        this.projection = null;
    }

    async init() {
        Engine.cur_time = Date.now();
    }

    render() { }
}
