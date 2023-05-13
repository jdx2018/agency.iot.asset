const token = require("../auth/token");
const dbClient = require("../db/db.mysql");
/**
 * 用户验证登录
 * @param {*} userId 
 * @param {*} pwd 
 */
async function authUser(tenantId, userId, pwd) {
    try {
        const res_user = await dbClient.Query("tenant_user", { tenantId, userId });
        if (res_user.results.length < 1) {
            throw new Error("用户不存在.");
        }
        let user = res_user.results[0];
        if (user.password != pwd) {
            throw new Error("用户不存在或密码错误.");
        };
        const res_token = await token.sign(userId);
        if (res_token.code == 1) {
            return { code: 1, message: "success.", data: { access_token: res_token.data, user: user } };
        }
        return res_token;
    }
    catch (err) {
        // console.log(err)
        return { code: -102, message: err.message, }
    }
}
/**
 * pda验证登录
 * @param {*} sn 
 */
async function authPDA(sn) {
    return { code: 1, message: "success.", data: { access_token: "" } };
}
module.exports.authUser = authUser;
module.exports.authPDA = authPDA;