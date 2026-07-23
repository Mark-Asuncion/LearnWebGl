import { Engine, type AssetInfo } from "../../engine";

export async function load_asset_infos() {
    const r = await fetch("/assets.json");
    if (r.status < 200 || r.status > 299)
        throw Error("Could not load assets.json");
    const json: Record<string, AssetInfo> = await r.json();
    Engine.assets_infos = json;
}

async function get_as_string(url: string) {
    const r = await fetch(url);
    console.debug("get_as_string", url);
    if (r.status < 200 || r.status > 299)
        throw Error(`Could not load ${url}`);
    return await r.text();
}

export async function load_asset_as_string(name: string) {
    const asset = Engine.assets_infos[name];
    if (asset == null) throw Error(`Could not load ${name}`);
    if (asset.data != null) return asset.data as string;

    const contents =  await get_as_string(asset.value);
    Engine.assets_infos[name].data = contents;
    return contents;
}
