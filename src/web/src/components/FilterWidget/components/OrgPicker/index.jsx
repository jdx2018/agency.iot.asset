import React, { useState, useMemo } from "react"
import { Modal, Button } from "antd"
import { PartitionOutlined, CloseOutlined } from "@ant-design/icons"
import PickerContent from "./OrgPicker"
import { StyleContext } from "./style-context"

const MODAL_HEIGHT_PERCENT = 0.62

const AssetOrgPicker = ({ onChange }) => {
	const [open, setOpen] = useState(false)
	const [value, setValue] = useState(null)
	const contextValue = useMemo(() => ({ height: window.innerHeight * MODAL_HEIGHT_PERCENT }), [])

	const handleConfirm = () => {
		onChange(value)
		setOpen(false)
	}

	return (
		<>
			<div
				style={{
					marginLeft: 3,
					color: "#616161",
					cursor: "pointer"
				}}
				onClick={() => setOpen(true)}>
				<PartitionOutlined />
			</div>
			<Modal
				zIndex={10000}
				width={"1000px"}
				footer={[
					<Button key="1" onClick={() => setOpen(false)}>
						关闭
					</Button>,
					<Button key="0" type="primary" onClick={handleConfirm}>
						确认
					</Button>
				]}
				closeIcon={<CloseOutlined style={{ color: "#fff" }} />}
				title={
					<span
						style={{
							fontSize: 16,
							color: "#fff"
						}}>
						组织/机构
					</span>
				}
				visible={open}
				onOk={handleConfirm}
				onCancel={() => setOpen(false)}>
				<StyleContext.Provider value={contextValue}>
					<PickerContent
						onChange={(value) => {
							setValue(value)
						}}
					/>
				</StyleContext.Provider>
			</Modal>
		</>
	)
}

export default AssetOrgPicker
