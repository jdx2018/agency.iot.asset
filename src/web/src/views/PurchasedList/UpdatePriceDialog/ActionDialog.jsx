import React, { useState } from "react"
import { Button, Form, Modal } from "antd"
import { CloseOutlined } from "@ant-design/icons"
import SubTable from "./SubTable"
import clientService from "api/clientService"

export default React.memo(({ open, closeDialog, data }) => {
	const [confirmLoading, setConfirmLoading] = useState(false)
	const [form] = Form.useForm()
	const { assetListConfig, materialListConfig } = data || { assetListConfig: null, materialListConfig: null }

	const onFinish = async (values) => {
		setConfirmLoading(true)
		console.log(values)
		const res = await clientService.bill_purchase.updatePrice(values.assetList, values.materialList)
		console.log(res)
		setConfirmLoading(false)
		if (res.code === 1) {
			console.log(values, res)
			global.$showMessage({
				type: "success",
				message: "价格修改成功"
			})
			closeDialog()
		} else {
			global.$showMessage({
				type: "error",
				message: res.message
			})
		}
	}

	const onFinishFailed = (errors) => {}

	return (
		<Modal
			destroyOnClose
			visible={open}
			style={{
				top: "10vh"
			}}
			width={948}
			closeIcon={<CloseOutlined style={{ color: "#fff" }} />}
			onCancel={closeDialog}
			title={
				<span
					style={{
						fontSize: 16,
						color: "#fff"
					}}>
					修改价格
				</span>
			}
			footer={[
				<Button key="1" loading={confirmLoading} type="primary" onClick={form.submit}>
					确认
				</Button>,
				<Button key="2" onClick={closeDialog}>
					取消
				</Button>
			]}>
			<Form
				onFinish={onFinish}
				validateTrigger="onSubmit"
				onFinishFailed={onFinishFailed}
				colon={false}
				form={form}
				initialValues={{}}
				requiredMark={false}>
				<span
					style={{
						fontSize: 16,
						fontWeight: 700
					}}>
					修改资产价格
				</span>
				<Form.Item
					name="assetList"
					style={{
						marginBottom: 50
					}}>
					{assetListConfig && <SubTable config={assetListConfig} />}
				</Form.Item>
				<span
					style={{
						fontSize: 16,
						fontWeight: 700
					}}>
					修改耗材价格
				</span>
				<Form.Item
					name="materialList"
					style={{
						marginBottom: 10
					}}>
					{materialListConfig && <SubTable config={materialListConfig} />}
				</Form.Item>
			</Form>
		</Modal>
	)
})
