import React from 'react'
import { Form, Input, DatePicker, InputNumber } from "antd";
import { LSelectPicker, LSelectPickerWithEvent, LTreeSelectPicker, LAutoComplete, UploadImage } from "components";

const fieldWidthMap = [180, 180, 480, 785]

const { TextArea } = Input

export default ({ billMain, form, type }) => {
  return <>
    {
      billMain
        ? Object.keys(billMain).map((key) => (
          <Form.Item
            key={key}
            name={key}
            style={{
              marginBottom: 10,
            }}
            label={
              billMain[key].required ? (
                <div style={{ width: 80 }}>
                  {billMain[key].desc}
                  <span style={{ color: "red" }}>*</span>
                </div>
              ) : (
                  <div style={{ width: 80 }}>{billMain[key].desc}</div>
                )
            }
            rules={[
              {
                required: billMain[key].required ? true : false,
                message: `${billMain[key].desc}不能为空`,
              },
            ]}
          >
            {(() => {
              if (!billMain[key].type) {
                const disabled = () => {
                  if (billMain[key].forceDisable) {
                    return true
                  } else if (type === 'edit' && billMain[key].updateDisable) {
                    return true
                  } else {
                    return type === 'detail'
                  }
                }
                return (
                  <Input
                    disabled={disabled()}
                    placeholder={!disabled() ? `请输入${billMain[key].desc}` : ""}
                    style={{
                      width: fieldWidthMap[billMain[key].width ? billMain[key].width : 0],
                      marginRight: 30
                    }}
                  />
                );
              } else if (billMain[key].type === "enum") {
                const disabled = () => {
                  if (billMain[key].forceDisable) {
                    return true
                  } else if (type === 'edit' && billMain[key].updateDisable) {
                    return true
                  } else {
                    return type === 'detail'
                  }
                }
                return (
                  <LSelectPicker
                    listHeight={80}
                    style={{
                      width: fieldWidthMap[billMain[key].width ? billMain[key].width : 0],
                    }}
                    disabled={disabled()}
                    placeholder={!disabled() ? `请选择${billMain[key].desc}` : ""}
                    options={billMain[key].dataSource}
                    widgetConfig={billMain[key].useWidget}
                  />
                );
              } else if (billMain[key].type === "enum_input") {
                const disabled = () => {
                  if (billMain[key].forceDisable) {
                    return true
                  } else if (type === 'edit' && billMain[key].updateDisable) {
                    return true
                  } else {
                    return type === 'detail'
                  }
                }
                return (
                  <LAutoComplete
                    listHeight={80}
                    style={{
                      width: fieldWidthMap[billMain[key].width ? billMain[key].width : 0],
                    }}
                    disabled={disabled()}
                    placeholder={!disabled() ? `请选择${billMain[key].desc}` : ""}
                    options={billMain[key].dataSource}
                    widgetConfig={billMain[key].useWidget}
                  />
                );
              } else if (billMain[key].type === "list") {
                const disabled = () => {
                  if (billMain[key].forceDisable) {
                    return true
                  } else if (type === 'edit' && billMain[key].updateDisable) {
                    return true
                  } else {
                    return type === 'detail'
                  }
                }
                return (
                  <LSelectPickerWithEvent
                    listHeight={80}
                    placeholder={!disabled() ? `请选择${billMain[key].desc}` : ""}
                    form={form}
                    disabled={disabled()}
                    billMain={billMain[key]}
                    widgetConfig={billMain[key].useWidget}
                    style={{
                      width: fieldWidthMap[billMain[key].width ? billMain[key].width : 0]
                    }}
                  />
                );
              } else if (billMain[key].type === "tree") {
                const disabled = () => {
                  if (billMain[key].forceDisable) {
                    return true
                  } else if (type === 'edit' && billMain[key].updateDisable) {
                    return true
                  } else {
                    return type === 'detail'
                  }
                }
                return (
                  <LTreeSelectPicker
                    listHeight={80}
                    style={{
                      width: fieldWidthMap[billMain[key].width ? billMain[key].width : 0]
                    }}
                    placeholder={!disabled() ? `请选择${billMain[key].desc}` : ""}
                    disabled={disabled()}
                    field_select={billMain[key].field_select}
                    options={billMain[key].dataSource}
                    widgetConfig={billMain[key].useWidget}
                  />
                );
              } else if (billMain[key].type === "dateTime") {
                const disabled = () => {
                  if (billMain[key].forceDisable) {
                    return true
                  } else if (type === 'edit' && billMain[key].updateDisable) {
                    return true
                  } else {
                    return type === 'detail'
                  }
                }
                return (
                  <DatePicker
                    allowClear={false}
                    disabled={disabled()}
                    placeholder={!disabled() ? `请选择${billMain[key].desc}` : ""}
                    style={{
                      width: fieldWidthMap[billMain[key].width ? billMain[key].width : 0],
                      marginRight: 30
                    }}
                  />
                );
              } else if (billMain[key].type === "longText") {
                const disabled = () => {
                  if (billMain[key].forceDisable) {
                    return true
                  } else if (type === 'edit' && billMain[key].updateDisable) {
                    return true
                  } else {
                    return type === 'detail'
                  }
                }
                return (
                  <TextArea
                    disabled={disabled()}
                    placeholder={!disabled() ? `请输入${billMain[key].desc}` : ""}
                    style={{
                      // width: 762,
                      width: fieldWidthMap[2],
                      height: 80
                    }}
                  />
                );
              } else if (billMain[key].type === "input_pwd") {
                const disabled = () => {
                  if (billMain[key].forceDisable) {
                    return true
                  } else if (type === 'edit' && billMain[key].updateDisable) {
                    return true
                  } else {
                    return type === 'detail'
                  }
                }
                return (
                  <Input.Password
                    disabled={disabled()}
                    placeholder={!disabled() ? `请输入${billMain[key].desc}` : ""}
                    style={{
                      width: fieldWidthMap[billMain[key].width ? billMain[key].width : 0],
                      marginRight: 30
                    }}
                  />
                );
              } else if (billMain[key].type === "input_number") {
                const disabled = () => {
                  if (billMain[key].forceDisable) {
                    return true
                  } else if (type === 'edit' && billMain[key].updateDisable) {
                    return true
                  } else {
                    return type === 'detail'
                  }
                }
                return (
                  <InputNumber
                    disabled={disabled()}
                    placeholder={!disabled() ? `请输入${billMain[key].desc}` : ""}
                    style={{
                      width: fieldWidthMap[billMain[key].width ? billMain[key].width : 0],
                      marginRight: 30
                    }}
                  />
                );
              } else if (billMain[key].type === "image") {
                const disabled = () => {
                  if (billMain[key].forceDisable) {
                    return true
                  } else if (type === 'edit' && billMain[key].updateDisable) {
                    return true
                  } else {
                    return type === 'detail'
                  }
                }
                return <UploadImage disabled={disabled()} />
              } else {
                return null;
              }
            })()}
          </Form.Item>
        ))
        : null
    }
  </>
}