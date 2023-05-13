import dayjs from 'dayjs';
import { 
  analysisBinarySheet,
  writeSheetWithTemplateError,
  writeSheetWithDataOrTemplate,
  writeSheetWithDataError,
  transformSheetToBlob
} from "./xlsxProcessedCore";

/**
 * [userRemove 根据传入的值删除数组中的一项或者多项, 如果是数组对象则传两个参数[key value]]
 * 处理普通数组, 三个参数
 * @param  {[Array]}   dataArr 处理的数组
 * @param  {[type]}    value 任意数组的值
 * @param  {[bool]}    isLeave true获取指定元素, false去除指定元素
 *
 * 处理数组对象 四个参数
 * @param  {[Array]}   dataArr 处理的数组
 * @param  {string}    key 数组对象的key, 可以通过"."读取深层次对象的属性,比如[{a: {b: 1}}]通过b的值删除元素, 则 key = "a.b"
 * @param  {[bool]}    isLeave true获取指定元素, false去除指定元素
 * @param  {[type]} 	 value 删除拥有此值的对象
 *
 * @return {[Array]}   result     返回删除或者获取指定元素后的数组, 不修改原有数组
 */
export function userFilter(dataArr, value, isLeave, key) {
  let result = [];
  if (key === undefined) {
    result = dataArr.filter((item) => {
      if (isLeave) {
        return item === value;
      } else {
        return item !== value;
      }
    });
  } else {
    let keys = key.split('.');
    result = dataArr.filter((item) => {
      let tempValue = item;
      keys.forEach((tempKey) => {
        tempValue = tempValue[tempKey];
      });
      if (isLeave) {
        return tempValue === value;
      } else {
        return tempValue !== value;
      }
    });
  }
  return result;
}

/**
 * [deepCopy 深拷贝对象]
 * @param  {[type]} obj [目标对象]
 * @return {[type]}     [复制的对象]
 */
export function deepCopy(obj) {
  if (!obj) return obj;
  let temp = obj.constructor === Array ? [] : {};
  for (let val in obj) {
    temp[val] = typeof obj[val] == 'object' ? deepCopy(obj[val]) : obj[val];
  }
  return temp;
}

function findIndex(dataArr, value) {
  let curIndex = 0;
  for (let i = 0; i < dataArr.length; i++) {
    if (value === dataArr[i]) {
      curIndex = i;
      break;
    }
  }
  return curIndex;
}

/**
 * [getUploadExcel 点击上传Excel文件]
 * @param  {Function} callback      Excel文件上传完成后回调
 * @param  {Array}    template      表格的模板: [{key: "name", desc: "姓名"}, ...]], 没有顺序要求, 可以不传.
 * @param  {Object}   formatMethods 格式化方法的集合, 属性名代表模板的key, 可以不传.
 * @return {[type]}                 无返回值.
 */
export function getUploadExcel(
  callback = (value) => console.log(value),
  template = [],
) {
  let inputDom = document.createElement('input');
  inputDom.setAttribute('type', 'file');
  inputDom.setAttribute('accept', '.xlsx'); //不支持 .xls xlsx.read()会报错
  inputDom.addEventListener('change', (e) => {
    const inputDom = e.target;
    const reader = new FileReader();
    reader.onload = async () => {
      let uploadResult = await analysisBinarySheet(reader.result, template);
      if (uploadResult[0].code === 1) {
        let uploadJson = uploadResult[0]?.data;
        if (Array.isArray(uploadJson)) callback(uploadJson);
      } else {
        console.log("uploadResult", uploadResult);
        exportExcelWithTemplateError(uploadResult[0]);
        global.$showMessage({
          message: '模板错误导入失败',
          autoHideDuration: 5000,
          type: 'error',
        });
      }
      inputDom.value = '';
    };
    reader.readAsBinaryString(inputDom.files[0]);
  });
  inputDom.click();
}

