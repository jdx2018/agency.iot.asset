const dbClient = require("./db.client").dbClient;
// async function test() {
//     try {
//         let res = null;
//         res = await dbClient.executeProc("p_org_getChilds", { tenantId: "uniontech", orgId: "TC001" });
//         console.log(res);
//     }
//     catch (err) {
//         console.log(err);
//     }
// }
// test1();
async function test1() {
    let res = await dbClient.Query('v_asset_material', { tenantId: 'szumale' });
    console.log(res)
}

async function testexecuteTrans() {
    dbClient.ExecuteTrans(() => {

    })
}
test1();