const bill_jiechu = require("./bill_jiechu");
const dbClient = require("../db/db.local").db_local_client;
const table = require("../db/tableEnum").table;
const cache = require("../cache");
async function testExecute() {

    let res = "";
    let billMain = {
        employeeId: "emp001",
        borrowDate: "2020-09-14",
        returnDate: "2020-09-20",
        useOrgId: "org001",
        placeId: "P001",
        remarks: "借用备注"
    }
    res = await bill_jiechu.queryBill();
    // console.log(res);
    // res = await bill_jiechu.saveBill(billMain, [{ assetId: "ZC00100000001" }]
    // );
    // console.log(res);
    // res = await bill_jiechu.queryBill();
    // console.log(res.data);
    // res = await bill_jiechu.queryBillDetail(res.data.rows[0]);
    // console.log(res.data.billDetail);
    // res = await bill_jiechu.deleteBill_jiechu("JC001");
    // console.log(res);
    //  res = await bill_jiechu.queryBill_jiechu();
    // console.log(res.data.rows.length);
    // res=await bill_jiechu.checkBill("JC1607593519282");
    console.log(res);
}
testExecute();