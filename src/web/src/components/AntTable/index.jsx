import React, { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { Table, Pagination } from "antd";
import { Box, Card } from "@material-ui/core";
import matchSorter from "match-sorter";

import { Scrollbars } from "react-custom-scrollbars";
import app_config from "config/app";
import * as lodash from "lodash";

const sortFunc = (dataIndex, a, b) => {
  const stringA = a[dataIndex] ? a[dataIndex].toString().toUpperCase() : "";
  const stringB = b[dataIndex] ? b[dataIndex].toString().toUpperCase() : "";
  if (stringA < stringB) {
    return -1;
  }
  if (stringA > stringB) {
    return 1;
  }
  return 0;
};

export default React.memo(
  ({
    rowKey,
    tableData,
    height,
    TableToolbar,
    useRowSelect,
    column,
    filterConfig,
    billTitle,
    toolbarProps,
    footerExpandRender,
    extraRowSelection = {},
    onSelectedChange = () => {},
    ...restProps
  }) => {
    // 表格现有数据（过滤后）
    const dataRef = useRef(tableData || []);

    // 总数据
    const dataOriginRef = useRef(tableData || []);
    // 启用checkbox后的记录选中对象
    const selectedRef = useRef({});
    const [selected, setSelected] = useState({});

    // 表格当前页数据
    const [data, setData] = useState([]);

    const [column_, setColumn_] = useState([]);
    // 表格当前页选中项
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);

    const [pageSize, setPageSize] = useState(20);

    const [current, setCurrent] = useState(1);
    const currentRef = useRef(1);

    const detergent = useRef({});

    const tableScrollRef = useRef();

    let rowSelection = useRowSelect
      ? {
          selectedRowKeys,
          onChange: (selectedRowKeys, selectedRows) => {
            setSelected((c) => {
              const c_ = { ...c, [current]: selectedRowKeys };
              // NOT FOR SURE
              detergent.current.select = c_;
              onSelectedChange(Object.values(detergent.current.select).reduce((acc, cur) => acc.concat(cur), []));
              return c_;
            });
            selectedRef.current[current] = selectedRowKeys;
            setSelectedRowKeys(selectedRef.current[current]);
          },
          ...extraRowSelection,
        }
      : false;

    // if (restProps.rowSelection) {
    //   rowSelection = { ...restProps.rowSelection, ...rowSelection }
    // }

    // console.log(rowSelection)

    // const columnsChangeHandler = (column_) => {
    //   setColumn_(column_);
    // };

    // const filterDataChangeHandle = (data) => {
    //   dataRef.current = data;
    //   setData(data.slice(0, pageSize));
    // };

    // const onShowSizeChange = (current, nextPageSize) => {
    //   setPageSize(nextPageSize);
    //   // const totalSelected = Object.values(selectedRef.current).reduce((acc, cur) => acc.concat(cur), [])
    //   // setSelectedRowKeys(totalSelected);
    //   // console.log(totalSelected)
    //   const currentTotalPages = parseInt(dataRef.current.length / pageSize) + 1
    //   const nextTotalPages = parseInt(dataRef.current.length / nextPageSize) + 1
    //   console.log(currentTotalPages, nextTotalPages)
    // };

    const handleTableChange = (pagination, filters, { column, order }, extra) => {
      switch (order) {
        case "ascend":
          const dataRef_copy1 = lodash.cloneDeep(dataRef.current);

          detergent.current.sort = { sortType: "ascend", sortField: column.dataIndex };

          setData(
            dataRef_copy1
              .sort((a, b) => sortFunc.call(null, column.dataIndex, b, a))
              .slice((current - 1) * pageSize, current * pageSize)
          );
          break;
        case "descend":
          const dataRef_copy2 = lodash.cloneDeep(dataRef.current);

          detergent.current.sort = { sortType: "descend", sortField: column.dataIndex };

          setData(
            dataRef_copy2
              .sort((a, b) => sortFunc.call(null, column.dataIndex, a, b))
              .slice((current - 1) * pageSize, current * pageSize)
          );
          break;
        default:
          detergent.current.sort = undefined;
          setData(dataRef.current.slice((current - 1) * pageSize, current * pageSize));
      }
    };

    const onChange = (page, pageSize) => {
      setCurrent(page);
      currentRef.current = page;
      setData(dataRef.current.slice((page - 1) * pageSize, page * pageSize));

      setSelected((c) => ({ ...c, [current]: selectedRowKeys }));
      // selectedRef.current[current] = selectedRowKeys;
      if (selectedRef.current[page]) {
        setSelectedRowKeys(selectedRef.current[page]);
      }
    };

    useEffect(() => {
      const columnConfig = {
        sorter: true,
        showSorterTooltip: false,
      };
      setColumn_(column.map((_) => ({ ..._, ...columnConfig })));
    }, [column]);

    useEffect(() => {
      dataRef.current = tableData;
      dataOriginRef.current = tableData;
      // setData(tableData.slice((current - 1) * pageSize, current * pageSize))
      if (tableData) setData(tableData.slice(0, pageSize));
    }, [tableData, pageSize]);

    useEffect(() => {
      // clear selected action, not the final plan
      // const selected_copy = lodash.cloneDeep(selected)

      // Object.keys(selected_copy).forEach(_ => {
      //   selected_copy[_] = []
      // })
      // selectedRef.current = selected_copy
      // setSelected(selected_copy)
      // setSelectedRowKeys([])

      if (detergent.current.filter) {
        const searchText = detergent.current.filter;
        const filterData = searchText
          ? matchSorter(dataRef.current, searchText.trim(), {
              keys: column_.map((c) => c.dataIndex),
            })
          : dataRef.current;
        dataRef.current = filterData;
        setData(filterData.slice((current - 1) * pageSize, current * pageSize));
      }

      if (detergent.current.sort) {
        const dataRef_copy = lodash.cloneDeep(dataRef.current);
        const isAscend = detergent.current.sort.sortType === "ascend";
        setData(
          dataRef_copy
            .sort((a, b) => sortFunc.call(null, detergent.current.sort.sortField, isAscend ? b : a, isAscend ? a : b))
            .slice((current - 1) * pageSize, current * pageSize)
        );
      }

      // maybe not neeed
      // if (detergent.current.select) {
      //   if (selectedRef.current[current]) {
      //     setSelectedRowKeys(selectedRef.current[current]);
      //   }
      // }

      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [tableData]);

    useEffect(() => {
      if (detergent.current.sort) {
        const dataRef_copy = lodash.cloneDeep(dataRef.current);
        const isAscend = detergent.current.sort.sortType === "ascend";
        setData(
          dataRef_copy
            .sort((a, b) => sortFunc.call(null, detergent.current.sort.sortField, isAscend ? b : a, isAscend ? a : b))
            .slice((current - 1) * pageSize, current * pageSize)
        );
      }
    }, [current, pageSize]);

    useEffect(() => {
      tableScrollRef.current.scrollTop(0);
    }, [current]);

    useEffect(() => {
      setData(dataRef.current.slice((currentRef.current - 1) * pageSize, currentRef.current * pageSize));
    }, [tableData]);

    const handleSetCurrent = useCallback((current) => {
      setCurrent(current);
      currentRef.current = current;
    }, []);
    const handleSetColumn = useCallback((column_) => {
      setColumn_(column_);
    }, []);
    const handleSetSelectedRowKeys = useCallback(
      (selected) => {
        if (!selected) {
          Object.keys(selectedRef.current).forEach((s) => {
            selectedRef.current[s] = [];
          });
          // TODO TO BE TEST
          setSelected((c) => {
            Object.keys(c).forEach((s) => {
              c[s] = [];
            });
            return c;
          });
        } else {
          selectedRef.current = selected;
          setSelected(selected);
        }
        setSelectedRowKeys(selectedRef.current[current]);
      },
      [current]
    );
    const handleSetOriginData = useCallback((data) => {
      dataOriginRef.current = data;
    }, []);
    const handleSetFilterData = useCallback(
      (data, searchText) => {
        dataRef.current = data;
        detergent.current.filter = searchText;
        setData(dataRef.current.slice(0, pageSize));
      },
      [pageSize]
    );

    const totalSelectedCount = Object.values(selectedRef.current).reduce((acc, cur) => acc.concat(cur), []).length;

    const tableRowClassName = (record, index) => {
      if (index % 2 === 0) {
        return "bg-f7f8fa";
      }
    };

    const tableMinWidth = useMemo(
      () =>
        column.reduce((acc, cur) => {
          if (cur.width && typeof cur.width === "number") {
            return acc + cur.width;
          }
          return acc + app_config.defaultColumnWidth;
        }, 0) + 50,
      [column]
    );

    const columnsWithHideAction = useMemo(() => column_.filter((c) => !c.hide), [column_]);
    return (
      <Box
        style={{
          height: "inherit",
        }}
      >
        {TableToolbar && (
          <TableToolbar
            {...toolbarProps}
            billTitle={billTitle}
            filterData={dataRef.current}
            setFilterData={handleSetFilterData}
            originData={dataOriginRef.current}
            setOriginData={handleSetOriginData}
            selected={selected}
            setSelectedRowKeys={handleSetSelectedRowKeys}
            columns={column_}
            setColumn={handleSetColumn}
            pageSize={pageSize}
            current={current}
            setCurrent={handleSetCurrent}
            filterConfig={filterConfig}
          />
        )}
        <Card
          style={{
            boxShadow: "none",
            marginBottom: 10,
            height: "100%",
          }}
        >
          <Scrollbars ref={tableScrollRef} style={{ width: "100%", height: "inherit" }}>
            <div
              style={{
                minWidth: tableMinWidth,
              }}
            >
              <Table
                {...restProps}
                rowClassName={tableRowClassName}
                // bordered
                rowSelection={rowSelection}
                rowKey={rowKey}
                size="middle"
                pagination={false}
                columns={columnsWithHideAction}
                dataSource={data}
                sticky
                onChange={handleTableChange}
              />
            </div>
          </Scrollbars>
        </Card>
        <div
          style={{
            paddingLeft: 10,
            paddingRight: 10,
            boxShadow: "none",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            共&nbsp;
            <span
              style={{
                fontSize: 16,
                color: "#00bcd4",
                backgroundColor: "#fff!important",
              }}
            >
              {dataRef.current ? dataRef.current.length : 0}&nbsp;
            </span>
            条数据
            {useRowSelect && (
              <span>
                ，当前选中
                <span
                  style={{
                    fontSize: 16,
                    color: "#00bcd4",
                  }}
                >
                  {" "}
                  {totalSelectedCount}{" "}
                </span>
                条
              </span>
            )}
            <div
              style={{
                marginLeft: 20,
              }}
            >
              {footerExpandRender && footerExpandRender.call(null, tableData)}
            </div>
          </div>

          <div>
            <Pagination
              hideOnSinglePage
              showSizeChanger={false}
              onChange={onChange}
              current={current}
              total={dataRef.current ? dataRef.current.length : 0}
              pageSize={pageSize}
            />
          </div>
        </div>
      </Box>
    );
  }
);
