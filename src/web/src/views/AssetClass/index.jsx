import React from 'react';
import LeftTree from './LeftTree';
import TableContent from './TableContent';
import { Box } from '@material-ui/core';
import { useDispatch } from 'react-redux';
import TableContentToolbar from './TableContentToolbar';
import { add, removeById, update } from 'store/slices/class';

import clientService from 'api/clientService';

const TOPTREEID = '1';

export default () => {
  const dispatch = useDispatch();
  const [selectedKeys, setSelectedKeys] = React.useState([TOPTREEID]);

  const [classFlatData, setClassFlatData] = React.useState([]);

  const [tableContentData, setTableContentData] = React.useState([]);

  const [tableContentHeader, setTableContentHeader] = React.useState([]);

  const [updateFlag, setUpdateFlag] = React.useState(0);

  const classListRef = React.useRef([]);
  const filterClassListRef = React.useRef([]);

  const refreshData = React.useCallback(async () => {
    const res = await clientService.assetClass.getAssetClass_all();
    if (res.code === 1) {
      classListRef.current = res.data.rows;
      filterClassListRef.current = res.data.rows;

      setTableContentHeader(res.data.header);
      setUpdateFlag((c) => c + 1);

      setClassFlatData(
        res.data.rows.map((nodeData) => ({ key: nodeData.classId, title: nodeData.className, ...nodeData }))
      );
    } else {
      global.$showMessage({
        message: res.message,
        type: 'error',
        autoHideDuration: 5000,
      });
    }
  }, []);

  const addHandler = React.useCallback(
    async (class_, cb) => {
      const res = await clientService.assetClass.addClass(class_);
      if (res.code === 1) {
        dispatch(add(class_));
        cb();
        refreshData();
      } else {
        global.$showMessage({
          message: res.message,
          type: 'error',
          autoHideDuration: 5000,
        });
      }
    },
    [dispatch, refreshData]
  );

  const deleteHandler = React.useCallback(
    async ({ classId }, cb) => {
      const res = await clientService.assetClass.deleteClass(classId);
      if (res.code === 1) {
        dispatch(removeById(classId));
        cb();
        refreshData();
      } else {
        global.$showMessage({
          message: res.message,
          type: 'error',
          autoHideDuration: 5000,
        });
      }
    },
    [dispatch, refreshData]
  );

  const updateHandler = React.useCallback(
    async (class_, cb) => {
      const res = await clientService.assetClass.updateClass(class_.classId, class_);
      if (res.code === 1) {
        dispatch(update(class_));
        cb();
        refreshData();
      } else {
        global.$showMessage({
          message: res.message,
          type: 'error',
          autoHideDuration: 5000,
        });
      }
    },
    [dispatch, refreshData]
  );

  const handleTableContentChange = (data) => {
    filterClassListRef.current = data;
    setSelectedKeys([]);
  };

  React.useEffect(() => {
    refreshData();
  }, [refreshData]);

  React.useEffect(() => {
    // 初始化显示所有数据的条件
    if (selectedKeys.length === 0) {
      setTableContentData(filterClassListRef.current);
      return;
    }
    setTableContentData(
      selectedKeys.length === 0 ? [] : classListRef.current.filter((class_) => class_.parentId === selectedKeys[0])
    );
  }, [selectedKeys, updateFlag]);

  return (
    <Box p={1}>
      <div>
        <TableContentToolbar
          // filterValue={filterValue}
          refreshData={refreshData}
          addHandler={addHandler}
          originData={classListRef.current}
          columns={Object.keys(tableContentHeader).map((key) => ({
            dataIndex: key,
            title: tableContentHeader[key].zh,
          }))}
          tableContentChange={handleTableContentChange}
        />
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
          }}
        >
          <LeftTree
            refreshData={refreshData}
            topTreeId={TOPTREEID}
            addHandler={addHandler}
            deleteHandler={deleteHandler}
            updateHandler={updateHandler}
            classFlatData={classFlatData}
            selectedKeys={selectedKeys}
            setSelectedKeys={setSelectedKeys}
          />
          <TableContent
            topTreeId={TOPTREEID}
            deleteHandler={deleteHandler}
            updateHandler={updateHandler}
            header={tableContentHeader}
            tableData={tableContentData}
          />
        </div>
      </div>
    </Box>
  );
};
