const param = {
    tenantId: "supoin",
    user: {
        userId: "admin"
    },
    assetStatus:
    {
        comment: "资产状态",
        enum: {
            free: { value: 0, desc: "空闲" },
            use: { value: 1, desc: "领用" },
            borrow: { value: 2, desc: "借用" },
            disposing: { value: 10, desc: "处置待确认" },
            disposed: { value: 11, desc: "处置完成" }
        }
    },
    assetUseStatus:
    {
        comment: "资产使用状态",
        enum: {
            normal: { value: 0, desc: "正常" },
            fault: { value: 1, desc: "故障" },
            maintain: { value: 2, desc: "维修中" }
        }
    }
}
module.exports.param = param;