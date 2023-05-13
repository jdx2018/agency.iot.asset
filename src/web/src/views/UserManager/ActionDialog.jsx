import React from "react";
import dayjs from "dayjs";

import { Button, Form, Modal } from "antd";

import { formItemRender } from "hooks";

import { CloseOutlined } from "@ant-design/icons";

import clientService from "api/clientService";
import { Scrollbars } from "react-custom-scrollbars";

export default React.memo(
  ({
    open,
    closeDialog,
    dialogData = { billMain: {}, billDetail: {} },
    type,
    billTitle,
  }) => {
    const [form] = Form.useForm();
    const { billMain } = dialogData;
    const [confirmLoading, setConfirmLoading] = React.useState(false);

    const onFinish = async (values) => {
      setConfirmLoading(true);
      const dateTimeKeys = dialogData.billMain
        ? Object.keys(dialogData.billMain).filter(
            (key) => dialogData.billMain[key].type === "dateTime"
          )
        : [];
      dateTimeKeys.forEach((key) => {
        values[key] = values[key]
          ? dayjs(values[key]).format("YYYY-MM-DD")
          : null;
      });
      const billMain_ = JSON.parse(JSON.stringify(values));
      let { password, password_confirm } = values;
      if (
        password !== undefined &&
        password_confirm !== undefined &&
        password === password_confirm
      ) {
        let request;
        if (type === "edit") {
          request = clientService.user.updateUser.bind(
            null,
            billMain_.userId,
            billMain_
          );
        } else {
          request = clientService.user.addUser.bind(null, billMain_);
        }
        const res = await request();
        setConfirmLoading(false);
        if (res.code === 1) {
          global.$showMessage({
            message: `${billTitle}${type === "edit" ? "修改" : "创建"}成功`,
            type: "success",
          });
          closeDialog(true);
        } else {
          global.$showMessage({
            message: res.message,
            type: "error",
            autoHideDuration: 5000,
            zIndex: 9999,
          });
        }
      } else {
        global.$showMessage({
          message: "输入两次密码不一致",
          type: "error",
          autoHideDuration: 5000,
        });
      }
    };

    const onFinishFailed = (errors) => {};

    React.useEffect(() => {
      const formValues = {};
      if (billMain) {
        Object.keys(billMain).forEach((key) => {
          formValues[key] = billMain[key].value;
        });
        if (JSON.stringify(dialogData.billMain) !== "{}") {
          const dateTimeKeys = dialogData.billMain
            ? Object.keys(dialogData.billMain).filter(
                (key) => dialogData.billMain[key].type === "dateTime"
              )
            : [];
          dateTimeKeys.forEach((key) => {
            formValues[key] = formValues[key] ? dayjs(formValues[key]) : null;
          });
          open && form.setFieldsValue(formValues);
        }
      }
    }, [billMain, dialogData.billMain, form, open, type]);

    const handleCloseDialog = () => {
      closeDialog();
    };

    const modalFooterRender = () => {
      if (type !== "detail")
        return [
          <Button
            key="2"
            loading={confirmLoading}
            type="primary"
            onClick={form.submit}
          >
            确认
          </Button>,
          <Button key="1" onClick={handleCloseDialog}>
            取消
          </Button>,
        ];
      return [
        <Button key="1" onClick={handleCloseDialog}>
          取消
        </Button>,
      ];
    };

    return (
      <Modal
        destroyOnClose
        footer={modalFooterRender()}
        closeIcon={<CloseOutlined style={{ color: "#fff" }} />}
        title={
          <span
            style={{
              fontSize: 16,
              color: "#fff",
            }}
          >
            {(type === "edit" ? "编辑" : "新增") + billTitle}
          </span>
        }
        visible={open}
        onOk={form.submit}
        onCancel={handleCloseDialog}
      >
        <Scrollbars style={{ height: "62vh" }}>
          <Form
            preserve={false}
            className="center-up-and-down"
            onFinish={onFinish}
            validateTrigger="onSubmit"
            onFinishFailed={onFinishFailed}
            colon={false}
            labelAlign="left"
            form={form}
            requiredMark={false}
          >
            <div>{formItemRender({ billMain, form, type })}</div>
          </Form>
        </Scrollbars>
      </Modal>
    );
  }
);
