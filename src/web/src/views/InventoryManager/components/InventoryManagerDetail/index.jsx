import React, { useState, useCallback } from "react";
import { AntTable } from "components";
import TableToolbar from "./TableToolbar";
import { Card } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

import clientService from 'api/clientService'

const BILL_TITLE = "盘点明细";

function InventoryManagerDetail({
  billNo,
  handleBack
}) {
  const [tableData, setTableData] = useState([]);
  const [column, setColumn] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filterConfig, setFilterConfig] = useState({});
  const filterRef = React.useRef(null);

  const classes = useStyle();

  const refreshData = useCallback(async (filter = null) => {
    let f = null;
    if (!filter) {
      f = filterRef.current;
    } else if (JSON.stringify(filter) === "{}") {
      filterRef.current = null;
      f = filterRef.current;
    } else {
      filterRef.current = filter;
      f = filterRef.current;
    }
    setLoading(true);
    const filter_ = JSON.parse(JSON.stringify(f));
    const res = await clientService.bill_pand.queryBillDetail(billNo, filter_);
    setLoading(false);
    if (res.code === 1) {
      const header = res.data.header;
      const column = Object.keys(header).map((header_key) => {
        const column_ = {
          title: header[header_key].zh,
          dataIndex: header_key,
          width: header[header_key].width,
        };
        return column_;
      });
      setColumn(column);
      setTableData(res.data.rows);
      setFilterConfig(res.data.filter);
    } else {
      global.$showMessage({
        message: res.message,
        type: "error",
        autoHideDuration: 5000,
      });
    }
  }, [billNo]);

  const footerExpandRender = useCallback((data) => {
    return <div key="ex">
      <span>
        盘点
        <span
          style={{
            fontSize: 16,
            color: "#00bcd4",
          }}
        >
          {' '}{data.length > 0 ? data.filter(_ => _.status === '审核完成' || _.status === '待审核').length : 0}
        </span>{' '}
                项
        </span>
      {"，"}
      <span>
        未盘点
        <span
          style={{
            fontSize: 16,
            color: "#00bcd4",
          }}
        >
          {' '}{data.length > 0 ? data.filter(_ => _.status === '盘点中').length : 0}
        </span>{' '}
                项
        </span>
    </div>
  }, [])

  return <div style={{height: "calc(100% - 60px)"}} >
    {/*<Card className={classes.card} >
			<div className={classes.assetStatistics} >
				<div>【资产盘点情况】: 全部(0) 未盘(0) 已盘(0) 盘盈(0) 盘亏(0) </div>
				<div>【资产审核情况】: 全部(0) 未审核(0) 已审核(0) 已驳回(0) </div>
			</div> 
		</Card>*/}

    <Card className={classes.card} >
      <span>盘点详情</span>
    </Card>
    <AntTable
      footerExpandRender={footerExpandRender}
      billTitle={BILL_TITLE}
      loading={loading}
      rowKey="rowId"
      useRowSelect={true}
      column={column}
      TableToolbar={TableToolbar}
      tableData={tableData}
      filterConfig={filterConfig}
      toolbarProps={{ refreshData, rowKey: "assetId", handleBack, billNo }}
    />
  </div>
}

const useStyle = makeStyles(theme => ({
  card: {
    margin: "0px 0px 10px",
    lineHeight: "28px",
    boxShadow: "none",
    padding: 10,
    "&>span": {
      fontSize: 16,
      fontWeight: 300
    }
  },
  assetStatistics: {
    display: "flex",
  }
}))

export default InventoryManagerDetail;