/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState } from 'react';
import { Tag } from 'antd';
import TableToolbar from './TableToolbar';
import { getEnum_assetStatus } from 'api/param/paramEnum';
import { Box } from '@material-ui/core';

import AntTable from 'components/AntTable';

import clientService from 'api/clientService';

import ActionDialog from './ActionDialog';
const color_enum = {
  空闲: '#87d068',
  领用中: '#108ee9',
  借用: '#28abb9',
  处置待确认: '#f50',
  处置完成: '#f5b461',
};

export default React.memo(() => {
  const [column, setColumn] = useState([]);
  const [loading, setLoading] = useState({});

  const [tableData, setTableData] = useState([]);
  const [open, setOpen] = useState(false);
  const [formValues, setFormValues] = useState(null);
  const [filterConfig, setFilterConfig] = useState({});
  const [formType, setFormType] = useState('detail');
  const filterRef = React.useRef(null);

  const refreshData = React.useCallback(async (filter = null) => {
    let f = null;
    if (!filter) {
      f = filterRef.current;
    } else if (JSON.stringify(filter) === '{}') {
      filterRef.current = null;
      f = filterRef.current;
    } else {
      filterRef.current = filter;
      f = filterRef.current;
    }
    const f__ = JSON.parse(JSON.stringify(f));
    setLoading(true);
    const res = await clientService.asset.getAssetList(f__);
    if (res.code === 1) {
      const header = res.data.header;
      const column = Object.keys(header).map((header_key) => {
        const column_ = {
          title: header[header_key].zh,
          dataIndex: header_key,
          width: header[header_key].width,
        };
        if (header_key === 'assetId') {
          column_.render = (text, row, index) => {
            return (
              <a
                onClick={async () => {
                  setOpen(true);
                  setFormType('detail');
                  const res = await clientService.asset.getAsset_detail(text);
                  if (res.code === 1) {
                    const data_ = res.data;
                    data_.images = res.data.images ? [res.data.images] : [];
                    setFormValues(data_);
                  } else {
                    global.$showMessage({
                      message: res.message,
                      type: 'error',
                      autoHideDuration: 5000,
                    });
                  }
                }}
              >
                {text}
              </a>
            );
          };
        }
        return column_;
      });
      const enum_res = await getEnum_assetStatus();
      if (enum_res.code === 1) {
        const statusIdx = column.findIndex((c) => c.dataIndex === 'status');
        if (statusIdx > -1) {
          column[statusIdx] = {
            ...column[statusIdx],
            render: (text) => {
              return text ? <Tag color={color_enum[text]}>{text}</Tag> : '--';
            },
          };
        }
      }
      setColumn(column);
      setTableData(res.data.rows);
      setFilterConfig(res.data.filter);
      setLoading(false);
    } else {
      global.$showMessage({
        message: res.message,
        type: 'error',
        autoHideDuration: 5000,
      });
    }
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

  const handleChangeFormType = React.useCallback((type) => {
    setFormType(type);
  }, []);

  return (
    <Box
      style={{
        boxShadow: 'none',
        height: 'calc(100% - 76px)',
      }}
      p={1}
    >
      <AntTable
        loading={loading}
        rowKey='assetId'
        useRowSelect={true}
        column={column}
        TableToolbar={TableToolbar}
        tableData={tableData}
        toolbarProps={{ refreshData }}
        filterConfig={filterConfig}
      />
      <ActionDialog
        changeFormType={handleChangeFormType}
        open={open}
        closeDialog={handleCloseDialog}
        formValues={formValues}
        type={formType}
      />
    </Box>
  );
});
