import React from "react"
import { Form, Divider, Space, Button } from "antd"

import clientService from "api/clientService"

import { formItemRender } from "hooks"
import dayjs from "dayjs"
import _ from "lodash"

export default ({ billNo, type = "create", updateHandler, addHandler, refreshData }) => {
	const [form] = Form.useForm()
	const [billMain, setBillMain] = React.useState(null)
	const dateTimeKeyList = billMain
		? Object.keys(billMain).reduce((acc, cur) => (billMain[cur].type === "dateTime" ? [...acc, cur] : acc), [])
		: []
	const [btnLoading, setBtnLoading] = React.useState(false)

	const onFinish = async (values) => {
		const values_copy = { ..._.cloneDeep(values), billNo }
		dateTimeKeyList.forEach((_) => {
			values_copy[_] = dayjs(values_copy[_]).format("YYYY-MM-DD HH:mm:ss")
		})
		const func = type === "create" ? addHandler : updateHandler
		setBtnLoading(true)
		await func(values_copy, () => {
			global.$showMessage({
				message: `${type === "create" ? "新增" : "编辑"}付款单成功`,
				type: "success"
			})
			global.$hideModal()
			refreshData()
		})
		setBtnLoading(false)
	}
	const onFinishFailed = (errors) => {}
	const handleCanfirm = () => {
		form.submit()
	}
	const handleCancel = () => {
		global.$hideModal()
	}

	React.useEffect(() => {
		const fetchTemplate = async () => {
			const res = await clientService.bill_pay.getTemplate()
			if (res.code === 1) {
				setBillMain(res.data)
			} else {
				global.$showMessage({
					message: res.message,
					type: "error",
					autoHideDuration: 5000
				})
			}
		}
		const fetchTemplateInEdit = async () => {
			const res = await clientService.bill_pay.queryBillDetail()
			if (res.code === 1) {
				const billMain = res.data
				setBillMain(billMain)
				const formValues = {}
				Object.keys(billMain).forEach((key) => {
					formValues[key] = billMain[key].value
				})
				if (JSON.stringify(billMain) !== "{}") {
					const dateTimeKeys = billMain ? Object.keys(billMain).filter((key) => billMain[key].type === "dateTime") : []
					dateTimeKeys.forEach((key) => {
						formValues[key] = formValues[key] ? dayjs(formValues[key]) : null
					})
					form.setFieldsValue(formValues)
				}
			} else {
				global.$showMessage({
					message: res.message,
					type: "error",
					autoHideDuration: 5000
				})
			}
		}

		if (type === "create") {
			fetchTemplate()
		} else {
			fetchTemplateInEdit()
		}
	}, [form, type])

	return (
		<Form
			onFinish={onFinish}
			validateTrigger="onSubmit"
			onFinishFailed={onFinishFailed}
			colon={false}
			labelAlign="left"
			layout="inline"
			form={form}
			requiredMark={false}>
			{formItemRender({ billMain, type, form })}
			<Divider
				style={{
					marginTop: 40
				}}
			/>
			<div
				style={{
					width: "100%",
					textAlign: "right"
				}}>
				<Space>
					<Button loading={btnLoading} type="primary" onClick={handleCanfirm}>
						确定
					</Button>
					<Button onClick={handleCancel}>取消</Button>
				</Space>
			</div>
		</Form>
	)
}
