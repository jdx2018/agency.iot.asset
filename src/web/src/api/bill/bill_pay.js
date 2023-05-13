const dbClient = require("../db").dbClient;
const table = require("../db/tableEnum").table;
const fieldTool = require("../tool/fieldTool");
const selectSource = require("../tool/selectSource");
const cache = require("../cache");

/**
 * 新增单据时获取主表信息显示模板
 * @param {string} supplierId 供应商编号
 * @param {array<>} payableList 应付列表数据
 */
async function getTemplate(supplierId, payableList) {
    let viewDef = cache.view_get().bill_pay;
    let user = cache.user_get();
    let objTemplate = viewDef.objTemplate;
    if (!payableList || payableList.length < 1) {
        return { code: -1, message: "应付列表不能为空." };
    }
    let amount_payable_sum = 0;
    for (let i = 0; i < payableList.length; i++) {
        amount_payable_sum += (payableList[i].payableAmount);
    }


    await selectSource.fillDataSource(objTemplate);
    objTemplate.operatePersonId.value = user.employeeName;
    objTemplate.supplierId.value = supplierId;
    objTemplate.payableAmount.value = amount_payable_sum;
    console.log("bill_pay.getTemplate", objTemplate);
    let res = { code: 1, message: "success", data: objTemplate };
    return res;
}
/**
 * 查询单据列表
 * @example
 * { code:"1",message:"success", data:{  header:{},  rows:{}, filter:{}  }
 */
async function queryBill(filter) {
    let viewDef = cache.view_get().bill_pay;
    let billType = viewDef.typeDef.type;
    let header_main = viewDef.header.main;
    let filter_template = viewDef.filter;
    let statusMap = viewDef.typeDef.statusMap;
    let sortFields = { createTime: 0 };
    //构造查询条件
    let query = { billType: billType };
    if (filter) {

        if (filter.payDate_start) {
            query.payDate = { $gte: filter.payDate_start }
            delete filter.payDate_start;
        }
        if (filter.payDate_end) {
            if (!query.payDate) {
                query.payDate = {};
            }
            query.payDate.$lte = filter.payDate_end;
            delete filter.payDate_end;
        }
        Object.keys(filter).forEach((key) => {
            query[key] = filter[key];
        });
    }

    let fields = fieldTool.header2Fields(header_main, null);

    let res_billList = await dbClient.Query(table.v_bill_pay_flow, query, fields,null,null,sortFields);

    if (res_billList.code != 1) { return res_billList };
    await selectSource.fillDataSource(filter_template.items_select);

    let rows = res_billList.data;
    for (let i = 0; i < rows.length; i++) {
        rows[i].status = statusMap[rows[i].status];
    }
    return {
        code: 1,
        message: "success",
        data: {
            header: header_main,
            filter: filter_template,
            rows: rows,
        },
    };
}

// /**
//  * 查询付款明细
//  * @param {*} billNo
//  */
// async function queryBillDetail(billNo) {
//     let viewDef = cache.view_get().bill_pay;
//     let billType = viewDef.typeDef.type;
//     let objTemplate = viewDef.objTemplate;

//     let query = { billNo: billNo, billType: billType };
//     let res_pay = await dbClient.Query(table.v_bill_pay_flow, query);
//     if (res_pay.code != 1) { return res_pay; }
//     if (res_pay.data.length > 0) {
//         Object.keys(objTemplate).forEach((key) => {
//             objTemplate[key].value = res_pay.data[0][key];
//         })
//     }
//     objTemplate.payableAmount.value = 1000;
//     await selectSource.fillDataSource(objTemplate);
//     // console.log("query bill detail", objTemplate);
//     return { code: 1, message: "success.", data: objTemplate };
// }
// /**
//  * 删除付款记录
//  * @param {*} billNo
//  */
// async function deleteBill(billNo) {
//     let viewDef = cache.view_get().bill_pay;
//     let billType = viewDef.typeDef.type;
//     let query = { billNo: billNo, billType: billType };
//     let res_check = await checkBeforeUpdateOrDelete(billNo);
//     if (res_check.code != 1) { return res_check; }
//     let res = await dbClient.Delete(table.tenant_bill_pay_flow, query);
//     return res;
// }
/**
 * 保存单据
 * 保存付款单，验证付款金额是否与应付金额相等，保存付款流水记录，更新应付款明细状态为已付
 * @param {object} payDetailObj 付款单对象
 * @param {array<billNo>}应付明细记录
 */
