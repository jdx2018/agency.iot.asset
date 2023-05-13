import React from 'react'
import { Form, Divider, Space, Button } from 'antd'

import { formItemRender } from 'hooks'

import clientService from 'api/clientService'
import _ from 'lodash'
import dayjs from 'dayjs'

export default ({ billList, supplierId, onOk }) => {
  const [form] = Form.useForm()
  const [billMain, setBillMain] = React.useState(null)

  const onFinish = async (values) => {
    const { amount, payableAmount } = values
    if (Number(amount) !== Number(payableAmount)) {
      global.$showMessage({
        type: 'warning',
        message: '付款金额必须等于应付金额！',
      })
      return
    }
    const values_copy = _.cloneDeep(values)
    values_copy.payDate = dayjs(values.payDate).format('YYYY-MM-DD')
    const res = await clientService.bill_pay.saveBill(values_copy, billList)
    if (res.code === 1) {
      global.$showMessage({
        message: '付款成功',
        type: 'success',
      })
      onOk()
    } else {
      global.$showMessage({
        message: res.message,
        type: 'error',
        autoHideDuration: 5000,
      })
    }
    global.$hideModal()
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
      const res = await clientService.bill_pay.getTemplate(supplierId, billList)
      if (res.code === 1) {
        setBillMain(res.data)
      } else {
        global.$showMessage({
          message: res.message,
          type: 'error',
          autoHideDuration: 5000,
        })
      }
    })()
  }, [billList, supplierId])

  React.useEffect(() => {
    const formValues = {}
    if (billMain) {
      Object.keys(billMain).forEach((key) => {
        formValues[key] = billMain[key].value
      })
      if (JSON.stringify(billMain) !== '{}') {
        const dateTimeKeys = billMain ? Object.keys(billMain).filter((key) => billMain[key].type === 'dateTime') : []
        dateTimeKeys.forEach((key) => {
          formValues[key] = formValues[key] ? dayjs(formValues[key]) : null
        })
        form.setFieldsValue(formValues)
      }
    }
  }, [billMain, form])

  return (
    <Form
      className='center-up-and-down'
      onFinish={onFinish}
      validateTrigger='onSubmit'
      onFinishFailed={onFinishFailed}
      colon={false}
      labelAlign='left'
      // layout="inline"
      form={form}
      requiredMark={false}
    >
      <div>
        <div className='m50-up-and-down'>{formItemRender({ billMain, type: 'create', form })}</div>
        <Divider
          style={{
            marginTop: 40,
          }}
        />
        <div
          style={{
            textAlign: 'right',
          }}
        >
          <Space>
            <Button type='primary' onClick={handleCanfirm}>
              确定
            </Button>
            <Button onClick={handleCancel}>取消</Button>
          </Space>
        </div>
      </div>
    </Form>
  )
}
