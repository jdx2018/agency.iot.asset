/* eslint-disable jsx-a11y/anchor-has-content */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React from "react";
import { Space, Button, Modal } from "antd";
import {
  PlusOutlined,
  DeleteOutlined,
  AlignLeftOutlined,
  EditOutlined,
  KeyOutlined,
} from "@ant-design/icons";
import { Card } from "@material-ui/core";
import ActionDialog from "./ActionDialog";
import {
  FilesIOBtnGroup,
  AdvanSearch,
  ColumnMenuSwitch,
  SearchInput,
  RefreshBtn,
  ToggleAllBtn,
  HideButtonWithAuth,
} from "components";
import FuncsConfigTree from "./FuncsConfigTree";
import PageOrderAdjuster from "./PageOrderAdjuster";

import clientService from "api/clientService";

export default React.memo(
  ({
    originData,
    filterData,
    columns,
    setColumn,
    refreshData,
    setFilterData,
    selected,
    setSelectedRowKeys,
    filterConfig,
    billTitle,
    pageSize,
    rowKey,
  }) => {
    const selectedRowKeys = Object.values(selected).reduce(
      (acc, cur) => acc.concat(cur),
      []
    );
    const [open, setOpen] = React.useState(false);
    const [drawerOpen, setDrawerOpen] = React.useState(false);
    const [dialogData, setDialogData] = React.useState({});
    const [formType, setFormType] = React.useState("create");
    const [btnLoading, setBtnLoading] = React.useState(false);

    const handleDelete = () => {
      Modal.confirm({
        title: "警告",
        content: `确认删除勾选${billTitle}？`,
        onOk: async () => {
          const userId = selectedRowKeys[0];
          const res = await clientService.user.deleteUser(userId);
          if (res.code === 1) {
            global.$showMessage({
              message: `删除${billTitle} ${userId} 成功`,
              type: "success",
            });
            setSelectedRowKeys(null);
            refreshData();
          } else {
            global.$showMessage({
              message: res.message,
              autoHideDuration: 5000,
              type: "error",
            });
          }
        },
      });
    };

    const getBillMain = async (userId) => {
      const res = await clientService.user.getUserDetail(userId);
      if (res?.code === 1) {
        return res.data;
      }
      return {};
    };

    const handleEdit = async () => {
      const userId = selectedRowKeys[0];
      const billMain = await getBillMain(userId);
      setDialogData({ billMain: { ...billMain } });
      setFormType("edit");
      setOpen(true);
    };

    const handleOpenDrawer = () => {
      setDrawerOpen(true);
    };

    const handleCloseDrawer = React.useCallback(() => {
      setDrawerOpen(false);
    }, []);

    React.useEffect(() => {
      (async () => {
        const res = await clientService.user.getTemplate();
        if (res.code === 1) {
          setDialogData({ billMain: res.data });
        } else {
          global.$showMessage({
            message: res.message,
            autoHideDuration: 5000,
            type: "error",
          });
        }
      })();
    }, []);

    const handleCloseDialog = React.useCallback(
      (isRefresh = false) => {
        setOpen(false);
        setDialogData((dialogData) => {
          const { billMain } = dialogData;
          Object.keys(billMain).forEach((key) => {
            billMain[key].value = null;
          });
          return { billMain };
        });
        if (isRefresh) {
          refreshData();
        }
      },
      [refreshData]
    );

    const handleValuesChange = React.useCallback(
      (filters) => {
        refreshData(filters);
      },
      [refreshData]
    );

    const fetchTreeData = React.useCallback(async (id) => {
      setBtnLoading(true);
      const res = await clientService.user_permission.getPermission_page(id);
      setBtnLoading(false);
      if (res.code === 1) {
        return res.data;
      } else {
        return [];
      }
    }, []);

    const handleEditFuncs = React.useCallback(async () => {
      const data = await fetchTreeData(selectedRowKeys[0]);
      global.$showModal({
        zIndex: 5,
        content: <FuncsConfigTree data={data} id={selectedRowKeys[0]} />,
        title: `编辑权限`,
      });
    }, [fetchTreeData, selectedRowKeys]);

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
            <HideButtonWithAuth funcId="user_add">
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => {
                  setOpen(true);
                  setFormType("create");
                }}
              >
                新增
              </Button>
            </HideButtonWithAuth>
            <HideButtonWithAuth funcId="user_edit">
              <Button
                onClick={handleEdit}
                disabled={selectedRowKeys.length !== 1}
              >
                <EditOutlined /> 编辑
              </Button>
            </HideButtonWithAuth>
            <HideButtonWithAuth funcId="user_delete">
              <Button
                type="danger"
                onClick={handleDelete}
                disabled={selectedRowKeys.length !== 1}
              >
                <DeleteOutlined /> 删除
              </Button>
            </HideButtonWithAuth>

            <Button
              loading={btnLoading}
              onClick={handleEditFuncs}
              disabled={selectedRowKeys.length !== 1}
            >
              <KeyOutlined /> 权限配置
            </Button>
            <PageOrderAdjuster />
            <FilesIOBtnGroup
              template={{
                export: columns.map((column) => ({
                  key: column.dataIndex,
                  desc: column.title,
                })),
              }}
              data={{
                originData,
                selectedData: originData.filter((v) =>
                  selectedRowKeys.includes(v.userId)
                ),
                filterData,
              }}
            />
          </Space>

          <Space>
            <ToggleAllBtn
              originDataWithKey={filterData.map((v) => v.userId)}
              setSelectedRowKeys={setSelectedRowKeys}
              pageSize={pageSize}
            />
            <SearchInput
              data={originData}
              columns={columns}
              onFilterDataChange={setFilterData}
            />
            <ColumnMenuSwitch columns={columns} columnsChange={setColumn} />
            <a onClick={handleOpenDrawer}>
              <AlignLeftOutlined />{" "}
              <span style={{ userSelect: "none" }}>高级筛选</span>
            </a>
            <RefreshBtn refreshData={refreshData} />
          </Space>
        </Card>
        <ActionDialog
          type={formType}
          billTitle={billTitle}
          dialogData={dialogData}
          open={open}
          closeDialog={handleCloseDialog}
        />
        <AdvanSearch
          formConfg={filterConfig}
          open={drawerOpen}
          closeDrawer={handleCloseDrawer}
          valuesChange={handleValuesChange}
        />
      </>
    );
  }
);