//错误信息系的样式
const boderStyle = {
  top: { style: 'thin', color: { auto: 1 } },
  bottom: { style: 'thin', color: { auto: 1 } },
  left: { style: 'thin', color: { auto: 1 } },
  right: { style: 'thin', color: { auto: 1 } },
};
const defaultExcelStyle = {
  bodyDataStyle: {
    cellErrorStyle: {
      font: { name: '宋体', /*color: {rgb: "80FF3300"}, */ bold: 'true' },
      fill: { fgColor: { rgb: 'FFFF1A1A' } }, // 红色
      //border: boderStyle,
    },
    rowErrorStyle: {
      font: { name: '宋体' },
      fill: { fgColor: { rgb: 'FFFFFF00' } }, //黄色, 此为警告列, 警告列的背景色的优先级比错误列和补充列的背景色优先级更高
      //border: boderStyle,
    },
    cellStyle: {
      font: { name: '宋体' },
      //border: boderStyle,
    },
  },
  headerNameStyle: {
    errorHeaderNameStyle: {
      //错误列标题本身的样式
      font: { name: '宋体', /* color: {rgb: "FFFFFFFF"},*/ bold: 'true' },
      fill: { fgColor: { rgb: 'FFFF1A1A' } }, //红色
      border: boderStyle,
    },
    errorHeaderNameColStyle: {
      //错误列标题的列的样式
      fill: { fgColor: { rgb: 'FFFF1A1A' } }, //红色
      font: { name: '宋体' },
      border: boderStyle,
    },
    lostHeaderNameStyle: {
      //额外补充列的标题的样式
      font: { name: '宋体' /*, color: {rgb: "FFFFFF00"}*/, bold: 'true' },
      fill: { fgColor: { rgb: 'E6FFCC33' } }, //橙色
      border: boderStyle,
    },
    lostHeaderNameColStyle: {
      //额外补充的列的样式
      fill: { fgColor: { rgb: 'E6FFCC33' } }, //橙色
      border: boderStyle,
    },
    requiredHeaderNameStyle: {
      font: { name: '宋体', color: { rgb: 'FFFF1A1A' }, bold: 'true' },
      //fill: {fgColor: {rgb: "E66BDB4D"}}, //绿色
      fill: { fgColor: { rgb: '809CC4E4' } },
      border: boderStyle,
    },
    cellStyle: {
      fill: { fgColor: { rgb: '809CC4E4' } },
      border: boderStyle,
    },
  },
  sheetTitleStyle: {
    templateErrorStyle: {
      font: { name: '楷体', sz: 14, color: { rgb: 'CCFF3700' } },
      alignment: {wrapText: 1, vertical: 'top'},
    },
  }
};

//转化错误报告对象为特定格式
/**
 * [transformErrorDataPosition 转化错误数据位置描述对象的格式的方法]
 * @param  {Object} errorDataPosition [错误数据位置描述对象]
 * errorDataPosition 示例: 
 * let data = [{...}, {...}, ...] //存在一个列表数据 data
 * let goodsInfoErrorDataPosition = {
    1: ["goodsName"], //表示 data 数据中的第 1 条数据的 goodsName 属性存在错误数据(位置是从 0 开始算的)
    3: ["price", "sales"],
    5: ["saleDate"]
  };
 * @param  {Array}  template          [description]
 * @return {[type]}                   [description]
 */
/*export function transformErrorDataPosition(errorDataPosition = {}, template = []) {
  let excelHeaderName = {};
  for(let i = 0; i < template.length; i++) {
    let mathFloor = Math.floor(i/26);
    let remainder = i%26;
    if(mathFloor === 0) {
      excelHeaderName[template[i].key] = String.fromCharCode(65 + i)
    } else {
      excelHeaderName[template[i].key] = String.fromCharCode(65 + mathFloor - 1) + String.fromCharCode(65 + remainder)
    }
  }

  let _errorDataPosition = {};
  Object.keys(errorDataPosition).forEach(rowKey => {
    let errorProps = errorDataPosition[rowKey];
    let transformErrorProps = [];
    errorProps.forEach(props => {
      if(excelHeaderName.hasOwnProperty(props)) {
        transformErrorProps.push(excelHeaderName[props] + (parseInt(rowKey) + 2));
      }
    });
    _errorDataPosition[parseInt(rowKey) + 2] = transformErrorProps;
  })
  return _errorDataPosition;
}*/

