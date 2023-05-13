import React, { useState, useEffect, useRef } from "react"
import { Divider, Space, Button } from "antd"
import clientService from "api/clientService"
import TableContentToolbar from "./TableContentToolbar"

import { AntTable } from "components"

export default ({ onAddMaterial }) => {
	const [columns, setColumns] = useState([])
	const [data, setData] = useState([])

	const selectedRef = useRef([])

	const handleCanfirm = () => {
		onAddMaterial(selectedRef.current)
		global.$hideModal()
	}
	const handleCancel = () => {
		global.$hideModal()
	}
	const handleSelectedChange = (selected) => {
		selectedRef.current = data.filter((item) => selected.includes(item.materialId))
	}
	useEffect(() => {
		const fetchData = async () => {
			const res = await clientService.bill_purchase.getTemplate_material()
			if (res.code === 1) {
				const { header, rows } = res.data

				const columns = Object.keys(header).map((header_key) => {
					return {
						title: header[header_key].zh,
						dataIndex: header_key,
						width: header[header_key].width
					}
				})

				setColumns(columns)
				setData(rows)
			} else {
				global.$showModal({
					type: "error",
					message: res.message
				})
			}
		}
		fetchData()
	}, [])

	return (
		<>
			<div
				style={{
					height: 400,
					marginBottom: 110
				}}>
				<AntTable
					TableToolbar={TableContentToolbar}
					onSelectedChange={handleSelectedChange}
					useRowSelect={true}
					rowKey="materialId"
					tableData={data}
					column={columns}
				/>
			</div>
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
