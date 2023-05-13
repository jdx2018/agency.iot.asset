function isEmptyVal(unit) {
  return typeof unit === 'undefined' || unit === null || unit === '';
}
function list2Obj(arrList, key, v) {
  let arrObj = {};
  for (let i = 0; i < arrList.length; i++) {
    let keyTarget = arrList[i][key];
    // if (isEmptyVal(keyTarget)) { continue; }
    if (!arrObj[keyTarget]) {
      arrObj[keyTarget] = { exists: true, num: 1 };
      if (!isEmptyVal(v)) {
        arrObj[keyTarget].value = arrList[i][v];
      }
    } else {
      arrObj[keyTarget].num++;
    }

  }
  return arrObj;
}
module.exports.isEmptyVal = isEmptyVal;
module.exports.list2Obj = list2Obj;
