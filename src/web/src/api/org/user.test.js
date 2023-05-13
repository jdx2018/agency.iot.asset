const user = require("./user");
const dbClient = require("../db/db.local").db_local_client;
async function test() {
    let res = "";
    // res = await user.getUserList();
    // console.log(res);
    // res = await user.getTemplate();
    // console.log(res);
    // res = await user.updateUser({ userId: "admin2", employeeId: "em_supoin01", remarks: "test" });
    // console.log(res);
    // // res = await dbClient.Query("tenant_user");
    // // console.log(res);
    // res = await user.deleteUser("admin1");
    // console.log(res);
    // res = await dbClient.Query("tenant_user");
    // console.log(res);
    // res = await user.getUserDetail("admin");
    // console.log(res);

    res = await user.updateUserPassword("admin1", "12345");
    console.log(res);
}
test();