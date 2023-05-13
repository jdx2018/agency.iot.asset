import React from 'react';
import { Space, Button } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { Card } from '@material-ui/core';

import { SearchInput, HideButtonWithAuth } from 'components';

import TreeNodeActionDialogContent from './TreeNodeActionDialogContent';

export default React.memo(({ columns, originData, addHandler, tableContentChange, refreshData }) => {
  const handleAdd = async () => {
    global.$showModal({
      zIndex: 9998,
      title: '新增分类',
      content: <TreeNodeActionDialogContent addHandler={addHandler} type='create' />,
    });
  };

  const handleFilterDataChange = (data) => {
    tableContentChange(data);
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
          <HideButtonWithAuth funcId='zichan_fenlei_add'>
            <Button type='primary' icon={<PlusOutlined />} onClick={handleAdd}>
              新增分类
            </Button>
          </HideButtonWithAuth>
        </Space>
        <Space size={10}>
          <SearchInput
            // value={filterValue}
            data={originData}
            columns={columns}
            onFilterDataChange={handleFilterDataChange}
          />
        </Space>
      </Card>
    </>
  );
});
