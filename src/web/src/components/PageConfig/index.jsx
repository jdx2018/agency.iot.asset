import React, { useState, useRef } from 'react'
import { Tree } from 'antd'
import { getTreeFromFlatData, getFlatDataFromTree } from "react-sortable-tree";

import { getPageData } from "utils/auth";

const PageConfig = () => {
  const pageListWithTreeProps = getPageData(false).map(page => ({ ...page, title: page.pageDesc, key: page.id })).sort((a, b) => a.showIndex - b.showIndex)
  const [gData, setGdata] = useState(() => {
    const treeData = getTreeFromFlatData({
      flatData: pageListWithTreeProps,
      getKey: (node) => node.pageId,
      getParentKey: (node) => node.parentId,
      rootKey: "0",
    })
    return treeData
  })
  const [expandedKeys, setExpandedKeys] = useState(() => gData.map(treeNode => treeNode.id))
  const [checkedKeys, setCheckedkeys] = useState(() => pageListWithTreeProps.reduce((acc, cur) => (cur.status && cur.parentId !== '0') ? [...acc, cur.id] : acc, []))
  const halfCheckedKeysRef = useRef(gData.filter(treeNode => treeNode.children ? !treeNode.children.every(child => child.status === 1) : false).map(treeNode => treeNode.id))
  const checkedKeysWithRootKeyRef = useRef(pageListWithTreeProps.reduce((acc, cur) => (cur.status) ? [...acc, cur.id] : acc, []))

  const gData_copy = gData.reduce((acc, cur) => cur.children ? [...acc, { ...cur, children: cur.children.map(child => ({ ...child, parentId: cur.pageId })) }] : acc, [])
  const flatPageList = getFlatDataFromTree({
    treeData: gData_copy,
    getNodeKey: ({ node }) => node.pageId,
    ignoreCollapsed: false,
  }).map(({ node, path }, index) => ({
    componentName: node.componentName,
    id: node.id,
    pageDesc: node.pageDesc,
    pageId: node.pageId,
    pageName: node.pageName,
    parentId: node.parentId,
    showIndex: index + 1,
    status: node.status,
  }))



  const onCheck = (checkedKeys, { halfCheckedKeys }) => {
    halfCheckedKeysRef.current = halfCheckedKeys
    checkedKeysWithRootKeyRef.current = checkedKeys
    const parentKeys = flatPageList.reduce((acc, cur) => cur.parentId === '0' ? [...acc, cur.id] : acc, [])
    const checkedKeysWithNOParentId = checkedKeys.filter(key => !parentKeys.includes(key))
    setCheckedkeys(checkedKeysWithNOParentId)
  }

  const onDrop = (info) => {
    const data = [...gData];
    const dropNode = info.node
    const dragNode = info.dragNode
    const dropKey = dropNode.props.eventKey;
    const dragKey = dragNode.props.eventKey;
    const dropPos = info.node.props.pos.split('-');
    const dropPosition = info.dropPosition - Number(dropPos[dropPos.length - 1]);

    // disable leaf node to be any root node
    if (!info.dropToGap && dropNode.parentId !== '0') {
      return
    }
    // disable root node to be any leaf node
    if (dragNode.parentId === '0' && dragNode.children?.length === 0) {
      return
    }

    const loop = (data, key, callback) => {
      for (let i = 0; i < data.length; i++) {
        if (data[i].key === key) {
          return callback(data[i], i, data);
        }
        if (data[i].children) {
          loop(data[i].children, key, callback);
        }
      }
    };

    let dragObj;
    loop(data, dragKey, (item, index, arr) => {
      arr.splice(index, 1);
      dragObj = item;
    });


    if (!info.dropToGap) {
      loop(data, dropKey, item => {
        item.children = item.children || [];
        item.children.push(dragObj);
      });
    } else if (
      (info.node.props.children || []).length > 0 &&
      info.node.props.expanded &&
      dropPosition === 1
    ) {
      loop(data, dropKey, item => {
        item.children = item.children || [];
        item.children.unshift(dragObj);
      });
    } else {
      let ar;
      let i;
      loop(data, dropKey, (item, index, arr) => {
        ar = arr;
        i = index;
      });
      if (dropPosition === -1) {
        ar.splice(i, 0, dragObj);
      } else {
        ar.splice(i + 1, 0, dragObj);
      }
    }

    setGdata(data)
  };

  const handleSubmit = () => {
    let flatPageListWithStatusProcessed = flatPageList.slice()
    flatPageListWithStatusProcessed.forEach(page => {
      if (halfCheckedKeysRef.current.includes(page.id)) {
        page.status = 0
      } else if (checkedKeys.includes(page.id) || (gData.map(treeNode => treeNode.id).includes(page.id) && checkedKeysWithRootKeyRef.current.includes(page.id))) {
        page.status = 1
      } else {
        page.status = 0
      }
    })

    console.log(flatPageListWithStatusProcessed)

    // console.log(pageList)

    // const isDropToGap = info.dropToGap,
    //   fromNode = info.dragNode,
    //   toNode = info.node;

    // let cur_pageList_copy = getFlatDataFromTree({
    //   treeData: gData,
    //   getNodeKey: ({ node }) => node.pageId,
    //   ignoreCollapsed: false,
    // }).map(({ node, path }, index) => node);

    // if (isDropToGap) {
    //   cur_pageList_copy.forEach(treeNode => {
    //     if (treeNode.id === fromNode.id) {
    //       treeNode.showIndex = toNode.showIndex
    //     };
    //     if (treeNode.id === toNode.id) {
    //       treeNode.showIndex = fromNode.showIndex
    //     }
    //   })
    // }

    // const cur_pageList_copy_sorted = cur_pageList_copy.sort((a, b) => a.showIndex - b.showIndex)

    // const newGdata = getTreeFromFlatData({
    //   flatData: cur_pageList_copy_sorted,
    //   getKey: (node) => node.pageId,
    //   getParentKey: (node) => node.parentId,
    //   rootKey: "0",
    // })

    // setGdata(newGdata)
  }

  return <>
    <button onClick={handleSubmit}>提交</button>
    <Tree
      checkedKeys={checkedKeys}
      onCheck={onCheck}
      defaultExpandedKeys={expandedKeys}
      draggable
      checkable
      blockNode
      showLine={{ showLeafIcon: false }}
      onDrop={onDrop}
      treeData={gData}
    />
  </>
}

export default PageConfig