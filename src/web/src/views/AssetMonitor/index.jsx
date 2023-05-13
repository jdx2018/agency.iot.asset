import React, { useState, useEffect } from "react"
import TableToolbar from "./TableToolbar"
import clientService from "api/clientService"

import { Box } from "@material-ui/core"

import { AntTable } from "components"

export default React.memo(() => {
	const [column, setColumn] = useState([])
	const [tableData, setTableData] = useState([])
	const [loading, setLoading] = useState(false)
	const [filterConfig, setFilterConfig] = useState({})
	const filterRef = React.useRef(null)

	const refreshData = React.useCallback(async (filter = null) => {
		let f = null
		if (!filter) {
			f = filterRef.current
		} else if (JSON.stringify(filter) === "{}") {
			filterRef.current = null
			f = filterRef.current
		} else {
			filterRef.current = filter
			f = filterRef.current
		}
		setLoading(true)
		const filter_ = JSON.parse(JSON.stringify(f))
		const res = await clientService.assetAlarm.getAlarmList(filter_)
		setLoading(false)
		if (res.code === 1) {
			const header = res.data.header
			const column = Object.keys(header).map((header_key) => {
				const column_ = {
					title: header[header_key].zh,
					dataIndex: header_key,
					width: header[header_key].width
				}

				return column_
			})
			setColumn(column)
			setTableData(res.data.rows)
			setFilterConfig(res.data.filter)
		} else {
			global.$showMessage({
				message: res.message,
				type: "error",
				autoHideDuration: 5000
			})
		}
	}, [])

	useEffect(() => {
		refreshData()
	}, [refreshData])

	return (
		<Box
			p={1}
			style={{
				height: "calc(100% - 76px)"
			}}>
			<AntTable
				loading={loading}
				rowKey="id"
				useRowSelect={true}
				column={column}
				TableToolbar={TableToolbar}
				tableData={tableData}
				filterConfig={filterConfig}
				toolbarProps={{ refreshData }}
			/>
		</Box>
	)
})
