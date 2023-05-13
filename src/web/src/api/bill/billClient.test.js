const billClient = require("./billClient");
async function testExecute() {
    let res = billClient.convertExt2Field({ billNo: "1001", ext7: "2020-09-01",ext10:"P001",ext11:"em001" }, 11);
    console.log(res);
}
testExecute();