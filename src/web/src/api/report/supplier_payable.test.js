const supplier_payable = require("./supplier_payable");
async function test() {
    try {
        let res = "";
        // res = await supplier_payable.queryPayableList();
        // console.log(res);
        // res = await supplier_payable.queryPayDetailList("1001");
        // console.log(res);
        res = await supplier_payable.queryPayableList("G00001");
        console.log(res);
        res = await supplier_payable.queryPayableDetailList_all();
        console.log(res);
        res = await supplier_payable.queryPayableDetailList("");
        console.log(res);
    }
    catch (err) {
        console.log(err);
    }
}
test();