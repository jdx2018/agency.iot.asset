const billClient = require("./bill_guihuan");
const dbClient = require("../db/db.local").db_local_client;
const table = require("../db/tableEnum").table;
async function testExecute() {
    let billMain = {
        employeeId: "emp001",
        returnDate: "2020-09-20",
        useOrgId: "org001",
        placeId: "P001",
        remarks: "归还备注"
    }
    let res = await billClient.queryBill();
    console.log(res);
    res = await billClient.saveBill(billMain, [{ assetId: "ZC00100000001" }]
    );
    console.log(res);
    res = await billClient.queryBill();
    console.log(res.data);
    // res = await bill_jiechu.queryBillDetail(res.data.rows[0]);
    // console.log(res.data.billDetail);
    // res = await bill_jiechu.deleteBill_jiechu("JC001");
    // console.log(res);
    //  res = await bill_jiechu.queryBill_jiechu();
    // console.log(res.data.rows.length);
}
testExecute();