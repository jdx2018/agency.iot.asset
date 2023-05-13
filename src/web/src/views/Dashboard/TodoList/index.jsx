import React, { useState, useEffect } from "react";
import { Card, Row, Col, Skeleton } from "antd";
import EmptyHolder from "../EmptyHolder";
import styles from "./index.module.css";
import TodoItem from "./TodoItem";
import clientService from "api/clientService";

const cardBodyStyles = {
  width: "100%",
};

const LAYOUT_COUNT = 6;

const TodoList = ({ data }) => {
  return (
    <Card
      bodystyle={cardBodyStyles}
      className={styles.card}
      title={<span className={styles.cardTitle}>待处理事项 / Todo list</span>}
    >
      {data ? (
        data.length > 0 ? (
          <Row>
            {data.map((item, index) => (
              <Col key={index} span={24 / LAYOUT_COUNT}>
                <div
                  className={
                    index === LAYOUT_COUNT - 1 ? "" : styles.todoItemWrapper
                  }
                >
                  <TodoItem
                    className={styles.todoItemWrapper}
                    title={item.dName}
                    content={item.qty}
                    componentName={item.dValue}
                  />
                </div>
              </Col>
            ))}
          </Row>
        ) : (
          <EmptyHolder />
        )
      ) : (
        <Skeleton active />
      )}
    </Card>
  );
};

export default TodoList;
