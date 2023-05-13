import React, { useState, useEffect, useMemo } from "react";
import { Card, Skeleton, Select } from "antd";
import dayjs from "dayjs";
import { Column } from "@ant-design/charts";

import styles from "./index.module.css";
import EmptyHolder from "../EmptyHolder";

const AssetStament = ({ data }) => {
  const [selectYear, setSelectYear] = useState(dayjs().format("YYYY") + "年");
  const [yearList, setYearList] = useState([]);
  const [curData, setCurData] = useState([]);

  useEffect(() => {
    const curData = [];
    const yearObj = {};

    data.forEach((item) => {
      const { year } = item;
      if (selectYear === year) {
        curData.push(item);
      }
      yearObj[year] = {
        tValue: year,
      };
    });
    yearObj[dayjs().format("YYYY")] = { tValue: dayjs().format("YYYY") };
    setCurData(curData);
    setYearList(Object.values(yearObj));
  }, [data, selectYear]);

  const viewData = useMemo(() => {
    const result = [];
    new Array(12).fill(0).forEach((_, index) => {
      const curMonth = index + 1 + "月";
      const tempData = {
        借出: { title: curMonth, dName: "借出", content: 0 },
        归还: { title: curMonth, dName: "归还", content: 0 },
        派发: { title: curMonth, dName: "派发", content: 0 },
        退库: { title: curMonth, dName: "退库", content: 0 },
        维修: { title: curMonth, dName: "维修", content: 0 },
        处置: { title: curMonth, dName: "处置", content: 0 },
      };

      curData
        .filter((item) => item.month + "月" === curMonth)
        .forEach(({ dName, qty }) => {
          tempData[dName]["content"] = qty;
        });

      result.push(...Object.values(tempData));
    });
    return result;
  }, [curData]);

  const config = {
    data: viewData,
    isGroup: true,
    xField: "title",
    yField: "content",
    seriesField: "dName",
    dodgePadding: 0,
    height: 280,
    label: {
      // 可手动配置 label 数据标签位置
      position: "middle",
      // 'top', 'bottom', 'middle',
      // 配置样式
      style: {
        fill: "#FFFFFF",
        opacity: 0.6,
      },
      layout: [
        // 柱形图数据标签位置自动调整
        {
          type: "interval-adjust-position",
        }, // 数据标签防遮挡
        {
          type: "interval-hide-overlap",
        }, // 数据标签文颜色自动调整
        {
          type: "adjust-color",
        },
      ],
    },
    xAxis: {
      label: {
        autoHide: true,
        autoRotate: false,
      },
    },
    meta: {
      title: {
        alias: "月份",
      },
      content: {
        alias: "件",
      },
    },
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
      title={
        <div id="monthSelectedAssetStament">
          <span className={styles.cardTitle}>资产流程统计</span>
          <Select
            defaultValue={selectYear}
            style={{
              width: 100,
              marginLeft: 12,
              fontSize: 17,
              textAlign: "center",
              textIndent: 0,
            }}
            size="middle"
            onChange={(value) => setSelectYear(value)}
            getPopupContainer={() =>
              document.getElementById("monthSelectedAssetStament")
            }
            options={yearList.map(({ tValue }) => ({
              value: tValue,
              label: tValue + "年",
            }))}
          />
        </div>
      }
    >
      {curData ? (
        curData.length > 0 ? (
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

export default AssetStament;
