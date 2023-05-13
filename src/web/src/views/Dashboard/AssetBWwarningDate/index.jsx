import React, { useState, useEffect } from "react";
import { Card, Skeleton, Select } from "antd";
import dayjs from "dayjs";
import { Column } from "@ant-design/charts";

import styles from "./index.module.css";
import EmptyHolder from "../EmptyHolder";

const AssetBWwarningDate = ({ data }) => {
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

  const config = {
    data: new Array(12).fill(0).map((_, index) => {
      const curMonthItem = curData.find((item) => {
        return parseInt(item.month) === index + 1;
      }) || { month: index + 1, qty: 0 };
      return { title: curMonthItem.month + "月", content: curMonthItem.qty };
    }),
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
        alias: "月份",
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
      title={
        <div id="monthSelectedOrgContainer">
          <span className={styles.cardTitle}>资产预警统计</span>
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
              document.getElementById("monthSelectedOrgContainer")
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

export default AssetBWwarningDate;
