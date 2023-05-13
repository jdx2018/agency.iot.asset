import React from "react";
import { Space, Checkbox } from "antd";
import { Card } from "@material-ui/core";
import {
  SearchInput, ColumnMenuSwitch,
} from "components";

export default React.memo(
  ({
    selected,
    originData,
    columns,
    setColumn,
    setFilterData,
    isSearchAll,
    onSearchAllCheckboxChange
  }) => {
    return (
      <>
        <Card
          style={{
            marginBottom: 10,
            padding: 10,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            boxShadow: "none",
          }}
        >
          <Space size={10}>
            <div></div>
          </Space>
          <Space size={10}>
            <div><Checkbox checked={isSearchAll} onChange={(e) => {
              onSearchAllCheckboxChange(e.target.checked)
            }}>搜索全部</Checkbox></div>
            <SearchInput data={originData} columns={columns} onFilterDataChange={setFilterData} />
            <ColumnMenuSwitch columns={columns} columnsChange={setColumn} />
          </Space>
        </Card>
      </>
    );
  }
);
