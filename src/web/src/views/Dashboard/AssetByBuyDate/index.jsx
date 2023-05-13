import React from "react";
import { Card, Skeleton } from "antd";
import styles from "./index.module.css";
import { Column } from "@ant-design/charts";
import EmptyHolder from "../EmptyHolder";

const AssetByBuyDate = ({ data }) => {
  const config = {
    data: data
      .sort((a, b) => {
        return a.year - b.year;
      })
      .map(({ year, qty }) => ({
        title: year,
        content: qty,
      })),
    xField: "title",
    yField: "content",
    height: 280,
    color: [
      "#61b15a",
      "#adce74",
      "#fff76a",
      "#ffce89",
      "#ec5858",
      "#fd8c04",
      "#9088d4",
      "#16a596",
      "#ee6f57",
      "#32e0c4",
      "#fdb827",
      "#1f6f8b",
      "#968c83",
      "#efbbcf",
      "#d2e603",
      "#40a8c4",
      "#d9adad",
      "#fe91ca",
      "#251f44",
      "#fa1616",
    ],
    label: {
      // 可手动配置 label 数据标签位置
      position: "middle",
      // 'top', 'bottom', 'middle',
      // 配置样式
      style: {
        fill: "#FFFFFF",
        opacity: 0.6,
      },
    },
    xAxis: {
      label: {
        autoHide: true,
        autoRotate: false,
      },
    },
    meta: {
      title: {
        alias: "年份",
      },
      content: {
        alias: "件",
      },
    },
    minColumnWidth: 5,
    maxColumnWidth: 35,
  };

  return (
    <Card
      bodyStyle={{
        padding: 10,
      }}
      className={styles.card}
      title={<span className={styles.cardTitle}>采购日期统计</span>}
    >
      {data ? (
        data.length > 0 ? (
          <Column {...config} />
        ) : (
          <EmptyHolder />
        )
      ) : (
        <Skeleton active />
      )}
    </Card>
  );
};

export default AssetByBuyDate;
