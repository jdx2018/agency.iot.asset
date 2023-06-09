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
    connectionLimit: 10,
    host: '47.106.103.128',
    user: 'supoin',
    password: 'SupoinSz2020@',
    port: '3306',
    database: 'iot.asset',
    timezone: "system",
    multipleStatements: true
}
var pool = mysql.createPool(db_asset);
/**
 * 
 */
function getConnection() {
    return new Promise((resolve, reject) => {
        pool.getConnection((err, connection) => {
            connection.beginTransaction()
            if (err) {
                console.log("get connection error.");
                reject(err);
            }

            else { resolve(connection) }
        })

    })
}
/**
 * 
 * @param {*} con 
 * @param {*} sql 
 * @param {*} params 
 */
async function executeSqlWithCon(con, sql, params) {
    // console.log(sql);
    // console.log(params);
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
                    console.log("execute sql err", err);
                    reject(err);
                }
                else {
                    results = JSON.parse(JSON.stringify(results));
                    resolve({ results });
                }
            });
        } catch (err) {
            con.release();
            console.log(err);
            reject(err);
        }

    })
}
/**
 * 执行存储过程
 * @param {string} procName 存储过程名称
 * @param {object} param 参数对象 {tenandId:"uniontech",orgId:"TC001"}
 */
async function executeProc(procName, paramData) {
    let paramObj = dbParam.procParamPack(procName, paramData);
    console.log("param proc", paramObj);
    return executeSql(paramObj.sql, paramObj.params);
}
/**
 * 
 * @param {*} sql 
 * @param {*} params 
 */
async function executeSql(sql, params) {
    return executeSqlWithCon(null, sql, params);
}
async function release(con) {
    try {
        if (con) {
            con.release();
            // pool.releaseConnection(con);
        }
    }
    catch (err) {
        // console.log(err);
    }
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
    // console.log("mysql.commitTrans");
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
    // console.log("mysql.rollbackTrans");
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
async function executeObjWithCon(con, operate, tableName, query, fields, dataContent, pageNum, pageSize, sortFields) {
    let paramObject = null;
    switch (operate) {
        case operateEnum.query:
            paramObject = dbParam.queryParamPack(tableName, query, fields, pageNum, pageSize, sortFields);
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
async function QueryWithCon(con, tableName, query, fields, pageNum, pageSize, sortFields) {
    return executeObjWithCon(con, operateEnum.query, tableName, query, fields, null, pageNum, pageSize, sortFields);
}
async function Query(tableName, query, fields, pageNum, pageSize, sortFields) {
    return QueryWithCon(null, tableName, query, fields, pageNum, pageSize, sortFields);
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

async function BatchExecute(operateList) {
    let result = { err: null, data: [] };
    let con = null;
    let isTrans = false;
    try {
        con = await getConnection();
        await beginTrans(con);
        isTrans = true;
        for (let i = 0; i < operateList.length; i++) {
            let op = operateList[i];
            let res = null;
            res = await executeObjWithCon(con, op.operate, op.tableName, op.query, op.fields, op.dataContent);
            if (op.operate == operateEnum.query) {
                result.data.push(JSON.parse(JSON.stringify(res.results)));
            }
            else {
                // console.log(res.results);
                result.data.push({ rowCount: res.results.affectedRows });
            }
        }
        await commitTrans(con);
        release(con);
        return result;
    }
    catch (err) {
        if (isTrans) {
            await rollbackTrans(con);
        }
        release(con);
        throw err;
    }
}
module.exports.getConnection = getConnection;
module.exports.beginTrans = beginTrans;
module.exports.commitTrans = commitTrans;
module.exports.rollbackTrans = rollbackTrans;
module.exports.release = release;

module.exports.executeSql = executeSql;
module.exports.executeSqlWithCon = executeSqlWithCon;
module.exports.executeObjWithCon = executeObjWithCon;

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

module.exports.BatchExecute = BatchExecute;

module.exports.operateEnum = operateEnum;
module.exports.executeProc = executeProc;