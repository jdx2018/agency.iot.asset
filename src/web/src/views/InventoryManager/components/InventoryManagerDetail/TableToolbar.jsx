/* eslint-disable jsx-a11y/anchor-is-valid */
import React from "react";
import { Space, Button, Dropdown, Menu, Modal } from "antd";
import { AlignLeftOutlined, LeftOutlined, DownOutlined } from "@ant-design/icons";
import { Card } from "@material-ui/core";
import { AdvanSearch, ColumnMenuSwitch, SearchInput, RefreshBtn, ToggleAllBtn, HideButtonWithAuth } from "components";
import { makeStyles } from "@material-ui/core/styles";

import clientService from 'api/clientService'


const useStyle = makeStyles(theme => ({
  button: {
    padding: "4px 8px",
    "&>span": {
      marginLeft: 2,
      color: "#33cbcc",
      // eslint-disable-next-line no-dupe-keys
      marginLeft: "2px !important"
    }
  }
}))

export default React.memo(
  ({
    originData,
    filterData,
    columns,
    setColumn,
    refreshData,
    setFilterData,
    selected,
    setSelectedRowKeys,
    pageSize,
    filterConfig,
    handleBack,
    billNo,
  }) => {
    const selectedRowKeys = Object.values(selected).reduce((acc, cur) => acc.concat(cur), []);
    const [drawerOpen, setDrawerOpen] = React.useState(false);

    const classes = useStyle();

    const handleOpenDrawer = () => {
      setDrawerOpen(true);
    };

    const handleCheck = async () => {
      const res = await clientService.bill_pand.checkDetail(billNo, originData.filter(_ => selectedRowKeys.includes(_.rowId)).map(_ => ({ assetId: _.assetId })));
      if (res.code === 1) {
        global.$showMessage({
          message: res.message,
          type: "success",
        });
        refreshData();
      } else {
        global.$showMessage({
          message: res.message,
          type: "error",
          autoHideDuration: 5000,
        });
      }
    }

    const handleCancelCheck = async () => {
      const res = await clientService.bill_pand.unCheckDetail(billNo, originData.filter(_ => selectedRowKeys.includes(_.rowId)).map(_ => ({ assetId: _.assetId })));
      if (res.code === 1) {
        global.$showMessage({
          message: res.message,
          type: "success",
        });
        refreshData();
      } else {
        global.$showMessage({
          message: res.message,
          type: "error",
          autoHideDuration: 5000,
        });
      }
    }

    const handleComplete = () => {
      Modal.confirm({
        title: "警告",
        content: `确认是否整单完成？`,
        onOk: async () => {
          const res = await clientService.bill_pand.checkBill(billNo);
          if (res.code === 1) {
            global.$showMessage({
              message: res.message,
              type: "success",
            });
            refreshData();
          } else {
            global.$showMessage({
              message: res.message,
              type: "error",
              autoHideDuration: 5000,
            });
          }
        },
      });
    }

    const handleCloseDrawer = React.useCallback(() => {
      setDrawerOpen(false);
    }, []);


    const handleValuesChange = React.useCallback(
      (filters) => {
        refreshData(filters)
      },
      [refreshData]
    );

    return (
      <>
        <Card
          style={{
            marginBottom: 10,
            padding: 10,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            boxShadow: "none",
          }}
        >
          <Space size={10}>
            <Button
              onClick={handleBack}
              className={classes.button}
            >
              <LeftOutlined />返回列表
            </Button>

            <HideButtonWithAuth funcId="pandian_detail_shenhe">
              <Dropdown
                overlay={<Menu>
                  <Menu.Item onClick={handleCheck}>
                    审核
                </Menu.Item>
                  <Menu.Item onClick={handleCancelCheck} >
                    取消审核
                </Menu.Item>
                </Menu>}
                disabled={selectedRowKeys.length === 0}
              >
                <Button className={classes.button}>
                  <DownOutlined />审核操作
              </Button>
              </Dropdown>
            </HideButtonWithAuth>
            <HideButtonWithAuth funcId="pandian_detail_zhengdanwancheng">
              <Button
                onClick={handleComplete}
                type="primary"
              >
                整单完成
            </Button>
            </HideButtonWithAuth>
          </Space>

          <Space>
            <ToggleAllBtn originDataWithKey={filterData.map(v => v.rowId)} setSelectedRowKeys={setSelectedRowKeys}
              pageSize={pageSize}
            />
            <SearchInput
              data={originData}
              columns={columns}
              onFilterDataChange={setFilterData}
            />
            <ColumnMenuSwitch columns={columns} columnsChange={setColumn} />
            {
              filterConfig && <a onClick={handleOpenDrawer}>
                <AlignLeftOutlined /> <span style={{ userSelect: 'none' }}>高级筛选</span>
              </a>
            }
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
