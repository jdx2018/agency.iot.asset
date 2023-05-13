import React from "react";
import { Form, Divider, Space, Button } from "antd";

import { formItemRender } from 'hooks'
import clientService from 'api/clientService'

export default ({ initialFormValues = null, type = "create", updateHandler, addHandler }) => {
  const [form] = Form.useForm();
  const [billMain, setBillMain] = React.useState(null);

  const onFinish = async (values) => {
    const func = type === "create" ? addHandler : updateHandler;
    const paramsObj =
      type === "create"
        ? {
          orgId: values.currentorgId,
          orgName: values.currentorgName,
          parentId: values.orgId,
        }
        : { orgId: values.currentorgId, orgName: values.currentorgName };
    await func(paramsObj, () => {
      global.$showMessage({
        message: `${type === "create" ? "新增" : "编辑"}组织成功`,
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
      const res = await clientService.org.getTemplate();
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
      form={form}
      requiredMark={false}
    >
      <div
        style={{
          marginTop: 20,
        }}
      >
        {formItemRender({ billMain, type, form })}
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
    </Form>
  );
};
