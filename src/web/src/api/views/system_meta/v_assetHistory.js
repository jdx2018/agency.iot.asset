const typeDef = {
  comment: '资产历史',
  actionMap: {
    0: '在库',
    1: '借出',
    2: '派发',
    3: '维修',
    4: '处置',
  },
};

const header = {
  main: {
    id: { zh: '数据序号', en: '', width: 120, align: 'center' },
    behavior: { zh: '操作', en: '', width: 120, align: 'center' },
    assetId: { zh: '资产编号', en: '', width: 120, align: 'center' },
    billNo: { zh: '单据编号', en: '', width: 120, align: 'center' },
    actionPerson: { zh: '操作人', en: '', width: 120, align: 'center' },
    actionTime: { zh: '操作时间', en: '', width: 120, align: 'center' },
  },
};

var filter = {
  items_input: {
    assetId: { desc: '资产编号', value: null },
    billNo: { desc: '单据编号', value: null },
  },
  items_select: {
    actionTime_start: {
      desc: '操作时间起',
      type: 'dateTime',
      value: null,
    },
    actionTime_end: {
      desc: '操作时间止',
      type: 'dateTime',
      value: null,
    },
  },
};
module.exports.typeDef = typeDef;
module.exports.header = header;
module.exports.filter = filter;
