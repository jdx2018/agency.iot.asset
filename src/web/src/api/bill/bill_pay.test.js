const bill_pay = require("./bill_pay");
async function test() {
    try {
        let res = "";
        res = await bill_pay.queryBill();
        console.log(res);
        res = await bill_pay.getTemplate();
        console.log(res);
        res = await bill_pay.queryBillDetail("FK1608521033357");
        console.log(res);
    }
    catch (err) {
        console.log(err);
    }
}
test();