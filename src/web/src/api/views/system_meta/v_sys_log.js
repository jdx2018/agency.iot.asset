const typeDef = {
    comment: "系统日志",
    opTargetMap: {
        'assetList': '资产列表',
        'login': '用户登录',
    },
    opTypeMap: {
        'add': '新增',
        'addMany': '批量新增',
        'delete': '删除',
        'update': '更新'
    }
}
const header = {
    main: {
        opUserId: { zh: "操作用户", en: "", width: 120, align: "center", },
        opTarget: { zh: "操作对象", en: "", width: 120, align: "center", },
        opType: { zh: "操作类型", en: "", width: 120, align: "center", },
        opContent: { zh: "操作内容", en: "", width: 240, align: "center", },
        opTime: { zh: "操作时间", en: "", width: 120, align: "center", },
    }
}
/**
 * 资产列表界面高级筛选配置
 */
var filter = {
    items_input: {
        opUserId: { desc: "操作用户", value: null },
        opTarget: { desc: "操作对象", value: null },
        opType: { desc: "操作类型", value: null },
    },
    
    items_select: {
        opTime_start: {
            desc: '操作时间-起',
            type: 'dateTime',
            value: null,
        },
        opTime_end: {
            desc: '操作时间-止',
            type: 'dateTime',
            value: null,
        },
    }
}

module.exports.header = header;
module.exports.filter = filter;
module.exports.typeDef = typeDef;