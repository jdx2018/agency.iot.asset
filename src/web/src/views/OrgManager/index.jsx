import React from "react";
import LeftTree from "./LeftTree";
import TableContent from "./TableContent";
import { Box } from "@material-ui/core";
import { useDispatch } from "react-redux";
import { add, removeById, update } from "store/slices/org";

import clientService from "api/clientService";

// TODO
// const DEFAULTTREEID = getUserinfo().tenantId + "001";

const TOPTREEID = "1";

export default () => {
  const dispatch = useDispatch();
  const [selectedKeys, setSelectedKeys] = React.useState([TOPTREEID]);

  const [orgFlatData, setOrgFlatData] = React.useState([]);

  const [tableContentData, setTableContentData] = React.useState([]);

  const [tableContentHeader, setTableContentHeader] = React.useState([]);

  const [updateFlag, setUpdateFlag] = React.useState(0);

  const orgListRef = React.useRef([]);

  const refreshData = React.useCallback(async () => {
    const res = await clientService.org.getOrgList_all();
    if (res.code === 1) {
      orgListRef.current = res.data.rows;

      setTableContentHeader(res.data.header);
      setUpdateFlag((c) => c + 1);

      setOrgFlatData(
        res.data.rows.map((nodeData) => ({
          key: nodeData.orgId,
          title: nodeData.orgName,
          ...nodeData,
        }))
      );
    } else {
      global.$showMessage({
        message: res.message,
        type: "error",
        autoHideDuration: 5000,
      });
    }
  }, []);

  const addHandler = React.useCallback(
    async (org, cb) => {
      const res = await clientService.org.addOrg(org);
      if (res.code === 1) {
        dispatch(add(org));
        cb();
        refreshData();
      } else {
        global.$showMessage({
          message: res.message,
          type: "error",
          autoHideDuration: 5000,
        });
      }
    },
    [dispatch, refreshData]
  );

  const deleteHandler = React.useCallback(
    async ({ orgId }, cb) => {
      const res = await clientService.org.deleteOrg(orgId);
      if (res.code === 1) {
        dispatch(removeById(orgId));
        cb();
        refreshData();
      } else {
        global.$showMessage({
          message: res.message,
          type: "error",
          autoHideDuration: 5000,
        });
      }
    },
    [dispatch, refreshData]
  );

  const updateHandler = React.useCallback(
    async (org, cb) => {
      const res = await clientService.org.updateOrg(org.orgId, org);
      if (res.code === 1) {
        dispatch(update(org));
        cb();
        refreshData();
      } else {
        global.$showMessage({
          message: res.message,
          type: "error",
          autoHideDuration: 5000,
        });
      }
    },
    [dispatch, refreshData]
  );

  React.useEffect(() => {
    refreshData();
  }, [refreshData]);

  React.useEffect(() => {
    setTableContentData(
      selectedKeys.length === 0
        ? []
        : orgListRef.current.filter((org) => org.parentId === selectedKeys[0])
    );
  }, [selectedKeys, updateFlag]);

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
          originData={tableContentData}
          tableContentHeader={tableContentHeader}
          addHandler={addHandler}
          deleteHandler={deleteHandler}
          updateHandler={updateHandler}
          orgFlatData={orgFlatData}
          selectedKeys={selectedKeys}
          setSelectedKeys={setSelectedKeys}
          topTreeId={"1"}
        />
        <TableContent
          deleteHandler={deleteHandler}
          updateHandler={updateHandler}
          header={tableContentHeader}
          tableData={tableContentData}
        />
      </div>
    </Box>
  );
};
