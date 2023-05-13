const template = {
    toDoList: {
        todo_guihuan: { execute: "query_guihuan_todo", },
        todo_chuzhi: { execute: "query_chuzhi_todo",  }
    },
    report_recent: {
        bill_inventory: { execute: "query_bill_inventory" },
        bill_jiechu: { execute: "query_bill_jiechu" },
        bill_guihuan: { execute: "query_bill_guihuan" },
        bill_paifa: { execute: "query_bill_paifa" },
        bill_tuiku: { execute: "query_bill_tuiku" },
        bill_chuzhi: { execute: "query_bill_chuzhi" },
        bill_weixiu: { execute: "query_bill_weixiu" }
    },
    quickMenu: [
        { componentName: "AssetsList", pageDesc: "资产列表" },
        { componentName: "LendAndReturn", pageDesc: "借出归还" },
        { componentName: "DestributeAndCancelStock", pageDesc: "派发退库" },
        { componentName: "InventoryManager", pageDesc: "盘点" },
    ]
}
module.exports.template = template;