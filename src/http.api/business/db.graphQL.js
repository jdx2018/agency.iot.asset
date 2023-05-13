/**
 * 数据库基础操作，单表增删改查，不带实物
 */

const dbClient = require("../db/db.mysql");
const operateEnum = dbClient.operateEnum;
async function graphQL(data) {
    let operate = data.operate ? data.operate : "unknown";
    let result = {};
    try {
        switch (operate) {
            case operateEnum.query:
                result = await dbClient.Query(data.tableName, data.query, data.fields);
                return { code: 1, message: "success", data: result.results };

            case operateEnum.insert:
                result = await dbClient.Insert(data.tableName, data.dataContent);
                return { code: 1, message: "success", data: result.results };

            case operateEnum.delete:
                result = await dbClient.Delete(data.tableName, data.query);
                return { code: 1, message: "success", data: result.results };
            case operateEnum.update:
                result = await dbClient.Update(data.tableName, data.query, data.dataContent);
                return { code: 1, message: "success", data: result.results };
            case operateEnum.insertAfterDelete:
                result = { code: 1, message: "success", data: {} }
                let con_temp = null;
                let isTrans = false;
                return await dbClient.getConnection()
                    .then((con) => {
                        con_temp = con;
                        return dbClient.beginTrans(con_temp);
                    }).then(() => {
                        return dbClient.DeleteWithCon(con_trans, data.tableName, data.query)
                    })
                    .then(() => {
                        return dbClient.InsertManyWithCon(con_trans, data.tableName, data.dataContent);
                    })
                    .then(() => {
                        return dbClient.commitTrans(con_trans);
                    })
                    .then(() => {
                        con_temp.release();
                        return result;
                    }).catch((err) => {
                        if (isTrans) {
                            dbClient.rollbackTrans(con_trans).then(() => { con_temp.release(); });
                        }
                        if (con_temp) {
                            con_temp.release();
                        }
                        throw err;
                    });

            case operateEnum.insertMany:
                result = await dbClient.InsertMany(data.tableName, addPersonField(data.dataContent, data.userId));
                return { code: 1, message: "success", data: result.results };
            default:
                return { code: -300, message: operate + "类型的操作尚未支持." };
        }
    }
    catch (err) {
        return { code: -301, message: "数据访问失败" + err.message };
    }
}

module.exports.graphQL = graphQL;