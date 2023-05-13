/* eslint-disable jsx-a11y/anchor-is-valid */
import React from "react";
import { Dropdown, Checkbox } from "antd";
import { DownOutlined, UnorderedListOutlined } from "@ant-design/icons";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

export default React.memo(function ({ columns, columnsChange }) {
  const [visible, setVisible] = React.useState(false);
  const handleVisibleChange = (flag) => {
    setVisible(flag);
  };

  const handleColumnVisibleChange = React.useCallback(
    (e) => {
      let columns_copy = columns.slice();
      columns_copy.forEach((column) => {
        if (column.dataIndex === e.target.name) {
          column.hide = !e.target.checked;
        }
      });
      columnsChange(columns_copy);
    },
    [columns, columnsChange]
  );

  const onDragEnd = React.useCallback(
    (result) => {
      if (result.destination && result.source) {
        const sourceIdx = result.source.index;
        const destinationIdx = result.destination.index;
        let columns_copy = columns.slice();
        columns_copy[sourceIdx] = columns[destinationIdx];
        columns_copy[destinationIdx] = columns[sourceIdx];
        columnsChange(columns_copy);
      }
    },
    [columns, columnsChange]
  );

  // const onDragUpdate = React.useCallback((result) => {
  //   if (!result.destination) {
  //     return false
  //   }
  // }, [])

  const columnMenu = React.useCallback(
    () => (
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="droppable">
          {(provided, snapshot) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              style={{
                backgroundColor: "#fff",
                boxShadow:
                  "0 3px 6px -4px rgba(0,0,0,.12), 0 6px 16px 0 rgba(0,0,0,.08), 0 9px 28px 8px rgba(0,0,0,.05)",
                padding: 5,
              }}
            >
              {columns.map((item, index) => (
                <Draggable key={item.dataIndex} draggableId={item.dataIndex} index={index}>
                  {(provided, snapshot) => (
                    <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                      <div
                        style={{
                          height: 30,
                          width: "100%",
                          padding: 5,
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <Checkbox onChange={handleColumnVisibleChange} name={item.dataIndex} checked={!item.hide}>
                          {item.title}
                        </Checkbox>
                        <UnorderedListOutlined />
                      </div>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    ),
    [columns, handleColumnVisibleChange, onDragEnd]
  );

  return (
    <Dropdown onVisibleChange={handleVisibleChange} visible={visible} overlay={columnMenu} trigger={['click']}>
      <a style={{
        userSelect: 'none'
      }} onClick={(e) => e.preventDefault()}>
        列 <DownOutlined />
      </a>
    </Dropdown>
  );
});
