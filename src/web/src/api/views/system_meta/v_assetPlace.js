const header = {
    main: {
        placeId: { zh: "位置编号", en: "", width: 120, align: "center", },
        placeName: { zh: "位置名称", en: "", width: 120, align: "center", },
        parentId: { zh: "上级位置", en: "", width: 120, align: "center", }
    }
}
const objTemplate = {
    currentPlaceId: {
        required: true,
        desc: "位置编号",
        value: null,
        updateDisable: true
    },
    currentPlaceName: {
        required: true,
        desc: "分类名称",
        value: null
    },
    placeId: {
        required: true,
        type: "tree",
        desc: "上级位置",
        field_select: { value: "placeId", display: "placeName" },
        dataSource: []
    }
}
module.exports.objTemplate = objTemplate;
module.exports.header = header;