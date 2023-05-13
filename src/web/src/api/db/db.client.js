const io = require("socket.io-client");
const crypto = require("crypto");
// const end_point = "http://iot.supoin.com:6104";
// const end_point = 'http://iot.supoin.com:6104';
// const end_point = "http://localhost:6104";
const end_point = window.g.end_point;
const cache = require("../cache");
const options = {};
// options.transports = ['polling'];cd..
options.transports = ["websocket"];
options.forceBase64 = true;
const channel = {
  login_pc: {
    request: "api/pc/login/request",
    response: "api/pc/login/response",
  },
  getConnection: {
    request: "db/getConnection/request",
    response: "db/getConnection/response",
  },
  beginTrans: {
    request: "db/beginTrans/request",
    response: "db/beginTrans/response",
  },
  commitTrans: {
    request: "db/commitTrans/request",
    response: "db/commitTrans/response",
  },
  rollbackTrans: {
    request: "db/rollbackTrans/request",
    response: "db/rollbackTrans/response",
  },
  executeObjWithCon: {
    request: "db/executeObjWithCon/request",
    response: "db/executeObjWithCon/response",
  },
  // executeSqlWithCon: { request: "db/executeSqlWithCon/request", response: "db/executeSqlWithCon/response" },
  executeProc: {
    request: "db/executeProc/request",
    response: "db/executeProc/response",
  },
  sendSms: { request: "sms/send/request", response: "sms/send/response" },
  sendEmail: { request: "email/send/request", response: "email/send/response" },
  batchExecute: {
    request: "db/batchExecute/request",
    response: "db/batchExecute/response",
  },
};
Date.prototype.Format = function (format) {
  var date = {
    "M+": this.getMonth() + 1,
    "d+": this.getDate(),
    "h+": this.getHours(),
    "m+": this.getMinutes(),
    "s+": this.getSeconds(),
    "q+": Math.floor((this.getMonth() + 3) / 3),
    "S+": this.getMilliseconds(),
  };
  if (/(y+)/i.test(format)) {
    format = format.replace(
      RegExp.$1,
      (this.getFullYear() + "").substr(4 - RegExp.$1.length)
    );
  }
  for (var k in date) {
    if (new RegExp("(" + k + ")").test(format)) {
      format = format.replace(
        RegExp.$1,
        RegExp.$1.length == 1
          ? date[k]
          : ("00" + date[k]).substr(("" + date[k]).length)
      );
    }
  }
  return format;
};
const sign = {
  key: "supoin.iot@sz209",
  iv: "iot.supoin#Sz802",
  salt: "supoin@ms.bank",
  aes_encrypt: function aes_encrypt(key, iv, rawData) {
    key = Buffer.alloc(16, key, "utf-8");
    iv = Buffer.alloc(16, iv, "utf-8");
    let cipher = crypto.createCipheriv("aes-128-cbc", key, iv);
    cipher.setAutoPadding(true);
    let encoded = cipher.update(rawData, "utf-8", "base64");
    encoded += cipher.final("base64");
    return encoded;
  },
  md5: (str) => {
    let cryptor = crypto.createHash("md5");
    return cryptor.update(str).digest("hex");
  },
  encrypt: function encrypt(rawData) {
    let encryptData = this.aes_encrypt(
      sign.key,
      sign.iv,
      JSON.stringify(rawData)
    );
    return this.md5(encryptData + sign.salt + new Date().Format("YYYY-MM-dd"));
  },
};

const operateEnum = {
  query: "query",
  insert: "insert",
  update: "update",
  delete: "delete",
  insertMany: "insertMany",
};
function updateNullFilter(obj) {
  if (obj) {
    Object.keys(obj).forEach((key) => {
      if (obj[key] === undefined) {
        obj[key] = null;
      }
    });
  }
}
function checkPersonFilter(tableName, obj) {
  if (tableName == "tenant_bill" && obj) {
    let user = cache.user_get();
    obj.checkPersonId = user.employeeId;
    obj.checkTime = new Date().Format("YYYY-MM-dd hh:mm:ss");
  }
}
function createPersonFilter(obj) {
  if (obj) {
    let user = cache.user_get();
    if (Array.isArray(obj) && obj.length > 0) {
      for (let i = 0; i < obj.length; i++) {
        obj[i].createPerson = user.employeeId;
        obj[i].createTime = new Date().Format("YYYY-MM-dd hh:mm:ss");
      }
    } else {
      obj.createPerson = user.employeeId;
      obj.createTime = new Date().Format("YYYY-MM-dd hh:mm:ss");
    }
  }
}
function updatePersonFilter(obj) {
  if (obj) {
    let user = cache.user_get();
    if (Array.isArray(obj)) {
      for (let i = 0; i < obj.length; i++) {
        obj[i].updatePerson = user.employeeName + "[" + user.employeeId + "]";
        obj[i].updateTime = new Date().Format("YYYY-MM-dd hh:mm:ss");
      }
    } else {
      obj.updatePerson = user.employeeName + "[" + user.employeeId + "]";
      obj.updateTime = new Date().Format("YYYY-MM-dd hh:mm:ss");
    }
  }
}
/**
 * 为对象添加tenantId
 * @param {object} obj
 */
