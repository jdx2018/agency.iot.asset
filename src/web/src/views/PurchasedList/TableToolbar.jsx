/* eslint-disable jsx-a11y/anchor-has-content */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react';
import { Space, Button, Modal } from 'antd';
import {
  PlusOutlined,
  DeleteOutlined,
  AlignLeftOutlined,
  CheckOutlined,
  EditOutlined,
  PrinterOutlined,
} from '@ant-design/icons';
import { Card } from '@material-ui/core';
import {
  FilesIOBtnGroup,
  AdvanSearch,
  ColumnMenuSwitch,
  SearchInput,
  RefreshBtn,
  ToggleAllBtn,
  HideButtonWithAuth,
} from 'components';

import { PrintDialog } from 'components';

import UpdatePriceDialog from './UpdatePriceDialog';

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
    handleEdit,
    handleCreate,
    updateSelectedRowKeys,
    addBtnLoading,
    editBtnLoading,
  }) => {
    const selectedRowKeys = React.useMemo(() => Object.values(selected).reduce((acc, cur) => acc.concat(cur), []), [
      selected,
    ]);
    const selectedRows = originData.filter((_) => selectedRowKeys.includes(_.billNo));
    const isAllNotApproved = selectedRows.length === 1 ? selectedRows.every((_) => _.status === '待审核') : false;
    const [drawerOpen, setDrawerOpen] = React.useState(false);

    const [tagPrintBtnLoading, setTagPrintBtnLoading] = React.useState(false);
    const [printDialogOpen, setPrintDialogOpen] = React.useState(false);
    const [printList, setPrintList] = React.useState([]);

    const handleOpenDrawer = () => {
      setDrawerOpen(true);
    };

    const handleCloseDrawer = React.useCallback(() => {
      setDrawerOpen(false);
    }, []);

    const handleValuesChange = React.useCallback(
      (filters) => {
        refreshData(filters);
      },
      [refreshData]
    );

    const isEnablePrint = () => {
      if (selectedRowKeys.length !== 1) return true;
      const row = originData.find((_) => _.billNo === selectedRowKeys[0]);
      if (row) return row.status !== '已审核';
      return true;
    };

    const handleTagPrint = async () => {
      setTagPrintBtnLoading(true);
      const res = await clientService.asset.getAssetList_purchase(selectedRowKeys[0]);
      setTagPrintBtnLoading(false);
      if (res.code === 1) {
        if (res.data.rows.length > 0) {
          setPrintList(res.data.rows);
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
          message: res.message,
          type: 'error',
          autoHideDuration: 5000,
        });
      }
    };

    React.useEffect(() => {
      updateSelectedRowKeys(selectedRowKeys);
    }, [selectedRowKeys]);

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
            <HideButtonWithAuth funcId='caigou_add'>
              <Button type='primary' icon={<PlusOutlined />} loading={addBtnLoading} onClick={handleCreate}>
                新增
              </Button>
            </HideButtonWithAuth>
            <HideButtonWithAuth funcId='caigou_edit'>
              <Button
                loading={editBtnLoading}
                disabled={!isAllNotApproved}
                icon={<EditOutlined />}
                onClick={handleEdit}
              >
                编辑
              </Button>
            </HideButtonWithAuth>
            <HideButtonWithAuth funcId='caigou_update_price'>
              <UpdatePriceDialog refreshData={refreshData} selectedKeys={selectedRowKeys} />
            </HideButtonWithAuth>
            <HideButtonWithAuth funcId='caigou_shenhe'>
              <Button
                disabled={!isAllNotApproved}
                icon={<CheckOutlined />}
                onClick={async () => {
                  Modal.confirm({
                    title: '警告',
                    content: `确认审核通过？`,
                    onOk: async () => {
                      const billNo = selectedRowKeys[0];
                      const res = await clientService.bill_purchase.checkBill(billNo);
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
            <HideButtonWithAuth funcId='caigou_delete'>
              <Button
                disabled={!isAllNotApproved}
                icon={<DeleteOutlined />}
                type='danger'
                onClick={() => {
                  Modal.confirm({
                    title: '警告',
                    content: `确认删除${billTitle}单？`,
                    onOk: async () => {
                      const billNo = selectedRowKeys[0];
                      const res = await clientService.bill_purchase.deleteBill(billNo);
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
                }}
              >
                删除
              </Button>
            </HideButtonWithAuth>

            {/* <HideButtonWithAuth funcId="caigou_print"> */}
            <Button
              icon={<PrinterOutlined />}
              loading={tagPrintBtnLoading}
              disabled={isEnablePrint()}
              onClick={handleTagPrint}
            >
              标签打印
            </Button>
            {/* </HideButtonWithAuth> */}
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
