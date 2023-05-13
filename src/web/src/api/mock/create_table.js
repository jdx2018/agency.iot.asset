const { db_mock } = require('./db_mock');
const fs = require("fs");
const needDrop = true;

function create_sql() {
    let sql_list = [];
    Object.keys(db_mock).forEach(tableName => {
        if (tableName != "common") {
            // 创建表结构：
            sql = "";
            if (needDrop) {
                sql += "drop table " + tableName + ";\r\n";
            }
            sql += "create table" + " " + tableName + "(" + "\n";
            Object.keys(db_mock["common"].fields).forEach(each_field => {
                sql += generate_each_field(each_field, db_mock["common"].fields[each_field]);
            })
            Object.keys(db_mock[tableName].fields).forEach(each_field => {
                sql += generate_each_field(each_field, db_mock[tableName].fields[each_field]);
            })
            sql += generate_PK("id") + ",\n";
            if (db_mock[tableName].unqiue) {
                sql += generate_unique(db_mock[tableName].unqiue) + "\n);";
            }
            sql_list.push(sql);

            // 插入数据：
            if (db_mock[tableName].data) {
                let insert_data_sql = generate_insert_data(tableName, db_mock[tableName].data);
                sql_list.push(insert_data_sql);
            }
        };
    });
    // 写入到SQL文件中：
    sql_list.map(each => {
        fs.appendFileSync("./create_table.sql", each + "\n\n");
    })
    return sql_list;
}

function generate_each_field(columName, columnDef) {
    let res = "";
    let colType = " " + columnDef.type;
    if (columnDef.type == "string") {
        colType = " varchar" + "(" + (columnDef.length ? columnDef.length : 4000) + ")";
    }
    res += columName;
    res += colType;
    if (columnDef.notNull) {
        res += " not null";
    }
    if (columnDef.hasOwnProperty('default')) {

        res += (" default " + columnDef.default);
    }
    if (columName == "id") {
        res += " auto_increment";
    }
    if (columnDef.desc) {
        res += (" comment " + "'" + columnDef.desc + "',");
    }

    res += "\n";
    return res;
}

function generate_PK(id) {
    return "primary key " + "(`" + id + "`)";
}

function generate_unique(unqiue) {
    let unqiue_str = "";
    unqiue.map(eachKey => {
        unqiue_str += "`" + eachKey + "`" + ","
    })
    return "unique " + "(" + unqiue_str.substr(0, unqiue_str.length - 1) + ")";
}

function generate_insert_data(tableName, data) {
    let insert_all_data_sql = "";
    data.map(each => {
        let each_data = "insert into" + " " + tableName + "";
        let key_str = "(";
        let value_str = "(";
        Object.keys(each).forEach(key => {
            key_str += key + ",";
            // 根据value值类型的不同，分别做格式化处理：
            let each_value = undefined;
            switch (typeof each[key]) {
                case "string":
                    each_value = "\"" + each[key] + "\"";
                    break;
                case "object":
                    each_value = JSON.stringify(each[key]);
                    break;
                default:
                    each_value = each[key];
            }
            value_str += each_value + ",";
        });
        key_str = key_str.substr(0, key_str.length - 1) + ")";
        value_str = value_str.substr(0, value_str.length - 1) + ")";

        each_data += key_str + " " + "values" + " " + value_str;
        insert_all_data_sql += each_data + ";\n";
    });
    return insert_all_data_sql;
}

create_sql();
console.log("execute finish");
// console.log(res)