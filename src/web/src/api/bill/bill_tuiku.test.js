const billClient = require("./bill_tuiku");
const dbClient = require("../db/db.local").db_local_client;
const table = require("../db/tableEnum").table;
async function testExecute() {
    let billMain1 = {
        employeeId: "em_supoin01",
        returnDate: "2020-09-01",
        placeId: "P001",
        useOrgId: "org01",
        remarks: "hello-tuiku"
    }
    let res = await billClient.queryBill();
    console.log(res);
    // res = await billClient.saveBill(billMain1,
    //     [{ assetId: "ZC00100000001" }]);
    // console.log(res);
    // // res = await dbClient.Query(table.tenant_bill);
    // // console.log(res);
    // res = await billClient.queryBill();
    // console.log(res.data);
    // res = await billClient.queryBillDetail(res.data.rows[0].billNo);
    // console.log(res.data.billDetail);
    // res = await billClient.getBillMainTemplate();
    // console.log(res);

}
testExecute();
