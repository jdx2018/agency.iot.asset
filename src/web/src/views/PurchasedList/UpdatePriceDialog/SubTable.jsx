import React, { useEffect, useState, useRef } from "react"
import { InputNumber } from "antd"
import { AntTable } from "components"
import { cloneDeep } from "lodash"

const SubTable = ({ config, value, onChange }) => {
	const { header, rows } = config
	const [columns, setColumns] = useState([])
	const [data, setData] = useState([])
	const dataRef = useRef()

	useEffect(() => {
		if (header) {
			const columns = Object.keys(header).map((header_key) => {
				if (header_key === "modifyPrice") {
					return {
						title: header[header_key].zh,
						dataIndex: header_key,
						width: header[header_key].width,
						render: (text, record) => (
							<InputNumber
								style={{
									width: 80
								}}
								// precision={2}
								size="small"
								disabled={record.payStatus === "已付款"}
								min={0}
								value={Number(text)}
								onChange={(val) => {
									setData((c) => {
										let c_copy = cloneDeep(c)
										c_copy.forEach((item) => {
											if (item.id === record.id) item.modifyPrice = val
										})
										dataRef.current = c_copy
										return c_copy
									})
									onChange(dataRef.current)
								}}
							/>
						)
					}
				}
				return {
					title: header[header_key].zh,
					dataIndex: header_key,
					width: header[header_key].width
				}
			})

			setColumns(columns)
		}
	}, [])

	useEffect(() => {
		if (rows) {
			rows.forEach((item) => {
				if (!item.modifyPrice) item.modifyPrice = 0
			})
			setData(rows)
			onChange(rows)
		}
	}, [rows])

	useEffect(() => {
		if (value) {
			value.forEach((item) => {
				if (!item.modifyPrice) item.modifyPrice = 0
			})
			setData(value)
		}
	}, [value])
	return (
		<div
			style={{
				height: 300
			}}>
			<AntTable rowKey="id" tableData={data} column={columns} />
		</div>
	)
}

export default SubTable