/**
 * [transformErrorDataPosition 转化错误数据位置描述对象的格式的方法]
 * @param  {Array}  errorDataPosition 错误数据的描述集合
 * 例子
 * let error = [
  {rowNum: 1, columnName: "assetId", reason: "重复, 不能为空"},
  {rowNum: 1, columnName: "epc", reason: "重复"},
  {rowNum: 2, columnName: "documentDate", reason: "格式错误"},
  {rowNum: 2, columnName: "invoiceType", reason: "数据类型错误"},
  {rowNum: 5, columnName: "ownOrgId", reason: "不能为空"},
  {rowNum: 8, columnName: "purchaseDate", reason: "格式错误"},
]
 * @param  {Array}  template          导出Excel的模板
 * @return {Object}                   转化后的错误描述对象
 * 例子
 * {
    3: {
      errorList: ["A3", "D3"]
      message: ["AssetId重复, 不能为空", "EPC重复"]
    },
    4: {
      errorList: ["K4", "I4"], 
      message: ["documentDate格式错误", "invoiceType数据类型错误"]
    },
    7: {
      errorList: ["N7"],
      message: ["ownOrgId不能为空"]
    },
    10: {
      errorList: ["S10"],
      message: ["purchaseDate格式错误"]
    },
  }
  1. 对象的属性名表示在excel中的第几行
  2. errorList表示错误的字段在Excel中的单元格位置
  3. message表示在导出Excel文件最后一列中插入的数据错误的提示
 */
/*export function transformErrorDataPosition(errorDataPosition = [], template = []) {
  let excelHeaderName = {};
  for (let i = 0; i < template.length; i++) {
    let mathFloor = Math.floor(i / 26);
    let remainder = i % 26;
    if (mathFloor === 0) {
      excelHeaderName[template[i].key] = String.fromCharCode(65 + i);
    } else {
      excelHeaderName[template[i].key] = String.fromCharCode(65 + mathFloor - 1) + String.fromCharCode(65 + remainder);
    }
  }

  let _errorDataPosition = {};
  errorDataPosition.forEach((errorInfo) => {
    let { rowIndex, errMessageList = [] } = errorInfo;
    let curRowInExcel = parseInt(rowIndex + 1) + 2;

    let errorList = [];
    let errprMessage = {};
    errMessageList.forEach((fieldError, index) => {     
      let { columnName, message } = fieldError;
      let curCell = excelHeaderName[columnName] + curRowInExcel;

      if(errprMessage.hasOwnProperty(curCell)) {
        errprMessage[curCell]["message"].push(message);
      } else {
        errorList.push(curCell);
        errprMessage[curCell] = {message: [message], index};
      }
    })

    _errorDataPosition[curRowInExcel] = { errorList, message: errprMessage };
  });
  return _errorDataPosition;
}*/
export function transformErrorDataPosition(errorDataPosition = [], template = []) {
  let _errorDataPosition = deepCopy(errorDataPosition);
  _errorDataPosition.forEach(errorItem => {
    let { errMessageList } = errorItem;
    errMessageList = errMessageList.map(errorField => {
      let { columnName } = errorField;
      let templateItem = userFilter(template, columnName, true, "key")[0];
      errorField["columnDesc"] = templateItem.desc;
      return errorField;
    })
  })
  return _errorDataPosition
}

/*   导出报表类型的Excel文件---开始区域   */

function encode_cell(cell) {
  var col = cell.c + 1;
  var s = "";
  for (; col; col = ((col - 1) / 26) | 0) s = String.fromCharCode(((col - 1) % 26) + 65) + s;
  return s + (cell.r + 1);
}

//转化Excel的显示范围
function encode_range(cs, ce) {
  if (typeof ce === 'undefined' || typeof ce === 'number') {
    return encode_range(cs.s, cs.e);
  }
  if (typeof cs !== 'string') cs = encode_cell((cs));
  if (typeof ce !== 'string') ce = encode_cell((ce));
  return cs == ce ? cs : cs + ":" + ce;
}

//根据表格的范围计算出表格完整的列和数据总数, 如: "A1:C3" => ["A", "B", "C"], 最大列宽为: "A1:ZZ1"
function calculateExcelColumnsKeys(columnsRange = 'A1:A1') {
  let result = [];
  let keyRange = [];
  let total = 0;
  columnsRange.split(':').forEach((item) => {
    let key = item.match(/^[a-z|A-Z]+/gi)[0];
    let length = key.length;
    let temp = [];
    for (let i = 0; i < length; i++) {
      temp.unshift(key[i].charCodeAt());
    }
    keyRange.push(temp);
    total = parseInt(item.match(/\d+$/gi));
  });
  let totalColumns = 0;
  keyRange[1].forEach((item, index) => {
    let scale = Math.pow(26, index);
    totalColumns += (item - 65 + 1) * scale;
  });
  for (let i = 0; i < totalColumns; i++) {
    let mathFloor = Math.floor(i / 26);
    let remainder = i % 26;
    if (mathFloor === 0) {
      result.push(String.fromCharCode(65 + i));
    } else {
      result.push(String.fromCharCode(65 + mathFloor - 1) + String.fromCharCode(65 + remainder));
    }
  }
  return {
    total: total,
    columnsKeys: result,
  };
}

