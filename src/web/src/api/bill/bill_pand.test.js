const pand = require("./bill_pand");
const dbClient = require("../db/db.local").db_local_client;
async function test() {
    let res = null;
    // res = await pand.queryBill();
    // console.log(res);
    // res = await pand.getTemplate();
    // console.log(res.data);
    res = await pand.getTenantTopId();
    console.log(res);


}
test();