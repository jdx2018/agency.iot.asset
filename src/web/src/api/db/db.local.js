const cache = require('../cache');
var db_local = cache.local_db_get();
var db_local_client = {
  /**
   * 系统登录
   * @param {string} tenantId 租户ID
   * @param {string} userId 用户编号
   * @param {string} pwd 密码
   */
  login: async function login(tenantId, userId, pwd) {
    let user = null;
    let arrUser = db_local.tenant_user.data;
    for (let i = 0; i < arrUser.length; i++) {
      if (arrUser[i].tenantId == tenantId && arrUser[i].userId == userId) {
        user = arrUser[i];
      }
    }
    if (!user) {
      return { code: -1, message: '该企业/用户不存在，请核对.' };
    }
    if (user.password != pwd) {
      return { code: -1, message: '用户不存在或密码错误，请核对.' };
    }
    cache.user_set({ tenantId: user.tenantId, userId: user.tenantId, userName: user.userName });
    delete user.password;
    return { code: 1, message: '登录成功', data: user };
  },
  /**
   * 获取数据连接，连续多次访问数据库时使用
   */
  getConnection: async function getConnection() {
    return { id: 1 };
  },
  /**
   * 插入一条数据 使用现有数据连接
   * @param {object} con 数据连接对象
   * @param {string} tableName 表名
   * @param {object} dataContent 单条记录对象
   * @returns
   * @example
   * {code:1,message:"success",data:{affectedRows:1}}
   */
  InsertWithCon: async function InsertWithCon(con, tableName, dataContent) {
    if (!dataContent) {
      throw new Error('保存对象不能为空');
    }
    db_local[tableName].data.push(dataContent);
    // console.log("insert success.");
    // console.log(db_local[tableName].data);
    return { code: 1, message: 'success', data: { affectedRows: 1 } };
  },
  /**
   * 插入一条数据 不使用现有数据连接
   * @param {string} tableName 表名
   * @param {object} dataContent 单条记录对象
   * @returns
   * @example
   * {code:1,message:"success",data:{affectedRows:1}}
   */
  Insert: async function Insert(tableName, dataContent) {
    return await this.InsertWithCon(null, tableName, dataContent);
  },
  /**
   * 更新一条记录 使用现有数据连接
   * @param {object} con
   * @param {string} tableName 表名
   * @param {object} query 查询条件 {tenantId:"supoin",billNo:"1001"}
   * @param {object} dataContent 待更新的对象 {reamrks:"update"}
   */
  UpdateWithCon: async function UpdateWithCon(con, tableName, query, dataContent) {
    let arr = db_local[tableName].data;
    let affectedRows = 0;
    for (let i = 0; i < arr.length; i++) {
      let obj = arr[i];
      let ismatch = true;
      Object.keys(query).forEach((key) => {
        if (query[key] != obj[key]) {
          ismatch = false;
        }
      });
      if (ismatch) {
        Object.keys(dataContent).forEach((key) => {
          arr[i][key] = dataContent[key];
        });
        affectedRows++;
      }
    }
    return { code: 1, message: 'success', data: { affectedRows: affectedRows } };
  },
  /**
   * 更新一条记录 不使用现有数据连接
   * @param {string} tableName 表名
   * @param {查询条件} query 查询条件 {tenantId:"supoin",billNo:"1001"}
   * @param {object} dataContent 待更新的对象 {reamrks:"update"}
   */
  Update: async function Update(tableName, query, dataContent) {
    return await this.UpdateWithCon(null, tableName, query, dataContent);
  },
  /**
   * 删除记录 使用现有数据连接
   * @param {object} con 数据连接对象
   * @param {string} tableName 表名
   * @param {object} query {teantId:"supoin",billNo:"1002"}
   */
  DeleteWithCon: async function DeleteWithCon(con, tableName, query) {
    let arr = db_local[tableName].data;
    let affectedRows = 0;
    for (let i = 0; i < arr.length; i++) {
      let obj = arr[i];
      let ismatch = true;

      Object.keys(query).forEach((key) => {
        if (query[key] != obj[key]) {
          ismatch = false;
        }
      });
      if (ismatch) {
        arr.splice(i, 1);
        affectedRows++;
      }
    }
    return { code: 1, message: 'success', data: { affectedRows: affectedRows } };
  },
  /**
   * 删除记录 不使用现有数据连接
   * @param {string} tableName 表名
   * @param {object} query 查询条件 {teantId:"supoin",billNo:"1002"}
   */
  Delete: async function Delete(tableName, query) {
    return await this.DeleteWithCon(null, tableName, query);
  },
  /**
   * 查找记录 使用现有数据连接
   * @param {object} con 数据连接对象
   * @param {string} tableName 表名
   * @param {object} query 查询条件 {teantId:"supoin",billNo:"1002"}
   * @param {object} fields 返回字段 {billNo:1,billType:1,status:1}
   */
  QueryWithCon: async function QueryWithCon(con, tableName, query, fields) {
    // console.log("query " + tableName, query);
    let arr = db_local[tableName].data;
    let arrRes = [];
    for (let i = 0; i < arr.length; i++) {
      let obj = arr[i];
      let ismatch = true;
      if (query) {
        Object.keys(query).forEach((key) => {
          if (query[key] && query[key].$lte) {
            if (new Date(obj[key]) > new Date(query[key].$lte)) {
              ismatch = false;
              console.log(false);
              return;
            }
          }
          if (query[key] && query[key].$gte) {
            if (new Date(obj[key]) < new Date(query[key].$gte)) {
              ismatch = false;
              return;
            }
          }

          if (query[key] != obj[key] && !(query[key] && query[key].$lte) && !(query[key] && query[key].$gte)) {
            ismatch = false;
            return;
          }
        });
      }

      if (ismatch) {
        let objT1 = JSON.parse(JSON.stringify(obj));
        arrRes.push(objT1);
      }
    }

    if (!fields) {
      return { code: 1, message: 'success', data: arrRes };
    }
    let arrRes2 = [];
    for (let j = 0; j < arrRes.length; j++) {
      let objTemp = arrRes[j];
      let objRes = {};
      Object.keys(fields).forEach((key) => {
        if (fields[key]) {
          objRes[key] = objTemp[key];
        }
      });
      arrRes2.push(objRes);
    }
    return { code: 1, message: 'success', data: arrRes2 };
  },
  /**
   * 查找记录 不使用现有数据连接
   * @param {string} tableName 表名
   * @param {object} query 查询条件 {teantId:"supoin",billNo:"1002"}
   * @param {object} fields 返回字段 {billNo:1,billType:1,status:1}
   */
  Query: async function Query(tableName, query, fields) {
    return await this.QueryWithCon(null, tableName, query, fields);
  },
  /**
   * 插入多条数据 使用现有数据连接
   * @param {object} con 数据连接对象
   * @param {string} tableName 表名
   * @param {Array<object>} dataList 待插入的记录数组[{tenantId:"supoin",billNo:"1001"},{"tenantId":"supoin","billNo":"1002"}]
   */
  InsertManyWithCon: async function InsertManyWithCon(con, tableName, dataList) {
    if (!dataList || dataList.length < 1) {
      throw new Error('保存数组内容不能为空');
    }
    for (let i = 0; i < dataList.length; i++) {
      db_local[tableName].data.push(dataList[i]);
    }

    return { code: 1, message: 'success', data: { affectedRows: dataList.length } };
  },
  /**
   * 插入多条数据 不使用现有数据连接
   * @param {string} tableName 表名
   * @param {Array<object>} dataList 待插入的记录数组[{tenantId:"supoin",billNo:"1001"},{"tenantId":"supoin","billNo":"1002"}]
   */
  InsertMany: async function InsertMany(tableName, dataList) {
    return await this.InsertManyWithCon(null, tableName, dataList);
  },
  /**
   * 执行事务
   * @param {Function} callback 回调方法 (con)
   */
  ExecuteTrans: async function ExecuteTrans(callback) {
    try {
      let con = { id: 1 };
      let res_temp = await callback(con);
      console.log('commit');
      return res_temp;
    } catch (err) {
      console.log('rollback');
      return { code: -1, message: 'fail' + err.message };
    }
  },
};
module.exports.db_local_client = db_local_client;
