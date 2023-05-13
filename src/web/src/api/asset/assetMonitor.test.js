const bll = require("./assetMonitor");
async function test() {
    try {
        let res =await bll.getAssetList_monitor();
        console.log(res);
    }
    catch (err) {
        console.log(err);
    }
}
test();