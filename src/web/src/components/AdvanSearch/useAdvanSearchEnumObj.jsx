export default (filterConfig) => {
  let enumObj = {};
  if (filterConfig.items_input || filterConfig.items_select) {
    filterConfig.items_input && Object.keys(filterConfig.items_input).forEach((key) => {
      enumObj[key] = {
        type: "input",
        desc: filterConfig.items_input[key].desc,
      };
    });
    filterConfig.items_select && Object.keys(filterConfig.items_select).forEach((key) => {
      enumObj[key] = {
        type: filterConfig.items_select[key].type,
        desc: filterConfig.items_select[key].desc,
      };
      if (filterConfig.items_select[key].type === "enum" || filterConfig.items_select[key].type === "enum_input") {
        let obj = {};
        filterConfig.items_select[key].dataSource.forEach((item) => {
          obj[item.value] = item.text;
        });
        enumObj[key].valueEnum = obj;
      }
      if (filterConfig.items_select[key].type === "tree") {
        let obj = {};
        const desc = filterConfig.items_select[key].field_select.display;
        const item_key = filterConfig.items_select[key].field_select.value;
        filterConfig.items_select[key].dataSource && filterConfig.items_select[key].dataSource.forEach((item) => {
          obj[item[item_key]] = item[desc];
        });
        enumObj[key].valueEnum = obj;
      }
      if (filterConfig.items_select[key].type === "list") {
        let obj = {};
        const desc = filterConfig.items_select[key].field_select.display;
        const item_key = filterConfig.items_select[key].field_select.value;
        filterConfig.items_select[key].dataSource && filterConfig.items_select[key].dataSource.forEach((item) => {
          obj[item[item_key]] = item[desc];
        });
        enumObj[key].valueEnum = obj;
      }
    });
  }
  return enumObj;
}