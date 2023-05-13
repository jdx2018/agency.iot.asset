import React from "react"
import { Form, Divider, Space, Button } from "antd"
import { formItemRender } from "hooks"
import clientService from "api/clientService"

const getNumberValue = (val) => (typeof Number(val) === "number" && !isNaN(Number(val)) ? Number(val) : 0)

export default ({ type = "create", onAddAsset, selectedRow }) => {
	const [form] = Form.useForm()
	const [billMain, setBillMain] = React.useState(null)
	const pipeiObj = React.useRef(null)

	const onFinish = async (values) => {
		values.className = pipeiObj.current.classId.find((v) => v.classId === values.classId).className
		values.supplierName = pipeiObj.current.supplierId.find((v) => v.supplierId === values.supplierId).supplierName
		onAddAsset(values)
		global.$hideModal()
	}
	const onFinishFailed = (errors) => {}

	const handleCanfirm = () => {
		form.submit()
	}
	const handleCancel = () => {
		global.$hideModal()
	}

	const getUpdatedFormValues = async (changeValue) => {
		const assetName = changeValue.assetName
		if (assetName) {
			const res = await clientService.asset.getStorageQtyByAssetName(assetName)
			if (res.code === 1) {
				form.setFieldsValue({ storageQty: res.data })
			} else {
				form.setFieldsValue({ storageQty: 0 })
			}
		}
	}

	React.useEffect(() => {
		const fetchDataInCreate = async () => {
			const res = await clientService.bill_purchase.getTemplate_asset()
			if (res.code === 1) {
				pipeiObj.current = {
					brand: res.data.brand.dataSource,
					classId: res.data.classId.dataSource,
					supplierId: res.data.supplierId.dataSource
				}
				setBillMain(res.data)
			} else {
				global.$showMessage({
					message: res.message,
					type: "error",
					autoHideDuration: 5000
				})
			}
		}
		fetchDataInCreate()
		if (type === "edit") {
			form.setFieldsValue(selectedRow)
		}
	}, [form, selectedRow, type])

	return (
		<>
			<Form
				onValuesChange={(changedValues, allValues) => {
					if (changedValues.hasOwnProperty("orderQty")) {
						form.setFieldsValue({
							amount: getNumberValue(changedValues.orderQty) * getNumberValue(allValues.orderPrice)
						})
					}
					if (changedValues.hasOwnProperty("orderPrice")) {
						form.setFieldsValue({
							amount: getNumberValue(allValues.orderQty) * getNumberValue(changedValues.orderPrice)
						})
					}
					getUpdatedFormValues(changedValues)
				}}
				onFinish={onFinish}
				validateTrigger="onSubmit"
				onFinishFailed={onFinishFailed}
				colon={false}
				labelAlign="left"
				layout="inline"
				form={form}
				requiredMark={false}>
				{formItemRender({ billMain, form, type })}
			</Form>
			<Divider />
			<div
				style={{
					textAlign: "right"
				}}>
				<Space>
					<Button type="primary" onClick={handleCanfirm}>
						确定
					</Button>
					<Button onClick={handleCancel}>取消</Button>
				</Space>
			</div>
		</>
	)
}
