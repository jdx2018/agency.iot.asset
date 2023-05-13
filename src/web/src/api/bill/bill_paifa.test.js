const billClient = require("./bill_paifa");
const dbClient = require("../db/db.local").db_local_client;
const table = require("../db/tableEnum").table;
async function testExecute() {
    let billMain1 = {
        employeeId: "em_supoin01",
        useDate: "2020-09-01",
        placeId: "P001",
        useOrgId: "org01",
        remarks: "hello1"
    }
    let billMain2 = {
        employeeId: "em_supoin01",
        useDate: "2020-09-01",
        placeId: "P002",
        remarks: "hello2"
    }
    let res = "";
    // res = await billClient.saveBill(billMain1, [{ assetId: "ZC00100000001" }]);
    // console.log(res);
    // res = await bill_paifa.saveBill_paifa(billMain2, [{ assetId: "ZC00300000001" }]);
    // console.log(res);
    // res = await dbClient.Query(table.tenant_bill);
    // console.log(res);
    // res = await dbClient.Query(table.tenant_bill_detail);
    // console.log(res);
    res = await billClient.queryBill();
    console.log(res.data);
    // let billNo = res.data.rows[0].billNo;
    // // res = await bill_paifa.deleteBill_paifa("paifa_001");
    // // // console.log(res);
    // // res = await bill_paifa.queryBill_paifa();
    // // console.log(res.data);
    // res = await billClient.queryBillDetail(billNo);
    // // console.log(res.data.billDetail);
    // res = await billClient.getBillMainTemplate();
    // console.log(res);
    // res = await res.method.getAssetList();
    // console.log(res);
    // res = await dbClient.Query(table.tenant_asset,{status:1});
    // console.log(res);

}
testExecute();