/* eslint-disable jsx-a11y/anchor-has-content */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react';
import { Space, Button } from 'antd';
import { ExportOutlined, AlignLeftOutlined } from '@ant-design/icons';
import { Card } from '@material-ui/core';
import {
  FilesIOBtnGroup,
  AdvanSearch,
  SearchInput,
  ColumnMenuSwitch,
  RefreshBtn,
  ToggleAllBtn,
  HideButtonWithAuth,
} from 'components';
import TreeNodeActionDialogContent from './TreeNodeActionDialogContent';
import clientService from 'api/clientService';
import * as lodash from 'lodash';

export default React.memo(
  ({
    originData,
    filterData,
    columns,
    setColumn,
    refreshData,
    setFilterData,
    filterConfig,
    setSelectedRowKeys,
    pageSize,
    selected,
  }) => {
    const [drawerOpen, setDrawerOpen] = React.useState(false);
    const selectedRowKeys = Object.values(selected).reduce((acc, cur) => acc.concat(cur), []);

    const handleOpenDrawer = () => {
      setDrawerOpen(true);
    };

    const handleCloseDrawer = React.useCallback((values = null) => {
      setDrawerOpen(false);
    }, []);

    const updateHandler = React.useCallback(
      async ({ assetList, remarks }, cb) => {
        const res = await clientService.assetAlarm.updateAlarmList(assetList, remarks);
        if (res.code === 1) {
          cb();
          refreshData();
          const selected_copy = lodash.cloneDeep(selected);
          Object.keys(selected_copy).forEach((_) => {
            selected_copy[_] = [];
          });
          setSelectedRowKeys(selected_copy);
        } else {
          global.$showMessage({
            message: res.message,
            type: 'error',
            autoHideDuration: 5000,
          });
        }
      },
      [refreshData, selected, setSelectedRowKeys]
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
            <HideButtonWithAuth funcId='baojing_chuli'>
              <Button
                disabled={selectedRowKeys.length < 1}
                onClick={() => {
                  const rows = originData.filter((_) => selectedRowKeys.includes(_.id) && _.status === '未处理');
                  global.$showModal({
                    zIndex: 9998,
                    content: (
                      <TreeNodeActionDialogContent
                        rows={rows}
                        updateHandler={updateHandler}
                        type='edit'
                        // initialFormValues={{ remarks: row.remarks, id: row.id, assetId: row.assetId, assetName: row.assetName }}
                      />
                    ),
                    title: `处理`,
                  });
                }}
                type='primary'
                icon={<ExportOutlined />}
              >
                处理
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
              originDataWithKey={filterData.map((v) => v.id)}
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