function offsetMergeConfig(mergeConfig, insertFlag, offsetValue) {
  let result = [];
  mergeConfig.forEach((item, index) => {
    let { s, e } = item;
    let rStart = s.r;
    let rEnd = e.r;
    const cStart = s.c;
    const cEnd = e.c;
    if (rStart >= insertFlag - 1) {
      rStart += offsetValue;
      rEnd += offsetValue;
    }
    result.push({ s: { r: rStart, c: cStart }, e: { r: rEnd, c: cEnd } });
  });
  return result;
}

/**
 * [caculateColumnsArea 通过指定的列范围 "E1:J1" 转换成 ["E", "F", "G", "H", "I", "J"]]
 * @param  {[type]} columnsRange [Excel的列范围 比如 "E1:J1"]
 * @param  {[type]} columnsCount [总共有多少列 "E1:J1" 有 6 列]
 * @return {[type]}              [ 转换的结果 比如 "E1:J1" ==>> ["E", "F", "G", "H", "I", "J"]]
 */
function caculateColumnsArea(columnsRange, columnsCount) {
  let result = [];
  let keyRange = [];
  columnsRange.split(':').forEach((item) => {
    let key = item.match(/^[a-z|A-Z]+/gi)[0];
    let length = key.length;
    let temp = [];
    for (let i = 0; i < length; i++) {
      temp.unshift(key[i].charCodeAt() - 65);
    }
    keyRange.push(temp);
  });

  let startColumns = keyRange[0];
  for (let i = 0; i < columnsCount; i++) {
    let unit = i + startColumns[0];
    let scale = [];

    let __startColumns = startColumns.map((item, index) => {
      let temp = item;
      if (index === 0) {
        temp = unit;
      }
      let mathFloor = Math.floor(temp / 26);
      let remainder = temp % 26;
      scale.unshift(mathFloor);

      if (mathFloor !== 0) {
        temp = remainder;
      }

      if (index > 0) {
        return String.fromCharCode(temp + scale[index] + 65);
      } else {
        return String.fromCharCode(temp + 65);
      }
    });

    if (scale.reverse()[0] !== 0 && __startColumns.length === 1) {
      __startColumns.push(String.fromCharCode(scale.reverse()[0] - 1 + 65));
    }

    result.push(__startColumns.reverse());
  }

  return result.map((item) => {
    return item.reduce((prev, current) => prev + current);
  });
}

/**
 * [calculateMergeAreaCell
 *  输入 [{s: {r: 0, c: 0}, e: {r: 2, e: 1}}, ...] 输出 [[A1, A2, A3, B1, B2, B3], ...]
 *
 * ]
 * @param  {[type]} mergeConfig [description]
 * @return {[type]}             [description]
 */