async function saveBill(payDetailObj, payableList) {
    let user = cache.user_get();
    let viewDef = cache.view_get().bill_pay;
    let objTemplate = viewDef.objTemplate;
    let bill_status = viewDef.typeDef.status;
    let prefix = viewDef.typeDef.prefix;
    let billType = viewDef.typeDef.type;
    if (!payDetailObj) {
        return { code: -1, message: "单据主表信息不能为空." };
    }
    if (!payableList || payableList.length < 1) {
        return { code: -1, message: "采购单号列表不能为空." };
    }
    Object.keys(objTemplate).forEach((key) => {
        if (objTemplate[key].required && !payDetailObj[key] && payDetailObj[key] != 0) {
            return { code: -1, message: objTemplate[key].desc + "不能为空." };
        }
    })
    let amount = payDetailObj.amount;
    let amount_payable_sum = 0;
    for (let i = 0; i < payableList.length; i++) {
        let query_payable = {
            supplierId: payDetailObj.supplierId,
            billNo: payableList[i].billNo,
            // billType: payableList[i].billType
        };
        let res_payable = await dbClient.Query(table.v_supplier_payable_detail, query_payable);
        // console.log("bill_pay.check payable",query_payable,res_payable,payableList);
        if (res_payable.code != 1) { return { code: -1, message: "验证应付金额失败" + res.message }; }
        let payableAmount = res_payable.data[0].payableAmount;
        amount_payable_sum += payableAmount;
    }
    if (amount_payable_sum != amount) {
        return { code: -1, message: "付款金额必须等于应付金额，请核对." + "应付:" + amount_payable_sum };
    }

    let mainObj = JSON.parse(JSON.stringify(payDetailObj));
    mainObj.billNo = prefix + Date.now(); //生成单据编号
    mainObj.billType = billType;
    mainObj.status = bill_status.final.value;

    mainObj.manage_orgId = user.manage_orgId;//可以管理单据的部门
    mainObj.operatePersonId = user.employeeId;
    let res = await dbClient.ExecuteTrans(async (con) => {
        //保存付款流水记录
        let res1 = await dbClient.InsertWithCon(con, table.tenant_bill_pay_flow, mainObj);
        if (res1.code != 1) { throw res1; }
        //更新应付款状态
        for (let i = 0; i < payableList.length; i++) {
            let update_where = {
                supplierId: payDetailObj.supplierId,
                billNo: payableList[i].billNo,
                billType: payableList[i].billType
            };
            let update_content = {
                status: 1
            }
            let res2 = await dbClient.UpdateWithCon(con, table.tenant_supplier_payable, update_where, update_content);
            if (res2.code != 1) { throw res2; }
        }
        return { code: 1, message: "success" };

    });
    return res;
}
// /**
//  * 
//  * @param {string} 单据编号
//  * @param {object}更新内容
//  */
// async function updateBill(billNo, mainObj) {
//     let viewDef = cache.view_get().bill_pay;
//     let objTemplate = viewDef.objTemplate;
//     let billType = viewDef.typeDef.type;
//     if (!billNo) {
//         return { code: -1, message: "单据编号不能为空." };
//     }
//     if (!mainObj) {
//         return { code: -1, message: "单据主表信息不能为空." };
//     }
//     Object.keys(objTemplate).forEach((key) => {
//         if (objTemplate[key].required && !mainObj[key] && mainObj[key] != 0) {
//             return { code: -1, message: objTemplate[key].desc + "不能为空." };
//         }
//     });
//     let res_check = await checkBeforeUpdateOrDelete(billNo);
//     if (res_check.code != 1) { return res_check; }
//     let query = { billNo: billNo, billType: billType };

//     let res = await dbClient.Update(table.tenant_bill_pay, query, mainObj);

//     return res;

// }
// /**
//  * 审核-扣减应付款
//  * @param {string} billNo 
//  */
// async function checkBill(billNo) {
//     let viewDef = cache.view_get().bill_pay
//     let billType = viewDef.typeDef.type;
//     let checked = viewDef.typeDef.status.final.value;
//     let query_pay = { billNo: billNo, billType: billType };
//     let res_pay = await dbClient.Query(table.v_bill_pay_flow, query_pay);
//     if (res_pay.code != 1) { return res_pay; }
//     if (res_pay.data.length < 1) { return { code: -1, message: "该单据不存在" }; }
//     let payObj = res_pay.data[0];
//     let billStatus = payObj.status;
//     if (billStatus >= checked) { return { code: -1, message: "该单据已审核，不能再次审核" }; }

//     let res = await dbClient.ExecuteTrans(async (con) => {
//         let res1 = await dbClient.UpdateWithCon(con, table.tenant_bill_pay_flow, query_pay, { status: checked });

//         if (res1.code != 1) { throw res1; }
//         //标记为已付款
//         let query_supplier_payable = { supplierId: payObj.supplierId, billNo: billNo, billType: billType };
//         let res_payable = await dbClient.QueryWithCon(con, table.tenant_supplier_payable, query_supplier_payable);
//         if (res_payable.code != 1) { throw res_payable; }
//         if (res_payable.data.length < 1) { throw new Error("不存在供应商应付款，无法通过审核.") }
//         let amount_remain = res_payable.data[0].payableAmount - payObj.amount;

//         let res_payable_update = await dbClient.UpdateWithCon(con,
//             table.tenant_supplier_payable,
//             query_supplier_payable,
//             { payableAmount: amount_remain });
//         if (res_payable_update.code != 1) {
//             throw res_payable_update;
//         }
//         return { code: 1, message: "审核成功." };
//     });
//     return res;
// }
// /**
//  * 更新校验，是否可以更新/删除单据
//  * @param {string} billNo 
//  */
// async function checkBeforeUpdateOrDelete(billNo) {
//     let viewDef = cache.view_get().bill_pay;
//     let bill_status_initial = viewDef.typeDef.status.initial.value;
//     let billType = viewDef.typeDef.type;
//     let query = { billNo: billNo, billType: billType };
//     let fields = { status: 1 };
//     let res_bill = await dbClient.Query(table.tenant_bill_pay, query, fields);
//     if (res_bill.code != 1) { return res_bill; }
//     let billStatus = res_bill.data[0].status;
//     if (billStatus != bill_status_initial) {
//         return { code: -1, message: "单据已处理，不能编辑/删除/审核." }
//     }
//     return { code: 1, message: "success." };
// }
module.exports.getTemplate = getTemplate;
module.exports.queryBill = queryBill;
module.exports.saveBill = saveBill;

