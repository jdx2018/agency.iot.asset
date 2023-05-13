/**
* table标题行定义生成fields对象 用户query对应的字段 
* 传入billType是为了将单据业务字段转换为扩展字段【数据库中存储的单据真实字段为ext扩展字段】
* @param {object} header 
* @param {int} typeDef  单据类型结构定义
*/
function header2Fields(header, fieldMap) {
    let fields = null;
    if (header) {
        fields = {};
        Object.keys(header).forEach((key) => {
            let fieldName = header[key].isExt && fieldMap && fieldMap[key] ? fieldMap[key] : key;
            fields[fieldName] = 1;//设置需要选择的列
        });
    }
    // console.log("header 字段拼装", fields);
    return fields;
}
/**
 * 业务字段转换为扩展字段
 * @param {*} sourceObj 
 * @param {*} typeDef 
 */
function field2Ext(sourceObj, fieldMap) {
    let sourceTemp = {};
    if (sourceObj && fieldMap) {
        Object.keys(sourceObj).forEach((key) => {

            let v = sourceObj[key] || sourceObj[key] == 0 ? sourceObj[key] : null;
            if (fieldMap[key]) {
                sourceTemp[fieldMap[key]] = v
            }
            else {
                sourceTemp[key] = v;
            }

        })
    }
    return sourceTemp;
}
/**
 * 扩展字段转换为业务字段 根据单据类型中的扩展字段定义进行转换
 * @param {object} billMain 
 */
function ext2Field(sourceObj, extMap) {
    let sourceTemp = {};
    if (sourceObj && extMap) {
        Object.keys(sourceObj).forEach((key) => {
            let v = sourceObj[key] || sourceObj[key] == 0 ? sourceObj[key] : null;
            if (extMap[key]) {
                sourceTemp[extMap[key]] = v
            }
            else {
                sourceTemp[key] = v;
            }
        })
    }
    return sourceTemp;
}
module.exports.header2Fields = header2Fields;
module.exports.ext2Field = ext2Field;
module.exports.field2Ext = field2Ext;