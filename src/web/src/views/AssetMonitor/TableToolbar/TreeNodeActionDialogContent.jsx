import React from "react";
import { Form, Divider, Space, Button } from "antd";
import clientService from 'api/clientService'

import { formItemRender } from 'hooks'

export default ({ initialFormValues = null, type, updateHandler, rows }) => {
  const [form] = Form.useForm();
  const [billMain, setBillMain] = React.useState(null);

  const onFinish = async (values) => {
    const func = updateHandler;
    const paramsObj = { assetList: rows, remarks: values.remarks }
    await func(paramsObj, () => {
      global.$showMessage({
        message: `处理成功`,
        type: "success",
      });
      global.$hideModal();
    });
  };
  const onFinishFailed = (errors) => { };

  const handleCanfirm = () => {
    form.submit();
  };
  const handleCancel = () => {
    global.$hideModal();
  };

  React.useEffect(() => {
    (async () => {
      const res = await clientService.assetAlarm.getTemplate();
      if (res.code === 1) {
        setBillMain(res.data);
        initialFormValues && form.setFieldsValue(initialFormValues);
      } else {
        global.$showMessage({
          message: res.message,
          type: "error",
          autoHideDuration: 5000,
        });
      }
    })();
  }, [form, initialFormValues]);

  return (
    <Form
      onFinish={onFinish}
      validateTrigger="onSubmit"
      onFinishFailed={onFinishFailed}
      colon={false}
      labelAlign="left"
      // layout="inline"
      className="center-up-and-down"
      form={form}
      requiredMark={false}
    >
      <div>
        <div
          className="m50-up-and-down"
        >
          {formItemRender({ billMain, form, type })}
        </div>
        <Divider
          style={{
            marginTop: 40,
          }}
        />
        <div
          style={{
            textAlign: "right",
          }}
        >
          <Space>
            <Button type="primary" onClick={handleCanfirm}>
              确定
          </Button>
            <Button onClick={handleCancel}>取消</Button>
          </Space>
        </div>
      </div>
    </Form>
  );
};
