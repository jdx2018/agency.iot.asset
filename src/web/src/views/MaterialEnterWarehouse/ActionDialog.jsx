import React, { useState } from "react"
import dayjs from "dayjs"

import { Button, Form, Modal } from "antd"

import { CloseOutlined } from "@ant-design/icons"
import { formItemRender } from "hooks"
import MaterialPicker from "components/MaterialPicker"

import clientService from "api/clientService"

import { Scrollbars } from "react-custom-scrollbars"

const zhMap = {
	create: "创建",
	detail: "",
	edit: "编辑"
}

export default React.memo(
	({
		open,
		closeDialog,
		dialogData = { billMain: {}, billDetail: {} },
		type,
		getMaterialListFunc,
		billTitle,
		selectedRowKey
	}) => {
		const [confirmLoading, setConfirmLoading] = useState(false)
		const [form] = Form.useForm()
		const { billMain, billDetail } = dialogData

		const onFinish = async (values) => {
			const dateTimeKeys = dialogData.billMain
				? Object.keys(dialogData.billMain).filter((key) => dialogData.billMain[key].type === "dateTime")
				: []
			dateTimeKeys.forEach((key) => {
				values[key] = values[key] ? dayjs(values[key]).format("YYYY-MM-DD") : null
			})
			const materialList = values.materialList
			delete values.materialList
			const billMain_ = JSON.parse(JSON.stringify(values))
			const func =
				type === "create"
					? clientService.bill_ruku_material.saveBill.bind(null, billMain_, materialList)
					: clientService.bill_ruku_material.updateBill.bind(null, selectedRowKey, billMain_, materialList)
			setConfirmLoading(true)
			const res = await func()
			setConfirmLoading(false)
			if (res.code === 1) {
				global.$showMessage({
					message: `${zhMap[type] + billTitle}成功`,
					type: "success"
				})
				closeDialog(true)
			} else {
				global.$showMessage({
					message: res.message,
					type: "error",
					autoHideDuration: 5000
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
				if (JSON.stringify(billMain) !== "{}") {
					const dateTimeKeys = billMain ? Object.keys(billMain).filter((key) => billMain[key].type === "dateTime") : []
					dateTimeKeys.forEach((key) => {
						formValues[key] = formValues[key] ? dayjs(formValues[key]) : null
					})
					if (billDetail.rows) {
						formValues.materialList = billDetail.rows
					}
					open && form.setFieldsValue(formValues)
				}
			}
		}, [billDetail.rows, billMain, form, open, type])

		const handleCloseDialog = () => {
			closeDialog()
		}

		const modalFooterRender = () => {
			if (type !== "detail")
				return [
					<Button key="2" loading={confirmLoading} type="primary" onClick={form.submit}>
						确认
					</Button>,
					<Button key="1" onClick={handleCloseDialog}>
						取消
					</Button>
				]
			return [
				<Button key="1" onClick={handleCloseDialog}>
					取消
				</Button>
			]
		}

		return (
			<Modal
				destroyOnClose
				width={"948px"}
				footer={modalFooterRender()}
				closeIcon={<CloseOutlined style={{ color: "#fff" }} />}
				title={
					<span
						style={{
							fontSize: 16,
							color: "#fff"
						}}>
						{zhMap[type] + billTitle}单
					</span>
				}
				visible={open}
				onOk={form.submit}
				onCancel={handleCloseDialog}>
				<Scrollbars
					style={{
						height: "62vh"
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
						requiredMark={false}>
						{formItemRender({ billMain, form, type })}
						<br />

						<Form.Item
							name="materialList"
							style={{
								marginBottom: 10,
								width: "100%",
								borderTop: "1px dashed #cfdae5"
							}}>
							<MaterialPicker getMaterialListFunc={getMaterialListFunc} type={type} pickerConfig={billDetail} />
						</Form.Item>
					</Form>
				</Scrollbars>
			</Modal>
		)
	}
)
