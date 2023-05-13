const header = {
    main: {
        classId: { zh: "分类编号", en: "", width: 120, align: "center", },
        className: { zh: "分类名称", en: "", width: 120, align: "center", },
        parentId: { zh: "上级分类", en: "", width: 120, align: "center", }
    }
}
const objTemplate = {
    currentClassId: {
        required: true,
        desc: "分类编号",
        value: null,
        updateDisable: true
    },
    currentClassName: {
        required: true,
        desc: "分类名称",
        value: null
    },
    classId: {
        required: true,
        type: "tree",
        desc: "上级分类",
        field_select: { value: "classId", display: "className" },
        dataSource: []
    }
}
module.exports.objTemplate = objTemplate;
module.exports.header = header;