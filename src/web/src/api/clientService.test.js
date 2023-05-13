const bllClient = require("./clientService");
const cache = require("./cache");
async function test() {
    cache.isDebug = true;
    let res = await bllClient.asset.getAssetList();
    console.log(res);
    res = await bllClient.asset.getAssetList({ assetId: "ZC00100000001" });
    console.log(res);

}
test();