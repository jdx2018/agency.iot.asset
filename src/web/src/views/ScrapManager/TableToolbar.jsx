/* eslint-disable jsx-a11y/anchor-has-content */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react';
import { Space, Button, Modal } from 'antd';
import { PlusOutlined, DeleteOutlined, AlignLeftOutlined, CheckOutlined, RotateRightOutlined } from '@ant-design/icons';
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
    filterData,
    columns,
    setColumn,
    refreshData,
    setFilterData,
    selected,
    setSelectedRowKeys,
    pageSize,
    filterConfig,
    billTitle,
  }) => {
    const selectedRowKeys = Object.values(selected).reduce((acc, cur) => acc.concat(cur), []);
    const [open, setOpen] = React.useState(false);
    const [drawerOpen, setDrawerOpen] = React.useState(false);
    const [formType, setFormType] = React.useState('create');
    const [dialogData, setDialogData] = React.useState({ billMain: {}, billDetail: {} });
    const [getAssetListFunc, setGetAssetListFunc] = React.useState(null);
    const handleEdit = () => {
      Modal.confirm({
        title: '警告',
        content: `确认删除${billTitle}单？`,
        onOk: async () => {
          const billNo = selectedRowKeys[0];
          const res = await clientService.bill_chuzhi.deleteBill(billNo);
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

    const handleCancelScrap = async () => {
      const res = await clientService.bill_chuzhi.unDisposedBill(selectedRowKeys[0]);
      if (res.code === 1) {
        refreshData();
        global.$showMessage({
          message: '取消处置成功',
          type: 'success',
        });
      } else {
        global.$showMessage({
          message: res.message,
          type: 'error',
          autoHideDuration: 5000,
        });
      }
    };

    return (
      <>
        <Card
          style={{
            marginBottom: 10,
            marginTop: 10,
            padding: 10,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            boxShadow: 'none',
          }}
        >
          <Space size={10}>
            <HideButtonWithAuth funcId='chuzhi_add'>
              <Button
                type='primary'
                icon={<PlusOutlined />}
                onClick={async () => {
                  setFormType('create');
                  setOpen(true);
                  const res = await clientService.bill_chuzhi.getBillMainTemplate();
                  if (res.code === 1) {
                    setDialogData(res.data);
                    setGetAssetListFunc(res.method);
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
            <HideButtonWithAuth funcId='chuzhi_shenhe'>
              <Button
                disabled={selectedRowKeys.length !== 1}
                icon={<CheckOutlined />}
                onClick={async () => {
                  Modal.confirm({
                    title: '警告',
                    content: `确认审核通过？`,
                    onOk: async () => {
                      const billNo = selectedRowKeys[0];
                      const res = await clientService.bill_chuzhi.checkBill(billNo);
                      if (res.code === 1) {
                        global.$showMessage({
                          message: `审核${billTitle}单成功`,
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
                }}
              >
                审核
              </Button>
            </HideButtonWithAuth>
            <HideButtonWithAuth funcId='chuzhi_quxiaochuzhi'>
              <Button
                type='danger'
                icon={<RotateRightOutlined />}
                disabled={selectedRowKeys.length !== 1}
                onClick={handleCancelScrap}
              >
                取消处置
              </Button>
            </HideButtonWithAuth>
            <HideButtonWithAuth funcId='chuzhi_delete'>
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
          dialogData={dialogData}
          getAssetListFunc={getAssetListFunc}
          type={formType}
          billTitle={billTitle}
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
