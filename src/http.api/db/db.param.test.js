const dbParam = require("./db.param");
function queryParam() {
    let res = dbParam.queryParamPack("sys_user", { userId: 9 }, { fields: { userId: 1, userName: 1 } })
    console.log(res);

}
function insertParam() {
    let res = dbParam.insertParamPack("sys_user", { userId: "16", userName: "jdx", pwd: "123456" });
    console.log(res);
}
function updateParam() {
    let res = dbParam.updatParamPack("sys_user", { userId: 9 }, { remarks: "update.test.mysql" });
    console.log(res);
}
function deleteParam() {
    let res = dbParam.deleteParamPack("sys_user", { userId: 9 });
    console.log(res);
}
function insertManyParam() {
    let res = dbParam.bulkParmPack("sys_user",
        [{ userId: 9, userName: "admin29", createTime: new Date() },
        { userId: 10, userName: "admin23", createTime: new Date() },]);
    console.log(res);
}
function batchParam() {
    let res = dbParam.batchParamPack([
        {
            operate: "query",
            tableName: "sys_user",
            query: { userId: 9 }
        },
        {
            operate: "update",
            tableName: "sys_user",
            query: { userId: 9 },
            dataContent: { remarks: "update.batch.test" }
        }
    ])
    console.log(res);

}
queryParam();
insertParam();
updateParam();
deleteParam();
insertManyParam();
batchParam();