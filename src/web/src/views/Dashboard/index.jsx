import React, { useEffect, useState, useCallback } from "react";
import { Scrollbars } from "react-custom-scrollbars";
import { Row, Col } from "antd";
import clientService from "api/clientService";

import TodoList from "./TodoList";
import RealTimeAssetStatus from "./RealTimeAssetStatus";
import RealTimePlace from "./RealTimePlace";
import FastReach from "./FastReach";
import AssetByOrg from "./AssetByOrg";
import AssetByBuyDate from "./AssetByBuyDate";
import AssetBWwarningDate from "./AssetBWwarningDate";
import AssetStament from "./AssetStament";

import styles from "./index.module.css";

const Dashboard = () => {
  const [data, setData] = useState([]);

  const refreshData = useCallback(async () => {
    const res = await clientService.dashBoard.get_dashboard_data();
    if (res.code === 1) {
      setData(res.data);
    } else {
      global.$showMessage({
        type: "error",
        message: res.message,
      });
      setData([]);
    }
  }, []);

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  const [todoList, setTodoList] = useState([]);
  const [assetByStatus, setAssetByStatus] = useState([]);
  const [assetByPlace, setAssetByPlace] = useState([]);
  const [assetByOrg, setAssetByOrg] = useState([]);
  const [assetByDate, setAssetByDate] = useState([]);
  const [assetByWarningDate, setAssetBWwarningDate] = useState([]);
  const [stament, setStament] = useState([]);

  useEffect(() => {
    if (data.length !== 0) {
      let todoList = [],
        assetByStatus = [],
        assetByPlace = [],
        assetByOrg = [],
        assetByDate = [],
        assetByWarningDate = [],
        stament = [];
      for (let item of data) {
        const { dimension } = item;
        switch (dimension) {
          case "asset_ownOrgId":
            assetByOrg.push(item);
            break;
          case "asset_status":
            assetByStatus.push(item);
            break;
          case "asset_placeId":
            assetByPlace.push(item);
            break;
          case "asset_year_purchaseDate":
            assetByDate.push(item);
            break;
          case "bill_detail_every_month_checked":
            stament.push(item);
            break;
          case "todo_list":
            todoList.push(item);
            break;
          case "asset_outdate_every_month":
            assetByWarningDate.push(item);
            break;
        }
      }
      setTodoList(todoList);
      setAssetByStatus(assetByStatus);
      setAssetByPlace(assetByPlace);
      setAssetByOrg(assetByOrg);
      setAssetByDate(assetByDate);
      setAssetBWwarningDate(assetByWarningDate);
      setStament(stament);
    }
  }, [data]);

  return (
    <Scrollbars>
      <div className={styles.wrapper}>
        <Row>
          <Col span={24}>
            <TodoList data={todoList} />
          </Col>
        </Row>
        <br />
        <Row gutter={16}>
          <Col span={12}>
            <RealTimeAssetStatus data={assetByStatus} />
          </Col>
          <Col span={12}>
            <RealTimePlace data={assetByPlace} />
          </Col>
        </Row>
        <br />
        <Row gutter={16}>
          <Col span={12}>
            <AssetByOrg data={assetByOrg} />
          </Col>
          <Col span={12}>
            <AssetByBuyDate data={assetByDate} />
          </Col>
        </Row>
        <br />
        <Row gutter={16}>
          <Col span={24}>
            <AssetBWwarningDate data={assetByWarningDate} />
          </Col>
        </Row>
        <br />
        <Row gutter={16}>
          <Col span={24}>
            <AssetStament data={stament} />
          </Col>
        </Row>
        <br />
        <Row>
          <Col span={24}>
            <FastReach />
          </Col>
        </Row>
      </div>
    </Scrollbars>
  );
};

export default Dashboard;
