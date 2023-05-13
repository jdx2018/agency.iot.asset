const billClient = require("./bill_chuzhi");
const dbClient = require("../db/db.local").db_local_client;
const table = require("../db/tableEnum").table;
async function testExecute() {
    let billMain = {
        employeeId: "em_supoin01",
        disposedType: 0,
        remarks: "处置单备注"
    }
    let res="";
    // let res = await billClient.saveBill(billMain, [{ assetId: "ZC00100000001" }]);
    // console.log(res);

    // res = await billClient.queryBill();
    // console.log(res);
    // let billNo = res.data.rows[0].billNo;
    // res = await billClient.queryBillDetail(billNo);
    // console.log(res.data.billDetail);
    // res = await billClient.getBillMainTemplate();
    // console.log(res);
    // res = await res.method.getAssetList();
    // console.log(res);
    // res = await dbClient.Query(table.tenant_asset,{status:1});
    // console.log(res);
    res=await billClient.unDisposedBill("CZ1604214630052");
    console.log(res);

}
testExecute();