import React, { useState } from 'react'
import dayjs from 'dayjs'

import { Button, Form, Space } from 'antd'
import { Box } from '@material-ui/core'

import { formItemRender } from 'hooks'

import LocalMaterialPicker from './LocalMaterialPicker'
import LocalAssetPicker from './LocalAssetPicker'

import clientService from 'api/clientService'

import _ from 'lodash'

const zhMap = {
  create: '创建',
  detail: '',
  edit: '编辑',
}

const getNumberValue = (val) => (typeof Number(val) === 'number' && !isNaN(Number(val)) ? Number(val) : 0)

export default React.memo(
  ({ open, closeDialog, dialogData = { billMain: {}, billDetail: {} }, type, billTitle, selectedRowKey }) => {
    const [confirmLoading, setConfirmLoading] = useState(false)
    const [form] = Form.useForm()
    const { billMain, billDetail } = dialogData || { billMain: {}, billDetail: {} }
    const { asset: assetBillDetail, material: materialBillDetail } = billDetail
      ? billDetail
      : { asset: { header: {}, rows: [] }, material: { header: {}, rows: [] } }

    const onFinish = async (values) => {
      const values_copy = _.cloneDeep(values)
      if (values_copy.assetList === undefined) values_copy.assetList = []
      if (values_copy.assetList.length > 0 || values_copy.materialList.length > 0) {
        const dateTimeKeys = dialogData.billMain
          ? Object.keys(dialogData.billMain).filter((key) => dialogData.billMain[key].type === 'dateTime')
          : []
        dateTimeKeys.forEach((key) => {
          values_copy[key] = values_copy[key] ? dayjs(values_copy[key]).format('YYYY-MM-DD') : null
        })
        const materialList = values_copy.materialList.slice()
        const assetList = values_copy.assetList.slice()
        assetList.forEach((v) => {
          delete v.assetId
        })
        materialList.forEach((v) => {
          if (!v.orderQty) {
            v.orderQty = 0
          }
          if (!v.orderPrice) {
            v.orderPrice = 0
          }
          delete v.primary_id
        })
        delete values_copy.materialList
        delete values_copy.assetList
        if (Array.isArray(values_copy.signImage) && values_copy.signImage.length > 0) {
          values_copy.signImage = values_copy.signImage[0]
        }
        const billMain_ = JSON.parse(JSON.stringify(values_copy))
        const func =
          type === 'create'
            ? clientService.bill_purchase.saveBill.bind(null, billMain_, assetList, materialList)
            : clientService.bill_purchase.updateBill.bind(null, selectedRowKey[0], billMain_, assetList, materialList)
        setConfirmLoading(true)
        const res = await func()
        setConfirmLoading(false)
        if (res.code === 1) {
          global.$showMessage({
            message: `${zhMap[type] + billTitle}成功`,
            type: 'success',
          })
          closeDialog(true)
        } else {
          global.$showMessage({
            message: res.message,
            type: 'error',
            autoHideDuration: 5000,
          })
        }
      } else {
        global.$showMessage({
          type: 'warning',
          message: '固定资产或者耗材内容至少一个不为空',
        })
      }
    }

    const onFinishFailed = (errors) => {}

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
          if (assetBillDetail.rows) {
            formValues.assetList = assetBillDetail.rows
          }
          if (materialBillDetail.rows) {
            formValues.materialList = materialBillDetail.rows
          }
          if (formValues.signImage && !Array.isArray(formValues.signImage)) {
            formValues.signImage = [formValues.signImage]
          }
          const amount = formValues.amount
          delete formValues.amount
          open && form.setFieldsValue(formValues)
          setTimeout(() => {
            form.setFieldsValue({ amount })
          }, 500)
        }
      }
    }, [assetBillDetail, billMain, form, materialBillDetail, open])

    const handleCloseDialog = () => {
      closeDialog()
    }

    const ModalFooter = () => {
      if (type !== 'detail')
        return (
          <Space>
            <Button key='1' loading={confirmLoading} type='primary' onClick={form.submit}>
              确认
            </Button>
            <Button key='2' onClick={handleCloseDialog}>
              取消
            </Button>
          </Space>
        )
      return (
        <Button key='1' onClick={handleCloseDialog}>
          取消
        </Button>
      )
    }

    return (
      <div
        style={{
          paddingBottom: 10,
        }}
      >
        {!open ? null : (
          <div>
            <Box
              p={1}
              style={{
                backgroundColor: '#fff',
              }}
            >
              <Form
                preserve={false}
                onValuesChange={(changedValues, allValues) => {
                  if (type !== 'detail') {
                    let sum = 0

                    allValues.materialList.length > 0 &&
                      allValues.materialList.forEach((v) => {
                        sum += getNumberValue(v.amount)
                      })

                    allValues.assetList.length > 0 &&
                      allValues.assetList.forEach((v) => {
                        sum += getNumberValue(v.amount)
                      })
                    form.setFieldsValue({ amount: sum })
                  }
                }}
                onFinish={onFinish}
                validateTrigger='onSubmit'
                onFinishFailed={onFinishFailed}
                colon={false}
                labelAlign='left'
                layout='inline'
                form={form}
                requiredMark={false}
              >
                {formItemRender({ billMain, form, type })}

                <Form.Item
                  name='assetList'
                  style={{
                    marginBottom: 10,
                    width: '100%',
                    borderTop: '1px dashed #cfdae5',
                  }}
                >
                  <LocalAssetPicker type={type} pickerConfig={assetBillDetail} />
                </Form.Item>

                <Form.Item
                  name='materialList'
                  style={{
                    marginBottom: 10,
                    width: '100%',
                    borderTop: '1px dashed #cfdae5',
                  }}
                >
                  <LocalMaterialPicker type={type} pickerConfig={materialBillDetail} />
                </Form.Item>
              </Form>
            </Box>
            <div
              style={{
                marginTop: 10,
                width: '100%',
                display: 'flex',
                justifyContent: 'flex-end',
              }}
            >
              {ModalFooter()}
            </div>
          </div>
        )}
      </div>
    )
  }
)
