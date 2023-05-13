/**
 * 系统枚举值操作方法
 */
/**
 * 获取使用状态枚举
 * @example
 * {
 *   code:1,message:"success",data:[{key: 0, desc: "正常"}]
 * }
 */
async function getEnum_useStatus() {
    return {
        code: 1, message: "success",
        data: [
            { value: 0, text: "正常" },
            { value: 1, text: "维修中" },
        ]
    }
}
/**
 * 获取购置类型枚举
 * @example
 * {
 *   code:1,message:"success",data:[{key: 0, desc: "采购"}]
 * }
 */
async function getEnum_purchaseType() {
    return {
        code: 1, message: "success",
        data: [
            { value: "0", text: "采购" },
            { value: "1", text: "外借" },
            { value: "2", text: "盘盈" },

        ]
    }
}
/**
 * 获取资产状态枚举
 * @example
 * {
 *   code:1,message:"success",data:[{key: 0, desc: "空闲"}]
 * }
 */
async function getEnum_assetStatus() {
    return {
        code: 1, message: "success",
        data: [
            { value: 0, text: "空闲" },
            { value: 1, text: "领用" },
            { value: 2, text: "借用" },
            { value: 10, text: "处置待确认" },
            { value: 11, text: "处置完成" }
        ]
    }
}
module.exports.getEnum_useStatus = getEnum_useStatus;
module.exports.getEnum_purchaseType = getEnum_purchaseType;
module.exports.getEnum_assetStatus = getEnum_assetStatus;