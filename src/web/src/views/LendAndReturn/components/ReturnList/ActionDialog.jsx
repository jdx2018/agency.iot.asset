import React, { useState } from "react";
import dayjs from "dayjs";

import { Button, Form, Modal } from "antd";

import { formItemRender } from 'hooks'

import { CloseOutlined } from '@ant-design/icons'

import AssetsPicker from "components/AssetsPicker";
import { Scrollbars } from 'react-custom-scrollbars'
import clientService from 'api/clientService'

const zhMap = {
  create: '创建',
  detail: '',
  edit: '编辑'
}

export default React.memo(
  ({ open, closeDialog, type, billTitle, dialogData, getAssetListFunc, selectedRowKey }) => {
    const [confirmLoading, setConfirmLoading] = useState(false)
    const [form] = Form.useForm();
    const { billMain, billDetail } = dialogData;

    const onFinish = async (values) => {
      const dateTimeKeys = billMain
        ? Object.keys(billMain).filter((key) => billMain[key].type === "dateTime")
        : [];
      dateTimeKeys.forEach((key) => {
        values[key] = values[key] ? dayjs(values[key]).format("YYYY-MM-DD") : null;
      });
      const assetList = values.assetList;
      delete values.assetList;
      const billMain_ = JSON.parse(JSON.stringify(values));
      const func = type === 'create' ? clientService.bill_guihuan.saveBill.bind(null, billMain_, assetList) : clientService.bill_guihuan.updateBill.bind(null, selectedRowKey, billMain_)
      setConfirmLoading(true)
      const res = await func();
      setConfirmLoading(false)
      if (res.code === 1) {
        global.$showMessage({
          message: `${zhMap[type] + billTitle}成功`,
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
      if (billMain) {
        Object.keys(billMain).forEach((key) => {
          formValues[key] = billMain[key].value;
        });
        if (JSON.stringify(billMain) !== "{}") {
          const dateTimeKeys = billMain
            ? Object.keys(billMain).filter((key) => billMain[key].type === "dateTime")
            : [];
          dateTimeKeys.forEach((key) => {
            formValues[key] = formValues[key] ? dayjs(formValues[key]) : null;
          });
          if (billDetail.rows) {
            formValues.assetList = billDetail.rows
          }
          open && form.setFieldsValue(formValues);
        }
      }
    }, [billDetail.rows, billMain, form, open, type]);

    const handleCloseDialog = () => {
      closeDialog();
    };

    const modalFooterRender = () => {
      if (type !== "detail") return [<Button key="2" loading={confirmLoading} type="primary" onClick={form.submit}>
        确认
    </Button>, <Button key="1" onClick={handleCloseDialog}>取消</Button>]
      return [<Button key="1" onClick={handleCloseDialog}>取消</Button>]
    }

    return (
      <Modal
        destroyOnClose
        width={'948px'}
        footer={modalFooterRender()}
        closeIcon={<CloseOutlined style={{ color: '#fff' }} />}
        title={<span
          style={{
            fontSize: 16,
            color: "#fff",
          }}
        >
          {zhMap[type] + billTitle}单
          </span>}
        visible={open}
        onOk={form.submit}
        onCancel={handleCloseDialog}>
        <Scrollbars style={{
          height: '62vh'
        }}>
          <Form
            preserve={false}
            onFinish={onFinish}
            validateTrigger="onSubmit"
            onFinishFailed={onFinishFailed}
            colon={false}
            labelAlign="left"
            layout="inline"
            form={form}
            requiredMark={false}
          >
            {formItemRender({ billMain, form, type })}
            <br />

            <Form.Item
              name="assetList"
              style={{
                marginBottom: 10,
                width: "100%",
                borderTop: "1px dashed #cfdae5",
              }}
            >
              <AssetsPicker type={type} getAssetListFunc={getAssetListFunc} pickerConfig={billDetail} />
            </Form.Item>
          </Form>
        </Scrollbars>
      </Modal>
    );
  }
);
