import React from 'react';
import LeftTree from './LeftTree';
import TableContent from './TableContent';
import { Box } from '@material-ui/core';

import TableContentToolbar from './TableContentToolbar';

import { useDispatch } from 'react-redux';
import { add, removeById, update } from 'store/slices/place';

import clientService from 'api/clientService';

const TOPTREEID = '1';

export default () => {
  const dispatch = useDispatch();
  const [selectedKeys, setSelectedKeys] = React.useState([TOPTREEID]);

  const [placeFlatData, setPlaceFlatData] = React.useState([]);

  const [tableContentData, setTableContentData] = React.useState([]);

  const [tableContentHeader, setTableContentHeader] = React.useState([]);

  const [updateFlag, setUpdateFlag] = React.useState(0);

  const placeListRef = React.useRef([]);
  const filterPlaceListRef = React.useRef([]);

  const refreshData = React.useCallback(async () => {
    const res = await clientService.assetPlace.getPlaceList_all();
    if (res.code === 1) {
      placeListRef.current = res.data.rows;
      filterPlaceListRef.current = res.data.rows;

      setTableContentHeader(res.data.header);
      setUpdateFlag((c) => c + 1);

      setPlaceFlatData(
        res.data.rows.map((nodeData) => ({ key: nodeData.placeId, title: nodeData.placeName, ...nodeData }))
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
    async (org, cb) => {
      const res = await clientService.assetPlace.addPlace(org);
      if (res.code === 1) {
        dispatch(add(org));
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
    async ({ placeId }, cb) => {
      const res = await clientService.assetPlace.deletePlace(placeId);
      if (res.code === 1) {
        dispatch(removeById(placeId));
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
    async (place, cb) => {
      const res = await clientService.assetPlace.updatePlace(place.placeId, place);
      if (res.code === 1) {
        dispatch(update(place));
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
    filterPlaceListRef.current = data;
    setSelectedKeys([]);
  };

  React.useEffect(() => {
    refreshData();
  }, [refreshData]);

  React.useEffect(() => {
    // 初始化显示所有数据的条件
    if (selectedKeys.length === 0) {
      setTableContentData(filterPlaceListRef.current);
      return;
    }
    setTableContentData(
      selectedKeys.length === 0 ? [] : placeListRef.current.filter((place_) => place_.parentId === selectedKeys[0])
    );
  }, [selectedKeys, updateFlag]);

  return (
    <Box p={1}>
      <div>
        <TableContentToolbar
          refreshData={refreshData}
          addHandler={addHandler}
          originData={placeListRef.current}
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
            placeFlatData={placeFlatData}
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
