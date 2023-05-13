/* eslint-disable jsx-a11y/anchor-has-content */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react';
import { Space, Button, Modal } from 'antd';
import { PlusOutlined, DeleteOutlined, AlignLeftOutlined, RetweetOutlined } from '@ant-design/icons';
import { Card } from '@material-ui/core';
import ActionDialog from './ActionDialog';
import { exportExcelWithManySheet } from 'utils/common';
import { AdvanSearch, ColumnMenuSwitch, SearchInput, RefreshBtn, ToggleAllBtn, HideButtonWithAuth } from 'components';

import clientService from 'api/clientService';

import dayjs from 'dayjs';

export default React.memo(
  ({
    originData,
    filterData,
    columns,
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
    const [formType, setFormType] = React.useState('create');

    const handleDelete = () => {
      Modal.confirm({
        title: '警告',
        content: `确认删除${billTitle}单？`,
        onOk: async () => {
          const billNo = selectedRowKeys[0];
          const res = await clientService.bill_pand.deleteBill(billNo);
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

    const handleExportDetail = async () => {
      const res = await clientService.bill_pand.queryBillDetail(selectedRowKeys[0]);
      if (res.code === 1) {
        const row = originData.filter((_) => _.billNo === selectedRowKeys[0])[0];

        const data_copy = res.data.rows.slice();

        const header = res.data.header;
        const sameKeysObj = {};
        const column = Object.keys(header).map((header_key) => {
          const column_ = {
            title: header[header_key].zh,
            dataIndex: header_key,
            width: header[header_key].width,
          };
          return column_;
        });

        column.forEach((_) => {
          const c = columns.find((__) => __.title === _.title);
          if (c) {
            sameKeysObj[c.title] = {
              detail: _.dataIndex,
            };
          }
        });

        columns.forEach((_) => {
          if (Object.keys(sameKeysObj).includes(_.title)) {
            sameKeysObj[_.title] = {
              ...sameKeysObj[_.title],
              main: _.dataIndex,
            };
          }
        });

        Object.keys(sameKeysObj).forEach((_) => {
          data_copy.forEach((__) => {
            if (!__[sameKeysObj[_].detail]) {
              __[sameKeysObj[_].detail] = row[sameKeysObj[_].main];
            }
          });
        });
        const template = [...columns, ...column].map((column) => ({
          key: column.dataIndex,
          desc: column.title,
        }));

        exportExcelWithManySheet({
          excelName: `盘点明细-${dayjs().format('YYYY-MM-DD HH:mm:ss')}`,
          sheetsConfig: [
            {
              data: data_copy.map((_) => ({ ...row, ..._ })),
              template,
            },
          ],
        });
      } else {
        global.$showMessage({
          message: res.message,
          type: 'error',
          autoHideDuration: 5000,
        });
      }
    };

    const handleOpenDrawer = () => {
      setDrawerOpen(true);
    };

    const handleCloseDrawer = React.useCallback(() => {
      setDrawerOpen(false);
    }, []);

    React.useEffect(() => {
      (async () => {
        const res = await clientService.bill_pand.getTemplate();
        if (res.code === 1) {
          setDialogData({ billMain: res.data.billMain, billDetail: { header: res.data.header } });
        } else {
          global.$showMessage({
            message: res.message,
            autoHideDuration: 5000,
            type: 'error',
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
            <HideButtonWithAuth funcId='pandian_add'>
              <Button
                type='primary'
                icon={<PlusOutlined />}
                onClick={() => {
                  setOpen(true);
                  setFormType('create');
                }}
              >
                新增
              </Button>
            </HideButtonWithAuth>
            <HideButtonWithAuth funcId='pandian_delete'>
              <Button type='primary' onClick={handleDelete} disabled={selectedRowKeys.length !== 1}>
                <DeleteOutlined /> 删除
              </Button>
            </HideButtonWithAuth>

            <Button type='primary' onClick={handleExportDetail} disabled={selectedRowKeys.length !== 1}>
              <RetweetOutlined /> 导出盘点明细
            </Button>
          </Space>

          <Space>
            <ToggleAllBtn
              originDataWithKey={filterData.map((v) => v.billNo)}
              setSelectedRowKeys={setSelectedRowKeys}
              pageSize={pageSize}
            />
            <SearchInput data={originData} columns={columns} onFilterDataChange={setFilterData} />
            <ColumnMenuSwitch columns={columns} columnsChange={setColumn} />
            {filterConfig && (
              <a onClick={handleOpenDrawer}>
                <AlignLeftOutlined /> <span style={{ userSelect: 'none' }}>高级筛选</span>
              </a>
            )}
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
