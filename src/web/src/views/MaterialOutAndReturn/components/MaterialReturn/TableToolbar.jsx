/* eslint-disable jsx-a11y/anchor-has-content */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react';
import { Space, Button, Modal } from 'antd';
import { PlusOutlined, DeleteOutlined, AlignLeftOutlined, CheckOutlined } from '@ant-design/icons';
import { Card } from '@material-ui/core';
import ActionDialog from './ActionDialog';
import {
  FilesIOBtnGroup,
  AdvanSearch,
  ColumnMenuSwitch,
  SearchInput,
  RefreshBtn,
  ToggleAllBtn,
  HideButtonWithAuth,
} from 'components';

import clientService from 'api/clientService';

export default React.memo(
  ({
    originData,
    columns,
    filterData,
    setColumn,
    refreshData,
    setFilterData,
    selected,
    pageSize,
    setSelectedRowKeys,
    filterConfig,
    billTitle,
  }) => {
    const selectedRowKeys = Object.values(selected).reduce((acc, cur) => acc.concat(cur), []);
    const [open, setOpen] = React.useState(false);
    const [drawerOpen, setDrawerOpen] = React.useState(false);
    const [dialogData, setDialogData] = React.useState({ billMain: {}, billDetail: {} });
    const [getMaterialListFunc, setGetMaterialListFunc] = React.useState(null);
    const [formType, setFormType] = React.useState('create');

    const handleEdit = () => {
      Modal.confirm({
        title: '警告',
        content: `确认删除${billTitle}单？`,
        onOk: async () => {
          const billNo = selectedRowKeys[0];
          const res = await clientService.bill_tuiku_material.deleteBill(billNo);
          if (res.code === 1) {
            global.$showMessage({
              message: `删除${billTitle}单成功`,
              type: 'success',
            });
            setSelectedRowKeys(null);
            refreshData();
          } else {
            global.$showMessage({
              message: res.message,
              autoHideDuration: 5000,
              type: 'error',
            });
          }
        },
      });
    };

    const handleOpenDrawer = () => {
      setDrawerOpen(true);
    };

    const handleCloseDrawer = React.useCallback(() => {
      setDrawerOpen(false);
    }, []);

    const handleCloseDialog = React.useCallback(
      (isRefresh = false) => {
        setOpen(false);
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
            <HideButtonWithAuth funcId='haocai_tuiku_add'>
              <Button
                type='primary'
                icon={<PlusOutlined />}
                onClick={async () => {
                  setFormType('create');
                  setOpen(true);
                  const res = await clientService.bill_tuiku_material.getBillMainTemplate();
                  if (res.code === 1) {
                    setDialogData(res.data);
                    setGetMaterialListFunc(res.method);
                  } else {
                    global.$showMessage({
                      message: res.message,
                      autoHideDuration: 5000,
                      type: 'error',
                    });
                  }
                }}
              >
                新增
              </Button>
            </HideButtonWithAuth>
            <HideButtonWithAuth funcId='haocai_tuiku_delete'>
              <Button type='danger' onClick={handleEdit} disabled={selectedRowKeys.length !== 1}>
                <DeleteOutlined /> 删除
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
                selectedData: originData.filter((v) => selectedRowKeys.includes(v.billNo)),
                filterData,
              }}
            />
          </Space>

          <Space>
            <ToggleAllBtn
              originDataWithKey={filterData.map((v) => v.billNo)}
              setSelectedRowKeys={setSelectedRowKeys}
              pageSize={pageSize}
            />
            <SearchInput data={originData} columns={columns} onFilterDataChange={setFilterData} />
            <ColumnMenuSwitch columns={columns} columnsChange={setColumn} />
            <a onClick={handleOpenDrawer}>
              <AlignLeftOutlined /> <span style={{ userSelect: 'none' }}>高级筛选</span>
            </a>
            <RefreshBtn refreshData={refreshData} />
          </Space>
        </Card>
        <ActionDialog
          billTitle={billTitle}
          getMaterialListFunc={getMaterialListFunc}
          type={formType}
          dialogData={dialogData}
          open={open}
          closeDialog={handleCloseDialog}
          selectedRowKey={selectedRowKeys[0]}
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
