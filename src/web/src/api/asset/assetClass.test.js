const assetClass = require("./assetClass");
async function testExecute() {
    console.log("加载资产类别");
    let res = await assetClass.getAssetClass_list();
    // console.log(res);
    res = await assetClass.initial_subList();
    console.log(res);
    // res = await assetClass.getTemplate();
    // console.log(res.data.classId.dataSource);
    // res = await assetClass.addClass("classId", "测试分类", "C01");
    // console.log(res);
}
testExecute();