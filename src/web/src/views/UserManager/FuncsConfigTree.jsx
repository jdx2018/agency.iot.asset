import React, { useState, useRef, useEffect, useCallback } from "react";
import { Tree, Space, Button } from "antd";
import { getTreeFromFlatData } from "react-sortable-tree";
import clientService from "api/clientService";
import { Scrollbars } from "react-custom-scrollbars";
import { Divider } from "@material-ui/core";

import CheckboxList from "./CheckboxList";

const FuncsConfig = ({ data, id }) => {
  const dataRef = useRef(data);

  const handleFuncsCheckedChange = useCallback(({ id, funcObj }) => {
    dataRef.current.forEach((v) => {
      if (v.id === id) v.funcObj = funcObj;
    });
  }, []);
  const pageListWithTreeProps = data.map((page) => ({
    ...page,
    title:
      page.componentName &&
      page.funcObj &&
      JSON.stringify(page.funcObj) !== "{}" ? (
        <CheckboxList page={page} onCheckedChange={handleFuncsCheckedChange} />
      ) : (
        page.pageDesc
      ),
    key: page.id,
  }));
  const [gData, setGdata] = useState(() => {
    const treeData = getTreeFromFlatData({
      flatData: pageListWithTreeProps,
      getKey: (node) => node.pageId,
      getParentKey: (node) => node.parentId,
      rootKey: "0",
    });
    return treeData;
  });
  const [expandedKeys, setExpandedKeys] = useState(() =>
    gData.map((treeNode) => treeNode.id)
  );
  const [checkedKeys, setCheckedkeys] = useState(() =>
    pageListWithTreeProps?.reduce(
      (acc, cur) => (cur.status !== 0 ? [...acc, cur.id] : acc),
      []
    )
  );

  const checkedKeysWithRootKeyRef = useRef(
    pageListWithTreeProps.reduce(
      (acc, cur) => (cur.status ? [...acc, cur.id] : acc),
      []
    )
  );

  const onCheck = (checkedKeys, { halfCheckedKeys }) => {
    checkedKeysWithRootKeyRef.current = checkedKeys;
    setCheckedkeys(checkedKeys);
  };

  const handleSubmit = async () => {
    const res = await clientService.user_permission.savePermission_page(
      id,
      dataRef.current
    );
    if (res.code === 1) {
      global.$showMessage({
        message: "功能权限配置成功，重新登录后生效",
        type: "success",
      });
      global.$hideModal();
    } else {
      global.$showMessage({
        message: res.message,
        type: "error",
        autoHideDuration: 5000,
        zIndex: 99999,
      });
    }
  };

  useEffect(() => {
    dataRef.current.forEach((d) => {
      if (checkedKeys.includes(d.id)) {
        d.status = 1;
      } else {
        d.status = 0;
      }
    });
  }, [checkedKeys]);

  return (
    <>
      <Scrollbars
        style={{
          height: "62vh",
        }}
      >
        <Tree
          checkedKeys={checkedKeys}
          onCheck={onCheck}
          defaultExpandedKeys={expandedKeys}
          checkable
          selectable={false}
          blockNode
          showLine={{ showLeafIcon: false }}
          treeData={gData}
        />
      </Scrollbars>
      <Divider />
      <div
        style={{
          marginTop: 10,
          textAlign: "right",
        }}
      >
        <Space>
          <Button type="primary" onClick={handleSubmit}>
            确定
          </Button>
          <Button onClick={() => global.$hideModal()}>取消</Button>
        </Space>
      </div>
    </>
  );
};

export default FuncsConfig;
