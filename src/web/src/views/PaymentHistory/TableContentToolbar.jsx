import React from "react";
import { Space, Button } from "antd";
import { Card } from "@material-ui/core";
import TableActionDialogContent from "./TableActionDialogContent";
import { SearchInput, ColumnMenuSwitch } from "components";

export default React.memo(
  ({
    selected,
    setSelectedRowKeys,
    originData,
    columns,
    setColumn,
    setFilterData,
    refreshData
  }) => {
    const selectedRowKeys = Object.values(selected).reduce((acc, cur) => acc.concat(cur), []);

    const handlePay = () => {
      const billList = originData.filter(v => selectedRowKeys.includes(v.billNo))
      global.$showModal({
        zIndex: 10,
        content:
          <TableActionDialogContent
            onOk={() => {
              refreshData()
              setSelectedRowKeys({})
            }}
            billList={billList}
            supplierId={billList[0].supplierId}
          />
        ,
        title: `付款`,
      });
    }

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
            <Button disabled={selectedRowKeys.length <= 0} type="primary" onClick={handlePay}>
              付款
          </Button>
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
