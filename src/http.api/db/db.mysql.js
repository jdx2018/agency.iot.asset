const mysql = require('mysql');
const dbParam = require("./db.param");
const operateEnum = {
    query: "query",
    insert: "insert",
    update: "update",
    delete: "delete",
    insertMany: "insertMany",
    batch: "batch"
}
const db_asset = {
    connectionLimit: 2,
    host: '47.106.103.128',
    user: 'supoin',
    password: 'SupoinSz2020@',
    port: '3306',
    database: 'iot.asset',
    log: true
}
var pool = mysql.createPool(db_asset);
async function getConnection() {
    return new Promise((resolve, reject) => {
        pool.getConnection((err, connection) => {
            if (err) {
                reject(err);
            }
            else {
                resolve(connection)
            }
        })

    })
}
async function executeSqlWithCon(con, sql, params) {
    let needRelease = false;
    if (!con) {
        con = await getConnection();
        needRelease = true;
    }
    return new Promise((resolve, reject) => {

        try {
            con.query(sql, params, (err, results, fields) => {
                if (needRelease) {
                    con.release();
                }
                if (err) {
                    reject(err);
                }
                else {
                    results = JSON.parse(JSON.stringify(results));
                    resolve({ results, fields });
                }
            });
        } catch (err) {
            con.release();
            reject(err);
        }

    })
}
async function executeSql(sql, params) {
    return executeSqlWithCon(null, sql, params);
}
/**
 * 开始一个事务
 * @param {*} con 
 */
async function beginTrans(con) {
    if (!con) {
        con = await getConnection();
    }
    return new Promise((resolve, reject) => {
        con.beginTransaction((err) => {
            if (err) {
                reject(err);
            }
            else {
                resolve(con);
            }
        })
    });
}
/**
 * 提交一个事务
 * @param {*} con 
 */
async function commitTrans(con) {
    return new Promise((resolve, reject) => {
        con.commit((err) => {
            if (err) {
                reject(err);
            }
            else {
                resolve(con);
            }
        })
    })
}
/**
 * 回滚一个事务
 * @param {*} con 
 */
async function rollbackTrans(con) {
    return new Promise((resolve, reject) => {
        con.rollback((err) => {
            if (err) {
                reject(err);
            }
            else {
                resolve(con);
            }
        })
    })
}
/**
 * 批量执行sql
 * @param {*} operateList 
 * @param {*} isTrans
 */
async function BatchExecute(operateList, isTrans) {
    let result = { err: null, data: [] };
    let con = null;
    try {
        con = await getConnection();
        if (isTrans) {
            await beginTrans(con);
        }
        try {

            let opList = dbParam.batchParamPack(operateList);
            for (let i = 0; i < opList.length; i++) {
                let op = opList[i];
                let res = null;
                res = await executeSqlWithCon(con, op.sql, op.params);
                result.data.push(JSON.parse(JSON.stringify(res.results)));
            }

            if (isTrans) {
                await commitTrans(con);
            }
            con.release();
        }
        catch (err1) {
            if (isTrans) {
                await rollbackTrans(con);
                // console.log("rollback trans.")
            }
            con.release();
            result.err = err1;
        }
    }
    catch (err) {
        con.release();
        result.err = err;
    }
    return result;
}
async function executeObjWithCon(con, operate, tableName, query, fields, dataContent) {
    let paramObject = null;
    switch (operate) {
        case operateEnum.query:
            paramObject = dbParam.queryParamPack(tableName, query, fields);
            break;
        case operateEnum.insert:
            paramObject = dbParam.insertParamPack(tableName, dataContent);
            break;
        case operateEnum.update:
            paramObject = dbParam.updatParamPack(tableName, query, dataContent);
            break;
        case operateEnum.delete:
            paramObject = dbParam.deleteParamPack(tableName, query);
            break;
        case operateEnum.insertMany:
            paramObject = dbParam.bulkParmPack(tableName, dataContent);
            break;
        default:
            throw new Error(operate + " 操作不支持");
    }
    return executeSqlWithCon(con, paramObject.sql, paramObject.params);

}
async function QueryWithCon(con, tableName, query, fields) {
    return executeObjWithCon(con, operateEnum.query, tableName, query, fields, null);
}
async function Query(tableName, query, fields) {
    return QueryWithCon(null, tableName, query, fields);
}
async function InsertWithCon(con, tableName, dataContent) {
    return executeObjWithCon(con, operateEnum.insert, tableName, null, null, dataContent);
}
async function Insert(tableName, dataContent) {
    return InsertWithCon(null, tableName, dataContent);
}
async function UpdateWithCon(con, tableName, query, dataContent) {
    return executeObjWithCon(con, operateEnum.update, tableName, query, null, dataContent);
}
async function Update(tableName, query, dataContent) {
    return UpdateWithCon(null, tableName, query, dataContent);
}
async function DeleteWithCon(con, tableName, query) {
    return executeObjWithCon(con, operateEnum.delete, tableName, query, null, null);
}
async function Delete(tableName, query) {
    return DeleteWithCon(null, tableName, query);
}

async function InsertManyWithCon(con, tableName, dataContent) {
    return executeObjWithCon(con, operateEnum.insertMany, tableName, null, null, dataContent);
}
async function InsertMany(tableName, dataContent) {
    return InsertManyWithCon(null, tableName, dataContent);
}
module.exports.getConnection = getConnection;
module.exports.beginTrans = beginTrans;
module.exports.commitTrans = commitTrans;
module.exports.rollbackTrans = rollbackTrans;

module.exports.executeSql = executeSql;
module.exports.executeSqlWithCon = executeSqlWithCon;

module.exports.BatchExecute = BatchExecute;

module.exports.QueryWithCon = QueryWithCon;
module.exports.InsertWithCon = InsertWithCon;
module.exports.UpdateWithCon = UpdateWithCon;
module.exports.DeleteWithCon = DeleteWithCon;
module.exports.InsertManyWithCon = InsertManyWithCon;


module.exports.Query = Query;
module.exports.Insert = Insert;
module.exports.Update = Update;
module.exports.Delete = Delete;
module.exports.InsertMany = InsertMany;

module.exports.operateEnum = operateEnum;