function tenantFilter(obj) {
  if (obj) {
    let user = cache.user_get();
    if (Array.isArray(obj)) {
      for (let i = 0; i < obj.length; i++) {
        obj[i].tenantId = user.tenantId;
      }
    } else {
      obj.tenantId = user.tenantId;
    }
  }
}
/**
 * 将对象中属性值为undefined的转化为null;
 * 防止JSON.stringify之后，值为undefined的属性被删除。
 * @param {object} obj
 */
function undefined_to_null(obj) {
  if (obj) {
    let user = cache.user_get();
    if (Array.isArray(obj)) {
      for (let each_obj of obj) {
        for (let key in each_obj) {
          if (each_obj[key] === undefined) {
            each_obj[key] = null;
          }
        }
      }
    }
  }
}

var dbClient = {
  getSocket: async function getSocket() {
    return new Promise((resolve, reject) => {
      // console.log("begin socket connect.");
      let socket = io(end_point, options);
      socket.on("connect", () => {
        // console.log("connect success." + socket.id);
        resolve(socket);
      });
      socket.on("disconnect", () => {
        // console.log("socket disconnected.");
      });
      socket.on("connect_error", (err) => {
        reject(err);
      });
    });
  },
  login: async function login(tenantId, userId, pwd) {
    return new Promise(async (resolve, reject) => {
      let socket = null;
      try {
        socket = await this.getSocket();
        let rawData = { tenantId, userId, pwd };
        let signature = sign.encrypt(rawData);
        let data = { signature: signature, body: rawData };
        socket.emit(channel.login_pc.request, JSON.stringify(data));
        socket.on(channel.login_pc.response, (res) => {
          res = JSON.parse(res);
          socket.close();
          resolve(res);
        });
      } catch (err) {
        if (socket) {
          socket.close();
        }
        reject(err);
      }
    });
  },
  getConnection: async function getConnection() {
    let socket = await this.getSocket();
    return new Promise((resolve, reject) => {
      let rawData = { id: socket.id };

      try {
        let signature = sign.encrypt(rawData);
        let user_cache = cache.user_get();
        // console.log(cache.cache_local);

        let data = {
          signature: signature,
          access_token: cache.access_token_get(),
          userId: user_cache.userId,
          body: rawData,
        };
        // console.log("get connection,");
        // console.log(data);
        // console.log("emit success.");
        socket.emit(channel.getConnection.request, JSON.stringify(data));
        socket.on(channel.getConnection.response, (res) => {
          // console.log("res success.");
          res = JSON.parse(res);
          if (res.code == 1) {
            resolve(socket);
          } else {
            this.Close(socket);
            reject(res);
          }
        });
      } catch (err) {
        this.Close(socket);
        reject(err);
      }
    });
  },
  executeChannel: async function executeChannel(con, channelObj, param) {
    return new Promise(async (resolve, reject) => {
      try {
        // console.log("请求参数.");
        // console.log(param);
        let needRelease = false;
        if (!con) {
          con = await this.getConnection();
          needRelease = true;
        }
        if (!param) {
          param = {};
        }
        param.id = con.id;
        let signature = sign.encrypt(param);
        let data = {
          signature: signature,
          access_token: cache.access_token_get(),
          userId: cache.user_get().userId,
          body: param,
        };
        // console.log("emit success.");
        con.emit(channelObj.request, JSON.stringify(data));
        con.on(channelObj.response, (res) => {
          // console.log("res success.");
          res = JSON.parse(res);
          if (needRelease) {
            con.close();
          }
          resolve(res);
        });
      } catch (err) {
        resolve({ code: -1, message: err.message });
      }
    });
  },
  executeObjWithCon: async function executeObjWithCon(
    con,
    operate,
    tableName,
    query,
    fields,
    dataContent,
    pageNum,
    pageSize,
    sortFields
  ) {
    if (!query) {
      query = {};
    }
    tenantFilter(query);
    return this.executeChannel(con, channel.executeObjWithCon, {
      operate,
      tableName,
      query,
      fields,
      dataContent,
      pageNum,
      pageSize,
      sortFields,
    });
  },
  QueryWithCon: async function QueryWithCon(
    con,
    tableName,
    query,
    fields,
    pageNum,
    pageSize,
    sortFields
  ) {
    return this.executeObjWithCon(
      con,
      operateEnum.query,
      tableName,
      query,
      fields,
      null,
      pageNum,
      pageSize,
      sortFields
    );
  },
  Query: async function Query(
    tableName,
    query,
    fields,
    pageNum,
    pageSize,
    sortFields
  ) {
    return this.QueryWithCon(
      null,
      tableName,
      query,
      fields,
      pageNum,
      pageSize,
      sortFields
    );
  },
  UpdateWithCon: async function UpdateWithCon(
    con,
    tableName,
    query,
    dataContent
  ) {
    updatePersonFilter(dataContent);
    updateNullFilter(dataContent);
    checkPersonFilter(tableName, dataContent);
    return this.executeObjWithCon(
      con,
      operateEnum.update,
      tableName,
      query,
      null,
      dataContent
    );
  },
  Update: async function Update(tableName, query, dataContent) {
    return this.UpdateWithCon(null, tableName, query, dataContent);
  },
  InsertWithCon: async function InsertWithCon(con, tableName, dataContent) {
    tenantFilter(dataContent);
    createPersonFilter(dataContent);
    console.log(dataContent);
    return this.executeObjWithCon(
      con,
      operateEnum.insert,
      tableName,
      null,
      null,
      dataContent
    );
  },
  Insert: async function Insert(tableName, dataContent) {
    return this.InsertWithCon(null, tableName, dataContent);
  },
  InsertManyWithCon: async function InsertManyWithCon(
    con,
    tableName,
    dataContent
  ) {
    tenantFilter(dataContent);
    createPersonFilter(dataContent);
    undefined_to_null(dataContent);
    return this.executeObjWithCon(
      con,
      operateEnum.insertMany,
      tableName,
      null,
      null,
      dataContent
    );
  },
  InsertMany: async function InsertMany(tableName, dataContent) {
    return this.InsertManyWithCon(null, tableName, dataContent);
  },
  DeleteWithCon: async function DeleteWithCon(con, tableName, query) {
    // if (!query) { query = {}; }
    // tenantFilter(query);
    // console.log("delete.query", query);
    return this.executeObjWithCon(
      con,
      operateEnum.delete,
      tableName,
      query,
      null,
      null
    );
  },
  Delete: async function Delete(tableName, query) {
    return this.DeleteWithCon(null, tableName, query);
  },
  ExecuteTrans: async function ExecuteTrans(callback) {
    let con_temp = null;
    let res_temp = null;
    let isTrans = false;
    try {
      con_temp = await this.getConnection();
      await this.executeChannel(con_temp, channel.beginTrans);
      isTrans = true;
      res_temp = await callback(con_temp);
      await this.executeChannel(con_temp, channel.commitTrans);
      this.Close(con_temp);
      return res_temp;
    } catch (err) {
      if (isTrans) {
        console.log("client rollback");
        await this.executeChannel(con_temp, channel.rollbackTrans);
      }
      this.Close(con_temp);
      // throw err;
      return { code: -1, message: err.message };
    }
  },
  Close: function Close(con) {
    try {
      if (con) {
        con.close();
      }
    } catch (err) {
      console.log(err);
    }
  },
  executeProc: async function (procName, paramContent) {
    let user = cache.user_get();
    let p_new = { tenantId: user.tenantId };
    delete paramContent.tenantId; //处理tenantId 存储过程第一个参数必须为tenantId
    Object.keys(paramContent).forEach((key) => {
      p_new[key] = paramContent[key];
    });
    // console.log("client-proc execute");
    return await this.executeChannel(null, channel.executeProc, {
      procName: procName,
      paramContent: p_new,
    });
  },
  executeProcWithCon: async function (con, procName, paramContent) {
    let user = cache.user_get();
    let p_new = { tenantId: user.tenantId };
    delete paramContent.tenantId; //处理tenantId 存储过程第一个参数必须为tenantId
    Object.keys(paramContent).forEach((key) => {
      p_new[key] = paramContent[key];
    });
    // console.log("client-proc execute");
    return await this.executeChannel(con, channel.executeProc, {
      procName: procName,
      paramContent: p_new,
    });
  },
};
module.exports.dbClient = dbClient;
