/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState } from 'react';
import { Space, Button, Modal } from 'antd';
import { DeleteOutlined, EditOutlined, PlusOutlined, AlignLeftOutlined, ImportOutlined } from '@ant-design/icons';
import { Card } from '@material-ui/core';
import TableActionDialog from './TableActionDialog';
import { SearchInput, ColumnMenuSwitch, ToggleAllBtn, RefreshBtn, AdvanSearch, HideButtonWithAuth } from 'components';
import clientService from 'api/clientService';
import { getUploadExcel } from 'utils/common';

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
        width: 948,
        content: <TableActionDialog addHandler={addHandler} type='create' />,
        title: `新增供应商`,
      });
    };

    const handleRemove = async () => {
      Modal.confirm({
        title: '警告',
        content: '确认删除供应商信息？',
        onOk: async () => {
          deleteHandler({ supplierId: selectedRowKeys[0] }, () => {
            global.$showMessage({
              message: '删除供应商成功',
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
      let arr = [];
      Object.values(selected).forEach((v) => {
        arr.push(...v);
      });
      const row = originData.find((d) => d.supplierId === arr[0]);
      global.$showModal({
        zIndex: 9998,
        width: 948,
        content: <TableActionDialog updateHandler={updateHandler} type='edit' initialFormValues={row} />,
        title: `编辑供应商`,
      });
    };

    const handleValuesChange = React.useCallback(
      (filters) => {
        refreshData(filters);
      },
      [refreshData]
    );

    const handleBatchAdd = () => {
      const template = columns.map((column) => ({
        key: column.dataIndex,
        desc: column.title,
      }));
      const afterImportSuccess = async (json) => {
        const supplierIdList = json.map((a) => a.supplierId);
        if (new Set(supplierIdList).size !== supplierIdList.length) {
          global.$showMessage({
            message: '导入的数据里存在重复数据',
            type: 'error',
            autoHideDuration: 5000,
          });
          return;
        }
        const isRepeatWithLocalData = originData.every((item) => !supplierIdList.includes(item.supplierId));
        if (isRepeatWithLocalData) {
          const res = await clientService.supplier.addSupplierList(json);
          if (res.code === 1) {
            global.$showMessage({
              message: '导入成功',
              type: 'success',
            });
            refreshData();
          } else {
            global.$showMessage({
              message: res.message,
              type: 'error',
              autoHideDuration: 5000,
            });
          }
        } else {
          global.$showMessage({
            message: '供应商编号不能和已有的重复',
            type: 'error',
            autoHideDuration: 5000,
          });
        }
      };
      getUploadExcel(afterImportSuccess, template);
    };

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
            <HideButtonWithAuth funcId='provider_add'>
              <Button type='primary' icon={<PlusOutlined />} onClick={handleAdd}>
                新增供应商
              </Button>
            </HideButtonWithAuth>
            <HideButtonWithAuth funcId='provider_delete'>
              <Button
                disabled={selectedRowKeys.length !== 1}
                type='primary'
                icon={<DeleteOutlined />}
                onClick={handleRemove}
              >
                删除供应商
              </Button>
            </HideButtonWithAuth>
            <HideButtonWithAuth funcId='provider_edit'>
              <Button
                disabled={selectedRowKeys.length !== 1}
                type='primary'
                icon={<EditOutlined />}
                onClick={handleEdit}
              >
                编辑供应商
              </Button>
            </HideButtonWithAuth>
            <HideButtonWithAuth funcId='provider_piliang_add'>
              <Button icon={<ImportOutlined />} onClick={handleBatchAdd}>
                批量导入
              </Button>
            </HideButtonWithAuth>
          </Space>
          <Space size={10}>
            <ToggleAllBtn
              originDataWithKey={filterData.map((v) => v.supplierId)}
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
