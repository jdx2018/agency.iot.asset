const org_client = require('../org/org');
const utils = require("./utils");
const template = require("./template");
/**
 * 获取导入模板
 */
function getTemplate() {
    const t = template.getTemplateDef().org;
    return { code: 1, message: 'success', data: t };
}
/**
 * 校验机构数据
 * @param {array<orgId,orgName,parentId>} orgList
 * @returns
 * @example
 * { code:-1,message:"fail",data:[{rowIndex:2,errMessageList:[{columnName:"orgId",message:"机构编号不能为空"}]}]
 */
async function check(orgList) {
    if (!orgList || !Array.isArray(orgList) || orgList.length < 1) {
        return { code: -1, message: '机构列表不能为空.' };
    }
    console.log("机构列表", orgList);
    let res = await org_client.getOrgList_list(false);
    if (res.code != 1) {
        return res;
    }
    let objOrigin = utils.list2Obj(res.data, 'orgId');
    let objCurrent = utils.list2Obj(orgList, 'orgId');
    let code = 1;
    let message = '校验通过.';
    let errorList = [];

    for (let i = 0; i < orgList.length; i++) {
        let obj = orgList[i];
        let errObj = { rowIndex: i, errMessageList: [] };

        if (utils.isEmptyVal(obj.orgId)) {
            console.log("orgId", obj.orgId);
            errObj.errMessageList.push({ columnName: 'orgId', message: '机构编号不能为空' });
        }
        if (utils.isEmptyVal(obj.orgName)) {
            errObj.errMessageList.push({ columnName: 'orgName', message: '机构名称不能为空' });
        }
        if (utils.isEmptyVal(obj.parentId)) {
            errObj.errMessageList.push({ columnName: 'parentId', message: '上级机构不能为空' });
        }
        if (objOrigin[obj.orgId]) {
            errObj.errMessageList.push({ columnName: 'orgId', message: '机构ID与已有的值重复.' });
        }
        if (objCurrent[obj.orgId] && objCurrent[obj.orgId].num > 1) {
            errObj.errMessageList.push({ columnName: 'orgId', message: '机构ID在文件中的值有重复.' });
        }
        if (errObj.errMessageList.length > 0) {
            errorList.push(errObj);
        }
    }
    if (errorList.length > 0) {
        code = -1;
        message = '校验不通过.';
    }
    return {
        code: code,
        message: message,
        data: orgList,
        errorList: errorList,
    };
}
module.exports.getTemplate = getTemplate;
module.exports.check = check;
