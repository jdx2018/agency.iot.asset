const dashBoard = require("./dashBoard.js");
async function test() {
    try {
        let res = null;
        // res = await dashBoard.getToDoList();
        // console.log(res);
        // res = await dashBoard.getReport_recent();
        // console.log(res);
        res = await dashBoard.getAsset_distribute_status();
        console.log(res);
    }
    catch (err) {
        console.log(err);
    }
}
test();