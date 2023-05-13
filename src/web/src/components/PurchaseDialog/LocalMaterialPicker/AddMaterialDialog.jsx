import React from 'react'
import { Form, Divider, Space, Button } from 'antd'

import clientService from 'api/clientService'

import { formItemRender } from 'hooks'

export default ({ initialFormValues = null, type = 'create', updateHandler, addHandler, setSupplierMap }) => {
  const [form] = Form.useForm()
  const [billMain, setBillMain] = React.useState(null)

  const onFinish = async (values) => {
    const func = type === 'create' ? addHandler : updateHandler
    await func(values, () => {
      global.$showMessage({
        message: `${type === 'create' ? '新增' : '编辑'}耗材成功`,
        type: 'success',
      })
      global.$hideModal()
    })
  }
  const onFinishFailed = (errors) => {}
  const handleCanfirm = () => {
    form.submit()
  }
  const handleCancel = () => {
    global.$hideModal()
  }

  React.useEffect(() => {
    ;(async () => {
      const res = await clientService.asset_material.getTemplate()
      if (res.code === 1) {
        setBillMain(res.data)
        setSupplierMap(res.data.supplierId.dataSource)
        const defaultFormValues = {}
        Object.keys(res.data).forEach((v) => {
          if (res.data[v].value) defaultFormValues[v] = res.data[v].value
        })
        form.setFieldsValue(defaultFormValues)
        initialFormValues && form.setFieldsValue(initialFormValues)
      } else {
        global.$showMessage({
          message: res.message,
          type: 'error',
          autoHideDuration: 5000,
        })
      }
    })()
  }, [form, initialFormValues])

  return (
    <Form
      onFinish={onFinish}
      validateTrigger='onSubmit'
      onFinishFailed={onFinishFailed}
      colon={false}
      labelAlign='left'
      layout='inline'
      form={form}
      requiredMark={false}
    >
      {formItemRender({ billMain, type, form })}
      <Divider
        style={{
          marginTop: 20,
        }}
      />
      <div
        style={{
          width: '100%',
        }}
      >
        <Space
          style={{
            display: 'flex',
            justifyContent: 'flex-end',
          }}
        >
          <Button type='primary' onClick={handleCanfirm}>
            确定
          </Button>
          <Button onClick={handleCancel}>取消</Button>
        </Space>
      </div>
    </Form>
  )
}
