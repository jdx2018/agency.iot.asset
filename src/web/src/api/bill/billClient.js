const dbClient = require("../db").dbClient;
const table = require("../db/tableEnum").table;
const cache = require("../cache");

const billCommon = require("./billCommon");
const assetStatusMap = {
    "0": "空闲",
    "1": "领用中",
    "2": "借用",
    "10": "处置待确认",
    "11": "处置完成"
};
/**
 * 保存单据公用方法
 * @param {*} billMain 单据主表
 * @param {*} billDetail 单据明细表
 * @returns
 */
async function saveBill(billMain, assetList, afterSaveFunc) {
    const user = cache.user_get();
    billMain.manage_orgId = user.manage_orgId;//可以管理单据的部门
    billMain.operatePersonId = user.employeeId;
    if (!assetList || assetList.length < 0) {
        return { code: -10, message: "单据明细不能为空." };
    }
    let assetList_t = [];
    for (let i = 0; i < assetList.length; i++) {
        let assetT = {
            assetId: assetList[i].assetId,
            tenantId: user.tenantId,
            billNo: billMain.billNo,
            billType: billMain.billType,
            status: billMain.status
        };
        assetList_t.push(assetT);
    }
    return await dbClient.ExecuteTrans(async (con) => {


        let res1 = await dbClient.InsertWithCon(con, table.tenant_bill, billMain);
        if (res1.code != 1) { throw res1; };
        // console.log("save main finish.");
        let res2 = await dbClient.InsertManyWithCon(con, table.tenant_bill_detail, assetList_t);
        if (res2.code != 1) { throw res2; }
        // console.log("save detail finish.");
        let res3 = await afterSaveFunc(con, assetList_t);
        if (res3.code != 1) { throw res3; }

        return { code: 1, message: "保存单据成功" };
    })
}

/**
 * 删除单据公用方法
 * @param {string} billNo 单据编号
 * @param {int} billType 单据类型
 */
async function deleteBill(billNo, billType) {

    return await dbClient.ExecuteTrans(async (con) => {
        try {
            await dbClient.DeleteWithCon(con, table.tenant_bill,
                { billNo: billNo, billType: billType }
            );
            await dbClient.DeleteWithCon(con, table.tenant_bill_detail,
                { billNo: billNo, billType: billType }
            );
            return { code: 1, message: "删除单据成功." };
        }
        catch (err) {
            return { code: -1, message: "删除单据失败." + err.message };
        }

    })
}


/**
 * 查询主从表表头和明细
 * @param {*} billNo 
 */
async function queryBillDetail(billNo, billType, extMap, detailHeader, billMain_template) {
    try {
        //查询主表信息
        let res_billMain = await dbClient.Query(table.tenant_bill,
            { billNo: billNo, billType: billType });
        //查询明细表
        let res_billDetail = await dbClient.Query(table.tenant_bill_detail,
            { billNo: billNo });

        if (res_billMain.code != 1) { return res_billMain; }

        if (!res_billMain.data || res_billMain.data.length < 1) { return { code: -1, message: "该单据不存在." }; }

        if (res_billDetail.code != 1) { return res_billDetail };

        let billMain = res_billMain.data[0];//取得主表数据
        let arrDetail = res_billDetail.data;//取得明细资产数据
        // console.log("查询单据明细-1",billMain);
        billMain = billCommon.ext2Field(billMain, extMap);//转换ext字段名称为业务字段

        console.log("查询单据明细-2", billMain);
        await billCommon.fillDataSource(billMain_template);
        Object.keys(billMain_template).forEach((key) => {
            billMain_template[key].value = billMain[key];
        });
        console.log("查询单据明细", billMain_template, billMain);
        let fields = billCommon.header2Fields(detailHeader);

        //匹配资产明细信息，后期用数据库视图替代
        let res_asset = await dbClient.Query(table.v_asset, null, fields);

        res_asset = res_asset.data;

        let arrAsset = [];
        for (let j = 0; j < arrDetail.length; j++) {
            //匹配资产明细信息
            let obj = arrDetail[j];
            for (let j1 = 0; j1 < res_asset.length; j1++) {
                let objAsset = res_asset[j1];
                if (objAsset.assetId == obj.assetId) {
                    objAsset.status = assetStatusMap[objAsset.status]
                    arrAsset.push(objAsset)
                    break;
                }
            }
        }
        return {
            code: 1, message: "success",
            data: {
                billMain: billMain_template,
                billDetail: { header: detailHeader, rows: arrAsset }
            }
        }
    }
    catch (err) {
        console.log(err);
        return { code: -1, message: err.message };
    }
}
module.exports.saveBill = saveBill;
module.exports.deleteBill = deleteBill;
module.exports.queryBillDetail = queryBillDetail;