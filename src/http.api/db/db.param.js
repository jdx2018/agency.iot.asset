/**
 * where条件和sql参数组装
 * @param {*} tableName 
 * @param {*} query 
 */
function whereAndParamsPack(tableName, query) {
    let params = [];
    let sqlWhere = " where 1=1 "
    if (query) {

        let conditionKeys = Object.keys(query);
        for (let j = 0; j < conditionKeys.length; j++) {
            let key = conditionKeys[j];
            let value = null;
            if (typeof (query[key]) == "object") {
                //处理大于小于关系
                let v = query[key];
                if (Object.keys(v).indexOf("$gt") >= 0) {
                    sqlWhere += " and " + key + " >?";
                    value = query[key]["$gt"];
                    params.push(value);
                }
                if (Object.keys(v).indexOf("$lt") >= 0) {
                    sqlWhere += " and " + key + " <?";
                    value = query[key]["$lt"];
                    params.push(value);
                }
                if (Object.keys(v).indexOf("$gte") >= 0) {
                    sqlWhere += " and " + key + " >=?";
                    value = query[key]["$gte"];
                    params.push(value);
                }
                if (Object.keys(v).indexOf("$lte") >= 0) {
                    sqlWhere += " and " + key + " <=?";
                    value = query[key]["$lte"];
                    params.push(value);
                }

            }
            else {//等于关系
                sqlWhere += " and " + key + " =?";
                value = query[key];
                params.push(value);
            }
        }
    }
    return { where: sqlWhere, params: params };
}
/**
 * 组装单表查询sql
 * @param {*} tableName 
 * @param {*} query 
 * @param {*} fields 
 */
function queryParamPack(tableName, query, fields) {
    let sql = "select ";
    if (fields && Object.keys(fields).length > 0) {
        let hasField = false;
        Object.keys(fields).forEach((key) => {
            if (fields[key] == 1) {
                sql += key + ",";
                hasField = true;
            }
        })
        if (hasField) {
            sql = sql.substr(0, sql.length - 1);
        }

    }
    else {
        sql += " * "
    }
    sql += " from " + tableName;
    let paramObject = whereAndParamsPack(tableName, query);
    sql += paramObject.where;
    // console.log(paramObject);
    return { sql: sql, params: paramObject.params };
}
/**
 * 组装单表更新sql
 * @param {*} tableName 
 * @param {*} query 
 * @param {*} dataContent 
 */
function updatParamPack(tableName, query, dataContent) {
    let sql = "update " + tableName + " set ";
    let params = [];
    if (dataContent && Object.keys(dataContent.length > 0)) {
        Object.keys(dataContent).forEach((key) => {
            sql += key + "=?,";
            params.push(dataContent[key]);
        })
        sql = sql.substr(0, sql.length - 1);
    }
    let paramObject = whereAndParamsPack(tableName, query);
    sql += paramObject.where;
    params = params.concat(paramObject.params);
    return { sql: sql, params: params };
}
/**
 * 组装单表删除sql
 * @param {*} tableName 
 * @param {*} query 
 */
function deleteParamPack(tableName, query) {
    let sql = "delete from " + tableName;
    let paramObject = whereAndParamsPack(tableName, query);
    sql = sql + paramObject.where;
    return { sql: sql, params: paramObject.params };
}
/**
 * 组装单表插入sql
 * @param {*} tableName 
 * @param {*} dataContent 
 */
function insertParamPack(tableName, dataContent) {
    let sql = "insert into " + tableName + " set?";
    return { sql: sql, params: [dataContent] };
}
/**
 * 批量插入参数生成
 * @param {*} tableName 
 */
function bulkParmPack(tableName, dataContent) {
    let sql = "insert into " + tableName + "(";
    let params = [];
    if (dataContent && dataContent.length > 0) {
        let row = dataContent[0];
        if (row && Object.keys(row).length > 0) {
            sql += Object.keys(row).join(",");
        }

        for (let i = 0; i < dataContent.length; i++) {
            params.push(Object.values(dataContent[i]));
        }
    }
    sql += ") values ?";
    return { sql: sql, params: [params] };
}
function batchParamPack(operateList) {
    let opList = [];
    for (let i = 0; i < operateList.length; i++) {
        let op = operateList[i];
        let p = null;
        if (op.operate == "query") {
            p = queryParamPack(op.tableName, op.query, op.fields);
        }
        if (op.operate == "insert") {
            p = insertParamPack(op.tableName, op.dataContent);
        }
        if (op.operate == "update") {
            p = updatParamPack(op.tableName, op.query, op.dataContent);
        }
        if (op.operate == "delete") {
            p = deleteParamPack(op.tableName, op.query);
        }
        if (op.operate == "insertMany") {
            p = bulkParmPack(op.tableName, op.dataContent);
        }
        opList.push(p);

    }
    
    return opList;
}
module.exports.queryParamPack = queryParamPack;
module.exports.insertParamPack = insertParamPack;
module.exports.updatParamPack = updatParamPack;
module.exports.deleteParamPack = deleteParamPack;
module.exports.bulkParmPack = bulkParmPack;
module.exports.batchParamPack = batchParamPack;