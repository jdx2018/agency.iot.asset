import React, { useState, useRef, useMemo } from "react"

import { Modal } from "antd"

import { Button } from "antd"

import { UserAddOutlined, CloseOutlined } from "@ant-design/icons"
import PickerContent from "./EmployeePicker"

import { StyleContext } from "./style-context"

const MODAL_HEIGHT_PERCENT = 0.62

const EmployeePicker = ({ onChange }) => {
	const [open, setOpen] = useState(false)
	const valueRef = useRef(null)

	const contextValue = useMemo(() => ({ height: window.innerHeight * MODAL_HEIGHT_PERCENT }), [])

	const handleConfirm = () => {
		if (valueRef.current) {
			onChange(valueRef.current)
		}
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
				<UserAddOutlined />
			</div>
			<Modal
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
						员工列表
					</span>
				}
				visible={open}
				onOk={handleConfirm}
				onCancel={() => setOpen(false)}>
				<StyleContext.Provider value={contextValue}>
					<PickerContent onChange={(value) => (valueRef.current = value)} />
				</StyleContext.Provider>
			</Modal>
		</>
	)
}

export default EmployeePicker
