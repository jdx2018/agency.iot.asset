/* eslint-disable jsx-a11y/anchor-has-content */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react';
import { Space, Button, Modal } from 'antd';
import { PlusOutlined, DeleteOutlined, AlignLeftOutlined, CheckOutlined, PrinterOutlined } from '@ant-design/icons';
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
import { PrintDialog } from 'components';

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
    const [getAssetListFunc, setGetAssetListFunc] = React.useState(null);
    const [formType, setFormType] = React.useState('create');
    const [tagPrintBtnLoading, setTagPrintBtnLoading] = React.useState(false);
    const [printDialogOpen, setPrintDialogOpen] = React.useState(false);
    const [printList, setPrintList] = React.useState([]);

    const handleEdit = () => {
      Modal.confirm({
        title: '警告',
        content: `确认删除${billTitle}单？`,
        onOk: async () => {
          const billNo = selectedRowKeys[0];
          const res = await clientService.bill_paifa.deleteBill(billNo);
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

    const handleTagPrint = async () => {
      setTagPrintBtnLoading(true);
      const res = await clientService.bill_paifa.queryBillDetail(selectedRowKeys[0]);
      setTagPrintBtnLoading(false);
      if (res.code === 1) {
        if (res.data.billDetail.rows.length > 0) {
          setPrintList(res.data.billDetail.rows);
          setPrintDialogOpen(true);
        } else {
          global.$showMessage({
            message: '无可打印标签数据',
            type: 'warning',
            autoHideDuration: 5000,
          });
        }
      } else {
        global.$showMessage({
          type: 'error',
          message: res.message,
          autoHideDuration: 5000,
        });
      }
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
            <HideButtonWithAuth funcId='paifa_add'>
              <Button
                type='primary'
                icon={<PlusOutlined />}
                onClick={async () => {
                  setFormType('create');
                  setOpen(true);
                  const res = await clientService.bill_paifa.getBillMainTemplate();
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
            <HideButtonWithAuth funcId='paifa_shenhe'>
              <Button
                disabled={selectedRowKeys.length !== 1}
                icon={<CheckOutlined />}
                onClick={async () => {
                  Modal.confirm({
                    title: '警告',
                    content: `确认审核通过？`,
                    onOk: async () => {
                      const billNo = selectedRowKeys[0];
                      const res = await clientService.bill_paifa.checkBill(billNo);
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
            <Button
              disabled={
                selectedRowKeys.length !== 1 ||
                originData.find((v) => v.billNo === selectedRowKeys[0]).status !== '已完成'
              }
              icon={<PrinterOutlined />}
              loading={tagPrintBtnLoading}
              onClick={handleTagPrint}
            >
              {' '}
              标签打印
            </Button>
            <HideButtonWithAuth funcId='paifa_delete'>
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
          getAssetListFunc={getAssetListFunc}
          type={formType}
          dialogData={dialogData}
          open={open}
          closeDialog={handleCloseDialog}
          selectedRowKey={selectedRowKeys[0]}
        />
        <PrintDialog
          selectedRows={printList}
          open={printDialogOpen}
          closeDialog={() => {
            setPrintDialogOpen(false);
          }}
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
