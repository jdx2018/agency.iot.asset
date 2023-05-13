/**
 * 为上下级结构数据生成子级列表，每个父级可以直接关联所有子级ID
 */
function treeToSubList(rows, keyName, keyParentName, keySubName) {
    let nodePool = {};
    let subList = [];
    if (!rows || rows.length < 1) { return subList; }
    for (let i = 0; i < rows.length; i++) {
        let t = rows[i];
        let v_key = t[keyName];
        let v_parent = t[keyParentName];
        if (!nodePool[v_key]) {
            nodePool[v_key] = {};
            nodePool[v_key][keyName] = v_key;
            nodePool[v_key][keyParentName] = v_parent;

        }
    }

    let i = 0;
    Object.keys(nodePool).forEach((key) => {
        i++;
        let v_self = {};
        v_self[keyName] = key;
        v_self[keySubName] = key;
        v_self.isSub = 0;

        subList.push(v_self);
        let v_temp = nodePool[key];
        let v_sub_start = v_temp[keyName];
        while (v_temp && v_temp[keyParentName]) {
            i++;
            // console.log("遍历",i, v_temp);
            let v_sub = {};
            v_sub[keyName] = v_temp[keyParentName];
            v_sub[keySubName] = v_sub_start;
            v_sub.isSub = 1;
            if (v_sub[keyName] != 0) {
                subList.push(v_sub);
            }
            v_temp = nodePool[v_temp[keyParentName]];
        }
    })
    return subList;
}
module.exports.treeToSubList = treeToSubList;