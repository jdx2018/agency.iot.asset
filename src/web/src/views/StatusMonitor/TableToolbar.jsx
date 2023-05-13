/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState } from 'react';
import { Space } from 'antd';
import { AlignLeftOutlined } from '@ant-design/icons';
import { Card } from '@material-ui/core';
import { FilesIOBtnGroup, SearchInput, ColumnMenuSwitch, RefreshBtn, AdvanSearch } from 'components';

export default React.memo(
  ({ filterData, originData, columns, setColumn, setFilterData, refreshData, filterConfig }) => {
    const [open, setOpen] = useState(false);

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
            <FilesIOBtnGroup
              template={{
                export: columns.map((column) => ({
                  key: column.dataIndex,
                  desc: column.title,
                })),
              }}
              data={{
                originData,
                filterData,
              }}
            />
          </Space>
          <Space size={10}>
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
