import React from "react";
import { Space, Button, Checkbox, Modal } from "antd";
import { PlusOutlined, ImportOutlined } from "@ant-design/icons";
import { Card } from "@material-ui/core";
import TableActionDialogContent from "./TableActionDialogContent";
import { SearchInput, ColumnMenuSwitch, HideButtonWithAuth } from "components";

export default React.memo(
  ({
    selected,
    setSelectedRowKeys,
    deleteHandler,
    updateHandler,
    addHandler,
    originData,
    columns,
    setColumn,
    setFilterData,
    isSearchAll,
    onSearchAllCheckboxChange
  }) => {
    const selectedRowKeys = Object.values(selected).reduce((acc, cur) => acc.concat(cur), []);
    const handleAdd = () => {
      global.$showModal({
        zIndex: 9998,
        content:
          <TableActionDialogContent
            addHandler={addHandler}
            type="create"
          />
        ,
        title: `新增员工`,
      });
    };

    const handleRemove = async () => {
      Modal.confirm({
        title: "警告",
        content: "确认删除员工信息？子员工信息也会一并删除",
        onOk: async () => {
          deleteHandler({ employeeId: selectedRowKeys[0] }, () => {
            global.$showMessage({
              message: "删除员工成功",
              type: "success",
            });
            const selected_clone = JSON.parse(JSON.stringify(selected));
            Object.keys(selected_clone).forEach((key) => (selected_clone[key] = []));
            setSelectedRowKeys(selected_clone);
          });
        },
      });
    };
    const handleEdit = () => {
      const row = originData.find((d) => d.employeeId === Object.values(selected)[0][0]);
      global.$showModal({
        zIndex: 9998,
        content: <TableActionDialogContent updateHandler={updateHandler} type="edit" initialFormValues={row} />,
        title: `编辑员工`,
      });
    };

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
            <HideButtonWithAuth funcId="yuangong_add">
              <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
                新增员工
            </Button>
            </HideButtonWithAuth>
            <HideButtonWithAuth funcId="yuangong_delete">
              <Button
                disabled={selectedRowKeys.length !== 1}
                type="primary"
                icon={<PlusOutlined />}
                onClick={handleRemove}
              >
                删除员工
            </Button>
            </HideButtonWithAuth>
            <HideButtonWithAuth funcId="yuangong_edit">
              <Button
                disabled={selectedRowKeys.length !== 1}
                type="primary"
                icon={<ImportOutlined />}
                onClick={handleEdit}
              >
                编辑员工
            </Button>
            </HideButtonWithAuth>
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
