import React, { useState, useCallback, useEffect } from "react";
import LeftTree from "./LeftTree";
import TableContent from "./TableContent";
import { Box } from "@material-ui/core";

import clientService from 'api/clientService'

export default () => {
  const [selectedKeys, setSelectedKeys] = useState([]);

  const [supplierFlatData, setsupplierFlatData] = useState([]);

  const [billList, setBillList] = useState([]);

  const [tableContentHeader, setTableContentHeader] = useState([]);


  const refreshBillData = useCallback(async (supplierId) => {
    if (supplierId) {
      const res = await clientService.supplier_payable.queryPayableDetailList(supplierId);
      if (res.code === 1) {
        setBillList(res.data.rows);
        setTableContentHeader(res.data.header);
      } else {
        global.$showMessage({
          message: res.message,
          type: "error",
          autoHideDuration: 5000,
        });
      }
    } else {
      setBillList([]);
      setTableContentHeader({});
    }
  }, []);

  const refreshData = useCallback(async () => {
    const res = await clientService.supplier_payable.queryPayableList();
    if (res.code === 1) {
      setsupplierFlatData(res.data.rows.map((nodeData) => ({ key: nodeData.supplierId, title: nodeData.supplierName, parentId: '0', ...nodeData })));
    } else {
      global.$showMessage({
        message: res.message,
        type: "error",
        autoHideDuration: 5000,
      });
    }
  }, []);

  const refreshAllData = useCallback(() => {
    refreshData()
    setSelectedKeys([])
  }, [refreshData])

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  useEffect(() => {
    refreshBillData(selectedKeys[0])
  }, [selectedKeys, refreshBillData]);

  return (
    <Box p={1}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <LeftTree
          refreshData={refreshData}
          tableContentHeader={tableContentHeader}
          supplierFlatData={supplierFlatData}
          selectedKeys={selectedKeys}
          setSelectedKeys={setSelectedKeys}
        />
        <TableContent
          refreshData={refreshAllData}
          header={tableContentHeader}
          tableData={billList}
        />
      </div>
    </Box>
  );
};
