import React from "react";
import { Form, Divider, Space, Button, Input } from "antd";
import clientService from 'api/clientService'

import { getUserinfo } from 'utils/auth'


export default () => {
  const [form] = Form.useForm();

  const onFinish = async (values) => {
    const { userId } = getUserinfo();
    const { old_pwd, new_pwd, new_confirm_pwd } = values
    if (new_pwd === new_confirm_pwd) {
      const res = await clientService.user.updateUserPassword(userId, old_pwd, new_confirm_pwd)
      if (res?.code === 1) {
        global.$hideModal()
        global.$showMessage({
          message: '密码修改成功',
          type: "success",
        })
      } else {
        global.$showMessage({
          message: res.message,
          type: "error",
          autoHideDuration: 5000,
        })
      }

    } else {
      global.$showMessage({
        message: '输入的两次新密码不一致',
        type: "error",
        autoHideDuration: 5000,
      })
    }
  };
  const onFinishFailed = (errors) => { };

  const handleCanfirm = () => {
    form.submit();
  };
  const handleCancel = () => {
    global.$hideModal();
  };

  return (
    <>
      <Form
        className="center-up-and-down"
        onFinish={onFinish}
        validateTrigger="onSubmit"
        onFinishFailed={onFinishFailed}
        colon={false}
        labelAlign="left"
        form={form}
        requiredMark={false}
      >
        <div
          className="m50-up-and-down"
        >
          <Form.Item
            name="old_pwd"
            style={{
              marginBottom: 10,
            }}
            label={<div style={{ width: 80 }}>旧密码<span style={{ color: "red" }}>*</span></div>}
            rules={[
              {
                required: true,
                message: `旧密码不能为空`,
              },
            ]}
          >
            <Input.Password
              style={{
                width: 180,
              }}
              placeholder="请输入旧密码"
            />
          </Form.Item>
          <Form.Item
            name="new_pwd"
            style={{
              marginBottom: 10,
            }}
            label={<div style={{ width: 80 }}>新密码<span style={{ color: "red" }}>*</span></div>}
            rules={[
              {
                required: true,
                message: `新密码不能为空`,
              },
            ]}
          >
            <Input.Password
              style={{
                width: 180,
              }}
              placeholder="请输入新密码"
            />
          </Form.Item>
          <Form.Item
            name="new_confirm_pwd"
            style={{
              marginBottom: 10,
            }}
            label={<div style={{ width: 80 }}>确认新密码<span style={{ color: "red" }}>*</span></div>}
            rules={[
              {
                required: true,
                message: `新密码不能为空`,
              },
            ]}
          >
            <Input.Password
              style={{
                width: 180,
              }}
              placeholder="请再输入新密码"
            />
          </Form.Item>

        </div>

      </Form>
      <Divider
        style={{
          marginTop: 30,
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
    </>
  );
};
