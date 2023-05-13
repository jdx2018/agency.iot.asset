// 设备监控主界面表头：

const typeDef = {
    comment: "设备报警邮件历史记录数据",
    messageMap: {
        "0": "邮件发送失败",
        "1": "邮件发送成功",
    },
    notifyTypeMap: {
        "1": "资产移位",
    }
}

const header = {
    main: {
        notifyType: { zh: "报警类型", en: "", width: 100, align: "center", },
        fromAddr: { zh: "发送邮箱", en: "", width: 150, align: "center", },
        toAddr: { zh: "目标邮箱", en: "", width: 150, align: "center", },
        title: { zh: "邮件标题", en: "", width: 300, align: "center", },
        content: { zh: "邮件正文", en: "", width: 300, align: "center", },
        message: { zh: "发送结果", en: "", width: 150, align: "center", },
        createTime: { zh: "发送时间", en: "", width: 180, align: "center", },
        createPerson: { zh: "发送人", en: "", width: 100, align: "center", },
        remarks: { zh: "备注", en: "", width: 150, align: "center", },
    }
}

// 设备报警邮件记录高级筛选配置：
var filter = {
    items_input: {
        toAddr: { desc: "目标邮箱", value: null },
    },
    items_select: {
        message: {
            desc: "邮件发送结果",
            type: "enum",
            value: null,
            dataSource: [
                { value: 0, text: "邮件发送失败" },
                { value: 1, text: "邮件发送成功" },
            ]
        },
        createTime_start: {
            desc: "创建时间-起",
            type: "dateTime",
            value: null
        },
        createTime_end: {
            desc: "创建时间-止",
            type: "dateTime",
            value: null
        },
    }
}

module.exports.typeDef = typeDef;
module.exports.header = header;
module.exports.filter = filter;