const paramEnum = require("./paramEnum");
async function testExecute() {
    let res = await paramEnum.getEnum_purchaseType();
    console.log(res.data);
    res = await paramEnum.getEnum_useStatus();
    console.log(res.data);
    res = await paramEnum.getEnum_assetStatus();
    console.log(res);
}
testExecute();