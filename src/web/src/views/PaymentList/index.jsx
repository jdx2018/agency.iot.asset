import React, { useCallback, useEffect, useState } from "react"
import { Box } from "@material-ui/core"
import { AntTable } from "components"
import TableToolbar from "./TableToolbar"

import clientService from "api/clientService"

export default React.memo(() => {
	const [loading, setLoading] = useState({})
	const [tableHeader, setTableHeader] = useState({})
	const [tableData, setTableData] = useState([])
	const [filterConfig, setFilterConfig] = useState({})
	const filterRef = React.useRef(null)

	const refreshData = useCallback(async (filter = null) => {
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
		const f__ = JSON.parse(JSON.stringify(f))
		setLoading(true)
		const res = await clientService.bill_pay.queryBill(f__)
		setLoading(false)
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
				loading={loading}
				toolbarProps={{ refreshData }}
				rowKey="billNo"
				filterConfig={filterConfig}
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
