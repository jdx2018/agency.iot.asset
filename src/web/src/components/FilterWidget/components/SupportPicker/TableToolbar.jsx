import React from "react";
import { Space } from "antd";
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
    setFilterData
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
            <SearchInput data={originData} columns={columns} onFilterDataChange={setFilterData} />
            <ColumnMenuSwitch columns={columns} columnsChange={setColumn} />
          </Space>
        </Card>
      </>
    );
  }
);
