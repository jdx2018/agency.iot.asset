/* eslint-disable jsx-a11y/anchor-is-valid */
import React from "react";
import { PageHeader, Button, Form, Row, Col, DatePicker, Input, Tag, Drawer } from "antd";
import { DoubleRightOutlined } from "@ant-design/icons";
import { Card } from '@material-ui/core'
import { Scrollbars } from 'react-custom-scrollbars'

import { LSelectPicker, LSelectPickerWithEvent, LTreeSelectPicker, LAutoComplete } from "components";
import dayjs from "dayjs";

import useAdvanSearchEnumObj from './useAdvanSearchEnumObj'


export default React.memo(({ open, formConfg, closeDrawer, valuesChange }) => {
  const [form] = Form.useForm();
  const [advanFormValues, setAdvanFormValues] = React.useState(null);
  const EnumObj = useAdvanSearchEnumObj(formConfg)
  const { items_input, items_select } = formConfg || { items_input: {}, items_select: {} };
  const dateValueList = items_select
    ? Object.keys(items_select).reduce((acc, cur) => {
      if (items_select[cur].type === "dateTime") {
        return [...acc, cur];
      }
      return acc;
    }, [])
    : [];

  const handleClose = () => {
    closeDrawer()
  };

  const onFinish = (values) => {
    Object.keys(values).forEach((key) => {
      values[key] && dateValueList.includes(key) && (values[key] = dayjs(values[key]).format("YYYY-MM-DD"));
    });
    const uselessList = Object.keys(values).filter((key) => values[key] === undefined || values[key] === "");
    uselessList.forEach((key) => delete values[key]);
    setAdvanFormValues(values)
    form.resetFields();
  };

  const onFinishFailed = (errors) => { };

  const handleOnSearch = () => {
    closeDrawer()
    setTimeout(() => {
      form.submit()
    }, 400)
  };

  const handleResetAdvanSearch = () => {
    setAdvanFormValues(null)
    form.resetFields();
  };

  const FormItemInput = React.useCallback(
    () =>
      items_input
        ? Object.keys(items_input).map((key) => (
          <Col key={key}>
            <Form.Item name={key}>
              <Input
                desc={items_input[key].desc}
                style={{
                  width: 170,
                  marginRight: 30
                }}
                placeholder={`请输入${items_input[key].desc}`}
              />
            </Form.Item>
          </Col>
        ))
        : null,
    [items_input]
  );

  const FormItemSelect = React.useCallback(
    () =>
      items_select
        ? Object.keys(items_select).map((key) => (
          <Col key={key}>
            <Form.Item name={key}>
              {(() => {
                if (items_select[key].type === "enum") {
                  return (
                    <LSelectPicker
                      style={{
                        width: 170,
                      }}
                      placeholder={`请选择${items_select[key].desc}`}
                      options={items_select[key].dataSource}
                    />
                  );
                }
                if (items_select[key].type === "enum_input") {
                  return (
                    <LAutoComplete
                      style={{
                        width: 170,
                      }}
                      placeholder={`请选择${items_select[key].desc}`}
                      options={items_select[key].dataSource}
                    />
                  );
                }
                if (items_select[key].type === "tree") {
                  return (
                    <LTreeSelectPicker
                      style={{
                        width: 170,
                      }}
                      placeholder={`请选择${items_select[key].desc}`}
                      field_select={items_select[key].field_select}
                      options={items_select[key].dataSource}
                    />
                  );
                }
                if (items_select[key].type === "dateTime") {
                  return (
                    <DatePicker
                      placeholder={`请选择${items_select[key].desc}`}
                      allowClear={false}
                      getPopupContainer={(triggerNode) => triggerNode.parentNode}
                      style={{
                        width: 170,
                        marginRight: 30
                      }}
                    />
                  );
                }
                if (items_select[key].type === "list") {
                  return (<LSelectPickerWithEvent
                    listHeight={100}
                    placeholder={`请选择${items_select[key].desc}`}
                    form={form}
                    billMain={items_select[key]}
                    style={{
                      width: 170,
                    }}
                  />)
                }
              })()}
            </Form.Item>
          </Col>
        ))
        : null,
    [form, items_select]
  );

  const handleCloseTag = (tagKey) => {
    const advanFormValues_ = JSON.parse(JSON.stringify(advanFormValues));
    delete advanFormValues_[tagKey];
    if (JSON.stringify(advanFormValues_) === "{}") {
      setAdvanFormValues(null);
    } else {
      setAdvanFormValues(advanFormValues_);
    }
  }

  React.useEffect(() => {
    if (advanFormValues) {
      Object.keys(items_select).filter(_ => items_select[_].type === "dateTime").forEach((_) => {
        (advanFormValues[_]) && (advanFormValues[_] = dayjs(advanFormValues[_]));
      });
      open && form.resetFields();
      open && form.setFieldsValue(advanFormValues);
    } else {
      open && form.resetFields();
    }
  }, [form, open, items_select, advanFormValues]);

  React.useEffect(() => {
    if (advanFormValues && JSON.stringify(advanFormValues) !== "{}") {
      Object.keys(advanFormValues).forEach((key) => {
        dayjs.isDayjs(advanFormValues[key]) &&
          (advanFormValues[key] = dayjs(advanFormValues[key]).format("YYYY-MM-DD"));
      });
      valuesChange(advanFormValues);
    } else {
      valuesChange({});
    }
  }, [advanFormValues, valuesChange]);

  return (
    <>
      {
        advanFormValues && JSON.stringify(advanFormValues) !== "{}" && <Card
          style={{
            marginBottom: 10,
            padding: '2px 10px 2px 10px',
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            boxShadow: "none",
          }}
        >
          <div>
            {Object.keys(advanFormValues).map((key) => {
              return (
                <Tag
                  style={{
                    marginBottom: 5,
                    marginRight: 10,
                    marginTop: 5,
                  }}
                  key={key}
                  closable
                  onClose={handleCloseTag.bind(null, key)}
                >
                  {EnumObj[key].desc}:{" "}
                  {(() => {
                    if (EnumObj[key].type === "dateTime") {
                      return dayjs(advanFormValues[key]).format("YYYY-MM-DD");
                    }
                    if (EnumObj[key].type === "enum" || EnumObj[key].type === "tree" || EnumObj[key].type === 'list') {
                      return EnumObj[key].valueEnum[advanFormValues[key]];
                    }
                    return advanFormValues[key];
                  })()}
                </Tag>
              );
            })}
          </div>
          <a
            onClick={() => {
              setAdvanFormValues(null);
            }}
          >
            清空
    </a>
        </Card>
      }
      <Drawer
        bodyStyle={{
          backgroundColor: '#f9f9f9'
        }}
        width="448"
        placement="right"
        closable={false}
        onClose={handleClose}
        visible={open}
        title={
          <div
            style={{
              backgroundColor: "#fff",
              boxShadow: "0 2px 2px #e8e7e8",
            }}
          >
            <PageHeader
              ghost={false}
              onBack={handleClose}
              backIcon={
                <DoubleRightOutlined
                  style={{
                    color: "#9e9e9e",
                  }}
                />
              }
              subTitle=""
              extra={[
                <Button key="1" type="primary" onClick={handleOnSearch}>
                  查询
                </Button>,
                <Button onClick={handleResetAdvanSearch} key="2" type="primary">
                  重置
                </Button>,
              ]}
            />
          </div>
        }
        headerStyle={{
          padding: 0,
          borderBottom: 'none',
          borderRadius: 'none'
        }}
      >
        <Scrollbars autoHide>
          <Form
            onFinish={onFinish}
            validateTrigger="onSubmit"
            onFinishFailed={onFinishFailed}
            colon={false}
            labelAlign="left"
            form={form}
            initialValues={{}}
            requiredMark={false}
          >
            <div
              style={{
                borderBottom: "1px dashed #aeafb0",
                fontSize: 14,
                width: "100%",
                marginBottom: 20,
                marginTop: 20,
              }}
            >
              分字段搜索
          </div>
            <Row style={{
              position: 'relative',
              left: 15
            }} justify="space-between">
              <FormItemInput />
            </Row>

            <div
              style={{
                borderBottom: "1px dashed #aeafb0",
                fontSize: 14,
                width: "100%",
                marginBottom: 20,
              }}
            >
              筛选
          </div>
            <Row style={{
              position: 'relative',
              left: 15
            }} justify="space-between">
              <FormItemSelect />
            </Row>
          </Form>
        </Scrollbars>
      </Drawer>
    </>
  );
});