function calculateMergeAreaCell(mergeConfig, extraDataConfig) {
  let result = {};
  let { insertFlag, extraData, template } = extraDataConfig;

  let tableTitle = {};
  template.forEach((item) => (tableTitle[item.key] = item.desc));
  extraData.unshift(tableTitle);

  if (!Array.isArray(mergeConfig)) return result;
  const defaultStyle = {
    font: { name: '宋体', sz: 11, color: { auto: 1 } },
    alignment: {
      horizontal: 'center',
      vertical: 'center',
      wrapText: 1,
    },
    border: {
      top: { style: 'thin', color: { auto: 1 } },
      bottom: { style: 'thin', color: { auto: 1 } },
      left: { style: 'thin', color: { auto: 1 } },
      right: { style: 'thin', color: { auto: 1 } },
    },
  };

  let Δrow;
  mergeConfig.forEach((mergeArea) => {
    let flagAreaCell = '';
    let areaCellList = {};
    const { s, e, config = {} } = mergeArea;
    let rStart = s.r;
    let rEnd = e.r;
    const cStart = s.c;
    const cEnd = e.c;

    if (!Δrow && rEnd >= insertFlag - 1) {
      let cellList = {};
      Δrow = extraData.length;
      let mergeAreaCell = encode_range({
        s: { r: 0, c: 0 },
        e: { r: 0, c: template.length - 1 },
      });
      let columnsKeys = caculateColumnsArea(mergeAreaCell, template.length);
      extraData.forEach((item, index) => {
        template.forEach((templateItem, templateIndex) => {
          let cellKey = columnsKeys[templateIndex];
          cellList[cellKey + (index + insertFlag)] = {
            v: item[templateItem.key] ? item[templateItem.key] : '',
            s: defaultStyle,
          };
        });
      });
      result = { ...result, ...cellList };
    }

    if (Δrow) {
      rStart += Δrow;
      rEnd += Δrow;
    }

    for (let i = rStart; i < rEnd + 1; i++) {
      let mergeAreaCell = encode_range({
        s: { r: i, c: cStart },
        e: { r: i, c: cEnd },
      });

      if (mergeAreaCell.indexOf(':') !== -1) {
        let columnsKeys = caculateColumnsArea(mergeAreaCell, cEnd - cStart + 1);
        columnsKeys.forEach((cellKey, index) => {
          let v = '';
          if (i === rStart && index === 0) v = config.value;
          areaCellList[cellKey + (i + 1)] = {
            v: v,
            s: config.style ? config.style : defaultStyle,
          };
        });
      } else {
        areaCellList[mergeAreaCell] = {
          v: config.value,
          s: config.style ? config.style : defaultStyle,
        };
      }
    }
    result = { ...result, ...areaCellList };
  });

  return result;
}

//输入 [A1, L2] 输出 {
//   s: {r: 0, c: 0},
//   e: {r: 1, c: 11}
// },
export function transformMergeConfig(mergeConfig) {
  let result = [];
  if (!Array.isArray(mergeConfig)) return [];
  let { columnsKeys } = calculateExcelColumnsKeys('A1:ZZ1');
  mergeConfig.forEach((item) => {
    let [s, e, config] = item;
    const rStart = parseInt(s.match(/\d+$/gi));
    const cStart = s.match(/^[a-z|A-Z]+/gi)[0];

    const rEnd = parseInt(e.match(/\d+$/gi));
    const cEnd = e.match(/^[a-z|A-Z]+/gi)[0];

    result.push({
      s: { r: rStart - 1, c: findIndex(columnsKeys, cStart) },
      e: { r: rEnd - 1, c: findIndex(columnsKeys, cEnd) },
      config: config,
    });
  });
  return result;
}

function analysisTableStament(config = {}) {
  const { mergeConfig = [], columnsTotal, rowTotal, extraDataConfig, colConfig = [] } = config;
  let { insertFlag, extraData } = extraDataConfig;

  let exportTableCulumnsRange = encode_range({
    s: { r: 0, c: 0 },
    e: { r: rowTotal - 1, c: columnsTotal - 1 },
  });

  let mergeAreaCell = calculateMergeAreaCell(mergeConfig, extraDataConfig);

  let sheet = { '!ref': exportTableCulumnsRange, ...mergeAreaCell };

  let _mergeConfig = offsetMergeConfig(mergeConfig, insertFlag, extraData.length);

  let rowConfig = [{ hpx: 18 }, { hpx: 32 }, { hpx: 20 }, { hpx: 20 }];
  /*extraData.forEach(item => {
    rowConfig.push({hpx: 20});
  })*/

  sheet['!merges'] = _mergeConfig;
  sheet['!rows'] = rowConfig;
  sheet['!cols'] = colConfig;

  return sheet;
}

//导出一个数组对象为Excel文件
export async function exportTableStament(config) {
  const { excelName = '导出表格' } = config;
  const sheet = analysisTableStament(config);

  const saveName = `${excelName}.xlsx`;

  let blobUrl = await transformSheetToBlob({ sheet: sheet, sheetName: 'sheet1' }); 

  openDownloadDialog(blobUrl, saveName);
}

/*   导出报表类型的Excel文件---结束区域   */

