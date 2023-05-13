const dbClient = require("./db.local").db_local_client;
const dbMock = require("../mock/db_mock").db_mock;
async function query() {
    let res = await dbClient.Query("tenant", { tenantId: "supoin" }, { tenantName: 1,tenantId:1 });
    console.log(res);
}
async function update() {
    let res =await dbClient.Update("tenant", { tenantId: "supoin" }, { remarks: "hello" });
    console.log(res);
    res =await dbClient.Query("tenant", { tenantId: "supoin" });
    console.log(res);
}
async function deleteR() {
    let res = await dbClient.Delete("tenant", { tenantId: "supoin" });
    console.log(res);
    res =await dbClient.Query("tenant");
    console.log(res);
}
async function insert() {
    let res =await dbClient.Insert("tenant", { tenantId: "supdata2" });
    console.log(res);
    res =await dbClient.Query("tenant");
    console.log(res);

}
async function insertMany() {
    let res =await dbClient.InsertMany("tenant", [{ tenantId: "supdatas1" }, { tenantId: "supdatas2" }]);
    console.log(res);
    res =await dbClient.Query("tenant");
    console.log(res);
}
// query();
// update();
// deleteR();
// insert();
insertMany();
