import React, { useState } from "react";
import dayjs from "dayjs";

import { Button, Form, Modal } from "antd";

import { CloseOutlined } from '@ant-design/icons'

import { formItemRender } from 'hooks'
import clientService from 'api/clientService'
import { Scrollbars } from 'react-custom-scrollbars'

export default React.memo(
  ({ open, closeDialog, dialogData = { billMain: {}, billDetail: {} }, billTitle, type }) => {
    const [confirmLoading, setConfirmLoading] = useState(false)
    const [form] = Form.useForm();
    const { billMain } = dialogData;
    const onFinish = async (values) => {
      const dateTimeKeys = dialogData.billMain
        ? Object.keys(dialogData.billMain).filter((key) => dialogData.billMain[key].type === "dateTime")
        : [];
      dateTimeKeys.forEach((key) => {
        values[key] = values[key] ? dayjs(values[key]).format("YYYY-MM-DD") : null;
      });

      const billMain_ = JSON.parse(JSON.stringify(values));
      setConfirmLoading(true)
      const res = await clientService.bill_pand.saveBill(billMain_);
      setConfirmLoading(false)
      if (res.code === 1) {
        global.$showMessage({
          message: `${billTitle}单提交成功`,
          type: "success",
        });
        closeDialog(true);
      } else {
        global.$showMessage({
          message: res.message,
          type: "error",
          autoHideDuration: 5000,
        });
      }
    };

    const onFinishFailed = (errors) => { };

    React.useEffect(() => {
      const formValues = {};
      if (billMain && JSON.stringify(billMain) !== "{}") {
        Object.keys(billMain).forEach((key) => {
          formValues[key] = billMain[key].value;
        });
        const dateTimeKeys = billMain
          ? Object.keys(billMain).filter((key) => billMain[key].type === "dateTime")
          : [];
        dateTimeKeys.forEach((key) => {
          formValues[key] = formValues[key] ? dayjs(formValues[key]) : null;
        });
        open && form.setFieldsValue(formValues);
      }
    }, [billMain, form, open, type]);

    const handleCloseDialog = () => {
      closeDialog();
    };

    // const modalFooterRender = () => {
    //   if (type !== "detail") return [<Button key="2" loading={confirmLoading} type="primary" onClick={form.submit}>
    //     确认
    // </Button>, <Button key="1" onClick={handleCloseDialog}>取消</Button>]
    //   return [<Button key="1" onClick={handleCloseDialog}>取消</Button>]
    // }

    return (
      <Modal
        destroyOnClose
        footer={[<Button key="2" loading={confirmLoading} type="primary" onClick={form.submit}>
          确认
        </Button>,
        <Button key="1" onClick={handleCloseDialog}>取消</Button>]}
        closeIcon={<CloseOutlined style={{ color: '#fff' }} />}
        title={<span
          style={{
            fontSize: 16,
            color: "#fff",
          }}
        >
          {(type === "edit" ? "编辑" : "新增") + billTitle}单
        </span>}
        visible={open}
        onOk={form.submit}
        onCancel={handleCloseDialog}>
        <Scrollbars style={{
          height: '62vh'
        }}>
          <Form
            preserve={false}
            className="center-up-and-down"
            onFinish={onFinish}
            validateTrigger="onSubmit"
            onFinishFailed={onFinishFailed}
            colon={false}
            labelAlign="left"
            layout="inline"
            form={form}
            requiredMark={false}
          >
            <div className="m50-up-and-down">
              {formItemRender({ billMain, form, type })}
            </div>

          </Form>
        </Scrollbars>
      </Modal>
    );
  }
);
