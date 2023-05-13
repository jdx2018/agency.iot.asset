const fs = require("fs");
const dbClient = require("../db/db.client").dbClient;
const table = require("../db/tableEnum").table;
const fileName = "d:/iot/assetClass2.csv";
let classList = [
    { classId: "Z000000", className: "固定资产", parentId: "Z000000" },
    { classId: "1000000", className: "土地、房屋及构筑物", parentId: "Z000000" },
    { classId: "2000000", className: "通用设备", parentId: "Z000000" },
    { classId: "3000000", className: "专用设备", parentId: "Z000000" },
    { classId: "4000000", className: "文物和和陈列品", parentId: "Z000000" },
    { classId: "5000000", className: "图书、档案", parentId: "Z000000" },
    { classId: "6000000", className: "家具、用具、装具及动植物", parentId: "Z000000" },
]
String.prototype.trimChar = function (char, type) {
    if (char) {
        if (type == 'left') {
            return this.replace(new RegExp('^\\' + char + '+', 'g'), '');
        } else if (type == 'right') {
            return this.replace(new RegExp('\\' + char + '+$', 'g'), '');
        }
        return this.replace(new RegExp('^\\' + char + '+|\\' + char + '+$', 'g'), '');
    }
    return this.replace(/^\s+|\s+$/g, '');
};
async function importCSV(fileName) {
    if (!fs.existsSync(fileName)) {
        console.log("文件不存在");
    }
    let content = fs.readFileSync(fileName).toString();
    // console.log(content);
    let arr = content.split("\r\n");
    console.log(arr);
    for (let i = 0; i < arr.length; i++) {
        // console.log(arr[i]);
        let classArr = arr[i].split(",");
        let classId = classArr[0];
        let className = classArr[1];
        let parentId = '';
        if (classId.length != 7) { continue; }
        if (classId.substr(3, 4) == "0000") {
            parentId = classId.substr(0, 1) + "000000";
        }
        else if (classId.substr(5, 2) == "00") {
            parentId = classId.substr(0, 3) + "0000";
        }
        else {
            parentId = classId.substr(0, 5) + "00";
        }
        let assetClass = { classId: classId, className: className, parentId: parentId };
        // console.log(assetClass);
        classList.push(assetClass);
        console.log(classList.length);
    }
    console.log(classList[classList.length - 1]);
    let res = await dbClient.InsertMany(table.tenant_asset_class, classList);
    console.log(res);

}
importCSV(fileName)