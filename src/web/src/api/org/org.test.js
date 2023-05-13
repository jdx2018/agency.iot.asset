const org = require("./org");
async function testexecute() {
    let res = await org.getOrgList_all();
    // console.log(res);
    // res = await org.getTemplate();
    // console.log(res.data.orgId.dataSource);
    // res = await org.addOrg("org0001", "测试组织", "org01");
    // console.log(res);
    let tstart = Date.now();
    res = await org.initial_subList();
    console.log("重置用时", (Date.now() - tstart) / 1000);
}
testexecute();