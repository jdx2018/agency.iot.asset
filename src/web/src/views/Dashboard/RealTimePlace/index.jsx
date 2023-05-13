import React, { useState, useEffect } from "react";
import { Card, Skeleton } from "antd";
import styles from "./index.module.css";
import { Pie } from "@ant-design/charts";
import clientService from "api/clientService";
import EmptyHolder from "../EmptyHolder";

const RealTimePlace = ({ data }) => {
  const config = {
    height: 280,
    // padding: [30, 180, 30, 0],
    data: data.map(({ dName, qty }) => ({
      title: dName,
      content: qty,
    })),
    angleField: "content",
    colorField: "title",
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
    radius: 1,
    innerRadius: 0.64,
    meta: {
      value: {
        formatter: function formatter(v) {
          return "".concat(v, " \xA5");
        },
      },
    },
    label: {
      type: "outer",
      labelHeight: 28,
      content: "{name} | {value} 件({percentage})",
    },
    interactions: [
      { type: "element-selected" },
      { type: "pie-statistic-active" },
    ],
    legend: {
      itemHeight: 20,
      itemName: {
        style: {
          fontSize: 14,
        },
        formatter: (text, item, index) => {
          return `${text}`;
        },
      },
      flipPage: true,
      position: "bottom-right",
    },
  };

  return (
    <Card
      bodyStyle={{
        padding: 10,
      }}
      className={styles.card}
      title={<span className={styles.cardTitle}>位置分布状况</span>}
    >
      {data ? (
        data.length > 0 ? (
          <Pie {...config} />
        ) : (
          <EmptyHolder />
        )
      ) : (
        <Skeleton active />
      )}
    </Card>
  );
};

export default RealTimePlace;
