const asset = require("./asset.js");
async function test() {
    try {
        let res = null;
        res = asset.getTemplate();
        console.log(res);
        // let assetList = [{}]
        // res = await asset.check(assetList);
        // // console.log(res);
        // assetList = [
        //     { assetId: "2017000901", assetName: "笔记本电脑", placeId: "城管局大楼", classId: "其他耕地", ownOrgId: "党群科", useOrgId: "监督中心", useEmployeeId: "谭侠磊" },
        //     { assetName: "笔记本电脑", placeId: "C101", classId: "1000000" },]
        // res = await asset.check(assetList);
        // console.log(JSON.stringify(res));
    }
    catch (err) {
        console.log(err);
    }
}
test();