//Excel文件专用颜色值转换  rgb("") ===>>>
function rgb2hex(rgb) {
  var rgbm = rgb.match(
    /^rgba?[\s+]?\([\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?,[\s+]?((?:[0-9]*[.])?[0-9]+)[\s+]?\)/i
  );
  if (rgbm && rgbm.length === 5) {
    return (
      '#' +
      (
        '0' +
        Math.round(parseFloat(rgbm[4], 10) * 255)
          .toString(16)
          .toUpperCase()
      ).slice(-2) +
      ('0' + parseInt(rgbm[1], 10).toString(16).toUpperCase()).slice(-2) +
      ('0' + parseInt(rgbm[2], 10).toString(16).toUpperCase()).slice(-2) +
      ('0' + parseInt(rgbm[3], 10).toString(16).toUpperCase()).slice(-2)
    );
  } else {
    var rgbm = rgb.match(/^rgba?[\s+]?\([\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?/i);
    if (rgbm && rgbm.length === 4) {
      return (
        '#' +
        ('0' + parseInt(rgbm[1], 10).toString(16).toUpperCase()).slice(-2) +
        ('0' + parseInt(rgbm[2], 10).toString(16).toUpperCase()).slice(-2) +
        ('0' + parseInt(rgbm[3], 10).toString(16).toUpperCase()).slice(-2)
      );
    } else {
      return 'cant parse that';
    }
  }
}

/**
 * 通用的打开下载对话框方法，没有测试过具体兼容性
 * @param url 下载地址，也可以是一个blob对象，必选
 * @param saveName 保存文件名，可选
 */
function openDownloadDialog(url, saveName) {
  if(typeof url === 'object' && url instanceof Blob) {
    url = URL.createObjectURL(url); // 创建blob地址
  }
  let aLink = document.createElement('a');
  aLink.href = url;
  aLink.download = saveName || ''; // HTML5新增的属性，指定保存文件名，可以不要后缀，注意，file:///模式下不会生效
  let event;
  if(window.MouseEvent) {
    event = new MouseEvent('click');
  } else {
    event = document.createEvent('MouseEvents');
    event.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
  }
  aLink.dispatchEvent(event);
}


//导出数据验证失败的Excel
export async function exportExcelWithVerifyError({
  sheet,
  errorDataPosition,
  template,
  titleMessage,
  excelName = "数据验证结果",
  defaultStyle = defaultExcelStyle
}) {
  let workbook = await writeSheetWithDataError(sheet, errorDataPosition, template, titleMessage, defaultStyle);
  openDownloadDialog(workbook, `${excelName}.xlsx`);
}

//导出正常数据
//1.有模板或者无模板导入
//2.是否拥有第一行提示信息
//  (1)导出模板拥有第一行的提示信息
//  (2)导出正常数据则没有提示信息
//3.可多sheet导出, 每个sheet之间没有属性共用
export async function exportExcelWithManySheet({
  excelName = '导出表格',
  sheetsConfig = [],
  defaultStyle = defaultExcelStyle
}) {
  let workBook = await writeSheetWithDataOrTemplate(sheetsConfig, defaultStyle);
  openDownloadDialog(workBook, `${excelName}.xlsx`);
}

//导出错误模板的Excel
export async function exportExcelWithTemplateError({
  lostSheetCellList,
  unMatchSheetCellList,
  sheet,
  template,
  excelName = '模板匹配结果',
}) {
  let workbook = await writeSheetWithTemplateError(
    lostSheetCellList,
    unMatchSheetCellList,
    sheet,
    template,
  );
  openDownloadDialog(workbook, `${excelName}.xlsx`);
}

//解析上传的Excel
export function analysisUploadExcel(
  callback = (value) => console.log(value),
  template = [],
  beforAnalysis = () => console.log("start")
) {
  let inputDom = document.createElement("input");
  inputDom.setAttribute("type", "file");
  inputDom.setAttribute("accept", ".xlsx"); //不支持 .xls xlsx.read()会报错
  inputDom.addEventListener("change", (e) => {
    const inputDom = e.target;
    const reader = new FileReader();
    reader.onload = async () => {
      beforAnalysis();
      let workBook = await analysisBinarySheet(reader.result, template);
      callback(workBook);
      inputDom.value = "";
    };
    reader.readAsBinaryString(inputDom.files[0]);
  });
  inputDom.click();
}