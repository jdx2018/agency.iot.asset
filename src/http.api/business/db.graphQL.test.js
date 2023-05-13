const dbClient = require("./db.graphQL");
const queryObj_param = [{ operate: "query", tableName: "sys_user", query: { userId: 1 } }];
const insertObj_param = ["sys_user", { userName: "admin", password: "123456", createPerson: "jdx" }];
const updateObj_param = ["sys_user", { userId: 1 }, { remarks: "update.test.2" }];
const deleteObj_param = ["sys_user", { userId: 4 }];

const insertManyObj_param = ["sys_user", [{ userName: "001" }, { userName: "002" }]];

const querySql_param = ["select * from sys_user where userId=?", [1]];
const insertSql_param = ["insert into ?? set ?", ["sys_user", { userName: "jdx", createTime: new Date() }]];
const updateSql_param = ["update ?? set userName=? where userId=?", ["sys_user", "admin", 1]];
const deleteSql_param = ["delete from ?? where userId=?", ["sys_user", 12]];

const batchObj_param = [
    [
        { operate: "update", tableName: "sys_user", query: { userId: 1 }, dataContent: { userName: "adminx" } },
        { operate: "update", tableName: "sys_user", query: { userId: 1 }, dataContent: { remarks: "batch.update" } },

    ], false
];
async function testExecute(func, params) {
    try {
        let res = await func.apply(this, params);
        if (res.results) {
            console.log(res.results);
        }
        else {
            console.log(res);
        }
    }
    catch (err) {
        console.log(err);
    }
}



testExecute(dbClient.graphQL, queryObj_param);
// testExecute(dbClient.Update, updateObj_param);
// testExecute(dbClient.Insert, insertObj_param);
// testExecute(dbClient.Delete, deleteObj_param);

// testExecute(dbClient.executeSql, querySql_param);
// testExecute(dbClient.executeSql, updateSql_param);
// testExecute(dbClient.executeSql, deleteSql_param);
// testExecute(dbClient.executeSql, insertSql_param);

// testExecute(dbClient.BatchExecute, batchObj_param);
// testExecute(dbClient.InsertMany, insertManyObj_param);