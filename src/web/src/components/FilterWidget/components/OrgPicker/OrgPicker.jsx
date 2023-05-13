import React from "react"
import LeftTree from "./LeftTree"
import TableContent from "./TableContent"
import { Box } from "@material-ui/core"

import clientService from "api/clientService"

export default ({ onChange }) => {
	const [selectedKeys, setSelectedKeys] = React.useState([])

	const [orgFlatData, setOrgFlatData] = React.useState([])

	const [tableContentData, setTableContentData] = React.useState([])

	const [tableContentHeader, setTableContentHeader] = React.useState([])

	const orgListRef = React.useRef([])
	const filterOrgListRef = React.useRef([])

	const refreshData = React.useCallback(async () => {
		const res = await clientService.org.getOrgList_all()
		if (res.code === 1) {
			orgListRef.current = res.data.rows
			filterOrgListRef.current = res.data.rows

			setTableContentHeader(res.data.header)

			setOrgFlatData(res.data.rows.map((nodeData) => ({ key: nodeData.orgId, title: nodeData.orgName, ...nodeData })))
		} else {
			global.$showMessage({
				message: res.message,
				type: "error",
				autoHideDuration: 5000
			})
		}
	}, [])

	const handleTreeChange = ({ type, data }) => {
		if (type === "select") {
			setSelectedKeys(data)
			if (data.length === 0) {
				setTableContentData(filterOrgListRef.current)
				return
			}
			onChange(data[0])
			setTableContentData(data.length === 0 ? [] : orgListRef.current.filter((org_) => org_.parentId === data[0]))
		} else if (type === "search") {
			if (data.length === 0) {
				setTableContentData(filterOrgListRef.current)
				return
			}
			setTableContentData(data.length === 0 ? [] : orgListRef.current.filter((org_) => data.includes(org_.orgId)))
		} else {
			throw new Error("no such type")
		}
	}

	React.useEffect(() => {
		refreshData()
	}, [refreshData])

	return (
		<Box p={1}>
			<div
				style={{
					display: "flex",
					justifyContent: "space-between"
				}}>
				<LeftTree orgFlatData={orgFlatData} selectedKeys={selectedKeys} onChange={handleTreeChange} />
				<TableContent onSelectedChange={onChange} header={tableContentHeader} tableData={tableContentData} />
			</div>
		</Box>
	)
}
