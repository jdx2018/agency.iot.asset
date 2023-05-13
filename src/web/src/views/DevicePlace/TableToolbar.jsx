/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState } from 'react';
import { Space, Button, Modal } from 'antd';
import { DeleteOutlined, EditOutlined, PlusOutlined, AlignLeftOutlined } from '@ant-design/icons';
import { Card } from '@material-ui/core';
import TableActionDialog from './TableActionDialog';
import {
  FilesIOBtnGroup,
  SearchInput,
  ColumnMenuSwitch,
  ToggleAllBtn,
  RefreshBtn,
  AdvanSearch,
  HideButtonWithAuth,
} from 'components';

export default React.memo(
  ({
    selected,
    setSelectedRowKeys,
    filterData,
    deleteHandler,
    updateHandler,
    addHandler,
    originData,
    columns,
    setColumn,
    setFilterData,
    refreshData,
    pageSize,
    filterConfig,
    // onTableDataChange,
  }) => {
    const [open, setOpen] = useState(false);
    const selectedRowKeys = Object.values(selected).reduce((acc, cur) => acc.concat(cur), []);
    const handleAdd = () => {
      global.$showModal({
        zIndex: 9998,
        content: <TableActionDialog addHandler={addHandler} type='create' />,
        title: `新增设备`,
      });
    };

    const handleRemove = async () => {
      Modal.confirm({
        title: '警告',
        content: '确认删除设备信息？',
        onOk: async () => {
          deleteHandler({ deviceId: selectedRowKeys[0] }, () => {
            global.$showMessage({
              message: '删除设备成功',
              type: 'success',
            });
            const selected_clone = JSON.parse(JSON.stringify(selected));
            Object.keys(selected_clone).forEach((key) => (selected_clone[key] = []));
            setSelectedRowKeys(selected_clone);
          });
        },
      });
    };
    const handleEdit = () => {
      const row = originData.find((d) => d.deviceId === Object.values(selected)[0][0]);
      global.$showModal({
        zIndex: 9998,
        content: <TableActionDialog updateHandler={updateHandler} type='edit' initialFormValues={row} />,
        title: `编辑设备`,
      });
    };

    const handleValuesChange = React.useCallback(
      (filters) => {
        refreshData(filters);
      },
      [refreshData]
    );

    return (
      <>
        <Card
          style={{
            marginBottom: 10,
            padding: 10,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            boxShadow: 'none',
          }}
        >
          <Space size={10}>
            <HideButtonWithAuth funcId='shebeiweihu_add'>
              <Button type='primary' icon={<PlusOutlined />} onClick={handleAdd}>
                新增设备
              </Button>
            </HideButtonWithAuth>
            <HideButtonWithAuth funcId='shebeiweihu_delete'>
              <Button
                disabled={selectedRowKeys.length !== 1}
                type='danger'
                icon={<DeleteOutlined />}
                onClick={handleRemove}
              >
                删除设备
              </Button>
            </HideButtonWithAuth>
            <HideButtonWithAuth funcId='shebeiweihu_edit'>
              <Button disabled={selectedRowKeys.length !== 1} icon={<EditOutlined />} onClick={handleEdit}>
                编辑设备
              </Button>
            </HideButtonWithAuth>
            <FilesIOBtnGroup
              template={{
                export: columns.map((column) => ({
                  key: column.dataIndex,
                  desc: column.title,
                })),
              }}
              data={{
                originData,
                selectedData: originData.filter((v) => selectedRowKeys.includes(v.deviceId)),
                filterData,
              }}
            />
          </Space>
          <Space size={10}>
            <ToggleAllBtn
              originDataWithKey={filterData.map((v) => v.deviceId)}
              setSelectedRowKeys={setSelectedRowKeys}
              pageSize={pageSize}
            />
            <SearchInput data={originData} columns={columns} onFilterDataChange={setFilterData} />
            <ColumnMenuSwitch columns={columns} columnsChange={setColumn} />
            <a onClick={() => setOpen(true)}>
              <AlignLeftOutlined /> <span style={{ userSelect: 'none' }}>高级筛选</span>
            </a>
            <RefreshBtn refreshData={refreshData} />
          </Space>
        </Card>
        <AdvanSearch
          formConfg={filterConfig}
          open={open}
          closeDrawer={() => setOpen(false)}
          valuesChange={handleValuesChange}
        />
      </>
    );
  }
);
