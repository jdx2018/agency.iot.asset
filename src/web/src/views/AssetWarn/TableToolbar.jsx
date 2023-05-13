/* eslint-disable jsx-a11y/anchor-has-content */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React from "react";
import { Space } from "antd";
import { AlignLeftOutlined } from "@ant-design/icons";
import { Card } from "@material-ui/core";
import {
  FilesIOBtnGroup,
  AdvanSearch,
  SearchInput,
  ColumnMenuSwitch,
  RefreshBtn,
} from "components";

export default React.memo(
  ({
    originData,
    columns,
    setColumn,
    refreshData,
    setFilterData,
    filterData,
    filterConfig,
  }) => {
    const [drawerOpen, setDrawerOpen] = React.useState(false);

    const handleOpenDrawer = () => {
      setDrawerOpen(true);
    };

    const handleCloseDrawer = React.useCallback((values = null) => {
      setDrawerOpen(false);
    }, []);

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
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            boxShadow: "none",
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

          <Space>
            <SearchInput
              data={originData}
              columns={columns}
              onFilterDataChange={setFilterData}
            />
            <ColumnMenuSwitch columns={columns} columnsChange={setColumn} />
            {/* <a onClick={handleOpenDrawer}>
              <AlignLeftOutlined />{" "}
              <span style={{ userSelect: "none" }}>高级筛选</span>
            </a> */}
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
