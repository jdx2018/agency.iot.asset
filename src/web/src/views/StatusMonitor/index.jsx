import React, { useCallback, useEffect, useState } from "react"
import { Box } from "@material-ui/core"
import { AntTable } from "components"
import TableToolbar from "./TableToolbar"

import { getDeviceMonitorList } from "api/device/device.monitor"

export default React.memo(() => {
	const [tableHeader, setTableHeader] = useState({})
	const [tableData, setTableData] = useState([])
	const [filterConfig, setFilterConfig] = useState({})

	const refreshData = useCallback(async (filter) => {
		const res = await getDeviceMonitorList(filter)
		if (res.code === 1) {
			setTableData(res.data.rows)
			setTableHeader(res.data.header)
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
				toolbarProps={{ refreshData }}
				rowKey="deviceId"
				filterConfig={filterConfig}
				useRowSelect={false}
				TableToolbar={TableToolbar}
				tableData={tableData}
				column={Object.keys(tableHeader).map((header_key) => ({
					title: tableHeader[header_key].zh,
					dataIndex: header_key,
					width: tableHeader[header_key].width
				}))}
			/>
		</Box>
	)
})
