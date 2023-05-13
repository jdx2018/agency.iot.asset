import React from 'react';
import { Space, Button } from 'antd';
import { PlusOutlined, ImportOutlined } from '@ant-design/icons';
import { Card } from '@material-ui/core';
import { SearchInput, HideButtonWithAuth } from 'components';
import TreeNodeActionDialogContent from './TreeNodeActionDialogContent';
import { getUploadExcel } from 'utils/common';

import clientService from 'api/clientService';

export default React.memo(({ columns, originData, addHandler, tableContentChange, refreshData }) => {
  const handleAdd = async () => {
    global.$showModal({
      zIndex: 9998,
      content: <TreeNodeActionDialogContent addHandler={addHandler} type='create' />,
      title: `新增位置`,
    });
  };
  const handleBatchAdd = () => {
    const template = columns.map((column) => ({
      key: column.dataIndex,
      desc: column.title,
    }));
    const afterImportSuccess = async (json) => {
      const placeIdList = json.map((a) => a.placeId);
      if (new Set(placeIdList).size !== placeIdList.length) {
        global.$showMessage({
          message: '导入的数据里存在重复数据',
          type: 'error',
          autoHideDuration: 5000,
        });
        return;
      }
      const isRepeatWithLocalData = originData.every((item) => !placeIdList.includes(item.placeId));
      if (isRepeatWithLocalData) {
        const res = await clientService.assetPlace.addPlaceList(json);
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
          message: '位置编号不能和已有的重复',
          type: 'error',
          autoHideDuration: 5000,
        });
      }
    };
    getUploadExcel(afterImportSuccess, template);
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
          <HideButtonWithAuth funcId='zichan_weizhi_add'>
            <Button type='primary' icon={<PlusOutlined />} onClick={handleAdd}>
              新增位置
            </Button>
          </HideButtonWithAuth>
          <HideButtonWithAuth funcId='zichan_weizhi_piliang_add'>
            <Button icon={<ImportOutlined />} onClick={handleBatchAdd}>
              批量导入
            </Button>
          </HideButtonWithAuth>
        </Space>
        <Space size={10}>
          <SearchInput data={originData} columns={columns} onFilterDataChange={handleFilterDataChange} />
        </Space>
      </Card>
    </>
  );
});
