import React from 'react';
import { Tree, Input, Space, Dropdown, Menu, Modal } from 'antd';
import { ResizableBox } from 'react-resizable';
import { Card } from '@material-ui/core';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import TreeNodeActionDialogContent from './TreeNodeActionDialogContent';
import { getTreeFromFlatData } from 'react-sortable-tree';
import { UploadDialog } from 'components';
import { exportExcelWithManySheet } from 'utils/common';
import clientService from 'api/clientService';

const menuItemStyles = {
  textAlign: 'center',
  fontSize: 12,
};

const uploadConfig = {
  getTemplateFunc: clientService.exportImport.assetPlace.getTemplate,
  checkFunc: clientService.exportImport.assetPlace.check,
  uploadFunc: clientService.assetPlace.addPlaceList,
};

const { Search } = Input;

export default React.memo(
  ({
    setSelectedKeys,
    selectedKeys,
    placeFlatData,
    addHandler,
    deleteHandler,
    updateHandler,
    topTreeId,
    refreshData,
  }) => {
    const [expandedKeys, setExpandedKeys] = React.useState([]);
    const [searchValue, setSearchValue] = React.useState('');
    const [autoExpandParent, setAutoExpandParent] = React.useState(true);
    const [actionBtns, setActionBtns] = React.useState({});
    const [open, setOpen] = React.useState(false);

    const treeData = React.useMemo(
      () =>
        getTreeFromFlatData({
          flatData: placeFlatData,
          getKey: (node) => node.placeId,
          getParentKey: (node) => node.parentId,
          rootKey: '0',
        }),
      [placeFlatData]
    );

    const dataList = [];
    const generateList = (data) => {
      for (let i = 0; i < data.length; i++) {
        const node = data[i];
        const { key, title } = node;
        dataList.push({ key, title });
        if (node.children) {
          generateList(node.children);
        }
      }
    };

    generateList(treeData);

    const getParentKey = (key, tree) => {
      let parentKey;
      for (let i = 0; i < tree.length; i++) {
        const node = tree[i];
        if (node.children) {
          if (node.children.some((item) => item.key === key)) {
            parentKey = node.key;
          } else if (getParentKey(key, node.children)) {
            parentKey = getParentKey(key, node.children);
          }
        }
      }
      return parentKey;
    };

    const onExpand = (expandedKeys) => {
      setExpandedKeys(expandedKeys);
      setAutoExpandParent(false);
    };

    const loop = (data) =>
      data.map((item) => {
        const index = item.title.indexOf(searchValue);
        const beforeStr = item.title.substr(0, index);
        const afterStr = item.title.substr(index + searchValue.length);
        const title =
          index > -1 ? (
            <span>
              {beforeStr}
              <span
                style={{
                  color: '#00bcd4',
                }}
              >
                {searchValue}
              </span>
              {afterStr}
            </span>
          ) : (
            <span>{item.title}</span>
          );
        if (item.children) {
          return { title, key: item.key, children: loop(item.children) };
        }

        return {
          title,
          key: item.key,
        };
      });

    const onSearch = (e) => {
      const { value } = e.target;
      const expandedKeys = dataList
        .map((item) => {
          if (item.title.indexOf(value) > -1) {
            return getParentKey(item.key, treeData);
          }
          return null;
        })
        .filter((item, i, self) => item && self.indexOf(item) === i);
      setExpandedKeys(expandedKeys);
      setSearchValue(value);
      setAutoExpandParent(true);
    };

    const handleEdit = React.useCallback(
      (nodeKey, e) => {
        const cur_node = placeFlatData.find((place_) => place_.placeId === nodeKey);
        let currentPlaceId, currentPlaceName, placeId;
        [currentPlaceId, currentPlaceName, placeId] = [cur_node.placeId, cur_node.placeName, cur_node.parentId];
        e.stopPropagation();
        global.$showModal({
          zIndex: 9998,
          content: (
            <TreeNodeActionDialogContent
              updateHandler={updateHandler}
              type='edit'
              initialFormValues={{ currentPlaceId, currentPlaceName, placeId }}
            />
          ),
          title: `编辑位置`,
        });
      },
      [placeFlatData, updateHandler]
    );

    const handleDelete = React.useCallback(
      (nodeKey, e) => {
        Modal.confirm({
          title: '警告',
          content: '确认删除位置信息？子位置信息也会一并删除',
          onOk: async () => {
            deleteHandler({ placeId: nodeKey }, () => {
              global.$showMessage({
                message: '删除位置成功',
                type: 'success',
              });
            });
          },
        });
        e.stopPropagation();
      },
      [deleteHandler]
    );

    const handleSelectTreeNode = (selectedKeys) => {
      setSelectedKeys(selectedKeys);
    };

    const handleAddMenuClick = React.useCallback(
      (nodeKey, e) => {
        e.domEvent.stopPropagation();
        let parentPlaceId = null;
        if (e.key === '同级位置') {
          parentPlaceId = placeFlatData.find((place_) => place_.placeId === nodeKey).parentId;
        } else {
          parentPlaceId = nodeKey;
        }
        global.$showModal({
          zIndex: 9998,
          content: (
            <TreeNodeActionDialogContent
              addHandler={addHandler}
              type='create'
              initialFormValues={{ placeId: parentPlaceId }}
            />
          ),
          title: `新增${e.key}`,
        });
      },
      [addHandler, placeFlatData]
    );

    const LeafNodeRender = React.useCallback(
      (nodeData) => {
        return (
          <div
            style={{
              width: '100%',
              display: 'flex',
              justifyContent: 'space-between',
            }}
            onMouseEnter={() => {
              setActionBtns((c) => {
                c[nodeData.key] = true;
                return { ...c };
              });
            }}
            onMouseLeave={() => {
              setActionBtns((c) => {
                c[nodeData.key] = false;
                return { ...c };
              });
            }}
          >
            {nodeData.title}
            {actionBtns[nodeData.key] && (
              <Space>
                {
                  <Dropdown
                    overlay={
                      <Menu onClick={handleAddMenuClick.bind(null, nodeData.key)}>
                        {nodeData.key !== topTreeId ? <Menu.Item key='同级位置'>同级位置</Menu.Item> : null}

                        <Menu.Item key='下级位置'>下级位置</Menu.Item>
                      </Menu>
                    }
                    trigger={['click']}
                  >
                    <PlusOutlined
                      onClick={(e) => e.stopPropagation()}
                      style={{
                        color: selectedKeys[0] === nodeData.key ? '#fff' : '#00bcd4',
                        fontWeight: actionBtns[nodeData.key] ? 600 : 'normal',
                      }}
                    />
                  </Dropdown>
                }
                {nodeData.key !== topTreeId && (
                  <EditOutlined
                    onClick={handleEdit.bind(null, nodeData.key)}
                    style={{
                      color: selectedKeys[0] === nodeData.key ? '#fff' : '#00bcd4',
                      fontWeight: actionBtns[nodeData.key] ? 600 : 'normal',
                    }}
                  />
                )}
                {nodeData.key !== topTreeId && (
                  <DeleteOutlined
                    onClick={handleDelete.bind(null, nodeData.key)}
                    style={{
                      color: selectedKeys[0] === nodeData.key ? '#fff' : '#00bcd4',
                      fontWeight: actionBtns[nodeData.key] ? 600 : 'normal',
                    }}
                  />
                )}
              </Space>
            )}
          </div>
        );
      },
      [actionBtns, handleAddMenuClick, handleDelete, handleEdit, selectedKeys, topTreeId]
    );

    React.useEffect(() => {
      let keyList = [];
      const getKeys = (nodeArr) => {
        nodeArr.forEach((node) => {
          keyList.push(node.key);
          if (node.children && node.children.length > 0) {
            getKeys(node.children);
          }
        });
      };
      getKeys(treeData);
      setExpandedKeys(keyList);
    }, [treeData]);

    const handleGetTemplate = async () => {
      const res = await uploadConfig.getTemplateFunc();
      if (res.code === 1) {
        exportExcelWithManySheet({
          excelName: `资产位置导入模板`,
          sheetsConfig: [
            {
              data: [],
              template: res.data.columns,
              sheetName: '模板',
              titleMessage: res.data.warnningTextList,
              hasPromptTitle: true,
            },
          ],
        });
      } else {
        global.$showMessage({
          type: 'error',
          message: res.message,
        });
      }
    };

    const handleBatchAdd = () => {
      setOpen(true);
    };

    const menu = (
      <Menu>
        <Menu.Item onClick={handleGetTemplate} key='getTemplate' style={menuItemStyles}>
          下载模版
        </Menu.Item>
        <Menu.Item onClick={handleBatchAdd} key='batchAdd' style={menuItemStyles}>
          批量导入
        </Menu.Item>
      </Menu>
    );

    return (
      <ResizableBox
        style={{
          position: 'relative',
        }}
        handle={() => (
          <span
            style={{
              position: 'absolute',
              right: -51,
              top: '50%',
              cursor: 'col-resize',
              width: 50,
              height: 50,
              background: 'transparent',
              borderTop: '5px solid transparent',
              borderBottom: '5px solid #aeafb0',
              borderLeft: '5px solid transparent',
              borderRight: '5px solid transparent',
              transform: 'rotate(0.25turn)',
            }}
          ></span>
        )}
        width={300}
        height={window.innerHeight - 126}
        minConstraints={[200]}
        maxConstraints={[500]}
        axis='x'
      >
        <Card
          style={{
            boxShadow: 'none',
            height: '100%',
            width: '100%',
            padding: 10,
          }}
        >
          <Search style={{ marginBottom: 8 }} placeholder='键入搜索...' onChange={onSearch} />
          <Tree
            height={window.innerHeight - 210}
            onSelect={handleSelectTreeNode}
            selectedKeys={selectedKeys}
            showIcon
            titleRender={LeafNodeRender}
            showLine={{
              showLeafIcon: false,
            }}
            blockNode
            onExpand={onExpand}
            expandedKeys={expandedKeys}
            autoExpandParent={autoExpandParent}
            treeData={loop(treeData)}
          />
          <Dropdown trigger={['click']} overlay={menu} placement='topCenter' arrow>
            <div
              style={{
                width: '100%',
                marginLeft: '-10px',
                height: 30,
                boxShadow: '0px -4px 3px rgba(0, 0, 0, 0.05)',
                color: '#00BCD4',
                fontSize: 13,
                lineHeight: '30px',
                textAlign: 'center',
                position: 'absolute',
                bottom: 0,
                borderRadius: 2,
                cursor: 'pointer',
                backgroundColor: '#fff',
              }}
            >
              批量导入
            </div>
          </Dropdown>
          <UploadDialog
            open={open}
            closeDialog={() => setOpen(false)}
            refreshData={refreshData}
            uploadConfig={uploadConfig}
          />
        </Card>
      </ResizableBox>
    );
  }
);
